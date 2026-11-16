# PackAgent Website Handoff

## Project links

- Live website: https://packagent-website-vm2o.vercel.app
- Source repository: https://github.com/germansparrow95-bit/packagent-website
- Windows release: https://github.com/germansparrow95-bit/packagent-website/releases/tag/v0.1.4
- Installer:
  https://github.com/germansparrow95-bit/packagent-website/releases/download/v0.1.4/PackAgent-Setup-0.1.4-win-x64.exe

## Stack

- Next.js 16, React 19 and TypeScript
- React Three Fiber / Three.js hero model
- Next.js Route Handlers for the backend
- Drizzle ORM with libSQL
- Local SQLite-compatible database in development
- Turso in production
- Vercel for hosting

## Local setup

```powershell
npm install
Copy-Item .env.example .env.local
npm run db:init
npm run dev
```

Open `http://localhost:3000`.

Required environment variables:

```dotenv
DATABASE_URL=libsql://...
DATABASE_AUTH_TOKEN=...
ADMIN_TOKEN=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Do not commit `.env.local`, database files or API tokens.

## Validation

```powershell
npm run typecheck
npm run build
npm run test:api
npm run qa
```

`npm run test:api` and `npm run qa` require the development server to be running.
The API smoke test also requires `ADMIN_TOKEN` in the current shell.

## Main structure

```text
app/                 Pages, metadata and API routes
components/          Interactive frontend components
db/                  Drizzle schema and libSQL client
drizzle/             Database migration
lib/                 Data access layer, validation, auth and rate limiting
public/              Static assets
scripts/             Database, screenshot and API verification scripts
BACKEND.md           API and database documentation
```

## Known boundaries

- The Windows installer is not Authenticode signed.
- AI features depend on DeepSeek and require a server-side API key.
- The current rate limiter is local to a server instance.
- The local `data/packagent.db` is development data and is not production data.
- Design and geometry output must be verified by a packaging factory and a
  physical sample before production use.
