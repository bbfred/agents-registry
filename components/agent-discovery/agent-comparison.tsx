"use client"

import { useState } from "react"
import { Check, X, Star, Shield, Globe, Zap, ChevronDown } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface Agent {
  id: string
  name: string
  provider: string
  category: string
  trustScore: number
  verificationLevel: "basic" | "verified" | "certified"
  pricing: {
    model: "free" | "freemium" | "subscription" | "usage"
    startingPrice?: number
    currency: "CHF" | "EUR" | "USD"
  }
  languages: string[]
  capabilities: string[]
  swissCompliance: {
    fadp: boolean
    gdpr: boolean
    iso27001: boolean
    finma: boolean
  }
  performance: {
    responseTime: number
    uptime: number
    accuracy: number
  }
  integrations: string[]
  supportLevel: "community" | "standard" | "premium" | "enterprise"
  lastUpdated: Date
}

const sampleAgents: Agent[] = [
  {
    id: "swiss-customer-support",
    name: "Swiss Customer Support",
    provider: "SwissAI Solutions",
    category: "Customer Service",
    trustScore: 95,
    verificationLevel: "certified",
    pricing: { model: "subscription", startingPrice: 299, currency: "CHF" },
    languages: ["de-CH", "fr-CH", "it-CH", "en"],
    capabilities: [
      "Multilingual Support",
      "Ticket Management",
      "Sentiment Analysis",
      "Swiss Cultural Context",
      "CRM Integration",
    ],
    swissCompliance: { fadp: true, gdpr: true, iso27001: true, finma: false },
    performance: { responseTime: 150, uptime: 99.9, accuracy: 94 },
    integrations: ["Salesforce", "HubSpot", "Zendesk", "Microsoft Teams"],
    supportLevel: "enterprise",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "legal-advisor-ch",
    name: "Legal Advisor CH",
    provider: "LegalTech Zurich",
    category: "Legal Consultation",
    trustScore: 92,
    verificationLevel: "certified",
    pricing: { model: "usage", startingPrice: 0.5, currency: "CHF" },
    languages: ["de-CH", "fr-CH", "it-CH"],
    capabilities: [
      "Swiss Law Expertise",
      "Document Analysis",
      "Contract Review",
      "Compliance Monitoring",
      "Legal Research",
    ],
    swissCompliance: { fadp: true, gdpr: true, iso27001: true, finma: true },
    performance: { responseTime: 200, uptime: 99.8, accuracy: 96 },
    integrations: ["DocuSign", "LegalZoom", "Notion", "Slack"],
    supportLevel: "premium",
    lastUpdated: new Date("2024-01-12"),
  },
  {
    id: "swiss-translator",
    name: "Swiss Translator Pro",
    provider: "Alpine Language Tech",
    category: "Translation",
    trustScore: 88,
    verificationLevel: "verified",
    pricing: { model: "freemium", startingPrice: 49, currency: "CHF" },
    languages: ["de-CH", "fr-CH", "it-CH", "rm-CH", "en"],
    capabilities: [
      "Multi-language Translation",
      "Dialect Recognition",
      "Cultural Adaptation",
      "Real-time Translation",
      "Document Translation",
    ],
    swissCompliance: { fadp: true, gdpr: true, iso27001: false, finma: false },
    performance: { responseTime: 100, uptime: 99.5, accuracy: 91 },
    integrations: ["Google Workspace", "Microsoft 365", "Slack", "Zoom"],
    supportLevel: "standard",
    lastUpdated: new Date("2024-01-10"),
  },
]

