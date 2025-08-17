"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle, Calendar, FileText, Info, Loader2, RefreshCcw, Salad } from "lucide-react"
import { MealCard, MealCardSkeleton } from "@/components/ui/meal-card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CalendarDietPlan } from "@/components/ui/calendar-diet-plan"
import Link from "next/link"
import { format, startOfWeek, addDays, formatDistanceToNow, isSameDay } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DietPlanPage() {
  // State for weekly plan
  const [weeklyPlan, setWeeklyPlan] = useState<any>(null)
  const [healthMetrics, setHealthMetrics] = useState<any>(null)
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeDayIndex, setActiveDayIndex] = useState(0)
  
  // Use ref to prevent duplicate fetches
  const fetchingRef = useState<boolean>(false)
  
  // Fetch health metrics and weekly plan on component mount
  useEffect(() => {
    // Check if we're already fetching to avoid duplicate requests
    if (fetchingRef[0]) return
    
    fetchHealthMetrics()
    fetchWeeklyDietPlan()
    
    // Set active day to current day of the week (0 = Monday, 6 = Sunday)
    const today = new Date()
    const dayOfWeek = today.getDay()
    // Convert from Sunday = 0 to Monday = 0
    const adjustedDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    setActiveDayIndex(adjustedDayOfWeek)
    
    // Cleanup function to reset fetching status if component unmounts
    return () => {
      fetchingRef[0] = false
    }
  }, [])
  
  const fetchHealthMetrics = async () => {
    try {
      const response = await fetch('/api/health/latest', {
        cache: 'no-store',
        next: { revalidate: 0 }
      });
      
      if (!response.ok) throw new Error('Failed to fetch health metrics');
      const data = await response.json();
      
      if (data) {
        setHealthMetrics(data);
      }
    } catch (error) {
      console.error('Error fetching health metrics:', error);
      toast({
        title: "Error",
        description: "Failed to load your health data. Please try again later.",
        variant: "destructive"
      });
    }
  };

  const fetchWeeklyDietPlan = async (regenerate: boolean = false) => {
    // Prevent multiple simultaneous fetches
    if (fetchingRef[0]) return
    
    fetchingRef[0] = true
    setIsLoading(true)
    
    try {
      const url = regenerate 
        ? '/api/diet-plan/weekly?regenerate=true&cuisineType=indian' 
        : '/api/diet-plan/weekly?cuisineType=indian'
        
      const response = await fetch(url, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      
      if (!response.ok) {
        // If we get a 404, it means no base plan exists, so we need to generate one first
        if (response.status === 404) {
          setIsGenerating(true);
          await generateBaseDietPlan();
          setIsGenerating(false);
          // After generating base plan, try to fetch weekly plan again
          return fetchWeeklyDietPlan(true);
        }
        
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to fetch weekly diet plan')
      }
      
      const data = await response.json()
      
      // Verify that data has the expected structure
      if (!data || !data.weeklyPlanData) {
        throw new Error('Invalid data structure received from API')
      }
      
      setWeeklyPlan(data)
      
      if (regenerate) {
        toast({
          title: "Success!",
          description: "Your weekly Indian diet plan has been refreshed.",
        })
      }
    } catch (error) {
      console.error('Error fetching weekly diet plan:', error)
      // Only show toast error if this isn't the initial auto-generation attempt
      if (regenerate) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch weekly diet plan.",
          variant: "destructive"
        })
      }
    } finally {
      setIsLoading(false)
      fetchingRef[0] = false
    }
  }
  
  // Generate base diet plan for the weekly plan to use
  const generateBaseDietPlan = async () => {
    setIsGenerating(true);
    
    try {
      if (!healthMetrics) {
        throw new Error("Health metrics not found");
      }
      
      const response = await fetch('/api/diet-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalWeight: healthMetrics.weight, // Use current weight
          timeframe: 4, // 4 weeks default
          dietType: "indian", // Specify Indian diet type
          mealCount: 3, // 3 meals per day
          includeSnacks: true,
          autoGenerate: true // Auto-generate based on health metrics
        }),
        cache: 'no-store'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to generate diet plan: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Base diet plan generated successfully:", data);
      
      toast({
        title: "Success!",
        description: "Your base diet plan has been created. Now generating weekly plan...",
      });
      
      return data.dietPlan;
    } catch (error) {
      console.error('Error generating base diet plan:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate base diet plan. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };
  
  const refreshWeeklyPlan = async () => {
    if (isLoading || isGenerating) return;
    setIsGenerating(true);
    try {
      await fetchWeeklyDietPlan(true);
    } finally {
      setIsGenerating(false);
    }
  }
  
  // Format the weekly data for the calendar component
  const formatWeeklyDataForCalendar = () => {
    if (!weeklyPlan || !weeklyPlan.weeklyPlanData || !weeklyPlan.weekStartDate) {
      return [];
    }
    
    try {
      const weekStartDate = new Date(weeklyPlan.weekStartDate);
      const formattedData = weeklyPlan.weeklyPlanData.map((dayPlan: any, index: number) => {
        const date = addDays(weekStartDate, index);
        return {
          date,
          breakfast: dayPlan.meals?.breakfast || null,
          lunch: dayPlan.meals?.lunch || null,
          dinner: dayPlan.meals?.dinner || null
        };
      });
      
      return formattedData;
    } catch (error) {
      console.error('Error formatting weekly data:', error);
      return [];
    }
  }
  
  // Get current day's meals
  const getCurrentDayMeals = () => {
    if (!weeklyPlan?.weeklyPlanData || 
        activeDayIndex < 0 || 
        activeDayIndex >= weeklyPlan.weeklyPlanData.length ||
        !weeklyPlan.weeklyPlanData[activeDayIndex]?.meals) {
      return null;
    }
    
    return weeklyPlan.weeklyPlanData[activeDayIndex].meals;
  }
  
  const dayMeals = getCurrentDayMeals();
  const calendarData = formatWeeklyDataForCalendar();
  
  // Calculate total nutrition for active day
  const calculateDailyTotals = () => {
    if (!dayMeals) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    
    const { breakfast, lunch, dinner } = dayMeals;
    
    return {
      calories: (breakfast?.calories || 0) + (lunch?.calories || 0) + (dinner?.calories || 0),
      protein: (breakfast?.protein || 0) + (lunch?.protein || 0) + (dinner?.protein || 0),
      carbs: (breakfast?.carbs || 0) + (lunch?.carbs || 0) + (dinner?.carbs || 0),
      fat: (breakfast?.fat || 0) + (lunch?.fat || 0) + (dinner?.fat || 0),
    };
  }
  
  const dailyTotals = calculateDailyTotals();
  
  // Calculate macro percentages for the pie chart
  const calculateMacroPercentages = () => {
    const { protein, carbs, fat } = dailyTotals;
    const totalCaloriesFromMacros = (protein * 4) + (carbs * 4) + (fat * 9);
    
    if (totalCaloriesFromMacros === 0) return { protein: 0, carbs: 0, fat: 0 };
    
    return {
      protein: Math.round((protein * 4 / totalCaloriesFromMacros) * 100),
      carbs: Math.round((carbs * 4 / totalCaloriesFromMacros) * 100),
      fat: Math.round((fat * 9 / totalCaloriesFromMacros) * 100)
    };
  }
  
  const macroPercentages = calculateMacroPercentages();

  return (
    <div className="container mx-auto py-4 px-2 sm:px-4 md:px-6 lg:px-8 max-w-7xl">
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">Indian Weekly Diet Plan</h1>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground">Your personalized weekly Indian meal plan based on your health profile</p>
      </div>
      
      <div className="flex justify-end mb-3 sm:mb-4 md:mb-6">
        <Button 
          variant="outline"
          size="sm"
          onClick={refreshWeeklyPlan}
          disabled={isLoading || isGenerating}
          className="text-xs sm:text-sm px-2 sm:px-3"
        >
          <RefreshCcw className={`mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{isGenerating ? 'Generating...' : 'Refresh Plan'}</span>
          <span className="sm:hidden">{isGenerating ? 'Gen...' : 'Refresh'}</span>
        </Button>
      </div>
      
      {(isLoading || isGenerating) ? (
        <div className="space-y-4 md:space-y-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 md:py-12 px-4">
              <Loader2 className="h-8 w-8 md:h-12 md:w-12 animate-spin text-primary mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-semibold mb-2 text-center">
                {isGenerating ? "Generating Your Diet Plan" : "Loading Diet Plan"}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground text-center max-w-sm md:max-w-md px-2">
                {isGenerating 
                  ? "Your personalized Indian diet plan is being generated based on your health profile. Please wait..."
                  : "Loading your existing diet plan..."
                }
              </p>
            </CardContent>
          </Card>
        </div>
      ) : !weeklyPlan ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Diet Plan Found</AlertTitle>
          <AlertDescription className="space-y-3">
            <p className="text-sm">We couldn't find your weekly diet plan. Please click refresh to generate a new plan.</p>
            <div className="mt-3">
              <Button 
                onClick={refreshWeeklyPlan} 
                disabled={isGenerating}
                size="sm"
                className="w-full sm:w-auto"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span className="text-sm">Generating...</span>
                  </>
                ) : (
                  <span className="text-sm">Generate Indian Diet Plan</span>
                )}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {/* Weekly overview (calendar view) */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4 md:pb-6 px-3 sm:px-6">
              <div className="flex flex-col gap-2 sm:gap-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base sm:text-lg md:text-xl">Weekly Indian Meal Plan</CardTitle>
                    <CardDescription className="text-xs sm:text-sm mt-1 break-words">
                      {weeklyPlan.weekStartDate && (
                        <>
                          <span className="block sm:inline">Week of {format(new Date(weeklyPlan.weekStartDate), "MMM d, yyyy")}</span>
                          <span className="hidden sm:inline"> • </span>
                          <span className="block sm:inline font-medium">{weeklyPlan.dailyCalories} cal/day</span>
                        </>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex items-center justify-start sm:justify-end flex-shrink-0">
                    <Badge variant="outline" className="flex items-center gap-1 text-xs px-2 py-1">
                      <span className="hidden sm:inline">Updated </span>
                      <span className="truncate">{weeklyPlan.createdAt ? formatDistanceToNow(new Date(weeklyPlan.createdAt), { addSuffix: true }) : 'recently'}</span>
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-2 sm:px-3 md:px-6 pb-3 sm:pb-6">
              <div className="w-full overflow-hidden">
                <CalendarDietPlan 
                  dietPlan={weeklyPlan}
                  weeklyData={calendarData}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Day-specific meal details */}
          <div>
            <Tabs 
              defaultValue={activeDayIndex.toString()}
              value={activeDayIndex.toString()}
              onValueChange={(value) => setActiveDayIndex(parseInt(value))}
              className="space-y-3 sm:space-y-4 md:space-y-6"
            >
              <div className="overflow-x-auto px-1">
                <TabsList className="mb-3 sm:mb-4 md:mb-6 w-full inline-flex min-w-max bg-muted p-1">
                  {weeklyPlan.weeklyPlanData.map((dayPlan: any, index: number) => {
                    const dayDate = addDays(new Date(weeklyPlan.weekStartDate), index)
                    const isToday = isSameDay(dayDate, new Date())
                    return (
                      <TabsTrigger 
                        key={index} 
                        value={index.toString()}
                        className={`${isToday ? "relative" : ""} px-2 sm:px-3 md:px-4 py-2 min-w-0 flex-1 sm:flex-initial text-xs sm:text-sm`}
                      >
                        <div className="flex flex-col items-center min-w-0">
                          <span className="text-xs text-muted-foreground truncate">{format(dayDate, "EEE")}</span>
                          <span className="font-medium text-xs sm:text-sm">{format(dayDate, "d")}</span>
                        </div>
                        {isToday && (
                          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />
                        )}
                      </TabsTrigger>
                    )
                  })}
                </TabsList>
              </div>
              
              {weeklyPlan.weeklyPlanData.map((dayPlan: any, index: number) => {
                const dayDate = addDays(new Date(weeklyPlan.weekStartDate), index)
                return (
                  <TabsContent key={index} value={index.toString()} className="mt-0">
                    <div className="space-y-3 sm:space-y-4 md:space-y-6">
                      <h3 className="text-base sm:text-lg md:text-xl font-medium px-1">
                        {format(dayDate, "EEEE, MMMM d")}
                      </h3>
                      
                      <div className="grid gap-2 sm:gap-3 md:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {dayMeals?.breakfast && <MealCard meal={dayMeals.breakfast} />}
                        {dayMeals?.lunch && <MealCard meal={dayMeals.lunch} />}
                        {dayMeals?.dinner && <MealCard meal={dayMeals.dinner} />}
                      </div>
                      
                      <Card className="mt-3 sm:mt-4 md:mt-6">
                        <CardHeader className="pb-2 sm:pb-3">
                          <CardTitle className="text-sm sm:text-base md:text-lg">Daily Nutrition Summary</CardTitle>
                          <CardDescription className="text-xs sm:text-sm">Total nutrients for {format(dayDate, "EEEE")}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 sm:space-y-4 md:space-y-6">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                            <div className="space-y-2 sm:space-y-3 md:space-y-4">
                              <h4 className="font-medium text-xs sm:text-sm">Daily Totals</h4>
                              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                <div className="bg-muted/50 p-2 sm:p-3 md:p-4 rounded-md min-h-[60px] sm:min-h-[70px] md:min-h-[80px]">
                                  <p className="text-xs text-muted-foreground mb-1">Calories</p>
                                  <p className="text-base sm:text-lg md:text-xl font-bold leading-none">{dailyTotals.calories}</p>
                                  <p className="text-xs text-muted-foreground mt-1">kcal</p>
                                </div>
                                <div className="bg-muted/50 p-2 sm:p-3 md:p-4 rounded-md min-h-[60px] sm:min-h-[70px] md:min-h-[80px]">
                                  <p className="text-xs text-muted-foreground mb-1">Protein</p>
                                  <p className="text-base sm:text-lg md:text-xl font-bold leading-none">{dailyTotals.protein}</p>
                                  <p className="text-xs text-muted-foreground mt-1">grams</p>
                                </div>
                                <div className="bg-muted/50 p-2 sm:p-3 md:p-4 rounded-md min-h-[60px] sm:min-h-[70px] md:min-h-[80px]">
                                  <p className="text-xs text-muted-foreground mb-1">Carbs</p>
                                  <p className="text-base sm:text-lg md:text-xl font-bold leading-none">{dailyTotals.carbs}</p>
                                  <p className="text-xs text-muted-foreground mt-1">grams</p>
                                </div>
                                <div className="bg-muted/50 p-2 sm:p-3 md:p-4 rounded-md min-h-[60px] sm:min-h-[70px] md:min-h-[80px]">
                                  <p className="text-xs text-muted-foreground mb-1">Fat</p>
                                  <p className="text-base sm:text-lg md:text-xl font-bold leading-none">{dailyTotals.fat}</p>
                                  <p className="text-xs text-muted-foreground mt-1">grams</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col justify-between space-y-2 sm:space-y-3">
                              <h4 className="font-medium text-xs sm:text-sm">Macronutrient Distribution</h4>
                              <div className="space-y-2 sm:space-y-3">
                                <div className="flex items-center gap-1 h-3 sm:h-4 md:h-5 mb-2 rounded-full overflow-hidden bg-gray-200">
                                  <div style={{ width: `${macroPercentages.protein}%` }} className="h-full bg-blue-500" />
                                  <div style={{ width: `${macroPercentages.carbs}%` }} className="h-full bg-green-500" />
                                  <div style={{ width: `${macroPercentages.fat}%` }} className="h-full bg-yellow-500" />
                                </div>
                                
                                <div className="grid grid-cols-3 gap-1 sm:gap-2 text-center">
                                  <div className="space-y-1">
                                    <div className="h-2 w-2 sm:h-3 sm:w-3 bg-blue-500 rounded-full mx-auto"></div>
                                    <p className="text-xs">Protein</p>
                                    <p className="font-bold text-xs sm:text-sm">{macroPercentages.protein}%</p>
                                  </div>
                                  <div className="space-y-1">
                                    <div className="h-2 w-2 sm:h-3 sm:w-3 bg-green-500 rounded-full mx-auto"></div>
                                    <p className="text-xs">Carbs</p>
                                    <p className="font-bold text-xs sm:text-sm">{macroPercentages.carbs}%</p>
                                  </div>
                                  <div className="space-y-1">
                                    <div className="h-2 w-2 sm:h-3 sm:w-3 bg-yellow-500 rounded-full mx-auto"></div>
                                    <p className="text-xs">Fat</p>
                                    <p className="font-bold text-xs sm:text-sm">{macroPercentages.fat}%</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                )
              })}
            </Tabs>
          </div>
          
          {/* Indian diet information */}
          <Card className="bg-primary-50 border-primary-100 dark:bg-primary-950 dark:border-primary-900">
            <CardHeader className="pb-3 md:pb-4">
              <CardTitle className="text-base md:text-lg">Indian Diet Plan Benefits</CardTitle>
              <CardDescription className="text-sm">Traditional Indian cuisine offers various health advantages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div className="grid gap-3 md:gap-4 grid-cols-1 lg:grid-cols-2">
                <div className="p-3 md:p-4 bg-background rounded-md shadow-sm">
                  <h4 className="font-semibold mb-1 text-sm md:text-base">Common Indian Ingredients</h4>
                  <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-3">
                    Nutritional powerhouses in traditional Indian cooking
                  </p>
                  <ul className="text-xs md:text-sm space-y-1 list-disc pl-4 md:pl-5">
                    <li><span className="font-medium">Turmeric</span> - Contains curcumin, with anti-inflammatory properties</li>
                    <li><span className="font-medium">Lentils (Dal)</span> - High in protein and fiber</li>
                    <li><span className="font-medium">Ginger</span> - Aids digestion and reduces inflammation</li>
                    <li><span className="font-medium">Fenugreek</span> - May help control blood sugar</li>
                    <li><span className="font-medium">Yogurt</span> - Probiotic benefits for gut health</li>
                  </ul>
                </div>
                
                <div className="p-3 md:p-4 bg-background rounded-md shadow-sm">
                  <h4 className="font-semibold mb-1 text-sm md:text-base">Indian Diet Recommendations</h4>
                  <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-3">
                    Tips to maximize benefits of your Indian diet plan
                  </p>
                  <ul className="text-xs md:text-sm space-y-1 list-disc pl-4 md:pl-5">
                    <li>Use traditional spice combinations for optimal nutrition</li>
                    <li>Include a variety of colorful vegetables in each meal</li>
                    <li>Balance meals with protein (legumes, dairy) and complex carbs</li>
                    <li>Consider portion sizes with traditional Indian thali concept</li>
                    <li>Minimize fried items and opt for steamed, baked or grilled</li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 md:pt-6">
              <div className="text-xs md:text-sm text-muted-foreground">
                <p>This plan is automatically generated based on your current health metrics. For health concerns or specific dietary needs, please consult a healthcare professional.</p>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}

