"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BoltIcon,
  FlameIcon as FireIcon,
  MoonIcon,
  UtensilsCrossedIcon,
  DumbbellIcon,
  BedIcon,
  SunIcon,
  Loader2Icon,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

// Sleep record interface
interface SleepRecord {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  quality: string;
}

export default function TrackingPage() {
  const [sleepData, setSleepData] = useState<SleepRecord[]>([]);
  const [sleepLoading, setSleepLoading] = useState(false);
  const [latestSleep, setLatestSleep] = useState<SleepRecord | null>(null);
  const [averageDuration, setAverageDuration] = useState(0);
  const [sleepQuality, setSleepQuality] = useState("N/A");
  const [sleepStreak, setSleepStreak] = useState(0);

  useEffect(() => {
    async function fetchSleepData() {
      setSleepLoading(true);
      try {
        const response = await fetch('/api/sleep?limit=7');
        
        if (response.ok) {
          const data = await response.json();
          setSleepData(data);
          
          // Set latest sleep record
          if (data.length > 0) {
            setLatestSleep(data[0]);
            
            // Calculate average duration (in minutes)
            const totalDuration = data.reduce((sum: number, record: SleepRecord) => sum + record.duration, 0);
            const avgDuration = Math.round(totalDuration / data.length);
            setAverageDuration(avgDuration);
            
            // Determine overall sleep quality
            const qualityMap: { [key: string]: number } = {
              poor: 1,
              fair: 2,
              good: 3,
              excellent: 4
            };
            
            const qualitySum = data.reduce((sum: number, record: SleepRecord) => 
              sum + (qualityMap[record.quality] || 0), 0);
            
            const avgQuality = qualitySum / data.length;
            
            if (avgQuality >= 3.5) setSleepQuality("Excellent");
            else if (avgQuality >= 2.5) setSleepQuality("Good");
            else if (avgQuality >= 1.5) setSleepQuality("Fair");
            else setSleepQuality("Poor");
            
            // Calculate streak (consecutive days with sleep records)
            // This is a simplified version - a more complex implementation would check actual dates
            setSleepStreak(Math.min(data.length, 7));
          }
        }
      } catch (error) {
        console.error("Error fetching sleep data:", error);
      } finally {
        setSleepLoading(false);
      }
    }

    fetchSleepData();
  }, []);

  // Format duration from minutes to hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="w-full grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daily Tracking</h1>
          <p className="text-muted-foreground">Monitor your daily health and wellness activities.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/tracking/food">
              <UtensilsCrossedIcon className="mr-2 h-4 w-4" />
              Track Food
            </Link>
          </Button>
          <Button asChild>
            <Link href="/tracking/exercise">
              <DumbbellIcon className="mr-2 h-4 w-4" />
              Track Exercise
            </Link>
          </Button>
          <Button asChild>
            <Link href="/tracking/sleep">
              <BedIcon className="mr-2 h-4 w-4" />
              Track Sleep
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <BoltIcon className="h-4 w-4" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="flex items-center gap-2">
            <FireIcon className="h-4 w-4" />
            Nutrition
          </TabsTrigger>
          <TabsTrigger value="exercise" className="flex items-center gap-2">
            <DumbbellIcon className="h-4 w-4" />
            Exercise
          </TabsTrigger>
          <TabsTrigger value="sleep" className="flex items-center gap-2">
            <MoonIcon className="h-4 w-4" />
            Sleep
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Steps</CardTitle>
                <BoltIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">6,892</div>
                <p className="text-xs text-muted-foreground">of 10,000 goal</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Distance</CardTitle>
                <BoltIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2 km</div>
                <p className="text-xs text-muted-foreground">of 5 km goal</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Minutes</CardTitle>
                <BoltIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45 min</div>
                <p className="text-xs text-muted-foreground">of 60 min goal</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
                <FireIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">384</div>
                <p className="text-xs text-muted-foreground">of 500 goal</p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>Your activity throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                Activity timeline chart will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="nutrition" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Calories Intake</CardTitle>
                <UtensilsCrossedIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,850</div>
                <p className="text-xs text-muted-foreground">of 2,200 goal</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Protein</CardTitle>
                <UtensilsCrossedIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">75g</div>
                <p className="text-xs text-muted-foreground">of 90g goal</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Carbs</CardTitle>
                <UtensilsCrossedIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">220g</div>
                <p className="text-xs text-muted-foreground">of 250g goal</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fat</CardTitle>
                <UtensilsCrossedIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">55g</div>
                <p className="text-xs text-muted-foreground">of 70g goal</p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Breakdown</CardTitle>
              <CardDescription>Your daily nutrition intake</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                Nutrition breakdown chart will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="exercise" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Exercises Completed</CardTitle>
                <DumbbellIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Today's total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sets</CardTitle>
                <DumbbellIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">9</div>
                <p className="text-xs text-muted-foreground">Across all exercises</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reps</CardTitle>
                <DumbbellIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">90</div>
                <p className="text-xs text-muted-foreground">Across all exercises</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
                <FireIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">450</div>
                <p className="text-xs text-muted-foreground">From exercises</p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Exercise Log</CardTitle>
              <CardDescription>Your exercise activities for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                Exercise log details will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sleep" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sleep Duration</CardTitle>
                <MoonIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {sleepLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                    <span className="text-muted-foreground">Loading...</span>
                  </div>
                ) : latestSleep ? (
                  <>
                    <div className="text-2xl font-bold">{formatDuration(latestSleep.duration)}</div>
                    <p className="text-xs text-muted-foreground">Last night's sleep</p>
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">No data</div>
                    <p className="text-xs text-muted-foreground">Track your first sleep</p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sleep Quality</CardTitle>
                <MoonIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {sleepLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                    <span className="text-muted-foreground">Loading...</span>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{sleepQuality}</div>
                    <p className="text-xs text-muted-foreground">Based on recent sleep data</p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Sleep</CardTitle>
                <MoonIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {sleepLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                    <span className="text-muted-foreground">Loading...</span>
                  </div>
                ) : averageDuration > 0 ? (
                  <>
                    <div className="text-2xl font-bold">{formatDuration(averageDuration)}</div>
                    <p className="text-xs text-muted-foreground">Last 7 days average</p>
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">No data</div>
                    <p className="text-xs text-muted-foreground">Add sleep records first</p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sleep Streak</CardTitle>
                <BedIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {sleepLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                    <span className="text-muted-foreground">Loading...</span>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{sleepStreak} days</div>
                    <p className="text-xs text-muted-foreground">Consistent sleep tracking</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Sleep Analysis</CardTitle>
              <CardDescription>Your sleep patterns and quality over time</CardDescription>
            </CardHeader>
            <CardContent>
              {sleepLoading ? (
                <div className="flex justify-center items-center h-[200px]">
                  <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : sleepData.length > 0 ? (
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="font-medium mb-2">Recent Sleep Records</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sleepData.slice(0, 4).map((record) => (
                        <div key={record._id} className="bg-card border rounded-md p-3 flex justify-between items-center">
                          <div>
                            <div className="font-medium">{format(new Date(record.date), 'MMM dd, yyyy')}</div>
                            <div className="text-sm text-muted-foreground capitalize">{record.quality} quality</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatDuration(record.duration)}</div>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(record.startTime), 'hh:mm a')} - {format(new Date(record.endTime), 'hh:mm a')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {sleepData.length > 4 && (
                      <div className="mt-3 text-center">
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/tracking/sleep">View all sleep records</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-[200px] flex flex-col items-center justify-center text-muted-foreground">
                  <p className="mb-2">No sleep records found</p>
                  <Button size="sm" asChild>
                    <Link href="/tracking/sleep">Add your first sleep record</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

