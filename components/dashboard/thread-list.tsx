"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Archive, AlertCircle, Clock } from "lucide-react"
import type { Thread } from "@/types/dashboard"
import { useLanguage } from "@/contexts/language-context"

interface ThreadListProps {
  threads: Thread[]
  onArchive: (threadId: string) => void
}

export function ThreadList({ threads, onArchive }: ThreadListProps) {
  const { t } = useLanguage()

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("default", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getStatusBadge = (status: Thread["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Active</Badge>
      case "archived":
        return <Badge variant="secondary">Archived</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("recent_threads")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {threads.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">{t("no_threads")}</div>
          ) : (
            threads.map((thread) => (
              <div key={thread.id} className="flex items-start justify-between border-b pb-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{thread.name}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>{thread.messageCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{formatDate(thread.lastMessageAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(thread.status)}
                  {thread.status === "active" && (
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onArchive(thread.id)}>
                      <Archive className="h-4 w-4" />
                    </Button>
                  )}
                  {thread.status === "error" && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                      <AlertCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
