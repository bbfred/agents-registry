# Swiss AI Agents Registry

A curated platform for discovering, comparing, and integrating AI agents in Switzerland. This project serves as a trusted marketplace where businesses and individuals can find verified AI solutions.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS v4)
- **Styling**: Tailwind CSS v4 with CSS variables
- **Language**: TypeScript
- **Database**: Supabase (planned)
- **Authentication**: Supabase Auth (planned)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd agents-registry
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local file
   NEXT_PUBLIC_FEATURE_PHASE=mvp  # Options: mvp, auth, full
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3001](http://localhost:3001)** with your browser to see the result.

## Available Scripts

```bash
npm run dev       # Start development server with Turbopack
npm run build     # Build for production
npm run lint      # Run ESLint
npm run start     # Start production server
```

## Feature Phases

This project uses feature flags to progressively roll out functionality:

- **MVP Phase** (`mvp`): Core agent browsing, details, registration, and contact
- **Auth Phase** (`auth`): MVP + authentication features
- **Full Phase** (`full`): All features including dashboard, blog, and advanced functionality

## Project Structure

```
app/                    # Next.js App Router pages
├── agents/            # Agent browsing and details
├── contact/           # Contact forms
├── register-agent/    # Agent registration
└── dashboard/         # Project management (feature-flagged)

components/            # React components
├── ui/               # shadcn/ui components
├── agent-card.tsx    # Agent display components
└── dashboard/        # Dashboard components (feature-flagged)

lib/                  # Utility functions
├── features.ts       # Feature flags configuration
└── utils.ts          # General utilities

translations/         # Internationalization
└── index.ts          # Translation keys and messages
```

## Key Features

- **Agent Discovery**: Browse and search AI agents by category, language, and verification level
- **Agent Details**: Comprehensive information about each agent's capabilities and reviews
- **Agent Registration**: Simple form for providers to register their AI agents
- **Responsive Design**: Mobile-friendly interface with consistent card layouts
- **Feature Flags**: Progressive feature rollout system
- **Type Safety**: Full TypeScript implementation

## Project Status

**Phase 1 MVP is COMPLETE** ✅ - Ready for production deployment!

See [PROJECT_STATUS.md](./docs/PROJECT_STATUS.md) for current status and deployment guide.

## Documentation

- **Project Status & Deployment**: [PROJECT_STATUS.md](./docs/PROJECT_STATUS.md)
- **Development Guide**: [CLAUDE.md](./CLAUDE.md)
- **Backend Plans**: [docs/backend-implementation-plan.md](./docs/backend-implementation-plan.md)
- **Migration Strategy**: [docs/deployment-migration-strategy.md](./docs/deployment-migration-strategy.md)

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Test locally with `npm run dev`
4. Run linting with `npm run lint`
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.
