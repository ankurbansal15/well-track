"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownTrayIcon, ShareIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { generatePDF, shareHealthCard } from "@/lib/health-card-utils";
import { useToast } from "@/components/ui/use-toast";

interface HealthCardData {
  personalInfo: {
    fullName: string;
    dateOfBirth: string;
    bloodType: string;
    email: string;
    phone: string;
    emergencyContact: string;
    emergencyPhone: string;
    gender: string;
    age: number;
  };
  medicalConditions: {
    allergies: string[];
    chronicConditions: string[];
    medications: string[];
    surgeries: string[];
  };
  vitalSigns: {
    bloodPressure: string;
    heartRate: number;
    height: number;
    weight: number;
    temperature: number;
    respiratoryRate: number;
  };
  vaccinations: {
    name: string;
    date: string;
    provider: string;
    type: string;
    notes?: string;
  }[];
  updatedAt: string;
}

export default function HealthCardPage() {
  const [healthCardData, setHealthCardData] = useState<HealthCardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchHealthCardData = async () => {
      try {
        const response = await fetch("/api/health-card");
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch health card data");
        }
        
        const data = await response.json();
        setHealthCardData(data);
      } catch (error) {
        console.error("Error fetching health card:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchHealthCardData();
  }, []);

  const handleDownload = async () => {
    if (!healthCardData) return;
    
    try {
      await generatePDF(healthCardData);
      toast({
        title: "Health card downloaded",
        description: "Your digital health card has been downloaded as a PDF.",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download failed",
        description: "There was an error generating your health card PDF.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (!healthCardData) return;
    
    try {
      await shareHealthCard(healthCardData);
      toast({
        title: "Health card shared",
        description: "Your digital health card has been shared successfully.",
      });
    } catch (error) {
      console.error("Sharing error:", error);
      toast({
        title: "Sharing failed",
        description: "There was an error sharing your health card.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <HealthCardSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertDescription>
          {error}. Please complete your health profile first.
        </AlertDescription>
      </Alert>
    );
  }

  if (!healthCardData) {
    return (
      <Alert className="mt-4">
        <AlertDescription>
          No health data available. Please complete your health profile.
        </AlertDescription>
      </Alert>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (e) {
      return "Unknown date";
    }
  };

  return (
    <div className="w-full grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Digital Health Card</h1>
          <p className="text-muted-foreground">
            Your portable medical information. Last updated: {formatDate(healthCardData.updatedAt)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleShare}>
            <ShareIcon className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button onClick={handleDownload}>
            <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Basic details and emergency contacts</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-2 text-sm">
              <div className="grid grid-cols-2">
                <dt className="font-medium">Full Name:</dt>
                <dd>{healthCardData.personalInfo.fullName}</dd>
              </div>
              <div className="grid grid-cols-2">
                <dt className="font-medium">Date of Birth:</dt>
                <dd>{formatDate(healthCardData.personalInfo.dateOfBirth)}</dd>
              </div>
              <div className="grid grid-cols-2">
                <dt className="font-medium">Gender:</dt>
                <dd>{healthCardData.personalInfo.gender}</dd>
              </div>
              <div className="grid grid-cols-2">
                <dt className="font-medium">Blood Type:</dt>
                <dd>{healthCardData.personalInfo.bloodType}</dd>
              </div>
              <div className="grid grid-cols-2">
                <dt className="font-medium">Contact:</dt>
                <dd>{healthCardData.personalInfo.phone || healthCardData.personalInfo.email}</dd>
              </div>
              <div className="grid grid-cols-2">
                <dt className="font-medium">Emergency Contact:</dt>
                <dd>
                  {healthCardData.personalInfo.emergencyContact} 
                  {healthCardData.personalInfo.emergencyPhone && ` - ${healthCardData.personalInfo.emergencyPhone}`}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Medical Conditions</CardTitle>
            <CardDescription>Current and past health conditions</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-2 text-sm">
              <div className="grid grid-cols-2">
                <dt className="font-medium">Allergies:</dt>
                <dd>
                  {healthCardData.medicalConditions.allergies.length
                    ? healthCardData.medicalConditions.allergies
                    : "None reported"}
                </dd>
              </div>
              <div className="grid grid-cols-2">
                <dt className="font-medium">Chronic Conditions:</dt>
                <dd>
                  {healthCardData.medicalConditions.chronicConditions.length
                    ? healthCardData.medicalConditions.chronicConditions
                    : "None reported"}
                </dd>
              </div>
              <div className="grid grid-cols-2">
                <dt className="font-medium">Current Medications:</dt>
                <dd>
                  {healthCardData.medicalConditions.medications.length
                    ? healthCardData.medicalConditions.medications
                    : "None reported"}
                </dd>
              </div>
              <div className="grid grid-cols-2">
                <dt className="font-medium">Past Surgeries:</dt>
                <dd>
                  {healthCardData.medicalConditions.surgeries.length
                    ? healthCardData.medicalConditions.surgeries
                    : "None reported"}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vital Signs</CardTitle>
            <CardDescription>Current health measurements</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-2 text-sm">
              <div className="grid grid-cols-2">
                <dt className="font-medium">Blood Pressure:</dt>
                <dd>{healthCardData.vitalSigns.bloodPressure || "Not recorded"}</dd>
              </div>
              <div className="grid grid-cols-2">
                <dt className="font-medium">Heart Rate:</dt>
                <dd>{healthCardData.vitalSigns.heartRate || "Not recorded"} bpm</dd>
              </div>
              <div className="grid grid-cols-2">
                <dt className="font-medium">Height:</dt>
                <dd>{healthCardData.vitalSigns.height || "Not recorded"} cm</dd>
              </div>
              <div className="grid grid-cols-2">
                <dt className="font-medium">Weight:</dt>
                <dd>{healthCardData.vitalSigns.weight || "Not recorded"} kg</dd>
              </div>
              {healthCardData.vitalSigns.temperature && (
                <div className="grid grid-cols-2">
                  <dt className="font-medium">Temperature:</dt>
                  <dd>{healthCardData.vitalSigns.temperature} °C</dd>
                </div>
              )}
              {healthCardData.vitalSigns.respiratoryRate && (
                <div className="grid grid-cols-2">
                  <dt className="font-medium">Respiratory Rate:</dt>
                  <dd>{healthCardData.vitalSigns.respiratoryRate} breaths/min</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Vaccination History</CardTitle>
            <CardDescription>Record of immunizations</CardDescription>
          </CardHeader>
          <CardContent>
            {healthCardData.vaccinations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No vaccination records found.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {healthCardData.vaccinations.map((vaccine, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="grid gap-1">
                        <h3 className="font-semibold">{vaccine.name}</h3>
                        <p className="text-sm">{formatDate(vaccine.date)}</p>
                        <p className="text-sm text-muted-foreground">{vaccine.provider}</p>
                        <p className="text-sm text-muted-foreground">Type: {vaccine.type}</p>
                        {vaccine.notes && <p className="text-xs mt-1">{vaccine.notes}</p>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function HealthCardSkeleton() {
  return (
    <div className="w-full grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-48 mt-2" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-40" />
          </CardHeader>
          <CardContent>
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="grid grid-cols-2 gap-2 mb-2">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-5 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-40" />
          </CardHeader>
          <CardContent>
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="grid grid-cols-2 gap-2 mb-2">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-5 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-40" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {Array(4).fill(0).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-36 mb-2" />
                    <Skeleton className="h-4 w-28 mb-1" />
                    <Skeleton className="h-4 w-40 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

