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
| **engineer-model-ft** | `engineer-model-ft` | Python/ML | — | RAG ingestion pipeline + pgvector |
| **engineer-playbook-poc** | `engineer-playbook-poc` | Node.js + React (CRA) | 5001/3000 | Multimodal backend + POC client |

---

## Multimodal Streaming Architecture

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

### API Contract: `/api/chat/stream-multimodal`

**Request:**
```json
POST /api/chat/stream-multimodal
Content-Type: application/json
Authorization: Bearer <jwt>

{
  "username": "user-name",
  "message": "How do React hooks work?",
  "voiceProvider": "elevenlabs",  // "elevenlabs" | "openai" | "local"
  "systemPrompt": "optional custom system prompt"
}
```

**Response:** Server-Sent Events (SSE) with three event types:

| Event | Type | Payload | Description |
|-------|------|---------|-------------|
| `llm` | string | `{ delta: "token", provider: "openrouter:..." }` | Raw LLM token stream |
| `writer` | string | `{ delta: "markdown chunk" }` | Curated markdown from Writer Agent |
| `audio` | string | `{ chunk: "base64pcm", format: "pcm16", provider: "elevenlabs" }` | TTS audio chunk |

---

## Key Components

### Backend (`engineer-playbook-poc/server/`)

| File | Purpose |
|------|---------|
| `index.js:496-594` | SSE endpoint `/api/chat/stream-multimodal` |
| `llmProviders.js` | LLM providers (OpenRouter, Groq, Gemini, Runpod, Ollama) + RAG |
| `ttsProviders.js:23-185` | TTS providers: Piper (local) + ElevenLabs streaming |
| `ttsProviders.js:188-293` | Writer Agent: curates raw LLM → structured markdown |
| `ttsQueue.js` | Concurrency-controlled TTS request queue |

### RAG Pipeline (`engineer-model-ft/rag/`)

| File | Purpose |
|------|---------|
| `ingest.py` | Main CLI: scans markdown, chunks, embeds, stores |
| `chunker.py` | Markdown chunking with heading hierarchy preservation |
| `embedder.py` | Ollama (nomic-embed-text) + OpenAI embeddings |
| `db.py` | pgvector operations: init, insert, search (cosine similarity), stats |
| `query.py` | Test query script |

**Database Schema (pgvector):**
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

### Frontend Shared

| Component | Location | Purpose |
|-----------|----------|---------|
| `useMultimodalStream` hook | `tutorials/src/features/tipc-bot/hooks/useMultimodalStream.ts` | Consumes 3 SSE streams, manages audio queue |
| `MarkdownRenderer` | `tutorials/src/features/tipc-bot/components/MarkdownRenderer.tsx` | GFM + Shiki + Callouts + Tables |
| `MultimodalChatView` | `tutorials/src/features/tipc-bot/components/MultimodalChatView.tsx` | Chat UI with voice selector |

---

## Data Flow Details

### 1. RAG Ingestion (One-time / CI)
```bash
# Source content: tutorials/app, tutorials/src, blogs/content
# Embeddings: Ollama nomic-embed-text (768-dim) or OpenAI text-embedding-3-small
# Target: Supabase/Neon PostgreSQL + pgvector
cd engineer-model-ft/rag
export RAG_DATABASE_URL="postgresql://..."
python3 -m ingest
```

### 2. Query Time (Per Request)
```
User Question
      │
      ▼
┌──────────────────────────────────────┐
│ 1. Embed question (Ollama/OpenAI)    │
│ 2. Vector search (cosine similarity) │
│    SELECT ... ORDER BY embedding <=> │
│    $1::vector LIMIT 5                │
└──────────────────────────────────────┘
      │
      ▼
┌──────────────────────────────────────┐
│ 3. Build augmented prompt with       │
│    retrieved chunks as context       │
└──────────────────────────────────────┘
      │
      ▼
┌──────────────────────────────────────┐
│ 4. Stream LLM (OpenRouter liquid)    │
│    → Writer Agent (same model,       │
│      different prompt)               │
│    → TTS Queue (parallel)            │
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
| Audio | Web Audio API (base64 PCM → AudioBuffer) |

---

## Deployment

### Vercel (6 Frontend Apps)
Each app deployed independently:
- Build Command: `npm run build:vercel` (installs with `--legacy-peer-deps`)
- Install Command: `npm install --legacy-peer-deps`
- No root workspace — each app self-contained

### Backend (POC Server)
- Deploy to Render/Fly.io/Railway
- Environment variables: `RAG_DATABASE_URL`, `OPENROUTER_API_KEY`, `ELEVENLABS_API_KEY`, etc.
- Runs on port 5001

### Database
- **Dev**: Local PostgreSQL + pgvector
- **Prod**: Supabase (PostgreSQL + pgvector) or Neon
- Connection: `RAG_DATABASE_URL` in `.env`

---

## Environment Variables

### Shared (All Apps)
```bash
# Frontend apps
NEXT_PUBLIC_API_URL=http://localhost:5001  # or production backend URL
```

### Backend (`engineer-playbook-poc/server/.env`)
```bash
PORT=5001
AUTH_EMAIL=admin@domain.com
AUTH_PASSWORD=secure-password
JWT_SECRET=64-char-hex
OPENROUTER_API_KEY=sk-or-...
ELEVENLABS_API_KEY=sk_...
RAG_DATABASE_URL=postgresql://user:pass@host:5432/db
OLLAMA_BASE_URL=http://localhost:11434  # optional local dev
OLLAMA_TONE_MODEL=engineering-tone
OLLAMA_EMBED_MODEL=nomic-embed-text
```

### RAG Ingestion (`engineer-model-ft/rag/.env`)
```bash
RAG_DATABASE_URL=postgresql://user:pass@host:5432/db
OPENAI_API_KEY=sk-...  # optional, for OpenAI embeddings
```

---

## Security

- All secrets in `.env` (gitignored)
- JWT auth on backend endpoints
- Guardrails on user input (blocked patterns)
- OpenRouter free-model guardrail (rejects non-`:free` models)
- Rate limiting via TTS queue concurrency control

---

## Local Development

```bash
# 1. Start all frontends
cd megamind && npm run dev

# 2. Start backend
cd engineer-playbook-poc/server && npm run dev

# 3. (Optional) Start Ollama for local LLM + embeddings
ollama serve
ollama pull nomic-embed-text
ollama pull liquid/lfm-2.5-2.6b:free  # or use OpenRouter

# 4. Ingest content (one-time)
cd engineer-model-ft/rag
export RAG_DATABASE_URL="postgresql://..."
python3 -m ingest

# 5. Test
# tutorials → http://localhost:5173 (TiPC Bot tab)
# assistant → http://localhost:8081
# blogs → http://localhost:3000
# nav → http://localhost:5174
# profile → http://localhost:8080
# POC → http://localhost:3000
```

---

## Related Documents

- `AGENTS.md` — Agent coordination, roadmap, file ownership
- `CLAUDE.md` — Global coding conventions