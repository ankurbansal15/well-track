"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const healthFormSchema = z.object({
  // Current Health Status
  height: z.string().min(2, { message: "Height must be at least 2 characters." }),
  weight: z.string().min(2, { message: "Weight must be at least 2 characters." }),
  bloodPressure: z.string().regex(/^\d{2,3}\/\d{2,3}$/, { message: "Blood pressure must be in the format 120/80." }),
  heartRate: z.string().regex(/^\d{2,3}$/, { message: "Heart rate must be a number between 40 and 200." }),
  bloodSugar: z.string().min(2, { message: "Blood sugar must be at least 2 characters." }),
  cholesterol: z.string().min(2, { message: "Cholesterol must be at least 2 characters." }),

  // Past Health Status
  pastMedicalConditions: z.string(),
  familyMedicalHistory: z.string(),
  previousSurgeries: z.string(),
  allergies: z.string(),

  // Lifestyle Factors
  smokingStatus: z.enum(["never", "former", "current"]),
  alcoholConsumption: z.enum(["none", "light", "moderate", "heavy"]),
  exerciseFrequency: z.enum(["sedentary", "light", "moderate", "active"]),
  dietType: z.enum(["omnivore", "vegetarian", "vegan", "pescatarian", "other"]),
  sleepDuration: z.string().regex(/^\d{1,2}$/, { message: "Sleep duration must be a number between 1 and 24." }),
  stressLevel: z.number().min(1).max(10),

  // Additional Risk Factors
  occupation: z.string(),
  exposureToToxins: z.boolean(),
  travelHistory: z.string(),

  // Mental Health
  mentalHealthConditions: z.string(),
  anxietyLevel: z.number().min(1).max(10),
  depressionLevel: z.number().min(1).max(10),

  // Preventive Care
  lastPhysicalExam: z.string(),
  vaccinations: z.string(),
  screeningTests: z.string(),
})

export default function HealthFormPage() {
  const form = useForm<z.infer<typeof healthFormSchema>>({
    resolver: zodResolver(healthFormSchema),
    defaultValues: {
      height: "",
      weight: "",
      bloodPressure: "",
      heartRate: "",
      bloodSugar: "",
      cholesterol: "",
      pastMedicalConditions: "",
      familyMedicalHistory: "",
      previousSurgeries: "",
      allergies: "",
      smokingStatus: "never",
      alcoholConsumption: "none",
      exerciseFrequency: "sedentary",
      dietType: "omnivore",
      sleepDuration: "",
      stressLevel: 5,
      occupation: "",
      exposureToToxins: false,
      travelHistory: "",
      mentalHealthConditions: "",
      anxietyLevel: 5,
      depressionLevel: 5,
      lastPhysicalExam: "",
      vaccinations: "",
      screeningTests: "",
    },
  })

  function onSubmit(values: z.infer<typeof healthFormSchema>) {
    console.log(values)
    // Here you would typically send this data to your backend/ML model
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Comprehensive Health Assessment</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Current Health Status</CardTitle>
              <CardDescription>Please provide your current health measurements.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (cm)</FormLabel>
                      <FormControl>
                        <Input placeholder="175" {...field} />
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
                        <Input placeholder="70" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="bloodPressure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Pressure (mmHg)</FormLabel>
                      <FormControl>
                        <Input placeholder="120/80" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="heartRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Heart Rate (bpm)</FormLabel>
                      <FormControl>
                        <Input placeholder="70" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="bloodSugar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Sugar (mg/dL)</FormLabel>
                      <FormControl>
                        <Input placeholder="100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cholesterol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cholesterol (mg/dL)</FormLabel>
                      <FormControl>
                        <Input placeholder="180" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Past Health Status</CardTitle>
              <CardDescription>Please provide information about your medical history.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <FormField
                control={form.control}
                name="pastMedicalConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Past Medical Conditions</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List any past medical conditions..." className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="familyMedicalHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Family Medical History</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List any relevant family medical history..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="previousSurgeries"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Previous Surgeries</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List any previous surgeries..." className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allergies</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List any allergies..." className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lifestyle Factors</CardTitle>
              <CardDescription>Please provide information about your lifestyle.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <FormField
                control={form.control}
                name="smokingStatus"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Smoking Status</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="never" />
                          </FormControl>
                          <FormLabel className="font-normal">Never Smoked</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="former" />
                          </FormControl>
                          <FormLabel className="font-normal">Former Smoker</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="current" />
                          </FormControl>
                          <FormLabel className="font-normal">Current Smoker</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="alcoholConsumption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alcohol Consumption</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select alcohol consumption" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="heavy">Heavy</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="exerciseFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exercise Frequency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select exercise frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
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
                          <SelectValue placeholder="Select diet type" />
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
                      <Input type="number" min="1" max="24" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stressLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stress Level (1-10)</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Risk Factors</CardTitle>
              <CardDescription>Please provide information about additional risk factors.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupation</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="exposureToToxins"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Exposure to Toxins</FormLabel>
                      <FormDescription>
                        Check if you have been exposed to any toxins in your work or living environment.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="travelHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recent Travel History</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List any recent travel..." className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mental Health</CardTitle>
              <CardDescription>Please provide information about your mental health.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <FormField
                control={form.control}
                name="mentalHealthConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mental Health Conditions</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List any mental health conditions..." className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="anxietyLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anxiety Level (1-10)</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="depressionLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Depression Level (1-10)</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preventive Care</CardTitle>
              <CardDescription>Please provide information about your preventive care.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <FormField
                control={form.control}
                name="lastPhysicalExam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Last Physical Exam</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vaccinations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vaccinations</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List your vaccinations..." className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="screeningTests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recent Screening Tests</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List any recent screening tests..." className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button type="submit">Submit Health Assessment</Button>
        </form>
      </Form>
    </div>
  )
}

