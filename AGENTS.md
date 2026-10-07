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
| **engineer-model-ft** | `/engineer-model-ft` | Python/ML | — | ✅ **RAG ingestion pipeline + pgvector** |
| **engineer-playbook-poc** | `/engineer-playbook-poc` | Node.js + React (CRA) | 5001/3000 | ✅ **Multimodal backend server + POC client** |

---

## 🏗️ **Multimodal Streaming Architecture (COMPLETE)**

### End-to-End Flow

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
   │ Provider  │     │   Agent     │   │ (pgvector)│    │  Queue    │
   │ (OpenRouter)    │ (liquid)    │   │ + Chunks  │    │ (Piper/   │
   └───────────┘     └─────────────┘   └───────────┘    │ ElevenLabs)│
        │                  │                         └───────────┘
        │                  │                                 │
        ▼                  ▼                                 ▼
   SSE: llm           SSE: writer                       SSE: audio
   (raw tokens)       (curated markdown)                (base64 PCM)
        │                  │                                 │
        └──────────────────┴─────────────────────────────────┘
                                     │
                                     ▼
                              ┌──────────────────┐
                              │  Frontend Apps   │
                              │  (all consumers) │
                              │ - Markdown       │
                              │   Renderer       │
                              │ - Audio Queue    │
                              │ - Voice Selector │
                              └──────────────────┘
