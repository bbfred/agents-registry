'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { ADKEventClient } from '@/lib/adk/event-client'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, Send, Paperclip, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  created_at: string
  metadata?: any
}

interface AgentChatProps {
  agentId: string
  agentName: string
  agentAvatar?: string
  onClose?: () => void
}

export function AgentChat({ agentId, agentName, agentAvatar, onClose }: AgentChatProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [attachments, setAttachments] = useState<File[]>([])
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const eventClientRef = useRef<ADKEventClient | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!user) return

    // Initialize event client
    const client = new ADKEventClient(supabase)
    eventClientRef.current = client

    // Set up event handlers
    client.setHandlers({
      onAgentResponse: (message) => {
        setMessages(prev => [...prev, message])
        setIsTyping(false)
      },
      onStreamingChunk: (chunk) => {
        // Handle streaming responses
        setIsTyping(true)
        // Update last message with chunk
        setMessages(prev => {
          const last = prev[prev.length - 1]
          if (last && last.role === 'assistant') {
            return [
              ...prev.slice(0, -1),
              { ...last, content: last.content + chunk }
            ]
          }
          return [...prev, {
            id: `temp-${Date.now()}`,
            role: 'assistant',
            content: chunk,
            created_at: new Date().toISOString()
          }]
        })
      },
      onError: (error) => {
        console.error('Chat error:', error)
        setIsTyping(false)
        setIsLoading(false)
      },
      onSessionExpired: () => {
        // Handle session expiry
        alert('Your session has expired. Please start a new conversation.')
        onClose?.()
      }
    })

    // Start conversation
    startConversation()

    return () => {
      // Clean up
      if (eventClientRef.current) {
        eventClientRef.current.endConversation()
      }
    }
  }, [user, agentId])

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const startConversation = async () => {
    if (!eventClientRef.current) return

    setIsLoading(true)
    try {
      const id = await eventClientRef.current.startConversation(
        agentId,
        `Chat with ${agentName}`
      )
      setConversationId(id)

      // Load existing messages if any
      const existingMessages = await eventClientRef.current.getMessages()
      setMessages(existingMessages)
    } catch (error) {
      console.error('Failed to start conversation:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() && attachments.length === 0) return
    if (!eventClientRef.current) return

    const messageContent = input.trim()
    setInput('')
    setIsLoading(true)

    // Add user message to UI immediately
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: messageContent,
      created_at: new Date().toISOString(),
      metadata: { attachments: attachments.map(f => f.name) }
    }
    setMessages(prev => [...prev, tempMessage])

    try {
      // Upload attachments if any
      const attachmentIds = []
      for (const file of attachments) {
        const id = await eventClientRef.current.uploadFile(file)
        attachmentIds.push(id)
      }

      // Send message
      await eventClientRef.current.sendMessage(messageContent, attachmentIds)
      
      // Clear attachments
      setAttachments([])
    } catch (error) {
      console.error('Failed to send message:', error)
      // Remove temp message on error
      setMessages(prev => prev.filter(m => m.id !== tempMessage.id))
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachments(prev => [...prev, ...files])
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <Card className="flex flex-col h-[600px] w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={agentAvatar} alt={agentName} />
            <AvatarFallback>{agentName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{agentName}</h3>
            <p className="text-sm text-muted-foreground">
              {isTyping ? 'Typing...' : 'Active'}
            </p>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "mb-4 flex",
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-lg px-4 py-2",
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              )}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              {message.metadata?.attachments?.length > 0 && (
                <div className="mt-2 text-xs opacity-70">
                  {message.metadata.attachments.length} attachment(s)
                </div>
              )}
              <p className="text-xs mt-1 opacity-60">
                {formatTime(message.created_at)}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex justify-start mb-4">
            <div className="bg-muted rounded-lg px-4 py-2">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}
      </ScrollArea>

      {/* Attachments */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 border-t">
          <div className="flex gap-2 flex-wrap">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-sm"
              >
                <Paperclip className="h-3 w-3" />
                <span className="max-w-[150px] truncate">{file.name}</span>
                <button
                  onClick={() => removeAttachment(index)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            sendMessage()
          }}
          className="flex gap-2"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || (!input.trim() && attachments.length === 0)}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  )
}