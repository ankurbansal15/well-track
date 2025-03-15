import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import dbConnect from "@/lib/mongodb";
import Report from "@/models/Report";
import HealthMetrics from "@/models/HealthMetrics";
import HealthMetricsHistory from "@/models/HealthMetricsHistory";
import Sleep from "@/models/Sleep";
import FoodEntry from "@/models/FoodEntry";
import { format, subDays, subMonths, parseISO, formatDistanceToNow } from "date-fns";
import { 
  generateVitalSignsWithAI, 
  generateNutritionAdviceWithAI,
  generateHealthPredictionsWithAI,
  AvailableHealthData
} from '@/lib/ai-report-helper';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const regenerate = searchParams.get('regenerate') === 'true';

    // If not regenerating, try to fetch the latest report
    if (!regenerate) {
      const latestReport = await Report.findOne({ 
        userId: session.user.id 
      }).sort({ generatedAt: -1 });
      
      if (latestReport) {
        return NextResponse.json(latestReport);
      }
    }
    
    // If no report found or regenerate is true, create a new report
    const report = await generateHealthReport(session.user.id);
    return NextResponse.json(report);
  } catch (error) {
    console.error("Error in reports API:", error);
    return NextResponse.json(
      { error: "Failed to fetch or generate report" },
      { status: 500 }
    );
  }
}

async function generateHealthReport(userId: string) {
  // Fetch user health metrics
  const healthMetrics = await HealthMetrics.findOne({ userId }).sort({ recordedAt: -1 });
  
  // Get historical health data
  const healthHistory = await HealthMetricsHistory.find({ userId })
    .sort({ recordedAt: -1 })
    .limit(6);
  
  // Get sleep data
  const sleepData = await Sleep.find({ userId })
    .sort({ date: -1 })
    .limit(30);
  
  // Calculate BMI if height and weight are available
  let bmi;
  if (healthMetrics?.height && healthMetrics?.weight) {
    // BMI = weight(kg) / (height(m))²
    const heightInMeters = healthMetrics.height / 100; // Convert cm to meters
    bmi = parseFloat((healthMetrics.weight / (heightInMeters * heightInMeters)).toFixed(1));
  }

  // Track which data is AI-generated
  const aiGenerated = {
    vitalSigns: false,
    nutritionAdvice: false,
    predictions: false,
    activityData: false,
    nutritionTrends: false
  };

  // Aggregate available data for AI processing
  const availableHealthData: AvailableHealthData = {
    healthMetrics: healthMetrics ? {
      height: healthMetrics.height,
      weight: healthMetrics.weight,
      age: healthMetrics.age,
      gender: healthMetrics.gender,
      bloodPressure: healthMetrics.bloodPressure,
      heartRate: healthMetrics.heartRate
    } : undefined,
    sleepData: sleepData.map(record => ({
      date: record.date,
      duration: record.duration,
      quality: record.quality
    }))
  };
  
  // Get nutrition data
  const startDate = subDays(new Date(), 30);
  const foodEntries = await FoodEntry.find({
    userId,
    recorded_at: { $gte: startDate }
  });
  
  if (foodEntries.length > 0) {
    // Calculate average nutrition values
    const totalCalories = foodEntries.reduce((sum, entry) => sum + (entry.calories || 0), 0);
    const totalProtein = foodEntries.reduce((sum, entry) => sum + (entry.protein_g || 0), 0);
    const totalCarbs = foodEntries.reduce((sum, entry) => sum + (entry.carbs_g || 0), 0);
    const totalFats = foodEntries.reduce((sum, entry) => sum + (entry.fats_g || 0), 0);
    
    const daysCount = Math.max(1, foodEntries.length);
    
    availableHealthData.nutritionData = {
      calories: Math.round(totalCalories / daysCount),
      protein_g: Math.round(totalProtein / daysCount),
      carbs_g: Math.round(totalCarbs / daysCount),
      fats_g: Math.round(totalFats / daysCount)
    };
  }

  // Calculate health score (example algorithm)
  const healthScore = calculateHealthScore(healthMetrics, sleepData, bmi);
  
  // Determine activity level based on age and other metrics
  const activityLevel = determineActivityLevel(healthMetrics, sleepData);
  
  // Determine risk level
  const riskLevel = determineRiskLevel(healthMetrics, bmi, sleepData);

  // Create nutrition trends data for chart
  const nutritionTrends = await generateNutritionData(userId);
  if (!foodEntries.length || foodEntries.length < 10) {
    aiGenerated.nutritionTrends = true;
  }

  // Generate vital signs data - use AI if we don't have enough real data
  let vitalSigns;
  if (healthHistory.length >= 5) {
    vitalSigns = await generateVitalSignsWithAI(availableHealthData);
  } else {
    // Use AI to generate vital signs based on available data
    const aiVitalSigns = await generateVitalSignsWithAI(availableHealthData);
    vitalSigns = [
      {
        title: "Blood Pressure",
        current: aiVitalSigns.bloodPressure.current,
        trend: aiVitalSigns.bloodPressure.trend,
        lastMeasured: aiVitalSigns.bloodPressure.lastMeasured,
        chartData: aiVitalSigns.bloodPressure.chartData
      },
      {
        title: "Heart Rate",
        current: aiVitalSigns.heartRate.current,
        trend: aiVitalSigns.heartRate.trend,
        lastMeasured: aiVitalSigns.heartRate.lastMeasured,
        chartData: aiVitalSigns.heartRate.chartData
      },
      {
        title: "Body Temperature",
        current: aiVitalSigns.temperature.current,
        trend: aiVitalSigns.temperature.trend,
        lastMeasured: aiVitalSigns.temperature.lastMeasured
      },
      {
        title: "Respiratory Rate",
        current: aiVitalSigns.respiratoryRate.current,
        trend: aiVitalSigns.respiratoryRate.trend,
        lastMeasured: aiVitalSigns.respiratoryRate.lastMeasured
      }
    ];
    aiGenerated.vitalSigns = true;
  }

  // Generate activity data
  const activityData = await generateActivityData(userId);
  // If we don't have real activity tracking data, mark as AI-generated
  aiGenerated.activityData = true; // This could be made conditional if you have an Activity model

  // Generate nutrition data
  const nutritionData = await generateNutritionData(userId);

  // Generate nutrition advice using AI for personalization
  const nutritionAdvice = await generateNutritionAdviceWithAI(availableHealthData, healthScore);
  aiGenerated.nutritionAdvice = true; // Always AI-generated as it's personalized advice

  // Generate health predictions using AI for more personalized insights
  const predictions = await generateHealthPredictionsWithAI(availableHealthData, healthScore);
  aiGenerated.predictions = true; // Always AI-generated as they're future predictions

  // Create a summary of the report
  const summary = generateSummary(healthScore, activityLevel, bmi, riskLevel);

  // Create and save the new report
  const newReport = new Report({
    userId,
    generatedAt: new Date(),
    summary,
    healthScore,
    activityLevel,
    bmi,
    riskLevel,
    healthMetrics: {
      height: healthMetrics?.height,
      weight: healthMetrics?.weight,
      age: healthMetrics?.age,
      gender: healthMetrics?.gender
    },
    nutritionTrends,
    vitalSigns,
    activityData,
    nutritionData,
    nutritionAdvice,
    predictions,
    aiGenerated // Include which data was AI-generated
  });

  await newReport.save();
  return newReport;
}