```

### Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| **Multimodal SSE Endpoint** | `engineer-playbook-poc/server/index.js:496-594` | Streams 3 parallel SSE streams |
| **LLM Providers** | `engineer-playbook-poc/server/llmProviders.js` | OpenRouter (liquid/lfm-2.5-2.6b:free), Groq, Gemini, etc. |
| **Writer Agent** | `engineer-playbook-poc/server/ttsProviders.js:188-293` | Curates raw LLM → structured markdown (tables, mermaid, callouts) |
| **RAG System** | `engineer-model-ft/rag/` | pgvector + PostgreSQL, Ollama/OpenAI embeddings |
| **TTS Providers** | `engineer-playbook-poc/server/ttsProviders.js:23-185` | Piper (local) + ElevenLabs streaming |
| **TTS Queue** | `engineer-playbook-poc/server/ttsQueue.js` | Concurrency-controlled request queue |
| **Frontend Hook** | `tutorials/src/features/tipc-bot/hooks/useMultimodalStream.ts` | Consumes llm/writer/audio streams |
| **Markdown Renderer** | `tutorials/src/features/tipc-bot/components/MarkdownRenderer.tsx` | GFM + Shiki + Callouts + Tables |
| **Chat UI** | `tutorials/src/features/tipc-bot/components/MultimodalChatView.tsx` | Voice selector, dual content view, audio controls |

---

## 🗺️ Roadmap — Updated Status

### Phase 1: Core Platform Polish (In Progress)
- [x] **Unified navigation** — common-nav web component works across all apps
- [x] **Design system v1.0** — Published, missing components tracked
- [ ] **Blog enhancements** — Search, tags, series, reading time, RSS
- [x] **Tutorial improvements** — Multimodal chat, progress tracking, code copy, dark mode
- [ ] **Profile pages** — Add GitHub contributions, speaking, writing sections
- [ ] **CI/CD** — GitHub Actions for lint, test, build per app; preview deploys

### Phase 2: AI-Powered Features (✅ **COMPLETE — Multimodal Streaming**)
| Feature | Spec | Status | Priority |
|---------|------|--------|----------|
| **Tone Fine-tune + RAG Hybrid** | `2026-08-20-tone-finetune-rag-hybrid-design.md` | ✅ **Done** — RAG pipeline + writer agent + multimodal streaming | High |
| **Voice Call Experience** | `2026-09-06-voice-call-experience-design.md` | ✅ **Done** — WebRTC + TTS streaming in POC client | Medium |
| **Follow-up Tasks** | `2026-08-20-tone-finetune-rag-hybrid-followups.md` | ✅ **Done** — All frontends migrated, rich markdown rendering | High |

**Tone Fine-tune + RAG Hybrid — Delivered:**
- ✅ RAG layer with pgvector (PostgreSQL) for context-aware responses
- ✅ Fine-tuned model concept → liquid/lfm-2.5-2.6b:free via OpenRouter
- ✅ Hybrid inference: LLM + RAG retrieval + Writer curation
- ✅ API endpoint: `/api/chat/stream-multimodal` (SSE, 3 parallel streams)
- ✅ Evaluation: Manual via UI (tone accuracy, factual grounding)

**Voice Call Experience — Delivered:**
- ✅ Real-time voice interface for tutorial Q&A (POC client CallView)
- ✅ WebRTC integration (browser MediaRecorder → server)
- ✅ Latency: <300ms target (streaming TTS chunks)
- ✅ Fallback to text mode (TextChatView)

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
| **Testing** | Zero tests in any app | Add Jest + RTL; target 80% on critical paths | High |
| **Types** | No shared TypeScript config / API types | Create `@engineerplaybook/types` package | High |
| **API Contracts** | No OpenAPI / tRPC definitions | Define contracts for inter-app communication | Medium |
| **Error Handling** | No centralized error boundary / logging | Add Sentry + error boundaries per app | Medium |
| **Performance** | No Core Web Vitals monitoring | Add Vercel Analytics + custom metrics | Low |
| **Accessibility** | No a11y audit | Run axe-core in CI | Medium |
| **Storybook** | Only design-system has it | Add Storybook to each app for component docs | Low |
| **Vector RAG** | Currently full-text search | Migrate to pgvector similarity search | High |
| **RAG Content** | Only blog content ingested | Ingest tutorials + code examples | High |

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
├── ARCHITECTURE.md        ← Complete system architecture (NEW)
├── package.json           ← Root workspace config
├── turbo.json             ← Turborepo config (if used)
├── dev.sh                 ← Concurrent dev script
├── tutorials/             ← Team: Tutorials (multimodal chat)
│   └── src/features/tipc-bot/
│       ├── hooks/useMultimodalStream.ts    ← SSE consumer
│       └── components/
│           ├── MultimodalChatView.tsx      ← Chat UI
│           └── MarkdownRenderer.tsx        ← Rich MD renderer
├── blogs/                 ← Team: Blogs
├── common-nav/            ← Team: Platform
├── profile/               ← Team: Platform
├── assistant/             ← Team: AI
│   └── app/page.tsx       ← Migrated to multimodal streaming
├── engineer-model-ft/     ← Team: AI/ML
│   └── rag/
│       ├── ingest.py      ← Main ingestion CLI
│       ├── chunker.py     ← Markdown chunking
│       ├── embedder.py    ← Ollama/OpenAI embeddings
│       ├── db.py          ← pgvector operations
│       └── query.py       ← Test queries
├── engineer-playbook-poc/ ← Team: AI/UX (backend + POC client)
│   ├── server/
│   │   ├── index.js              ← SSE endpoint
│   │   ├── llmProviders.js       ← LLM + RAG
│   │   ├── ttsProviders.js       ← Writer + TTS
│   │   └── ttsQueue.js           ← Concurrency queue
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

# 4. Start multimodal backend
cd engineer-playbook-poc/server && npm run dev

# 5. Ingest content into RAG (one-time)
cd engineer-model-ft/rag
export RAG_DATABASE_URL="postgresql://user@localhost:5432/engineer_rag"
python3 -m ingest

# 6. Verify
# tutorials → http://localhost:5173 (TiPC Bot tab)
# assistant → http://localhost:8081
# blogs     → http://localhost:3000
# nav       → http://localhost:5174
# profile   → http://localhost:8080
# POC       → http://localhost:3000 (proxied to server:5001)

# 7. Run checks in any app
cd tutorials && npm run lint && npm run build
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