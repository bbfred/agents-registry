"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AgentStatusIndicator } from "@/components/dashboard/agent-status-indicator"
import { MessageSquare, Star, Clock, Power } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { AgentInstance } from "@/types/dashboard"
import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"

interface AgentCardProps {
  instance: AgentInstance
  onToggleStatus: (instanceId: string) => void
  onToggleFavorite: (instanceId: string) => void
}

export function AgentCard({ instance, onToggleStatus, onToggleFavorite }: AgentCardProps) {
  const { t } = useLanguage()
  const [isChangingStatus, setIsChangingStatus] = useState(false)

  const handleToggleStatus = () => {
    setIsChangingStatus(true)
    // Simulate API call
    setTimeout(() => {
      onToggleStatus(instance.id)
      setIsChangingStatus(false)
    }, 1000)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("default", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/dashboard/agents/${instance.id}`} className="block">
        <div className="relative h-40 bg-gray-100">
          <Image
            src={instance.agent.coverImage || "/placeholder.svg?height=160&width=400"}
            alt={instance.agent.name}
            fill
            className="object-cover"
          />
          <div className="absolute top-3 right-3">
            <AgentStatusIndicator status={instance.status} />
          </div>
          <div className="absolute top-3 left-3">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-full bg-white/80 ${instance.favorite ? "text-yellow-500" : "text-gray-400"}`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onToggleFavorite(instance.id)
              }}
            >
              <Star className={`h-4 w-4 ${instance.favorite ? "fill-yellow-500" : ""}`} />
            </Button>
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={instance.agent.logo || "/placeholder.svg"}
              alt={instance.agent.name}
              fill
              className="object-cover"
            />
          </div>

          <div>
            <Link href={`/dashboard/agents/${instance.id}`} className="hover:underline">
              <h3 className="font-semibold text-lg">{instance.agent.name}</h3>
            </Link>
            <p className="text-sm text-gray-500">{instance.category}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4 text-primary" />
            <span>
              {instance.conversationCount} {t("conversations")}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-primary" />
            <span>
              {t("last_used")}: {formatDate(instance.lastUsed)}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button
          variant={instance.status === "active" ? "outline" : "default"}
          size="sm"
          onClick={handleToggleStatus}
          disabled={isChangingStatus}
          className="w-full"
        >
          <Power className="h-4 w-4 mr-2" />
          {instance.status === "active" ? t("turn_off") : t("turn_on")}
        </Button>
      </CardFooter>
    </Card>
  )
}
