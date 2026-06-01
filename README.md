# Sides.gg

A full-stack **live NBA second-screen experience**: users join an invite-gated event, **pick a side**, earn **points from real play-by-play actions**, chat in real time, and (in the product vision) **stake and settle in SOL** via the Sides.gg protocol.

This repository contains the **reference web interface** and **game server** for that experience—not the on-chain protocol contracts themselves.

---

## Table of contents

- [Vision](#vision)
- [What is built today](#what-is-built-today)
- [Product logic](#product-logic)
- [User journey](#user-journey)
- [Scoring & economics](#scoring--economics)
- [Repository structure](#repository-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [API overview](#api-overview)
- [Roadmap](#roadmap)
- [Legal & compliance](#legal--compliance)
- [Further reading](#further-reading)

---

## Vision

**Sides.gg** is positioned as:

- A **points-based live sports game** tied to NBA action (not a static pre-game bet slip).
- A **crypto-native** flow: users bring **SOL**, stake on a side, see **live points** in chat, and **redeem** after the match—**no fiat** in-product.
- A **protocol + interface** model: this app is one portal to the **Sides.gg Protocol** (permissionless smart contracts, multiple possible frontends), as described in the in-app disclaimer.

**Target experience (from product copy):**

1. Obtain a **limited invite code** (e.g. shared on X).
2. **Connect a wallet** and sign in with **X** for identity.
3. Enter the **live game room**, **pick Team A or B**, and set a **stake** (SOL → points).
4. Watch **points move** as ESPN play-by-play is ingested and scored.
5. Use **per-game chat** during the event.
6. At **game end**, see **final points** and **SOL-equivalent** gain/loss, then (vision) **redeem on-chain**.

---

## What is built today

| Area | Status |
|------|--------|
| Live NBA data (ESPN → DB) | Implemented |
| Play-by-play scoring engine | Implemented (server-side) |
| Invite codes (one-time use) | Implemented |
| Onboarding (`User.status`) | Implemented |
| Pick side + username + SOL amount (UI) | Implemented (off-chain accounting) |
| Live game room + polling | Implemented |
| Real-time chat (Socket.IO) | Implemented |
| Wallet connect (RainbowKit / EVM) | UI implemented |
| X login (Supabase OAuth) | Requires Supabase dashboard setup |
| Real SOL staking / on-chain ratios | **Not implemented** (“Flash Staking” = coming soon) |
| On-chain settlement / redemption | **Not implemented** |
| Wallet address as user identity in DB | **Partial** (wallet connect ≠ backend user key) |
| OpenAPI `/docs` on backend | **Not mounted** (mentioned in old backend README only) |

**Bottom line:** The repo is a **working off-chain game prototype** with a clear path to protocol-backed staking described in UI and legal copy.

---

## Product logic

### Data pipeline

1. Backend **polls ESPN** NBA scoreboard and per-game summaries on an interval (`FETCH_INTERVAL`, default 30s).
2. Raw payloads are **normalized** into `Team`, `Game`, `GameAction`, and `ActionType` records (Prisma / PostgreSQL).
3. The frontend loads the **active game** and refreshes scores, clock, and user points while the user is in `/chat`.

### Access control

- **Invite codes** live in `CodeStatus` (`code`, `status`).
- Valid unused code → code marked **used** → user `status` set to **1**.
- Distribution is a **product/ops** concern (X, campaigns); the app only validates codes.

### Identity

- **Supabase Auth** handles **X (Twitter) OAuth**; callback creates or loads a user via `POST /api/user/create` using X metadata (name, email, twitter handle).
- **RainbowKit** connects an **EVM wallet** on the login screen before X; the connected address is **not** yet the primary key in the backend user model.
- App session uses a **client JWT** (`localStorage`, `jwtToken`) encoding `userId` for API calls.

### Game participation

- User selects **home or away team**, optional **display name**, and **SOL amount** (UI: 0.005–10 SOL).
- Conversion: **1 SOL = 200 points** (0.005 SOL per point), matching the About modal.
- `playGame` creates a `UserGame` row; `setUserGamePoints` stores **initial score** (points).
- Scoring applies **only to actions after** the user joined (`GameAction.created_at >= UserGame.created_at`).
- Per-action rows go to `UserStats`; aggregates update `UserGame.score` and `User.score`.

### Social layer

- **Chat** per `gameId`: history via REST, live messages via Socket.IO (`sendMessage` / `newMessage`, `fetchMessages` / `chatHistory`).

### End of game

- When the game reaches a **final/winner** state, the UI shows a **score modal** with points and SOL-style P&L via `getGetorLoassGamePointsAndSol` (server divides points by 200)—**display only**, not a wallet transfer.

---

## User journey

Numeric **`User.status`** drives routing:

| Status | Meaning | Typical route |
|--------|---------|----------------|
| `0` | Registered, no valid invite | `/entry` |
| `≥ 1` | Invite redeemed | `/connect` |
| `≥ 2` | Side chosen, stake/points initialized | `/chat` |

```text
/  (login)
  → Connect wallet (RainbowKit)
  → Login with X (Supabase) → /auth/callback
       → status 0 → /entry (6-digit code)
       → status ≥ 1 → /connect
/entry
  → Valid code → status 1 → /connect
/connect
  → “Flash Staking” UI (demo) → /chat
/chat
  → Side selection modal (if status < 2)
  → Live scores, chat, About/rules
  → Game end → results modal
```

---

## Scoring & economics

### Documented NBA point table (in-app About modal)

Examples: Winner ±30, 2PT ±10, 3PT ±15, FT ±5, rebounds/assists/steals/blocks ±5, turnover/foul penalties, etc.

### Server rules (additional)

Configured in backend (`espnConfig`): bonus handling for assists, blocks, steals, three-pointers, and **winner** action; game status constants for **in progress** vs **final**.

### SOL conversion (off-chain)

- **Stake input (SOL)** → `initialScore = floor(sol × 200)` points.
- **P&L display:** `sol = points / 200`.

On-chain **side ratios** and **stake × ratio** from the vision doc are **not** implemented in this codebase.

---

## Repository structure

```text
sidegg_test/
├── README.md                 ← this file
├── frontend/                 ← Next.js app (port 3113)
│   ├── src/app/              ← pages: /, /entry, /connect, /chat, /auth/callback, /disclaimer
│   ├── src/components/     ← Login, modals, game UI
│   ├── src/context/          ← user, game, chat, socket state
│   ├── src/config/           ← API paths, wagmi, auth
│   └── .env.example
└── backend/                  ← Express + Prisma + Socket.IO
    ├── prisma/schema.prisma  ← data model
    ├── src/feature/          ← ESPN, user, game, code, chat logic
    ├── src/routes/           ← REST routers
    ├── src/socket_route/     ← Socket.IO handlers
    └── .env.example
```

---

## Getting started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **PostgreSQL** database
- **Supabase** project (for X OAuth)
- Optional: **WalletConnect Cloud** project id (better RainbowKit mobile/QR support)

### 1. Database & backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env: DATABASE_URL, PORT, SOCKET_PORT, ESPN_* , FETCH_INTERVAL
npx prisma generate
npx prisma migrate dev
npm run dev
```

Default ports:

- **HTTP API:** `PORT` (example: `4444`) → routes under `http://localhost:4444/api`
- **Socket.IO:** `SOCKET_PORT` (default `8888`)

Health check: open `http://localhost:4444/` → should return `sides.gg Server`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env: Supabase, BASE_URL, SIDEGG_SERVER, WEBSOCKET_URI, etc.
npm run dev
```

Open **http://localhost:3113**.

### 3. Supabase (required for “Login with X”)

1. [Supabase Dashboard](https://supabase.com/dashboard) → your project → **Authentication** → **Providers**.
2. Enable **X / Twitter (OAuth 2.0)**; add **Client ID** and **Client Secret** from the [X Developer Portal](https://developer.x.com/en/portal/dashboard).
3. X app **callback URL:** `https://<project-ref>.supabase.co/auth/v1/callback`
4. Enable **Request email from users** in X app settings.
5. **Authentication → URL Configuration** → add redirect: `http://localhost:3113/auth/callback` (must match `NEXT_PUBLIC_BASE_URL`).

Use **`NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co`** (API URL), **not** the `postgresql://` database connection string.

If you see `Unsupported provider: provider is not enabled`, the X provider is off or misconfigured in Supabase—not a frontend bug.

### 4. Invite codes

Insert rows into `CodeStatus` (via Prisma Studio, SQL, or a seed script):

- `code`: 6-digit string
- `status`: `true` (unused) → flips to `false` after redemption

### 5. Windows note

If PowerShell blocks `npm`, use:

```powershell
npm.cmd install
npm.cmd run dev
```

---

## Environment variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string for Prisma |
| `PORT` | Express HTTP port (e.g. `4444`) |
| `SOCKET_PORT` | Socket.IO port (default `8888`) |
| `ESPN_SERVER` | ESPN API host (default `http://site.api.espn.com`) |
| `ESPN_BASIC_URI` | NBA API path prefix |
| `ESPN_SCOREBOARD_API` | Scoreboard endpoint segment |
| `ESPN_SUMMARY_API` | Summary prefix (`summary?event=`) |
| `FETCH_INTERVAL` | ESPN poll interval in **seconds** (e.g. `30`) |

### Frontend (`frontend/.env`)

See `frontend/.env.example` for the full list. Critical values:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_BASE_URL` | App origin, e.g. `http://localhost:3113` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `NEXT_PUBLIC_SUPABASE_OAUTH_PROVIDER` | `x` (OAuth 2.0) or `twitter` (legacy) |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect Cloud (optional but recommended) |
| `NEXT_PUBLIC_SIDEGG_SERVER` | Backend API base, e.g. `http://localhost:4444/api` |
| `NEXT_PUBLIC_WEBSOCKET_URI` | Socket.IO URL, e.g. `http://localhost:8888` |
| `NEXT_PUBLIC_JWT_SECRET` | Client JWT signing (dev only; not secure for production as public) |

All `NEXT_PUBLIC_*` API path variables map to backend routes under `/api/...` (see `.env.example`).

---

## API overview

Base: `{SIDEGG_SERVER}` → typically `http://localhost:4444/api`

### Game (`/api/game`)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/event` | Refresh/process ESPN data |
| GET | `/raw` | Raw ESPN payload (debug) |
| POST | `/search` | Game by `gameId` |
| POST | `/actions` | Play-by-play for game |
| POST | `/score` | Team score in game |
| POST | `/clock-period` | Period + clock |
| POST | `/initialGame` | Game list/detail for UI (`status`, optional `selectedGameId`) |

### User (`/api/user`)

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/create` | Create or return user |
| POST | `/play` | Join game on a team |
| POST | `/gamescore` | Apply scoring / poll user game score |
| POST | `/update` | Update display name + `selectedGameId` |
| POST | `/updateStatus` | Onboarding `status` (0 → 1 → 2) |
| POST | `/getUserInfo` | User profile by `userId` |
| POST | `/getUserGameInfo` | User’s game row |
| POST | `/setUserGamePoints` | Set initial points from stake |
| POST | `/userGameDetail` | Full live rollup (actions, clock, scores) |
| POST | `/getGetorLoassGamePointsAndSol` | End-game P&L (points + SOL display) |

### Code (`/api/code`)

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/searchCodeAndUpdateStatus` | Validate & consume invite code |

### Chat (`/api/chat`)

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/getMessages` | Message history for `gameId` |

### Socket.IO (port `SOCKET_PORT`)

| Event (client → server) | Purpose |
|-------------------------|---------|
| `fetchMessages` | Load chat history (`gameId`) |
| `sendMessage` | Post message (`userId`, `gameId`, `message`) |

| Event (server → clients) | Purpose |
|--------------------------|---------|
| `chatHistory` | History response |
| `newMessage` | Broadcast new message |

---

## Roadmap

### Phase A — Closed beta (largely done)

- [x] ESPN ingestion and game normalization  
- [x] Invite-gated onboarding  
- [x] Side selection and off-chain points loop  
- [x] Live chat and end-game summary UI  

### Phase B — Identity & access

- [ ] Reliable X OAuth in all environments  
- [ ] Link **wallet address** ↔ `User` record  
- [ ] Align login order (wallet + X) with backend identifiers  
- [ ] Server-side auth validation (beyond client JWT)  

### Phase C — Flash staking (promised in UI)

- [ ] Real SOL deposit before/during event  
- [ ] Side pool / **ratio** mechanics (vision: points = f(stake, side ratio))  
- [ ] Settlement to wallet at game end  
- [ ] Replace or clearly label **demo mode** until live  

### Phase D — Protocol & trust

- [ ] Smart contracts and verifiable state  
- [ ] Third-party interfaces on same protocol  
- [ ] Geo / sanctions enforcement beyond disclaimer text  

### Phase E — Game integrity & ops

- [ ] Scoring edge cases (OT, corrections, delayed plays)  
- [ ] Admin tools for codes and featured games  
- [ ] Rate limits, chat moderation, monitoring  

---

## Legal & compliance

The app includes a **Disclaimer** (`/disclaimer`) stating:

- The interface is a portal to the **Sides.gg Protocol**; the foundation does not control on-chain transactions.  
- **“As is”** / no warranty.  
- **Prohibited jurisdictions** include the **United States** and others listed in that page.

Operators must ensure product, marketing, and access controls match applicable law and internal counsel—not only app copy.

---

## Further reading

- `frontend/README.md` — frontend-specific env and dev commands  
- `backend/README.MD` — backend install and Prisma commands  
- In-app **About the Game** — rules table and SOL staking copy  
- [RainbowKit docs](https://www.rainbowkit.com/docs/installation)  
- [Supabase X/Twitter auth](https://supabase.com/docs/guides/auth/social-login/auth-twitter)  

---

## License

No license file is present in this repository. Add one before public distribution if required by your organization.