function calculateHealthScore(healthMetrics: any, sleepData: any[], bmi: number | undefined) {
  let score = 0;

  // Example scoring algorithm
  if (healthMetrics) {
    if (healthMetrics.bloodPressure) {
      const [systolic, diastolic] = healthMetrics.bloodPressure.split('/').map(Number);
      if (systolic < 120 && diastolic < 80) {
        score += 20;
      } else if (systolic < 130 && diastolic < 85) {
        score += 15;
      } else {
        score += 10;
      }
    }

    if (healthMetrics.heartRate) {
      if (healthMetrics.heartRate >= 60 && healthMetrics.heartRate <= 100) {
        score += 20;
      } else {
        score += 10;
      }
    }
  }

  if (bmi !== undefined) {
    if (bmi >= 18.5 && bmi <= 24.9) {
      score += 20;
    } else if (bmi >= 25 && bmi <= 29.9) {
      score += 10;
    } else {
      score += 5;
    }
  }

  const averageSleepQuality = sleepData.reduce((sum, record) => sum + record.quality, 0) / sleepData.length;
  if (averageSleepQuality >= 4) {
    score += 20;
  } else if (averageSleepQuality >= 2) {
    score += 10;
  } else {
    score += 5;
  }

  return score;
}

async function generateActivityData(userId: string) {
  // Fetch activity data for the user
  const activityData = {
    steps: 6892,
    distance: 4.2,
    activeMinutes: 45,
    caloriesBurned: 384,
    
    // Hourly breakdown
    timeline: [
      { time: '06:00', steps: 200, activeMinutes: 5 },
      { time: '08:00', steps: 1200, activeMinutes: 15 },
      { time: '10:00', steps: 2000, activeMinutes: 10 },
      { time: '12:00', steps: 3500, activeMinutes: 20 },
      { time: '14:00', steps: 4200, activeMinutes: 15 },
      { time: '16:00', steps: 5300, activeMinutes: 25 },
      { time: '18:00', steps: 6200, activeMinutes: 30 },
      { time: '20:00', steps: 6800, activeMinutes: 15 },
      { time: '22:00', steps: 6900, activeMinutes: 5 },
    ]
  }; // This could be replaced with actual activity data from a model

  // If no activity data is found, return an empty array
  if (!activityData.timeline.length) {
    return [];
  }

  // Process activity data to calculate trends and summaries
  const totalSteps = activityData.timeline.reduce((sum: any, record: { steps: any; }) => sum + (record.steps || 0), 0);
  const totalActiveMinutes = activityData.timeline.reduce((sum: any, record: { activeMinutes: any; }) => sum + (record.activeMinutes || 0), 0);

  const averageSteps = Math.round(totalSteps / activityData.timeline.length);
  const averageActiveMinutes = Math.round(totalActiveMinutes / activityData.timeline.length);

  return {
    averageSteps,
    averageActiveMinutes,
    activityData: activityData.timeline.map((record: { time: any; steps: any; activeMinutes: any; }) => ({
      time: record.time,
      steps: record.steps,
      activeMinutes: record.activeMinutes
    }))
  };
}

