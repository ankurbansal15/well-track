import { generateTextToText } from './ai-service';

export interface AvailableHealthData {
  healthMetrics?: {
    height?: number;
    weight?: number;
    age?: number;
    gender?: string;
    bloodPressure?: string;
    heartRate?: number;
  };
  sleepData?: Array<{
    date?: Date;
    duration?: number;
    quality?: string;
  }>;
  nutritionData?: {
    calories?: number;
    protein_g?: number;
    carbs_g?: number;
    fats_g?: number;
  };
  activityData?: {
    steps?: number;
    distance?: number;
    activeMinutes?: number;
    caloriesBurned?: number;
  };
}

/**
 * Generate missing vital signs data using AI based on available health data
 */
export async function generateVitalSignsWithAI(availableData: AvailableHealthData) {
  try {
    // Create a summary of the available data for the AI prompt
    let dataDescription = "Based on the following health data:\n";
    
    if (availableData.healthMetrics) {
      const metrics = availableData.healthMetrics;
      if (metrics.height) dataDescription += `- Height: ${metrics.height} cm\n`;
      if (metrics.weight) dataDescription += `- Weight: ${metrics.weight} kg\n`;
      if (metrics.age) dataDescription += `- Age: ${metrics.age} years\n`;
      if (metrics.gender) dataDescription += `- Gender: ${metrics.gender}\n`;
      if (metrics.bloodPressure) dataDescription += `- Blood Pressure: ${metrics.bloodPressure}\n`;
      if (metrics.heartRate) dataDescription += `- Heart Rate: ${metrics.heartRate} BPM\n`;
    }
    
    if (availableData.sleepData && availableData.sleepData.length > 0) {
      const avgDuration = availableData.sleepData.reduce((sum, item) => 
        sum + (item.duration || 0), 0) / availableData.sleepData.length;
      
      dataDescription += `- Average Sleep Duration: ${Math.round(avgDuration)} minutes\n`;
    }
    
    if (availableData.nutritionData) {
      const nutrition = availableData.nutritionData;
      if (nutrition.calories) dataDescription += `- Average Daily Calories: ${nutrition.calories}\n`;
      if (nutrition.protein_g) dataDescription += `- Average Daily Protein: ${nutrition.protein_g}g\n`;
      if (nutrition.carbs_g) dataDescription += `- Average Daily Carbs: ${nutrition.carbs_g}g\n`;
      if (nutrition.fats_g) dataDescription += `- Average Daily Fats: ${nutrition.fats_g}g\n`;
    }
    
    if (availableData.activityData) {
      const activity = availableData.activityData;
      if (activity.steps) dataDescription += `- Average Daily Steps: ${activity.steps}\n`;
      if (activity.activeMinutes) dataDescription += `- Average Daily Active Minutes: ${activity.activeMinutes}\n`;
    }
    
    // Create the prompt for the AI
    const prompt = `
${dataDescription}

Please generate realistic vital signs data for this person. Return the data formatted as JSON matching the following structure:
{
  "bloodPressure": {
    "current": "120/80 mmHg",
    "trend": "Stable|Increasing|Decreasing",
    "lastMeasured": "2 hours ago",
    "chartData": [
      { "date": "Jan 1", "value": 120 },
      { "date": "Jan 2", "value": 122 }
    ]
  },
  "heartRate": {
    "current": "72 BPM",
    "trend": "Stable|Increasing|Decreasing",
    "lastMeasured": "1 hour ago",
    "chartData": [
      { "date": "Jan 1", "value": 72 },
      { "date": "Jan 2", "value": 74 }
    ]
  },
  "temperature": {
    "current": "98.6°F",
    "trend": "Normal",
    "lastMeasured": "6 hours ago"
  },
  "respiratoryRate": {
    "current": "16 breaths/min",
    "trend": "Normal",
    "lastMeasured": "6 hours ago"
  }
}

Use realistic physiological values based on the provided health metrics. The chart data should include 5 data points with reasonable progression.
`;

    // Get AI response
    const aiResponse = await generateTextToText(prompt);
    
    // Parse the JSON response
    try {
      // Extract JSON from the response (in case the AI adds extra text)
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in AI response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI vital signs response:", parseError);
      return generateFallbackVitalSigns();
    }
    
  } catch (error) {
    console.error("Error generating vital signs with AI:", error);
    return generateFallbackVitalSigns();
  }
}

