"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

const healthFormSchema = z.object({
  // Basic Information
  height: z.number().min(50).max(300),
  weight: z.number().min(20).max(500),
  age: z.number().min(1).max(120),
  gender: z.enum(["male", "female", "other"]),
  dateOfBirth: z.string(),

  // Contact Information
  email: z.string().email(),
  phone: z.string(),
  emergencyContact: z.string(),
  emergencyPhone: z.string(),

  // Lifestyle Factors
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "very_active"]),
  smokingStatus: z.enum(["never", "former", "current"]),
  dietType: z.enum(["omnivore", "vegetarian", "vegan", "pescatarian", "other"]),

  // Vital Signs
  bloodPressureSystolic: z.number().min(70).max(250),
  bloodPressureDiastolic: z.number().min(40).max(150),
  heartRate: z.number().min(40).max(220),
  respiratoryRate: z.number().min(8).max(40),
  temperature: z.number().min(35).max(42),

  // Well-being
  sleepDuration: z.number().min(1).max(24),
  stressLevel: z.number().min(1).max(10),

  // Medical History
  chronicConditions: z.string(),
  allergies: z.string(),
  medications: z.string(),
  familyHistory: z.string(),
  surgeries: z.string(),

  // Fitness Goals
  fitnessGoals: z.array(z.string()).min(1),
})

const steps = [
  { title: "Basic Information", fields: ["height", "weight", "age", "gender", "dateOfBirth"] },
  { title: "Contact Information", fields: ["email", "phone", "emergencyContact", "emergencyPhone"] },
  { title: "Lifestyle", fields: ["activityLevel", "smokingStatus", "dietType"] },
  {
    title: "Vital Signs",
    fields: ["bloodPressureSystolic", "bloodPressureDiastolic", "heartRate", "respiratoryRate", "temperature"],
  },
  { title: "Well-being", fields: ["sleepDuration", "stressLevel"] },
  { title: "Medical History", fields: ["chronicConditions", "allergies", "medications", "familyHistory", "surgeries"] },
  { title: "Fitness Goals", fields: ["fitnessGoals"] },
]

