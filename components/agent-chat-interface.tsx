"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Upload, Loader2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { Agent } from "@/types/agent"

interface Message {
  id: string
  content: string
  sender: "user" | "agent"
  timestamp: Date
}

interface AgentChatInterfaceProps {
  agent: Agent
}

export function AgentChatInterface({ agent }: AgentChatInterfaceProps) {
  const { t } = useLanguage()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim() || !isRunning) return

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
        content: generateAgentResponse(inputValue, agent),
        sender: "agent",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, agentMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !isRunning) return

    setIsUploading(true)

    // Simulate file upload and processing
    setTimeout(() => {
      const userMessage: Message = {
        id: Date.now().toString(),
        content: `${t("agent_file_upload_success")}: ${file.name}`,
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
          content: `${t("agent_processing_file")} ${file.name}. ${generateAgentResponse("file", agent)}`,
          sender: "agent",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, agentMessage])
        setIsLoading(false)
      }, 2000)
    }, 1500)

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const toggleAgentRunning = () => {
    if (isRunning) {
      setIsRunning(false)
    } else {
      setIsRunning(true)
      // Add welcome message when starting the agent
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: `${agent.name} ${t("agent_running")}. ${agent.shortDescription}`,
        sender: "agent",
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    }
  }

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <img src={agent.logo || "/placeholder.svg"} alt={agent.name} />
            </Avatar>
            <CardTitle className="text-lg">{agent.name}</CardTitle>
          </div>
          <Button variant={isRunning ? "destructive" : "default"} size="sm" onClick={toggleAgentRunning}>
            {isRunning ? t("stop_agent") : t("start_agent")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-0 relative">
        <ScrollArea className="h-[460px] p-4">
          {messages.length === 0 && !isRunning ? (
            <div className="h-full flex items-center justify-center text-center p-4">
              <div className="max-w-md">
                <h3 className="text-lg font-medium mb-2">{t("agent_interface")}</h3>
                <p className="text-gray-500 text-sm">
                  {t("click")} "{t("start_agent")}" {t("to_begin_interacting")}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
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
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg px-4 py-2 bg-gray-100 text-gray-800">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{agent.name} is typing...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-3 border-t">
        <div className="flex w-full gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={!isRunning || isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileUpload}
              disabled={!isRunning}
            />
          </Button>
          <Input
            placeholder={t("agent_message_placeholder")}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={!isRunning || isLoading}
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
            disabled={!isRunning || !inputValue.trim() || isLoading}
            onClick={handleSendMessage}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

// Helper function to generate agent responses based on input and agent type
function generateAgentResponse(input: string, agent: Agent): string {
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
