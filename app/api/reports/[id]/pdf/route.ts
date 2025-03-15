import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import dbConnect from "@/lib/mongodb";
import Report from "@/models/Report";
import mongoose from "mongoose";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { format } from "date-fns";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid report ID' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    await dbConnect();
    
    // Find the report
    const report = await Report.findById(params.id);
    
    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }
    
    // Verify that the user owns this report
    if (report.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    
    // Generate PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 12;
    
    // Add fonts
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Add title
    page.drawText('WellTrack Health Report', {
      x: 50,
      y: height - 50,
      size: 24,
      font: helveticaBold,
      color: rgb(0, 0, 0.8),
    });
    
    // Add generation date
    page.drawText(`Generated: ${format(new Date(report.generatedAt), 'PPP')}`, {
      x: 50,
      y: height - 80,
      size: fontSize,
      font: helveticaFont,
      color: rgb(0.4, 0.4, 0.4),
    });
    
    // Add summary
    if (report.summary) {
      page.drawText('Summary:', {
        x: 50,
        y: height - 120,
        size: fontSize + 4,
        font: helveticaBold,
        color: rgb(0, 0, 0),
      });
      
      page.drawText(report.summary, {
        x: 50,
        y: height - 140,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0, 0, 0),
        maxWidth: width - 100,
        lineHeight: fontSize * 1.2,
      });
    }
    
    // Add health score
    page.drawText('Health Score:', {
      x: 50,
      y: height - 200,
      size: fontSize + 2,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    });
    
    page.drawText(`${report.healthScore}/100 - ${getScoreCategory(report.healthScore)}`, {
      x: 150,
      y: height - 200,
      size: fontSize,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    
    // Add BMI
    if (report.bmi) {
      page.drawText('BMI:', {
        x: 50,
        y: height - 220,
        size: fontSize + 2,
        font: helveticaBold,
        color: rgb(0, 0, 0),
      });
      
      page.drawText(`${report.bmi} - ${getBMICategory(report.bmi)}`, {
        x: 150,
        y: height - 220,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
    }
    
    // Add activity level
    page.drawText('Activity Level:', {
      x: 50,
      y: height - 240,
      size: fontSize + 2,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    });
    
    page.drawText(report.activityLevel, {
      x: 150,
      y: height - 240,
      size: fontSize,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    
    // Add risk level
    page.drawText('Health Risk:', {
      x: 50,
      y: height - 260,
      size: fontSize + 2,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    });
    
    page.drawText(report.riskLevel, {
      x: 150,
      y: height - 260,
      size: fontSize,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    
    // Add note about predictions
    if (report.predictions && report.predictions.length > 0) {
      page.drawText('Top Health Prediction:', {
        x: 50,
        y: height - 300,
        size: fontSize + 2,
        font: helveticaBold,
        color: rgb(0, 0, 0),
      });
      
      const prediction = report.predictions[0];
      
      page.drawText(prediction.title, {
        x: 50,
        y: height - 320,
        size: fontSize,
        font: helveticaBold,
        color: rgb(0, 0, 0),
      });
      
      page.drawText(prediction.prediction, {
        x: 50,
        y: height - 340,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0, 0, 0),
        maxWidth: width - 100,
        lineHeight: fontSize * 1.2,
      });
      
      page.drawText(`Recommendation: ${prediction.recommendation}`, {
        x: 50,
        y: height - 380,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0, 0, 0),
        maxWidth: width - 100,
        lineHeight: fontSize * 1.2,
      });
    }
    
    // Add footer
    page.drawText('This report is generated by WellTrack health monitoring system.', {
      x: 50,
      y: 50,
      size: 10,
      font: helveticaFont,
      color: rgb(0.4, 0.4, 0.4),
    });
    
    page.drawText('For medical advice, please consult with a healthcare professional.', {
      x: 50,
      y: 35,
      size: 10,
      font: helveticaFont,
      color: rgb(0.4, 0.4, 0.4),
    });
    
    // Serialize the PDF to bytes
    const pdfBytes = await pdfDoc.save();
    
    // Create a response with the PDF
    const response = new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="WellTrack-Health-Report-${format(new Date(report.generatedAt), 'yyyy-MM-dd')}.pdf"`,
      },
    });
    
    return response;
  } catch (error) {
    console.error("Error generating PDF report:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF report" },
      { status: 500 }
    );
  }
}

// Helper function to get health score category
function getScoreCategory(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Fair";
  return "Needs Improvement";
}

// Helper function to get BMI category
function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
}
