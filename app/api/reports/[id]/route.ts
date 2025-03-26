import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import HealthReport from '@/models/HealthReport';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid report ID format' }, { status: 400 });
    }
    
    // Get user ID from session (could be in id or sub property)
    const userId = session.user.id || (session.user as any).sub;
    
    if (!userId) {
      console.error('No user ID found in session:', session);
      return NextResponse.json({ error: 'User ID not found in session' }, { status: 401 });
    }
    
    // Find the report
    const report = await HealthReport.findOne({
      _id: params.id,
      userId: userId
    });
    
    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }
    
    return NextResponse.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json(
      { error: 'Failed to fetch report details' },
      { status: 500 }
    );
  }
}
