"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Loader2, Activity, Heart, Droplets, Scale, Utensils, Moon, Plus, PenBox, Pencil, History, Zap, TrendingUp, Salad, ThermometerSnowflake, CalendarClock, Wind, HeartIcon, BoltIcon, MoonIcon } from "lucide-react"
import Link from "next/link"
import FillData from "@/components/fill-data"
import { HealthMetricsDisplay } from "@/components/health-metrics-display"
import { HealthInsights } from "@/components/insights/health-insights"
import { FireIcon } from "@heroicons/react/24/solid"

interface HealthMetrics {
  id: string
  userId: string
  height: number
  weight: number
  age: number
  gender: string
  activityLevel: string
  bloodPressure?: string
  heartRate?: number
  sleepDuration?: number
  stressLevel?: number
  recordedAt: string
  // Additional fields from the API
  dateOfBirth?: string
  email?: string
  phone?: string
  emergencyContact?: string
  emergencyPhone?: string
  smokingStatus?: string
  dietType?: string
  respiratoryRate?: number
  temperature?: number
  chronicConditions?: string[]
  allergies?: string[]
  medications?: string[]
  familyHistory?: string[]
  surgeries?: string[]
  fitnessGoals?: string[]
  history?: any[]
  historyCount?: number
  hasHistoricalData?: boolean
}

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Only fetch data if the user is authenticated
    if (status === "authenticated") {
      fetchHealthMetrics()
    } else if (status === "unauthenticated") {
      // If definitely not authenticated, redirect to login
      router.push("/login")
    }
    // Don't do anything while status is "loading"
  }, [status, router])

  const fetchHealthMetrics = async () => {
    try {
      const response = await fetch("/api/health/latest")
      
      if (!response.ok) {
        throw new Error("Failed to fetch health metrics")
      }
      
      const data = await response.json()
      setHealthMetrics(data)
    } catch (error) {
      console.error("Error fetching health metrics:", error)
    } finally {
      setLoading(false)
    }
  }

  // Show loading state while checking authentication or fetching data
  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, don't render anything (we're redirecting)
  if (status === "unauthenticated") {
    return null
  }

  // If authenticated but no health data
  if (!healthMetrics && !loading) {
    return (
      <FillData/>
    )
  }


  return (
    <div className="w-full grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your health overview.</p>
        </div>
        <Button onClick={() => router.push("/health-form")}>Update Health Data</Button>
      </div>

           <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-4 h-14 mb-6">
          <TabsTrigger value="overview" className="text-base">Overview</TabsTrigger>
          <TabsTrigger value="details" className="text-base">Health Details</TabsTrigger>
          <TabsTrigger value="insights" className="text-base">AI Insights</TabsTrigger>
          <TabsTrigger value="tracking" className="text-base">Tracking</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-red-400 to-pink-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Heart Rate</CardTitle>
            <HeartIcon className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{healthMetrics?.heartRate || "N/A"} BPM</div>
            <p className="text-xs text-red-100">Last measured</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-400 to-indigo-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Blood Pressure</CardTitle>
            <BoltIcon className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{healthMetrics?.bloodPressure || "N/A"}</div>
            <p className="text-xs text-blue-100">Last measured</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-400 to-indigo-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Sleep</CardTitle>
            <MoonIcon className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{healthMetrics?.sleepDuration || "N/A"} hrs</div>
            <p className="text-xs text-purple-100">Last night</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-400 to-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Stress Level</CardTitle>
            <FireIcon className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{healthMetrics?.stressLevel || "N/A"}</div>
            <p className="text-xs text-green-100">Current level</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
            {/* Health Summary Card - AI Generated */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle>Health Summary</CardTitle>
                  <div className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">AI Generated</div>
                </div>
                <CardDescription>Overall health assessment based on your data</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <Zap className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Your metrics are within healthy ranges</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Continue maintaining your current lifestyle habits for optimal health.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <Activity className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Steady progress in physical activity</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        You've maintained consistent activity levels over the past month.
                      </p>
                    </div>
                  </div>
                </div>
                <Link href="#insights">
                  <Button className="w-full mt-6" variant="outline">View Detailed AI Insights</Button>
                </Link>
              </CardContent>
            </Card>
            
            {/* Recommendations Card - AI Generated */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle>Personalized Recommendations</CardTitle>
                  <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">AI Generated</div>
                </div>
                <CardDescription>Based on your recent health data</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="min-w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                      <Droplets className="h-4 w-4 text-amber-600" />
                    </div>
                    <p>Increase water intake by 500ml daily</p>
                  </div>
                  <div className="flex items-center">
                    <div className="min-w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <Activity className="h-4 w-4 text-purple-600" />
                    </div>
                    <p>Add 15 minutes of stretching to your morning routine</p>
                  </div>
                  <div className="flex items-center">
                    <div className="min-w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <Moon className="h-4 w-4 text-green-600" />
                    </div>
                    <p>Your sleep pattern is consistent, keep it up!</p>
                  </div>
                  <div className="flex items-center">
                    <div className="min-w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <Heart className="h-4 w-4 text-blue-600" />
                    </div>
                    <p>Try meditation to help manage stress levels</p>
                  </div>
                </div>
                <Link href="#insights">
                  <Button className="w-full mt-6" variant="outline">View All AI Recommendations</Button>
                </Link>
              </CardContent>
            </Card>
          </div>        

        </TabsContent>        
        {/* Health Details Tab - New */}
        <TabsContent value="details" className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-lg mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Complete Health Profile</h3>
              <Link href="/initial-health-form">
                <Button variant="outline" size="sm">
                  <Pencil className="h-4 w-4 mr-1" /> Update Health Data
                </Button>
              </Link>
            </div>
            <p className="text-muted-foreground">View all your health metrics and medical information in one place.</p>
          </div>
          
          <HealthMetricsDisplay healthMetrics={healthMetrics} />
        </TabsContent>
        
        {/* AI Insights Tab - New */}
        <TabsContent value="insights" id="insights" className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-lg mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">AI-Powered Health Insights</h3>
              <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Powered by Gemini AI</div>
            </div>
            <p className="text-muted-foreground">Get personalized health insights and recommendations based on your data.</p>
          </div>
          
          {healthMetrics?.userId && (
            <HealthInsights userId={healthMetrics.userId} />
          )}
        </TabsContent>
        
        {/* Tracking Tab - Enhanced */}
        <TabsContent value="tracking" className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-lg mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Health Tracking</h3>
              <div className="flex space-x-2">
                <Link href="/tracking">
                  <Button variant="outline" size="sm">
                    <CalendarClock className="h-4 w-4 mr-1" /> View Tracking History
                  </Button>
                </Link>
                <Link href="/tracking/new">
                  <Button variant="default" size="sm">
                    <Plus className="h-4 w-4 mr-1" /> Record New Data
                  </Button>
                </Link>
              </div>
            </div>
            <p className="text-muted-foreground">Track your health metrics over time to monitor progress and identify trends.</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Measurements</CardTitle>
                <CardDescription>Your latest health tracking entries</CardDescription>
              </CardHeader>
              <CardContent>
                {healthMetrics?.hasHistoricalData ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="font-medium">Metric</span>
                      <span className="font-medium">Value</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Weight</span>
                      <span>{healthMetrics.weight} kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Blood Pressure</span>
                      <span>{healthMetrics.bloodPressure || "--"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Heart Rate</span>
                      <span>{healthMetrics.heartRate || "--"} bpm</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Sleep Duration</span>
                      <span>{healthMetrics.sleepDuration || "--"} hrs</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">No historical data available yet</p>
                    <Link href="/tracking/new">
                      <Button>Record Your First Entry</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="w-full flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {healthMetrics?.historyCount 
                      ? `${healthMetrics.historyCount} total records` 
                      : "Start tracking today"}
                  </span>
                  <Link href="/dashboard/history">
                    <Button variant="ghost" size="sm">View All History</Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tracking Reminders</CardTitle>
                <CardDescription>Stay consistent with your health tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <Scale className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Daily Weight</p>
                        <p className="text-xs text-muted-foreground">Every morning</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Set Reminder</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                    <div className="flex items-center">
                      <div className="bg-red-100 p-2 rounded-full mr-3">
                        <Heart className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">Blood Pressure</p>
                        <p className="text-xs text-muted-foreground">Every 3 days</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Set Reminder</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <Salad className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Meal Tracking</p>
                        <p className="text-xs text-muted-foreground">After each meal</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Set Reminder</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

    </div>
  )
}
