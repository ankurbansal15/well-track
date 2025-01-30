'use client'

import { Inter } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isPublicRoute = ['/', '/login', '/signup'].includes(pathname)

  return (
    <html lang="en">
      <head>
        <title>WellTrack - Personal Health Monitoring</title>
        <meta name="description" content="WellTrack - Your personal health monitoring and wellness tracking platform" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {isPublicRoute ? (
            <main className="w-full">{children}</main>
          ) : (
            <SidebarProvider>
              <div className="flex w-full">
                <AppSidebar />
                <SidebarInset className="flex-grow">
                  <main className="w-full p-6">{children}</main>
                </SidebarInset>
              </div>
            </SidebarProvider>
          )}
        </ThemeProvider>
      </body>
    </html>
  )
}

