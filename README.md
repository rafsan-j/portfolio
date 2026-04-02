# Rafsan Jani — Portfolio

Brutalist Cyberpunk portfolio built with Next.js 14, Tailwind CSS, Supabase, Three.js & Gemini AI.

---

## ⚡ Quickstart (GitHub Codespaces — Chromebook friendly)

### Step 1 — Push to GitHub & open Codespaces
1. Create a new repo on GitHub (e.g. `portfolio`)
2. Push this folder to it:
```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git push -u origin main
```
3. On GitHub → **Code → Codespaces → Create codespace on main**
4. Wait ~2 minutes for the environment to boot

### Step 2 — Install dependencies
```bash
npm install
```

### Step 3 — Environment variables
```bash
cp .env.local.example .env.local
```
Open `.env.local` in the editor and fill in your keys (see below).

### Step 4 — Set up Supabase
1. Go to [supabase.com](https://supabase.com) → New project (free)
2. **SQL Editor → New Query** → paste entire `supabase/migration.sql` → Run
3. This creates all tables and seeds your real projects + map locations

### Step 5 — Run the dev server
```bash
npm run dev
```
Codespaces will show a popup: **Open in Browser** — click it!

---

## 🔑 API Keys (all free tiers)

| Service | Where to get it | .env key |
|---------|----------------|----------|
| Supabase URL | supabase.com → Project Settings → API | `NEXT_PUBLIC_SUPABASE_URL` |
| Supabase Anon Key | same page | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| Supabase Service Key | same page (keep secret) | `SUPABASE_SERVICE_ROLE_KEY` |
| Gemini AI | aistudio.google.com → Get API Key | `GOOGLE_GENERATIVE_AI_API_KEY` |
| Resend (optional) | resend.com → API Keys | `RESEND_API_KEY` |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              ← Homepage (Hero + Bento grid + visitor modes)
│   ├── lab/                  ← Projects with filter + case study modals
│   ├── archive/              ← Research timeline
│   ├── inkwell/              ← Writing & poetry
│   ├── visuals/              ← Masonry gallery + lightbox
│   ├── map/                  ← Interactive BD map with story pins
│   ├── contact/              ← Transmission contact form
│   └── api/
│       ├── ai-chat/          ← Gemini streaming AI endpoint
│       ├── contact/          ← Form + auto-reply
│       └── visitor/          ← Global visitor counter
├── components/
│   ├── layout/NavBar.tsx
│   ├── sections/
│   │   ├── WebGLBackground.tsx  ← Three.js particle field
│   │   └── AIAssistant.tsx      ← AI chat overlay
│   └── ui/
│       ├── Terminal.tsx         ← ~ key terminal
│       ├── CommandPalette.tsx   ← Cmd+K palette
│       └── VisitorModeProvider.tsx
├── lib/supabase.ts
└── styles/globals.css

supabase/migration.sql   ← Run this first!
```

---

## ⌨️ Easter Eggs & Shortcuts

| Key | Action |
|-----|--------|
| `` ` `` (backtick) | Toggle terminal |
| `Cmd/Ctrl + K` | Command palette |

**Terminal commands:** `help` · `ls` · `whoami` · `cat about.txt` · `cat skills.txt` · `cat awards.txt` · `cd lab` · `clear` · `exit`

---

## 🚀 Deploy to Vercel (free)

1. Go to [vercel.com](https://vercel.com) → Import Git Repository
2. Select your GitHub repo
3. Add all env vars from `.env.local.example` in the dashboard
4. Deploy → done. Every `git push` auto-deploys.

---

## 🎨 Design Tokens

```
Void:    #050505   Surface: #0d0d12   Panel:  #111118
Neon:    #00ff88   Cyan:    #00d4ff   Amber:  #ffb400
Font:    Orbitron (display) + JetBrains Mono (body)
```

---

Built by Rafsan Jani · rafsan2972jani@gmail.com · github.com/rafsan-j