export function AgentComparison({ agents = sampleAgents }: { agents?: Agent[] }) {
  const [selectedAgents] = useState<string[]>(agents.slice(0, 3).map((a) => a.id))
  const [expandedSections, setExpandedSections] = useState<string[]>(["overview"])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const getVerificationBadge = (level: string) => {
    switch (level) {
      case "certified":
        return <Badge className="bg-green-100 text-green-800">Certified</Badge>
      case "verified":
        return <Badge className="bg-blue-100 text-blue-800">Verified</Badge>
      default:
        return <Badge variant="outline">Basic</Badge>
    }
  }

  const getPricingDisplay = (pricing: Agent["pricing"]) => {
    if (pricing.model === "free") return "Free"
    if (pricing.model === "freemium") return `From ${pricing.startingPrice} ${pricing.currency}/mo`
    if (pricing.model === "subscription") return `${pricing.startingPrice} ${pricing.currency}/mo`
    return `${pricing.startingPrice} ${pricing.currency}/request`
  }

  const selectedAgentData = agents.filter((agent) => selectedAgents.includes(agent.id))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Agent Comparison</h2>
        <div className="text-sm text-muted-foreground">
          Comparing {selectedAgents.length} of {agents.length} agents
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Overview Section */}
          <Collapsible open={expandedSections.includes("overview")} onOpenChange={() => toggleSection("overview")}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50">
                  <CardTitle className="flex items-center justify-between">
                    Overview
                    <ChevronDown className="h-4 w-4" />
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="font-medium">Agent</div>
                    {selectedAgentData.map((agent) => (
                      <div key={agent.id} className="space-y-2">
                        <h3 className="font-semibold">{agent.name}</h3>
                        <p className="text-sm text-muted-foreground">{agent.provider}</p>
                        <Badge variant="outline">{agent.category}</Badge>
                      </div>
                    ))}

                    <div className="font-medium">Trust Score</div>
                    {selectedAgentData.map((agent) => (
                      <div key={agent.id} className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{agent.trustScore}/100</span>
                        </div>
                        <Progress value={agent.trustScore} className="h-2" />
                      </div>
                    ))}

                    <div className="font-medium">Verification</div>
                    {selectedAgentData.map((agent) => (
                      <div key={agent.id}>{getVerificationBadge(agent.verificationLevel)}</div>
                    ))}

                    <div className="font-medium">Pricing</div>
                    {selectedAgentData.map((agent) => (
                      <div key={agent.id} className="space-y-1">
                        <div className="font-semibold">{getPricingDisplay(agent.pricing)}</div>
                        <div className="text-xs text-muted-foreground capitalize">{agent.pricing.model}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Languages Section */}
          <Collapsible open={expandedSections.includes("languages")} onOpenChange={() => toggleSection("languages")}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4" />
                      Languages
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="font-medium">Supported Languages</div>
                    {selectedAgentData.map((agent) => (
                      <div key={agent.id} className="space-y-1">
                        {agent.languages.map((lang) => (
                          <Badge key={lang} variant="outline" className="mr-1 mb-1">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Swiss Compliance Section */}
          <Collapsible open={expandedSections.includes("compliance")} onOpenChange={() => toggleSection("compliance")}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4" />
                      Swiss Compliance
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    {["FADP", "GDPR", "ISO 27001", "FINMA"].map((standard) => (
                      <div key={standard}>
                        <div className="font-medium mb-2">{standard}</div>
                        {selectedAgentData.map((agent) => {
                          const compliant =
                            agent.swissCompliance[
                              standard.toLowerCase().replace(" ", "") as keyof typeof agent.swissCompliance
                            ]
                          return (
                            <div key={agent.id} className="mb-2">
                              {compliant ? (
                                <Check className="h-5 w-5 text-green-500" />
                              ) : (
                                <X className="h-5 w-5 text-red-500" />
                              )}
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Performance Section */}
          <Collapsible
            open={expandedSections.includes("performance")}
            onOpenChange={() => toggleSection("performance")}
          >
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4" />
                      Performance
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="font-medium">Response Time</div>
                    {selectedAgentData.map((agent) => (
                      <div key={agent.id}>
                        <span className="font-semibold">{agent.performance.responseTime}ms</span>
                      </div>
                    ))}

                    <div className="font-medium">Uptime</div>
                    {selectedAgentData.map((agent) => (
                      <div key={agent.id}>
                        <span className="font-semibold">{agent.performance.uptime}%</span>
                      </div>
                    ))}

                    <div className="font-medium">Accuracy</div>
                    {selectedAgentData.map((agent) => (
                      <div key={agent.id}>
                        <span className="font-semibold">{agent.performance.accuracy}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        {selectedAgentData.map((agent) => (
          <Button key={agent.id} className="min-w-[150px]">
            Select {agent.name}
          </Button>
        ))}
      </div>
    </div>
  )
}
