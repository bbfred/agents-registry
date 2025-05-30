-- Event-Driven Architecture Foundation Migration
-- This migration creates the core tables and infrastructure for ADK integration

-- 1. Core Event Store
CREATE TABLE public.conversation_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  event_version TEXT DEFAULT '1.0',
  event_payload JSONB NOT NULL,
  event_metadata JSONB DEFAULT '{}',
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  retry_count INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Indexes for performance
  INDEX idx_conversation_events_conversation_id (conversation_id),
  INDEX idx_conversation_events_event_type (event_type),
  INDEX idx_conversation_events_processed (processed),
  INDEX idx_conversation_events_created_at (created_at DESC)
);

-- 2. Enhanced Conversations Table
CREATE TABLE public.conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  agent_id TEXT NOT NULL,
  title TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'error')),
  metadata JSONB DEFAULT '{}',
  adk_session_id TEXT,
  adk_session_expires_at TIMESTAMPTZ,
  total_messages INTEGER DEFAULT 0,
  total_tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_conversations_user_id (user_id),
  INDEX idx_conversations_status (status),
  INDEX idx_conversations_created_at (created_at DESC)
);

-- 3. Messages with Event Support
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  parent_message_id UUID REFERENCES public.messages(id),
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system', 'tool')),
  content TEXT NOT NULL,
  content_type TEXT DEFAULT 'text' CHECK (content_type IN ('text', 'markdown', 'code', 'error')),
  metadata JSONB DEFAULT '{}',
  tokens_used INTEGER,
  processing_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_messages_conversation_id (conversation_id),
  INDEX idx_messages_created_at (created_at DESC)
);

-- 4. Agent Sessions Management
CREATE TABLE public.agent_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) UNIQUE,
  adk_session_id TEXT NOT NULL UNIQUE,
  user_context JSONB DEFAULT '{}',
  session_state JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'terminated')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  last_activity_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tool Executions Tracking
CREATE TABLE public.tool_executions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id),
  message_id UUID REFERENCES public.messages(id),
  tool_name TEXT NOT NULL,
  tool_input JSONB DEFAULT '{}',
  tool_output JSONB DEFAULT '{}',
  execution_time_ms INTEGER,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'success', 'error')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 6. File Attachments
CREATE TABLE public.file_attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id),
  message_id UUID REFERENCES public.messages(id),
  filename TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  storage_provider TEXT DEFAULT 'google_cloud_storage',
  storage_path TEXT NOT NULL,
  storage_url TEXT,
  upload_status TEXT DEFAULT 'pending' CHECK (upload_status IN ('pending', 'uploading', 'complete', 'error')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_file_attachments_conversation_id (conversation_id),
  INDEX idx_file_attachments_message_id (message_id)
);

-- 7. Usage Analytics
CREATE TABLE public.usage_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  conversation_id UUID REFERENCES public.conversations(id),
  agent_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  tokens_consumed INTEGER DEFAULT 0,
  cost_usd DECIMAL(10,6),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_usage_events_user_id (user_id),
  INDEX idx_usage_events_created_at (created_at DESC)
);

-- Enable Row Level Security
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage own conversations" ON public.conversations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view messages in own conversations" ON public.messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM public.conversations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Service role has full access" ON public.conversations
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Repeat service role policy for all tables
CREATE POLICY "Service role has full access" ON public.messages
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role has full access" ON public.conversation_events
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Function to update conversation updated_at
CREATE OR REPLACE FUNCTION update_conversation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations 
  SET updated_at = NOW() 
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update conversation on new message
CREATE TRIGGER update_conversation_on_message
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_updated_at();