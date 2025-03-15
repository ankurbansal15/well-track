export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import dbConnect from "@/lib/mongodb";
import DietPlan from "@/models/DietPlan";
import HealthMetrics from "@/models/HealthMetrics";
import { generateTextToText, generateTextToImage } from "@/lib/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    
    // Get the user's health metrics
    const healthMetrics = await HealthMetrics.findOne(
      { userId: session.user.id },
      {},
      { sort: { recordedAt: -1 } }
    );

    if (!healthMetrics) {
      return NextResponse.json(
        { error: "Health metrics not found" },
        { status: 404 }
      );
    }

    // Calculate daily calories based on health metrics and goals
    const bmr = calculateBMR(
      healthMetrics.weight,
      healthMetrics.height,
      healthMetrics.age,
      healthMetrics.gender
    );
    
    const activityMultiplier = getActivityMultiplier(healthMetrics.activityLevel);
    const maintenanceCalories = Math.round(bmr * activityMultiplier);
    
    // Adjust calories based on goal (weight loss or gain)
    let calorieAdjustment = 0;
    if (body.goalWeight < healthMetrics.weight) {
      // For weight loss, create a deficit
      calorieAdjustment = -500;
    } else if (body.goalWeight > healthMetrics.weight) {
      // For weight gain, create a surplus
      calorieAdjustment = 300;
    }
    
    const dailyCalories = maintenanceCalories + calorieAdjustment;

    // Generate a personalized diet plan using AI
    const prompt = `
      Create a detailed diet plan with the following specifications:
      - Total daily calories: ${dailyCalories} calories
      - Diet type: ${body.dietType}
      - Number of meals: ${body.mealCount}
      - Include snacks: ${body.includeSnacks ? 'Yes' : 'No'}
      - Health conditions: ${healthMetrics.chronicConditions || 'None'}
      - Allergies: ${healthMetrics.allergies || 'None'}
      
      For each meal, provide:
      1. Meal name
      2. Total calories
      3. Macronutrients (protein, carbs, fat in grams)
      4. 2-3 specific food items with portion sizes
      
      Format the response as a JSON object with the structure:
      {
        "meals": [
          {
            "name": "Meal name",
            "calories": number,
            "protein": number,
            "carbs": number,
            "fat": number,
            "foods": [
              {
                "name": "Food item name",
                "portion": "Portion description"
              }
            ]
          }
        ]
      }
    `;

    const aiResponse = await generateTextToText(prompt);
    let dietPlanData;
    
    try {
      // Extract valid JSON from the AI response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : null;
      
      if (!jsonString) {
        throw new Error("No valid JSON found in AI response");
      }
      
      dietPlanData = JSON.parse(jsonString);
      
      // Generate images for food items (limit to first item in each meal to save API calls)
      for (let meal of dietPlanData.meals) {
        if (meal.foods && meal.foods.length > 0) {
          const firstFood = meal.foods[0];
          try {
            const imagePrompt = `High-quality professional food photography of ${firstFood.name}, ${firstFood.portion}, on a clean plate with soft lighting, top-down view, healthy food, appetizing`;
            const imageUrl = await generateTextToImage(imagePrompt, firstFood.name);
            firstFood.imageUrl = imageUrl;
          } catch (imageError) {
            console.error(`Error generating image for ${firstFood.name}:`, imageError);
          }
        }
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      return NextResponse.json(
        { error: "Failed to generate diet plan" },
        { status: 500 }
      );
    }

    // Save the diet plan to the database
    const dietPlan = new DietPlan({
      userId: session.user.id,
      dailyCalories,
      goalWeight: body.goalWeight,
      timeframe: body.timeframe,
      dietType: body.dietType,
      mealCount: body.mealCount,
      includeSnacks: body.includeSnacks,
      meals: dietPlanData.meals
    });

    await dietPlan.save();

    return NextResponse.json({
      message: "Diet plan created successfully",
      dietPlan: {
        id: dietPlan._id,
        dailyCalories: dietPlan.dailyCalories,
        meals: dietPlan.meals
      }
    });
  } catch (error) {
    console.error("Error creating diet plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Get the latest diet plan for the user
    const dietPlan = await DietPlan.findOne(
      { userId: session.user.id },
      {},
      { sort: { createdAt: -1 } }
    );

    if (!dietPlan) {
      return NextResponse.json(null);
    }

    return NextResponse.json(dietPlan);
  } catch (error) {
    console.error("Error fetching diet plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper functions for calculations
function calculateBMR(weight: number, height: number, age: number, gender: string): number {
  // Mifflin-St Jeor Equation
  if (gender.toLowerCase() === 'female') {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  } else {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
}

function getActivityMultiplier(activityLevel: string): number {
  switch (activityLevel.toLowerCase()) {
    case 'sedentary':
      return 1.2;
    case 'light':
      return 1.375;
    case 'moderate':
      return 1.55;
    case 'active':
      return 1.725;
    case 'very active':
      return 1.9;
    default:
      return 1.55; // Default to moderate
  }
}
