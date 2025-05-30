import { createClient } from '@supabase/supabase-js'
import { RealtimeChannel } from '@supabase/supabase-js'

export interface ConversationEvent {
  id: string
  conversation_id: string
  event_type: string
  event_payload: any
  event_metadata?: any
  created_at: string
}

export interface EventHandlers {
  onMessageCreated?: (message: any) => void
  onAgentResponse?: (response: any) => void
  onStreamingChunk?: (chunk: string) => void
  onToolExecution?: (tool: any) => void
  onError?: (error: any) => void
  onSessionExpired?: () => void
}

export class ADKEventClient {
  private supabase: any
  private conversationId: string | null = null
  private channel: RealtimeChannel | null = null
  private handlers: EventHandlers = {}

  constructor(supabaseClient: any) {
    this.supabase = supabaseClient
  }

  async startConversation(agentId: string, title?: string): Promise<string> {
    // Get current user
    const { data: { user } } = await this.supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // Create conversation
    const { data: conversation, error } = await this.supabase
      .from('conversations')
      .insert({
        user_id: user.id,
        agent_id: agentId,
        title: title || `Chat with ${agentId}`,
        status: 'active'
      })
      .select()
      .single()

    if (error) throw error

    this.conversationId = conversation.id

    // Emit conversation started event
    await this.emitEvent('conversation.started', {
      user_id: user.id,
      agent_id: agentId,
      conversation_id: conversation.id
    })

    // Set up real-time subscriptions
    this.setupSubscriptions()

    return conversation.id
  }

  async sendMessage(content: string, attachments?: string[]): Promise<void> {
    if (!this.conversationId) throw new Error('No active conversation')

    // Store message in database
    const { data: message, error } = await this.supabase
      .from('messages')
      .insert({
        conversation_id: this.conversationId,
        role: 'user',
        content,
        metadata: {
          attachments: attachments || []
        }
      })
      .select()
      .single()

    if (error) throw error

    // The database trigger will automatically create the event
    // No need to manually emit here
  }

  async uploadFile(file: File): Promise<string> {
    if (!this.conversationId) throw new Error('No active conversation')

    // Create file attachment record
    const { data: attachment, error: dbError } = await this.supabase
      .from('file_attachments')
      .insert({
        conversation_id: this.conversationId,
        filename: file.name,
        file_size: file.size,
        mime_type: file.type,
        upload_status: 'uploading',
        storage_path: `conversations/${this.conversationId}/${file.name}`
      })
      .select()
      .single()

    if (dbError) throw dbError

    // Upload to storage
    const { error: uploadError } = await this.supabase.storage
      .from('conversation-files')
      .upload(`${this.conversationId}/${attachment.id}/${file.name}`, file, {
        contentType: file.type
      })

    if (uploadError) {
      // Update status to error
      await this.supabase
        .from('file_attachments')
        .update({ upload_status: 'error' })
        .eq('id', attachment.id)
      
      throw uploadError
    }

    // Get public URL
    const { data: { publicUrl } } = this.supabase.storage
      .from('conversation-files')
      .getPublicUrl(`${this.conversationId}/${attachment.id}/${file.name}`)

    // Update attachment with URL and status
    await this.supabase
      .from('file_attachments')
      .update({
        storage_url: publicUrl,
        upload_status: 'complete'
      })
      .eq('id', attachment.id)

    return attachment.id
  }

  async endConversation(): Promise<void> {
    if (!this.conversationId) return

    // Update conversation status
    await this.supabase
      .from('conversations')
      .update({ status: 'completed' })
      .eq('id', this.conversationId)

    // Clean up subscriptions
    if (this.channel) {
      await this.supabase.removeChannel(this.channel)
    }

    this.conversationId = null
    this.channel = null
  }

  setHandlers(handlers: EventHandlers): void {
    this.handlers = { ...this.handlers, ...handlers }
  }

  private setupSubscriptions(): void {
    if (!this.conversationId) return

    // Subscribe to conversation messages
    this.channel = this.supabase
      .channel(`conversation:${this.conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${this.conversationId}`
        },
        (payload: any) => {
          if (payload.new.role === 'assistant' && this.handlers.onAgentResponse) {
            this.handlers.onAgentResponse(payload.new)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'conversation_events',
          filter: `conversation_id=eq.${this.conversationId}`
        },
        (payload: any) => {
          this.handleEvent(payload.new)
        }
      )
      .subscribe()
  }

  private handleEvent(event: ConversationEvent): void {
    switch (event.event_type) {
      case 'agent.response.streaming':
        if (this.handlers.onStreamingChunk) {
          this.handlers.onStreamingChunk(event.event_payload.chunk)
        }
        break
      
      case 'tool.execution.started':
        if (this.handlers.onToolExecution) {
          this.handlers.onToolExecution(event.event_payload)
        }
        break
      
      case 'error.occurred':
        if (this.handlers.onError) {
          this.handlers.onError(event.event_payload)
        }
        break
      
      case 'session.expired':
        if (this.handlers.onSessionExpired) {
          this.handlers.onSessionExpired()
        }
        break
    }
  }

  private async emitEvent(
    eventType: string, 
    payload: any, 
    metadata?: any
  ): Promise<void> {
    if (!this.conversationId) return

    await this.supabase.rpc('create_conversation_event', {
      p_conversation_id: this.conversationId,
      p_event_type: eventType,
      p_event_payload: payload,
      p_event_metadata: metadata || {}
    })
  }

  // Analytics and monitoring
  async getConversationAnalytics(): Promise<any> {
    if (!this.conversationId) throw new Error('No active conversation')

    const { data, error } = await this.supabase
      .rpc('get_conversation_analytics', {
        p_conversation_id: this.conversationId
      })

    if (error) throw error
    return data
  }

  // Get conversation history
  async getMessages(limit = 50, offset = 0): Promise<any[]> {
    if (!this.conversationId) throw new Error('No active conversation')

    const { data, error } = await this.supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', this.conversationId)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return data
  }
}