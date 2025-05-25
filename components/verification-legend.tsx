"use client"

import { Shield, ShieldCheck, ShieldAlert } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function VerificationLegend() {
  const { t } = useLanguage()

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">{t("verification_levels")}</h3>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="bg-gray-100 p-2 rounded-full">
            <Shield className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h4 className="font-medium">{t("basic_verification")}</h4>
            <p className="text-sm text-gray-600">{t("basic_verification_desc")}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium">{t("verified")}</h4>
            <p className="text-sm text-gray-600">{t("verified_desc")}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="bg-green-100 p-2 rounded-full">
            <ShieldAlert className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h4 className="font-medium">{t("certified")}</h4>
            <p className="text-sm text-gray-600">{t("certified_desc")}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
