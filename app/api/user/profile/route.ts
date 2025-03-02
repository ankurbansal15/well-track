import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import UserProfile from '@/models/UserProfile';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    
    const userProfile = await UserProfile.findOne({ userId: session.user.id });
    
    if (!userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      id: userProfile._id,
      displayName: userProfile.displayName,
      email: userProfile.email,
      initialHealthDataSubmitted: userProfile.initialHealthDataSubmitted,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await req.json();
    
    await dbConnect();
    
    const userProfile = await UserProfile.findOneAndUpdate(
      { userId: session.user.id },
      { $set: data },
      { new: true }
    );
    
    if (!userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      id: userProfile._id,
      displayName: userProfile.displayName,
      email: userProfile.email,
      initialHealthDataSubmitted: userProfile.initialHealthDataSubmitted,
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 