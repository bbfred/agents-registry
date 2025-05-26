/**
 * Feature flags for progressive rollout of Swiss AI Agents Registry
 * 
 * Environment variable: NEXT_PUBLIC_FEATURE_PHASE
 * - 'mvp': Core agent registry features only (default)
 * - 'auth': MVP + authentication enabled
 * - 'full': All features enabled
 */

// Get the current feature phase from environment
const getFeaturePhase = (): 'mvp' | 'auth' | 'full' => {
  const phase = process.env.NEXT_PUBLIC_FEATURE_PHASE?.toLowerCase()
  if (phase === 'auth' || phase === 'full') {
    return phase
  }
  return 'mvp'
}

const phase = getFeaturePhase()

// Feature flags configuration
export const features = {
  // MVP Features (always enabled)
  agentBrowsing: true,
  agentDetails: true,
  agentRegistration: true,
  contact: true,
  about: true,
  basicSearch: true,
  categories: true,
  
  // Authentication features (phase: auth or full)
  authentication: phase === 'auth' || phase === 'full',
  userProfiles: phase === 'auth' || phase === 'full',
  savedAgents: phase === 'auth' || phase === 'full',
  
  // Advanced features (phase: full only)
  dashboard: phase === 'full',
  projectManagement: phase === 'full',
  aiCanvas: phase === 'full',
  advancedChat: phase === 'full',
  multiLanguage: phase === 'full',
  blog: phase === 'full',
  forBusinesses: phase === 'full',
  forIndividuals: phase === 'full',
  selfHosted: phase === 'full',
  concierge: phase === 'full',
  adminPanel: phase === 'full',
  verification: phase === 'full',
  faq: phase === 'full',
  support: phase === 'full',
  demo: phase === 'full',
  implementation: phase === 'full',
  successStories: phase === 'full',
  useCases: phase === 'full',
  advancedFilters: phase === 'full',
  priceFilters: phase === 'full',
  integrationFilters: phase === 'full',
  codeExamples: phase === 'full',
  interactiveDemo: phase === 'full',
}

// Type-safe feature checking
export type FeatureName = keyof typeof features

export function isFeatureEnabled(feature: FeatureName): boolean {
  return features[feature] ?? false
}

// Check if we're in a specific phase or higher
export function isPhase(targetPhase: 'mvp' | 'auth' | 'full'): boolean {
  const phaseOrder = { mvp: 0, auth: 1, full: 2 }
  return phaseOrder[phase] >= phaseOrder[targetPhase]
}

// Get current phase
export function getCurrentPhase(): string {
  return phase
}

// Feature groups for easier checking
export const featureGroups = {
  mvp: [
    'agentBrowsing',
    'agentDetails', 
    'agentRegistration',
    'contact',
    'about',
    'basicSearch',
    'categories'
  ] as const,
  
  auth: [
    'authentication',
    'userProfiles',
    'savedAgents'
  ] as const,
  
  advanced: [
    'dashboard',
    'projectManagement',
    'aiCanvas',
    'advancedChat',
    'multiLanguage',
    'blog',
    'forBusinesses',
    'forIndividuals',
    'selfHosted',
    'concierge'
  ] as const
}

// Check if all features in a group are enabled
export function isFeatureGroupEnabled(group: keyof typeof featureGroups): boolean {
  return featureGroups[group].every(feature => 
    isFeatureEnabled(feature as FeatureName)
  )
}