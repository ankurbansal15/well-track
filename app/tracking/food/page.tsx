"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FlameIcon as FireIcon } from "lucide-react"
import { supabase } from "@/lib/supabase"

type EntryMethod = "image" | "nameQuantity" | "calories"

interface FoodEntry {
  id: string
  food_name: string
  calories: number
  recorded_at: string
}

export default function FoodTrackingPage() {
  const [entryMethod, setEntryMethod] = useState<EntryMethod>("nameQuantity")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [calories, setCalories] = useState<number | null>(null)
  const [foodName, setFoodName] = useState<string>("")
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([])
  const [totalCalories, setTotalCalories] = useState<number>(0)

  useEffect(() => {
    const fetchFoodEntries = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("food_tracking")
        .select("*")
        .eq("user_id", user.id)
        .gte("recorded_at", new Date().toISOString().split("T")[0])
        .order("recorded_at", { ascending: false })

      if (error) {
        console.error("Error fetching food entries:", error)
      } else {
        setFoodEntries(data)
        setTotalCalories(data.reduce((sum, entry) => sum + entry.calories, 0))
      }
    }

    fetchFoodEntries()

    const subscription = supabase
      .channel("food_tracking_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "food_tracking" }, (payload) => {
        fetchFoodEntries()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
        // In a real app, you would send this image to a backend for analysis
        // For now, we'll just set a random calorie count
        setCalories(Math.floor(Math.random() * 500) + 100)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const newEntry = {
      user_id: user.id,
      food_name: foodName || "Unknown Food",
      calories: calories || 0,
    }

    const { data, error } = await supabase.from("food_tracking").insert([newEntry])

    if (error) {
      console.error("Error adding food entry:", error)
    } else {
      setFoodName("")
      setCalories(null)
      setSelectedImage(null)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Food Tracking</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Log Your Food</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="food-name">Food Name</Label>
                <Input
                  id="food-name"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="Enter food name"
                />
              </div>
              <div>
                <Label htmlFor="calories">Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  value={calories || ""}
                  onChange={(e) => setCalories(Number(e.target.value))}
                  placeholder="Enter calories"
                />
              </div>
              <Button type="submit" className="w-full">
                Log Food
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <FireIcon className="mr-2 h-6 w-6 text-primary" />
              Total Calories Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="text-6xl font-bold text-primary animate-pulse">{totalCalories}</div>
              <p className="mt-2 text-xl text-muted-foreground">calories</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Food Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {foodEntries.map((entry) => (
              <li key={entry.id} className="flex justify-between items-center">
                <span>{entry.food_name}</span>
                <span className="font-bold">{entry.calories} calories</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

