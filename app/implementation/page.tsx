"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClientPage } from "@/components/client-page"
import { CheckCircle, Clock, Users, Settings, Shield, ArrowRight, Download, Play } from "lucide-react"
import Link from "next/link"

const implementationSteps = [
  {
    phase: "Discovery & Planning",
    duration: "1-2 weeks",
    description: "Assess your needs and plan the implementation",
    tasks: [
      "Business requirements analysis",
      "Current system assessment",
      "Compliance requirements review",
      "Agent selection and comparison",
      "Implementation roadmap creation",
    ],
  },
  {
    phase: "Setup & Configuration",
    duration: "2-4 weeks",
    description: "Configure and integrate your chosen AI agents",
    tasks: [
      "Agent deployment and configuration",
      "System integration (CRM, ERP, etc.)",
      "Data migration and setup",
      "Security and compliance configuration",
      "Testing and validation",
    ],
  },
  {
    phase: "Training & Rollout",
    duration: "1-2 weeks",
    description: "Train your team and launch the solution",
    tasks: [
      "Team training and onboarding",
      "Pilot testing with select users",
      "Feedback collection and refinement",
      "Full deployment",
      "Go-live support",
    ],
  },
  {
    phase: "Optimization & Support",
    duration: "Ongoing",
    description: "Monitor, optimize, and maintain your AI agents",
    tasks: [
      "Performance monitoring",
      "Usage analytics and insights",
      "Continuous optimization",
      "Regular compliance audits",
      "Ongoing support and maintenance",
    ],
  },
]

const deploymentOptions = [
  {
    title: "Cloud Deployment",
    description: "Quick setup with managed infrastructure",
    pros: ["Fast deployment", "Automatic updates", "Scalable", "Lower initial cost"],
    cons: ["Data residency considerations", "Ongoing subscription costs"],
    bestFor: "Small to medium businesses, quick pilots",
  },
  {
    title: "Self-Hosted",
    description: "Complete control with on-premises deployment",
    pros: ["Full data control", "Swiss data residency", "Customizable", "One-time cost"],
    cons: ["Higher initial investment", "Requires technical expertise"],
    bestFor: "Large enterprises, high security requirements",
  },
  {
    title: "Hybrid Approach",
    description: "Combine cloud and on-premises benefits",
    pros: ["Flexible deployment", "Optimized costs", "Gradual migration"],
    cons: ["Complex setup", "Requires planning"],
    bestFor: "Growing businesses, complex requirements",
  },
]

