# Phase 1 Implementation Plan: MVP Backend
## Swiss AI Agent Registry

### Timeline: 3 Weeks

## Week 1: Foundation Setup

### Day 1-2: Supabase Project & Database Schema

#### 1. Create Supabase Project
```bash
# Project setup
- Project name: swiss-ai-agents
- Region: EU (Frankfurt)
- Create project at: https://app.supabase.com
```

#### 2. Initial Database Schema
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles with type distinction
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type TEXT CHECK (user_type IN ('user', 'provider')) NOT NULL,
  full_name TEXT,
  company_name TEXT, -- For providers
  phone TEXT,
  preferred_language TEXT DEFAULT 'en',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Categories table (database-driven)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name JSONB NOT NULL, -- {"en": "Customer Service", "de": "Kundenservice", ...}
  description JSONB,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Agents table
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  short_description TEXT,
  description TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  
  -- Arrays for multi-select
  category_ids UUID[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}', -- ['en', 'de', 'fr', 'it']
  
  -- Status for approval workflow
  status TEXT CHECK (status IN ('draft', 'pending_review', 'approved', 'rejected', 'suspended')) DEFAULT 'draft',
  submitted_at TIMESTAMP,
  reviewed_at TIMESTAMP,
  reviewed_by UUID REFERENCES auth.users(id),
  review_notes TEXT,
  
  -- Basic metadata
  website_url TEXT,
  documentation_url TEXT,
  pricing_info TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Agent submissions (for approval workflow)
CREATE TABLE agent_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  submitted_by UUID REFERENCES auth.users(id),
  submission_type TEXT CHECK (submission_type IN ('create', 'update')),
  previous_data JSONB, -- Store previous state for updates
  new_data JSONB, -- Store submitted changes
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  reviewer_id UUID REFERENCES auth.users(id),
  review_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP
);

