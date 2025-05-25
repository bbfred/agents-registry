"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import Link from "next/link"

export default function RegisterAgentPage() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    agentName: "",
    shortDescription: "",
    description: "",
    categories: [] as string[],
    capabilities: [] as string[],
    languages: [] as string[],
    integrations: [] as string[],
    technicalRequirements: "",
    selfHosted: false,
    demoAvailable: false,
    conciergeCompatible: false,
    providerName: "",
    providerLocation: "",
    providerFounded: "",
    contactEmail: "",
    website: "",
    documentation: "",
  })

  const [newCapability, setNewCapability] = useState("")
  const [newIntegration, setNewIntegration] = useState("")

  const availableCategories = [
    "customer_service",
    "legal_consultation",
    "technical_support",
    "translation",
    "data_analysis",
    "marketing",
    "household_management",
  ]

  const availableLanguages = ["Deutsch", "Français", "Italiano", "Rumantsch", "English"]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleArrayToggle = (array: string[], item: string, field: string) => {
    const newArray = array.includes(item) ? array.filter((i) => i !== item) : [...array, item]
    setFormData((prev) => ({ ...prev, [field]: newArray }))
  }

  const addCapability = () => {
    if (newCapability.trim()) {
      setFormData((prev) => ({ ...prev, capabilities: [...prev.capabilities, newCapability.trim()] }))
      setNewCapability("")
    }
  }

  const addIntegration = () => {
    if (newIntegration.trim()) {
      setFormData((prev) => ({ ...prev, integrations: [...prev.integrations, newIntegration.trim()] }))
      setNewIntegration("")
    }
  }

  const removeItem = (array: string[], item: string, field: string) => {
    const newArray = array.filter((i) => i !== item)
    setFormData((prev) => ({ ...prev, [field]: newArray }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Agent registration data:", formData)
    // Handle form submission
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("register_your_agent")}</h1>
        <p className="text-gray-600">{t("register_agent_description")}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t("basic_information")}</CardTitle>
              <CardDescription>{t("basic_information_description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="agentName">{t("agent_name")}</Label>
                  <Input
                    id="agentName"
                    name="agentName"
                    value={formData.agentName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="website">{t("website")}</Label>
                  <Input id="website" name="website" type="url" value={formData.website} onChange={handleInputChange} />
                </div>
              </div>
              <div>
                <Label htmlFor="shortDescription">{t("short_description")}</Label>
                <Input
                  id="shortDescription"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  placeholder={t("short_description_placeholder")}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">{t("detailed_description")}</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder={t("detailed_description_placeholder")}
                  rows={4}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Categories and Languages */}
          <Card>
            <CardHeader>
              <CardTitle>{t("categories_and_languages")}</CardTitle>
              <CardDescription>{t("categories_languages_description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{t("categories")}</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {availableCategories.map((category) => (
                    <Badge
                      key={category}
                      variant={formData.categories.includes(category) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleArrayToggle(formData.categories, category, "categories")}
                    >
                      {t(category)}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label>{t("supported_languages")}</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {availableLanguages.map((language) => (
                    <Badge
                      key={language}
                      variant={formData.languages.includes(language) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleArrayToggle(formData.languages, language, "languages")}
                    >
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Capabilities */}
          <Card>
            <CardHeader>
              <CardTitle>{t("capabilities")}</CardTitle>
              <CardDescription>{t("capabilities_description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newCapability}
                  onChange={(e) => setNewCapability(e.target.value)}
                  placeholder={t("add_capability_placeholder")}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCapability())}
                />
                <Button type="button" onClick={addCapability} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.capabilities.map((capability) => (
                  <Badge key={capability} variant="secondary" className="flex items-center gap-1">
                    {capability}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeItem(formData.capabilities, capability, "capabilities")}
                    />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Technical Details */}
          <Card>
            <CardHeader>
              <CardTitle>{t("technical_details")}</CardTitle>
              <CardDescription>{t("technical_details_description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="technicalRequirements">{t("technical_requirements")}</Label>
                <Textarea
                  id="technicalRequirements"
                  name="technicalRequirements"
                  value={formData.technicalRequirements}
                  onChange={handleInputChange}
                  placeholder={t("technical_requirements_placeholder")}
                  rows={3}
                />
              </div>
              <div>
                <Label>{t("integrations")}</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newIntegration}
                    onChange={(e) => setNewIntegration(e.target.value)}
                    placeholder={t("add_integration_placeholder")}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addIntegration())}
                  />
                  <Button type="button" onClick={addIntegration} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.integrations.map((integration) => (
                    <Badge key={integration} variant="secondary" className="flex items-center gap-1">
                      {integration}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeItem(formData.integrations, integration, "integrations")}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="selfHosted"
                    checked={formData.selfHosted}
                    onCheckedChange={(checked) => handleCheckboxChange("selfHosted", checked as boolean)}
                  />
                  <Label htmlFor="selfHosted">{t("self_hosted_available")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="demoAvailable"
                    checked={formData.demoAvailable}
                    onCheckedChange={(checked) => handleCheckboxChange("demoAvailable", checked as boolean)}
                  />
                  <Label htmlFor="demoAvailable">{t("demo_available")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="conciergeCompatible"
                    checked={formData.conciergeCompatible}
                    onCheckedChange={(checked) => handleCheckboxChange("conciergeCompatible", checked as boolean)}
                  />
                  <Label htmlFor="conciergeCompatible">{t("concierge_compatible")}</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Provider Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t("provider_information")}</CardTitle>
              <CardDescription>{t("provider_information_description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="providerName">{t("company_name")}</Label>
                  <Input
                    id="providerName"
                    name="providerName"
                    value={formData.providerName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="providerLocation">{t("location")}</Label>
                  <Input
                    id="providerLocation"
                    name="providerLocation"
                    value={formData.providerLocation}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="providerFounded">{t("founded_year")}</Label>
                  <Input
                    id="providerFounded"
                    name="providerFounded"
                    value={formData.providerFounded}
                    onChange={handleInputChange}
                    placeholder="2020"
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">{t("contact_email")}</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="documentation">{t("documentation_url")}</Label>
                <Input
                  id="documentation"
                  name="documentation"
                  type="url"
                  value={formData.documentation}
                  onChange={handleInputChange}
                  placeholder="https://docs.example.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button type="submit" size="lg">
              {t("submit_for_review")}
            </Button>
            <Button type="button" variant="outline" size="lg" asChild>
              <Link href="/agents">{t("cancel")}</Link>
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
