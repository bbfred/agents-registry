"use client"

import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { VerificationBadge } from "@/components/verification-badge"
import { Star } from "lucide-react"
import type { Agent } from "@/types/agent"
import { useLanguage } from "@/contexts/language-context"

interface AgentCardProps {
  agent: Agent
}

export function AgentCard({ agent }: AgentCardProps) {
  const { t } = useLanguage()

  return (
    <div className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
      <Link href={`/agents/${agent.id}`}>
        <div className="relative h-40 bg-gray-100">
          {agent.coverImage ? (
            <Image src={agent.coverImage || "/placeholder.svg"} alt={agent.name} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src={agent.logo || "/placeholder.svg"}
                alt={agent.name}
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100">
              <Image src={agent.logo || "/placeholder.svg"} alt={agent.name} fill className="object-contain" />
            </div>
            <Link href={`/agents/${agent.id}`} className="hover:underline">
              <h3 className="font-semibold">{agent.name}</h3>
            </Link>
            <VerificationBadge level={agent.verificationLevel} size="sm" />
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium ml-1">{agent.rating}</span>
          </div>
        </div>

        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{t(agent.shortDescription)}</p>

        <div className="mt-3 flex flex-wrap gap-1">
          {agent.categories.slice(0, 3).map((category) => (
            <Badge key={category} variant="secondary" className="text-xs">
              {t(category)}
            </Badge>
          ))}
          {agent.categories.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{agent.categories.length - 3}
            </Badge>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-1">
          {agent.selfHosted && (
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              {t("self_hosted_badge")}
            </Badge>
          )}
          {agent.conciergeCompatible && (
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
              {t("concierge_compatible")}
            </Badge>
          )}
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            {agent.languages.slice(0, 2).join(", ")}
            {agent.languages.length > 2 && ` +${agent.languages.length - 2}`}
          </div>
          <Link href={`/agents/${agent.id}`}>
            <Button size="sm">{t("try_now")}</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
