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

Frontend-only in this app (`src/features/tipc-bot/`) — streaming AI chat +
hands-free voice calls with server-side guardrails. It talks directly to the
`engineer-playbook-poc` Express backend deployed on Render
(`NEXT_PUBLIC_API_URL`, defaults to `https://engineer-playbook-poc.onrender.com`;
see `.env.example`), the same backend `engineer-playbook-poc/client` uses.
There's no local API route or datastore here — login, chat, RAG, and the
OpenRouter free-model fallback chain all live in that backend's repo.

`username` in the UI is just a free-text conversation label, not an account —
the backend has a single shared login (email/password), not per-user accounts.

## Deployment

Deploys independently to Vercel. Gateway routes `engineerplaybook.io/tutorials/*` here.

```bash
vercel deploy
```
