import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownTrayIcon, ShareIcon } from "@heroicons/react/24/solid"

export default function HealthCardPage() {
  return (
    <div className="w-full grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Digital Health Card</h1>
          <p className="text-muted-foreground">Your portable medical information.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <ShareIcon className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button>
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
                <dd>John Doe</dd>
              </div>
              <div className="grid grid-cols-2">
                <dt className="font-medium">Date of Birth:</dt>
                <dd>January 15, 1985</dd>
              </div>
              <div className="grid grid-cols-2">
                <dt className="font-medium">Blood Type:</dt>
                <dd>O+</dd>
              </div>
              <div className="grid grid-cols-2">
                <dt className="font-medium">Emergency Contact:</dt>
                <dd>Jane Doe (Wife) - +1 234 567 8900</dd>
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
                <dd>Penicillin, Peanuts</dd>
              </div>
              <div className="grid grid-cols-2">
                <dt className="font-medium">Chronic Conditions:</dt>
                <dd>Asthma</dd>
              </div>
              <div className="grid grid-cols-2">
                <dt className="font-medium">Current Medications:</dt>
                <dd>Albuterol Inhaler</dd>
              </div>
              <div className="grid grid-cols-2">
                <dt className="font-medium">Past Surgeries:</dt>
                <dd>Appendectomy (2018)</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Vaccination History</CardTitle>
            <CardDescription>Record of immunizations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  name: "COVID-19 Vaccination",
                  date: "March 15, 2023",
                  provider: "City Medical Center",
                  type: "Pfizer-BioNTech",
                },
                {
                  name: "Flu Shot",
                  date: "October 1, 2023",
                  provider: "Community Pharmacy",
                  type: "Seasonal Influenza",
                },
                {
                  name: "Tetanus Booster",
                  date: "June 12, 2020",
                  provider: "Family Clinic",
                  type: "Td",
                },
                {
                  name: "Hepatitis B",
                  date: "January 5, 2019",
                  provider: "City Medical Center",
                  type: "HepB",
                },
              ].map((vaccine, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="grid gap-1">
                      <h3 className="font-semibold">{vaccine.name}</h3>
                      <p className="text-sm">{vaccine.date}</p>
                      <p className="text-sm text-muted-foreground">{vaccine.provider}</p>
                      <p className="text-sm text-muted-foreground">Type: {vaccine.type}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

