"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { AtSign, Lock, ArrowRight, AlertCircle, Loader2, Home } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(authError.message)
      } else if (authData.user) {
        // Check if the user has a profile
        const { data: profileData, error: profileError } = await supabase
          .from("user_profiles")
          .select("initial_health_data_submitted")
          .eq("id", authData.user.id)
          .single()

        if (profileError) {
          if (profileError.code === "PGRST116") {
            // Profile doesn't exist, create one
            const { error: createProfileError } = await supabase
              .from("user_profiles")
              .insert([{ id: authData.user.id, initial_health_data_submitted: false }])

            if (createProfileError) {
              console.error("Error creating user profile:", createProfileError)
              setError("An error occurred while setting up your account. Please try again.")
            } else {
              router.push("/initial-health-form")
            }
          } else {
            console.error("Error fetching user profile:", profileError)
            setError("An error occurred while logging in. Please try again.")
          }
        } else if (!profileData.initial_health_data_submitted) {
          router.push("/initial-health-form")
        } else {
          router.push("/dashboard")
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Home icon navigation */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 z-50 p-2 rounded-full bg-foreground/10 backdrop-blur-sm hover:bg-foreground/20 transition-colors"
        aria-label="Back to home"
      >
        <Home className="h-5 w-5 text-primary md:text-primary" />
      </Link>

      {/* Left panel - Form */}
      <motion.div 
        className="w-full md:w-1/2 flex items-center justify-center p-6 lg:p-10 overflow-y-auto"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-md w-full py-10 space-y-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold tracking-tight text-primary">Welcome Back</h1>
            <p className="mt-2 text-muted-foreground">Sign in to your WellTrack account</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Label htmlFor="email" className="text-sm font-medium block mb-1.5">
                  Email address
                </Label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 transition-all"
                    required
                  />
                </div>
              </div>
              
              <div className="relative">
                <div className="flex justify-between items-center mb-1.5">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11 transition-all"
                    required
                  />
                </div>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            <Button 
              className="w-full h-11 text-base relative group"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4 inline transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary font-medium hover:underline">
                  Create an account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
      
      {/* Right panel - Illustration/Branding */}
      <motion.div 
        className="hidden md:flex md:w-1/2 bg-gradient-to-tr from-primary/90 to-primary items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-lg p-10 text-center">
          <div className="relative h-64 w-64 mx-auto mb-8">
            <Image 
              src="/health-illustration.svg" 
              alt="Health tracking illustration" 
              fill 
              className="object-contain"
              priority
            />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Track Your Health Journey</h2>
          <p className="text-white/80 mb-6">
            Monitor your progress, set goals, and improve your wellbeing with personalized insights.
          </p>
          <div className="flex justify-center space-x-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-2 w-2 rounded-full bg-white/50" />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

