"use client"

import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useLanguage } from "@/contexts/language-context"
import { FeatureGate } from "@/components/feature-gate"

interface FilterSidebarProps {
  onFilterChange?: (categories: string[], languages: string[]) => void
  selectedCategories?: string[]
  selectedLanguages?: string[]
}

export function FilterSidebar({ 
  onFilterChange, 
  selectedCategories = [], 
  selectedLanguages = [] 
}: FilterSidebarProps) {
  const { t } = useLanguage()
  const [categories, setCategories] = useState<Array<{slug: string, name: any}>>([])
  const [loading, setLoading] = useState(true)

  // Predefined languages for filtering
  const availableLanguages = [
    { code: 'Deutsch', name: 'Deutsch' },
    { code: 'Français', name: 'Français' },
    { code: 'Italiano', name: 'Italiano' },
    { code: 'English', name: 'English' },
    { code: 'Rumantsch', name: 'Rumantsch' }
  ]

  const verificationLevels = [
    { value: 'basic', label: 'Basic' },
    { value: 'verified', label: 'Verified' },
    { value: 'certified', label: 'Certified' }
  ]

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      // For now, use static categories until we create the API endpoint
      const staticCategories = [
        { slug: 'customer-service', name: { en: 'Customer Service' } },
        { slug: 'legal', name: { en: 'Legal' } },
        { slug: 'technical-support', name: { en: 'Technical Support' } },
        { slug: 'translation', name: { en: 'Translation' } },
        { slug: 'data-analysis', name: { en: 'Data Analysis' } },
        { slug: 'marketing', name: { en: 'Marketing' } },
        { slug: 'multilingual', name: { en: 'Multilingual' } },
        { slug: 'support', name: { en: 'Support' } }
      ]
      setCategories(staticCategories)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (categorySlug: string, checked: boolean) => {
    const newCategories = checked 
      ? [...selectedCategories, categorySlug]
      : selectedCategories.filter(c => c !== categorySlug)
    
    onFilterChange?.(newCategories, selectedLanguages)
  }

  const handleLanguageChange = (languageCode: string, checked: boolean) => {
    const newLanguages = checked 
      ? [...selectedLanguages, languageCode]
      : selectedLanguages.filter(l => l !== languageCode)
    
    onFilterChange?.(selectedCategories, newLanguages)
  }

  const handleReset = () => {
    onFilterChange?.([], [])
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Filter</h3>
        <Button variant="outline" size="sm" className="w-full" onClick={handleReset}>
          {t("reset_filters")}
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["categories", "languages", "verification"]}>
        <AccordionItem value="categories">
          <AccordionTrigger>{t("categories")}</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {loading ? (
                <div className="text-sm text-gray-500">Loading categories...</div>
              ) : (
                categories.map((category) => (
                  <div key={category.slug} className="flex items-center space-x-2">
                    <Checkbox 
                      id={category.slug}
                      checked={selectedCategories.includes(category.slug)}
                      onCheckedChange={(checked) => 
                        handleCategoryChange(category.slug, checked as boolean)
                      }
                    />
                    <Label htmlFor={category.slug}>
                      {category.name?.en || category.slug.replace(/-/g, ' ')}
                    </Label>
                  </div>
                ))
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="languages">
          <AccordionTrigger>{t("filter_supported_languages")}</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {availableLanguages.map((language) => (
                <div key={language.code} className="flex items-center space-x-2">
                  <Checkbox 
                    id={language.code}
                    checked={selectedLanguages.includes(language.code)}
                    onCheckedChange={(checked) => 
                      handleLanguageChange(language.code, checked as boolean)
                    }
                  />
                  <Label htmlFor={language.code}>{language.name}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="verification">
          <AccordionTrigger>{t("verification_level")}</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {verificationLevels.map((level) => (
                <div key={level.value} className="flex items-center space-x-2">
                  <Checkbox id={level.value} />
                  <Label htmlFor={level.value}>{level.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}