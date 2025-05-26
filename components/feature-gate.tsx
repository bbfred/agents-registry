"use client"

import { isFeatureEnabled, FeatureName, isPhase } from '@/lib/features'
import { ReactNode } from 'react'

interface FeatureGateProps {
  feature?: FeatureName
  phase?: 'mvp' | 'auth' | 'full'
  fallback?: ReactNode
  children: ReactNode
}

/**
 * Conditionally render components based on feature flags
 * 
 * @example
 * // Check specific feature
 * <FeatureGate feature="dashboard">
 *   <DashboardComponent />
 * </FeatureGate>
 * 
 * // Check phase
 * <FeatureGate phase="auth">
 *   <SignInButton />
 * </FeatureGate>
 * 
 * // With fallback
 * <FeatureGate feature="advancedChat" fallback={<BasicChat />}>
 *   <AdvancedChat />
 * </FeatureGate>
 */
export function FeatureGate({ 
  feature, 
  phase, 
  fallback = null, 
  children 
}: FeatureGateProps) {
  // Check if feature or phase is enabled
  const isEnabled = feature 
    ? isFeatureEnabled(feature)
    : phase 
    ? isPhase(phase)
    : false

  // Render children if enabled, fallback otherwise
  return <>{isEnabled ? children : fallback}</>
}

/**
 * Show content only in development mode
 */
export function DevOnly({ children }: { children: ReactNode }) {
  if (process.env.NODE_ENV !== 'development') {
    return null
  }
  return <>{children}</>
}

/**
 * Hide content in MVP phase
 */
export function HideInMVP({ children }: { children: ReactNode }) {
  return (
    <FeatureGate phase="auth">
      {children}
    </FeatureGate>
  )
}

/**
 * Show content only in full feature mode
 */
export function FullFeaturesOnly({ children }: { children: ReactNode }) {
  return (
    <FeatureGate phase="full">
      {children}
    </FeatureGate>
  )
}