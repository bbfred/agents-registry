"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { isFeatureEnabled, FeatureName } from "@/lib/features"

interface FeatureProtectionProps {
  feature: FeatureName
  redirectTo?: string
  children: React.ReactNode
}

export function useFeatureProtection(feature: FeatureName, redirectTo: string = '/') {
  const router = useRouter()
  
  useEffect(() => {
    if (!isFeatureEnabled(feature)) {
      router.push(redirectTo)
    }
  }, [feature, redirectTo, router])
}

export function FeatureProtection({ 
  feature, 
  redirectTo = '/', 
  children 
}: FeatureProtectionProps) {
  useFeatureProtection(feature, redirectTo)
  
  // Feature check happens on client side, so we render children
  // The redirect will happen if needed
  return <>{children}</>
}