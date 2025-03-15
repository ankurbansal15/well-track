import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

interface HealthCardData {
  personalInfo: {
    fullName: string;
    dateOfBirth: string;
    bloodType: string;
    email: string;
    phone: string;
    emergencyContact: string;
    emergencyPhone: string;
    gender: string;
    age: number;
  };
  medicalConditions: {
    allergies: string[];
    chronicConditions: string[];
    medications: string[];
    surgeries: string[];
  };
  vitalSigns: {
    bloodPressure: string;
    heartRate: number;
    height: number;
    weight: number;
    temperature: number;
    respiratoryRate: number;
  };
  vaccinations: {
    name: string;
    date: string;
    provider: string;
    type: string;
    notes?: string;
  }[];
  updatedAt: string;
}

// Function to generate PDF from health card data
export async function generatePDF(data: HealthCardData): Promise<void> {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(22);
  doc.setTextColor(0, 0, 128);
  doc.text('Digital Health Card', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${format(new Date(), 'MMMM d, yyyy')}`, 105, 28, { align: 'center' });
  
  // Personal Information section
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Personal Information', 20, 40);
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  let y = 50;
  
  // Function to add a field to the PDF
  const addField = (label: string, value: string) => {
    doc.setFont('Helvetica', 'bold');
    doc.text(`${label}:`, 20, y);
    doc.setFont('Helvetica', 'normal');
    doc.text(value || 'Not provided', 70, y);
    y += 7;
  };
  
  // Add personal information
  addField('Full Name', data.personalInfo.fullName);
  addField('Date of Birth', formatDate(data.personalInfo.dateOfBirth));
  addField('Gender', data.personalInfo.gender);
  addField('Blood Type', data.personalInfo.bloodType);
  addField('Phone', data.personalInfo.phone);
  addField('Email', data.personalInfo.email);
  addField('Emergency Contact', `${data.personalInfo.emergencyContact} ${data.personalInfo.emergencyPhone ? `- ${data.personalInfo.emergencyPhone}` : ''}`);
  
  y += 5;
  
  // Medical Conditions section
  doc.setFontSize(16);
  doc.text('Medical Conditions', 20, y);
  y += 10;
  
  doc.setFontSize(10);
  
  // Add medical conditions
  addField('Allergies', data.medicalConditions.allergies.join(', ') || 'None reported');
  addField('Chronic Conditions', data.medicalConditions.chronicConditions.join(', ') || 'None reported');
  addField('Current Medications', data.medicalConditions.medications.join(', ') || 'None reported');
  addField('Past Surgeries', data.medicalConditions.surgeries.join(', ') || 'None reported');
  
  y += 5;
  
  // Vital Signs section
  doc.setFontSize(16);
  doc.text('Vital Signs', 20, y);
  y += 10;
  
  doc.setFontSize(10);
  
  // Add vital signs
  addField('Blood Pressure', data.vitalSigns.bloodPressure || 'Not recorded');
  addField('Heart Rate', data.vitalSigns.heartRate ? `${data.vitalSigns.heartRate} bpm` : 'Not recorded');
  addField('Height', data.vitalSigns.height ? `${data.vitalSigns.height} cm` : 'Not recorded');
  addField('Weight', data.vitalSigns.weight ? `${data.vitalSigns.weight} kg` : 'Not recorded');
  
  if (data.vitalSigns.temperature) {
    addField('Temperature', `${data.vitalSigns.temperature} °C`);
  }
  
  if (data.vitalSigns.respiratoryRate) {
    addField('Respiratory Rate', `${data.vitalSigns.respiratoryRate} breaths/min`);
  }
  
  y += 5;
  
  // Vaccination History section
  if (y > 230) {
    // Add a new page if we're running out of space
    doc.addPage();
    y = 20;
  }
  
  doc.setFontSize(16);
  doc.text('Vaccination History', 20, y);
  y += 10;
  
  doc.setFontSize(10);
  
  if (data.vaccinations.length === 0) {
    doc.text('No vaccination records found.', 20, y);
  } else {
    data.vaccinations.forEach((vaccine, index) => {
      if (y > 260) {
        // Add a new page if we're running out of space
        doc.addPage();
        y = 20;
        
        doc.setFontSize(16);
        doc.text('Vaccination History (continued)', 20, y);
        y += 10;
        doc.setFontSize(10);
      }
      
      doc.setFont('Helvetica', 'bold');
      doc.text(`${index + 1}. ${vaccine.name}`, 20, y);
      y += 6;
      
      doc.setFont('Helvetica', 'normal');
      doc.text(`Date: ${formatDate(vaccine.date)}`, 25, y);
      y += 5;
      
      doc.text(`Provider: ${vaccine.provider}`, 25, y);
      y += 5;
      
      doc.text(`Type: ${vaccine.type}`, 25, y);
      y += 5;
      
      if (vaccine.notes) {
        doc.text(`Notes: ${vaccine.notes}`, 25, y);
        y += 5;
      }
      
      y += 5;
    });
  }
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Last updated: ${formatDate(data.updatedAt)} - Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
    doc.text('This document is for informational purposes only and does not replace medical records.', 105, 295, { align: 'center' });
  }
  
  // Save the PDF
  doc.save(`health_card_${data.personalInfo.fullName.replace(/\s+/g, '_').toLowerCase()}.pdf`);
}

// Function to share health card data
export async function shareHealthCard(data: HealthCardData): Promise<void> {
  // Generate PDF first
  const doc = new jsPDF();
  
  // Add content (simplified version of the PDF generation)
  doc.setFontSize(22);
  doc.text('Digital Health Card', 105, 20, { align: 'center' });
  doc.setFontSize(14);
  doc.text(`${data.personalInfo.fullName}`, 105, 30, { align: 'center' });
  doc.setFontSize(10);
  doc.text(`Last updated: ${formatDate(data.updatedAt)}`, 105, 38, { align: 'center' });
  
  // Create a blob from the PDF document
  const pdfBlob = doc.output('blob');
  const file = new File([pdfBlob], `health_card_${data.personalInfo.fullName.replace(/\s+/g, '_').toLowerCase()}.pdf`, { type: 'application/pdf' });
  
  // Use the Web Share API if available
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'My Digital Health Card',
        text: 'Here is my digital health card information',
        files: [file]
      });
      return;
    } catch (error) {
      console.log('Error sharing:', error);
      // Fall back to download if sharing fails
    }
  }
  
  // If Web Share API is not available or fails, fall back to download
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `health_card_${data.personalInfo.fullName.replace(/\s+/g, '_').toLowerCase()}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}

// Helper function to format dates
function formatDate(dateString: string): string {
  try {
    return format(new Date(dateString), 'MMMM d, yyyy');
  } catch (e) {
    return "Unknown date";
  }
}
