# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
pnpm dev        # start dev server (localhost:3000)
pnpm build      # production build
pnpm start      # run production build
pnpm lint       # run eslint
```

No test suite exists yet.

## Next.js 16 Breaking Changes

This project runs **Next.js 16.2.3**. Key breaking change from training data:

- **`middleware.ts` is deprecated and renamed to `proxy.ts`** (since v16.0.0). The exported function must be named `proxy`, not `middleware`. This project already uses `proxy.ts`.
- Before writing any Next.js-specific code, read the relevant guide in `node_modules/next/dist/docs/`.

## Architecture

**Stack**: Next.js 16 App Router · React 19 · TypeScript · TypeORM · PostgreSQL · shadcn/ui (Radix + Tailwind v4) · `@stream-io/node-sdk`

### Auth flow

Custom JWT auth — no third-party auth library.

1. `actions/auth.ts` (`"use server"`) — `registerAction`, `loginAction`, `logoutAction`. Signs a JWT, writes it to an httpOnly cookie named `token` (7-day expiry).
2. `lib/auth.ts` — bcrypt helpers + `signToken` / `verifyToken` (uses `JWT_SECRET` env var).
3. `lib/session.ts` — `getSession()`: reads cookie → verifies JWT → queries DB for user. Used in server components (e.g., `Navbar`).
4. `proxy.ts` — route guard. Redirects unauthenticated users away from `protectedRoutes` and authenticated users away from `authRoutes`.

> Auth is verified twice: in `proxy.ts` (JWT only, fast) and inside server actions/components via `getSession()` (DB lookup). Do not rely on proxy alone for authorization.

### Database

TypeORM with PostgreSQL. `lib/db.ts` exposes `getDataSource()` — lazy-initializes a singleton `DataSource`. Schema is auto-synced (`synchronize: true`) — **turn this off and use migrations before production**. Entities live in `entities/`.

### Route structure

| Path | Notes |
|---|---|
| `app/(auth)/login` · `app/(auth)/register` | Client components; use `useActionState` + server actions |
| `app/(protected)/rooms/[roomId]` | Room view page |
| `app/(protected)/rooms/[roomId]/join` | Join confirmation page |
| `app/layout.tsx` | Root layout; renders `<Navbar>` (server component, calls `getSession()`) |
| `proxy.ts` | Route guard (replaces `middleware.ts`) |

### Page + component pattern

Pages are **always server components** — no `"use client"` in `page.tsx`. Pass server actions as props to client components.

```tsx
// app/page.tsx — server component
export default function Page() {
  return <SomeClientComponent action={someServerAction} />;
}

// app/_components/SomeClientComponent.tsx — client component
"use client";
export function SomeClientComponent({ action }) {
  const [state, formAction, pending] = useActionState(action, undefined);
  ...
}
```

Page HTML structure: `<main>` lives once in `app/layout.tsx` — do not add `<main>` in `page.tsx`. Pages use `<div>` as the top-level wrapper. Every page must have an `<h1>`. Heading hierarchy must not skip levels.

### Component naming & location

| Location | Convention | Used for |
|---|---|---|
| `app/_components/` | PascalCase | Homepage-specific components |
| `app/(route)/_components/` | PascalCase | Route-specific components |
| `components/layout/` | kebab-case | App-wide layout (Navbar, etc.) |
| `components/ui/` | kebab-case | shadcn primitives — do not edit manually |

### Next.js 16 params

Dynamic route `params` is a `Promise` — always `await` it:

```tsx
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
}
```

### UI components

shadcn/ui primitives in `components/ui/`. Layout components in `components/layout/`. Add new shadcn components with `pnpm dlx shadcn add <component>`.

### GetStream

`actions/getstream.ts` initializes the `StreamClient` (requires `GETSTREAM_API_KEY` + `GETSTREAM_API_SECRET`). Stream feature not yet wired to any UI.

### API responses

`lib/api-response.ts` exports `successResponse<T>()` and `errorResponse()` — use these in Route Handlers.

### Path alias

`@/*` maps to the project root. Import as `@/lib/...`, `@/components/...`, etc.

## Required environment variables

```
GETSTREAM_API_KEY
GETSTREAM_API_SECRET
DATABASE_HOST
DATABASE_PORT
DATABASE_USER
DATABASE_PASSWORD
DATABASE_NAME
JWT_SECRET
JWT_EXPIRES_IN   # default "7d"
```
