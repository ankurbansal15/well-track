import { NextResponse } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/mongodb';
import FoodEntry from '@/models/FoodEntry';
import { storeImage } from '@/utils/uploadImage';
import { updateHistoryOnNewEntry } from '@/utils/updateDailyHistory';

// Validation schema for food entry
const foodEntrySchema = z.object({
  userId: z.string(),
  food_name: z.string().min(1),
  calories: z.number().nonnegative(),
  protein_g: z.number().nonnegative(),
  carbs_g: z.number().nonnegative(),
  fats_g: z.number().nonnegative(),
  protein_percent: z.number().nonnegative().optional(),
  carbs_percent: z.number().nonnegative().optional(),
  fats_percent: z.number().nonnegative().optional(),
  image_url: z.string().optional(),
  ai_analysis_result: z.string().optional(),
});

// GET handler - fetch food entries
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }
  
  try {
    await dbConnect();
    
    // Build query
    const query: any = { userId };
    
    // Apply date filters if provided
    if (startDate || endDate) {
      query.recorded_at = {};
      if (startDate) query.recorded_at.$gte = new Date(startDate);
      if (endDate) query.recorded_at.$lte = new Date(endDate);
    }
    
    // Get entries, sorted by date (newest first)
    const entries = await FoodEntry.find(query)
      .sort({ recorded_at: -1 })
      .limit(100) // Limit to prevent excessive data return
      .lean(); // Convert to plain objects for better performance
    
    return NextResponse.json(entries);
    
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch food entries' }, { status: 500 });
  }
}

// POST handler - create a new food entry
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const result = foodEntrySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues }, { status: 400 });
    }
    
    await dbConnect();
    
    // Process image if available
    let imageUrl = result.data.image_url;
    if (imageUrl && imageUrl.startsWith('data:image')) {
      // Store the image data
      imageUrl = await storeImage(imageUrl);
    }
    
    // Create new entry
    const newEntry = new FoodEntry({
      ...result.data,
      // Provide default values for optional percentage fields
      protein_percent: result.data.protein_percent ?? 0,
      carbs_percent: result.data.carbs_percent ?? 0,
      fats_percent: result.data.fats_percent ?? 0,
      image_url: imageUrl,
      recorded_at: new Date()
    });
    
    // Save to database
    await newEntry.save();
    
    // Update the daily history
    await updateHistoryOnNewEntry(newEntry);
    
    return NextResponse.json(newEntry.toObject(), { status: 201 });
  } catch (error) {
    console.error('Error saving food entry:', error);
    return NextResponse.json({ error: 'Failed to save food entry' }, { status: 500 });
  }
}
