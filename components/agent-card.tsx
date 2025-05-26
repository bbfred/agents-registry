"use client"

import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { VerificationBadge } from "@/components/verification-badge"
import { Star } from "lucide-react"
import type { Agent } from "@/types/agent"
import { useLanguage } from "@/contexts/language-context"
import { FeatureGate } from "@/components/feature-gate"

interface AgentCardProps {
  agent: Agent
}

export function AgentCard({ agent }: AgentCardProps) {
  const { t } = useLanguage()

  return (
    <div className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="p-4 flex flex-col h-full">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100">
              <Image src={agent.logo || "/placeholder.svg"} alt={agent.name} fill className="object-contain" />
            </div>
            <Link href={`/agents/${agent.id}`} className="hover:underline">
              <h3 className="font-semibold">{agent.name}</h3>
            </Link>
            <VerificationBadge level={agent.verificationLevel} />
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium ml-1">{agent.rating}</span>
          </div>
        </div>

        <div className="mt-2 flex-1 flex flex-col">
          <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">{t(agent.shortDescription)}</p>
          
          <div className="mt-auto pt-2">
            <div className="flex flex-wrap gap-1 min-h-[1.5rem]">
              {agent.categories.slice(0, 3).map((category) => (
                <Badge key={category} variant="secondary" className="text-xs">
                  {t(category)}
                </Badge>
              ))}
              {agent.categories.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{agent.categories.length - 3}
                </Badge>
              )}
            </div>

            <FeatureGate phase="full">
              <div className="mt-2 flex flex-wrap gap-1">
                {agent.selfHosted && (
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                    {t("self_hosted_badge")}
                  </Badge>
                )}
                {agent.conciergeCompatible && (
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    {t("concierge_compatible_badge")}
                  </Badge>
                )}
              </div>
            </FeatureGate>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Link href={`/agents/${agent.id}`}>
            <Button size="sm">{t("view_details")}</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
