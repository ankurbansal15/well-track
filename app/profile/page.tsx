import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BellIcon, PencilIcon, ShieldCheckIcon } from "@heroicons/react/24/solid"

export default function ProfilePage() {
  return (
    <div className="w-full grid gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and settings.</p>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>John Doe</CardTitle>
                <CardDescription>john.doe@example.com</CardDescription>
              </div>
              <Button variant="outline" className="ml-auto">
                <PencilIcon className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-2 text-sm">
              <div className="grid grid-cols-2 md:grid-cols-4">
                <dt className="font-medium">Member Since:</dt>
                <dd className="text-muted-foreground">January 2024</dd>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4">
                <dt className="font-medium">Last Login:</dt>
                <dd className="text-muted-foreground">2 hours ago</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BellIcon className="h-4 w-4" />
                <CardTitle>Notifications</CardTitle>
              </div>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Appointment Reminders", "Medication Updates", "Health Reports", "System Updates"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <input type="checkbox" id={item} defaultChecked />
                    <label htmlFor={item}>{item}</label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="h-4 w-4" />
                <CardTitle>Privacy & Security</CardTitle>
              </div>
              <CardDescription>Manage your security settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Two-Factor Authentication
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Connected Devices
                </Button>
                <Button variant="outline" className="w-full justify-start text-destructive">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

