# Source-Based Architecture Plan
## Swiss AI Agent Registry - Integration Methods Approach

### Core Concept: Agent Source Types

Instead of quality tiers, we organize by how agents are integrated into the registry:

```typescript
enum AgentSourceType {
  MANUAL = 'manual',           // Form-based submission
  API_IMPORT = 'api_import',   // One-time API import
  WEBHOOK = 'webhook',         // Agent pushes updates
  AGENT_CARD = 'agent_card',   // A2A protocol (registry pulls)
  AGGREGATOR = 'aggregator'    // From other registries/platforms
}
```

## Revised Database Schema

```sql
-- Agents table with source-based design
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Core identity
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  provider_id UUID REFERENCES providers(id),
  
  -- Source configuration
  source_type agent_source_type NOT NULL,
  source_config JSONB DEFAULT '{}', -- Config varies by source type
  
  -- Source-specific fields
  agent_card_url TEXT, -- For AGENT_CARD sources
  webhook_url TEXT, -- For WEBHOOK sources
  external_id TEXT, -- For AGGREGATOR sources
  import_source TEXT, -- Where it was imported from
  
  -- Agent data (however sourced)
  description TEXT,
  short_description TEXT,
  capabilities JSONB DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  categories TEXT[] DEFAULT '{}',
  pricing JSONB DEFAULT '{}',
  
  -- Sync metadata
  last_sync_at TIMESTAMP,
  sync_status TEXT DEFAULT 'pending',
  sync_error TEXT,
  data_hash TEXT, -- To detect changes
  
  -- Standard fields
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Source sync configuration
CREATE TABLE source_sync_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type agent_source_type NOT NULL,
  sync_frequency_minutes INTEGER DEFAULT 1440, -- Daily by default
  retry_attempts INTEGER DEFAULT 3,
  timeout_seconds INTEGER DEFAULT 30,
  active BOOLEAN DEFAULT true,
  config JSONB DEFAULT '{}' -- Source-specific settings
);

-- Sync history for debugging
CREATE TABLE sync_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id),
  sync_type TEXT, -- 'scheduled', 'manual', 'webhook'
  status TEXT, -- 'success', 'failed', 'no_changes'
  changes_detected BOOLEAN DEFAULT false,
  error_message TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Implementation by Source Type

### 1. Manual Source (Week 1-2)
**For providers who want simple form-based submission**

```typescript
// Simple form submission
export async function createManualAgent(formData: AgentFormData) {
  const agent = await db.agents.create({
    ...formData,
    source_type: 'manual',
    source_config: {
      submitted_by: userId,
      submission_method: 'web_form'
    },
    sync_status: 'not_applicable'
  })
  
  // Queue for manual review
  await queueForReview(agent.id)
  
  return agent
}

// Manual updates through dashboard
export async function updateManualAgent(agentId: string, updates: Partial<Agent>) {
  // Check permissions
  await verifyOwnership(agentId, userId)
  
  // Update with history
  await db.agents.update(agentId, {
    ...updates,
    updated_at: new Date(),
    sync_status: 'manually_updated'
  })
  
  // Log the change
  await db.agent_events.create({
    agent_id: agentId,
    event_type: 'manual_update',
    event_data: { changes: updates }
  })
}
```

### 2. API Import Source (Week 2)
**One-time or periodic import from external APIs**

```typescript
// Import from external API
export async function importFromAPI(apiConfig: APIImportConfig) {
  const response = await fetch(apiConfig.url, {
    headers: apiConfig.headers
  })
  
  const externalAgents = await response.json()
  
  for (const externalAgent of externalAgents) {
    const mapped = mapToAgentSchema(externalAgent, apiConfig.mapping)
    
    await db.agents.upsert({
      ...mapped,
      source_type: 'api_import',
      source_config: {
        api_url: apiConfig.url,
        mapping_version: apiConfig.mappingVersion,
        import_timestamp: new Date()
      },
      external_id: externalAgent.id,
      import_source: apiConfig.source_name
    })
  }
}

