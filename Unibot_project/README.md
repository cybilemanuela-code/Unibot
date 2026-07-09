# Unibot Web

**Unibot** is a Vue 3 web application that acts as an **academic concierge** for university students. It provides an AI-powered chatbot for admissions, financial aid, and campus questions, plus a help center, profile settings, and authentication flows.

At its current stage, the project is a **polished frontend prototype**: the UI and navigation are largely complete, but most backend, AI, and third-party integrations are still mocked or not wired up.

---

## What This Project Is About

Unibot targets students who need quick answers about their university journey. The app is organized around four main areas:

| Area | Route | Purpose |
|------|-------|---------|
| **Authentication** | `/login`, `/register` | Sign in, sign up, guest access, and social login placeholders |
| **Academic Chat** | `/app/chat` | Conversational assistant with quick-topic chips and typing indicator |
| **Support** | `/app/support` | FAQ, live chat entry point, ticket creation, and resources |
| **Settings** | `/app/settings` | Profile, security, and notification preferences |

The product vision includes personalized responses (e.g. referencing a student's admission files), rich chat cards (financial aid status, campus visits), and integrations with a REST API backend.

---

## Tech Stack

- **Vue 3** (Composition API, `<script setup>`)
- **Vite 8** — dev server and build tool
- **Vue Router 5** — routing with auth guards
- **Pinia** — global state (`authStore`, `chatStore`)
- **Tailwind CSS** — custom brand palette (orange) and typography (DM Sans / DM Serif Display)
- **Axios** — HTTP client with JWT interceptors (ready for a backend)
- **TypeScript tooling** — `vue-tsc` configured, but source files are mostly `.js` / plain `.vue`

---

## Project Structure

```
src/
├── api/axios.js          # Axios instance, JWT header, 401 handling
├── composables/useForm.js # Shared form validation & submit logic
├── layouts/appLayout.vue # Authenticated shell (sidebar + main)
├── pages/                # Login, Register, Chatbot, Support, Settings
├── router/index.js       # Routes + navigation guards
├── services/             # authService, chatService (API contracts defined)
├── stores/               # authStore (localStorage session), chatStore (messages)
├── components/           # auth, chatbot, common, settings, support UI
└── styles/main.css       # Tailwind + shared utility classes
```

---

## Current Implementation Level

### Implemented (working in the UI)

- **Full page layouts** for login, register, chat, support, and settings
- **Responsive app shell** with collapsible sidebar on mobile
- **Route protection** — `/app/*` requires login; guest routes redirect when authenticated
- **Client-side session** — user and token stored in `localStorage` via Pinia
- **Form validation** — email, password rules, confirm-password matching via `useForm`
- **Chat interface** — message list, user/bot bubbles, typing indicator, auto-scroll, quick-topic chips
- **Mock auth flow** — login/register/guest all succeed with fake tokens and redirect to chat
- **Mock chat responses** — fixed delay + canned bot reply
- **Settings UI** — profile fields, password form, notification toggles (local state only)
- **Support UI** — expandable FAQ, ticket subject input, static resources

**Rough estimate: ~45% of a production-ready product** — strong on UI/UX and frontend architecture; weak on real data and integrations.

### Partially implemented (scaffolded, not connected)

| Feature | Status |
|---------|--------|
| `authService` / `chatService` | API methods defined; pages use mocks instead |
| Google / ENT Univ SSO | Buttons present; handlers log `TODO` |
| Chat rich cards | `ChatMessage` supports `cards`; mock flow never sends them |
| Profile save / password change | UI works; calls are simulated with `setTimeout` |
| Support ticket / live chat | UI only; no submission or routing |
| `VITE_API_BASE_URL` | Axios defaults to `http://localhost:3000`; no `.env.example` |

### Not implemented

- **Backend API** — no server in this repo; all `/auth/*` and `/chat/*` endpoints are assumed external
- **Real AI / chatbot** — no LLM, RAG, or knowledge-base integration
- **Chat history persistence** — messages live in memory; refresh loses conversation (except seeded welcome message)
- **File attachments** in chat — button is decorative
- **Forgot password**, terms/privacy links — placeholder `href="#"`
- **Automated tests** — Vitest is listed in dependencies but no test files exist
- **Environment documentation** — no `.env.example` for API URL
- **CI/CD** — no GitHub Actions or deployment config

---

## What Works Well

1. **Clear architecture** — separation of pages, stores, services, and composables makes backend hookup straightforward.
2. **Consistent design system** — Tailwind tokens, shared components (`UInput`, `UButton`, `HeroPanel`), and CSS utility classes.
3. **Auth-ready HTTP layer** — Axios attaches Bearer tokens and clears session on 401.
4. **Good UX details** — loading states on buttons, server error banners, textarea auto-resize, smooth scroll in chat.
5. **Lazy-loaded routes** — smaller initial bundle for auth vs. app pages.

---

## Known Issues & Risks

### Build / environment

- **`npm run build` may fail on Windows** due to a Vite 8 / Rolldown native binding issue. If you see `Cannot find native binding`, try removing `node_modules` and `package-lock.json`, then run `npm install` again.
- **No verified production build** in the current workspace state.

### Code quality / portability

- **Import path casing mismatches** (can break on Linux/macOS CI):
  - Router imports `@/layouts/AppLayout.vue` but the file is `appLayout.vue`
  - `Settings.vue` imports `@/components/common/UButton.vue` but the file is `Ubutton.vue`
  - `Support.vue` imports `@/components/support/...` but the folder is `Support/` (capital S)
- **Vitest in `dependencies`** — typically belongs in `devDependencies`.
- **Mixed TypeScript setup** — TS config exists but application code is JavaScript; type-check adds little value until migrated.

### Functional gaps

- **“Remember me”** checkbox does not change persistence behavior.
- **Logout** clears local session only; no `authService.logout()` call.
- **Duplicate “Support”** entry in sidebar (nav + bottom section).
- **Guest vs. authenticated chat** — `chatService.sendGuestMessage` exists but is unused.
- **Header actions** in chat (search, menu) are non-functional.

---

## Getting Started

### Prerequisites

- Node.js `^20.19.0` or `>=22.12.0` (per `package.json`)

### Install and run

```sh
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

### Demo usage (no backend required)

1. Go to `/login` or `/register`.
2. Submit any valid email/password (validation is client-side only).
3. You are redirected to `/app/chat` with a mock session.
4. Send messages — the bot replies with a fixed mock response after ~1.4s.
5. Use **Continue as Guest** for a guest session without credentials.

### Optional: API base URL

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Until pages stop using mocks and call `authService` / `chatService`, this has no effect.

---

## Roadmap — What Still Needs to Be Done

### High priority

1. **Connect authentication** — wire Login/Register to `authService`; remove mock `setSession` calls.
2. **Connect chat** — replace mock in `Chatbot.vue` with `chatService.sendMessage` (or guest variant).
3. **Add or document backend** — implement `/auth/*` and `/chat/*` API.
4. **Fix import casing** — align filenames and imports for cross-platform builds.
5. **Environment variables** — `.env.example` for `VITE_API_BASE_URL`.

### Medium priority

6. **Persist chat history** — load via `chatService.getHistory`, store per session/user.
7. **Implement social login** — Google OAuth; ENT Univ SSO if required.
8. **Settings persistence** — `authService.updateProfile`, password change API.
9. **Support features** — ticket API, live chat handoff, resource downloads.
10. **Enable rich chat cards** — return structured `cards` from API for financial aid / campus visit status.

### Lower priority

11. **Tests** — unit tests for stores, composables, and critical flows; move Vitest to devDependencies.
12. **TypeScript migration** — optional; add `lang="ts"` to components and type stores/services.
13. **Accessibility & i18n** — ARIA labels, keyboard nav audit, localization if needed.
14. **Deployment** — build pipeline, hosting (Vercel/Netlify), and staging environment.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build locally |
| `npm run type-check` | Run `vue-tsc` only |

---

## Summary

**Unibot Web** is a well-designed **frontend MVP** for a university academic assistant. The screens, navigation, state management, and service abstractions are in place for a full product, but the app currently runs on **mock authentication and mock chat**. The next major milestone is connecting real auth and a chat/AI backend, fixing build/portability issues, and replacing placeholder actions with working integrations.
