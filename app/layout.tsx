"use client"

import type React from "react"

import { Inter } from "next/font/google"
import "@/styles/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { useState } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import { SessionProvider } from "@/components/SessionProvider"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isPublicRoute = ["/", "/login", "/signup", "/initial-health-form"].includes(pathname || "")

  return (
    <html lang="en">
      <body className={inter.className}>
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
