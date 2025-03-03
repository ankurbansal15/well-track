"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FlameIcon as FireIcon } from "lucide-react"

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
    // Initialize with some mock data if needed
    const mockEntries: FoodEntry[] = [
      {
        id: "1",
        food_name: "Banana",
        calories: 105,
        recorded_at: new Date().toISOString()
      },
      {
        id: "2",
        food_name: "Greek Yogurt",
        calories: 150,
        recorded_at: new Date().toISOString()
      }
    ];
    
    setFoodEntries(mockEntries);
    setTotalCalories(mockEntries.reduce((sum, entry) => sum + entry.calories, 0));
  }, []);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!foodName || !calories) return;
    
    // Create new food entry with local data
    const newEntry: FoodEntry = {
      id: Math.random().toString(36).substring(2, 9),
      food_name: foodName,
      calories: calories,
      recorded_at: new Date().toISOString()
    };

    // Update local state
    const updatedEntries = [newEntry, ...foodEntries];
    setFoodEntries(updatedEntries);
    setTotalCalories(totalCalories + calories);
    
    // Reset form
    setFoodName("");
    setCalories(null);
    setSelectedImage(null);
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

