"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Upload, Loader2, Bot, User } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { InteractiveChatModal, type ChatModal } from "./interactive-chat-modals"

interface Message {
  id: string
  content: string
  sender: "user" | "agent"
  timestamp: Date
  modal?: ChatModal
}

interface EnhancedChatInterfaceProps {
  agentName: string
  agentLogo?: string
}

export function EnhancedChatInterface({ agentName, agentLogo }: EnhancedChatInterfaceProps) {
  const { t } = useLanguage()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeModal, setActiveModal] = useState<ChatModal | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: "welcome",
      content: `Hallo! Ich bin ${agentName}. Ich kann Ihnen bei verschiedenen Aufgaben helfen. Versuchen Sie diese Befehle: "form", "quiz", "upload", "setup", "feedback"`,
      sender: "agent",
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])
  }, [agentName])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue("")
    setIsLoading(true)

    // Simulate agent response with potential modal triggers
    setTimeout(() => {
      const response = generateAgentResponse(currentInput)
      setMessages((prev) => [...prev, response])
      setIsLoading(false)
    }, 1500)
  }

  const handleModalSubmit = (modalId: string, data: any) => {
    setActiveModal(null)

    // Add user response message
    const userResponse: Message = {
      id: Date.now().toString(),
      content: formatModalResponse(modalId, data),
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userResponse])
    setIsLoading(true)

    // Generate agent follow-up
    setTimeout(() => {
      const followUp: Message = {
        id: (Date.now() + 1).toString(),
        content: generateModalFollowUp(modalId, data),
        sender: "agent",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, followUp])
      setIsLoading(false)
    }, 1000)
  }

  const handleModalCancel = () => {
    setActiveModal(null)
    const cancelMessage: Message = {
      id: Date.now().toString(),
      content: "Vorgang abgebrochen. Wie kann ich Ihnen sonst helfen?",
      sender: "agent",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, cancelMessage])
  }

  const generateAgentResponse = (input: string): Message => {
    const lowerInput = input.toLowerCase()

    // Trigger different modals based on input
    if (lowerInput.includes("form") || lowerInput.includes("formular")) {
      const modal: ChatModal = {
        id: "contact-form",
        type: "form",
        title: "Kontaktformular",
        description: "Bitte füllen Sie Ihre Kontaktdaten aus",
        data: {
          fields: [
            { name: "name", label: "Name", type: "text", required: true, placeholder: "Ihr vollständiger Name" },
            { name: "email", label: "E-Mail", type: "email", required: true, placeholder: "ihre@email.com" },
            { name: "company", label: "Unternehmen", type: "text", required: false, placeholder: "Ihr Unternehmen" },
            {
              name: "message",
              label: "Nachricht",
              type: "textarea",
              required: true,
              placeholder: "Wie kann ich Ihnen helfen?",
            },
          ],
        },
        onSubmit: (data) => handleModalSubmit("contact-form", data),
        onCancel: handleModalCancel,
      }

      setTimeout(() => setActiveModal(modal), 500)
      return {
        id: Date.now().toString(),
        content: "Gerne helfe ich Ihnen mit einem Formular. Bitte füllen Sie die folgenden Informationen aus:",
        sender: "agent",
        timestamp: new Date(),
        modal,
      }
    }

    if (lowerInput.includes("quiz") || lowerInput.includes("frage")) {
      const modal: ChatModal = {
        id: "preferences-quiz",
        type: "multiple-choice",
        title: "Präferenzen-Quiz",
        description: "Helfen Sie mir, Sie besser zu verstehen",
        data: {
          multiple: false,
          options: [
            { value: "efficiency", label: "Effizienz", description: "Ich möchte Aufgaben schnell erledigen" },
            { value: "quality", label: "Qualität", description: "Ich lege Wert auf hohe Qualität" },
            { value: "innovation", label: "Innovation", description: "Ich suche nach neuen Lösungen" },
            { value: "collaboration", label: "Zusammenarbeit", description: "Ich arbeite gerne im Team" },
          ],
        },
        onSubmit: (data) => handleModalSubmit("preferences-quiz", data),
        onCancel: handleModalCancel,
      }

      setTimeout(() => setActiveModal(modal), 500)
      return {
        id: Date.now().toString(),
        content: "Lassen Sie uns ein kurzes Quiz machen, um Ihre Präferenzen zu verstehen:",
        sender: "agent",
        timestamp: new Date(),
        modal,
      }
    }

    if (lowerInput.includes("upload") || lowerInput.includes("datei")) {
      const modal: ChatModal = {
        id: "file-upload",
        type: "file-upload",
        title: "Datei hochladen",
        description: "Laden Sie Ihre Dokumente hoch",
        data: {
          multiple: true,
          accept: ".pdf,.doc,.docx,.txt,.jpg,.png",
        },
        onSubmit: (data) => handleModalSubmit("file-upload", data),
        onCancel: handleModalCancel,
      }

      setTimeout(() => setActiveModal(modal), 500)
      return {
        id: Date.now().toString(),
        content: "Ich kann Ihnen beim Hochladen von Dateien helfen. Welche Dokumente möchten Sie teilen?",
        sender: "agent",
        timestamp: new Date(),
        modal,
      }
    }

    if (lowerInput.includes("setup") || lowerInput.includes("einrichtung")) {
      const modal: ChatModal = {
        id: "setup-wizard",
        type: "step-process",
        title: "Einrichtungs-Assistent",
        description: "Lassen Sie uns Ihr Konto einrichten",
        data: {
          steps: [
            {
              title: "Persönliche Informationen",
              description: "Grundlegende Kontaktdaten",
              type: "form",
              fields: [
                { name: "firstName", label: "Vorname", placeholder: "Ihr Vorname" },
                { name: "lastName", label: "Nachname", placeholder: "Ihr Nachname" },
              ],
            },
            {
              title: "Präferenzen",
              description: "Wählen Sie Ihre bevorzugten Einstellungen",
              type: "choice",
              multiple: true,
              options: [
                { value: "email", label: "E-Mail-Benachrichtigungen" },
                { value: "sms", label: "SMS-Benachrichtigungen" },
                { value: "newsletter", label: "Newsletter abonnieren" },
              ],
            },
            {
              title: "Sprache",
              description: "Wählen Sie Ihre bevorzugte Sprache",
              type: "choice",
              multiple: false,
              options: [
                { value: "de", label: "Deutsch" },
                { value: "fr", label: "Français" },
                { value: "it", label: "Italiano" },
                { value: "en", label: "English" },
              ],
            },
          ],
        },
        onSubmit: (data) => handleModalSubmit("setup-wizard", data),
        onCancel: handleModalCancel,
      }

      setTimeout(() => setActiveModal(modal), 500)
      return {
        id: Date.now().toString(),
        content: "Perfekt! Lassen Sie uns Ihr Konto Schritt für Schritt einrichten:",
        sender: "agent",
        timestamp: new Date(),
        modal,
      }
    }

    if (lowerInput.includes("feedback") || lowerInput.includes("bewertung")) {
      const modal: ChatModal = {
        id: "feedback",
        type: "rating",
        title: "Feedback",
        description: "Wie war Ihre Erfahrung mit mir?",
        data: {},
        onSubmit: (data) => handleModalSubmit("feedback", data),
        onCancel: handleModalCancel,
      }

      setTimeout(() => setActiveModal(modal), 500)
      return {
        id: Date.now().toString(),
        content: "Ich würde gerne Ihr Feedback erhalten. Wie war unsere Unterhaltung?",
        sender: "agent",
        timestamp: new Date(),
        modal,
      }
    }

    // Default responses
    const responses = [
      "Das ist interessant! Versuchen Sie 'form' für ein Formular, 'quiz' für Fragen, 'upload' für Dateien, 'setup' für die Einrichtung oder 'feedback' für eine Bewertung.",
      "Ich verstehe. Wie kann ich Ihnen konkret helfen? Ich kann Formulare, Quizzes, Datei-Uploads und mehr verwalten.",
      "Gerne helfe ich Ihnen weiter! Probieren Sie verschiedene Befehle aus, um meine interaktiven Funktionen zu testen.",
    ]

    return {
      id: Date.now().toString(),
      content: responses[Math.floor(Math.random() * responses.length)],
      sender: "agent",
      timestamp: new Date(),
    }
  }

  const formatModalResponse = (modalId: string, data: any): string => {
    switch (modalId) {
      case "contact-form":
        return `Formular ausgefüllt: ${data.name} (${data.email}) von ${data.company || "Privat"}`
      case "preferences-quiz":
        return `Präferenz gewählt: ${data.selected}`
      case "file-upload":
        return `${data.files.length} Datei(en) hochgeladen: ${data.files.map((f: File) => f.name).join(", ")}`
      case "setup-wizard":
        return "Einrichtung abgeschlossen"
      case "feedback":
        return `Bewertung: ${data.rating}/5 Sterne${data.feedback ? ` - "${data.feedback}"` : ""}`
      default:
        return "Eingabe erhalten"
    }
  }

  const generateModalFollowUp = (modalId: string, data: any): string => {
    switch (modalId) {
      case "contact-form":
        return `Vielen Dank, ${data.name}! Ich habe Ihre Kontaktdaten erhalten und werde mich bald bei Ihnen melden.`
      case "preferences-quiz":
        return `Ausgezeichnet! Basierend auf Ihrer Präferenz für ${data.selected} kann ich Ihnen passende Empfehlungen geben.`
      case "file-upload":
        return `Perfekt! Ich habe ${data.files.length} Datei(en) erhalten und werde sie analysieren.`
      case "setup-wizard":
        return "Großartig! Ihr Konto ist jetzt vollständig eingerichtet und einsatzbereit."
      case "feedback":
        return data.rating >= 4
          ? "Vielen Dank für das positive Feedback! Es freut mich, dass ich helfen konnte."
          : "Danke für Ihr Feedback. Ich werde mich bemühen, mich zu verbessern."
      default:
        return "Vielen Dank für Ihre Eingabe!"
    }
  }

  return (
    <div className="relative">
      <Card className="w-full h-[600px] flex flex-col">
        <CardHeader className="px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <img src={agentLogo || "/placeholder.svg"} alt={agentName} />
            </Avatar>
            <CardTitle className="text-lg">{agentName}</CardTitle>
            <div className="ml-auto text-sm text-green-600 flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Online
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-grow p-0 relative">
          <ScrollArea className="h-[460px] p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                    <Avatar className="h-6 w-6 mt-1">
                      {message.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </Avatar>
                    <div
                      className={`rounded-lg px-4 py-2 ${
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
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-2 max-w-[80%]">
                    <Avatar className="h-6 w-6 mt-1">
                      <Bot className="h-4 w-4" />
                    </Avatar>
                    <div className="rounded-lg px-4 py-2 bg-gray-100 text-gray-800">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>{agentName} tippt...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="p-3 border-t">
          <div className="flex w-full gap-2">
            <Button variant="outline" size="icon">
              <Upload className="h-4 w-4" />
            </Button>
            <Input
              placeholder={t("message_placeholder")}
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
            <Button type="submit" size="icon" disabled={!inputValue.trim() || isLoading} onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Modal Overlay */}
      {activeModal && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <InteractiveChatModal modal={activeModal} />
        </div>
      )}
    </div>
  )
}