export default function InitialHealthFormPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof healthFormSchema>>({
    resolver: zodResolver(healthFormSchema),
    defaultValues: {
      height: 170,
      weight: 70,
      age: 30,
      gender: "male",
      dateOfBirth: "",
      email: "",
      phone: "",
      emergencyContact: "",
      emergencyPhone: "",
      activityLevel: "moderate",
      smokingStatus: "never",
      dietType: "omnivore",
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      heartRate: 70,
      respiratoryRate: 16,
      temperature: 36.6,
      sleepDuration: 7,
      stressLevel: 5,
      chronicConditions: "",
      allergies: "",
      medications: "",
      familyHistory: "",
      surgeries: "",
      fitnessGoals: [],
    },
  })

  async function onSubmit(values: z.infer<typeof healthFormSchema>) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      setError("User not found. Please log in again.")
      return
    }

    // Check if the user exists in the users table
    const { data: userData, error: userDataError } = await supabase
      .from("users")
      .select("id")
      .eq("id", user.id)
      .single()

    if (userDataError || !userData) {
      setError("User profile not found. Please try logging out and in again.")
      return
    }

    const { error } = await supabase.from("health_metrics").insert([
      {
        user_id: user.id,
        height: values.height,
        weight: values.weight,
        age: values.age,
        gender: values.gender,
        date_of_birth: values.dateOfBirth,
        email: values.email,
        phone: values.phone,
        emergency_contact: values.emergencyContact,
        emergency_phone: values.emergencyPhone,
        activity_level: values.activityLevel,
        smoking_status: values.smokingStatus,
        diet_type: values.dietType,
        blood_pressure: `${values.bloodPressureSystolic}/${values.bloodPressureDiastolic}`,
        heart_rate: values.heartRate,
        respiratory_rate: values.respiratoryRate,
        temperature: values.temperature,
        sleep_duration: values.sleepDuration,
        stress_level: values.stressLevel,
        chronic_conditions: values.chronicConditions,
        allergies: values.allergies,
        medications: values.medications,
        family_history: values.familyHistory,
        surgeries: values.surgeries,
        fitness_goals: values.fitnessGoals,
      },
    ])

    if (error) {
      console.error("Error saving health data:", error)
      setError("An error occurred while saving your health data. Please try again.")
    } else {
      await supabase.from("user_profiles").update({ initial_health_data_submitted: true }).eq("id", user.id)
      router.push("/dashboard")
    }
  }

  const currentStepData = steps[currentStep]

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Welcome to Your Health Journey</CardTitle>
          <CardDescription>
            Let's get to know you better. We'll guide you through a few questions to personalize your experience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">{currentStepData.title}</h2>
                {currentStepData.fields.map((field) => (
                  <FormField
                    key={field}
                    control={form.control}
                    name={field as any}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel>
                          {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")}
                        </FormLabel>
                        <FormControl>
                          {field === "gender" ? (
                            <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : field === "activityLevel" ? (
                            <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your activity level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="sedentary">Sedentary</SelectItem>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="moderate">Moderate</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="very_active">Very Active</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : field === "smokingStatus" ? (
                            <RadioGroup onValueChange={formField.onChange} defaultValue={formField.value}>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="never" />
                                </FormControl>
                                <FormLabel className="font-normal">Never</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="former" />
                                </FormControl>
                                <FormLabel className="font-normal">Former</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="current" />
                                </FormControl>
                                <FormLabel className="font-normal">Current</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          ) : field === "dietType" ? (
                            <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your diet type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="omnivore">Omnivore</SelectItem>
                                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                                <SelectItem value="vegan">Vegan</SelectItem>
                                <SelectItem value="pescatarian">Pescatarian</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : field === "stressLevel" ? (
                            <Slider
                              min={1}
                              max={10}
                              step={1}
                              defaultValue={[formField.value]}
                              onValueChange={(value) => formField.onChange(value[0])}
                            />
                          ) : field === "fitnessGoals" ? (
                            <div className="space-y-2">
                              {[
                                "Weight Loss",
                                "Muscle Gain",
                                "Improve Cardiovascular Health",
                                "Increase Flexibility",
                                "Reduce Stress",
                              ].map((goal) => (
                                <FormItem key={goal} className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={formField.value?.includes(goal)}
                                      onCheckedChange={(checked) => {
                                        const updatedGoals = checked
                                          ? [...(formField.value || []), goal]
                                          : (formField.value || []).filter((value: string) => value !== goal)
                                        formField.onChange(updatedGoals)
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">{goal}</FormLabel>
                                </FormItem>
                              ))}
                            </div>
                          ) : field === "dateOfBirth" ? (
                            <Input type="date" {...formField} />
                          ) : ["chronicConditions", "allergies", "medications", "familyHistory", "surgeries"].includes(
                              field,
                            ) ? (
                            <Textarea {...formField} />
                          ) : (
                            <Input
                              type={
                                field === "email"
                                  ? "email"
                                  : field === "phone" || field === "emergencyPhone"
                                    ? "tel"
                                    : "text"
                              }
                              {...formField}
                              onChange={(e) => {
                                const value = [
                                  "height",
                                  "weight",
                                  "age",
                                  "bloodPressureSystolic",
                                  "bloodPressureDiastolic",
                                  "heartRate",
                                  "respiratoryRate",
                                  "temperature",
                                  "sleepDuration",
                                ].includes(field)
                                  ? Number.parseFloat(e.target.value)
                                  : e.target.value
                                formField.onChange(value)
                              }}
                            />
                          )}
                        </FormControl>
                        <FormDescription>
                          {field === "height" && "Enter your height in centimeters."}
                          {field === "weight" && "Enter your weight in kilograms."}
                          {field === "age" && "Enter your current age."}
                          {field === "dateOfBirth" && "Enter your date of birth."}
                          {field === "activityLevel" && "Select your typical activity level."}
                          {field === "bloodPressureSystolic" && "Enter your systolic blood pressure (the top number)."}
                          {field === "bloodPressureDiastolic" &&
                            "Enter your diastolic blood pressure (the bottom number)."}
                          {field === "heartRate" && "Enter your resting heart rate in beats per minute."}
                          {field === "respiratoryRate" && "Enter your respiratory rate in breaths per minute."}
                          {field === "temperature" && "Enter your body temperature in Celsius."}
                          {field === "sleepDuration" && "Enter your average sleep duration in hours."}
                          {field === "stressLevel" && "Rate your average stress level from 1 (low) to 10 (high)."}
                          {field === "chronicConditions" && "List any chronic conditions you have."}
                          {field === "allergies" && "List any allergies you have."}
                          {field === "medications" && "List any medications you're currently taking."}
                          {field === "familyHistory" && "Provide relevant family medical history."}
                          {field === "surgeries" && "List any surgeries you've had."}
                          {field === "fitnessGoals" && "Select your fitness goals."}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex justify-between">
                {currentStep > 0 && (
                  <Button type="button" variant="outline" onClick={() => setCurrentStep((prev) => prev - 1)}>
                    Previous
                  </Button>
                )}
                {currentStep < steps.length - 1 ? (
                  <Button type="button" onClick={() => setCurrentStep((prev) => prev + 1)}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit">Submit</Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

