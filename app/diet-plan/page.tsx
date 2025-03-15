"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle, Calendar, ChevronRight, FileText, Info, Loader2, Salad } from "lucide-react"
import { MealCard, MealCardSkeleton } from "@/components/ui/meal-card"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { DietPlanPdf } from "@/components/ui/diet-plan-pdf"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function DietPlanPage() {
  // State for user inputs
  const [goalWeight, setGoalWeight] = useState<number | ''>('')
  const [timeframe, setTimeframe] = useState("4")
  const [dietType, setDietType] = useState("balanced")
  const [mealCount, setMealCount] = useState(3)
  const [includeSnacks, setIncludeSnacks] = useState(true)
  
  // State for health metrics and generated plan
  const [healthMetrics, setHealthMetrics] = useState<any>(null)
  const [generatedPlan, setGeneratedPlan] = useState<any>(null)
  const [savedPlan, setSavedPlan] = useState<any>(null)
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false)
  const [isMetricsLoading, setIsMetricsLoading] = useState(true)
  const [isExistingPlanLoading, setIsExistingPlanLoading] = useState(true)
  
  // Router for navigation
  const router = useRouter()
  
  // Calculate weight difference for UI display
  const weightDifference = goalWeight && healthMetrics ? 
    Number(goalWeight) - healthMetrics.weight : 0

  // Fetch user's health metrics and existing plans once on component mount
  useEffect(() => {
    let isMounted = true; // Track if component is mounted
    
    const fetchHealthMetrics = async () => {
      try {
        const response = await fetch('/api/health/latest', {
          cache: 'no-store',
          next: { revalidate: 0 }
        });
        
        if (!response.ok) throw new Error('Failed to fetch health metrics');
        const data = await response.json();
        
        if (isMounted && data) {
          setHealthMetrics(data);
          // Default goal weight to current weight
          setGoalWeight(data.weight);
        }
      } catch (error) {
        console.error('Error fetching health metrics:', error);
        if (isMounted) {
          toast({
            title: "Error",
            description: "Failed to load your health data. Please try again later.",
            variant: "destructive"
          });
        }
      } finally {
        if (isMounted) setIsMetricsLoading(false);
      }
    };
    
    // Check for existing diet plan
    const fetchExistingPlan = async () => {
      try {
        const response = await fetch('/api/diet-plan', {
          cache: 'no-store',
          next: { revalidate: 0 }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (isMounted && data) setSavedPlan(data);
        }
      } catch (error) {
        console.error('Error fetching existing diet plan:', error);
      } finally {
        if (isMounted) setIsExistingPlanLoading(false);
      }
    };
    
    fetchHealthMetrics();
    fetchExistingPlan();
    
    // Cleanup function to prevent memory leaks and state updates if component unmounts
    return () => {
      isMounted = false;
    };
  }, []);

  // Generate a new diet plan
  const generateDietPlan = async () => {
    if (!healthMetrics || goalWeight === '') {
      toast({
        title: "Missing Information",
        description: "Please ensure all fields are filled correctly.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/diet-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalWeight,
          timeframe: parseInt(timeframe),
          dietType,
          mealCount,
          includeSnacks
        }),
        cache: 'no-store'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate diet plan');
      }
      
      const data = await response.json();
      setGeneratedPlan(data.dietPlan);
      setSavedPlan(data.dietPlan);
      
      toast({
        title: "Success!",
        description: "Your personalized diet plan has been created.",
      });
      
      // Auto-switch to the view tab
      (document.querySelector('[data-value="view"]') as HTMLElement)?.click();
    } catch (error) {
      console.error('Error generating diet plan:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate diet plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle view details button click
  const handleViewPlanDetails = (planId: string) => {
    router.push(`/diet-plan/${planId}`);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Personalized Diet Plan</h1>
      <p className="text-muted-foreground mb-8">Create a custom meal plan based on your health metrics and goals</p>
      
      <Tabs defaultValue={savedPlan ? "view" : "create"} className="space-y-8">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="create">Create Plan</TabsTrigger>
          <TabsTrigger value="view" disabled={!savedPlan && !generatedPlan}>View Plan</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create">
          {isMetricsLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <div className="grid gap-8 md:grid-cols-2">
                <Skeleton className="h-[500px]" />
                <Skeleton className="h-[500px]" />
              </div>
            </div>
          ) : !healthMetrics ? (
            <Alert variant="destructive" className="mb-8">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Missing Health Data</AlertTitle>
              <AlertDescription>
                Please update your health metrics first before creating a diet plan.
                <Button variant="link" className="p-0 h-auto text-destructive" asChild>
                  <Link href="/health-metrics">Go to Health Metrics</Link>
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            // ...existing code...
            <div className="grid gap-8 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Your Information</CardTitle>
                  <CardDescription>Based on your health profile</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* ...existing code... */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-weight">Current Weight (kg)</Label>
                      <Input id="current-weight" type="number" value={healthMetrics.weight} readOnly />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="goal-weight">Goal Weight (kg)</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">
                                Your target weight will determine your calorie goal. 
                                Setting this lower than your current weight creates a calorie 
                                deficit for weight loss.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="goal-weight"
                        type="number"
                        value={goalWeight}
                        onChange={(e) => setGoalWeight(e.target.value ? Number(e.target.value) : '')}
                      />
                      {goalWeight !== '' && weightDifference !== 0 && (
                        <p className="text-xs mt-1">
                          {weightDifference < 0 ? (
                            <span className="text-green-500">Loss of {Math.abs(weightDifference).toFixed(1)}kg</span>
                          ) : (
                            <span className="text-blue-500">Gain of {weightDifference.toFixed(1)}kg</span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timeframe">Timeframe (weeks)</Label>
                    <Select value={timeframe} onValueChange={setTimeframe}>
                      <SelectTrigger id="timeframe">
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4">4 weeks</SelectItem>
                        <SelectItem value="8">8 weeks</SelectItem>
                        <SelectItem value="12">12 weeks</SelectItem>
                        <SelectItem value="16">16 weeks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="diet-type">Diet Type</Label>
                    <Select value={dietType} onValueChange={setDietType}>
                      <SelectTrigger id="diet-type">
                        <SelectValue placeholder="Select diet type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="low-carb">Low Carb</SelectItem>
                        <SelectItem value="high-protein">High Protein</SelectItem>
                        <SelectItem value="mediterranean">Mediterranean</SelectItem>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="meal-count">Number of Meals per Day</Label>
                      <span className="text-sm font-medium">{mealCount}</span>
                    </div>
                    <Slider
                      id="meal-count"
                      min={2}
                      max={6}
                      step={1}
                      value={[mealCount]}
                      onValueChange={(value) => setMealCount(value[0])}
                      className="py-4"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch id="include-snacks" checked={includeSnacks} onCheckedChange={setIncludeSnacks} />
                    <Label htmlFor="include-snacks">Include Snacks</Label>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={generateDietPlan}
                    disabled={isLoading || goalWeight === ''}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating with AI...
                      </>
                    ) : (
                      <>
                        Generate Personalized Diet Plan
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                {/* ...existing code... */}
                <CardHeader>
                  <CardTitle>Health Considerations</CardTitle>
                  <CardDescription>These factors will be considered in your plan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Activity Level</Label>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {healthMetrics.activityLevel || "Moderate"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Affects calorie needs
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Medical Conditions</Label>
                    <div className="bg-muted p-3 rounded-md text-sm">
                      {healthMetrics.chronicConditions || "No conditions specified"}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Allergies</Label>
                    <div className="bg-muted p-3 rounded-md text-sm">
                      {healthMetrics.allergies || "No allergies specified"}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Dietary Information</Label>
                    <div className="bg-muted p-3 rounded-md text-sm">
                      {healthMetrics.dietType || "No specific diet"}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="text-sm text-muted-foreground flex flex-col items-start gap-2">
                  <div className="p-4 border border-blue-100 bg-blue-50 dark:border-blue-900 dark:bg-blue-950 rounded-md w-full">
                    <p className="font-medium text-blue-600 dark:text-blue-400 mb-2">How our AI works:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Analyzes your health data and goals</li>
                      <li>Creates a personalized meal plan with precise macros</li>
                      <li>Generates food recommendations based on your dietary needs</li>
                      <li>Creates meal visuals to make your plan more engaging</li>
                    </ul>
                    <p className="mt-2 text-xs">For precise dietary advice, consult a nutritionist.</p>
                  </div>
                </CardFooter>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="view">
          {isExistingPlanLoading ? (
            <div className="space-y-6">
              <div className="space-y-4">
                <Skeleton className="h-10 w-64" />
                <div className="flex gap-4">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-8 w-32" />
                </div>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <MealCardSkeleton />
                <MealCardSkeleton />
                <MealCardSkeleton />
              </div>
            </div>
          ) : savedPlan ? (
            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">
                  Your {savedPlan.dietType ? (
                    `${savedPlan.dietType.charAt(0).toUpperCase() + savedPlan.dietType.slice(1)}`
                  ) : 'Personalized'} Diet Plan
                </h2>
                <div className="flex flex-wrap items-center gap-4">
                  <Badge variant="outline" className="text-base py-1.5">
                    {savedPlan.dailyCalories} Calories/Day
                  </Badge>
                  <Badge variant="outline" className="text-base py-1.5">
                    {savedPlan.mealCount} Meals
                  </Badge>
                  {savedPlan.includeSnacks && (
                    <Badge variant="outline" className="text-base py-1.5">
                      Includes Snacks
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-base py-1.5">
                    {savedPlan.timeframe} Week Plan
                  </Badge>
                  <Badge variant="outline" className="text-base py-1.5">
                    Goal: {savedPlan.goalWeight}kg
                  </Badge>
                </div>
                <div className="flex space-x-2 mt-4">
                  {savedPlan._id && <DietPlanPdf plan={savedPlan} />}
                  <Link href="/diet-plan/weekly">
                    <Button variant="outline" size="sm">
                      <Calendar className="mr-2 h-4 w-4" />
                      Weekly Schedule
                    </Button>
                  </Link>
                  <Link href="/diet-plan/history">
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      View All Plans
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {savedPlan.meals && savedPlan.meals.map((meal: any, index: number) => (
                  <MealCard key={index} meal={meal} />
                ))}
              </div>
              
              <Card className="bg-primary-50 border-primary-100 dark:bg-primary-950 dark:border-primary-900">
                <CardHeader>
                  <CardTitle>Diet Plan Insights</CardTitle>
                  <CardDescription>Key information about your plan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 bg-background rounded-md shadow-sm">
                      <h4 className="font-semibold mb-1">Calorie Distribution</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        How your calories are distributed throughout the day
                      </p>
                      <div className="space-y-2">
                        {savedPlan.meals && savedPlan.meals.map((meal: any, index: number) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm">{meal.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{meal.calories} kcal</span>
                              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary"
                                  style={{ width: `${(meal.calories / savedPlan.dailyCalories) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-background rounded-md shadow-sm">
                      <h4 className="font-semibold mb-1">Diet Recommendations</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Tips to maximize results with this plan
                      </p>
                      <ul className="text-sm space-y-1 list-disc pl-5">
                        <li>Stay hydrated with at least 8 glasses of water daily</li>
                        <li>Try to eat your meals at consistent times each day</li>
                        <li>Prioritize whole foods over processed alternatives</li>
                        <li>Track your progress weekly and adjust as needed</li>
                        <li>Combine this plan with appropriate physical activity</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-6">
                  <Button 
                    onClick={() => (document.querySelector('[data-value="create"]') as HTMLElement)?.click()}
                    variant="outline"
                    className="ml-auto"
                  >
                    Create New Plan
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Salad className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold">No Diet Plan Yet</h3>
              <p className="text-muted-foreground mb-6">Create your first personalized diet plan</p>
              <Button onClick={() => (document.querySelector('[data-value="create"]') as HTMLElement)?.click()}>
                Create Diet Plan
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

