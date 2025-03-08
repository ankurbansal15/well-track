"use client"

import type React from "react"
import { Inter as FontSans } from "next/font/google"
import "@/styles/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AppSidebar } from "@/components/app-sidebar"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import { SessionProvider } from "@/components/SessionProvider"
import { cn } from "@/lib/utils"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isPublicRoute = ["/", "/login", "/signup", "/initial-health-form"].includes(pathname || "")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  // Listen for sidebar state changes
  useEffect(() => {
    // Load initial state
    const savedState = localStorage.getItem("sidebar-collapsed")
    if (savedState !== null) {
      setSidebarCollapsed(savedState === "true")
    }
    
    // Function to handle changes from localStorage
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "sidebar-collapsed") {
        setSidebarCollapsed(event.newValue === "true")
      }
    }
    
    // Custom event handler
    const handleCustomEvent = (event: CustomEvent<{ collapsed: boolean }>) => {
      setSidebarCollapsed(event.detail.collapsed)
    }
    
    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("sidebar-state-change" as any, handleCustomEvent as EventListener)
    
    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("sidebar-state-change" as any, handleCustomEvent as EventListener)
    }
  }, [])

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {isPublicRoute ? (
              <main className="w-full">{children}</main>
            ) : (
              <SidebarProvider>
              <div className="flex w-full">
                <AppSidebar />
                <SidebarInset className="flex-grow">
                  <ProtectedRoute>
                    <main className="w-full p-6">{children}</main>
                  </ProtectedRoute>
                </SidebarInset>
              </div>
            </SidebarProvider>
            )}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
