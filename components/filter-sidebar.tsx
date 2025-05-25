"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useLanguage } from "@/contexts/language-context"

export function FilterSidebar() {
  const [priceRange, setPriceRange] = useState([0, 1000])
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Filter</h3>
        <Button variant="outline" size="sm" className="w-full">
          {t("reset_filters")}
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["categories", "languages", "verification", "features"]}>
        <AccordionItem value="categories">
          <AccordionTrigger>{t("categories")}</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="customer-service" />
                <Label htmlFor="customer-service">{t("customer_service")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="legal" />
                <Label htmlFor="legal">{t("legal_consultation")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="technical-support" />
                <Label htmlFor="technical-support">{t("technical_support")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="translation" />
                <Label htmlFor="translation">{t("translation")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="data-analysis" />
                <Label htmlFor="data-analysis">{t("data_analysis")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="marketing" />
                <Label htmlFor="marketing">{t("marketing")}</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="languages">
          <AccordionTrigger>{t("supported_languages")}</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="german" />
                <Label htmlFor="german">Deutsch</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="french" />
                <Label htmlFor="french">Français</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="italian" />
                <Label htmlFor="italian">Italiano</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="romansh" />
                <Label htmlFor="romansh">Rumantsch</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="english" />
                <Label htmlFor="english">English</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="verification">
          <AccordionTrigger>{t("verification_levels")}</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="basic" />
                <Label htmlFor="basic">{t("basic_verification")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="verified" />
                <Label htmlFor="verified">{t("verified")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="certified" />
                <Label htmlFor="certified">{t("certified")}</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="features">
          <AccordionTrigger>Features</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="self-hosted" />
                <Label htmlFor="self-hosted">{t("filter_self_hosted")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="concierge-compatible" />
                <Label htmlFor="concierge-compatible">{t("filter_concierge")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="demo-available" />
                <Label htmlFor="demo-available">{t("filter_demo")}</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Preis</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider defaultValue={[0, 1000]} max={1000} step={10} value={priceRange} onValueChange={setPriceRange} />
              <div className="flex items-center justify-between">
                <span>CHF {priceRange[0]}</span>
                <span>CHF {priceRange[1]}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="free" />
                  <Label htmlFor="free">{t("free")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="freemium" />
                  <Label htmlFor="freemium">{t("freemium")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="subscription" />
                  <Label htmlFor="subscription">{t("subscription")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="one-time" />
                  <Label htmlFor="one-time">{t("one_time_payment")}</Label>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="integrations">
          <AccordionTrigger>Integrationen</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="slack" />
                <Label htmlFor="slack">Slack</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="teams" />
                <Label htmlFor="teams">Microsoft Teams</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="salesforce" />
                <Label htmlFor="salesforce">Salesforce</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="sap" />
                <Label htmlFor="sap">SAP</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="abacus" />
                <Label htmlFor="abacus">Abacus</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button className="w-full">{t("apply_filters")}</Button>
    </div>
  )
}
