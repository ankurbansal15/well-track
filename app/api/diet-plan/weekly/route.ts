export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import dbConnect from "@/lib/mongodb";
import DietPlan from "@/models/DietPlan";
import { generateTextToTextServer, generateTextToImageServer } from "@/lib/server-generative-ai";
import { startOfWeek, addDays, format } from "date-fns";

// Update the GET function to improve handling of the weekly plan retrieval and regeneration
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Get the latest diet plan for the user
    const basePlan = await DietPlan.findOne(
      { userId: session.user.id, isWeeklyPlan: { $ne: true } }, // Exclude weekly plans
      {},
      { sort: { createdAt: -1 } }
    );

    if (!basePlan) {
      return NextResponse.json({ error: "No base diet plan found" }, { status: 404 });
    }
    
    // Check if we need to generate the weekly plan
    const url = new URL(req.url);
    const regenerate = url.searchParams.get('regenerate') === 'true';
    
    // Try to find an existing weekly plan based on the latest base plan
    let weeklyPlan = await DietPlan.findOne(
      { 
        userId: session.user.id,
        isWeeklyPlan: true,
        baseOnPlanId: basePlan._id 
      },
      {},
      { sort: { createdAt: -1 } }
    );
    
    // If we need to regenerate or no weekly plan exists
    if (regenerate || !weeklyPlan) {
      try {
        // Generate a weekly plan using AI
        weeklyPlan = await generateWeeklyPlan(session.user.id, basePlan);
      } catch (generateError) {
        console.error("Error generating weekly plan:", generateError);
        return NextResponse.json(
          { error: "Failed to generate weekly meal plan. Please try again." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(weeklyPlan);
  } catch (error) {
    console.error("Error fetching weekly diet plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function generateWeeklyPlan(userId: string, basePlan: any) {
  // Create a weekly date range starting from Monday
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  
  // List of meal varieties to ensure diverse meals
  const mealVarieties = {
    breakfast: ["oatmeal", "eggs", "smoothie", "yogurt", "toast", "pancakes", "cereal"],
    lunch: ["salad", "sandwich", "soup", "wrap", "bowl", "pasta", "stir fry"],
    dinner: ["fish", "chicken", "vegetarian", "beef", "pasta", "rice dish", "roasted vegetables"]
  };
  
  // Generate a weekly plan based on the base diet plan
  const prompt = `
    Create a 7-day meal plan based on the following diet requirements:
    - Diet type: ${basePlan.dietType || 'balanced'}
    - Daily calories: ${basePlan.dailyCalories} calories
    - Number of meals per day: 3 (breakfast, lunch, dinner)
    
    For each day (Monday through Sunday), provide specific meal suggestions with:
    1. Food items with portion sizes
    2. Calories per meal
    
    Ensure variety throughout the week and maintain the daily calorie target.
    
    Format the response as a structured JSON with this format:
    {
      "weeklyPlan": [
        {
          "day": "Monday",
          "meals": {
            "breakfast": {
              "name": "Breakfast",
              "calories": 400,
              "foods": [
                {"name": "Food item", "portion": "Portion size"}
              ]
            },
            "lunch": {
              "name": "Lunch",
              "calories": 600,
              "foods": [
                {"name": "Food item", "portion": "Portion size"}
              ]
            },
            "dinner": {
              "name": "Dinner",
              "calories": 500,
              "foods": [
                {"name": "Food item", "portion": "Portion size"}
              ]
            }
          }
        }
        // Repeat for all 7 days
      ]
    }
  `;

  // Get AI response
  const aiResponse = await generateTextToTextServer(prompt);
  let weeklyPlanData;
  
  try {
    // Extract JSON from response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : null;
    
    if (!jsonString) {
      throw new Error("No valid JSON found in AI response");
    }
    
    weeklyPlanData = JSON.parse(jsonString);
    
    // Generate images for one food item per meal
    for (const dayPlan of weeklyPlanData.weeklyPlan) {
      for (const mealType of ['breakfast', 'lunch', 'dinner']) {
        const meal = dayPlan.meals[mealType];
        if (meal && meal.foods && meal.foods.length > 0) {
          const firstFood = meal.foods[0];
          try {
            const imagePrompt = `High-quality professional food photography of ${firstFood.name}, ${firstFood.portion}, on a clean plate with soft lighting, top-down view, healthy food, appetizing`;
            const imageUrl = await generateTextToImageServer(imagePrompt, firstFood.name);
            firstFood.imageUrl = imageUrl;
          } catch (imageError) {
            console.error(`Error generating image for ${firstFood.name}:`, imageError);
          }
        }
      }
    }
    
    // Calculate macros (protein, carbs, fat) for each meal
    // This is just an approximation since we don't have detailed food nutrition data
    for (const dayPlan of weeklyPlanData.weeklyPlan) {
      for (const mealType of ['breakfast', 'lunch', 'dinner']) {
        const meal = dayPlan.meals[mealType];
        if (meal) {
          // For breakfast: higher carbs, moderate protein, lower fat
          if (mealType === 'breakfast') {
            meal.protein = Math.round((meal.calories * 0.2) / 4); // 20% protein
            meal.carbs = Math.round((meal.calories * 0.6) / 4);   // 60% carbs
            meal.fat = Math.round((meal.calories * 0.2) / 9);     // 20% fat
          }
          // For lunch: balanced macros
          else if (mealType === 'lunch') {
            meal.protein = Math.round((meal.calories * 0.3) / 4); // 30% protein
            meal.carbs = Math.round((meal.calories * 0.4) / 4);   // 40% carbs
            meal.fat = Math.round((meal.calories * 0.3) / 9);     // 30% fat
          }
          // For dinner: higher protein, moderate fat, lower carbs
          else if (mealType === 'dinner') {
            meal.protein = Math.round((meal.calories * 0.4) / 4); // 40% protein
            meal.carbs = Math.round((meal.calories * 0.3) / 4);   // 30% carbs
            meal.fat = Math.round((meal.calories * 0.3) / 9);     // 30% fat
          }
        }
      }
    }
    
    // Create the weekly plan document in the database
    const weeklyPlan = new DietPlan({
      userId: userId,
      dailyCalories: basePlan.dailyCalories,
      goalWeight: basePlan.goalWeight,
      timeframe: basePlan.timeframe,
      dietType: basePlan.dietType,
      mealCount: 3,
      includeSnacks: false,
      isWeeklyPlan: true,
      baseOnPlanId: basePlan._id,
      weeklyPlanData: weeklyPlanData.weeklyPlan,
      weekStartDate: startDate
    });

    await weeklyPlan.save();
    return weeklyPlan;
    
  } catch (parseError) {
    console.error("Error parsing AI response for weekly plan:", parseError);
    throw new Error("Failed to generate weekly diet plan");
  }
}
