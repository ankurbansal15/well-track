"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { useSession } from "next-auth/react"
import { Loader2, Check, ArrowLeft, ArrowRight, Weight, Activity, Brain, Moon, Zap, AlertCircle, Heart, Apple, Smile, Frown, Droplets, Pill, Thermometer, Dumbbell } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Define the form schema with Zod
const healthFormSchema = z.object({
  height: z.string().min(1, "Height is required"),
  weight: z.string().min(1, "Weight is required"),
  age: z.string().min(1, "Age is required"),
  gender: z.string().min(1, "Gender is required"),
  activityLevel: z.string().min(1, "Activity level is required"),
  smokingStatus: z.string(),
  dietType: z.string(),
  bloodPressure: z.string().optional(),
  heartRate: z.string().optional(),
  sleepDuration: z.string().optional(),
  stressLevel: z.number().min(1).max(10).default(5),
  allergies: z.string().optional(),
  medications: z.string().optional(),
  chronicConditions: z.string().optional(),
  familyHistory: z.string().optional(),
  surgeries: z.string().optional(),
  fitnessGoals: z.string().optional(),
  alcoholConsumption: z.string(),
  exercisePreference: z.string(),
})

type HealthFormValues = z.infer<typeof healthFormSchema>

export default function InitialHealthFormPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showTips, setShowTips] = useState(true)
  
  // Add the missing animation variants
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  }

  const form = useForm<HealthFormValues>({
    resolver: zodResolver(healthFormSchema),
    defaultValues: {
      height: "",
      weight: "",
      age: "",
      gender: "",
      activityLevel: "",
      smokingStatus: "never",
      dietType: "omnivore",
      bloodPressure: "",
      heartRate: "",
      sleepDuration: "",
      stressLevel: 5,
      allergies: "",
      medications: "",
      chronicConditions: "",
      familyHistory: "",
      surgeries: "",
      fitnessGoals: "",
      alcoholConsumption: "none",
      exercisePreference: "cardio",
    },
  })

  // Define the steps for the form
  const steps = [
    {
      title: "Basic Information",
      description: "Let's start with some basic health metrics",
      fields: ["height", "weight", "age", "gender", "activityLevel"],
    },
    {
      title: "Lifestyle",
      description: "Tell us about your lifestyle habits",
      fields: ["smokingStatus", "dietType", "sleepDuration", "stressLevel", "alcoholConsumption", "exercisePreference"],
    },
    {
      title: "Medical Information",
      description: "Share your medical history to help us personalize your experience",
      fields: ["bloodPressure", "heartRate", "allergies", "medications", "chronicConditions", "familyHistory", "surgeries"],
    },
    {
      title: "Goals & Aspirations",
      description: "Setting clear, achievable goals is the first step toward improving your health and wellbeing",
      fields: ["fitnessGoals"],
    },
  ]

  // Check if the user is authenticated
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }

  async function onSubmit(values: HealthFormValues) {
    setIsSubmitting(true)
    setError(null)

    try {
      // Convert string values to appropriate types
      const formattedValues = {
        ...values,
        height: parseFloat(values.height),
        weight: parseFloat(values.weight),
        age: parseInt(values.age),
        heartRate: values.heartRate ? parseInt(values.heartRate) : undefined,
        sleepDuration: values.sleepDuration ? parseFloat(values.sleepDuration) : undefined,
      }

      const response = await fetch("/api/health/initial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedValues),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to save health data")
      }

      router.push("/dashboard")
    } catch (err: any) {
      console.error("Error saving health data:", err)
      setError(err.message || "An error occurred while saving your health data. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  function nextStep() {
    const fields = steps[currentStep].fields
    const output = form.trigger(fields as any)
    
    output.then((valid) => {
      if (valid) {
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
      }
    })
  }

  function prevStep() {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  // Replace the handleSubmit function with this implementation
  function handleFinalSubmit() {
    if (currentStep === steps.length - 1) {
      form.handleSubmit(onSubmit)()
    }
  }

  const currentStepData = steps[currentStep]

  return (
    <div className="container mx-auto py-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Welcome to Your Health Journey</CardTitle>
            <CardDescription>
              Let's get to know you better. We'll guide you through a few questions to personalize your experience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold">{currentStepData.title}</h2>
                  <p className="text-muted-foreground">{currentStepData.description}</p>
                </div>

                {/* Step 1: Basic Information */}
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="height"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Height (cm)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="175" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight (kg)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="70" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="30" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="non-binary">Non-binary</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="activityLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Activity Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your activity level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                              <SelectItem value="light">Lightly active (light exercise 1-3 days/week)</SelectItem>
                              <SelectItem value="moderate">Moderately active (moderate exercise 3-5 days/week)</SelectItem>
                              <SelectItem value="active">Active (hard exercise 6-7 days/week)</SelectItem>
                              <SelectItem value="very-active">Very active (very hard exercise & physical job)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 2: Lifestyle */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="smokingStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Smoking Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your smoking status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="never">Never smoked</SelectItem>
                              <SelectItem value="former">Former smoker</SelectItem>
                              <SelectItem value="occasional">Occasional smoker</SelectItem>
                              <SelectItem value="regular">Regular smoker</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dietType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Diet Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your diet type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="omnivore">Omnivore (meat & plants)</SelectItem>
                              <SelectItem value="pescatarian">Pescatarian</SelectItem>
                              <SelectItem value="vegetarian">Vegetarian</SelectItem>
                              <SelectItem value="vegan">Vegan</SelectItem>
                              <SelectItem value="keto">Keto</SelectItem>
                              <SelectItem value="paleo">Paleo</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sleepDuration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Average Sleep Duration (hours)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="7.5" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="stressLevel"
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel>Stress Level (1-10)</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <Slider
                                min={1}
                                max={10}
                                step={1}
                                defaultValue={[value]}
                                onValueChange={(vals) => onChange(vals[0])}
                                {...field}
                              />
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Low Stress (1)</span>
                                <span>High Stress (10)</span>
                              </div>
                            </div>
                          </FormControl>
                          <FormDescription>Current value: {value}</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="alcoholConsumption"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <span className="bg-primary/10 p-1 rounded-full">
                              <Droplets className="h-4 w-4 text-primary" />
                            </span>
                            Alcohol Consumption
                          </FormLabel>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2"
                          >
                            {[
                              { value: "none", label: "None" },
                              { value: "occasional", label: "Occasional" },
                              { value: "moderate", label: "Moderate" },
                              { value: "frequent", label: "Frequent" }
                            ].map((option) => (
                              <div key={option.value} className="flex items-center space-x-2">
                                <RadioGroupItem value={option.value} id={`alcohol-${option.value}`} />
                                <label htmlFor={`alcohol-${option.value}`} className="text-sm font-normal cursor-pointer">
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </RadioGroup>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="exercisePreference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <span className="bg-primary/10 p-1 rounded-full">
                              <Dumbbell className="h-4 w-4 text-primary" />
                            </span>
                            Exercise Preference
                          </FormLabel>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                            {[
                              { 
                                value: "cardio", 
                                label: "Cardio", 
                                icon: <Activity className="h-4 w-4" />,
                                description: "Running, cycling, swimming" 
                              },
                              { 
                                value: "strength", 
                                label: "Strength", 
                                icon: <Dumbbell className="h-4 w-4" />,
                                description: "Weight training, resistance" 
                              },
                              { 
                                value: "balanced", 
                                label: "Balanced", 
                                icon: <Zap className="h-4 w-4" />,
                                description: "Mix of cardio and strength" 
                              }
                            ].map((option) => (
                              <div key={option.value}>
                                <Button
                                  type="button"
                                  variant="outline"
                                  className={cn(
                                    "w-full h-auto py-4 justify-start transition-all",
                                    field.value === option.value 
                                      ? "border-primary bg-primary/5 text-foreground" 
                                      : "hover:bg-primary/5 hover:border-primary/30"
                                  )}
                                  onClick={() => field.onChange(option.value)}
                                >
                                  <div className="flex flex-col items-center w-full text-center gap-2">
                                    <div className={cn(
                                      "w-10 h-10 rounded-full flex items-center justify-center",
                                      field.value === option.value 
                                        ? "bg-primary text-primary-foreground" 
                                        : "bg-muted"
                                    )}>
                                      {option.icon}
                                    </div>
                                    <div>
                                      <div className="font-medium">{option.label}</div>
                                      <div className="text-xs text-muted-foreground">{option.description}</div>
                                    </div>
                                  </div>
                                </Button>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 3: Medical Information */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="bloodPressure"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <span className="bg-primary/10 p-1 rounded-full">
                                <Heart className="h-4 w-4 text-primary" />
                              </span>
                              Blood Pressure
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="120/80" {...field} />
                            </FormControl>
                            <FormDescription>
                              Format: systolic/diastolic
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="heartRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <span className="bg-primary/10 p-1 rounded-full">
                                <Activity className="h-4 w-4 text-primary" />
                              </span>
                              Resting Heart Rate (bpm)
                            </FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="70" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                    
                    <Tabs defaultValue="allergies" className="w-full">
                      <TabsList className="grid grid-cols-3 mb-4">
                        <TabsTrigger value="allergies">Allergies</TabsTrigger>
                        <TabsTrigger value="medications">Medications</TabsTrigger>
                        <TabsTrigger value="conditions">Conditions</TabsTrigger>
                      </TabsList>
                      <TabsContent value="allergies">
                        <motion.div variants={itemVariants}>
                          <FormField
                            control={form.control}
                            name="allergies"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <span className="bg-primary/10 p-1 rounded-full">
                                    <AlertCircle className="h-4 w-4 text-primary" />
                                  </span>
                                  Allergies
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="List any allergies you have (food, medication, environmental, etc.)"
                                    className="min-h-[120px] resize-none"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Leave blank if none
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      </TabsContent>
                      <TabsContent value="medications">
                        <motion.div variants={itemVariants}>
                          <FormField
                            control={form.control}
                            name="medications"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <span className="bg-primary/10 p-1 rounded-full">
                                    <Pill className="h-4 w-4 text-primary" />
                                  </span>
                                  Current Medications
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="List any medications you're currently taking"
                                    className="min-h-[120px] resize-none"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Include dosage if known
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      </TabsContent>
                      <TabsContent value="conditions">
                        <motion.div variants={itemVariants}>
                          <FormField
                            control={form.control}
                            name="chronicConditions"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <span className="bg-primary/10 p-1 rounded-full">
                                    <Thermometer className="h-4 w-4 text-primary" />
                                  </span>
                                  Chronic Conditions
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="List any chronic health conditions you have"
                                    className="min-h-[120px] resize-none"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  E.g., diabetes, hypertension, asthma
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      </TabsContent>
                    </Tabs>
                    
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="familyHistory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <span className="bg-primary/10 p-1 rounded-full">
                                <Heart className="h-4 w-4 text-primary" />
                              </span>
                              Family Medical History
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="List any significant health conditions in your immediate family"
                                className="min-h-[100px] resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Include conditions in parents, siblings, and grandparents
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="surgeries"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <span className="bg-primary/10 p-1 rounded-full">
                                <Thermometer className="h-4 w-4 text-primary" />
                              </span>
                              Past Surgeries
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="List any surgeries you've had"
                                className="min-h-[100px] resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Include approximate dates if possible
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  </div>
                )}

                {/* Step 4: Goals & Aspirations */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <motion.div
                      variants={itemVariants}
                      className="bg-primary/5 p-6 rounded-lg mb-6"
                    >
                      <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                        <Dumbbell className="h-5 w-5 text-primary" />
                        Your Health Journey
                      </h3>
                      <p className="text-sm text-muted-foreground mb-5">
                        Setting clear, achievable goals is the first step toward improving your health and wellbeing.
                        Be specific about what you want to accomplish and why it matters to you.
                      </p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                        <TooltipProvider>
                          {[
                            {
                              title: "Weight Loss",
                              subtitle: "Reduce body fat",
                              text: "Lose weight and improve body composition",
                              icon: <Weight className="h-4 w-4" />
                            },
                            {
                              title: "Build Strength",
                              subtitle: "Increase muscle",
                              text: "Build strength and muscle mass",
                              icon: <Dumbbell className="h-4 w-4" />
                            },
                            {
                              title: "Cardio Fitness",
                              subtitle: "Improve endurance",
                              text: "Improve cardiovascular fitness and endurance",
                              icon: <Activity className="h-4 w-4" />
                            },
                            {
                              title: "Flexibility",
                              subtitle: "Enhance mobility",
                              text: "Improve flexibility and mobility",
                              icon: <Zap className="h-4 w-4" />
                            },
                            {
                              title: "Mental Wellbeing",
                              subtitle: "Reduce stress",
                              text: "Manage stress and improve mental wellbeing",
                              icon: <Brain className="h-4 w-4" />
                            },
                            {
                              title: "Better Sleep",
                              subtitle: "Rest better",
                              text: "Improve sleep quality and duration",
                              icon: <Moon className="h-4 w-4" />
                            }
                          ].map((goal, index) => (
                            <Tooltip key={index}>
                              <TooltipTrigger asChild>
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  className="h-auto py-3 px-4 justify-start hover:bg-primary/5 hover:border-primary/30 transition-all duration-200"
                                  onClick={() => {
                                    const current = form.getValues("fitnessGoals") || "";
                                    form.setValue("fitnessGoals", current + (current ? "\n\n" : "") + goal.text);
                                    toast({
                                      title: "Goal Added",
                                      description: `"${goal.title}" has been added to your goals.`,
                                      variant: "default",
                                    });
                                  }}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                                      {goal.icon}
                                    </div>
                                    <div className="flex flex-col items-start">
                                      <span className="font-medium">{goal.title}</span>
                                      <span className="text-xs text-muted-foreground">{goal.subtitle}</span>
                                    </div>
                                  </div>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Click to add this goal to your list</p>
                              </TooltipContent>
                            </Tooltip>
                          ))}
                        </TooltipProvider>
                      </div>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      className="bg-primary/5 p-6 rounded-lg border border-primary/10"
                    >
                      <FormField
                        control={form.control}
                        name="fitnessGoals"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-base font-medium">
                              <Dumbbell className="h-4 w-4 text-primary" />
                              Your Health & Fitness Goals
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe what you'd like to achieve with your health and fitness. Be as specific as possible."
                                className="min-h-[180px] resize-none transition-all focus:ring-2 focus:ring-primary/20"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Include both short-term and long-term goals
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                    
                    <motion.div 
                      variants={itemVariants}
                      className="bg-green-50 dark:bg-green-950/30 p-6 rounded-lg mt-6 border border-green-200 dark:border-green-900"
                    >
                      <h3 className="text-lg font-medium flex items-center gap-2 mb-2 text-green-700 dark:text-green-400">
                        <Check className="h-5 w-5" />
                        Almost Done!
                      </h3>
                      <p className="text-sm text-green-600 dark:text-green-300">
                        Thank you for taking the time to provide your health information. This will help us create a personalized experience for you.
                        Click "Complete" below to submit your information and start your health journey with us.
                      </p>
                    </motion.div>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
          
          <CardFooter className="flex justify-between pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2 transition-all hover:bg-primary/5"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            
            {currentStep < steps.length - 1 ? (
              <Button 
                type="button" 
                onClick={nextStep}
                className="flex items-center gap-2 transition-all"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                type="button" 
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 transition-all relative overflow-hidden group bg-green-600 hover:bg-green-700 text-white"
              >
                <span className={cn(
                  "transition-all duration-300",
                  isSubmitting ? "opacity-0" : "opacity-100"
                )}>
                  Complete
                </span>
                <span className={cn(
                  "absolute inset-0 flex items-center justify-center transition-all duration-300",
                  isSubmitting ? "opacity-100" : "opacity-0"
                )}>
                  <Loader2 className="h-5 w-5 animate-spin" />
                </span>
                <Check className={cn(
                  "h-4 w-4 transition-all duration-300",
                  isSubmitting ? "opacity-0" : "opacity-100"
                )} />
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
      
      {/* Health tips section */}
      <div className="mt-8 flex justify-end mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowTips(!showTips)}
          className="text-xs"
        >
          {showTips ? "Hide Tips" : "Show Health Tips"}
        </Button>
      </div>
      
      <AnimatePresence>
        {showTips && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
          >
            <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full text-blue-600 dark:text-blue-400">
                    <Heart className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-700 dark:text-blue-400">Health Tip</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                      Regular physical activity can help reduce the risk of chronic diseases and improve your mental health.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full text-green-600 dark:text-green-400">
                    <Apple className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium text-green-700 dark:text-green-400">Nutrition Tip</h3>
                    <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                      Aim for at least 5 servings of fruits and vegetables daily to get essential vitamins and minerals.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full text-purple-600 dark:text-purple-400">
                    <Moon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium text-purple-700 dark:text-purple-400">Wellness Tip</h3>
                    <p className="text-sm text-purple-600 dark:text-purple-300 mt-1">
                      Adults should aim for 7-9 hours of quality sleep each night for optimal health and wellbeing.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

