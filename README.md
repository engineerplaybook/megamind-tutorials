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

## Deployment

Deploys independently to Vercel. Gateway routes `engineerplaybook.io/tutorials/*` here.

```bash
vercel deploy
```