export default function ImplementationPage() {
  return (
    <ClientPage>
      {({ }) => (
        <main className="container mx-auto max-w-6xl py-8 px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">AI Implementation Guide</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive guide to successfully implementing AI agents in your Swiss business, from planning to
              deployment and ongoing optimization.
            </p>
          </div>

          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="planning">Planning</TabsTrigger>
              <TabsTrigger value="deployment">Deployment</TabsTrigger>
              <TabsTrigger value="integration">Integration</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* Implementation Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Implementation Timeline</CardTitle>
                  <CardDescription>Typical timeline for AI agent implementation in Swiss businesses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {implementationSteps.map((step, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{step.phase}</h3>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {step.duration}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{step.description}</p>
                          <ul className="space-y-1">
                            {step.tasks.map((task, taskIndex) => (
                              <li key={taskIndex} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                {task}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Deployment Options */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Deployment Options</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {deploymentOptions.map((option, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">{option.title}</CardTitle>
                        <CardDescription>{option.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-green-700 mb-2">Advantages</h4>
                          <ul className="space-y-1">
                            {option.pros.map((pro, proIndex) => (
                              <li key={proIndex} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-orange-700 mb-2">Considerations</h4>
                          <ul className="space-y-1">
                            {option.cons.map((con, conIndex) => (
                              <li key={conIndex} className="flex items-center gap-2 text-sm">
                                <div className="w-3 h-3 rounded-full bg-orange-200" />
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="pt-2 border-t">
                          <div className="text-sm">
                            <span className="font-medium">Best for: </span>
                            {option.bestFor}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="planning" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Planning Checklist</CardTitle>
                  <CardDescription>Essential steps to plan your AI implementation successfully</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold mb-4">Business Assessment</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <div className="font-medium">Define Objectives</div>
                            <div className="text-sm text-gray-600">Clear goals and success metrics</div>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <div className="font-medium">Process Analysis</div>
                            <div className="text-sm text-gray-600">Current workflow documentation</div>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <div className="font-medium">Resource Planning</div>
                            <div className="text-sm text-gray-600">Budget, timeline, and team allocation</div>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-4">Technical Requirements</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <div className="font-medium">System Integration</div>
                            <div className="text-sm text-gray-600">Existing systems and APIs</div>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <div className="font-medium">Data Requirements</div>
                            <div className="text-sm text-gray-600">Data sources and quality assessment</div>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <div className="font-medium">Security & Compliance</div>
                            <div className="text-sm text-gray-600">FADP, GDPR, and industry requirements</div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="deployment">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Start Guide</CardTitle>
                    <CardDescription>Get up and running in minutes</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full" size="lg">
                      <Play className="h-4 w-4 mr-2" />
                      Start Implementation Wizard
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Setup Guide
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Expert Support</CardTitle>
                    <CardDescription>Get help from our Swiss AI specialists</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full">
                      Schedule Consultation
                    </Button>
                    <Button variant="outline" className="w-full">
                      Join Implementation Workshop
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="integration">
              <Card>
                <CardHeader>
                  <CardTitle>System Integration</CardTitle>
                  <CardDescription>Connect AI agents with your existing Swiss business systems</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="bg-blue-100 p-4 rounded-lg mb-4">
                        <Settings className="h-8 w-8 text-blue-600 mx-auto" />
                      </div>
                      <h3 className="font-semibold mb-2">CRM Integration</h3>
                      <p className="text-sm text-gray-600">Salesforce, HubSpot, Microsoft Dynamics</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-green-100 p-4 rounded-lg mb-4">
                        <Users className="h-8 w-8 text-green-600 mx-auto" />
                      </div>
                      <h3 className="font-semibold mb-2">ERP Systems</h3>
                      <p className="text-sm text-gray-600">SAP, Oracle, Microsoft Business Central</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-purple-100 p-4 rounded-lg mb-4">
                        <Shield className="h-8 w-8 text-purple-600 mx-auto" />
                      </div>
                      <h3 className="font-semibold mb-2">Security Tools</h3>
                      <p className="text-sm text-gray-600">Identity management, audit systems</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="support">
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Ongoing Support & Maintenance</CardTitle>
                    <CardDescription>Ensure your AI agents continue to deliver value</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="font-semibold mb-4">Support Tiers</h3>
                        <div className="space-y-3">
                          <div className="border rounded-lg p-4">
                            <div className="font-medium">Basic Support</div>
                            <div className="text-sm text-gray-600">Email support, documentation access</div>
                          </div>
                          <div className="border rounded-lg p-4">
                            <div className="font-medium">Premium Support</div>
                            <div className="text-sm text-gray-600">Priority support, phone access, SLA</div>
                          </div>
                          <div className="border rounded-lg p-4">
                            <div className="font-medium">Enterprise Support</div>
                            <div className="text-sm text-gray-600">Dedicated account manager, custom SLA</div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-4">Resources</h3>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2">
                            <ArrowRight className="h-4 w-4 text-primary" />
                            <Link href="/docs" className="text-primary hover:underline">
                              Technical Documentation
                            </Link>
                          </li>
                          <li className="flex items-center gap-2">
                            <ArrowRight className="h-4 w-4 text-primary" />
                            <Link href="/community" className="text-primary hover:underline">
                              Community Forum
                            </Link>
                          </li>
                          <li className="flex items-center gap-2">
                            <ArrowRight className="h-4 w-4 text-primary" />
                            <Link href="/training" className="text-primary hover:underline">
                              Training Materials
                            </Link>
                          </li>
                          <li className="flex items-center gap-2">
                            <ArrowRight className="h-4 w-4 text-primary" />
                            <Link href="/webinars" className="text-primary hover:underline">
                              Regular Webinars
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      )}
    </ClientPage>
  )
}