async function generateNutritionData(userId: string) {
  // Fetch food entries for the user
  const startDate = subDays(new Date(), 30);
  const foodEntries = await FoodEntry.find({
    userId,
    recorded_at: { $gte: startDate }
  });

  // If no food entries are found, return an empty object
  if (!foodEntries.length) {
    return {};
  }

  // Calculate total and average nutrition values
  const totalCalories = foodEntries.reduce((sum, entry) => sum + (entry.calories || 0), 0);
  const totalProtein = foodEntries.reduce((sum, entry) => sum + (entry.protein_g || 0), 0);
  const totalCarbs = foodEntries.reduce((sum, entry) => sum + (entry.carbs_g || 0), 0);
  const totalFats = foodEntries.reduce((sum, entry) => sum + (entry.fats_g || 0), 0);

  const daysCount = Math.max(1, foodEntries.length);

  return {
    averageCalories: Math.round(totalCalories / daysCount),
    averageProtein_g: Math.round(totalProtein / daysCount),
    averageCarbs_g: Math.round(totalCarbs / daysCount),
    averageFats_g: Math.round(totalFats / daysCount),
    foodEntries: foodEntries.map(entry => ({
      date: entry.recorded_at,
      calories: entry.calories,
      protein_g: entry.protein_g,
      carbs_g: entry.carbs_g,
      fats_g: entry.fats_g
    }))
  };
}
// Removed duplicate function implementation
function determineActivityLevel(healthMetrics: any, sleepData: any[]) {
  // Example algorithm to determine activity level
  let activityLevel = "Low";

  // Check if health metrics and sleep data are available
  if (healthMetrics && sleepData.length > 0) {
    const averageSleepDuration = sleepData.reduce((sum, record) => sum + record.duration, 0) / sleepData.length;

    // Determine activity level based on average sleep duration and heart rate
    if (averageSleepDuration >= 7 && healthMetrics.heartRate >= 60 && healthMetrics.heartRate <= 100) {
      activityLevel = "High";
    } else if (averageSleepDuration >= 5) {
      activityLevel = "Moderate";
    }
  }

  return activityLevel;
}
function determineRiskLevel(healthMetrics: any, bmi: number | undefined, sleepData: any[]) {
  let riskLevel = "Low";

  if (healthMetrics) {
    const { bloodPressure, heartRate } = healthMetrics;

    if (bloodPressure) {
      const [systolic, diastolic] = bloodPressure.split('/').map(Number);
      if (systolic >= 140 || diastolic >= 90) {
        riskLevel = "High";
      } else if (systolic >= 130 || diastolic >= 85) {
        riskLevel = "Moderate";
      }
    }

    if (heartRate && (heartRate < 60 || heartRate > 100)) {
      riskLevel = "Moderate";
    }
  }

  if (bmi !== undefined) {
    if (bmi < 18.5 || bmi >= 30) {
      riskLevel = "High";
    } else if (bmi >= 25) {
      riskLevel = "Moderate";
    }
  }

  const averageSleepQuality = sleepData.reduce((sum, record) => sum + record.quality, 0) / sleepData.length;
  if (averageSleepQuality < 2) {
    riskLevel = "High";
  } else if (averageSleepQuality < 4) {
    riskLevel = "Moderate";
  }

  return riskLevel;
}
function generateSummary(healthScore: number, activityLevel: string, bmi: number | undefined, riskLevel: string) {
  const bmiText = bmi !== undefined ? `Your BMI is ${bmi}, which is considered ${getBmiCategory(bmi)}.` : "BMI data is not available.";
  const summary = `
    Health Score: ${healthScore}/100
    Activity Level: ${activityLevel}
    Risk Level: ${riskLevel}
    ${bmiText}
  `;
  return summary.trim();
}

function getBmiCategory(bmi: number) {
  if (bmi < 18.5) return "underweight";
  if (bmi >= 18.5 && bmi <= 24.9) return "normal weight";
  if (bmi >= 25 && bmi <= 29.9) return "overweight";
  return "obese";
}


