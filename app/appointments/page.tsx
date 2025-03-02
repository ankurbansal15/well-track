import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { PlusIcon } from "@heroicons/react/24/solid"

export default function AppointmentsPage() {
  return (
    <div className="w-full grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">Schedule and manage your medical appointments.</p>
        </div>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          New Appointment
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your scheduled medical visits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "Annual Physical Checkup",
                  doctor: "Dr. Sarah Johnson",
                  date: "March 15, 2024",
                  time: "10:00 AM",
                  location: "City Medical Center",
                },
                {
                  title: "Dental Cleaning",
                  doctor: "Dr. Michael Chen",
                  date: "March 20, 2024",
                  time: "2:30 PM",
                  location: "Smile Dental Clinic",
                },
                {
                  title: "Eye Examination",
                  doctor: "Dr. Emily Williams",
                  date: "April 5, 2024",
                  time: "11:15 AM",
                  location: "Vision Care Center",
                },
              ].map((appointment, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="grid gap-1">
                      <h3 className="font-semibold">{appointment.title}</h3>
                      <p className="text-sm text-muted-foreground">{appointment.doctor}</p>
                      <div className="text-sm">
                        <p>
                          {appointment.date} at {appointment.time}
                        </p>
                        <p className="text-muted-foreground">{appointment.location}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Select a date to view appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" className="rounded-md border" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

