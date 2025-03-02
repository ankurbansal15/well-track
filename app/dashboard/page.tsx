"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HeartIcon, BoltIcon, FlameIcon as FireIcon, MoonIcon } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface HealthMetrics {
  height: number
  weight: number
  age: number
  gender: string
  activity_level: string
  heart_rate?: number
  blood_pressure?: string
  sleep_duration?: number
  stress_level?: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHealthMetrics = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }

      const { data, error } = await supabase
        .from("health_metrics")
        .select("*")
        .eq("user_id", user.id)
        .order("recorded_at", { ascending: false })
        .limit(1)
        .single()

      if (error) {
        console.error("Error fetching health metrics:", error)
      } else {
        setHealthMetrics(data)
      }

      setLoading(false)
    }

    fetchHealthMetrics()
  }, [router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!healthMetrics) {
    return <div>No health data available. Please update your health information.</div>
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-red-400 to-pink-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Heart Rate</CardTitle>
            <HeartIcon className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{healthMetrics.heart_rate || "N/A"} BPM</div>
            <p className="text-xs text-red-100">Last measured</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-400 to-indigo-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Blood Pressure</CardTitle>
            <BoltIcon className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{healthMetrics.blood_pressure || "N/A"}</div>
            <p className="text-xs text-blue-100">Last measured</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-400 to-indigo-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Sleep</CardTitle>
            <MoonIcon className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{healthMetrics.sleep_duration || "N/A"} hrs</div>
            <p className="text-xs text-purple-100">Last night</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-400 to-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Stress Level</CardTitle>
            <FireIcon className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{healthMetrics.stress_level || "N/A"}</div>
            <p className="text-xs text-green-100">Current level</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Health Overview</CardTitle>
            <CardDescription>Your basic health information</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="font-medium">Height</dt>
                <dd>{healthMetrics.height} cm</dd>
              </div>
              <div>
                <dt className="font-medium">Weight</dt>
                <dd>{healthMetrics.weight} kg</dd>
              </div>
              <div>
                <dt className="font-medium">Age</dt>
                <dd>{healthMetrics.age} years</dd>
              </div>
              <div>
                <dt className="font-medium">Gender</dt>
                <dd>{healthMetrics.gender}</dd>
              </div>
              <div>
                <dt className="font-medium">Activity Level</dt>
                <dd>{healthMetrics.activity_level}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>Personalized health suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>Based on your current health data, we recommend:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Maintain a balanced diet rich in fruits and vegetables</li>
                <li>Aim for at least 30 minutes of moderate exercise daily</li>
                <li>Ensure you get 7-9 hours of sleep each night</li>
                <li>Practice stress-reduction techniques like meditation or deep breathing</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

