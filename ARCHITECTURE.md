# Megamind — Complete System Architecture

## Overview

**Megamind** = monorepo for **engineerplaybook.io** — a developer education platform teaching engineers to build and ship software faster using AI tools.

All apps are independently deployed microfrontends routed by a Vercel gateway.

---

## Repository Structure (7 Independent Git Repos)

| App | Repo | Framework | Port | Purpose |
|-----|------|-----------|------|---------|
| **tutorials** | `megamind-tutorials` | Next.js 16 + React 19 | 5173 | Interactive tutorials + multimodal chat |
| **blogs** | `megamind-blogs` | Next.js 16 + React 19 | 3000 | MDX blog platform |
| **common-nav** | `megamind-nav` | Next.js 16 + React 19 + Vite | 5174 | Shared nav web component |
| **profile** | `megamind-profile` | Next.js 16 + React 19 | 8080 | Team profiles |
| **assistant** | `megamind-assistant` | Next.js 16 + React 19 | 8081 | AI assistant with multimodal streaming |
| **engineer-model-ft** | `engineer-model-ft` | Python/ML | — | RAG ingestion pipeline + pgvector (Neon) |
| **engineer-playbook-poc** | `engineer-playbook-poc` | Node.js + React (CRA) | 5001/3000 | Multimodal backend + POC client |

---

## Multimodal Streaming Architecture (Client-Side TTS)

### End-to-End Flow (Current)

```
User Query (tutorials/assistant/POC client)
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│  POST /api/chat/stream-multimodal                           │
│  engineer-playbook-poc/server/index.js                      │
└─────────────────────────────────────────────────────────────┘
        │
        ├──────────────────┬──────────────────┐
        ▼                  ▼                  ▼
   ┌───────────┐     ┌─────────────┐   ┌───────────┐
   │   LLM     │────▶│   Writer    │   │   RAG     │
   │ Provider  │     │   Agent     │   │ (pgvector)│
   │ (OpenRouter)    │ (liquid)    │   │ + Chunks  │
   └───────────┘     └─────────────┘   └───────────┘
        │                  │
        ▼                  ▼
   SSE: llm           SSE: writer
   (raw tokens)       (curated markdown)
        │                  │
        └──────────────────┴─────────────────────────┐
                                                     ▼
                                              ┌──────────────────┐
                                              │  Client Browser  │
                                              │  - Markdown      │
                                              │    Renderer      │
                                              │  - SpeechSynth   │
                                              │    (TTS Queue)   │
                                              │  - SpeechRecog   │
                                              │    (Voice Input) │
                                              └──────────────────┘
```

### API Contract: `/api/chat/stream-multimodal`

**Request:**
```json
POST /api/chat/stream-multimodal
Content-Type: application/json
Authorization: Bearer <jwt>

{
  "username": "user-name",
  "message": "How do React hooks work?",
  "systemPrompt": "optional custom system prompt"
}
```

**Response:** Server-Sent Events (SSE) with **two** event types:

| Event | Type | Payload | Description |
|-------|------|---------|-------------|
| `llm` | string | `{ delta: "token", provider: "openrouter:..." }` | Raw LLM token stream |
| `writer` | string | `{ delta: "markdown chunk" }` | Curated markdown from Writer Agent |

> **Note**: `audio` event removed — TTS now happens client-side via Web Speech API.

---

## Key Components

### Backend (`engineer-playbook-poc/server/`)

| File | Purpose |
|------|---------|
| `index.js:496-594` | SSE endpoint `/api/chat/stream-multimodal` (llm + writer only) |
| `llmProviders.js` | LLM providers (OpenRouter, Groq, Gemini, Runpod, Ollama) + RAG |
| `ttsProviders.js:188-293` | **Writer Agent only**: curates raw LLM → structured markdown |
| `ttsQueue.js` | **DEPRECATED** — remove (was for server TTS) |

### RAG Pipeline (`engineer-model-ft/rag/`)

