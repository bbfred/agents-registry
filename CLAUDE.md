# Swiss AI Agents Registry

## Project Overview
The Swiss AI Agents Registry is a curated platform for discovering, comparing, and integrating AI agents. It serves as a trusted marketplace where businesses and individuals can find verified AI solutions.

## Tech Stack
- **Framework**: Next.js with App Router
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS v4)
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **Language**: TypeScript
- **Database**: Supabase (planned)
- **Authentication**: Supabase Auth (planned)

## Key Concepts

### Agent Registry
- Central repository of AI agents with verification badges
- Categories: Customer Service, Legal, Technical Support, Translation, Data Analysis, etc.
- Verification levels: Identity Verified, Capability Verified, Swiss Compliance

### MVP Features (Phase 1)
- Agent browsing and search
- Agent details pages
- Basic authentication (sign-in/sign-up)
- Agent registration form
- Contact/inquiry system

### Full Features (Currently Hidden)
- Dashboard with project management
- AI Canvas editor
- Advanced chat interfaces
- Multi-language support (EN, DE, FR, IT, RM)
- Blog system
- Self-hosted agent guides
- For Businesses/Individuals sections
- Concierge service

## Development Approach

### Feature Flags Strategy
We're using environment-based feature flags to progressively roll out features:
- MVP ships with core agent registry functionality
- Advanced features hidden behind flags
- No code deletion - everything preserved in main branch

### Branches
- `main` - Active development branch (MVP version)
- `v0-full-featured` - Original v0.dev state with all features

## File Structure
```
app/
├── page.tsx              # Home page
├── agents/               # Agent browsing and details
├── sign-in/              # Authentication
├── sign-up/              
├── register-agent/       # Agent registration
├── contact/              # Contact forms
├── about/                # About pages
├── dashboard/            # Project management (feature-flagged)
├── blog/                 # Blog system (feature-flagged)
└── ...                   # Other feature-flagged sections

components/
├── ui/                   # shadcn/ui components
├── agent-card.tsx        # Agent display components
├── dashboard/            # Dashboard components (feature-flagged)
└── ...

data/
├── agents.ts             # Static agent data (to be moved to Supabase)
└── dashboard.ts          # Dashboard mock data

lib/
├── utils.ts              # Utility functions
└── features.ts           # Feature flags configuration (to be created)
```

## Commands
```bash
npm run dev       # Start development server with Turbopack
npm run build     # Build for production
npm run lint      # Run ESLint
```

## Known Issues
- ClientPage component pattern needs adjustment for Next.js App Router
- Translations are incomplete (only English fully translated)
- No backend integration yet

## Development Progress

### ✅ Phase 1: MVP Simplification (Completed)
- Implemented feature flag system with environment-based phases
- Created FeatureGate component for conditional rendering
- Simplified navigation to show only core features
- Reduced agent cards to essential information
- Simplified filter sidebar (categories, languages, verification only)
- Streamlined agent details to 3 tabs (Overview, Capabilities, Reviews)
- Simplified registration form to single page with basic fields
- Added route protection for non-MVP features

### 📋 Phase 2: Supabase Backend (Next)
1. Database Schema:
   - Agents table (name, description, categories, languages, etc.)
   - Providers table (company information)
   - Reviews table (ratings and comments)
   - Inquiries table (contact form submissions)

2. API Implementation:
   - GET /api/agents (list with filtering)
   - GET /api/agents/[id] (agent details)
   - POST /api/agents (registration)
   - POST /api/inquiries (contact form)

3. Data Migration:
   - Move from static data to database
   - Set up initial seed data

### 🔮 Phase 3: Authentication
- Implement Supabase Auth
- Provider accounts for agent management
- Protected routes for registration/editing
- User profiles and saved agents

### 🚀 Phase 4: Progressive Feature Rollout
- Enable features via NEXT_PUBLIC_FEATURE_PHASE
- auth: Adds authentication features
- full: Enables all features (dashboard, blog, etc.)

## Feature Flag Usage

```bash
# .env.local
NEXT_PUBLIC_FEATURE_PHASE=mvp   # Default: core features only
NEXT_PUBLIC_FEATURE_PHASE=auth  # MVP + authentication
NEXT_PUBLIC_FEATURE_PHASE=full  # All features enabled
```

## Key Files Created/Modified

### Feature System
- `/lib/features.ts` - Feature flag configuration
- `/components/feature-gate.tsx` - Conditional rendering component
- `/components/dashboard-protection.tsx` - Dashboard route protection
- `/components/feature-protection.tsx` - General route protection

### Simplified Components
- `agent-card.tsx` - Removed advanced badges
- `filter-sidebar.tsx` - Basic filters only
- `header.tsx` - MVP navigation only
- `agents/[id]/page.tsx` - 3 tabs instead of 6-7
- `register-agent/page.tsx` - Single page form

## Deployment
- Currently planning to use Vercel for hosting
- Supabase for backend services
- Consider Swiss hosting requirements for compliance