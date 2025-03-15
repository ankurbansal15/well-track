import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import FoodEntry from '@/models/FoodEntry';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || 'today';
  
  try {
    // Get user ID from auth session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    await dbConnect();
    
    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date(now);
    
    switch(period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'today':
      default:
        startDate.setHours(0, 0, 0, 0); // Beginning of today
        now.setHours(23, 59, 59, 999); // End of today
    }
    
    // Query for food entries in the given period
    const entries = await FoodEntry.find({
      userId: userId,
      recorded_at: {
        $gte: startDate,
        $lte: now
      }
    }).lean();
    
    // Calculate summary for the tracking page
    const summary = {
      calories: 0,
      protein_g: 0,
      carbs_g: 0,
      fats_g: 0,
      entryCount: entries.length,
      period: period
    };
    
    // Sum up the nutritional data
    entries.forEach(entry => {
      summary.calories += entry.calories || 0;
      summary.protein_g += entry.protein_g || 0;
      summary.carbs_g += entry.carbs_g || 0;
      summary.fats_g += entry.fats_g || 0;
    });
    
    return NextResponse.json(summary);
    
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch nutrition data',
      calories: 0,
      protein_g: 0,
      carbs_g: 0,
      fats_g: 0
    }, { status: 500 });
  }
}
