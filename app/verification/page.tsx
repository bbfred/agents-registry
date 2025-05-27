"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ClientPage } from "@/components/client-page"
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  CheckCircle,
  Clock,
  FileText,
  Users,
  Lock,
  Award,
  Eye,
  Zap,
} from "lucide-react"

const verificationLevels = [
  {
    level: "basic",
    title: "Basic Verification",
    icon: Shield,
    color: "gray",
    duration: "1-2 days",
    description: "Essential checks for functionality and basic compliance",
    requirements: [
      "Agent functionality testing",
      "Basic security scan",
      "Provider identity verification",
      "Terms of service compliance",
    ],
    benefits: ["Listed in directory", "Basic trust badge", "Standard support"],
  },
  {
    level: "verified",
    title: "Verified Agent",
    icon: ShieldCheck,
    color: "blue",
    duration: "1-2 weeks",
    description: "Comprehensive testing and Swiss compliance validation",
    requirements: [
      "Extended functionality testing",
      "FADP compliance audit",
      "Security penetration testing",
      "Performance benchmarking",
      "Swiss law compliance review",
      "Data handling assessment",
    ],
    benefits: ["Enhanced visibility", "Verified trust badge", "Priority support", "Featured listings eligibility"],
  },
  {
    level: "certified",
    title: "Swiss Certified",
    icon: ShieldAlert,
    color: "green",
    duration: "3-4 weeks",
    description: "Highest level certification with ongoing monitoring",
    requirements: [
      "Full security audit",
      "Swiss regulatory compliance",
      "Continuous monitoring setup",
      "Third-party security assessment",
      "Business continuity verification",
      "Data residency confirmation",
      "Cultural adaptation review",
    ],
    benefits: [
      "Premium placement",
      "Swiss certified badge",
      "Dedicated support",
      "Enterprise customer access",
      "Marketing co-opportunities",
    ],
  },
]

const verificationProcess = [
  {
    step: 1,
    title: "Application Submission",
    description: "Submit your agent for verification with required documentation",
    duration: "Same day",
    icon: FileText,
  },
  {
    step: 2,
    title: "Initial Review",
    description: "Our team conducts preliminary checks and assigns verification level",
    duration: "1-2 days",
    icon: Eye,
  },
  {
    step: 3,
    title: "Technical Testing",
    description: "Comprehensive testing of functionality, security, and performance",
    duration: "3-10 days",
    icon: Zap,
  },
  {
    step: 4,
    title: "Compliance Audit",
    description: "Swiss regulatory compliance and data protection assessment",
    duration: "5-15 days",
    icon: Lock,
  },
  {
    step: 5,
    title: "Final Review",
    description: "Results compilation and certification decision",
    duration: "1-3 days",
    icon: Award,
  },
]

export default function VerificationPage() {
  return (
    <ClientPage>
      {({ }) => (
        <main className="container mx-auto max-w-6xl py-8 px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Agent Verification Process</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our rigorous verification system ensures that all AI agents meet Swiss quality standards, regulatory
              compliance, and security requirements.
            </p>
          </div>

          {/* Verification Levels */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Verification Levels</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {verificationLevels.map((level) => {
                const IconComponent = level.icon
                const colorClasses = {
                  gray: "border-gray-200 bg-gray-50",
                  blue: "border-blue-200 bg-blue-50",
                  green: "border-green-200 bg-green-50",
                }

                return (
                  <Card
                    key={level.level}
                    className={`${colorClasses[level.color as keyof typeof colorClasses]} border-2`}
                  >
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4">
                        <div
                          className={`p-4 rounded-full ${
                            level.color === "gray"
                              ? "bg-gray-100"
                              : level.color === "blue"
                                ? "bg-blue-100"
                                : "bg-green-100"
                          }`}
                        >
                          <IconComponent
                            className={`h-8 w-8 ${
                              level.color === "gray"
                                ? "text-gray-600"
                                : level.color === "blue"
                                  ? "text-blue-600"
                                  : "text-green-600"
                            }`}
                          />
                        </div>
                      </div>
                      <CardTitle className="text-xl">{level.title}</CardTitle>
                      <CardDescription>{level.description}</CardDescription>
                      <Badge variant="outline" className="mx-auto">
                        <Clock className="h-3 w-3 mr-1" />
                        {level.duration}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Requirements</h4>
                        <ul className="space-y-1">
                          {level.requirements.map((req, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Benefits</h4>
                        <ul className="space-y-1">
                          {level.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <Award className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Verification Process */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">How Verification Works</h2>
            <Card>
              <CardContent className="p-8">
                <div className="space-y-8">
                  {verificationProcess.map((step, index) => {
                    const IconComponent = step.icon
                    return (
                      <div key={step.step} className="flex gap-6">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                            {step.step}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <IconComponent className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold text-lg">{step.title}</h3>
                            <Badge variant="outline">{step.duration}</Badge>
                          </div>
                          <p className="text-gray-600">{step.description}</p>
                          {index < verificationProcess.length - 1 && (
                            <div className="mt-4">
                              <div className="w-px h-8 bg-gray-200 ml-6"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Swiss Compliance Focus */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Swiss Compliance Standards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">FADP Compliance</h3>
                  <p className="text-sm text-gray-600">Federal Act on Data Protection compliance verification</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Lock className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Data Residency</h3>
                  <p className="text-sm text-gray-600">Swiss data storage and processing requirements</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Cultural Adaptation</h3>
                  <p className="text-sm text-gray-600">Swiss business culture and language support</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Award className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Quality Assurance</h3>
                  <p className="text-sm text-gray-600">Continuous monitoring and quality checks</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <Card className="bg-primary text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Get Verified?</h2>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                Join the trusted network of verified AI agents. Start the verification process today and gain access to
                Swiss businesses looking for reliable AI solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary">
                  Start Verification Process
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-primary"
                >
                  Learn More About Requirements
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      )}
    </ClientPage>
  )
}
