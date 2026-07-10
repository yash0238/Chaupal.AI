<div align="center">

# 🌾 KrisiSar AI
### AI-Powered Farm Decision Intelligence for Climate-Resilient Agriculture

**Turning crop photos, weather, and 500K farm records into instant, multilingual decisions for smallholder farmers.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-async-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![BigQuery](https://img.shields.io/badge/BigQuery-analytics-669DF6?logo=googlebigquery&logoColor=white)](https://cloud.google.com/bigquery)
[![NVIDIA RAPIDS](https://img.shields.io/badge/NVIDIA_RAPIDS-cuDF-76B900?logo=nvidia&logoColor=white)](https://rapids.ai/)
[![Deployed on Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://vercel.com/)
[![Backend on Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render&logoColor=white)](https://render.com/)

**🏆 HACKHAZARDS '26 · Theme: Climate & Sustainability Systems**

[Live Demo](#) · [Architecture](docs/ARCHITECTURE.md) · [API Docs](https://krisisar-ai.onrender.com/docs)

</div>

---

## 🎯 The Problem

Over 100 million smallholder farmers in India make high-stakes decisions — *what to spray, when to irrigate, which scheme to apply for* — with almost no timely, trustworthy, or **localized** guidance. The cost of getting it wrong is enormous:

- **Crop disease** goes undiagnosed until it has spread, destroying up to 40% of yield.
- **Weather shocks** (unseasonal rain, heat stress) hit without actionable warning.
- **Government schemes** worth billions go unclaimed because farmers can't navigate eligibility.
- **The language barrier** locks most digital agri-tools to English-first users.

This is a **climate-resilience** problem: as weather grows more volatile, farmers need real-time, data-driven decisions to protect food security and their livelihoods.

## 💡 The Solution

**KrisiSar AI** is an end-to-end **AI-powered decision intelligence platform** that puts an agronomist, a meteorologist, and a policy expert in every farmer's pocket — in their own language. Snap a photo, share your location, ask a question — and get a clear, explainable answer in seconds.

It combines a **multi-agent AI system** (Google Gemini 2.5 Vision + reasoning), **real-time weather intelligence**, **GPU-accelerated analytics** over 500K farm records (NVIDIA RAPIDS), and a **RAG-based government-scheme matcher** behind a fast, accessible, mobile-first web app.

---

## ✨ Key Features

| Feature | What it does | Powered by |
|---|---|---|
| 📸 **Crop Disease Diagnosis** | Upload a leaf photo → disease, confidence, severity, and a treatment plan (organic + chemical) | Gemini 2.5 Vision |
| 🛡️ **Farm Risk Score (0–100)** | A single, explainable risk number fusing weather, disease pressure, and crop health | Multi-factor agent |
| 🌦️ **Weather Intelligence** | 7-day forecast with disease-risk windows and irrigation guidance | Open-Meteo + agent |
| 💬 **Ask KrisiSar** | Multilingual conversational assistant for any farming question | Gemini + intent routing |
| 📄 **Government Scheme Matcher** | Finds subsidies/insurance a farmer is actually eligible for | RAG-style matching |
| 📊 **Analytics Dashboard** | Yield-by-crop, risk-by-state, disease-spread insights across 500K farms | BigQuery + Recharts |

**Multilingual by design:** English, Hindi (हिन्दी), Marathi (मराठी), Tamil (தமிழ்), Telugu (తెలుగు).

---

## 🧠 Multi-Agent AI Architecture

KrisiSar is built as a system of **six specialized AI agents**, each owning a domain — a durable, modular pattern that keeps reasoning explainable and easy to extend.

| Agent | Responsibility |
|---|---|
| `image_diagnosis_agent` | Gemini Vision → disease, confidence, severity, treatment |
| `weather_intelligence_agent` | Open-Meteo forecast → disease-risk & irrigation signals |
| `risk_prediction_agent` | Fuses weather + disease + crop health into a 0–100 score |
| `recommendation_agent` | Produces decision cards (clear yes/no + reasoning) |
| `government_scheme_agent` | RAG matching of farmer profile → eligible schemes |
| `analytics_agent` | Writes events to BigQuery and runs aggregation queries |

> Full details in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## ⚡ GPU-Accelerated Analytics (NVIDIA RAPIDS)

Real-time insight at national scale needs speed. We benchmarked the exact aggregations that power the dashboard on **pandas (CPU) vs cuDF (GPU)** over 500K rows on a Colab T4:

| Operation | Speedup |
|---|---|
| GroupBy aggregation | **49.8×** |
| CSV load | 15.1× |
| Filter | 2.8× |
| **Average** | **🚀 22.58×** |

An order-of-magnitude faster time-to-insight is what makes real-time farmer-scale analytics viable. See [`analytics/rapids_benchmark.ipynb`](analytics/rapids_benchmark.ipynb).

---

## 🏗️ Tech Stack

**Frontend** — Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · Recharts · next-themes (dark mode) · PWA-ready

**Backend** — FastAPI (async) · Python · 8 REST route groups · Pydantic settings · auto Swagger docs

**AI / ML** — Google Gemini 2.5 (Vision + reasoning) · multi-agent orchestration · RAG for scheme matching

**Data** — Google BigQuery (partitioned + clustered) · Looker Studio · NVIDIA RAPIDS cuDF

**Infra** — Vercel (frontend) · Render (backend) · Supabase (auth) · Open-Meteo (weather)

---

## 🖼️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                 Next.js 15 Frontend (Vercel)               │
│   React 19 · TypeScript · Tailwind v4 · Framer Motion      │
└───────────────┬───────────────────────────┬───────────────┘
                │ REST (JSON)                │ Supabase (auth)
                ▼                            ▼
┌─────────────────────────────────┐   ┌──────────────────┐
│      FastAPI Backend (Render)    │   │  Supabase Auth   │
│   8 route groups · 6 AI agents   │   └──────────────────┘
└───┬───────────┬──────────┬───────┘
    ▼           ▼          ▼
┌────────┐ ┌──────────┐ ┌──────────────┐     ┌────────────────────┐
│ Gemini │ │Open-Meteo│ │   BigQuery   │────▶│ NVIDIA RAPIDS cuDF  │
│  2.5   │ │ weather  │ │  analytics   │     │   (22.58× faster)   │
└────────┘ └──────────┘ └──────────────┘     └────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 22, pnpm ≥ 9
- A running backend (or use the hosted one: `https://krisisar-ai.onrender.com`)

### Frontend (local)
```bash
cd frontend
pnpm install
cp .env.example .env.local     # then fill in the values
pnpm dev                       # http://localhost:3000
```

### Environment variables (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=https://krisisar-ai.onrender.com
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Deploy to Vercel
1. Import the repo, set **Root Directory** to `frontend`.
2. Add the environment variables above.
3. Deploy. (Ensure the backend's CORS allows your Vercel domain.)

---

## 🗺️ Roadmap

- 🎙️ **Voice-first interaction** in Indian languages (Sarvam AI) for low-literacy accessibility
- 📴 Offline-first PWA for low-connectivity rural areas
- 📱 SMS/WhatsApp alerts for farmers without smartphones
- 🛰️ Satellite NDVI integration for field-level crop-health monitoring
- 🔔 Proactive push alerts on high-risk weather windows

---

## 🌍 Impact & Alignment

KrisiSar AI directly supports **UN SDG 2 (Zero Hunger)**, **SDG 13 (Climate Action)**, and **SDG 1 (No Poverty)** by making climate-resilient, data-driven farming decisions accessible to the farmers who need them most — regardless of language, literacy, or location.

---

<div align="center">

**Built with 🌱 for farmers, powered by AI.**

</div>
