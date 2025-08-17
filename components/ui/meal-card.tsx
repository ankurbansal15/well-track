import React from "react";
import Image from "next/image";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Utensils } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface MealFood {
  name: string;
  portion: string;
  imageUrl?: string;
}

interface MealProps {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  foods?: MealFood[];
}

export function MealCard({ meal }: { meal: MealProps }) {
  // Check for valid meal data
  if (!meal || typeof meal !== 'object') {
    return (
      <Card className="overflow-hidden h-full flex flex-col min-h-[200px] sm:min-h-[250px]">
        <CardHeader className="bg-primary/5 pb-2 sm:pb-3 md:pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm sm:text-base md:text-lg">Missing Meal Data</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-3 sm:pt-4 md:pt-6 flex-grow flex items-center justify-center px-3 sm:px-4 md:px-6">
          <p className="text-muted-foreground text-xs sm:text-sm text-center">Meal information unavailable</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate macros percentage for visualization
  const calculateMacroPercentage = (meal: MealProps) => {
    const totalCaloriesFromMacros = 
      ((meal.protein || 0) * 4) + ((meal.carbs || 0) * 4) + ((meal.fat || 0) * 9);
    
    if (totalCaloriesFromMacros === 0) {
      return { protein: 0, carbs: 0, fat: 0 };
    }
    
    return {
      protein: Math.round(((meal.protein || 0) * 4 / totalCaloriesFromMacros) * 100),
      carbs: Math.round(((meal.carbs || 0) * 4 / totalCaloriesFromMacros) * 100),
      fat: Math.round(((meal.fat || 0) * 9 / totalCaloriesFromMacros) * 100)
    };
  };

  const macroPercentages = calculateMacroPercentage(meal);

  return (
    <Card className="overflow-hidden h-full flex flex-col min-h-[300px] sm:min-h-[350px] md:min-h-[400px]">
      <CardHeader className="bg-primary/5 pb-2 sm:pb-3 md:pb-4">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <CardTitle className="text-sm sm:text-base md:text-lg">{meal.name}</CardTitle>
          <Badge className="text-xs sm:text-sm whitespace-nowrap">{meal.calories} kcal</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-3 sm:pt-4 md:pt-6 space-y-3 sm:space-y-4 flex-grow px-3 sm:px-4 md:px-6">
        {meal.foods && meal.foods[0]?.imageUrl ? (
          <div className="aspect-video relative rounded-md overflow-hidden">
            <Image
              src={meal.foods[0].imageUrl}
              alt={meal.foods[0].name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="aspect-video relative rounded-md overflow-hidden bg-muted flex items-center justify-center">
            <Utensils className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-muted-foreground/50" />
          </div>
        )}
        
        <div className="space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 text-xs sm:text-sm">
              <span className="font-medium">Macronutrients</span>
              <span className="text-muted-foreground text-xs sm:text-sm">
                {meal.protein || 0}g P • {meal.carbs || 0}g C • {meal.fat || 0}g F
              </span>
            </div>
            
            <div className="flex items-center gap-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div style={{ width: `${macroPercentages.protein}%` }} className="h-full bg-blue-500" />
              <div style={{ width: `${macroPercentages.carbs}%` }} className="h-full bg-green-500" />
              <div style={{ width: `${macroPercentages.fat}%` }} className="h-full bg-yellow-500" />
            </div>
            
            <div className="grid grid-cols-3 text-xs gap-1">
              <span className="text-center">Protein {macroPercentages.protein}%</span>
              <span className="text-center">Carbs {macroPercentages.carbs}%</span>
              <span className="text-center">Fat {macroPercentages.fat}%</span>
            </div>
          </div>
          
          {meal.foods && meal.foods.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm">Recommended Foods</Label>
              <ul className="space-y-1 sm:space-y-2">
                {meal.foods.slice(0, 3).map((food, index) => (
                  <li key={index} className="flex items-start gap-2 text-xs sm:text-sm">
                    <Utensils className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5" />
                    <span className="leading-tight">
                      <span className="font-medium block sm:inline">{food.name}</span>
                      <span className="text-muted-foreground block sm:inline"> - {food.portion}</span>
                    </span>
                  </li>
                ))}
                {meal.foods.length > 3 && (
                  <li className="text-xs text-muted-foreground">
                    +{meal.foods.length - 3} more items
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function MealCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full min-h-[300px] sm:min-h-[350px] md:min-h-[400px]">
      <CardHeader className="bg-primary/5 pb-2 sm:pb-3 md:pb-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 sm:h-5 w-20 sm:w-24" />
          <Skeleton className="h-4 sm:h-5 w-12 sm:w-16" />
        </div>
      </CardHeader>
      
      <CardContent className="pt-3 sm:pt-4 md:pt-6 space-y-3 sm:space-y-4 px-3 sm:px-4 md:px-6">
        <Skeleton className="aspect-video w-full" />
        
        <div className="space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
              <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
              <Skeleton className="h-3 sm:h-4 w-24 sm:w-32" />
            </div>
            
            <Skeleton className="h-2 w-full" />
            
            <div className="grid grid-cols-3 gap-1">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Skeleton className="h-3 sm:h-4 w-24 sm:w-32" />
            <div className="space-y-1 sm:space-y-2">
              <Skeleton className="h-4 sm:h-5 w-full" />
              <Skeleton className="h-4 sm:h-5 w-full" />
              <Skeleton className="h-4 sm:h-5 w-3/4" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
