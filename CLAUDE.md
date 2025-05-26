# Swiss AI Agents Registry

## Project Overview
The Swiss AI Agents Registry is a curated platform for discovering, comparing, and integrating AI agents. It serves as a trusted marketplace where businesses and individuals can find verified AI solutions.

## Tech Stack
- **Framework**: Next.js with App Router
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **Styling**: Tailwind CSS with CSS variables for theming
- **Language**: TypeScript
- **Database**: Supabase (planned)
- **Authentication**: TBD (likely Supabase Auth)

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

## Next Steps
1. Set up feature flags system
2. Create Supabase schema and integrate
3. Simplify navigation for MVP
4. Remove complex features from initial launch
5. Set up proper authentication

## Deployment
- Currently planning to use Vercel for hosting
- Supabase for backend services
- Consider Swiss hosting requirements for compliance