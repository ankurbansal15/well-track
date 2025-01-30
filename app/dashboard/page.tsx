"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BeakerIcon, HeartIcon, BoltIcon, FireIcon, MoonIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  return (
    <div className="w-full grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, John! Here's your health overview.</p>
        </div>
        <Button onClick={() => router.push('/health-form')}>Update Health Data</Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-red-400 to-pink-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Heart Rate</CardTitle>
            <HeartIcon className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">72 BPM</div>
            <p className="text-xs text-red-100">Normal range</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-400 to-indigo-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Blood Pressure</CardTitle>
            <BoltIcon className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">120/80</div>
            <p className="text-xs text-blue-100">Optimal</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-400 to-indigo-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Sleep</CardTitle>
            <MoonIcon className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">7.5 hrs</div>
            <p className="text-xs text-purple-100">Last night</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-400 to-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Calories</CardTitle>
            <FireIcon className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">1,850</div>
            <p className="text-xs text-green-100">Daily intake</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Health Report</CardTitle>
            <CardDescription>Your health trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Health metrics chart will be displayed here
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>Personalized health suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full p-2 bg-muted">
                  <BeakerIcon className="h-4 w-4 text-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Mental Wellness Check</p>
                  <p className="text-sm text-muted-foreground">
                    Schedule your monthly mental health assessment
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full p-2 bg-muted">
                  <BoltIcon className="h-4 w-4 text-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Exercise Routine</p>
                  <p className="text-sm text-muted-foreground">
                    Increase daily steps to meet your 10,000 steps goal
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full p-2 bg-muted">
                  <FireIcon className="h-4 w-4 text-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Dietary Suggestion</p>
                  <p className="text-sm text-muted-foreground">
                    Add more protein-rich foods to your diet
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