| File | Purpose |
|------|---------|
| `ingest.py` | Main CLI: scans markdown, chunks, embeds, stores |
| `chunker.py` | Markdown chunking with heading hierarchy preservation |
| `embedder.py` | Ollama (nomic-embed-text) + OpenAI embeddings |
| `db.py` | pgvector operations: init, insert, search (cosine similarity), stats |
| `query.py` | Test query script |

**Database Schema (pgvector on Neon):**
```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE chunks (
    id BIGSERIAL PRIMARY KEY,
    source TEXT NOT NULL,           -- 'blogs', 'tutorials', etc.
    file_path TEXT NOT NULL,        -- relative path
    heading_trail TEXT NOT NULL,    -- '## Section > ### Subsection'
    content TEXT NOT NULL,          -- chunk text
    embedding VECTOR(768) NOT NULL, -- nomic-embed-text dim
    token_count INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (source, file_path, heading_trail)
);

CREATE INDEX chunks_embedding_hnsw ON chunks USING hnsw (embedding vector_cosine_ops);
```

**Current Data (Neon):**
- 26,274 total chunks (~238 MB)
- Sources: `content` (15), `mdn` (22,004), `nextjs` (1,470), `react.dev` (1,883), `ts-handbook` (902)

### Frontend Shared

| Component | Location | Purpose |
|-----------|----------|---------|
| `useMultimodalStream` hook | `tutorials/src/features/tipc-bot/hooks/useMultimodalStream.ts` | Consumes `llm`/`writer` SSE, **manages client TTS queue** |
| `MarkdownRenderer` | `tutorials/src/features/tipc-bot/components/MarkdownRenderer.tsx` | GFM + Shiki + Callouts + Tables |
| `MultimodalChatView` | `tutorials/src/features/tipc-bot/components/MultimodalChatView.tsx` | Chat UI with voice selector (→ `VoiceCallView` pending) |
| `useSpeechRecognition` | `tutorials/src/features/tipc-bot/hooks/useSpeechRecognition.ts` | Voice input (works in TextChatView) |

---

## Data Flow Details

### 1. RAG Ingestion (One-time / CI)
```bash
# Source content: tutorials/app, tutorials/src, blogs/content
# Embeddings: Ollama nomic-embed-text (768-dim)
# Target: Neon PostgreSQL + pgvector
cd engineer-model-ft/rag
export RAG_DATABASE_URL="postgresql://neondb_owner:npg_ZSR0V5muNDbP@ep-fancy-shape-b34wucma.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
python3 -m ingest
```

### 2. Query Time (Per Request)
```
User Question
      │
      ▼
┌──────────────────────────────────────┐
│ 1. Full-text search (Neon)           │
│    to_tsvector @@ plainto_tsquery    │
└──────────────────────────────────────┘
      │
      ▼
┌──────────────────────────────────────┐
│ 2. Build augmented prompt with       │
│    retrieved chunks as context       │
└──────────────────────────────────────┘
      │
      ▼
┌──────────────────────────────────────┐
│ 3. Stream LLM (OpenRouter liquid)    │
│    → Writer Agent (same model,       │
│      different prompt)               │
└──────────────────────────────────────┘
      │
      ▼
┌──────────────────────────────────────┐
│ 4. Client receives SSE:              │
│    - llm: raw tokens (debug view)    │
│    - writer: curated markdown chunks │
└──────────────────────────────────────┘
      │
      ▼
┌──────────────────────────────────────┐
│ 5. Client TTS (Web Speech API):      │
│    - Queue writer deltas as          │
│      SpeechSynthesisUtterance        │
│    - Play sequentially (teaching     │
│      voice: paced, clear)            │
└──────────────────────────────────────┘
```

