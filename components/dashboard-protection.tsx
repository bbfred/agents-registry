"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { isFeatureEnabled } from "@/lib/features"

export function useDashboardProtection() {
  const router = useRouter()
  
  useEffect(() => {
    if (!isFeatureEnabled('dashboard')) {
      router.push('/')
    }
  }, [router])
}

export function DashboardProtection({ children }: { children: React.ReactNode }) {
  useDashboardProtection()
  
  // Feature check happens on client side, so we render children
  // The redirect will happen if needed
  return <>{children}</>
}