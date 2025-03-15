"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { CalendarDietPlan } from "@/components/ui/calendar-diet-plan"
import { MealCard } from "@/components/ui/meal-card"
import { 
  ArrowLeft, Calendar as CalendarIcon, RefreshCcw, 
  AlertCircle, Clock, ListFilter, Info, ChevronLeft, ChevronRight 
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { 
  format, startOfWeek, addDays, parseISO, 
  isMonday, isSameDay, formatDistanceToNow 
} from "date-fns"
import { Badge } from "@/components/ui/badge"
import { WeeklyPlanExport } from "@/components/ui/weekly-plan-export"

export default function WeeklyDietPlanPage() {
  const [weeklyPlan, setWeeklyPlan] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeDayIndex, setActiveDayIndex] = useState(0)
  
  // Use ref to prevent duplicate fetches
  const fetchingRef = useState<boolean>(false)
  
  useEffect(() => {
    // Check if we're already fetching to avoid duplicate requests
    if (fetchingRef[0]) return
    
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
  
  const fetchWeeklyDietPlan = async (regenerate: boolean = false) => {
    // Prevent multiple simultaneous fetches
    if (fetchingRef[0]) return
    
    fetchingRef[0] = true
    setIsLoading(true)
    
    try {
      const url = regenerate 
        ? '/api/diet-plan/weekly?regenerate=true' 
        : '/api/diet-plan/weekly'
        
      const response = await fetch(url, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      
      if (!response.ok) {
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
          description: "Your weekly diet plan has been refreshed.",
        })
      }
    } catch (error) {
      console.error('Error fetching weekly diet plan:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch weekly diet plan.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
      fetchingRef[0] = false
    }
  }
  
  const refreshWeeklyPlan = async () => {
    if (isRefreshing) return
    
    setIsRefreshing(true)
    await fetchWeeklyDietPlan(true)
  }
  
  // Format the weekly data for the calendar component
  const formatWeeklyDataForCalendar = () => {
    if (!weeklyPlan || !weeklyPlan.weeklyPlanData || !weeklyPlan.weekStartDate) {
      return []
    }
    
    try {
      const weekStartDate = new Date(weeklyPlan.weekStartDate)
      const formattedData = weeklyPlan.weeklyPlanData.map((dayPlan: any, index: number) => {
        const date = addDays(weekStartDate, index)
        return {
          date,
          breakfast: dayPlan.meals?.breakfast || null,
          lunch: dayPlan.meals?.lunch || null,
          dinner: dayPlan.meals?.dinner || null
        }
      })
      
      return formattedData
    } catch (error) {
      console.error('Error formatting weekly data:', error)
      return []
    }
  }
  
  // Get current day's meals
  const getCurrentDayMeals = () => {
    if (!weeklyPlan?.weeklyPlanData || 
        activeDayIndex < 0 || 
        activeDayIndex >= weeklyPlan.weeklyPlanData.length ||
        !weeklyPlan.weeklyPlanData[activeDayIndex]?.meals) {
      return null
    }
    
    return weeklyPlan.weeklyPlanData[activeDayIndex].meals
  }
  
  const dayMeals = getCurrentDayMeals()
  const calendarData = formatWeeklyDataForCalendar()
  
  // Calculate total nutrition for active day
  const calculateDailyTotals = () => {
    if (!dayMeals) return { calories: 0, protein: 0, carbs: 0, fat: 0 }
    
    const { breakfast, lunch, dinner } = dayMeals
    
    return {
      calories: (breakfast?.calories || 0) + (lunch?.calories || 0) + (dinner?.calories || 0),
      protein: (breakfast?.protein || 0) + (lunch?.protein || 0) + (dinner?.protein || 0),
      carbs: (breakfast?.carbs || 0) + (lunch?.carbs || 0) + (dinner?.carbs || 0),
      fat: (breakfast?.fat || 0) + (lunch?.fat || 0) + (dinner?.fat || 0),
    }
  }
  
  const dailyTotals = calculateDailyTotals()
  
  // Calculate macro percentages for the pie chart
  const calculateMacroPercentages = () => {
    const { protein, carbs, fat } = dailyTotals
    const totalCaloriesFromMacros = (protein * 4) + (carbs * 4) + (fat * 9)
    
    if (totalCaloriesFromMacros === 0) return { protein: 0, carbs: 0, fat: 0 }
    
    return {
      protein: Math.round((protein * 4 / totalCaloriesFromMacros) * 100),
      carbs: Math.round((carbs * 4 / totalCaloriesFromMacros) * 100),
      fat: Math.round((fat * 9 / totalCaloriesFromMacros) * 100)
    }
  }
  
  const macroPercentages = calculateMacroPercentages()
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link href="/diet-plan" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Weekly Diet Plan</h1>
            <p className="text-muted-foreground">View your customized 7-day meal schedule</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            disabled={isRefreshing}
            onClick={refreshWeeklyPlan}
          >
            <RefreshCcw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Plan
          </Button>
          
          {weeklyPlan && weeklyPlan._id && <WeeklyPlanExport planId={weeklyPlan._id} />}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-[500px] w-full" />
        </div>
      ) : !weeklyPlan ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Diet Plan Found</AlertTitle>
          <AlertDescription>
            Please create a diet plan first before viewing your weekly meal schedule.
            <div className="mt-4">
              <Button asChild>
                <Link href="/diet-plan">Create Diet Plan</Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-8">
          {/* Weekly overview (calendar view) */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Weekly Overview</CardTitle>
                  <CardDescription>
                    {weeklyPlan.weekStartDate && (
                      <>
                        Week of {format(new Date(weeklyPlan.weekStartDate), "MMMM d, yyyy")} • 
                        {" "}{weeklyPlan.dailyCalories} calories per day
                      </>
                    )}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Updated {weeklyPlan.createdAt ? formatDistanceToNow(new Date(weeklyPlan.createdAt), { addSuffix: true }) : 'recently'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CalendarDietPlan 
                dietPlan={weeklyPlan}
                weeklyData={calendarData}
                className="w-full"
              />
            </CardContent>
          </Card>
          
          {/* Day-specific meal details */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-medium flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5" />
                Daily Meal Details
              </h3>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 w-8 p-0" 
                  onClick={() => activeDayIndex > 0 && setActiveDayIndex(activeDayIndex - 1)}
                  disabled={activeDayIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous day</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => activeDayIndex < 6 && setActiveDayIndex(activeDayIndex + 1)}
                  disabled={activeDayIndex === 6}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next day</span>
                </Button>
              </div>
            </div>
            
            <Tabs 
              defaultValue={activeDayIndex.toString()}
              value={activeDayIndex.toString()}
              onValueChange={(value) => setActiveDayIndex(parseInt(value))}
              className="space-y-6"
            >
              <div className="overflow-auto">
                <TabsList className="mb-6 w-full inline-flex">
                  {weeklyPlan.weeklyPlanData.map((dayPlan: any, index: number) => {
                    const dayDate = addDays(new Date(weeklyPlan.weekStartDate), index)
                    const isToday = isSameDay(dayDate, new Date())
                    return (
                      <TabsTrigger 
                        key={index} 
                        value={index.toString()}
                        className={isToday ? "relative" : ""}
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-muted-foreground">{format(dayDate, "EEE")}</span>
                          <span className="font-medium">{format(dayDate, "d")}</span>
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
                  <TabsContent key={index} value={index.toString()}>
                    <div>
                      <h3 className="text-xl font-medium mb-4">
                        {format(dayDate, "EEEE, MMMM d")}
                      </h3>
                      
                      <div className="grid gap-6 md:grid-cols-3">
                        {dayMeals?.breakfast && <MealCard meal={dayMeals.breakfast} />}
                        {dayMeals?.lunch && <MealCard meal={dayMeals.lunch} />}
                        {dayMeals?.dinner && <MealCard meal={dayMeals.dinner} />}
                      </div>
                      
                      <Card className="mt-6">
                        <CardHeader>
                          <CardTitle className="text-lg">Daily Nutrition Summary</CardTitle>
                          <CardDescription>Total nutrients for {format(dayDate, "EEEE")}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="font-medium text-sm">Daily Totals</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-muted/50 p-4 rounded-md">
                                  <p className="text-sm text-muted-foreground">Calories</p>
                                  <p className="text-xl font-bold">{dailyTotals.calories}</p>
                                  <p className="text-xs text-muted-foreground">kcal</p>
                                </div>
                                <div className="bg-muted/50 p-4 rounded-md">
                                  <p className="text-sm text-muted-foreground">Protein</p>
                                  <p className="text-xl font-bold">{dailyTotals.protein}</p>
                                  <p className="text-xs text-muted-foreground">grams</p>
                                </div>
                                <div className="bg-muted/50 p-4 rounded-md">
                                  <p className="text-sm text-muted-foreground">Carbs</p>
                                  <p className="text-xl font-bold">{dailyTotals.carbs}</p>
                                  <p className="text-xs text-muted-foreground">grams</p>
                                </div>
                                <div className="bg-muted/50 p-4 rounded-md">
                                  <p className="text-sm text-muted-foreground">Fat</p>
                                  <p className="text-xl font-bold">{dailyTotals.fat}</p>
                                  <p className="text-xs text-muted-foreground">grams</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col justify-between">
                              <h4 className="font-medium text-sm mb-4">Macronutrient Distribution</h4>
                              <div>
                                <div className="flex items-center gap-1 h-4 mb-2">
                                  <div style={{ width: `${macroPercentages.protein}%` }} className="h-full bg-blue-500 rounded-l-full" />
                                  <div style={{ width: `${macroPercentages.carbs}%` }} className="h-full bg-green-500" />
                                  <div style={{ width: `${macroPercentages.fat}%` }} className="h-full bg-yellow-500 rounded-r-full" />
                                </div>
                                
                                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                  <div>
                                    <div className="h-3 w-3 bg-blue-500 rounded-full mx-auto mb-1"></div>
                                    <p>Protein</p>
                                    <p className="font-bold">{macroPercentages.protein}%</p>
                                  </div>
                                  <div>
                                    <div className="h-3 w-3 bg-green-500 rounded-full mx-auto mb-1"></div>
                                    <p>Carbs</p>
                                    <p className="font-bold">{macroPercentages.carbs}%</p>
                                  </div>
                                  <div>
                                    <div className="h-3 w-3 bg-yellow-500 rounded-full mx-auto mb-1"></div>
                                    <p>Fat</p>
                                    <p className="font-bold">{macroPercentages.fat}%</p>
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
          
          {/* Meal prep tips */}
          <Card className="bg-muted/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="h-5 w-5 mr-2" />
                Meal Prep Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="p-4 bg-background rounded-lg">
                  <h4 className="font-medium mb-2">Batch Cooking</h4>
                  <p className="text-sm text-muted-foreground">
                    Prepare larger quantities of staple foods like grains, proteins, and roasted vegetables 
                    on Sunday for easy meal assembly throughout the week.
                  </p>
                </div>
                
                <div className="p-4 bg-background rounded-lg">
                  <h4 className="font-medium mb-2">Food Storage</h4>
                  <p className="text-sm text-muted-foreground">
                    Store prepped meals in airtight glass containers to maintain freshness. 
                    Label each container with contents and date for better organization.
                  </p>
                </div>
                
                <div className="p-4 bg-background rounded-lg">
                  <h4 className="font-medium mb-2">Freezer Meals</h4>
                  <p className="text-sm text-muted-foreground">
                    Certain meals can be frozen for up to 3 months. Make double batches 
                    of freezer-friendly recipes to save time on busy days.
                  </p>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <Button variant="outline" asChild>
                  <Link href="/diet-plan">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Diet Plan
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
