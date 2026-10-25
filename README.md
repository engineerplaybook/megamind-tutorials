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
| `/` | Course catalog |
| `/topic/claude-code` | Introduction to Claude Code course |
| `/topic/react` | React, From First Principles course |

Every course is a full-screen three-pane player: collapsible course contents on
the left, lesson content and interactive labs in the middle, and a Live Tutor on
the right.

## Live Tutor

The tutor panel streams answers from `/api/chat/stream` on the
`engineer-playbook-poc` backend and speaks them with the browser's Web Speech API.
It is course-aware: the current module is included in the system prompt.

- **Chat:** markdown answers streamed token by token.
- **Call:** hands-free voice loop (speech recognition → stream → speech synthesis).
- **Auth:** the backend uses one shared login. Set `NEXT_PUBLIC_TUTOR_EMAIL` and
  `NEXT_PUBLIC_TUTOR_PASSWORD` for silent sign-in, or use the inline form.
  These are public client env vars, so only use the shared demo account.
- **History:** each browser gets its own conversation id per course. The reset
  button clears both the local chat and the backend history for that id.

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

## Deployment

Deploys independently to Vercel. Gateway routes `engineerplaybook.io/tutorials/*` here.

```bash
vercel deploy
```
