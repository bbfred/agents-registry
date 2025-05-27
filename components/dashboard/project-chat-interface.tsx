"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Upload, Loader2, Plus, MessageSquare } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { Project, Chat } from "@/types/dashboard"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Message {
  id: string
  content: string
  sender: "user" | "agent"
  timestamp: Date
}

interface ProjectChatInterfaceProps {
  project: Project
  chats: Chat[]
  onNewChat: (chat: Chat) => void
}

export function ProjectChatInterface({ project, chats, onNewChat }: ProjectChatInterfaceProps) {
  const { t } = useLanguage()
  const [activeChat, setActiveChat] = useState<Chat | null>(chats.length > 0 ? chats[0] : null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [newChatTitle, setNewChatTitle] = useState("")
  const [newChatDialogOpen, setNewChatDialogOpen] = useState(false)

  const handleSendMessage = () => {
    if (!inputValue.trim() || !activeChat) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate agent response
    setTimeout(() => {
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAgentResponse(inputValue, project.agent),
        sender: "agent",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, agentMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleFileUpload = () => {
    if (!activeChat) return
    setIsUploading(true)

    // Simulate file upload
    setTimeout(() => {
      const userMessage: Message = {
        id: Date.now().toString(),
        content: `${t("chat_file_upload_success")}: example.pdf`,
        sender: "user",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsUploading(false)

      // Simulate agent response to file
      setIsLoading(true)
      setTimeout(() => {
        const agentMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `${t("chat_processing_file")} example.pdf. ${generateAgentResponse("file", project.agent)}`,
          sender: "agent",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, agentMessage])
        setIsLoading(false)
      }, 1500)
    }, 1000)
  }

  const handleCreateNewChat = () => {
    if (!newChatTitle.trim()) return

    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      projectId: project.id,
      title: newChatTitle,
      createdAt: new Date(),
      lastMessageAt: new Date(),
      messageCount: 0,
      status: "active",
    }

    onNewChat(newChat)
    setActiveChat(newChat)
    setMessages([])
    setNewChatTitle("")
    setNewChatDialogOpen(false)
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("default", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[600px]">
      <Card className="md:col-span-1 h-full flex flex-col">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg">{t("conversations")}</CardTitle>
          <Dialog open={newChatDialogOpen} onOpenChange={setNewChatDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("new_conversation")}</DialogTitle>
                <DialogDescription>{t("new_conversation_description")}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="chatTitle">{t("conversation_title")}</Label>
                  <Input
                    id="chatTitle"
                    value={newChatTitle}
                    onChange={(e) => setNewChatTitle(e.target.value)}
                    placeholder={t("conversation_title_placeholder")}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateNewChat} disabled={!newChatTitle.trim()}>
                  {t("start_conversation")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <ScrollArea className="flex-1">
          <div className="px-4 py-2 space-y-2">
            {chats.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <p className="text-sm">{t("no_conversations")}</p>
                <p className="text-xs text-gray-400 mt-1">{t("start_conversation_prompt")}</p>
              </div>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    activeChat?.id === chat.id ? "bg-primary text-primary-foreground" : "hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveChat(chat)}
                >
                  <div className="font-medium text-sm mb-1 truncate">{chat.title}</div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs opacity-80 flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      <span>{chat.messageCount}</span>
                    </div>
                    <div className="text-xs opacity-80">{formatTime(chat.lastMessageAt)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        <div className="p-3 border-t">
          <Button variant="outline" className="w-full" onClick={() => setNewChatDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t("new_conversation")}
          </Button>
        </div>
      </Card>

      <Card className="md:col-span-3 h-full flex flex-col">
        {activeChat ? (
          <>
            <CardHeader className="px-4 py-3 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <img src={project.agent.logo || "/placeholder.svg"} alt={project.agent.name} />
                  </Avatar>
                  <CardTitle className="text-lg">{activeChat.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center p-4">
                    <div className="max-w-md">
                      <h3 className="text-lg font-medium mb-2">{t("start_conversation")}</h3>
                      <p className="text-gray-500 text-sm">
                        {t("start_conversation_with_agent").replace("{agent}", project.agent.name)}
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.sender === "user" ? "bg-primary text-white" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p>{message.content}</p>
                        <div
                          className={`text-xs mt-1 ${
                            message.sender === "user" ? "text-primary-foreground/70" : "text-gray-500"
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg px-4 py-2 bg-gray-100 text-gray-800">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>
                          {project.agent.name} {t("is_typing")}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="p-3 border-t">
              <div className="flex w-full gap-2">
                <Button variant="outline" size="icon" disabled={isUploading} onClick={handleFileUpload}>
                  {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                </Button>
                <Input
                  placeholder={t("chat_message_placeholder")}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!inputValue.trim() || isLoading}
                  onClick={handleSendMessage}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-center p-4">
            <div className="max-w-md">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-lg font-medium mb-2">{t("no_active_conversation")}</h3>
              <p className="text-gray-500 text-sm mb-4">{t("select_conversation_or_create_new")}</p>
              <Button onClick={() => setNewChatDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t("new_conversation")}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

// Helper function to generate agent responses based on input and agent type
function generateAgentResponse(input: string, agent: { category?: string }): string {
  // This would be replaced with actual API calls to the agent in a real implementation
  const responses: Record<string, string[]> = {
    "swiss-customer-support": [
      "Wie kann ich Ihnen mit Ihrem Kundenservice-Anliegen helfen?",
      "Haben Sie eine spezifische Frage zu einem Produkt oder einer Dienstleistung?",
      "Ich kann Ihnen bei der Lösung Ihres Problems helfen. Könnten Sie mir mehr Details geben?",
    ],
    "swiss-translator": [
      "Ich habe Ihren Text übersetzt. Hier ist das Ergebnis.",
      "Möchten Sie, dass ich diesen Text in eine bestimmte Sprache übersetze?",
      "Ich kann Texte zwischen Deutsch, Französisch, Italienisch und Rätoromanisch übersetzen.",
    ],
    "swiss-tech-support": [
      "Ich habe Ihr technisches Problem analysiert. Versuchen Sie folgende Schritte...",
      "Könnten Sie mir mehr Details zu Ihrem technischen Problem geben?",
      "Haben Sie bereits versucht, Ihr Gerät neu zu starten?",
    ],
    "swiss-household-manager": [
      "Ich habe Ihren Haushaltsplan aktualisiert. Hier sind die nächsten anstehenden Aufgaben.",
      "Möchten Sie einen neuen Termin zu Ihrem Kalender hinzufügen?",
      "Ich habe Ihre Einkaufsliste aktualisiert. Benötigen Sie weitere Hilfe?",
    ],
    file: [
      "Ich habe die Datei analysiert und folgende Informationen gefunden...",
      "Die hochgeladene Datei wurde erfolgreich verarbeitet.",
      "Basierend auf dieser Datei empfehle ich folgende Schritte...",
    ],
  }

  // Default responses if agent-specific responses aren't available
  const defaultResponses = [
    "Ich habe Ihre Anfrage erhalten und arbeite daran.",
    "Wie kann ich Ihnen weiterhelfen?",
    "Haben Sie weitere Fragen zu diesem Thema?",
  ]

  // Get responses for this agent or use default
  const agentResponses = responses[agent.id] || defaultResponses

  // For file uploads, use file-specific responses
  if (input === "file") {
    return responses.file[Math.floor(Math.random() * responses.file.length)]
  }

  // Return a random response from the agent's response list
  return agentResponses[Math.floor(Math.random() * agentResponses.length)]
}