/**
 * Generate missing nutrition advice using AI based on available health data
 */
export async function generateNutritionAdviceWithAI(availableData: AvailableHealthData, healthScore: number) {
  try {
    // Create a summary of the available data for the AI prompt
    let dataDescription = "Based on the following health data:\n";
    
    if (availableData.healthMetrics) {
      const metrics = availableData.healthMetrics;
      if (metrics.height) dataDescription += `- Height: ${metrics.height} cm\n`;
      if (metrics.weight) dataDescription += `- Weight: ${metrics.weight} kg\n`;
      if (metrics.age) dataDescription += `- Age: ${metrics.age} years\n`;
      if (metrics.gender) dataDescription += `- Gender: ${metrics.gender}\n`;
    }
    
    if (availableData.nutritionData) {
      const nutrition = availableData.nutritionData;
      if (nutrition.calories) dataDescription += `- Average Daily Calories: ${nutrition.calories}\n`;
      if (nutrition.protein_g) dataDescription += `- Average Daily Protein: ${nutrition.protein_g}g\n`;
      if (nutrition.carbs_g) dataDescription += `- Average Daily Carbs: ${nutrition.carbs_g}g\n`;
      if (nutrition.fats_g) dataDescription += `- Average Daily Fats: ${nutrition.fats_g}g\n`;
    }
    
    dataDescription += `- Overall Health Score: ${healthScore}/100\n`;
    
    // Create the prompt for the AI
    const prompt = `
${dataDescription}

Please generate personalized nutrition advice for this person. Return the data formatted as JSON matching the following structure:
{
  "summary": "Overall assessment of their current nutrition status",
  "recommendations": [
    "Specific recommendation 1",
    "Specific recommendation 2",
    "Specific recommendation 3",
    "Specific recommendation 4"
  ]
}

The advice should be personalized based on the data provided and include practical, actionable recommendations.
`;

    // Get AI response
    const aiResponse = await generateTextToText(prompt);
    
    // Parse the JSON response
    try {
      // Extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in AI response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI nutrition advice response:", parseError);
      return generateFallbackNutritionAdvice(healthScore);
    }
    
  } catch (error) {
    console.error("Error generating nutrition advice with AI:", error);
    return generateFallbackNutritionAdvice(healthScore);
  }
}

/**
 * Generate missing health predictions using AI based on available health data
 */
export async function generateHealthPredictionsWithAI(availableData: AvailableHealthData, healthScore: number) {
  try {
    // Create a summary of the available data for the AI prompt
    let dataDescription = "Based on the following health data:\n";
    
    if (availableData.healthMetrics) {
      const metrics = availableData.healthMetrics;
      if (metrics.height) dataDescription += `- Height: ${metrics.height} cm\n`;
      if (metrics.weight) dataDescription += `- Weight: ${metrics.weight} kg\n`;
      if (metrics.age) dataDescription += `- Age: ${metrics.age} years\n`;
      if (metrics.gender) dataDescription += `- Gender: ${metrics.gender}\n`;
      if (metrics.bloodPressure) dataDescription += `- Blood Pressure: ${metrics.bloodPressure}\n`;
      if (metrics.heartRate) dataDescription += `- Heart Rate: ${metrics.heartRate} BPM\n`;
    }
    
    if (availableData.sleepData && availableData.sleepData.length > 0) {
      const avgDuration = availableData.sleepData.reduce((sum, item) => 
        sum + (item.duration || 0), 0) / availableData.sleepData.length;
      
      dataDescription += `- Average Sleep Duration: ${Math.round(avgDuration)} minutes\n`;
    }
    
    dataDescription += `- Overall Health Score: ${healthScore}/100\n`;
    
    let bmi = "";
    if (availableData.healthMetrics?.height && availableData.healthMetrics?.weight) {
      const heightInMeters = availableData.healthMetrics.height / 100;
      const bmiValue = availableData.healthMetrics.weight / (heightInMeters * heightInMeters);
      bmi = bmiValue.toFixed(1);
      dataDescription += `- BMI: ${bmi}\n`;
    }
    
    // Create the prompt for the AI
    const prompt = `
${dataDescription}

Please generate 3 realistic health predictions for this person. Return the data formatted as JSON matching the following structure:
[
  {
    "title": "Prediction Category",
    "prediction": "What is likely to happen in their health journey",
    "recommendation": "What they should do about it",
    "timeframe": "Over what period this might happen"
  }
]

The predictions should cover different aspects of health (e.g., weight management, cardiovascular health, sleep quality, etc.) and be based on the provided metrics.
`;

    // Get AI response
    const aiResponse = await generateTextToText(prompt);
    
    // Parse the JSON response
    try {
      // Extract JSON from the response
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in AI response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI predictions response:", parseError);
      return generateFallbackPredictions(availableData, healthScore);
    }
    
  } catch (error) {
    console.error("Error generating health predictions with AI:", error);
    return generateFallbackPredictions(availableData, healthScore);
  }
}

