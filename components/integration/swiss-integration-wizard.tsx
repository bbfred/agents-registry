"use client"

import type React from "react"

import { useState } from "react"
import { Building2, Shield, Zap, CheckCircle, ArrowRight, ArrowLeft, Settings, Database } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface WizardStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
}

const wizardSteps: WizardStep[] = [
  {
    id: "business-info",
    title: "Business Information",
    description: "Tell us about your Swiss business",
    icon: <Building2 className="h-5 w-5" />,
  },
  {
    id: "compliance",
    title: "Compliance Requirements",
    description: "Configure Swiss regulatory compliance",
    icon: <Shield className="h-5 w-5" />,
  },
  {
    id: "integration",
    title: "System Integration",
    description: "Connect your existing systems",
    icon: <Database className="h-5 w-5" />,
  },
  {
    id: "configuration",
    title: "Agent Configuration",
    description: "Customize agent behavior",
    icon: <Settings className="h-5 w-5" />,
  },
  {
    id: "deployment",
    title: "Deployment",
    description: "Deploy and test your agent",
    icon: <Zap className="h-5 w-5" />,
  },
]

export function SwissIntegrationWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    businessInfo: {
      companyName: "",
      industry: "",
      size: "",
      canton: "",
      languages: [] as string[],
    },
    compliance: {
      fadp: false,
      gdpr: false,
      finma: false,
      iso27001: false,
      dataResidency: "",
    },
    integration: {
      crm: "",
      erp: "",
      communication: "",
      apiEndpoint: "",
      webhookUrl: "",
    },
    configuration: {
      responseLanguage: "",
      culturalContext: "",
      businessHours: "",
      escalationRules: "",
    },
  })

  const updateFormData = (section: string, field: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const nextStep = () => {
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const progress = ((currentStep + 1) / wizardSteps.length) * 100

  const renderStepContent = () => {
    switch (wizardSteps[currentStep].id) {
      case "business-info":
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={formData.businessInfo.companyName}
                  onChange={(e) => updateFormData("businessInfo", "companyName", e.target.value)}
                  placeholder="Your Swiss company name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select
                  value={formData.businessInfo.industry}
                  onValueChange={(value) => updateFormData("businessInfo", "industry", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="finance">Financial Services</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="size">Company Size</Label>
                <Select
                  value={formData.businessInfo.size}
                  onValueChange={(value) => updateFormData("businessInfo", "size", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="startup">Startup (1-10 employees)</SelectItem>
                    <SelectItem value="small">Small (11-50 employees)</SelectItem>
                    <SelectItem value="medium">Medium (51-250 employees)</SelectItem>
                    <SelectItem value="large">Large (250+ employees)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="canton">Canton</Label>
                <Select
                  value={formData.businessInfo.canton}
                  onValueChange={(value) => updateFormData("businessInfo", "canton", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select canton" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zh">Zurich</SelectItem>
                    <SelectItem value="be">Bern</SelectItem>
                    <SelectItem value="ge">Geneva</SelectItem>
                    <SelectItem value="bs">Basel-Stadt</SelectItem>
                    <SelectItem value="vd">Vaud</SelectItem>
                    <SelectItem value="ag">Aargau</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Primary Business Languages</Label>
              <div className="grid grid-cols-2 gap-4">
                {["German", "French", "Italian", "Romansh", "English"].map((lang) => (
                  <div key={lang} className="flex items-center space-x-2">
                    <Checkbox
                      id={lang}
                      checked={formData.businessInfo.languages.includes(lang)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFormData("businessInfo", "languages", [...formData.businessInfo.languages, lang])
                        } else {
                          updateFormData(
                            "businessInfo",
                            "languages",
                            formData.businessInfo.languages.filter((l) => l !== lang),
                          )
                        }
                      }}
                    />
                    <Label htmlFor={lang}>{lang}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case "compliance":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Swiss Regulatory Compliance</h3>
              <p className="text-muted-foreground">Select the compliance standards your business must adhere to</p>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center space-x-2">
                      <Checkbox
                        checked={formData.compliance.fadp}
                        onCheckedChange={(checked) => updateFormData("compliance", "fadp", checked)}
                      />
                      <span>FADP (Swiss Data Protection Act)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Swiss federal data protection regulations for personal data processing
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center space-x-2">
                      <Checkbox
                        checked={formData.compliance.gdpr}
                        onCheckedChange={(checked) => updateFormData("compliance", "gdpr", checked)}
                      />
                      <span>GDPR</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      European General Data Protection Regulation compliance
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center space-x-2">
                      <Checkbox
                        checked={formData.compliance.finma}
                        onCheckedChange={(checked) => updateFormData("compliance", "finma", checked)}
                      />
                      <span>FINMA</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Swiss Financial Market Supervisory Authority regulations
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center space-x-2">
                      <Checkbox
                        checked={formData.compliance.iso27001}
                        onCheckedChange={(checked) => updateFormData("compliance", "iso27001", checked)}
                      />
                      <span>ISO 27001</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      International information security management standard
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataResidency">Data Residency Requirement</Label>
                <Select
                  value={formData.compliance.dataResidency}
                  onValueChange={(value) => updateFormData("compliance", "dataResidency", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select data residency requirement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="switzerland">Switzerland Only</SelectItem>
                    <SelectItem value="eu">EU/EEA</SelectItem>
                    <SelectItem value="global">Global (with safeguards)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case "integration":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">System Integration</h3>
              <p className="text-muted-foreground">Connect your existing business systems</p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="crm">CRM System</Label>
                  <Select
                    value={formData.integration.crm}
                    onValueChange={(value) => updateFormData("integration", "crm", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select CRM" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="salesforce">Salesforce</SelectItem>
                      <SelectItem value="hubspot">HubSpot</SelectItem>
                      <SelectItem value="pipedrive">Pipedrive</SelectItem>
                      <SelectItem value="zoho">Zoho CRM</SelectItem>
                      <SelectItem value="custom">Custom CRM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="erp">ERP System</Label>
                  <Select
                    value={formData.integration.erp}
                    onValueChange={(value) => updateFormData("integration", "erp", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select ERP" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sap">SAP</SelectItem>
                      <SelectItem value="oracle">Oracle ERP</SelectItem>
                      <SelectItem value="microsoft">Microsoft Dynamics</SelectItem>
                      <SelectItem value="sage">Sage</SelectItem>
                      <SelectItem value="custom">Custom ERP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="communication">Communication Platform</Label>
                <Select
                  value={formData.integration.communication}
                  onValueChange={(value) => updateFormData("integration", "communication", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select communication platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teams">Microsoft Teams</SelectItem>
                    <SelectItem value="slack">Slack</SelectItem>
                    <SelectItem value="zoom">Zoom</SelectItem>
                    <SelectItem value="webex">Cisco Webex</SelectItem>
                    <SelectItem value="custom">Custom Platform</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="apiEndpoint">API Endpoint</Label>
                  <Input
                    id="apiEndpoint"
                    value={formData.integration.apiEndpoint}
                    onChange={(e) => updateFormData("integration", "apiEndpoint", e.target.value)}
                    placeholder="https://api.yourcompany.ch"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    value={formData.integration.webhookUrl}
                    onChange={(e) => updateFormData("integration", "webhookUrl", e.target.value)}
                    placeholder="https://webhooks.yourcompany.ch"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case "configuration":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Agent Configuration</h3>
              <p className="text-muted-foreground">Customize agent behavior for your Swiss business context</p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="responseLanguage">Primary Response Language</Label>
                  <Select
                    value={formData.configuration.responseLanguage}
                    onValueChange={(value) => updateFormData("configuration", "responseLanguage", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="de-CH">German (Swiss)</SelectItem>
                      <SelectItem value="fr-CH">French (Swiss)</SelectItem>
                      <SelectItem value="it-CH">Italian (Swiss)</SelectItem>
                      <SelectItem value="rm-CH">Romansh</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="culturalContext">Cultural Context</Label>
                  <Select
                    value={formData.configuration.culturalContext}
                    onValueChange={(value) => updateFormData("configuration", "culturalContext", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select cultural context" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="formal">Formal (Sie/Vous)</SelectItem>
                      <SelectItem value="informal">Informal (Du/Tu)</SelectItem>
                      <SelectItem value="mixed">Context-dependent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessHours">Business Hours</Label>
                <Input
                  id="businessHours"
                  value={formData.configuration.businessHours}
                  onChange={(e) => updateFormData("configuration", "businessHours", e.target.value)}
                  placeholder="e.g., Mon-Fri 8:00-17:00 CET"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="escalationRules">Escalation Rules</Label>
                <Textarea
                  id="escalationRules"
                  value={formData.configuration.escalationRules}
                  onChange={(e) => updateFormData("configuration", "escalationRules", e.target.value)}
                  placeholder="Define when and how to escalate to human agents..."
                  rows={4}
                />
              </div>
            </div>
          </div>
        )

      case "deployment":
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h3 className="text-lg font-semibold">Ready for Deployment</h3>
              <p className="text-muted-foreground">
                Your Swiss AI agent is configured and ready to deploy. Review your settings below.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Configuration Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold">Business Information</h4>
                    <p className="text-sm text-muted-foreground">
                      {formData.businessInfo.companyName} ({formData.businessInfo.industry})
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formData.businessInfo.canton}, {formData.businessInfo.size}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Compliance</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.compliance.fadp && <Badge variant="outline">FADP</Badge>}
                      {formData.compliance.gdpr && <Badge variant="outline">GDPR</Badge>}
                      {formData.compliance.finma && <Badge variant="outline">FINMA</Badge>}
                      {formData.compliance.iso27001 && <Badge variant="outline">ISO 27001</Badge>}
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold">Integration</h4>
                    <p className="text-sm text-muted-foreground">CRM: {formData.integration.crm || "None"}</p>
                    <p className="text-sm text-muted-foreground">ERP: {formData.integration.erp || "None"}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Configuration</h4>
                    <p className="text-sm text-muted-foreground">Language: {formData.configuration.responseLanguage}</p>
                    <p className="text-sm text-muted-foreground">Context: {formData.configuration.culturalContext}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button size="lg" className="px-8">
                Deploy Agent
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Swiss Business Integration Wizard</h2>
        <p className="text-muted-foreground">Configure your AI agent for Swiss business requirements and compliance</p>
      </div>

      <div className="space-y-4">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            Step {currentStep + 1} of {wizardSteps.length}
          </span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="flex space-x-4">
          {wizardSteps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                index === currentStep
                  ? "bg-primary text-primary-foreground"
                  : index < currentStep
                    ? "bg-green-100 text-green-800"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {step.icon}
              <span className="hidden md:inline">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {wizardSteps[currentStep].icon}
            <span>{wizardSteps[currentStep].title}</span>
          </CardTitle>
          <CardDescription>{wizardSteps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent>{renderStepContent()}</CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <Button onClick={nextStep} disabled={currentStep === wizardSteps.length - 1}>
          {currentStep === wizardSteps.length - 1 ? "Complete" : "Next"}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
