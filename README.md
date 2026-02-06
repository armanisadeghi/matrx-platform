# Matrx Platform Template

> **Monorepo template for generating custom AI-integrated web and mobile applications.**

**Stack:** Next.js 16.1 · Expo SDK 54 · Supabase · Stripe · TypeScript Strict · Turborepo

---

## Architecture

```
├── apps/
│   ├── web/              Next.js 16.1 — API routes, web portal, admin dashboard
│   └── mobile/           Expo 54 — iOS 26 + Android 16 native app
│
├── packages/
│   ├── shared/           Types, Zod schemas, constants, utilities
│   ├── supabase/         Database types, client factory, shared queries
│   ├── ai-client/        Matrx AI integration SDK (prompts, agents, workflows)
│   ├── typescript-config/ Shared tsconfig presets
│   └── eslint-config/    Shared ESLint configurations
│
├── turbo.json            Turborepo task orchestration
└── pnpm-workspace.yaml   pnpm workspace definition
```

### Data Flow

```
Mobile/Web  →  Next.js API Routes  →  Supabase (DB, Auth, Storage)
                      ↓
              Matrx AI Backend (Prompts, Agents, Workflows)
                      ↓
              Stripe (Payments, Subscriptions)
```

All business logic lives in Next.js API routes — the single source of truth.
Clients (web and mobile) consume endpoints only.

---

## Quick Start

```bash
# Install dependencies
pnpm install

# Run the web app
pnpm dev:web

# Run the mobile app
pnpm dev:mobile

# Run everything
pnpm dev

# Build all
pnpm build

# Lint + typecheck all
pnpm check
```

---

## Apps

### `apps/web` — Next.js 16.1

- **React 19.2** with React Compiler (automatic memoization)
- **Tailwind CSS 4.1** with CSS-first `@theme` configuration
- **Dynamic by default** — opt into caching with `'use cache'` directive
- **Turbopack** as default bundler (no flags needed)
- **`proxy.ts`** for route guards (replaces deprecated `middleware.ts`)
- Supabase Auth with SSR cookie handling via `@supabase/ssr`
- Stripe integration for payments and subscriptions

### `apps/mobile` — Expo SDK 54

- **React Native 0.81** with New Architecture (Fabric, TurboModules, Hermes)
- **iOS 26** — Liquid Glass design system
- **Android 16** — Material 3 Expressive design system
- **NativeWind 4.2** for Tailwind-style styling
- **Reanimated 4** for 60fps animations
- **MMKV** for high-performance local storage

---

## Packages

### `@matrx/shared`

Types, Zod validation schemas, and utilities shared between web and mobile.

```typescript
import { loginSchema, API_ROUTES, formatRelativeTime } from "@matrx/shared";
import type { User, ApiResponse, Workspace } from "@matrx/shared";
```

### `@matrx/supabase`

Typed Supabase client factory and shared query functions.

```typescript
import { createSupabaseClient, getProfile, getWorkspaces } from "@matrx/supabase";
import type { Database, Tables } from "@matrx/supabase";
```

### `@matrx/ai-client`

Client SDK for the Matrx AI integration platform.

```typescript
import { MatrxAiClient } from "@matrx/ai-client";
import type { Workflow, Agent, PromptTemplate } from "@matrx/ai-client";
```

---

## Core Principles

1. **Server-first data flow** — Server Components by default, Client Components only for interactivity
2. **API routes are the single source of truth** — All business logic lives there
3. **End-to-end type safety** — Database types flow from Supabase → shared package → API → client
4. **Dynamic by default, cache explicitly** — Opt into caching with `'use cache'`
5. **Native-first mobile** — iOS Liquid Glass + Android Material 3, not cross-platform compromises
6. **No hardcoded colors** — Everything flows from the design system
7. **TypeScript strict mode** — No `any` types anywhere

---

## Environment Setup

Copy the example env files:

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/mobile/.env.example apps/mobile/.env
```

---

## Tech Stack

| Layer | Web | Mobile |
|-------|-----|--------|
| Framework | Next.js 16.1 | Expo SDK 54 |
| React | 19.2 | 19.1 |
| Styling | Tailwind CSS 4.1 | NativeWind 4.2 (TW 3.4) |
| Language | TypeScript 5.9 | TypeScript 5.9 |
| Database | Supabase (PostgreSQL) | via API routes |
| Auth | Supabase Auth + SSR | Supabase Auth + MMKV |
| Payments | Stripe | Stripe React Native |
| Real-time | Supabase Realtime | Supabase Realtime |
| Bundler | Turbopack | Metro |
| Package Manager | pnpm 10.28 | pnpm 10.28 |
| Orchestration | Turborepo | Turborepo |
