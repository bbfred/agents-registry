# Swiss AI Agents Registry - Development Guide

## Quick Links
- 🚀 **Current Status**: [PROJECT_STATUS.md](./docs/PROJECT_STATUS.md)
- 📋 **Backend Plans**: [backend-implementation-plan.md](./docs/backend-implementation-plan.md)
- 🔄 **Migration Guide**: [deployment-migration-strategy.md](./docs/deployment-migration-strategy.md)

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
- No backend integration yet (Supabase planned)
- Limited to static data currently
- Some advanced features are feature-flagged but not fully implemented

## Current Status

**Phase 1 MVP is COMPLETE and ready for production deployment.** 

The application now has:
- ✅ Clean, professional UI with consistent layouts
- ✅ Core agent browsing and discovery functionality
- ✅ Detailed agent information pages
- ✅ Agent registration system
- ✅ Contact forms with proper validation
- ✅ Responsive design for all devices
- ✅ Feature flag system for future expansion
- ✅ SSR-optimized with no hydration errors
- ✅ Comprehensive translation system

## Development Progress

### ✅ Phase 1: MVP Simplification & UI Polish (Completed)
- Implemented feature flag system with environment-based phases
- Created FeatureGate component for conditional rendering
- Simplified navigation to show only core features
- Reduced agent cards to essential information with consistent layout
- Simplified filter sidebar (categories, languages, verification, pricing only)
- Streamlined agent details to 3 tabs (Overview, Capabilities, Reviews)
- Simplified registration form to single page with basic fields
- Added route protection for non-MVP features
- **Fixed hydration errors** - Resolved SSR/client mismatch issues
- **Improved translations** - Added missing translation keys for all forms
- **Enhanced card layout** - Fixed alignment of View Details buttons and category tags
- **Optimized performance** - Removed unused dependencies and improved type safety

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
- `agent-card.tsx` - Removed advanced badges, fixed layout alignment with consistent card heights
- `filter-sidebar.tsx` - Basic filters only (categories, languages, verification, pricing)
- `header.tsx` - MVP navigation only
- `agents/[id]/page.tsx` - 3 tabs instead of 6-7
- `register-agent/page.tsx` - Single page form with proper translations
- `contact/page.tsx` - Contact form with improved spacing and translations

### Translation System
- `/translations/index.ts` - Comprehensive English translations with proper key organization
- `/lib/translations-simple.ts` - Simplified translation function for MVP
- `/contexts/language-context.tsx` - SSR-friendly language context with hydration fixes

## Deployment

### Production Readiness
The MVP is **ready for production deployment** with the following characteristics:
- Static data from `/data/agents.ts` (7 sample agents)
- No database dependency required for MVP
- All forms work (but submissions are logged to console)
- Fully responsive and mobile-optimized
- SEO-friendly with proper meta tags

### Deployment Strategy

#### Immediate Deployment (Vercel)
- **Platform**: Vercel (optimal for Next.js)
- **Domain**: Custom domain recommended
- **Environment**: Set `NEXT_PUBLIC_FEATURE_PHASE=mvp`
- **Monitoring**: Vercel Analytics enabled
- **Cost**: ~$0-50/month for initial traffic

#### Deployment Commands
```bash
# Build and test locally
npm run build
npm run start

# Deploy to Vercel
vercel --prod
```

#### Migration Strategy (When Needed)
When Vercel costs exceed $200/month or Swiss compliance requires local hosting:

1. **Cloud Run (Google Cloud)** - Swiss data center available in Zurich
2. **VPS + Coolify** - Maximum control, lowest cost
3. **Kubernetes** - For multi-region, high availability

See [Deployment & Migration Strategy](./docs/deployment-migration-strategy.md) for detailed migration plans.

### Future Backend Integration
Phase 2 will add Supabase backend with:
- **Database**: Agent data, user profiles, inquiries
- **Authentication**: Email/password and social logins
- **File Storage**: Agent logos and documents
- **Real-time**: Live updates for agent status

See [Backend Implementation Plan](./docs/backend-implementation-plan.md) for detailed roadmap.