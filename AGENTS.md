<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 🎰 Tandot — Agent Instructions

## Project
AI-managed fraud-proof rotating savings circles (tandas) on-chain using MXNB stablecoin. Eliminates the trust problem in Mexico's most popular informal savings institution — tandas — by replacing the human organizer with an AI agent + BOT Chain escrow.


## Structure
- `src/app/` — Next.js 16 App Router pages (landing, dashboard, tanda detail, API routes)
- `src/components/` — React 19 components (TandaCard, ContributionFlow, PayoutTimeline, AIMatchPanel)
- `src/lib/` — Shared types, constants, mock data, Bitso client, Supabase client
- `db/schema.sql` — Supabase schema (tandas, members, contributions, payouts) with RLS
- `contracts/` — Solidity escrow contract for MXNB rotation logic
- `public/` — Logo SVG and OG image assets

## Tech Stack
| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19 |
| **Styling** | Tailwind CSS v4 |
| **Database** | Supabase (PostgreSQL + Realtime) |
| **Payments** | Bitso Business API (Pay-ins, Payouts, MXNB, Webhooks, Mass Payouts) |
| **Chain** | BOT Chain (MXNB stablecoin, escrow smart contract) |
| **AI** | OpenAI GPT-4 (trust scoring, group matching, fraud detection) |

| **Deploy** | Vercel |

## Key Rules
- **Frontend** = ESM (`import`), Next.js 16, React 19, Tailwind v4
- **Colors** = Cyan (#06b6d4) for MXNB/Bitso, Emerald (#10b981) for success/payouts, Amber (#f59e0b) for pending, Red (#ef4444) for alerts, Slate (#1e293b) for backgrounds
- **Typography** = Inter (body), JetBrains Mono (amounts/data), Outfit (headings)
- **Aesthetic** = Premium fintech, dark mode, glassmorphism cards, trust-forward design
- **Language** = Bilingual (Spanish emotional UX, English technical depth)
- **RLS** = anon key for reads, service_role key for writes

## Critical Patterns
- **Multi-Network**: Vercel handles dual deployments via `NEXT_PUBLIC_NETWORK=testnet|mainnet`. Both deployments share the same Supabase instance, separated explicitly by a `network` column on the `tandas` and `webhook_events` tables.
- All state initialization uses **lazy initializers** (not setState-in-useEffect)
- `params` is a **Promise** in Next.js 16 — must `await`
- `PageProps<'/path'>` and `RouteContext<'/path'>` are global type helpers
- Components using hooks must have `'use client'` directive
- Ref updates go in `useEffect`, never during render
- Unused catch variables use underscore prefix (`_err`)
