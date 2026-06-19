# AI Interview Prep

An AI-powered mock interview platform that generates real-time interview questions, evaluates answers using Gemini AI, and tracks a user's interview readiness over time.

**Live Demo:** [interview-prep-eta-eight.vercel.app](https://interview-prep-eta-eight.vercel.app)

---

## Overview

Practicing for technical and behavioral interviews is hard without honest, immediate feedback. This app lets a user pick an interview category and difficulty, answer AI-generated questions one at a time, and get an instant score and explanation for every answer — then revisit past sessions from a history dashboard.

---

## Features

- **Google OAuth login** — no passwords to manage
- **AI-generated questions** across four categories: DSA, System Design, HR, and ML
- **Three difficulty levels** — Easy, Medium, Hard
- **Real-time AI evaluation** — every answer is scored (0–10) with written feedback
- **Interview history** — past sessions saved with full question/answer/feedback review
- **Dashboard** — total interviews taken, average score, and recent activity at a glance
- **Delete interviews** — full control over saved history
- **Redis-cached dashboard** — sub-millisecond repeat loads, auto-invalidated on new data

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router), TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL (Neon) via Prisma ORM |
| Caching | Redis (Redis Cloud) |
| Auth | Google OAuth 2.0 + JWT |
| AI | Google Gemini API |
| Testing | Jest + Supertest |
| CI/CD | GitHub Actions |
| Deployment | Vercel (frontend) · Render (backend) |

---

## Architecture

```
┌─────────────┐      JWT (Bearer)      ┌──────────────┐
│   Next.js   │ ─────────────────────► │   Express    │
│  (Vercel)   │ ◄───────────────────── │  (Render)    │
└─────────────┘        JSON            └──────┬───────┘
                                               │
                        ┌──────────────────────┼──────────────────────┐
                        │                      │                      │
                 ┌──────▼──────┐       ┌───────▼──────┐       ┌───────▼──────┐
                 │ PostgreSQL  │       │    Redis     │       │  Gemini API  │
                 │   (Neon)    │       │ (Redis Cloud)│       │   (Google)   │
                 └─────────────┘       └──────────────┘       └──────────────┘
```

**Auth flow:** User logs in via Google → backend creates/finds the user in PostgreSQL → issues a JWT → frontend stores it and attaches it to every API request via an Axios interceptor.

**Interview flow:** User selects category + difficulty → backend prompts Gemini for 5 questions → user answers one at a time → each answer is sent to Gemini for scoring + feedback → completed session is saved to PostgreSQL and the user's dashboard cache is invalidated.

---

## Database Schema

```prisma
model User {
  id         Int         @id @default(autoincrement())
  googleId   String      @unique
  name       String
  email      String      @unique
  createdAt  DateTime    @default(now())
  interviews Interview[]
}

model Interview {
  id         Int      @id @default(autoincrement())
  userId     Int
  category   String
  difficulty String
  questions  Json
  answers    Json
  feedback   Json
  score      Float
  createdAt  DateTime @default(now())
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## Running Locally

### Prerequisites
- Node.js 18+
- A PostgreSQL database (e.g. free tier on [Neon](https://neon.tech))
- A Redis instance (e.g. free tier on [Redis Cloud](https://redis.io/try-free))
- A [Google Cloud OAuth client](https://console.cloud.google.com) (Web application type)
- A [Gemini API key](https://aistudio.google.com/app/apikey)

### Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev   # http://localhost:5000
```

Create `backend/.env`:

```
DATABASE_URL=
REDIS_URL=
JWT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GEMINI_API_KEY=
```

### Frontend

```bash
cd frontend
npm install
npm run dev   # http://localhost:3000
```

### Tests

```bash
cd backend
npm test
```

---

## What I Learned

This was my second full-stack project, built to deliberately step outside my comfort zone. Going in, I knew React, basic Node.js, and MongoDB from a previous project — everything else below was learned from scratch while building this:

- **TypeScript** — types, interfaces, generics, and the practical pain of integrating loosely-typed libraries (Express, Passport, JWT) into a strict type system
- **Next.js App Router** — file-based routing, route groups, dynamic routes, server vs. client components, and the Suspense boundary requirements for hooks like `useSearchParams`
- **PostgreSQL + Prisma** — relational schema design, foreign keys and cascading deletes, migrations vs. `db push`
- **Redis** — cache-aside pattern, key namespacing per user, TTLs, and cache invalidation on writes
- **Google OAuth 2.0** — the full authorization code flow end-to-end, and the tradeoffs of passing tokens via redirect URL vs. cookies
- **Testing** — writing isolated Express app instances for Supertest, and getting Jest to play nicely with Prisma and Redis connections in CI
- **CI/CD** — GitHub Actions workflows, secrets management, and debugging environment differences between local and CI runners
- **Deployment** — splitting a monorepo across Vercel (frontend) and Render (backend), environment variable management, and CORS/OAuth redirect URI configuration across three different domains

---

## Future Improvements

- **WebSockets** — replace the URL-based JWT handoff after OAuth with a WebSocket push, and explore live feedback while a user types
- Company-specific question sets
- Mock interview mode with a timer
- Streak tracking and gamification