-- Inquiries table
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id),
  inquiry_type TEXT CHECK (inquiry_type IN ('general', 'demo', 'integration', 'support')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT CHECK (status IN ('new', 'read', 'responded', 'closed')) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_agents_provider ON agents(provider_id);
CREATE INDEX idx_agents_categories ON agents USING GIN(category_ids);
CREATE INDEX idx_agents_languages ON agents USING GIN(languages);
CREATE INDEX idx_inquiries_agent ON inquiries(agent_id);
CREATE INDEX idx_inquiries_status ON inquiries(status);
```

#### 3. RLS Policies
```sql
-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Agents policies
CREATE POLICY "Anyone can view approved agents" ON agents
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Providers can view own agents" ON agents
  FOR SELECT USING (auth.uid() = provider_id);

CREATE POLICY "Providers can create agents" ON agents
  FOR INSERT WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Providers can update own draft agents" ON agents
  FOR UPDATE USING (
    auth.uid() = provider_id AND 
    status IN ('draft', 'rejected')
  );

-- Categories policies
CREATE POLICY "Anyone can view categories" ON categories
  FOR SELECT USING (true);

-- Inquiries policies
CREATE POLICY "Anyone can create inquiries" ON inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Providers can view inquiries for their agents" ON inquiries
  FOR SELECT USING (
    agent_id IN (
      SELECT id FROM agents WHERE provider_id = auth.uid()
    )
  );
```

### Day 3-4: Authentication Setup

#### 1. Supabase Auth Configuration
```typescript
// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createSupabaseServer() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value
        },
      },
    }
  )
}
```

#### 2. Auth Pages Updates
```typescript
// app/sign-up/page.tsx
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [userType, setUserType] = useState<'user' | 'provider'>('user')
  const [companyName, setCompanyName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Sign up with email/password
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_type: userType,
            company_name: companyName
          }
        }
      })

      if (authError) throw authError

      // Create user profile
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: authData.user.id,
            user_type: userType,
            full_name: fullName,
            company_name: userType === 'provider' ? companyName : null
          })

        if (profileError) throw profileError
      }

      // Redirect based on user type
      router.push(userType === 'provider' ? '/dashboard' : '/agents')
    } catch (error) {
      console.error('Error signing up:', error)
      alert('Error signing up. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback?userType=${userType}`
      }
    })
    if (error) console.error('Error with Google sign up:', error)
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6">
      <h1 className="text-2xl font-bold mb-6">Create an Account</h1>
      
      <form onSubmit={handleSignUp} className="space-y-4">
        <RadioGroup value={userType} onValueChange={(v) => setUserType(v as 'user' | 'provider')}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="user" id="user" />
            <Label htmlFor="user">I'm looking for AI agents</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="provider" id="provider" />
            <Label htmlFor="provider">I'm an AI agent provider</Label>
          </div>
        </RadioGroup>

        <Input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        {userType === 'provider' && (
          <Input
            type="text"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        )}

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </Button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignUp}
        >
          Continue with Google
        </Button>
      </form>
    </div>
  )
}
```

### Day 5: API Routes Setup

#### 1. Agents API
```typescript
// app/api/agents/route.ts
import { createSupabaseServer } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createSupabaseServer()
  const { searchParams } = new URL(request.url)
  
  const category = searchParams.get('category')
  const language = searchParams.get('language')
  const search = searchParams.get('search')
  
  let query = supabase
    .from('agents')
    .select('*')
    .eq('status', 'approved')
  
  if (category) {
    query = query.contains('category_ids', [category])
  }
  
  if (language) {
    query = query.contains('languages', [language])
  }
  
  if (search) {
    query = query.ilike('name', `%${search}%`)
  }
  
  const { data, error } = await query
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data)
}
```

#### 2. Inquiries API
```typescript
// app/api/inquiries/route.ts
export async function POST(request: Request) {
  const supabase = createSupabaseServer()
  const body = await request.json()
  
  const { data, error } = await supabase
    .from('inquiries')
    .insert({
      agent_id: body.agentId,
      inquiry_type: body.inquiryType || 'general',
      name: body.name,
      email: body.email,
      company: body.company,
      phone: body.phone,
      message: body.message
    })
    .select()
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  // TODO: Send email notification to provider
  
  return NextResponse.json(data)
}
```

## Week 2: Provider Dashboard & Agent Management

### Day 6-7: Provider Dashboard

#### 1. Dashboard Layout
```typescript
// app/dashboard/layout.tsx
import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createSupabaseServer()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/sign-in')
  }
  
  // Check if user is a provider
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('user_type')
    .eq('id', user.id)
    .single()
  
  if (profile?.user_type !== 'provider') {
    redirect('/agents')
  }
  
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-50 p-4">
        <nav className="space-y-2">
          <a href="/dashboard" className="block p-2 rounded hover:bg-gray-200">
            Overview
          </a>
          <a href="/dashboard/agents" className="block p-2 rounded hover:bg-gray-200">
            My Agents
          </a>
          <a href="/dashboard/inquiries" className="block p-2 rounded hover:bg-gray-200">
            Inquiries
          </a>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
