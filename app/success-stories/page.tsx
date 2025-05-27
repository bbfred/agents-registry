"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ClientPage } from "@/components/client-page"
import { Building2, TrendingUp, Clock, DollarSign, Star, ArrowRight, Quote } from "lucide-react"
import Link from "next/link"

const successStories = [
  {
    id: "swiss-bank",
    company: "Cantonal Bank Zürich",
    industry: "Financial Services",
    size: "1,000+ employees",
    location: "Zürich",
    challenge: "Manual customer service processes causing delays and inconsistent responses across multiple languages",
    solution: "Implemented multilingual AI customer service agents with Swiss banking regulation compliance",
    results: {
      efficiency: "75% faster response times",
      satisfaction: "92% customer satisfaction",
      cost: "CHF 2.1M annual savings",
      languages: "4 Swiss languages supported",
    },
    quote:
      "The AI agents understand Swiss banking nuances and provide consistent, compliant responses in all our local languages. Customer satisfaction has never been higher.",
    author: "Dr. Andreas Mueller, Head of Digital Innovation",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "swiss-logistics",
    company: "Alpine Logistics AG",
    industry: "Logistics & Transportation",
    size: "500+ employees",
    location: "Basel",
    challenge: "Complex route optimization across Swiss terrain and coordination with multiple transport partners",
    solution: "AI-powered logistics optimization with real-time Swiss traffic and weather integration",
    results: {
      efficiency: "40% route optimization",
      satisfaction: "98% on-time delivery",
      cost: "CHF 800K fuel savings",
      languages: "Real-time multilingual updates",
    },
    quote:
      "Our AI system navigates Swiss logistics challenges better than any human planner. It considers everything from Alpine weather to local traffic patterns.",
    author: "Maria Bernasconi, Operations Director",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "swiss-healthcare",
    company: "Gesundheit Zentrum Bern",
    industry: "Healthcare",
    size: "200+ staff",
    location: "Bern",
    challenge: "Patient scheduling conflicts and language barriers affecting care quality",
    solution: "AI appointment scheduling and multilingual patient communication system",
    results: {
      efficiency: "60% reduction in scheduling conflicts",
      satisfaction: "95% patient satisfaction",
      cost: "CHF 300K operational savings",
      languages: "Seamless German/French communication",
    },
    quote:
      "The AI handles complex scheduling while respecting Swiss healthcare privacy laws. Our patients love the multilingual support.",
    author: "Dr. Claire Dubois, Medical Director",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "swiss-retail",
    company: "Migros Innovation Lab",
    industry: "Retail",
    size: "50,000+ employees",
    location: "Switzerland-wide",
    challenge: "Personalizing customer experience across diverse Swiss regions and languages",
    solution: "AI-powered personalization engine with Swiss cultural adaptation",
    results: {
      efficiency: "35% increase in sales conversion",
      satisfaction: "88% customer engagement",
      cost: "CHF 5.2M revenue increase",
      languages: "Regional preference adaptation",
    },
    quote:
      "Our AI understands that a customer in Ticino has different preferences than one in Basel. This cultural intelligence drives real results.",
    author: "Stefan Kälin, Head of Digital Experience",
    image: "/placeholder.svg?height=300&width=400",
  },
]

const metrics = [
  {
    label: "Average ROI",
    value: "285%",
    description: "Return on investment within first year",
    icon: TrendingUp,
  },
  {
    label: "Implementation Time",
    value: "6 weeks",
    description: "Average time to full deployment",
    icon: Clock,
  },
  {
    label: "Customer Satisfaction",
    value: "93%",
    description: "Average satisfaction score",
    icon: Star,
  },
  {
    label: "Cost Savings",
    value: "CHF 1.8M",
    description: "Average annual savings",
    icon: DollarSign,
  },
]

export default function SuccessStoriesPage() {
  return (
    <ClientPage>
      {({ }) => (
        <main className="container mx-auto max-w-6xl py-8 px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Swiss AI Success Stories</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how leading Swiss companies are transforming their operations with AI agents, achieving
              remarkable results while maintaining Swiss quality standards.
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {metrics.map((metric, index) => {
              const IconComponent = metric.icon
              return (
                <Card key={index}>
                  <CardContent className="p-6 text-center">
                    <IconComponent className="h-8 w-8 text-primary mx-auto mb-3" />
                    <div className="text-3xl font-bold text-primary mb-2">{metric.value}</div>
                    <div className="font-semibold mb-1">{metric.label}</div>
                    <div className="text-sm text-gray-600">{metric.description}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Success Stories */}
          <div className="space-y-12">
            {successStories.map((story, index) => (
              <Card key={story.id} className="overflow-hidden">
                <div
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${index % 2 === 1 ? "lg:grid-flow-col-dense" : ""}`}
                >
                  <div className={`p-8 ${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <Building2 className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="text-xl font-bold">{story.company}</h3>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">{story.industry}</Badge>
                          <Badge variant="outline">{story.size}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-red-700 mb-2">Challenge</h4>
                        <p className="text-gray-600">{story.challenge}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-blue-700 mb-2">Solution</h4>
                        <p className="text-gray-600">{story.solution}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-green-700 mb-2">Results</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-green-50 p-3 rounded-lg">
                            <div className="font-semibold text-green-800">{story.results.efficiency}</div>
                            <div className="text-sm text-green-600">Efficiency Gain</div>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="font-semibold text-blue-800">{story.results.satisfaction}</div>
                            <div className="text-sm text-blue-600">Satisfaction</div>
                          </div>
                          <div className="bg-purple-50 p-3 rounded-lg">
                            <div className="font-semibold text-purple-800">{story.results.cost}</div>
                            <div className="text-sm text-purple-600">Annual Savings</div>
                          </div>
                          <div className="bg-orange-50 p-3 rounded-lg">
                            <div className="font-semibold text-orange-800">{story.results.languages}</div>
                            <div className="text-sm text-orange-600">Language Support</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <Quote className="h-5 w-5 text-gray-400 mb-2" />
                        <p className="text-gray-700 italic mb-3">&quot;{story.quote}&quot;</p>
                        <div className="text-sm">
                          <div className="font-semibold">{story.author}</div>
                          <div className="text-gray-500">{story.company}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`bg-gray-100 flex items-center justify-center p-8 ${index % 2 === 1 ? "lg:col-start-1" : ""}`}
                  >
                    <div className="w-full h-64 bg-white rounded-lg shadow-sm flex items-center justify-center">
                      <Building2 className="h-24 w-24 text-gray-300" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Industry Breakdown */}
          <div className="mt-16 mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Success Across Industries</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-primary mb-2">45%</div>
                  <div className="font-semibold mb-1">Financial Services</div>
                  <div className="text-sm text-gray-600">Leading AI adoption</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-primary mb-2">25%</div>
                  <div className="font-semibold mb-1">Healthcare</div>
                  <div className="text-sm text-gray-600">Patient care optimization</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-primary mb-2">20%</div>
                  <div className="font-semibold mb-1">Manufacturing</div>
                  <div className="text-sm text-gray-600">Process automation</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-primary mb-2">10%</div>
                  <div className="font-semibold mb-1">Other Industries</div>
                  <div className="text-sm text-gray-600">Emerging sectors</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <Card className="bg-primary text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Write Your Success Story?</h2>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                Join these leading Swiss companies in transforming their operations with AI. Start your journey today
                with a free consultation and custom implementation plan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary">
                  Schedule Free Consultation
                </Button>
                <Link href="/use-cases">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-white border-white hover:bg-white hover:text-primary"
                  >
                    Explore Use Cases <ArrowRight className="h-4 w-4 ml-2" />
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
