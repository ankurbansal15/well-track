export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import HealthMetrics from '@/models/HealthMetrics';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
      id: healthMetrics._id,
      userId: healthMetrics.userId,
      height: healthMetrics.height,
      weight: healthMetrics.weight,
      age: healthMetrics.age,
      gender: healthMetrics.gender,
      activityLevel: healthMetrics.activityLevel,
      bloodPressure: healthMetrics.bloodPressure,
      heartRate: healthMetrics.heartRate,
      sleepDuration: healthMetrics.sleepDuration,
      stressLevel: healthMetrics.stressLevel,
      recordedAt: healthMetrics.recordedAt,
    });
  } catch (error) {
    console.error('Error fetching health metrics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 