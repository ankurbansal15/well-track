import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import HealthGoal from '@/models/HealthGoal';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    await dbConnect();

    // Get the user ID from the session
    const userId = session.user.id;
    
    // Fetch all health goals for the user
    const healthGoals = await HealthGoal.find({ user: userId });
    
    return NextResponse.json({ success: true, data: healthGoals });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    await dbConnect();

    // Get the user ID from the session
    const userId = session.user.id;
    
    // Get the request body
    const body = await req.json();
    
    // Add the user ID to the request body
    const goalData = { ...body, user: userId };
    
    // Create a new health goal
    const healthGoal = await HealthGoal.create(goalData);
    
    return NextResponse.json(
      { success: true, data: healthGoal },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
