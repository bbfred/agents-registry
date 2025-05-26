# MVP Simplification Plan - Phase 1

## Overview
Transform the full-featured AI Agents Registry into a focused MVP with core functionality only.

## Feature Flags Strategy

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_FEATURE_PHASE=mvp  # Options: mvp, auth, full
```

### Phase Definitions
- **mvp**: Core agent browsing, details, registration, contact
- **auth**: MVP + authentication (sign-in/sign-up)
- **full**: All features enabled

## Phase 1 Tasks

### 1. Create Feature Flag System
- [ ] Create `/lib/features.ts` with feature flags
- [ ] Add environment variable support
- [ ] Create `FeatureGate` component for conditional rendering

### 2. Simplify Navigation (Header Component)
- [ ] Hide "For Businesses" dropdown
- [ ] Hide "For Individuals" dropdown
- [ ] Hide Dashboard link
- [ ] Simplify "Discover Agents" to only show "All Agents"
- [ ] Keep only: Agents, About, Contact, Register Agent

### 3. Simplify Homepage
- [ ] Remove advanced feature sections
- [ ] Focus on agent search and browse
- [ ] Simplify hero section
- [ ] Remove dashboard/project management mentions

### 4. Simplify Agent Card Component
- [ ] Remove cover image (keep logo only)
- [ ] Remove self-hosted badge
- [ ] Remove concierge badge
- [ ] Remove language display
- [ ] Keep: name, logo, description, categories, verification, rating

### 5. Simplify Filter Sidebar
- [ ] Remove price range slider
- [ ] Remove integration filters
- [ ] Remove feature filters (self-hosted, concierge)
- [ ] Keep only:
  - Category filters
  - Language filters
  - Verification level filters
  - Basic pricing (free/paid)

### 6. Simplify Agent Details Page
- [ ] Remove interactive demo functionality
- [ ] Remove tabs: Self-hosted, Concierge, Integration
- [ ] Keep tabs: Overview, Capabilities, Reviews, Contact
- [ ] Remove code examples section
- [ ] Simplify AI summary component

### 7. Simplify Registration Form
- [ ] Convert multi-section cards to single form
- [ ] Remove dynamic capability inputs
- [ ] Remove dynamic integration inputs
- [ ] Remove feature checkboxes (self-hosted, demo, concierge)
- [ ] Keep essential fields only:
  - Agent name & description
  - Categories (simplified)
  - Languages
  - Provider contact info

### 8. Hide Non-MVP Routes
Create middleware or route guards to redirect non-MVP routes:
- [ ] /dashboard/* → /agents
- [ ] /blog/* → /
- [ ] /demo/* → /agents
- [ ] /admin/* → /
- [ ] /individuals → /
- [ ] /self-hosted → /agents
- [ ] /concierge → /agents
- [ ] /implementation → /about
- [ ] /success-stories → /about
- [ ] /use-cases → /about

### 9. Simplify Footer
- [ ] Remove links to hidden features
- [ ] Keep only essential links
- [ ] Remove social media if not ready

### 10. Remove/Hide Complex Components
- [ ] Hide dashboard components
- [ ] Hide AI canvas components
- [ ] Hide chat interface components
- [ ] Hide project management components

## Component Simplification Matrix

| Component | Current State | MVP State | Changes |
|-----------|--------------|-----------|---------|
| agent-card | Complex with badges | Simple info card | Remove 4 features |
| search-bar | Simple | Keep as is | None |
| filter-sidebar | 7 filter types | 3 filter types | Remove 4 filters |
| agent-details | 6-7 tabs | 3-4 tabs | Remove 3 tabs |
| registration-form | Multi-section | Single form | Simplify 50% |
| inquiry-form | Good | Keep as is | None |

## Implementation Order

1. **Week 1**: Feature flags and navigation
2. **Week 2**: Component simplification
3. **Week 3**: Route hiding and redirects
4. **Week 4**: Testing and polish

## File Structure After MVP

```
app/
├── page.tsx              # Simplified home
├── agents/               # Browse agents
│   ├── page.tsx         
│   └── [id]/
│       └── page.tsx     # Simplified details
├── register-agent/       # Simplified form
├── contact/              # Keep as is
├── about/                # Keep as is
├── sign-in/              # Hidden initially
├── sign-up/              # Hidden initially
└── [other routes]        # Hidden/redirected

components/
├── ui/                   # Keep all
├── agent-card.tsx        # Simplified
├── filter-sidebar.tsx    # Simplified
├── header.tsx            # Simplified nav
├── footer.tsx            # Simplified links
├── search-bar.tsx        # Keep as is
├── inquiry-form.tsx      # Keep as is
└── [complex components]  # Hidden with feature flags
```

## Success Criteria

- [ ] Core user flow works: Browse → View → Contact
- [ ] Agent registration simplified but functional
- [ ] No broken links or dead ends
- [ ] Clean, focused UI without complexity
- [ ] Easy to re-enable features later

## Next Steps After MVP

1. Add authentication (Phase 2)
2. Connect to Supabase backend (Phase 3)
3. Progressive feature re-introduction (Phase 4+)