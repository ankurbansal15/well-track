"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Heart, 
  Activity, 
  Thermometer, 
  Wind, 
  Moon, 
  Brain, 
  Pill, 
  AlertTriangle, 
  Users, 
  Scissors, 
  Target, 
  Cigarette, 
  Utensils 
} from "lucide-react";

interface HealthMetricsDisplayProps {
  healthMetrics: any;
}

export function HealthMetricsDisplay({ healthMetrics }: HealthMetricsDisplayProps) {
  if (!healthMetrics) return null;

  return (
    <Tabs defaultValue="vitals" className="w-full">
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="vitals">Vitals</TabsTrigger>
        <TabsTrigger value="conditions">Medical History</TabsTrigger>
        <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
        <TabsTrigger value="goals">Goals</TabsTrigger>
      </TabsList>
      
      <TabsContent value="vitals">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VitalCard 
            title="Heart Rate" 
            value={`${healthMetrics.heartRate || "--"} bpm`}
            icon={<Heart className="h-5 w-5 text-red-500" />}
            description="Resting heart rate"
          />
          
          <VitalCard 
            title="Blood Pressure" 
            value={healthMetrics.bloodPressure || "--"}
            icon={<Activity className="h-5 w-5 text-blue-500" />}
            description="Systolic/Diastolic"
          />
          
          <VitalCard 
            title="Temperature" 
            value={`${healthMetrics.temperature || "--"} °C`}
            icon={<Thermometer className="h-5 w-5 text-amber-500" />}
            description="Body temperature"
          />
          
          <VitalCard 
            title="Respiratory Rate" 
            value={`${healthMetrics.respiratoryRate || "--"} bpm`}
            icon={<Wind className="h-5 w-5 text-cyan-500" />}
            description="Breaths per minute"
          />
          
          <VitalCard 
            title="Sleep Duration" 
            value={`${healthMetrics.sleepDuration || "--"} hrs`}
            icon={<Moon className="h-5 w-5 text-purple-500" />}
            description="Average daily sleep"
          />
          
          <VitalCard 
            title="Stress Level" 
            value={healthMetrics.stressLevel ? `${healthMetrics.stressLevel}/10` : "--"}
            icon={<Brain className="h-5 w-5 text-pink-500" />}
            description="Self-reported stress"
          />
        </div>
      </TabsContent>
      
      <TabsContent value="conditions">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ListCard 
            title="Chronic Conditions" 
            items={healthMetrics.chronicConditions || []}
            icon={<Activity className="h-5 w-5 text-red-500" />}
            emptyMessage="No chronic conditions reported"
          />
          
          <ListCard 
            title="Medications" 
            items={healthMetrics.medications || []}
            icon={<Pill className="h-5 w-5 text-blue-500" />}
            emptyMessage="No medications reported"
          />
          
          <ListCard 
            title="Allergies" 
            items={healthMetrics.allergies || []}
            icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
            emptyMessage="No allergies reported"
          />
          
          <ListCard 
            title="Family History" 
            items={healthMetrics.familyHistory || []}
            icon={<Users className="h-5 w-5 text-green-500" />}
            emptyMessage="No family history reported"
          />
          
          <ListCard 
            title="Surgeries" 
            items={healthMetrics.surgeries || []}
            icon={<Scissors className="h-5 w-5 text-purple-500" />}
            emptyMessage="No surgeries reported"
          />
        </div>
      </TabsContent>
      
      <TabsContent value="lifestyle">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VitalCard 
            title="Activity Level" 
            value={healthMetrics.activityLevel || "--"}
            icon={<Activity className="h-5 w-5 text-green-500" />}
            description="Self-reported activity"
          />
          
          <VitalCard 
            title="Smoking Status" 
            value={healthMetrics.smokingStatus || "--"}
            icon={<Cigarette className="h-5 w-5 text-gray-500" />}
            description="Smoking habits"
          />
          
          <VitalCard 
            title="Diet Type" 
            value={healthMetrics.dietType || "--"}
            icon={<Utensils className="h-5 w-5 text-amber-500" />}
            description="Dietary preference"
          />
          
          <VitalCard 
            title="Height" 
            value={`${healthMetrics.height || "--"} cm`}
            icon={<Activity className="h-5 w-5 text-blue-500" />}
            description="Body height"
          />
          
          <VitalCard 
            title="Weight" 
            value={`${healthMetrics.weight || "--"} kg`}
            icon={<Activity className="h-5 w-5 text-purple-500" />}
            description="Body weight"
          />
          
          <VitalCard 
            title="BMI" 
            value={healthMetrics.height && healthMetrics.weight 
              ? (healthMetrics.weight / ((healthMetrics.height / 100) ** 2)).toFixed(1) 
              : "--"}
            icon={<Activity className="h-5 w-5 text-red-500" />}
            description="Body Mass Index"
          />
        </div>
      </TabsContent>
      
      <TabsContent value="goals">
        <ListCard 
          title="Fitness Goals" 
          items={healthMetrics.fitnessGoals || []}
          icon={<Target className="h-5 w-5 text-blue-500" />}
          emptyMessage="No fitness goals reported"
          fullWidth
        />
      </TabsContent>
    </Tabs>
  );
}

interface VitalCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}

function VitalCard({ title, value, icon, description }: VitalCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-2">
          {icon}
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </div>
        <Badge variant="outline" className="font-normal">
          {value}
        </Badge>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

interface ListCardProps {
  title: string;
  items: string | string[] | undefined;
  icon: React.ReactNode;
  emptyMessage: string;
  fullWidth?: boolean;
}

function ListCard({ title, items, icon, emptyMessage, fullWidth }: ListCardProps) {
  // Process items - handle both string and array formats
  let safeItems: string[] = [];
  
  if (Array.isArray(items)) {
    safeItems = items;
  } else if (typeof items === 'string' && items?.trim()) {
    // If it's a non-empty string, treat it as a single item
    safeItems = [items];
  }
  
  return (
    <Card className={fullWidth ? "col-span-full" : ""}>
      <CardHeader className="flex flex-row items-center space-x-2 pb-2">
        {icon}
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {safeItems.length > 0 ? (
          <ScrollArea className="h-32">
            <ul className="space-y-1">
              {safeItems.map((item, index) => (
                <li key={index} className="text-sm">
                  • {item}
                </li>
              ))}
            </ul>
          </ScrollArea>
        ) : (
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        )}
      </CardContent>
    </Card>
  );
}