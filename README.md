# GetStream Live Streaming Demo

A live streaming web app built with Next.js 16, React 19, and [GetStream](https://getstream.io). Users register, create or join stream rooms, and participate as host (with camera/mic controls) or audience.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org) | App Router, server components, server actions |
| [React 19](https://react.dev) | UI |
| [TypeScript](https://www.typescriptlang.org) | Type safety |
| [TypeORM](https://typeorm.io) | ORM — room/user data in PostgreSQL |
| [PostgreSQL](https://www.postgresql.org) | Database |
| [GetStream Video React SDK](https://getstream.io/video/sdk/react/) | Live video/audio streaming |
| [shadcn/ui](https://ui.shadcn.com) | UI components (Radix + Tailwind v4) |
| [pnpm](https://pnpm.io) | Package manager |

---

## Prerequisites

Install these before starting:

- **Node.js** v20+ — [nodejs.org](https://nodejs.org)
- **pnpm** — `npm install -g pnpm`
- **PostgreSQL** — [postgresql.org/download](https://www.postgresql.org/download/) (or use Docker: `docker run -e POSTGRES_PASSWORD=password -p 5432:5432 postgres`)

---

## GetStream API Keys

This project uses [GetStream](https://getstream.io) for live video streaming.

1. Sign up at **[getstream.io](https://getstream.io)**
2. Create a new app in the [GetStream Dashboard](https://dashboard.getstream.io)
3. Go to your app's **Overview** page
4. Copy your **API Key** and **API Secret**

You'll need both values for the environment variables below.

---

## Installation

### 1. Clone the repo

```bash
git clone https://github.com/mohammad-zrar/getstream-reactjs-demo.git
cd getstream-reactjs-demo
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Or create it manually:

```env
# GetStream — get these from https://dashboard.getstream.io
GETSTREAM_API_KEY=your_api_key_here
GETSTREAM_API_SECRET=your_api_secret_here

# PostgreSQL
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_db_password
DATABASE_NAME=getstream_demo

# JWT
JWT_SECRET=your_random_secret_string
JWT_EXPIRES_IN=7d
```

### 4. Create the database

```bash
psql -U postgres -c "CREATE DATABASE getstream_demo;"
```

The app uses `synchronize: true` — TypeORM auto-creates tables on first run. No migrations needed for development.

### 5. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Commands

```bash
pnpm dev      # start dev server (localhost:3000, hot reload)
pnpm build    # production build
pnpm start    # run production build
pnpm lint     # run ESLint
```

---

## How It Works

1. **Register / Login** — custom JWT auth, token stored in an httpOnly cookie
2. **Home page** — create a new room or join an existing one by room ID
3. **Host view** — camera and mic controls, live stream to audience
4. **Audience view** — watch the live stream, leave at any time

---

## Project Structure

```
app/
  (auth)/          # login + register pages
  (protected)/
    rooms/[roomId] # room page — host or audience view
  _components/     # homepage components
actions/           # server actions (auth, getstream)
components/        # layout + shadcn UI primitives
lib/               # auth helpers, db, session, api response utils
proxy.ts           # route guard (replaces middleware.ts in Next.js 16)
```

---

## Notes

- **Production**: disable `synchronize: true` in `lib/db.ts` and use TypeORM migrations
- **Next.js 16**: uses `proxy.ts` instead of `middleware.ts` — do not rename it
