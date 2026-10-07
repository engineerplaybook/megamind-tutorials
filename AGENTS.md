# Engineer Playbook — Megamind Monorepo Planning & Agent Coordination
# Location: /Users/anmolthukral/projects/megamind/AGENTS.md
# Single source of truth for all agents working in this repo.

---

## 🎯 Project Vision

**Megamind** = monorepo for **engineerplaybook.io** — a developer education platform teaching engineers to build and ship software faster using AI tools.

All apps are independently deployed microfrontends routed by a Vercel gateway.

---

## 📦 Current Architecture

| App | Path | Framework | Port | Status |
|-----|------|-----------|------|--------|
| **tutorials** | `/tutorials` | Next.js 16 + React 19 | 5173 | ✅ Live — interactive tutorials + **multimodal chat (RAG + TTS)** |
| **blogs** | `/blogs` | Next.js 16 + React 19 | 3000 | ✅ Live — MDX blog platform |
| **common-nav** | `/common-nav` | Next.js 16 + React 19 + Vite | 5174 | ✅ Live — shared nav + web component |
| **profile** | `/profile` | Next.js 16 + React 19 | 8080 | ✅ Live — team profiles |
| **assistant** | `/assistant` | Next.js 16 + React 19 | 8081 | ✅ Live — **AI assistant with multimodal streaming** |
| **design-system** | `/packages/design-system` | React + Vite + Storybook | — | ✅ Published v0.1.0 |
| **engineer-model-ft** | `/engineer-model-ft` | Python/ML | — | ✅ **RAG ingestion pipeline + pgvector (Neon)** |
| **engineer-playbook-poc** | `/engineer-playbook-poc` | Node.js + React (CRA) | 5001/3000 | ⚠️ **Backend needs Render deploy with new env** |

---

## 🏗️ **Multimodal Streaming Architecture (Backend Complete, Client TTS Pending)**

### End-to-End Flow (Target)

```
User Query (tutorials/assistant/POC client)
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│  POST /api/chat/stream-multimodal                           │
│  engineer-playbook-poc/server/index.js                      │
└─────────────────────────────────────────────────────────────┘
        │
        ├──────────────────┬──────────────────┬─────────────────┐
        ▼                  ▼                  ▼                 ▼
   ┌───────────┐     ┌─────────────┐   ┌───────────┐    ┌───────────┐
   │   LLM     │────▶│   Writer    │   │   RAG     │    │   TTS     │
   │ Provider  │     │   Agent     │   │ (pgvector)│    │ (Client)  │
   │ (OpenRouter)    │ (liquid)    │   │ + Chunks  │    │ Web Speech│
   └───────────┘     └─────────────┘   └───────────┘    └───────────┘
        │                  │                         ▲
        │                  │                         │
        ▼                  ▼                         │
   SSE: llm           SSE: writer                   │
   (raw tokens)       (curated markdown)            │
        │                  │                         │
        └──────────────────┴─────────────────────────┘
                                     │
                                     ▼
                              ┌──────────────────┐
                              │  Frontend Apps   │
                              │  (all consumers) │
                              │ - Markdown       │
                              │   Renderer       │
                              │ - Client TTS     │
                              │   (Web Speech)   │
                              │ - Voice Input    │
                              │   (SpeechRecog)  │
                              └──────────────────┘
```

### Current State (2026-10-07)

| Component | Status | Notes |
|-----------|--------|-------|
| **Multimodal SSE Endpoint** | ✅ Deployed | `/api/chat/stream-multimodal` streams `llm` + `writer` events |
| **LLM Providers** | ✅ Working | OpenRouter `liquid/lfm-2.5-2.6b:free` primary |
| **Writer Agent** | ✅ Working | Structured markdown (tables, mermaid, callouts, code) |
| **RAG System** | ✅ **Neon pgvector** | 26K chunks ingested (blogs, tutorials, MDN, React, TS, Next.js) |
| **Server TTS (Piper)** | ❌ Broken | Binary not on Render; queue bug drops chunks |
| **Server TTS (ElevenLabs)** | ⚠️ No API key | Not configured |
| **Client TTS (Web Speech)** | 🔄 **Next task** | Use `SpeechSynthesisUtterance` for streaming playback |
| **Client Voice Input** | ✅ Working | `useSpeechRecognition` hook in TextChatView |
| **Markdown Renderer** | ✅ Complete | GFM + Shiki + Callouts (💡⚠️📝🔑) + Tables |
| **Chat UI (MultimodalChatView)** | ✅ Default view | Voice selector, curated/raw toggle, audio status bar |

### Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| **Multimodal SSE Endpoint** | `engineer-playbook-poc/server/index.js:496-594` | Streams `llm` + `writer` SSE (audio removed) |
| **LLM Providers** | `engineer-playbook-poc/server/llmProviders.js` | OpenRouter + RAG (Neon full-text) |
| **Writer Agent** | `engineer-playbook-poc/server/ttsProviders.js:188-293` | Curates raw LLM → structured markdown |
| **RAG Pipeline** | `engineer-model-ft/rag/` | pgvector schema, Ollama embeddings, Neon DB |
| **Frontend Hook** | `tutorials/src/features/tipc-bot/hooks/useMultimodalStream.ts` | Consumes `llm`/`writer` SSE, **needs client TTS** |
| **Markdown Renderer** | `tutorials/src/features/tipc-bot/components/MarkdownRenderer.tsx` | GFM + Shiki + Callouts + Tables |
| **Chat UI** | `tutorials/src/features/tipc-bot/components/MultimodalChatView.tsx` | Voice selector, curated/raw toggle, status bar |

---

## 🗺️ Roadmap — Updated Status

### Phase 1: Core Platform Polish (In Progress)
- [x] **Unified navigation** — common-nav web component works across all apps
- [x] **Design system v1.0** — Published, missing components tracked
- [ ] **Blog enhancements** — Search, tags, series, reading time, RSS
- [x] **Tutorial improvements** — Multimodal chat, progress tracking, code copy, dark mode
- [ ] **Profile pages** — Add GitHub contributions, speaking, writing sections
- [ ] **CI/CD** — GitHub Actions for lint, test, build per app; preview deploys

### Phase 2: AI-Powered Features
| Feature | Spec | Status | Priority |
|---------|------|--------|----------|
| **Tone Fine-tune + RAG Hybrid** | `2026-08-20-tone-finetune-rag-hybrid-design.md` | ✅ **Done** — RAG pipeline + writer agent + multimodal streaming | High |
| **Voice Call Experience** | `2026-09-06-voice-call-experience-design.md` | 🔄 **In Progress** — Client-side TTS + streaming UX | High |
| **Follow-up Tasks** | `2026-08-20-tone-finetune-rag-hybrid-followups.md` | ✅ **Done** — All frontends migrated, rich markdown rendering | High |

**Voice Call Experience — In Progress:**
- [x] Backend: `/api/chat/stream-multimodal` (llm + writer streams)
- [x] RAG: Neon pgvector populated with 26K chunks
- [x] Frontend: `MultimodalChatView` default, curated markdown rendering
- [ ] **Client TTS**: Stream `writer` deltas → `SpeechSynthesisUtterance` queue (teaching voice)
- [ ] **Voice Call UX**: Single "Call" button → mic on, audio plays as content renders, flowchart/code on screen
- [ ] **Teaching Pattern**: Explain → show diagram → explain → show code → explain

### Phase 3: Platform Scale
- [ ] **Multi-author support** — Blogs/tutorials by contributors
- [ ] **Course builder** — Visual editor for tutorial creation
- [ ] **Analytics dashboard** — Engagement, completion, search queries
- [ ] **Auth** — GitHub OAuth, team/org management
- [ ] **Payments** — Subscriptions, one-time purchases

---

## 🔧 Technical Debt & Gaps (Updated)

| Area | Gap | Fix | Priority |
|------|-----|-----|----------|
| **Client TTS** | Server TTS broken; no streaming audio | Implement client-side Web Speech queue in `useMultimodalStream.ts` | **Critical** |
| **Voice Call UX** | Current UI is chat, not "call" | Redesign `MultimodalChatView` → `VoiceCallView`: full-screen, mic always on, content renders as teacher speaks | **Critical** |
| **Testing** | Zero tests in any app | Add Jest + RTL; target 80% on critical paths | High |
| **Types** | No shared TypeScript config / API types | Create `@engineerplaybook/types` package | High |
| **API Contracts** | No OpenAPI / tRPC definitions | Define contracts for inter-app communication | Medium |
| **Error Handling** | No centralized error boundary / logging | Add Sentry + error boundaries per app | Medium |
| **Performance** | No Core Web Vitals monitoring | Add Vercel Analytics + custom metrics | Low |
| **Accessibility** | No a11y audit | Run axe-core in CI | Medium |
| **Storybook** | Only design-system has it | Add Storybook to each app for component docs | Low |
| **Vector RAG** | Using full-text search (Neon) | Add `pgvector` extension to Neon, use cosine similarity | Medium |
| **RAG Content** | Only blog content ingested | Ingest tutorials + code examples (already done 15 chunks) | Done |

---

## 🤖 Agent Coordination Rules

1. **Read this file first** — Every agent session starts here
2. **Update status** — Check off items as you complete them
3. **One agent per feature** — Avoid conflicts; claim work in a comment
4. **Small PRs** — Each logical change = one PR with tests
5. **Lint + test before commit** — `npm run lint && npm test` in affected app
6. **Ponytail mode** — Default to simplest working solution (see CLAUDE.md)

---

