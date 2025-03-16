'use server';

import { generateTextToText } from './ai-service';
import { parseJSON } from 'date-fns';

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
    date: string;
    duration: number;
    quality: number;
  }>;
  nutritionData?: {
    calories: number;
    protein_g: number;
    carbs_g: number;
    fats_g: number;
  };
}

export async function generateVitalSignsWithAI(healthData: AvailableHealthData) {
  try {
    const bloodPressure = healthData.healthMetrics?.bloodPressure || '120/80';
    const heartRate = healthData.healthMetrics?.heartRate || 72;
    
    // Generate 7 days of blood pressure data
    const bpData = [];
    const hrData = [];
    
    for (let i = 0; i < 7; i++) {
      // Generate plausible variations for systolic and diastolic
      const [systolic, diastolic] = bloodPressure.split('/').map(Number);
      const systolicVar = systolic + Math.floor(Math.random() * 10) - 5;
      const diastolicVar = diastolic + Math.floor(Math.random() * 8) - 4;
      
      bpData.push(`${systolicVar}/${diastolicVar}`);
      
      // Generate plausible variations for heart rate
      const hrVar = heartRate + Math.floor(Math.random() * 8) - 4;
      hrData.push(hrVar);
    }
    
    const prompt = `
      As a medical AI, generate a realistic vital signs report based on these health metrics:
      - Blood Pressure: ${bloodPressure}
      - Heart Rate: ${heartRate} bpm
      - Age: ${healthData.healthMetrics?.age || 'unknown'}
      - Gender: ${healthData.healthMetrics?.gender || 'unknown'}

      Return the data in this JSON format only, no explanations:
      {
        "bloodPressure": {
          "current": "${bloodPressure}",
          "trend": "stable", // one of: "improving", "worsening", "stable", "fluctuating"
          "lastMeasured": "today",
          "chartData": ${JSON.stringify(bpData)}
        },
        "heartRate": {
          "current": ${heartRate},
          "trend": "stable", // one of: "improving", "worsening", "stable", "fluctuating"
          "lastMeasured": "today",
          "chartData": ${JSON.stringify(hrData)}
        },
        "temperature": {
          "current": "98.6°F",
          "trend": "stable",
          "lastMeasured": "today"
        },
        "respiratoryRate": {
          "current": "16 bpm",
          "trend": "stable",
          "lastMeasured": "today"
        }
      }
    `;

    const aiResponse = await generateTextToText(prompt);
    return JSON.parse(aiResponse);
  } catch (error) {
    console.error('Error generating vital signs with AI:', error);
    
    // Return fallback data
    return {
      bloodPressure: {
        current: healthData.healthMetrics?.bloodPressure || '120/80',
        trend: "stable",
        lastMeasured: "today",
        chartData: ["118/78", "121/79", "120/80", "122/81", "119/78", "120/82", "121/80"]
      },
      heartRate: {
        current: healthData.healthMetrics?.heartRate || 72,
        trend: "stable",
        lastMeasured: "today",
        chartData: [70, 72, 74, 71, 73, 72, 70]
      },
      temperature: {
        current: "98.6°F",
        trend: "stable",
        lastMeasured: "today"
      },
      respiratoryRate: {
        current: "16 bpm",
        trend: "stable",
        lastMeasured: "today"
      }
    };
  }
}

export async function generateNutritionAdviceWithAI(healthData: AvailableHealthData, healthScore: number) {
  try {
    const prompt = `
      As a nutrition expert AI, provide 3-5 personalized nutrition advice points based on these health metrics:
      - Weight: ${healthData.healthMetrics?.weight || 'unknown'} kg
      - Height: ${healthData.healthMetrics?.height || 'unknown'} cm
      - Age: ${healthData.healthMetrics?.age || 'unknown'}
      - Gender: ${healthData.healthMetrics?.gender || 'unknown'}
      - Health Score: ${healthScore}/100
      ${healthData.nutritionData ? `
      - Average Calorie Intake: ${healthData.nutritionData.calories} kcal
      - Average Protein: ${healthData.nutritionData.protein_g}g
      - Average Carbs: ${healthData.nutritionData.carbs_g}g
      - Average Fats: ${healthData.nutritionData.fats_g}g
      ` : ''}

      Return ONLY an array of advice strings, no explanations or other text - just the JSON array:
    `;

    const aiResponse = await generateTextToText(prompt);
    
    try {
      // Attempt to parse the response as JSON
      return JSON.parse(aiResponse);
    } catch (error) {
      // If parsing fails, extract advice points with regex
      const advicePoints = aiResponse
        .split(/[\n\r]+/)
        .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
        .map(line => line.replace(/^[-•]\s*/, '').trim());
      
      return advicePoints.length > 0 ? advicePoints : [
        "Consider increasing your protein intake to support muscle maintenance.",
        "Try to include more fruits and vegetables in your diet for essential vitamins.",
        "Stay hydrated by drinking at least 2 liters of water daily."
      ];
    }
  } catch (error) {
    console.error('Error generating nutrition advice with AI:', error);
    
    // Return fallback advice
    return [
      "Consider increasing your protein intake to support muscle maintenance.",
      "Try to include more fruits and vegetables in your diet for essential vitamins.",
      "Stay hydrated by drinking at least 2 liters of water daily.",
      "Monitor your portion sizes to maintain a healthy calorie balance.",
      "Include sources of healthy fats like avocados, nuts and olive oil."
    ];
  }
}

