"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { FeatureGate } from "@/components/feature-gate"

export default function RegisterAgentPage() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    agentName: "",
    shortDescription: "",
    description: "",
    categories: [] as string[],
    languages: [] as string[],
    providerName: "",
    providerLocation: "",
    contactEmail: "",
    website: "",
  })

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

  const handleArrayToggle = (array: string[], item: string, field: string) => {
    const newArray = array.includes(item) ? array.filter((i) => i !== item) : [...array, item]
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{t("basic_information")}</h2>
          <div>
            <Label htmlFor="agentName">{t("agent_name")} *</Label>
            <Input
              id="agentName"
              name="agentName"
              value={formData.agentName}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="shortDescription">{t("short_description")} *</Label>
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
            <Label htmlFor="description">{t("detailed_description")} *</Label>
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
        </div>

        {/* Categories and Languages */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{t("categories_and_languages")}</h2>
          
          <div>
            <Label>{t("categories")} *</Label>
            <p className="text-sm text-gray-600 mb-2">{t("select_relevant_categories")}</p>
            <div className="flex flex-wrap gap-2">
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
            <Label>{t("supported_languages")} *</Label>
            <p className="text-sm text-gray-600 mb-2">{t("select_supported_languages")}</p>
            <div className="flex flex-wrap gap-2">
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
        </div>


        {/* Provider Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{t("provider_information")}</h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="providerName">{t("company_name")} *</Label>
              <Input
                id="providerName"
                name="providerName"
                value={formData.providerName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="providerLocation">{t("location")} *</Label>
              <Input
                id="providerLocation"
                name="providerLocation"
                value={formData.providerLocation}
                onChange={handleInputChange}
                placeholder="Zürich, Switzerland"
                required
              />
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="contactEmail">{t("contact_email")} *</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="website">{t("website")}</Label>
              <Input 
                id="website" 
                name="website" 
                type="url" 
                value={formData.website} 
                onChange={handleInputChange}
                placeholder="https://example.com" 
              />
            </div>
          </div>
        </div>

        {/* Terms and Submit */}
        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <Checkbox id="terms" required />
            <Label htmlFor="terms" className="text-sm">
              {t("agree_to_terms")} <Link href="/terms" className="text-primary hover:underline">{t("terms_of_service")}</Link>
            </Label>
          </div>
          
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