### 3. Writer Agent Prompt (Structured Output)
Instructs model to produce:
- Headings: `##`, `###`
- Tables: GitHub-flavored `| header |` syntax
- Mermaid: ````mermaid flowchart TD ... ````
- Code: ```language blocks
- Callouts: `> **💡 Note**`, `> **⚠️ Warning**`, `> **📝 Example**`, `> **🔑 Key Term**`

---

## Frontend Rendering Stack

| Feature | Library |
|---------|---------|
| Markdown parsing | `@uiw/react-markdown` |
| GFM (tables, strikethrough) | `remark-gfm` |
| Syntax highlighting | `shiki` (TypeScript, Python, Rust, Go, JSON, etc.) |
| Callouts | Custom components (Note, Warning, Example, Key) |
| Tables | Responsive horizontal scroll |
| **TTS (NEW)** | **Web Speech API** (`SpeechSynthesisUtterance`) |
| Voice Input | Web Speech API (`SpeechRecognition`) |

---

## Deployment

### Vercel (5 Frontend Apps)
Each app deployed independently:
- Build Command: `npm run build:vercel` (installs with `--legacy-peer-deps`)
- Install Command: `npm install --legacy-peer-deps`
- No root workspace — each app self-contained

### Backend (POC Server on Render)
- Environment variables (see AGENTS.md for values)
- Runs on port 5001
- **No Piper binary needed** — TTS moved to client

### Database (Neon)
- PostgreSQL + pgvector (extension enabled)
- Connection: `RAG_DATABASE_URL` in `.env`
- **Full-text search** currently (pgvector cosine similarity pending `pgvector` extension)

---

## Environment Variables

### Frontend Apps (Vercel)
```bash
NEXT_PUBLIC_API_URL=https://engineer-playbook-poc.onrender.com
```

### Backend (`engineer-playbook-poc/server/.env` on Render)
```bash
PORT=5001
AUTH_EMAIL=test@email.com
AUTH_PASSWORD=Tester@123
JWT_SECRET=42a6099dd784910413751a7566603e12d4b15ca9cd6256fea47544110283e950
OPENROUTER_API_KEY=sk-or-... (set in Render dashboard)
RAG_DATABASE_URL=postgresql://neondb_owner:npg_ZSR0V5muNDbP@ep-fancy-shape-b34wucma.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
ENABLE_PIPER_TTS=false
```

### RAG Ingestion (`engineer-model-ft/rag/.env`)
```bash
RAG_DATABASE_URL=postgresql://neondb_owner:npg_ZSR0V5muNDbP@ep-fancy-shape-b34wucma.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

---

## Security

- All secrets in `.env` (gitignored)
- JWT auth on backend endpoints
- Guardrails on user input (blocked patterns)
- OpenRouter free-model guardrail (rejects non-`:free` models)

---

## Local Development

```bash
# 1. Start all frontends
cd megamind && npm run dev

# 2. Start backend (local)
cd engineer-playbook-poc/server && npm run dev

# 3. (Optional) Start Ollama for local LLM + embeddings
ollama serve
ollama pull nomic-embed-text

# 4. RAG already ingested to Neon (no local DB needed)
#    For fresh ingest:
# cd engineer-model-ft/rag
# export RAG_DATABASE_URL="postgresql://neondb_owner:...@ep-fancy-shape-...neon.tech/neondb?sslmode=require&channel_binding=require"
# python3 -m ingest

# 5. Test
# tutorials → http://localhost:5173 (TiPC Bot tab → Multimodal)
# assistant → http://localhost:8081
# blogs     → http://localhost:3000
# nav       → http://localhost:5174
# profile   → http://localhost:8080
# POC       → http://localhost:3000
```

---

## Next Implementation: Voice Call Teaching UX

### Target Experience
1. **Single "Start Call" button** → mic activates, teacher begins speaking
2. **Content renders as teacher explains** — flowchart appears, then code, then explanation
3. **Web Speech API queue** — `writer` deltas → `SpeechSynthesisUtterance` → sequential playback
4. **Paced teaching voice** — rate ~0.9, pauses at headings/code blocks
5. **Visual sync** — scroll to element as it's being read

### Files to Modify
- `tutorials/src/features/tipc-bot/hooks/useMultimodalStream.ts` — add `speakWriterDelta(delta)` queue
- `tutorials/src/features/tipc-bot/components/MultimodalChatView.tsx` — add `VoiceCallView` mode
- `tutorials/src/features/tipc-bot/components/VoiceCallView.tsx` — new component (full-screen, mic always on)

---

## Related Documents

- `AGENTS.md` — Agent coordination, roadmap, file ownership
- `CLAUDE.md` — Global coding conventions