## 📁 File Ownership Map (Updated)

```
megamind/
├── AGENTS.md              ← THIS FILE (coordination)
├── CLAUDE.md              ← Global conventions
├── ARCHITECTURE.md        ← Complete system architecture
├── package.json           ← Root workspace config
├── turbo.json             ← Turborepo config (if used)
├── dev.sh                 ← Concurrent dev script
├── tutorials/             ← Team: Tutorials (multimodal chat)
│   └── src/features/tipc-bot/
│       ├── hooks/useMultimodalStream.ts    ← SSE consumer + client TTS queue (TODO)
│       └── components/
│           ├── MultimodalChatView.tsx      ← Chat UI → needs VoiceCallView
│           └── MarkdownRenderer.tsx        ← Rich MD renderer ✅
├── blogs/                 ← Team: Blogs
├── common-nav/            ← Team: Platform
├── profile/               ← Team: Platform
├── assistant/             ← Team: AI
│   └── app/page.tsx       ← Migrated to multimodal streaming
├── engineer-model-ft/     ← Team: AI/ML
│   └── rag/
│       ├── ingest.py      ← Main ingestion CLI ✅
│       ├── chunker.py     ← Markdown chunking ✅
│       ├── embedder.py    ← Ollama/OpenAI embeddings ✅
│       ├── db.py          ← pgvector operations ✅
│       └── query.py       ← Test queries ✅
├── engineer-playbook-poc/ ← Team: AI/UX (backend + POC client)
│   ├── server/
│   │   ├── index.js              ← SSE endpoint (llm + writer only) ✅
│   │   ├── llmProviders.js       ← LLM + RAG ✅
│   │   ├── ttsProviders.js       ← Writer agent only (TTS removed) 🔄
│   │   └── ttsQueue.js           ← DEPRECATED (remove)
│   └── client/
│       └── src/hooks/useChatStream.js  ← Migrated hook
└── packages/
    └── design-system/     ← Team: Design System
```

---

## 🚀 Quick Start for New Agents

```bash
# 1. Clone & install
git clone <repo> && cd megamind && npm install

# 2. Install Python deps for RAG
cd engineer-model-ft/rag && pip install -r requirements.txt

# 3. Start all apps (frontend)
npm run dev

# 4. Start multimodal backend (local dev)
cd engineer-playbook-poc/server && npm run dev

# 5. RAG already ingested to Neon (no local DB needed)
#    For fresh ingest:
# cd engineer-model-ft/rag
# export RAG_DATABASE_URL="postgresql://neondb_owner:npg_ZSR0V5muNDbP@ep-fancy-shape-b34wucma.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
# python3 -m ingest

# 6. Verify
# tutorials → http://localhost:5173 (TiPC Bot tab → Multimodal)
# assistant → http://localhost:8081
# blogs     → http://localhost:3000
# nav       → http://localhost:5174
# profile   → http://localhost:8080
# POC       → http://localhost:3000 (proxied to server:5001)

# 7. Run checks in any app
cd tutorials && npm run lint && npm run build
```

---

## 🔐 Production Credentials (Render Dashboard)

**Backend (`engineer-playbook-poc` on Render):**
```
AUTH_EMAIL=test@email.com
AUTH_PASSWORD=Tester@123
JWT_SECRET=42a6099dd784910413751a7566603e12d4b15ca9cd6256fea47544110283e950
OPENROUTER_API_KEY=sk-or-... (set in Render dashboard)
RAG_DATABASE_URL=postgresql://neondb_owner:npg_ZSR0V5muNDbP@ep-fancy-shape-b34wucma.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
ENABLE_PIPER_TTS=false
```

**Frontend (tutorials on Vercel):**
```
NEXT_PUBLIC_API_URL=https://engineer-playbook-poc.onrender.com
```

---

## 📝 Change Log

| Date | Agent | Change |
|------|-------|--------|
| 2026-09-28 | opencode | Created AGENTS.md, consolidated specs |
| 2026-10-07 | opencode | **Complete multimodal streaming implementation** |
| | | - RAG ingestion pipeline (pgvector + embeddings) |
| | | - Writer agent with structured markdown output |
| | | - Rich markdown renderer (GFM, Shiki, Callouts, Tables) |
| | | - All frontends migrated to `/api/chat/stream-multimodal` |
| | | - TTS queue with Piper + ElevenLabs providers |
| | | - Architecture documentation created |
| 2026-10-07 | opencode | **Checkpoint: Neon RAG + Client TTS Pivot** |
| | | - RAG: 26K chunks ingested to Neon pgvector |
| | | - Backend env updated (test@email.com, Neon URL, OpenRouter key) |
| | | - Server TTS deprecated (Piper not on Render, queue bug) |
| | | - Frontend default → MultimodalChatView |
| | | - **Next**: Client-side Web Speech TTS for "voice call" teaching UX |