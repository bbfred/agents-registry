"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ClientPage } from "@/components/client-page"
import {
  Home,
  GraduationCap,
  Heart,
  Car,
  ShoppingCart,
  Calculator,
  MessageSquare,
  Globe,
  Shield,
  Smartphone,
  CheckCircle,
  Star,
} from "lucide-react"
import Link from "next/link"

const personalUseCases = [
  {
    id: "household",
    title: "Smart Household Management",
    description: "AI assistants for managing your Swiss home efficiently",
    icon: Home,
    features: [
      "Multilingual home automation",
      "Swiss energy optimization",
      "Local service recommendations",
      "Weather-based suggestions",
    ],
    price: "From CHF 29/month",
    popular: false,
  },
  {
    id: "education",
    title: "Personal Learning Assistant",
    description: "AI tutors for language learning and skill development",
    icon: GraduationCap,
    features: [
      "Swiss German dialect training",
      "Professional skill development",
      "Personalized learning paths",
      "Cultural integration support",
    ],
    price: "From CHF 19/month",
    popular: true,
  },
  {
    id: "health",
    title: "Health & Wellness Coach",
    description: "Personal AI health advisor with Swiss healthcare integration",
    icon: Heart,
    features: [
      "Swiss healthcare system navigation",
      "Appointment scheduling",
      "Medication reminders",
      "Wellness tracking",
    ],
    price: "From CHF 39/month",
    popular: false,
  },
  {
    id: "finance",
    title: "Personal Finance Manager",
    description: "AI-powered financial planning for Swiss residents",
    icon: Calculator,
    features: ["Swiss tax optimization", "Banking integration", "Investment advice", "Pension planning (3a/3b)"],
    price: "From CHF 49/month",
    popular: false,
  },
  {
    id: "travel",
    title: "Travel & Transportation",
    description: "Smart travel planning and Swiss transport optimization",
    icon: Car,
    features: ["SBB integration", "Route optimization", "Travel recommendations", "Real-time updates"],
    price: "From CHF 15/month",
    popular: false,
  },
  {
    id: "shopping",
    title: "Smart Shopping Assistant",
    description: "AI-powered shopping and local recommendations",
    icon: ShoppingCart,
    features: ["Price comparison", "Local store finder", "Sustainable options", "Budget tracking"],
    price: "From CHF 9/month",
    popular: false,
  },
]

const testimonials = [
  {
    name: "Maria Schneider",
    location: "Zürich",
    text: "The learning assistant helped me improve my Swiss German in just 3 months. Now I feel much more confident in business meetings.",
    rating: 5,
    useCase: "Language Learning",
  },
  {
    name: "Thomas Weber",
    location: "Basel",
    text: "Managing my household has never been easier. The AI optimizes my energy usage and saves me about CHF 200 per month.",
    rating: 5,
    useCase: "Household Management",
  },
  {
    name: "Sophie Dubois",
    location: "Geneva",
    text: "The financial advisor helped me optimize my 3a contributions and find better investment options. Excellent Swiss-specific advice.",
    rating: 5,
    useCase: "Financial Planning",
  },
]

export default function IndividualsPage() {
  return (
    <ClientPage>
      {({ }) => (
        <main className="container mx-auto max-w-6xl py-8 px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">AI Assistants for Swiss Individuals</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover personal AI assistants designed specifically for life in Switzerland. From household management
              to language learning, find AI that understands Swiss culture and needs.
            </p>
          </div>

          {/* Benefits Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardContent className="p-6 text-center">
                <Globe className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Multilingual</h3>
                <p className="text-sm text-gray-600">Support for all Swiss languages including dialects</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Privacy First</h3>
                <p className="text-sm text-gray-600">FADP compliant with Swiss data protection</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Smartphone className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Easy to Use</h3>
                <p className="text-sm text-gray-600">Simple setup, works on all your devices</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Local Support</h3>
                <p className="text-sm text-gray-600">Swiss-based customer support team</p>
              </CardContent>
            </Card>
          </div>

          {/* Use Cases */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Personal AI Assistants</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {personalUseCases.map((useCase) => {
                const IconComponent = useCase.icon
                return (
                  <Card key={useCase.id} className={`relative ${useCase.popular ? "border-primary border-2" : ""}`}>
                    {useCase.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-primary text-white">Most Popular</Badge>
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">{useCase.price}</div>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{useCase.title}</CardTitle>
                      <CardDescription>{useCase.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-4">
                        {useCase.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full">Try Free for 14 Days</Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">What Swiss Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4">&quot;{testimonial.text}&quot;</p>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.location}</div>
                      <Badge variant="outline" className="mt-2">
                        {testimonial.useCase}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Swiss Concierge Section */}
          <Card className="mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-4">Swiss Concierge App</h2>
                  <p className="text-gray-600 mb-4">
                    Manage all your AI assistants from one beautiful, Swiss-designed app. Available for iOS, Android,
                    and desktop.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Unified interface for all your AI assistants
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Swiss-designed with local preferences
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Secure, private, FADP compliant
                    </li>
                  </ul>
                  <div className="flex gap-4">
                    <Button>Download for iOS</Button>
                    <Button variant="outline">Download for Android</Button>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-64 h-64 bg-white rounded-lg shadow-lg flex items-center justify-center">
                    <Smartphone className="h-32 w-32 text-gray-300" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Getting Started */}
          <Card className="bg-primary text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                Join thousands of Swiss residents already using AI to simplify their daily lives. Start with a free
                trial and discover what AI can do for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary">
                  Start Free Trial
                </Button>
                <Link href="/agents">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-white border-white hover:bg-white hover:text-primary"
                  >
                    Browse AI Assistants
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
