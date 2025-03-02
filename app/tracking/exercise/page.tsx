"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const exercises = [
  { name: "Push-ups", caloriesPerRep: 0.5 },
  { name: "Sit-ups", caloriesPerRep: 0.3 },
  { name: "Squats", caloriesPerRep: 0.6 },
  { name: "Jumping Jacks", caloriesPerRep: 0.2 },
  { name: "Burpees", caloriesPerRep: 1.0 },
]

export default function ExerciseTrackingPage() {
  const [selectedExercise, setSelectedExercise] = useState(exercises[0])
  const [sets, setSets] = useState(3)
  const [reps, setReps] = useState(10)
  const [caloriesBurned, setCaloriesBurned] = useState<number | null>(null)

  const calculateCalories = () => {
    const totalReps = sets * reps
    const calories = totalReps * selectedExercise.caloriesPerRep
    setCaloriesBurned(Math.round(calories))
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Exercise Tracking</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Log Exercise</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="exercise">Select Exercise</Label>
                <Select
                  onValueChange={(value) =>
                    setSelectedExercise(exercises.find((e) => e.name === value) || exercises[0])
                  }
                >
                  <SelectTrigger id="exercise">
                    <SelectValue placeholder="Select an exercise" />
                  </SelectTrigger>
                  <SelectContent>
                    {exercises.map((exercise) => (
                      <SelectItem key={exercise.name} value={exercise.name}>
                        {exercise.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sets">Number of Sets</Label>
                <Input
                  id="sets"
                  type="number"
                  min="1"
                  value={sets}
                  onChange={(e) => setSets(Number.parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reps">Reps per Set</Label>
                <Input
                  id="reps"
                  type="number"
                  min="1"
                  value={reps}
                  onChange={(e) => setReps(Number.parseInt(e.target.value))}
                />
              </div>
              <Button type="button" onClick={calculateCalories} className="w-full">
                Log Exercise
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Calories Burned</CardTitle>
          </CardHeader>
          <CardContent>
            {caloriesBurned === null ? (
              <p className="text-center text-gray-500">Log an exercise to see calories burned</p>
            ) : (
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">{caloriesBurned}</p>
                <p className="text-xl text-gray-500">Estimated Calories Burned</p>
                <p className="mt-4 text-sm text-gray-400">Logged at: {new Date().toLocaleTimeString()}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

