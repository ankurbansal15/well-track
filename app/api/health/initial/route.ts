import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import UserProfile from '@/models/UserProfile';
import HealthMetrics from '@/models/HealthMetrics';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const healthData = await req.json();
    
    await dbConnect();
    
    // Create health metrics record
    const healthMetrics = await HealthMetrics.create({
      userId: session.user.id,
      ...healthData,
      recordedAt: new Date(),
    });
    
    // Update user profile to mark initial health data as submitted
    const userProfile = await UserProfile.findOneAndUpdate(
      { userId: session.user.id },
      { initialHealthDataSubmitted: true },
      { new: true }
    );
    
    if (!userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      healthMetrics,
      initialHealthDataSubmitted: true
    });
  } catch (error) {
    console.error('Error saving initial health data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 