// Mapping configuration
const mappingConfigs = {
  'openai_assistants': {
    name: '$.name',
    description: '$.instructions',
    capabilities: '$.tools',
    model: '$.model'
  },
  'huggingface_spaces': {
    name: '$.id',
    description: '$.description',
    tags: '$.tags',
    url: '$.url'
  }
}
```

### 3. Webhook Source (Week 3)
**Agents push updates to the registry**

```typescript
// Webhook receiver
export async function handleAgentWebhook(req: Request) {
  const { agent_id, event_type, data } = await req.json()
  
  // Verify webhook signature
  const signature = req.headers.get('x-webhook-signature')
  await verifyWebhookSignature(signature, req.body)
  
  // Find agent
  const agent = await db.agents.findOne({
    external_id: agent_id,
    source_type: 'webhook'
  })
  
  if (!agent) {
    return { error: 'Agent not found' }
  }
  
  // Process update based on event type
  switch (event_type) {
    case 'agent.updated':
      await updateAgentFromWebhook(agent.id, data)
      break
      
    case 'agent.status_changed':
      await updateAgentStatus(agent.id, data.status)
      break
      
    case 'agent.metrics':
      await updateAgentMetrics(agent.id, data.metrics)
      break
  }
  
  // Log sync
  await db.sync_history.create({
    agent_id: agent.id,
    sync_type: 'webhook',
    status: 'success',
    changes_detected: true
  })
}

// Webhook configuration endpoint
export async function configureWebhook(agentId: string, webhookUrl: string) {
  // Generate webhook secret
  const secret = generateWebhookSecret()
  
  await db.agents.update(agentId, {
    source_type: 'webhook',
    webhook_url: webhookUrl,
    source_config: {
      webhook_secret: secret,
      events: ['agent.updated', 'agent.status_changed']
    }
  })
  
  // Send test webhook
  await testWebhook(webhookUrl, secret)
  
  return { webhook_url: webhookUrl, secret }
}
```

### 4. Agent Card Source (Week 4-5)
**Full A2A Protocol Implementation**

```typescript
// Agent Card sync service
export class AgentCardSync {
  async syncAgent(agentId: string) {
    const agent = await db.agents.findById(agentId)
    
    if (agent.source_type !== 'agent_card') {
      throw new Error('Agent is not configured for agent card sync')
    }
    
    try {
      // Fetch agent card
      const response = await fetch(agent.agent_card_url, {
        headers: {
          'If-None-Match': agent.source_config.last_etag
        }
      })
      
      if (response.status === 304) {
        // No changes
        await this.logSync(agentId, 'success', false)
        return
      }
      
      const agentCard = await response.json()
      
      // Validate A2A compliance
      await this.validateAgentCard(agentCard)
      
      // Map to our schema
      const updates = this.mapAgentCardToSchema(agentCard)
      
      // Check if data actually changed
      const newHash = this.hashData(updates)
      if (newHash === agent.data_hash) {
        await this.logSync(agentId, 'success', false)
        return
      }
      
      // Update agent
      await db.agents.update(agentId, {
        ...updates,
        data_hash: newHash,
        last_sync_at: new Date(),
        sync_status: 'success',
        source_config: {
          ...agent.source_config,
          last_etag: response.headers.get('etag')
        }
      })
      
      await this.logSync(agentId, 'success', true)
      
    } catch (error) {
      await db.agents.update(agentId, {
        sync_status: 'failed',
        sync_error: error.message
      })
      
      await this.logSync(agentId, 'failed', false, error.message)
    }
  }
  
  mapAgentCardToSchema(card: A2AAgentCard): Partial<Agent> {
    return {
      name: card.name,
      description: card.description,
      capabilities: {
        skills: card.skills,
        inputModes: card.defaultInputModes,
        outputModes: card.defaultOutputModes,
        streaming: card.capabilities.streaming
      },
      languages: card.languages?.supported || [],
      pricing: card.skills?.[0]?.pricing || {},
      // Swiss-specific
      swiss_compliance: card.swissCompliance || {}
    }
  }
}
```

### 5. Aggregator Source (Month 2+)
**Import from other registries or platforms**

```typescript
// Aggregate from multiple sources
export class AggregatorService {
  sources = [
    {
      name: 'openai_gpts',
      type: 'api',
      url: 'https://api.openai.com/v1/assistants',
      mapping: 'openai_assistant'
    },
    {
      name: 'huggingface',
      type: 'scrape',
      url: 'https://huggingface.co/spaces',
      mapping: 'hf_space'
    },
    {
      name: 'swiss_gov_registry',
      type: 'api',
      url: 'https://api.swiss.gov/ai-agents',
      mapping: 'swiss_gov'
    }
  ]
  
