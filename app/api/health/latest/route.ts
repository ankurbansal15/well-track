export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import HealthMetrics from "@/models/HealthMetrics";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const healthMetrics = await HealthMetrics.findOne(
      { userId: session.user.id },
      {},
      { sort: { recordedAt: -1 } }
    );

    if (!healthMetrics) {
      return NextResponse.json(null);
    }

    return NextResponse.json({
      userId: healthMetrics.userId,
      height: healthMetrics.height,
      weight: healthMetrics.weight,
      age: healthMetrics.age,
      gender: healthMetrics.gender,
      dateOfBirth: healthMetrics.dateOfBirth,
      email: healthMetrics.email,
      phone: healthMetrics.phone,
      emergencyContact: healthMetrics.emergencyContact,
      emergencyPhone: healthMetrics.emergencyPhone,
      activityLevel: healthMetrics.activityLevel,
      smokingStatus: healthMetrics.smokingStatus,
      dietType: healthMetrics.dietType,
      bloodPressure: healthMetrics.bloodPressure,
      heartRate: healthMetrics.heartRate,
      respiratoryRate: healthMetrics.respiratoryRate,
      temperature: healthMetrics.temperature,
      sleepDuration: healthMetrics.sleepDuration,
      stressLevel: healthMetrics.stressLevel,
      chronicConditions: healthMetrics.chronicConditions,
      allergies: healthMetrics.allergies,
      medications: healthMetrics.medications,
      familyHistory: healthMetrics.familyHistory,
      surgeries: healthMetrics.surgeries,
      fitnessGoals: healthMetrics.fitnessGoals,
      recordedAt: healthMetrics.recordedAt,
    });
  } catch (error) {
    console.error("Error fetching health metrics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