```

#### 2. Agent Management
```typescript
// app/dashboard/agents/page.tsx
import { createSupabaseServer } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function MyAgentsPage() {
  const supabase = createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: agents } = await supabase
    .from('agents')
    .select('*')
    .eq('provider_id', user?.id)
    .order('created_at', { ascending: false })
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Agents</h1>
        <Link href="/dashboard/agents/new">
          <Button>Add New Agent</Button>
        </Link>
      </div>
      
      <div className="grid gap-4">
        {agents?.map((agent) => (
          <div key={agent.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{agent.name}</h3>
                <p className="text-sm text-gray-600">{agent.short_description}</p>
                <p className="text-sm mt-2">
                  Status: <span className={`font-medium ${
                    agent.status === 'approved' ? 'text-green-600' : 
                    agent.status === 'pending_review' ? 'text-yellow-600' : 
                    'text-gray-600'
                  }`}>
                    {agent.status}
                  </span>
                </p>
              </div>
              <Link href={`/dashboard/agents/${agent.id}`}>
                <Button variant="outline" size="sm">Edit</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Day 8-9: Agent Creation/Edit Form

#### 1. Create Agent Form
```typescript
// app/dashboard/agents/new/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'

export default function NewAgentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    short_description: '',
    description: '',
    website_url: '',
    documentation_url: '',
    languages: [] as string[],
    category_ids: [] as string[]
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const { data, error } = await supabase
        .from('agents')
        .insert({
          ...formData,
          provider_id: user?.id,
          status: 'draft'
        })
        .select()
        .single()

      if (error) throw error

      // Submit for review
      if (window.confirm('Submit agent for review?')) {
        await supabase
          .from('agents')
          .update({ 
            status: 'pending_review',
            submitted_at: new Date().toISOString()
          })
          .eq('id', data.id)

        await supabase
          .from('agent_submissions')
          .insert({
            agent_id: data.id,
            submitted_by: user?.id,
            submission_type: 'create',
            new_data: formData
          })
      }

      router.push('/dashboard/agents')
    } catch (error) {
      console.error('Error creating agent:', error)
      alert('Error creating agent')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Create New Agent</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Agent Name</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">URL Slug</label>
          <Input
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            pattern="[a-z0-9-]+"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Short Description</label>
          <Input
            value={formData.short_description}
            onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
            maxLength={200}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Full Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={5}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Supported Languages</label>
          <div className="space-y-2">
            {['en', 'de', 'fr', 'it'].map((lang) => (
              <label key={lang} className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.languages.includes(lang)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormData({ ...formData, languages: [...formData.languages, lang] })
                    } else {
                      setFormData({ ...formData, languages: formData.languages.filter(l => l !== lang) })
                    }
                  }}
                />
                <span>{lang.toUpperCase()}</span>
              </label>
            ))}
          </div>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Agent'}
        </Button>
      </form>
    </div>
  )
}
```

### Day 10: Manual Approval Workflow

#### 1. Admin Review Interface
```typescript
// app/admin/reviews/page.tsx
import { createSupabaseServer } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'

export default async function AdminReviewsPage() {
  const supabase = createSupabaseServer()
  
  const { data: submissions } = await supabase
    .from('agent_submissions')
    .select(`
      *,
      agent:agents(*),
      submitter:auth.users(*)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  async function approveAgent(submissionId: string, agentId: string) {
    'use server'
    
    const supabase = createSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()
    
    // Update agent status
    await supabase
      .from('agents')
      .update({ 
        status: 'approved',
        reviewed_at: new Date().toISOString(),
        reviewed_by: user?.id
      })
      .eq('id', agentId)
    
    // Update submission
    await supabase
      .from('agent_submissions')
      .update({
        status: 'approved',
        reviewer_id: user?.id,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', submissionId)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pending Reviews</h1>
      
      <div className="space-y-4">
        {submissions?.map((submission) => (
          <div key={submission.id} className="border rounded-lg p-4">
            <h3 className="font-semibold">{submission.agent.name}</h3>
            <p className="text-sm text-gray-600">{submission.agent.short_description}</p>
            <p className="text-sm mt-2">
              Submitted by: {submission.submitter.email}
            </p>
            
            <div className="mt-4 flex gap-2">
              <form action={async () => {
                'use server'
                await approveAgent(submission.id, submission.agent_id)
              }}>
                <Button type="submit" size="sm">Approve</Button>
              </form>
              
              <Button variant="outline" size="sm">Reject</Button>
              <Button variant="ghost" size="sm">View Details</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Week 3: Integration & Polish

### Day 11-12: Frontend Integration

#### 1. Update Agent Listing Page
```typescript
// app/agents/page.tsx
import { createSupabaseServer } from '@/lib/supabase/server'
import AgentCard from '@/components/agent-card'
import FilterSidebar from '@/components/filter-sidebar'

export default async function AgentsPage({
  searchParams
}: {
  searchParams: { category?: string; language?: string; search?: string }
}) {
  const supabase = createSupabaseServer()
  
  let query = supabase
    .from('agents')
    .select('*')
    .eq('status', 'approved')
  
  if (searchParams.category) {
    query = query.contains('category_ids', [searchParams.category])
  }
  
  if (searchParams.language) {
    query = query.contains('languages', [searchParams.language])
  }
  
  if (searchParams.search) {
    query = query.ilike('name', `%${searchParams.search}%`)
  }
  
  const { data: agents } = await query
  
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('display_order')
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        <aside className="w-64 flex-shrink-0">
          <FilterSidebar categories={categories || []} />
        </aside>
        
        <main className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents?.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
```

#### 2. Update Agent Details Page
```typescript
// app/agents/[id]/page.tsx
import { createSupabaseServer } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import InquiryForm from '@/components/inquiry-form'

export default async function AgentDetailsPage({
  params
}: {
  params: { id: string }
}) {
  const supabase = createSupabaseServer()
  
  const { data: agent } = await supabase
    .from('agents')
    .select('*')
    .eq('slug', params.id)
    .eq('status', 'approved')
    .single()
  
  if (!agent) {
    notFound()
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{agent.name}</h1>
        <p className="text-lg text-gray-600 mb-8">{agent.short_description}</p>
        
        <div className="prose max-w-none mb-8">
          {agent.description}
        </div>
        
        <div className="border-t pt-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Provider</h2>
          <InquiryForm agentId={agent.id} />
        </div>
      </div>
    </div>
  )
}
```

### Day 13-14: Testing & Deployment Prep

#### 1. Environment Setup
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

#### 2. Seed Data Script
```typescript
// scripts/seed-data.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seedCategories() {
  const categories = [
    {
      slug: 'customer-service',
      name: { en: 'Customer Service', de: 'Kundenservice' },
      display_order: 1
    },
    {
      slug: 'legal',
      name: { en: 'Legal', de: 'Rechtlich' },
      display_order: 2
    },
    {
      slug: 'technical-support',
      name: { en: 'Technical Support', de: 'Technischer Support' },
      display_order: 3
    }
  ]
  
  for (const category of categories) {
    await supabase.from('categories').upsert(category)
  }
}

async function main() {
  await seedCategories()
  console.log('Seed data complete')
}

main()
```

### Day 15: Deployment

#### 1. Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

#### 2. Post-Deployment Checklist
- [ ] Test authentication flow (email + Google)
- [ ] Test provider registration
- [ ] Test agent creation and submission
- [ ] Test manual approval process
- [ ] Test inquiry submission
- [ ] Verify RLS policies are working
- [ ] Check error tracking (Sentry)
- [ ] Monitor performance

## Success Metrics for Phase 1

1. **Functional Requirements**
   - ✅ Users can browse approved agents
   - ✅ Users can filter by category/language
   - ✅ Users can submit inquiries
   - ✅ Providers can register and sign in
   - ✅ Providers can create/edit agents
   - ✅ Manual approval workflow works

2. **Technical Requirements**
   - ✅ Supabase integration complete
   - ✅ Authentication working (email + Google)
   - ✅ RLS policies protecting data
   - ✅ Basic monitoring in place

3. **Performance Targets**
   - Page load < 3 seconds
   - Database queries < 100ms
   - 99% uptime

## Next Phase Preview

**Phase 2 (Weeks 4-6)** will add:
- Image upload for agent logos
- Enhanced search with Supabase full-text
- Email notifications for inquiries
- Basic analytics dashboard
- Review system for agents

## Notes & Considerations

1. **Storage Limits**: Initial Supabase free tier gives 1GB storage - sufficient for MVP
2. **Rate Limiting**: Implement rate limiting on inquiry submissions to prevent spam
3. **Backup Strategy**: Set up daily backups in Supabase dashboard
4. **Monitoring**: Use Vercel Analytics + Supabase dashboard for initial monitoring
5. **Security**: Regular security reviews, especially for the approval workflow