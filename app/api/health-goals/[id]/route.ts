import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import HealthGoal from '@/models/HealthGoal';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    await dbConnect();

    const id = params.id;
    const userId = session.user.id;

    const healthGoal = await HealthGoal.findOne({ 
      _id: id,
      user: userId 
    });

    if (!healthGoal) {
      return NextResponse.json(
        { success: false, message: 'Health goal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: healthGoal });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 400 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    await dbConnect();
    
    const id = params.id;
    const userId = session.user.id;
    const body = await req.json();

    const healthGoal = await HealthGoal.findOneAndUpdate(
      { _id: id, user: userId },
      body,
      { new: true, runValidators: true }
    );

    if (!healthGoal) {
      return NextResponse.json(
        { success: false, message: 'Health goal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: healthGoal });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    await dbConnect();

    const id = params.id;
    const userId = session.user.id;

    const deletedHealthGoal = await HealthGoal.findOneAndDelete({ 
      _id: id,
      user: userId 
    });

    if (!deletedHealthGoal) {
      return NextResponse.json(
        { success: false, message: 'Health goal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 400 }
    );
  }
}
