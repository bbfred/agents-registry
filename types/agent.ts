export interface Agent {
  id: string
  name: string
  logo: string
  coverImage?: string
  shortDescription: string
  description: string
  categories: string[]
  capabilities: string[]
  languages: string[]
  integrations: string[]
  technicalRequirements: string
  verificationLevel: "basic" | "verified" | "certified"
  rating: number
  selfHosted?: boolean
  apiEndpoint?: string
  demoAvailable?: boolean
  conciergeCompatible?: boolean
  reviews: {
    author: string
    rating: number
    comment: string
    date?: string
  }[]
  provider: {
    name: string
    location: string
    founded: string
  }
  // Additional fields from the API
  createdAt?: string
  updatedAt?: string
  websiteUrl?: string
  documentationUrl?: string
  apiDocumentationUrl?: string
  supportEmail?: string
  supportUrl?: string
  pricingModel?: string
  startingPrice?: string
  useCases?: string[]
  viewCount?: number
  inquiryCount?: number
  verificationDate?: string
}