  async aggregateAll() {
    for (const source of this.sources) {
      try {
        await this.aggregateFromSource(source)
      } catch (error) {
        console.error(`Failed to aggregate from ${source.name}:`, error)
      }
    }
  }
  
  async aggregateFromSource(source: AggregatorSource) {
    const agents = await this.fetchFromSource(source)
    
    for (const agent of agents) {
      // Check if already exists
      const existing = await db.agents.findOne({
        external_id: agent.id,
        import_source: source.name
      })
      
      if (existing) {
        // Update if changed
        await this.updateIfChanged(existing, agent, source)
      } else {
        // Create new
        await db.agents.create({
          ...this.mapAgent(agent, source.mapping),
          source_type: 'aggregator',
          external_id: agent.id,
          import_source: source.name,
          source_config: {
            source_url: source.url,
            last_import: new Date()
          }
        })
      }
    }
  }
}
```

## Sync Strategy by Source

```typescript
// Different sync strategies based on source
export class SyncOrchestrator {
  async runScheduledSync() {
    // Manual: No sync needed
    
    // API Import: Daily or weekly
    const apiImportAgents = await db.agents.findAll({
      source_type: 'api_import',
      last_sync_at: { $lt: dayjs().subtract(1, 'day') }
    })
    await this.batchSync(apiImportAgents, this.syncAPIImport)
    
    // Webhook: No scheduled sync (push-based)
    
    // Agent Card: Based on config (15min to daily)
    const agentCardAgents = await db.agents.findAll({
      source_type: 'agent_card',
      sync_status: { $ne: 'disabled' }
    })
    
    // Group by sync frequency
    const byFrequency = this.groupBySyncFrequency(agentCardAgents)
    
    for (const [frequency, agents] of byFrequency) {
      if (this.shouldSync(frequency)) {
        await this.batchSync(agents, this.syncAgentCard)
      }
    }
    
    // Aggregator: Weekly
    if (dayjs().day() === 1) { // Monday
      await this.aggregatorService.aggregateAll()
    }
  }
}
```

## Updated Implementation Timeline

### Phase 1: Core Registry (Week 1-2)
- Manual agent submission
- Basic search and browse
- Provider dashboard
- Simple review process

### Phase 2: Import Sources (Week 3)
- API import functionality
- Webhook receiver setup
- Source configuration UI
- Basic sync monitoring

### Phase 3: A2A Integration (Week 4-5)
- Agent Card validation
- A2A sync service
- Health monitoring
- Compliance checking

### Phase 4: Advanced Sources (Month 2)
- Aggregator services
- Multi-source deduplication
- Advanced mapping UI
- Source quality scoring

## Source Management UI

```typescript
// Provider can choose/change source type
export function AgentSourceConfig({ agent }) {
  return (
    <div>
      <h3>How would you like to integrate your agent?</h3>
      
      <RadioGroup value={agent.source_type} onChange={updateSourceType}>
        <Radio value="manual">
          <div>
            <h4>Manual Updates</h4>
            <p>Update your agent through our dashboard</p>
          </div>
        </Radio>
        
        <Radio value="webhook">
          <div>
            <h4>Webhook Integration</h4>
            <p>Push updates to us when your agent changes</p>
            {agent.source_type === 'webhook' && (
              <WebhookConfig agent={agent} />
            )}
          </div>
        </Radio>
        
        <Radio value="agent_card">
          <div>
            <h4>A2A Agent Card</h4>
            <p>We'll fetch updates from your agent card URL</p>
            {agent.source_type === 'agent_card' && (
              <AgentCardConfig agent={agent} />
            )}
          </div>
        </Radio>
      </RadioGroup>
    </div>
  )
}
```

## Benefits of Source-Based Approach

1. **Flexibility**: Providers choose integration method that fits their setup
2. **Scalability**: Different sync strategies for different sources
3. **Transparency**: Users can see where agent data comes from
4. **Future-Proof**: Easy to add new source types
5. **Quality Control**: Can filter/score by source reliability

This approach acknowledges that agents come from many places and have different update patterns, rather than forcing a one-size-fits-all model.