# Deployment & Migration Strategy
## Start with Vercel, Scale to Self-Hosted

### Phase 1: Launch on Vercel (Month 1-6)
**Why it makes sense:**
- Focus on product-market fit
- No DevOps overhead
- Fast iteration cycles
- ~$0-50/month

**What to avoid for easy migration:**
```typescript
// ❌ Avoid Vercel-specific features
import { Analytics } from '@vercel/analytics/react'
export const config = { runtime: 'edge' } // Vercel edge runtime

// ✅ Use portable alternatives
import { PostHog } from 'posthog-js' // Any analytics
export default async function handler() {} // Standard Node.js
```

### Phase 2: Prepare for Migration (Month 6-12)
**Containerize early:**
```dockerfile
# Dockerfile (create this even while on Vercel)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --production
EXPOSE 3000
CMD ["npm", "start"]
```

**Test locally:**
```bash
docker build -t swiss-agents .
docker run -p 3000:3000 swiss-agents
```

### Phase 3: Migration Options (When you hit ~$200/month on Vercel)

#### Option A: Cloud Run (Google Cloud)
**Best for:** Swiss compliance needs, European focus
```bash
# Deploy with one command
gcloud run deploy swiss-agents \
  --source . \
  --region europe-west6 \  # Zurich!
  --allow-unauthenticated
```

**Costs:**
- ~$50-100/month for same traffic
- Swiss data center available
- Auto-scaling built-in

#### Option B: VPS + Coolify/CapRover
**Best for:** Maximum control, lowest cost
```bash
# $20/month Hetzner server can handle significant traffic
# Deploy with git push using Coolify
git remote add coolify ssh://coolify@your-server:3000/swiss-agents.git
git push coolify main
```

#### Option C: Kubernetes (Scale)
**Best for:** Multi-region, high availability
```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: swiss-agents
spec:
  replicas: 3
  selector:
    matchLabels:
      app: swiss-agents
  template:
    metadata:
      labels:
        app: swiss-agents
    spec:
      containers:
      - name: app
        image: gcr.io/your-project/swiss-agents:latest
        ports:
        - containerPort: 3000
```

### Making Migration Seamless

#### 1. Environment Variables
```typescript
// config/index.ts - Centralize all config
export const config = {
  // Works on any platform
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.swiss-agents.ch',
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  // Platform-agnostic
  isProduction: process.env.NODE_ENV === 'production'
}
```

#### 2. CDN Strategy
```typescript
// Use any CDN, not Vercel Image Optimization
import Image from 'next/image'

// Configure for any CDN
module.exports = {
  images: {
    loader: 'custom',
    loaderFile: './lib/image-loader.js',
  },
}

// lib/image-loader.js
export default function cloudflareLoader({ src, width, quality }) {
  return `https://cdn.swiss-agents.ch/${src}?w=${width}&q=${quality || 75}`
}
```

#### 3. API Routes Pattern
```typescript
// Keep API routes simple and portable
// app/api/agents/route.ts
export async function GET(request: Request) {
  // Standard Web API - works anywhere
  const { searchParams } = new URL(request.url)
  
  // No Vercel-specific imports
  const agents = await getAgents(searchParams)
  
  return Response.json(agents)
}
```

### Migration Triggers

Consider migrating when:
1. **Cost**: Vercel bill exceeds $200/month
2. **Compliance**: Need Swiss data residency
3. **Control**: Need custom caching strategies
4. **Features**: Need background jobs, WebSockets

### Recommended Timeline

```
Month 1-6: Vercel (Focus on product)
  ↓
Month 6: Add Docker build to CI
  ↓
Month 9: Test on Cloud Run staging
  ↓
Month 12: Evaluate costs and migrate if needed
```

### Keeping Options Open

**Do:**
- ✅ Use standard Next.js features
- ✅ Keep infrastructure as code
- ✅ Document all environment variables
- ✅ Use portable libraries
- ✅ Test Docker builds regularly

**Don't:**
- ❌ Use Vercel-specific imports
- ❌ Rely on Vercel KV/Postgres
- ❌ Hard-code Vercel URLs
- ❌ Use experimental features

### Cost Comparison at Scale

| Monthly Traffic | Vercel | Cloud Run | VPS+Cloudflare |
|----------------|---------|-----------|----------------|
| 10K users      | $0-20   | $10-20    | $20            |
| 100K users     | $150    | $50-70    | $20-40         |
| 1M users       | $1500+  | $200-300  | $100-200       |

### Final Architecture (Platform-Agnostic)

```
Users → CloudFlare (CDN)
         ↓
    Load Balancer
         ↓
    Next.js Containers (any platform)
         ↓
    Supabase (backend remains same)
```

This approach gives you:
1. Fast start with Vercel
2. No lock-in
3. Clear migration path
4. Cost optimization options
5. Swiss hosting capability when needed