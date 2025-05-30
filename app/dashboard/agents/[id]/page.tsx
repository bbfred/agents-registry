"use client"

import { use, useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { AgentChatInterface } from "@/components/agent-chat-interface"
import { AgentStatusIndicator } from "@/components/dashboard/agent-status-indicator"
import { ConversationList } from "@/components/dashboard/conversation-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Power, Star, MessageSquare, Calendar, Info } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { mockAgentInstances, mockConversations } from "@/data/dashboard"
import type { AgentStatus } from "@/types/dashboard"

interface AgentDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function AgentDetailPage({ params }: AgentDetailPageProps) {
  const resolvedParams = use(params)
  const id = resolvedParams.id
  return <AgentDetailClient id={id} />
}

function AgentDetailClient({ id }: { id: string }) {
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(true)
  const [instance, setInstance] = useState(mockAgentInstances.find((a) => a.id === id))
  const [agentConversations] = useState(
    mockConversations.filter((c) => c.agentInstanceId === id),
  )
  const [isChangingStatus, setIsChangingStatus] = useState(false)
  const [isFavorite, setIsFavorite] = useState(instance?.favorite || false)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  if (!instance) {
    return (
      <div className="container mx-auto max-w-7xl py-8 px-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">{t("agent_not_found")}</h2>
          <p className="text-gray-500 mb-4">{t("agent_not_found_description")}</p>
          <Button asChild>
            <Link href="/dashboard">{t("back_to_dashboard")}</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleToggleStatus = () => {
    setIsChangingStatus(true)
    // Simulate API call
    setTimeout(() => {
      setInstance((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          status: prev.status === "active" ? ("inactive" as AgentStatus) : ("active" as AgentStatus),
        }
      })
      setIsChangingStatus(false)
    }, 1000)
  }

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite)
    setInstance((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        favorite: !prev.favorite,
      }
    })
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("default", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{instance.agent.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="chat">
            <TabsList className="mb-4">
              <TabsTrigger value="chat">{t("chat")}</TabsTrigger>
              <TabsTrigger value="conversations">{t("conversations")}</TabsTrigger>
              <TabsTrigger value="about">{t("about")}</TabsTrigger>
            </TabsList>

            <TabsContent value="chat">
              <AgentChatInterface agent={instance.agent} />
            </TabsContent>

            <TabsContent value="conversations">
              <ConversationList conversations={agentConversations} />
            </TabsContent>

            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle>{t("about_this_agent")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4 mb-6">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={instance.agent.logo || "/placeholder.svg"}
                        alt={instance.agent.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold mb-1">{instance.agent.name}</h2>
                      <p className="text-gray-500 mb-2">{instance.category}</p>
                      <div className="flex items-center gap-2">
                        <AgentStatusIndicator status={instance.status} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p>{instance.agent.description}</p>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        <div>
                          <div className="text-sm font-medium">{t("conversations")}</div>
                          <div className="text-gray-500">{instance.conversationCount}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <div>
                          <div className="text-sm font-medium">{t("added_on")}</div>
                          <div className="text-gray-500">{formatDate(instance.dateAdded)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("agent_controls")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full"
                variant={instance.status === "active" ? "outline" : "default"}
                onClick={handleToggleStatus}
                disabled={isChangingStatus}
              >
                <Power className="mr-2 h-4 w-4" />
                {instance.status === "active" ? t("turn_off_agent") : t("turn_on_agent")}
              </Button>

              <Button variant="outline" className="w-full" onClick={handleToggleFavorite}>
                <Star className={`mr-2 h-4 w-4 ${isFavorite ? "fill-yellow-500 text-yellow-500" : ""}`} />
                {isFavorite ? t("remove_from_favorites") : t("add_to_favorites")}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("capabilities")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {instance.agent.capabilities.map((capability, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <Info className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm">{capability}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("recent_conversations")}</CardTitle>
            </CardHeader>
            <CardContent>
              {agentConversations.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <MessageSquare className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                  <p className="text-sm">{t("no_conversations_yet")}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {agentConversations
                    .sort((a, b) => new Date(b.lastMessageDate).getTime() - new Date(a.lastMessageDate).getTime())
                    .slice(0, 3)
                    .map((conversation) => (
                      <Link
                        key={conversation.id}
                        href={`/dashboard/conversations/${conversation.id}`}
                        className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                      >
                        <div className="font-medium mb-1 truncate">{conversation.title}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            <span>{conversation.messageCount}</span>
                          </div>
                          <div>{formatDate(conversation.lastMessageDate)}</div>
                        </div>
                      </Link>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
