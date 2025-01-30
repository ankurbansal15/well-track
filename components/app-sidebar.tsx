"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  ChartBarSquareIcon, 
  CalendarDaysIcon, 
  ClipboardDocumentListIcon, 
  HeartIcon, 
  HomeIcon, 
  MoonIcon, 
  SunIcon, 
  Cog6ToothIcon, 
  UserIcon,
  BoltIcon,
  ClipboardIcon
} from '@heroicons/react/24/solid'
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

export function AppSidebar() {
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()
  const [open, setOpen] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Health Metrics", href: "/metrics", icon: BoltIcon },
    { name: "Reports", href: "/reports", icon: ChartBarSquareIcon },
    { name: "Appointments", href: "/appointments", icon: CalendarDaysIcon },
    { name: "Daily Tracking", href: "/tracking", icon: ClipboardDocumentListIcon },
    { name: "Health Card", href: "/health-card", icon: HeartIcon },
    { name: "Update Health Data", href: "/health-form", icon: ClipboardIcon },
    { name: "Settings", href: "/settings", icon: Cog6ToothIcon },
  ]

  return (
    <Sidebar className="h-screen flex-shrink-0">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <HeartIcon className="h-6 w-6 text-primary" />
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
            <SidebarMenuButton
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="w-full"
            >
              <div className="flex items-center gap-2">
                {mounted && (
                  theme === "light" ? (
                    <>
                      <MoonIcon className="h-4 w-4" />
                      <span>Dark Mode</span>
                    </>
                  ) : (
                    <>
                      <SunIcon className="h-4 w-4" />
                      <span>Light Mode</span>
                    </>
                  )
                )}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/settings" className="flex items-center gap-2">
                <Cog6ToothIcon className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

