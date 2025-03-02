"use client"

import type React from "react"

import { useSession } from "@supabase/auth-helpers-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const session = useSession()

  useEffect(() => {
    if (session === null) {
      router.push("/login")
    }
  }, [session, router])

  if (session === null) {
    return null
  }

  return <>{children}</>
}

export default ProtectedRoute

