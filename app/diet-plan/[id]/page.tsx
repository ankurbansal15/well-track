"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { MealCard, MealCardSkeleton } from "@/components/ui/meal-card"
import { DietPlanPdf } from "@/components/ui/diet-plan-pdf"
import { ArrowLeft, Calendar, Clock, Download, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

interface PageProps {
  params: {
    id: string
  }
}

export default function DietPlanDetailsPage({ params }: PageProps) {
  const [plan, setPlan] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const isFetchingRef = useRef(false)
  
  useEffect(() => {
    // Prevent duplicate fetching
    if (isFetchingRef.current) return
    isFetchingRef.current = true
    
    const fetchDietPlan = async () => {
      try {
        const response = await fetch(`/api/diet-plan/${params.id}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        })
        
        if (!response.ok) {
          if (response.status === 404) {
            toast({
              title: "Not Found",
              description: "The requested diet plan could not be found.",
              variant: "destructive"
            })
            router.push("/diet-plan")
            return
          }
          throw new Error("Failed to fetch diet plan")
        }
        
        const data = await response.json()
        if (!data || !data.meals) {
          throw new Error("Invalid diet plan data received")
        }
        
        setPlan(data)
      } catch (error) {
        console.error("Error fetching diet plan:", error)
        toast({
          title: "Error",
          description: "Failed to load diet plan. Please try again later.",
          variant: "destructive"
        })
        router.push("/diet-plan")
      } finally {
        setIsLoading(false)
        isFetchingRef.current = false
      }
    }

    fetchDietPlan()
    
    // Cleanup function
    return () => {
      isFetchingRef.current = false
    }
  }, [params.id, router])

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center mb-8">
          <Link href="/diet-plan" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <Skeleton className="h-8 w-64" />
        </div>
        
        <div className="mb-6">
          <Skeleton className="h-10 w-64 mb-3" />
          <div className="flex flex-wrap gap-2 mb-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <MealCardSkeleton />
          <MealCardSkeleton />
          <MealCardSkeleton />
        </div>
      </div>
    )
  }

  if (!plan) return null

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-8">
        <Link href="/diet-plan" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Diet Plan Details</h1>
          <p className="text-muted-foreground">View the details of your personalized diet plan</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-3">
          {plan.dietType ? plan.dietType.charAt(0).toUpperCase() + plan.dietType.slice(1) : 'Personalized'} Diet Plan
        </h2>
        
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge variant="outline" className="text-base py-1.5">
            {plan.dailyCalories} Calories/Day
          </Badge>
          <Badge variant="outline" className="text-base py-1.5 flex items-center">
            <Calendar className="mr-1 h-4 w-4" />
            {plan.timeframe} Week Plan
          </Badge>
          <Badge variant="outline" className="text-base py-1.5">
            Goal: {plan.goalWeight}kg
          </Badge>
          <Badge variant="outline" className="text-base py-1.5 flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            Created {format(new Date(plan.createdAt), "MMM d, yyyy")}
          </Badge>
        </div>
        
        <div className="flex space-x-2 mb-8">
          <DietPlanPdf plan={plan} />
          <Link href="/diet-plan/history">
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              View All Plans
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {plan.meals && Array.isArray(plan.meals) && plan.meals.map((meal: any, index: number) => (
          <MealCard key={index} meal={meal} />
        ))}
      </div>

      <Card className="bg-primary-50 border-primary-100 dark:bg-primary-950 dark:border-primary-900 mb-6">
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
                {plan.meals && Array.isArray(plan.meals) && plan.meals.map((meal: any, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{meal.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{meal.calories} kcal</span>
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary"
                          style={{ width: `${(meal.calories / plan.dailyCalories) * 100}%` }}
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
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/diet-plan">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Diet Plan
          </Link>
        </Button>
        <Button variant="default" asChild>
          <Link href="/diet-plan">
            Create New Plan
          </Link>
        </Button>
      </div>
    </div>
  )
}
