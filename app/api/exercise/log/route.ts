import { NextRequest, NextResponse } from "next/server";
import Exercise from "@/models/Exercise";
import dbConnect from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import mongoose from "mongoose";
import { authOptions } from '@/lib/auth';
export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        
        // Check authentication
        const session = await getServerSession(authOptions);
        
        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
        
        // Get user ID from session
        const userId = session.user.id;
        
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json(
                { error: "Invalid user ID" },
                { status: 400 }
            );
        }
        
        // Get exercise data from request body
        const { name, category, sets, reps, caloriesBurned, imageUrl } = await request.json();
        
        if (!name || !sets || !reps || !caloriesBurned) {
            return NextResponse.json(
                { error: "Missing required exercise data" },
                { status: 400 }
            );
        }
        
        // Create a new exercise record
        const exercise = await Exercise.create({
            userId: new mongoose.Types.ObjectId(userId),
            name,
            category: category || "other",
            sets,
            reps, 
            caloriesBurned,
            imageUrl,
            date: new Date()
        });
        
        return NextResponse.json({
            success: true,
            exercise: {
                id: exercise._id,
                name: exercise.name,
                caloriesBurned: exercise.caloriesBurned,
                date: exercise.date
            }
        });
    } catch (error) {
        console.error("Error saving exercise:", error);
        return NextResponse.json(
            { error: "Failed to save exercise data" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        
        // Check authentication
        const session = await getServerSession(authOptions);
        
        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
        
        // Get user ID from session
        const userId = session.user.id;
        
        // Get exercises for this user
        const exercises = await Exercise.find({ userId: userId })
            .sort({ date: -1 })
            .limit(10);
        
        return NextResponse.json({
            success: true,
            logs: exercises.map(ex => ({
                _id: ex._id,
                name: ex.name,
                category: ex.category,
                sets: ex.sets,
                reps: ex.reps,
                caloriesBurned: ex.caloriesBurned,
                date: ex.date,
                imageUrl: ex.imageUrl
            }))
        });
    } catch (error) {
        console.error("Error fetching exercises:", error);
        return NextResponse.json(
            { error: "Failed to fetch exercise data" },
            { status: 500 }
        );
    }
}
