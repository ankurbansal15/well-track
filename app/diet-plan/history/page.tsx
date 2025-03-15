"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { formatDistanceToNow } from "date-fns"
import { ChevronRight, Clock, History, Trash2, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

export default function DietPlanHistoryPage() {
  const [plans, setPlans] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  
  // Track if we're already fetching to avoid duplicate requests
  const fetchingRef = useState<boolean>(false)

  useEffect(() => {
    // Check if we're already fetching to avoid duplicate requests
    if (fetchingRef[0]) return
    
    fetchDietPlanHistory()
    
    // Cleanup function
    return () => {
      fetchingRef[0] = false
    }
  }, [])

  const fetchDietPlanHistory = async () => {
    // Prevent multiple simultaneous fetches
    if (fetchingRef[0]) return
    
    fetchingRef[0] = true
    setIsLoading(true)
    
    try {
      const response = await fetch("/api/diet-plan/history", {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      
      if (!response.ok) {
        throw new Error("Failed to fetch diet plan history")
      }
      
      const data = await response.json()
      setPlans(data)
    } catch (error) {
      console.error("Error fetching diet plan history:", error)
      toast({
        title: "Error",
        description: "Failed to load diet plan history. Please try again later.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
      fetchingRef[0] = false
    }
  }

  const deleteDietPlan = async (id: string) => {
    if (isDeleting) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/diet-plan/${id}`, {
        method: "DELETE",
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      
      if (!response.ok) {
        throw new Error("Failed to delete diet plan")
      }
      
      // Remove the deleted plan from the state
      setPlans(plans.filter(plan => plan._id !== id))
      
      toast({
        title: "Success",
        description: "Diet plan deleted successfully."
      })
    } catch (error) {
      console.error("Error deleting diet plan:", error)
      toast({
        title: "Error",
        description: "Failed to delete diet plan. Please try again later.",
        variant: "destructive"
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-8">
        <Link href="/diet-plan" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Diet Plan History</h1>
          <p className="text-muted-foreground">View and manage your past diet plans</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-64" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : plans.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <History className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No Diet Plan History</h3>
            <p className="text-muted-foreground mb-6 text-center">
              You haven't created any diet plans yet.
            </p>
            <Button asChild>
              <Link href="/diet-plan">Create Your First Diet Plan</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Diet Plan Management</AlertTitle>
            <AlertDescription>
              Click on any diet plan to view its details. You can also delete plans that you no longer need.
            </AlertDescription>
          </Alert>
          
          {plans.map((plan) => (
            <Card key={plan._id} className="hover:bg-muted/50 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      {plan.dietType ? plan.dietType.charAt(0).toUpperCase() + plan.dietType.slice(1) : 'Personalized'} Diet Plan
                      <Badge variant="outline" className="ml-2">
                        {plan.dailyCalories} kcal
                      </Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      Created {plan.createdAt ? formatDistanceToNow(new Date(plan.createdAt), { addSuffix: true }) : 'recently'}
                    </CardDescription>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Diet Plan</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this diet plan? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => deleteDietPlan(plan._id)}
                          disabled={isDeleting}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent className="pt-2 pb-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Goal Weight</p>
                    <p className="font-medium">{plan.goalWeight} kg</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Timeframe</p>
                    <p className="font-medium">{plan.timeframe} weeks</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button 
                  variant="ghost" 
                  className="ml-auto"
                  onClick={() => router.push(`/diet-plan/${plan._id}`)}
                >
                  View Plan <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
