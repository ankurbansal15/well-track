"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader,CardDescription, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { HeartIcon, BeakerIcon, LightBulbIcon,BoltIcon } from "@heroicons/react/24/solid"
import { 
  Activity, Heart, Thermometer, Moon, BarChart3, Scale,
  TrendingUp, Clock, Zap, Users, Info, AlertTriangle
} from "lucide-react"
import FillData from "@/components/fill-data"
import { format } from "date-fns"
import { Progress } from "@/components/ui/progress"

interface HealthMetrics {
    id:string;
    userId: string;
    height: number;
    weight: number;
    age: number;
    gender: string;
    dateOfBirth?: Date;
    email?: string;
    phone?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    activityLevel: string;
    smokingStatus?: string;
    dietType?: string;
    bloodPressure?: string;
    heartRate?: number;
    respiratoryRate?: number;
    temperature?: number;
    sleepDuration?: number;
    stressLevel?: number;
    chronicConditions?: string;
    allergies?: string;
    medications?: string;
    familyHistory?: string;
    surgeries?: string;
    fitnessGoals?: string;
    recordedAt: Date;
}

const MotionCard = motion(Card);

export default function MetricsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("vitals")

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

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'No date available';
    try {
      return format(new Date(date), 'MMMM dd, yyyy');
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  // Show an animated loading state while checking authentication or fetching data
  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="text-center">
          <motion.div
            animate={{
              rotate: 360,
              transition: { duration: 1, repeat: Infinity, ease: "linear" }
            }}
          >
            <Activity className="h-12 w-12 text-primary mx-auto mb-4" />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-muted-foreground"
          >
            Loading your health dashboard...
          </motion.p>
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
    return <FillData />
  }

  return (
    <div className="w-full grid gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Health Metrics</h1>
        <p className="text-muted-foreground">Monitor your vital health metrics and trends.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-red-400 to-pink-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">Blood Pressure</CardTitle>
            <HeartIcon className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">120/80</div>
            <p className="text-xs text-red-100">Last measured 2h ago</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-400 to-indigo-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">Heart Rate</CardTitle>
            <BoltIcon className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">75 BPM</div>
            <p className="text-xs text-blue-100">Resting rate</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-400 to-indigo-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">Oxygen Level</CardTitle>
            <LightBulbIcon className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">98%</div>
            <p className="text-xs text-purple-100">Normal range</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-400 to-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">Stress Level</CardTitle>
            <BeakerIcon className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">Low</div>
            <p className="text-xs text-green-100">Based on HRV</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Blood Pressure History</CardTitle>
            <CardDescription>Last 30 days of readings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Blood pressure chart will be displayed here
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Heart Rate Variability</CardTitle>
            <CardDescription>24-hour analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Heart rate variability chart will be displayed here
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}