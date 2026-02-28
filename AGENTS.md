# AGENTS.md

## Cursor Cloud specific instructions

### Overview

ShareWallet is a Next.js 15 monolith (App Router + Turbopack) with Prisma 7 + SQLite. No external services or Docker required — everything runs in a single Node.js process.

### Prerequisites

- **Node.js 20 LTS** is required (`nvm use 20`). The project uses `better-sqlite3` native bindings which must match the Node version.
- Package manager: **npm** (lockfile: `package-lock.json`).

### Running the app

See `README.md` for full setup. Key commands:

```bash
npm run dev      # Dev server on :3000 (Turbopack)
npm run lint     # ESLint
npm run build    # Production build
```

### Database

- SQLite file at `prisma/dev.db`. No separate DB process needed.
- `.env` must contain `DATABASE_URL="file:./dev.db"` and `JWT_SECRET="dev-secret-change-in-production"`.
- After `npm install`, run `npx prisma db push && npx prisma generate` to create/sync the DB and generate the Prisma client.
- `npx prisma db seed` loads test users (all use password `password123`; e.g. `tanaka@example.com`).

### Gotchas

- If you get `NODE_MODULE_VERSION` errors from `better-sqlite3`, run `npm rebuild better-sqlite3 && npx prisma generate`.
- Prisma client is generated into `src/generated/prisma/` — this directory is gitignored and must be regenerated after `npm install`.
- Auth uses Bearer JWT tokens in the `Authorization` header (not cookies).
- The app UI is entirely in Japanese.
