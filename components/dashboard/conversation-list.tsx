"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import type { Conversation } from "@/types/dashboard"
import { useLanguage } from "@/contexts/language-context"

interface ConversationListProps {
  conversations: Conversation[]
  title?: string
  showViewAll?: boolean
  limit?: number
}

export function ConversationList({
  conversations,
  title = "Recent Conversations",
  showViewAll = false,
  limit,
}: ConversationListProps) {
  const { t } = useLanguage()

  const displayConversations = limit ? conversations.slice(0, limit) : conversations

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("default", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        {showViewAll && conversations.length > 0 && (
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/conversations">
              {t("view_all")}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {displayConversations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-sm">{t("no_conversations")}</p>
            <p className="text-xs text-gray-400 mt-1">{t("start_conversation_prompt")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayConversations.map((conversation) => (
              <Link
                key={conversation.id}
                href={`/dashboard/conversations/${conversation.id}`}
                className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{conversation.title}</h3>
                  <Badge variant={conversation.status === "ongoing" ? "success" : "secondary"}>
                    {conversation.status === "ongoing" ? t("ongoing") : t("completed")}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>{conversation.messageCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{formatDate(conversation.lastMessageDate)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
