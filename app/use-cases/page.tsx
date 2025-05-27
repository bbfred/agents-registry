"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ClientPage } from "@/components/client-page"
import { Users, MessageSquare, FileText, Calculator, Globe, Shield, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

const useCases = [
  {
    id: "customer-service",
    title: "Customer Service Automation",
    description: "24/7 multilingual customer support with Swiss cultural sensitivity",
    icon: MessageSquare,
    industry: "Retail & E-commerce",
    benefits: ["80% reduction in response time", "24/7 availability", "Multilingual support"],
    features: ["Swiss German dialect support", "Escalation to human agents", "CRM integration"],
    roi: "300% ROI in first year",
  },
  {
    id: "legal-consultation",
    title: "Legal Document Analysis",
    description: "AI-powered legal document review and Swiss law compliance checking",
    icon: FileText,
    industry: "Legal Services",
    benefits: ["90% faster document review", "Swiss law compliance", "Risk assessment"],
    features: ["FADP compliance checking", "Contract analysis", "Legal precedent search"],
    roi: "250% efficiency increase",
  },
  {
    id: "financial-advisory",
    title: "Financial Advisory Services",
    description: "Personalized financial advice with Swiss banking regulations compliance",
    icon: Calculator,
    industry: "Financial Services",
    benefits: ["Personalized advice", "Regulatory compliance", "Risk management"],
    features: ["FINMA compliance", "Portfolio analysis", "Tax optimization"],
    roi: "40% increase in client satisfaction",
  },
  {
    id: "hr-automation",
    title: "HR Process Automation",
    description: "Streamline recruitment, onboarding, and employee management",
    icon: Users,
    industry: "Human Resources",
    benefits: ["60% faster hiring", "Reduced bias", "Better candidate matching"],
    features: ["CV screening", "Interview scheduling", "Onboarding workflows"],
    roi: "200% improvement in hiring efficiency",
  },
  {
    id: "translation-services",
    title: "Professional Translation",
    description: "High-quality translation services for Swiss multilingual business needs",
    icon: Globe,
    industry: "Translation & Localization",
    benefits: ["99% accuracy", "Cultural adaptation", "Real-time translation"],
    features: ["Swiss dialect support", "Technical terminology", "Cultural context"],
    roi: "150% cost reduction vs. human translators",
  },
  {
    id: "compliance-monitoring",
    title: "Regulatory Compliance",
    description: "Automated monitoring and reporting for Swiss regulatory requirements",
    icon: Shield,
    industry: "Compliance & Risk",
    benefits: ["100% compliance tracking", "Automated reporting", "Risk alerts"],
    features: ["FADP monitoring", "Audit trails", "Real-time alerts"],
    roi: "80% reduction in compliance costs",
  },
]

export default function UseCasesPage() {
  return (
    <ClientPage>
      {({ }) => (
        <main className="container mx-auto max-w-6xl py-8 px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">AI Use Cases for Swiss Businesses</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how Swiss companies are leveraging AI agents to transform their operations, improve efficiency,
              and maintain compliance with local regulations.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-gray-600">Swiss Companies</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">85%</div>
                <div className="text-sm text-gray-600">Efficiency Increase</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">CHF 2.5M</div>
                <div className="text-sm text-gray-600">Average Annual Savings</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-gray-600">FADP Compliant</div>
              </CardContent>
            </Card>
          </div>

          {/* Use Cases Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {useCases.map((useCase) => {
              const IconComponent = useCase.icon
              return (
                <Card key={useCase.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <Badge variant="outline">{useCase.industry}</Badge>
                    </div>
                    <CardTitle className="text-xl">{useCase.title}</CardTitle>
                    <CardDescription>{useCase.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2 text-green-700">Key Benefits</h4>
                        <ul className="space-y-1">
                          {useCase.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Features</h4>
                        <div className="flex flex-wrap gap-1">
                          {useCase.features.map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t">
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium text-primary">{useCase.roi}</div>
                          <Button size="sm" variant="outline">
                            Learn More <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* CTA Section */}
          <Card className="bg-primary text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Business?</h2>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                Join hundreds of Swiss companies already benefiting from AI automation. Get started with a free
                consultation and custom implementation plan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary">
                  Schedule Consultation
                </Button>
                <Link href="/agents">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-white border-white hover:bg-white hover:text-primary"
                  >
                    Browse AI Agents
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      )}
    </ClientPage>
  )
}