// Generate fallback vital signs data if AI fails
function generateFallbackVitalSigns() {
  return {
    bloodPressure: {
      current: "120/80 mmHg",
      trend: "Stable",
      lastMeasured: "No recent data",
      chartData: [
        { date: "Day 1", value: 120 },
        { date: "Day 2", value: 118 },
        { date: "Day 3", value: 122 },
        { date: "Day 4", value: 119 },
        { date: "Day 5", value: 120 }
      ]
    },
    heartRate: {
      current: "72 BPM",
      trend: "Stable",
      lastMeasured: "No recent data",
      chartData: [
        { date: "Day 1", value: 72 },
        { date: "Day 2", value: 74 },
        { date: "Day 3", value: 71 },
        { date: "Day 4", value: 73 },
        { date: "Day 5", value: 72 }
      ]
    },
    temperature: {
      current: "98.6°F",
      trend: "Normal",
      lastMeasured: "No recent data"
    },
    respiratoryRate: {
      current: "16 breaths/min",
      trend: "Normal",
      lastMeasured: "No recent data"
    }
  };
}

// Generate fallback nutrition advice if AI fails
function generateFallbackNutritionAdvice(healthScore: number) {
  if (healthScore > 80) {
    return {
      summary: "Your current nutritional balance appears optimal for your health profile.",
      recommendations: [
        "Continue with your balanced macronutrient intake, with emphasis on high-quality protein sources.",
        "Consider incorporating more varied fruits and vegetables to ensure a diverse micronutrient profile.",
        "Your current caloric intake aligns well with your activity level. Adjusting by ±100-200 calories may help with specific fitness goals.",
        "Periodic meal planning may help maintain this excellent nutritional profile during busy periods."
      ]
    };
  } else if (healthScore > 60) {
    return {
      summary: "Your nutritional patterns show good foundations with opportunities for optimization.",
      recommendations: [
        "Consider increasing protein intake to support muscle maintenance and metabolic health.",
        "Your carbohydrate sources could be shifted more toward complex carbs with lower glycemic impact.",
        "Including more healthy fats from sources like avocados, nuts, and olive oil may improve overall nutrient absorption.",
        "Ensuring consistent meal timing could help optimize energy levels throughout the day."
      ]
    };
  } else {
    return {
      summary: "Your nutritional data suggests several areas for potential improvement.",
      recommendations: [
        "Consider balancing your macronutrient intake with an emphasis on increasing protein consumption.",
        "Reducing processed carbohydrates and increasing fiber intake could improve metabolic markers.",
        "Your daily caloric intake may need adjustment to better align with your activity level and health goals.",
        "Staying hydrated and establishing regular meal patterns could help regulate appetite and energy levels."
      ]
    };
  }
}

