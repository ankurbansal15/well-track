"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MoonIcon, SunIcon } from "lucide-react"

export default function SleepTrackingPage() {
  const [sleepStart, setSleepStart] = useState("")
  const [sleepEnd, setSleepEnd] = useState("")
  const [sleepDuration, setSleepDuration] = useState<string | null>(null)

  const calculateSleepDuration = () => {
    const start = new Date(sleepStart)
    const end = new Date(sleepEnd)
    const duration = end.getTime() - start.getTime()
    const hours = Math.floor(duration / (1000 * 60 * 60))
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))
    setSleepDuration(`${hours} hours ${minutes} minutes`)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Sleep Tracking</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Log Sleep</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sleep-start">Sleep Start</Label>
                <div className="flex items-center">
                  <MoonIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="sleep-start"
                    type="datetime-local"
                    value={sleepStart}
                    onChange={(e) => setSleepStart(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sleep-end">Sleep End</Label>
                <div className="flex items-center">
                  <SunIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="sleep-end"
                    type="datetime-local"
                    value={sleepEnd}
                    onChange={(e) => setSleepEnd(e.target.value)}
                  />
                </div>
              </div>
              <Button type="button" onClick={calculateSleepDuration} className="w-full">
                Log Sleep
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sleep Duration</CardTitle>
          </CardHeader>
          <CardContent>
            {sleepDuration === null ? (
              <p className="text-center text-gray-500">Log your sleep to see the duration</p>
            ) : (
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">{sleepDuration}</p>
                <p className="text-xl text-gray-500">Total Sleep Duration</p>
                <p className="mt-4 text-sm text-gray-400">Logged at: {new Date().toLocaleString()}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

