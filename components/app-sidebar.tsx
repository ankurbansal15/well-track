"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BarChartIcon as ChartBarSquare,
  CalendarDays,
  ClipboardListIcon as ClipboardDocumentList,
  Heart,
  Home,
  Moon,
  Sun,
  CogIcon as Cog6Tooth,
  Bolt,
  ClipboardCheck,
  Utensils,
  LogOut,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { supabase } from "@/lib/supabase"

export function AppSidebar() {
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Health Metrics", href: "/metrics", icon: Bolt },
    { name: "Reports", href: "/reports", icon: ChartBarSquare },
    { name: "Appointments", href: "/appointments", icon: CalendarDays },
    { name: "Daily Tracking", href: "/tracking", icon: ClipboardDocumentList },
    { name: "Health Card", href: "/health-card", icon: Heart },
    { name: "Update Health Data", href: "/health-form", icon: ClipboardCheck },
    { name: "Diet Plan", href: "/diet-plan", icon: Utensils },
    { name: "Settings", href: "/settings", icon: Cog6Tooth },
  ]

  return (
    <Sidebar className="h-screen flex-shrink-0">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" />
          <span className="font-semibold">WellTrack</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenu>
          {navigation.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || pathname?.startsWith(`${item.href}/`)}
                className="w-full"
              >
                <Link href={item.href} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/profile" className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <span>John Doe</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setTheme(theme === "light" ? "dark" : "light")} className="w-full">
              <div className="flex items-center gap-2">
                {mounted &&
                  (theme === "light" ? (
                    <>
                      <Moon className="h-4 w-4" />
                      <span>Dark Mode</span>
                    </>
                  ) : (
                    <>
                      <Sun className="h-4 w-4" />
                      <span>Light Mode</span>
                    </>
                  ))}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="w-full">
              <div className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