// Generate fallback predictions if AI fails
function generateFallbackPredictions(availableData: AvailableHealthData, healthScore: number) {
  const predictions = [];
  
  // Weight-related prediction
  let bmi = 0;
  
  if (availableData.healthMetrics?.height && availableData.healthMetrics?.weight) {
    const heightInMeters = availableData.healthMetrics.height / 100;
    bmi = availableData.healthMetrics.weight / (heightInMeters * heightInMeters);
  }
  
  if (bmi > 0) {
    if (bmi > 25) {
      predictions.push({
        title: "Weight Management",
        prediction: "Based on your current BMI and activity patterns, you may see gradual weight reduction with consistent lifestyle changes.",
        recommendation: "Aim for a caloric deficit of 300-500 calories daily through combined diet adjustments and increased physical activity.",
        timeframe: "3-6 months"
      });
    } else if (bmi < 18.5) {
      predictions.push({
        title: "Weight Management",
        prediction: "Your current BMI suggests you may benefit from a structured plan to achieve healthy weight gain.",
        recommendation: "Focus on nutrient-dense foods and consider increasing caloric intake by 300-500 calories daily.",
        timeframe: "3-6 months"
      });
    } else {
      predictions.push({
        title: "Weight Stability",
        prediction: "Your weight appears stable within a healthy range. Continuing current habits should maintain this stability.",
        recommendation: "Regular monitoring and maintaining balanced nutrition will support your long-term health goals.",
        timeframe: "Ongoing"
      });
    }
  }
  
  // Sleep-related prediction
  if (availableData.sleepData && availableData.sleepData.length > 0) {
    const avgDuration = availableData.sleepData.reduce((sum, record) => 
      sum + (record.duration || 0), 0) / availableData.sleepData.length;
    
    if (avgDuration < 420) { // Less than 7 hours
      predictions.push({
        title: "Sleep Optimization",
        prediction: "Improving your sleep duration and quality could significantly enhance your overall health metrics.",
        recommendation: "Aim to increase sleep duration by 30-60 minutes and establish a consistent sleep schedule.",
        timeframe: "2-4 weeks"
      });
    } else {
      predictions.push({
        title: "Sleep Maintenance",
        prediction: "Your current sleep patterns appear conducive to good health. Maintaining these patterns will support continued well-being.",
        recommendation: "Continue your current sleep habits and consider periodic sleep quality assessments.",
        timeframe: "Ongoing"
      });
    }
  }
  
  // General health prediction based on health score
  if (healthScore < 70) {
    predictions.push({
      title: "Health Score Improvement",
      prediction: "With targeted lifestyle adjustments, your health score could improve by 10-15 points.",
      recommendation: "Focus on consistent sleep patterns, increased physical activity, and a more balanced diet to see improvements within 8-12 weeks.",
      timeframe: "2-3 months"
    });
  } else if (healthScore >= 70 && healthScore < 85) {
    predictions.push({
      title: "Health Score Optimization",
      prediction: "Maintaining your current habits while implementing small refinements could elevate your health score to the excellent range.",
      recommendation: "Consider minor adjustments to your nutrition and activity patterns, along with stress management techniques.",
      timeframe: "1-2 months"
    });
  } else {
    predictions.push({
      title: "Health Score Maintenance",
      prediction: "Your excellent health score reflects optimal lifestyle choices. Focus on consistency and periodic reassessment.",
      recommendation: "Continue your current habits and consider exploring advanced wellness practices like meditation or periodized exercise.",
      timeframe: "Ongoing"
    });
  }
  
  // Ensure we return at least 3 predictions
  if (predictions.length < 3) {
    predictions.push({
      title: "Cardiovascular Health",
      prediction: "Regular cardiovascular exercise could improve your heart health metrics.",
      recommendation: "Consider incorporating 150 minutes of moderate aerobic activity per week.",
      timeframe: "3-6 months"
    });
    
    predictions.push({
      title: "Stress Management",
      prediction: "Implementing regular stress management techniques could improve overall well-being.",
      recommendation: "Try incorporating mindfulness practices or meditation for 10 minutes daily.",
      timeframe: "4-8 weeks"
    });
  }
  
  // Return first 3 predictions
  return predictions.slice(0, 3);
}
