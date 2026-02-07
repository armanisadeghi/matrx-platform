# CLAUDE.md — Matrx Platform Template

Turborepo monorepo template for generating custom AI-integrated web and mobile applications. This is a starting point for new AI Matrx projects, not a standalone product.

---

## Monorepo Structure

```
apps/
  web/                → Next.js 16.1 (App Router)
  mobile/             → Expo 54 (React Native 0.81)
packages/
  shared/             → Types, Zod schemas, constants, utilities (@matrx/shared)
  supabase/           → Database types, client factory (@matrx/supabase)
  ai-client/          → Matrx AI integration SDK (@matrx/ai-client)
  typescript-config/  → Shared tsconfig presets
  eslint-config/      → Shared ESLint configs
```

### Package Imports

```typescript
import { loginSchema, API_ROUTES } from "@matrx/shared"
import { createSupabaseClient, getProfile } from "@matrx/supabase"
import { MatrxAiClient } from "@matrx/ai-client"
```

---

## Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start all apps |
| `pnpm dev:web` | Start web only |
| `pnpm dev:mobile` | Start mobile only |
| `pnpm build` | Build all apps |
| `pnpm check` | Lint + typecheck |
| `pnpm clean` | Remove all node_modules |
| `pnpm env:pull` | Pull env from Doppler |

---

## Mobile Native Standards (Critical)

- **Zero hardcoded colors** — all via `useTheme()` hook from `@/hooks`
  - Available: `colors.background.*`, `colors.text.*`, `colors.border.*`, `colors.surface.*`, `colors.accent.*`
- **Spacing:** `import { spacing } from '@/constants'` — no magic numbers
- **Animations:** Reanimated 4 only — never `Animated` from `react-native`
- **Platform files:** `Component.ios.tsx`, `Component.android.tsx`, `Component.web.tsx` for full differences; `Platform.select()` for minor differences
- **TypeScript strict** — no `any` types
- **Custom ESLint plugin** (`design-system/no-hardcoded-colors`) enforces color system

---

## Feature Flags

Environment-based feature flags via `NEXT_PUBLIC_FEATURE_*` variables:

`AUTH`, `ADMIN_PORTAL`, `BLOG`, `DYNAMIC_PAGES`, `FILE_STORAGE`, `STRIPE`, `AI_INTEGRATION`, `REALTIME`, `VERSION_TRACKING`, `ERROR_TRACKING`, `AUDIT_LOG`

Defaults in `packages/shared/src/constants/features.ts`

---

## Template Principles

- All patterns should be production-grade reference implementations
- Shared packages enforce consistency across apps
- Data flow: Mobile/Web → Next.js API Routes → Supabase + Matrx AI Backend + Stripe

---

## Available Commands

Run `/mobile-standards` for the full mobile native standards enforcement workflow.
