import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ConversationEvent {
  id: string
  conversation_id: string
  event_type: string
  event_payload: any
  event_metadata: any
  created_at: string
}

class EventProcessor {
  private handlers: Map<string, (event: ConversationEvent) => Promise<void>>

  constructor() {
    this.handlers = new Map([
      ['message.user.created', this.handleUserMessage.bind(this)],
      ['conversation.started', this.handleConversationStart.bind(this)],
      ['session.expired', this.handleSessionExpired.bind(this)],
      ['file.upload.completed', this.handleFileUpload.bind(this)],
      ['tool.execution.requested', this.handleToolExecution.bind(this)],
      ['agent.response.streaming', this.handleStreamingResponse.bind(this)],
    ])
  }

  async processEvent(event: ConversationEvent) {
    console.log(`Processing event: ${event.event_type} for conversation: ${event.conversation_id}`)
    
    const handler = this.handlers.get(event.event_type)
    if (!handler) {
      console.warn(`No handler found for event type: ${event.event_type}`)
      return
    }

    try {
      await handler(event)
      
      // Mark event as processed
      await supabase.rpc('mark_event_processed', {
        p_event_id: event.id
      })
    } catch (error) {
      console.error(`Error processing event ${event.id}:`, error)
      
      // Mark event as failed with error message
      await supabase.rpc('mark_event_processed', {
        p_event_id: event.id,
        p_error_message: error.message
      })
      
      throw error
    }
  }

  private async handleUserMessage(event: ConversationEvent) {
    const { message_id, content } = event.event_payload
    
    // Get conversation and session details
    const { data: conversation } = await supabase
      .from('conversations')
      .select('*, agent_sessions(*)')
      .eq('id', event.conversation_id)
      .single()
    
    if (!conversation) {
      throw new Error('Conversation not found')
    }

    // Check if we need to create or refresh ADK session
    const session = await this.ensureActiveSession(conversation)
    
    // Call ADK agent
    const response = await this.callADKAgent({
      sessionId: session.adk_session_id,
      message: content,
      conversationId: event.conversation_id,
      messageId: message_id
    })
    
    // Store the response
    await this.storeAgentResponse(event.conversation_id, response)
  }

  private async handleConversationStart(event: ConversationEvent) {
    const { user_id, agent_id } = event.event_payload
    
    // Create ADK session
    const sessionId = await this.createADKSession(user_id, agent_id)
    
    // Update conversation with session info
    await supabase
      .from('conversations')
      .update({
        adk_session_id: sessionId,
        adk_session_expires_at: new Date(Date.now() + 3600000).toISOString() // 1 hour
      })
      .eq('id', event.conversation_id)
    
    // Create agent_sessions record
    await supabase
      .from('agent_sessions')
      .insert({
        conversation_id: event.conversation_id,
        adk_session_id: sessionId,
        expires_at: new Date(Date.now() + 3600000).toISOString(),
        user_context: {
          user_id,
          agent_id,
          started_at: new Date().toISOString()
        }
      })
  }

  private async handleSessionExpired(event: ConversationEvent) {
    const { session_id, adk_session_id } = event.event_payload
    
    // Clean up ADK session
    await this.terminateADKSession(adk_session_id)
    
    // Update conversation status
    await supabase
      .from('conversations')
      .update({ status: 'completed' })
      .eq('id', event.conversation_id)
  }

  private async handleFileUpload(event: ConversationEvent) {
    const { file_id, storage_url } = event.event_payload
    
    // Process file with ADK if needed
    // This could involve OCR, analysis, etc.
    console.log(`File uploaded: ${file_id}, URL: ${storage_url}`)
  }

  private async handleToolExecution(event: ConversationEvent) {
    const { tool_name, tool_input } = event.event_payload
    
    // Execute tool through ADK
    console.log(`Executing tool: ${tool_name}`)
  }

  private async handleStreamingResponse(event: ConversationEvent) {
    // Handle streaming responses from ADK
    console.log('Handling streaming response')
  }

  private async ensureActiveSession(conversation: any): Promise<any> {
    if (conversation.agent_sessions?.[0]?.status === 'active') {
      const session = conversation.agent_sessions[0]
      
      // Check if session is about to expire
      const expiresAt = new Date(session.expires_at)
      const now = new Date()
      const timeUntilExpiry = expiresAt.getTime() - now.getTime()
      
      if (timeUntilExpiry > 300000) { // More than 5 minutes left
        return session
      }
      
      // Refresh session
      return await this.refreshADKSession(session.adk_session_id, conversation.id)
    }
    
    // Create new session
    const { data: { user } } = await supabase.auth.admin.getUserById(conversation.user_id)
    return await this.createADKSession(conversation.user_id, conversation.agent_id)
  }

  private async createADKSession(userId: string, agentId: string): Promise<string> {
    // TODO: Implement actual ADK session creation
    // This is where we'll integrate with Google ADK
    const mockSessionId = `adk_session_${crypto.randomUUID()}`
    console.log(`Creating ADK session: ${mockSessionId}`)
    return mockSessionId
  }

  private async refreshADKSession(sessionId: string, conversationId: string): Promise<any> {
    // TODO: Implement ADK session refresh
    console.log(`Refreshing ADK session: ${sessionId}`)
    
    // Update expiry in database
    const newExpiry = new Date(Date.now() + 3600000).toISOString()
    
    const { data } = await supabase
      .from('agent_sessions')
      .update({
        expires_at: newExpiry,
        last_activity_at: new Date().toISOString()
      })
      .eq('adk_session_id', sessionId)
      .select()
      .single()
    
    return data
  }

  private async terminateADKSession(sessionId: string): Promise<void> {
    // TODO: Implement ADK session termination
    console.log(`Terminating ADK session: ${sessionId}`)
  }

  private async callADKAgent(params: {
    sessionId: string
    message: string
    conversationId: string
    messageId: string
  }): Promise<any> {
    // TODO: Implement actual ADK agent call
    console.log(`Calling ADK agent with session: ${params.sessionId}`)
    
    // Mock response for now
    return {
      content: `Echo: ${params.message}`,
      tokens_used: 10,
      processing_time: 100
    }
  }

  private async storeAgentResponse(conversationId: string, response: any) {
    // Store agent response as a message
    await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        role: 'assistant',
        content: response.content,
        tokens_used: response.tokens_used,
        processing_time_ms: response.processing_time,
        metadata: {
          response_metadata: response.metadata || {}
        }
      })
    
    // Update conversation totals
    await supabase.rpc('update_conversation_totals', {
      p_conversation_id: conversationId,
      p_tokens: response.tokens_used
    })
  }
}

// Main handler
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { event_id } = await req.json()
    
    if (!event_id) {
      throw new Error('Event ID is required')
    }
    
    // Fetch the event
    const { data: event, error } = await supabase
      .from('conversation_events')
      .select('*')
      .eq('id', event_id)
      .single()
    
    if (error || !event) {
      throw new Error('Event not found')
    }
    
    // Process the event
    const processor = new EventProcessor()
    await processor.processEvent(event)
    
    return new Response(
      JSON.stringify({ success: true, event_id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})