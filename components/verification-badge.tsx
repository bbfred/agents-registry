"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Shield, ShieldCheck, ShieldAlert } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface VerificationBadgeProps {
  level: "basic" | "verified" | "certified"
}

export function VerificationBadge({ level }: VerificationBadgeProps) {
  const { t } = useLanguage()

  const badgeConfig = {
    basic: {
      icon: Shield,
      color: "bg-gray-100 text-gray-600",
      label: t("basic_verification"),
      description: t("basic_verification_desc"),
    },
    verified: {
      icon: ShieldCheck,
      color: "bg-blue-100 text-blue-600",
      label: t("verified"),
      description: t("verified_desc"),
    },
    certified: {
      icon: ShieldAlert,
      color: "bg-green-100 text-green-600",
      label: t("certified"),
      description: t("certified_desc"),
    },
  }

  const { icon: Icon, color, label, description } = badgeConfig[level]

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${color}`}>
            <Icon className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">{label}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
