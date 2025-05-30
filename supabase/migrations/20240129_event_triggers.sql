-- Event Triggers and Functions for Event-Driven Architecture

-- 1. Generic Event Creation Function
CREATE OR REPLACE FUNCTION create_conversation_event(
  p_conversation_id UUID,
  p_event_type TEXT,
  p_event_payload JSONB,
  p_event_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  v_event_id UUID;
BEGIN
  INSERT INTO public.conversation_events (
    conversation_id,
    event_type,
    event_payload,
    event_metadata
  ) VALUES (
    p_conversation_id,
    p_event_type,
    p_event_payload,
    p_event_metadata
  ) RETURNING id INTO v_event_id;
  
  -- Notify Edge Functions
  PERFORM pg_notify(
    'conversation_event',
    json_build_object(
      'event_id', v_event_id,
      'conversation_id', p_conversation_id,
      'event_type', p_event_type
    )::text
  );
  
  RETURN v_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Message Created Event Trigger
CREATE OR REPLACE FUNCTION trigger_message_created_event()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create event for user messages
  IF NEW.role = 'user' THEN
    PERFORM create_conversation_event(
      NEW.conversation_id,
      'message.user.created',
      jsonb_build_object(
        'message_id', NEW.id,
        'content', NEW.content,
        'metadata', NEW.metadata
      ),
      jsonb_build_object(
        'triggered_by', 'message_insert_trigger'
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_message_created
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION trigger_message_created_event();

-- 3. Conversation Status Change Event
CREATE OR REPLACE FUNCTION trigger_conversation_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    PERFORM create_conversation_event(
      NEW.id,
      'conversation.status.changed',
      jsonb_build_object(
        'old_status', OLD.status,
        'new_status', NEW.status,
        'changed_at', NOW()
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_conversation_status_change
AFTER UPDATE ON public.conversations
FOR EACH ROW
EXECUTE FUNCTION trigger_conversation_status_change();

-- 4. File Upload Event Trigger
CREATE OR REPLACE FUNCTION trigger_file_upload_event()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.upload_status = 'complete' AND OLD.upload_status != 'complete' THEN
    PERFORM create_conversation_event(
      NEW.conversation_id,
      'file.upload.completed',
      jsonb_build_object(
        'file_id', NEW.id,
        'filename', NEW.filename,
        'mime_type', NEW.mime_type,
        'file_size', NEW.file_size,
        'storage_url', NEW.storage_url
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_file_upload_complete
AFTER UPDATE ON public.file_attachments
FOR EACH ROW
EXECUTE FUNCTION trigger_file_upload_event();

-- 5. Session Expiry Check Function
CREATE OR REPLACE FUNCTION check_expired_sessions()
RETURNS void AS $$
BEGIN
  UPDATE public.agent_sessions
  SET status = 'expired'
  WHERE status = 'active' 
    AND expires_at < NOW();
    
  -- Create events for expired sessions
  INSERT INTO public.conversation_events (conversation_id, event_type, event_payload)
  SELECT 
    conversation_id,
    'session.expired',
    jsonb_build_object(
      'session_id', id,
      'adk_session_id', adk_session_id,
      'expired_at', NOW()
    )
  FROM public.agent_sessions
  WHERE status = 'expired' 
    AND expires_at >= NOW() - INTERVAL '1 minute';
END;
$$ LANGUAGE plpgsql;

-- 6. Event Processing Helper Functions
CREATE OR REPLACE FUNCTION mark_event_processed(
  p_event_id UUID,
  p_error_message TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  UPDATE public.conversation_events
  SET 
    processed = TRUE,
    processed_at = NOW(),
    error_message = p_error_message
  WHERE id = p_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Retry Failed Events Function
CREATE OR REPLACE FUNCTION retry_failed_events()
RETURNS TABLE(event_id UUID, retry_count INTEGER) AS $$
BEGIN
  RETURN QUERY
  UPDATE public.conversation_events
  SET 
    processed = FALSE,
    retry_count = retry_count + 1
  WHERE 
    processed = TRUE 
    AND error_message IS NOT NULL
    AND retry_count < 3
    AND created_at > NOW() - INTERVAL '24 hours'
  RETURNING id, retry_count;
END;
$$ LANGUAGE plpgsql;

-- 8. Analytics Aggregation Function
CREATE OR REPLACE FUNCTION get_conversation_analytics(
  p_conversation_id UUID
)
RETURNS TABLE(
  total_messages BIGINT,
  total_tokens INTEGER,
  total_cost DECIMAL,
  avg_response_time_ms INTEGER,
  tools_used JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT m.id) as total_messages,
    SUM(m.tokens_used) as total_tokens,
    SUM(u.cost_usd) as total_cost,
    AVG(m.processing_time_ms)::INTEGER as avg_response_time_ms,
    jsonb_agg(DISTINCT t.tool_name) FILTER (WHERE t.tool_name IS NOT NULL) as tools_used
  FROM public.conversations c
  LEFT JOIN public.messages m ON m.conversation_id = c.id
  LEFT JOIN public.usage_events u ON u.conversation_id = c.id
  LEFT JOIN public.tool_executions t ON t.conversation_id = c.id
  WHERE c.id = p_conversation_id
  GROUP BY c.id;
END;
$$ LANGUAGE plpgsql;