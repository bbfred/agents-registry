"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Paperclip, MoreVertical, Download, Copy, Share2, Bookmark } from "lucide-react"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Types for the chat interface
interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  artifacts?: Artifact[]
  isStreaming?: boolean
}

interface Artifact {
  id: string
  type: "text" | "image" | "file" | "code" | "table" | "chart"
  content: any
  metadata?: {
    title?: string
    description?: string
    format?: string
    size?: number
  }
}

export function StreamingChatInterface({
  agentName = "AI Assistant",
  agentAvatar = "/placeholder.svg?height=40&width=40",
  initialMessages = [],
  onSendMessage,
}: {
  agentName?: string
  agentAvatar?: string
  initialMessages?: Message[]
  onSendMessage?: (message: string) => Promise<void>
}) {
  const { t } = useLanguage()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate streaming response
    const assistantMessageId = (Date.now() + 1).toString()
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    }

    setMessages((prev) => [...prev, assistantMessage])

    // Simulate streaming text
    const response =
      "Based on your request, I've analyzed the data and prepared some insights. Here's what I found:\n\n1. The market trends show a 15% increase in adoption of AI tools in Swiss SMEs over the last quarter.\n\n2. The financial sector leads with 32% adoption rate, followed by healthcare at 28%.\n\n3. Language barriers remain a significant challenge, with 45% of businesses citing it as a primary concern."

    let streamedContent = ""

    for (let i = 0; i < response.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 15 + Math.random() * 10))
      streamedContent += response[i]

      setMessages((prev) =>
        prev.map((msg) => (msg.id === assistantMessageId ? { ...msg, content: streamedContent } : msg)),
      )
    }

    // Add artifacts after streaming is complete
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                isStreaming: false,
                artifacts: [
                  {
                    id: "chart-1",
                    type: "chart",
                    content: "AI Adoption Chart",
                    metadata: {
                      title: "AI Adoption by Industry",
                      description: "Chart showing AI adoption rates across different industries in Switzerland",
                    },
                  },
                  {
                    id: "table-1",
                    type: "table",
                    content: "Data Table",
                    metadata: {
                      title: "Quarterly Adoption Rates",
                      description: "Detailed breakdown of adoption rates by quarter",
                    },
                  },
                ],
              }
            : msg,
        ),
      )
      setIsTyping(false)
    }, 500)

    if (onSendMessage) {
      await onSendMessage(input)
    }
  }

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <Avatar className="mt-1 h-8 w-8 shrink-0">
                  <AvatarImage
                    src={message.role === "assistant" ? agentAvatar : "/placeholder.svg?height=32&width=32"}
                    alt={message.role === "assistant" ? agentName : "You"}
                  />
                  <AvatarFallback>{message.role === "assistant" ? "AI" : "You"}</AvatarFallback>
                </Avatar>

                <div className={`mx-2 flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}>
                  <div className="text-xs text-muted-foreground">
                    {message.role === "assistant" ? agentName : t("chat.you")}
                    {" • "}
                    {new Intl.DateTimeFormat("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(message.timestamp)}
                  </div>

                  <div
                    className={`mt-1 rounded-lg p-3 ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>

                    {message.isStreaming && (
                      <div className="mt-1 flex">
                        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-current"></span>
                        <span
                          className="ml-1 inline-block h-2 w-2 animate-pulse rounded-full bg-current"
                          style={{ animationDelay: "0.2s" }}
                        ></span>
                        <span
                          className="ml-1 inline-block h-2 w-2 animate-pulse rounded-full bg-current"
                          style={{ animationDelay: "0.4s" }}
                        ></span>
                      </div>
                    )}
                  </div>

                  {message.artifacts && message.artifacts.length > 0 && (
                    <div className="mt-2 w-full">
                      <Tabs defaultValue={message.artifacts[0].id} className="w-full">
                        <TabsList
                          className="grid w-full"
                          style={{ gridTemplateColumns: `repeat(${message.artifacts.length}, 1fr)` }}
                        >
                          {message.artifacts.map((artifact) => (
                            <TabsTrigger key={artifact.id} value={artifact.id}>
                              {artifact.metadata?.title || artifact.type}
                            </TabsTrigger>
                          ))}
                        </TabsList>

                        {message.artifacts.map((artifact) => (
                          <TabsContent key={artifact.id} value={artifact.id} className="mt-2">
                            <Card>
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <Badge variant="outline" className="mb-2">
                                    {artifact.type.charAt(0).toUpperCase() + artifact.type.slice(1)}
                                  </Badge>

                                  <div className="flex space-x-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Download className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>

                                <div className="mt-2">
                                  {artifact.type === "chart" && (
                                    <div className="h-64 w-full rounded-md bg-muted/50 flex items-center justify-center">
                                      {artifact.content}
                                    </div>
                                  )}

                                  {artifact.type === "table" && (
                                    <div className="h-64 w-full rounded-md bg-muted/50 flex items-center justify-center">
                                      {artifact.content}
                                    </div>
                                  )}

                                  {artifact.metadata?.description && (
                                    <p className="mt-2 text-sm text-muted-foreground">
                                      {artifact.metadata.description}
                                    </p>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </TabsContent>
                        ))}
                      </Tabs>
                    </div>
                  )}

                  {message.role === "assistant" && !message.isStreaming && (
                    <div className="mt-1 flex space-x-1">
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        <Copy className="mr-1 h-3 w-3" />
                        {t("chat.copy")}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        <Share2 className="mr-1 h-3 w-3" />
                        {t("chat.share")}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        <Bookmark className="mr-1 h-3 w-3" />
                        {t("chat.save")}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t p-4">
        <div className="flex items-end space-x-2">
          <Button variant="outline" size="icon" className="shrink-0">
            <Paperclip className="h-4 w-4" />
          </Button>

          <div className="relative flex-1">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("chat.messagePlaceholder")}
              className="min-h-[60px] w-full resize-none pr-12"
              rows={1}
            />
            <Button
              size="sm"
              className="absolute bottom-2 right-2"
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>{t("chat.clearChat")}</DropdownMenuItem>
              <DropdownMenuItem>{t("chat.exportChat")}</DropdownMenuItem>
              <DropdownMenuItem>{t("chat.settings")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-2 text-xs text-muted-foreground">{t("chat.disclaimer")}</div>
      </div>
    </div>
  )
}
