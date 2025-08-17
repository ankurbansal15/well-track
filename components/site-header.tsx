"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface SiteHeaderProps {
  className?: string
}

export function SiteHeader({ className = "" }: SiteHeaderProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className}`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl sm:text-2xl font-bold gradient-text">WellTrack</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('features')} 
                className="text-left transition-colors hover:text-primary"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('specialties')} 
                className="text-left transition-colors hover:text-primary"
              >
                Why Choose Us
              </button>
              <button 
                onClick={() => scrollToSection('articles')} 
                className="text-left transition-colors hover:text-primary"
              >
                Getting Started
              </button>
              <button 
                onClick={() => scrollToSection('faq')} 
                className="text-left transition-colors hover:text-primary"
              >
                FAQ
              </button>
              <Link href="/dashboard" className="text-left transition-colors hover:text-primary">
                Dashboard
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <button 
            onClick={() => scrollToSection('features')} 
            className="transition-colors hover:text-primary cursor-pointer"
          >
            Features
          </button>
          <button 
            onClick={() => scrollToSection('specialties')} 
            className="transition-colors hover:text-primary cursor-pointer"
          >
            Why Choose Us
          </button>
          <button 
            onClick={() => scrollToSection('articles')} 
            className="transition-colors hover:text-primary cursor-pointer"
          >
            Getting Started
          </button>
          <button 
            onClick={() => scrollToSection('faq')} 
            className="transition-colors hover:text-primary cursor-pointer"
          >
            FAQ
          </button>
          <Link href="/dashboard" className="transition-colors hover:text-primary">
            Dashboard
          </Link>
        </nav>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <ThemeToggle />
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

