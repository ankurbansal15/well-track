import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  BoltIcon,
  ChartBarSquareIcon,
  ArrowDownTrayIcon,
  HeartIcon,
  ChartBarIcon,
  ShareIcon,
  FireIcon,
  BeakerIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/solid"

export default function ReportsPage() {
  return (
    <div className="w-full grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Health Reports</h1>
          <p className="text-muted-foreground">Comprehensive analysis of your health data and trends.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <ShareIcon className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button>
            <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <ChartBarSquareIcon className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="vitals" className="flex items-center gap-2">
            <HeartIcon className="h-4 w-4" />
            Vitals
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <BoltIcon className="h-4 w-4" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="flex items-center gap-2">
            <FireIcon className="h-4 w-4" />
            Nutrition
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-red-400 to-pink-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Health Score</CardTitle>
                <HeartIcon className="h-4 w-4 text-white" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">85/100</div>
                <p className="text-xs text-red-100">↑ 5 from last month</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-400 to-indigo-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Activity Level</CardTitle>
                <BoltIcon className="h-4 w-4 text-white" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">Above Average</div>
                <p className="text-xs text-blue-100">Based on your age group</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-400 to-emerald-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">BMI</CardTitle>
                <ChartBarIcon className="h-4 w-4 text-white" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">22.5</div>
                <p className="text-xs text-green-100">Normal range</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-400 to-indigo-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Risk Level</CardTitle>
                <BeakerIcon className="h-4 w-4 text-white" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">Low</div>
                <p className="text-xs text-purple-100">Based on current data</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Yearly Health Trends</CardTitle>
                <CardDescription>Your health metrics over the past 12 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Health trends chart will be displayed here
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Health Predictions</CardTitle>
                <CardDescription>AI-powered health forecasting</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Cardiovascular Health",
                      prediction: "Positive trend detected",
                      recommendation: "Continue regular exercise routine",
                      date: "Next 3 months",
                    },
                    {
                      title: "Sleep Quality",
                      prediction: "Minor disruption likely",
                      recommendation: "Adjust evening routine",
                      date: "Next month",
                    },
                    {
                      title: "Stress Levels",
                      prediction: "Potential increase",
                      recommendation: "Consider meditation practices",
                      date: "Next 2 weeks",
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex flex-col space-y-2 rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{item.title}</h4>
                        <CalendarDaysIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-sm">{item.prediction}</p>
                      <p className="text-sm text-muted-foreground">{item.recommendation}</p>
                      <p className="text-xs text-muted-foreground">Timeframe: {item.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vitals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vital Signs History</CardTitle>
              <CardDescription>Detailed view of your vital signs over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {[
                  {
                    title: "Blood Pressure",
                    current: "120/80 mmHg",
                    trend: "Stable",
                    lastMeasured: "2 hours ago",
                  },
                  {
                    title: "Heart Rate",
                    current: "72 BPM",
                    trend: "Slightly elevated",
                    lastMeasured: "1 hour ago",
                  },
                  {
                    title: "Body Temperature",
                    current: "98.6°F",
                    trend: "Normal",
                    lastMeasured: "6 hours ago",
                  },
                  {
                    title: "Respiratory Rate",
                    current: "16 breaths/min",
                    trend: "Normal",
                    lastMeasured: "6 hours ago",
                  },
                ].map((vital) => (
                  <div key={vital.title} className="flex flex-col space-y-2">
                    <h3 className="font-semibold">{vital.title}</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Current</p>
                        <p className="text-lg font-medium">{vital.current}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Trend</p>
                        <p className="text-lg font-medium">{vital.trend}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Last Measured</p>
                        <p className="text-lg font-medium">{vital.lastMeasured}</p>
                      </div>
                    </div>
                    <div className="h-[100px] flex items-center justify-center text-muted-foreground border rounded-lg">
                      {vital.title} trend chart will be displayed here
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-gradient-to-br from-blue-400 to-indigo-500">
              <CardHeader>
                <CardTitle className="text-white">Daily Activity</CardTitle>
                <CardDescription className="text-blue-100">Today's activity summary</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: "Steps", value: "8,439", target: "10,000" },
                    { label: "Distance", value: "5.2 km", target: "8 km" },
                    { label: "Active Minutes", value: "45", target: "60" },
                    { label: "Calories Burned", value: "420", target: "500" },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-white">{item.label}</p>
                        <p className="text-2xl font-bold text-white">{item.value}</p>
                      </div>
                      <p className="text-sm text-blue-100">Target: {item.target}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1 bg-gradient-to-br from-purple-400 to-pink-500">
              <CardHeader>
                <CardTitle className="text-white">Weekly Summary</CardTitle>
                <CardDescription className="text-purple-100">Activity trends this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-white">
                  Weekly activity chart will be displayed here
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-400 to-emerald-500">
              <CardHeader>
                <CardTitle className="text-white">Activity Types</CardTitle>
                <CardDescription className="text-green-100">Breakdown by activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: "Walking", duration: "45 mins", calories: "150" },
                    { type: "Running", duration: "30 mins", calories: "280" },
                    { type: "Cycling", duration: "20 mins", calories: "160" },
                    { type: "Swimming", duration: "15 mins", calories: "120" },
                  ].map((activity) => (
                    <div key={activity.type} className="flex justify-between items-center">
                      <p className="font-medium text-white">{activity.type}</p>
                      <div className="flex gap-4">
                        <p className="text-sm text-green-100">{activity.duration}</p>
                        <p className="text-sm text-green-100">{activity.calories} cal</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="nutrition" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-gradient-to-br from-yellow-400 to-orange-500">
              <CardHeader>
                <CardTitle className="text-white">Calorie Summary</CardTitle>
                <CardDescription className="text-yellow-100">Today's nutrition overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-white">Consumed</p>
                      <p className="text-2xl font-bold text-white">1,850</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">Target</p>
                      <p className="text-2xl font-bold text-white">2,200</p>
                    </div>
                  </div>
                  <div className="h-2 bg-yellow-200 rounded-full overflow-hidden">
                    <div className="h-full bg-white" style={{ width: "84%" }} />
                  </div>
                  <p className="text-sm text-yellow-100 text-center">350 calories remaining</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-400 to-red-500">
              <CardHeader>
                <CardTitle className="text-white">Macronutrients</CardTitle>
                <CardDescription className="text-pink-100">Daily breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Protein", amount: "75g", target: "90g" },
                    { name: "Carbs", amount: "220g", target: "250g" },
                    { name: "Fat", amount: "55g", target: "70g" },
                    { name: "Fiber", amount: "22g", target: "30g" },
                  ].map((macro) => (
                    <div key={macro.name} className="space-y-2">
                      <div className="flex justify-between">
                        <p className="font-medium text-white">{macro.name}</p>
                        <p className="text-sm text-pink-100">
                          {macro.amount} / {macro.target}
                        </p>
                      </div>
                      <div className="h-2 bg-red-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white"
                          style={{
                            width: `${(Number.parseInt(macro.amount) / Number.parseInt(macro.target)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-400 to-blue-500">
              <CardHeader>
                <CardTitle className="text-white">Meal Log</CardTitle>
                <CardDescription className="text-indigo-100">Today's meals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      meal: "Breakfast",
                      time: "8:00 AM",
                      calories: 450,
                      items: "Oatmeal, banana, almonds",
                    },
                    {
                      meal: "Lunch",
                      time: "12:30 PM",
                      calories: 650,
                      items: "Grilled chicken salad, quinoa",
                    },
                    {
                      meal: "Snack",
                      time: "3:30 PM",
                      calories: 200,
                      items: "Greek yogurt, berries",
                    },
                    {
                      meal: "Dinner",
                      time: "7:00 PM",
                      calories: 550,
                      items: "Salmon, vegetables, brown rice",
                    },
                  ].map((meal) => (
                    <div key={meal.meal} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-white">{meal.meal}</p>
                          <p className="text-sm text-indigo-100">{meal.time}</p>
                        </div>
                        <p className="text-sm font-medium text-white">{meal.calories} cal</p>
                      </div>
                      <p className="text-sm text-indigo-100">{meal.items}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

