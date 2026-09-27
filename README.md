# Engineer Playbook — Tutorials

React interactive tutorials for engineerplaybook.io. Built with Next.js 16 + React 19.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Design System:** `@engineerplaybook/design-system` (shared tokens + components)
- **Styling:** Tailwind CSS v4 via PostCSS
- **Navigation:** `@engineerplaybook/common-nav` shared nav web component

## Development

```bash
npm install
npm run dev     # http://localhost:5173
```

## Build

```bash
npm run build
npm run lint
```

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing page |
| `/topic/[slug]` | Tutorial content pages |
| `/state` | useState deep dive |
| `/effect` | useEffect deep dive |
| `/context` | useContext patterns |
| `/transition` | useTransition patterns |
| `/playground` | Interactive code playground |
| `/showcase` | Component showcase |
| `/topic/tipc-bot` | TiPC Voice & Chat Bot — full-stack AI tutor (see below) |

## TiPC Voice & Chat Bot

Port of `engineer-playbook-poc`: streaming AI chat + hands-free voice calls with
server-side guardrails, running on Next.js API routes (no separate backend).

Single shared login (no signup / no per-user accounts) — set `AUTH_EMAIL`,
`AUTH_PASSWORD`, and `JWT_SECRET` (see `.env.example`). Every route below except
`/api/login` and `/api/llm-status` requires an `Authorization: Bearer <token>`
header from a successful login.

| Endpoint | Description |
|----------|-------------|
| `POST /api/login` | Log in with `{ email, password }`, returns a JWT |
| `POST /api/chat` | Non-streaming chat reply |
| `POST /api/chat/stream` | SSE streaming chat (used by the UI) |
| `GET/DELETE /api/history/[username]` | Read or clear conversation history |
| `GET/PUT /api/system-prompt` | Read/update guardrails |
| `GET /api/llm-status` | Active LLM provider (no auth required) |

`username` here is just a free-text conversation label, not an account — history
and system prompt are stored in memory per Next.js instance (not durable across
cold starts; see `src/lib/datastore.ts`).

Works with zero keys via the free anonymous Pollinations tier. For a stronger
provider at zero cost, set `OPENROUTER_API_KEY` — the code hard-guards it to
`:free`-suffixed models only, so it can never silently incur billing. Set
`RAG_DATABASE_URL` (a Postgres/Neon connection string) to ground OpenRouter's
answers in the same doc corpus as `engineer-playbook-poc`, via full-text search.

## Deployment

Deploys independently to Vercel. Gateway routes `engineerplaybook.io/tutorials/*` here.

```bash
vercel deploy
```