export async function generateHealthPredictionsWithAI(healthData: AvailableHealthData, healthScore: number) {
  try {
    const prompt = `
      As a predictive health AI, provide 3-4 potential health predictions or insights based on these metrics:
      - Blood Pressure: ${healthData.healthMetrics?.bloodPressure || 'unknown'}
      - Heart Rate: ${healthData.healthMetrics?.heartRate || 'unknown'} bpm
      - Weight: ${healthData.healthMetrics?.weight || 'unknown'} kg
      - Height: ${healthData.healthMetrics?.height || 'unknown'} cm
      - Age: ${healthData.healthMetrics?.age || 'unknown'}
      - Gender: ${healthData.healthMetrics?.gender || 'unknown'}
      - Health Score: ${healthScore}/100

      Be realistic and helpful, but not alarmist. Focus on preventive care and maintenance.
      Return ONLY an array of prediction strings, no explanations or other text - just the JSON array:
    `;

    const aiResponse = await generateTextToText(prompt);
    
    try {
      // Attempt to parse the response as JSON
      return JSON.parse(aiResponse);
    } catch (error) {
      // If parsing fails, extract prediction points with regex
      const predictions = aiResponse
        .split(/[\n\r]+/)
        .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
        .map(line => line.replace(/^[-•]\s*/, '').trim());
      
      return predictions.length > 0 ? predictions : [
        "If current trends continue, your cardiovascular fitness will likely improve over the next 3 months.",
        "Maintaining your current activity level could help prevent age-related muscle loss.",
        "Your current health indicators suggest a lower risk for metabolic disorders."
      ];
    }
  } catch (error) {
    console.error('Error generating health predictions with AI:', error);
    
    // Return fallback predictions
    return [
      "If current trends continue, your cardiovascular fitness will likely improve over the next 3 months.",
      "Maintaining your current activity level could help prevent age-related muscle loss.",
      "Your current health indicators suggest a lower risk for metabolic disorders.",
      "Consider scheduling a regular check-up to monitor your blood pressure trends."
    ];
  }
}

export async function generateHealthRecommendationsWithAI(healthData: AvailableHealthData) {
  try {
    const prompt = `
      As a health recommendations AI, provide 3-5 personalized health recommendations based on these metrics:
      - Blood Pressure: ${healthData.healthMetrics?.bloodPressure || 'unknown'}
      - Heart Rate: ${healthData.healthMetrics?.heartRate || 'unknown'} bpm
      - Weight: ${healthData.healthMetrics?.weight || 'unknown'} kg
      - Height: ${healthData.healthMetrics?.height || 'unknown'} cm
      - Age: ${healthData.healthMetrics?.age || 'unknown'}
      - Gender: ${healthData.healthMetrics?.gender || 'unknown'}

      Be specific, actionable, and practical. Focus on sustainable health improvements.
      Return ONLY an array of recommendation strings, no explanations or other text - just the JSON array:
    `;

    const aiResponse = await generateTextToText(prompt);
    
    try {
      // Attempt to parse the response as JSON
      return JSON.parse(aiResponse);
    } catch (error) {
      // If parsing fails, extract recommendation points with regex
      const recommendations = aiResponse
        .split(/[\n\r]+/)
        .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
        .map(line => line.replace(/^[-•]\s*/, '').trim());
      
      return recommendations.length > 0 ? recommendations : [
        "Incorporate 30 minutes of moderate exercise most days of the week.",
        "Practice stress reduction techniques like meditation or deep breathing for 10 minutes daily.",
        "Ensure you get 7-8 hours of quality sleep each night.",
        "Stay hydrated by drinking water throughout the day."
      ];
    }
  } catch (error) {
    console.error('Error generating health recommendations with AI:', error);
    
    // Return fallback recommendations
    return [
      "Incorporate 30 minutes of moderate exercise most days of the week.",
      "Practice stress reduction techniques like meditation or deep breathing for 10 minutes daily.",
      "Ensure you get 7-8 hours of quality sleep each night.",
      "Stay hydrated by drinking water throughout the day.",
      "Schedule regular health check-ups to monitor your progress."
    ];
  }
}
