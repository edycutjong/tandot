<div align="center">
  <h1>Tandot 🎰</h1>
  <p><em>"Did your tanda organizer run off with the money?"</em> — <strong>Never again.</strong><br/>
  AI + smart contracts guarantee every payout, protecting informal savings on-chain.</p>
  <img src="docs/readme-hero.png" alt="Tandot" width="100%">

  <br/>

  [![Mainnet Demo](https://img.shields.io/badge/🟢_Mainnet-Live-06b6d4?style=for-the-badge)](https://mainnet.tandot.edycu.dev)
  [![Testnet Demo](https://img.shields.io/badge/🟡_Testnet-Live-f59e0b?style=for-the-badge)](https://testnet.tandot.edycu.dev)
  [![Pitch Deck](https://img.shields.io/badge/📊_Pitch-Deck-8b5cf6?style=for-the-badge)](https://mainnet.tandot.edycu.dev/pitch)
  [![Pitch Video](https://img.shields.io/badge/🎬_Pitch-Video-ef4444?style=for-the-badge)](https://youtu.be/gQ0IduJwbo0)
  [![BOTScan](https://img.shields.io/badge/📜_BOTScan-Contracts-28A0F0?style=for-the-badge)](https://scan.bohr.life/address/0x15eF821fEc9eEFd20f30e443A5a8239873EDe80e)

  <br/>

  ![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js)
  ![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
  ![Tailwind](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
  ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
  ![BOT Chain](https://img.shields.io/badge/BOT_Chain-28A0F0?style=for-the-badge)
  ![Solidity](https://img.shields.io/badge/Solidity_0.8-363636?style=for-the-badge&logo=solidity&logoColor=white)
  ![OpenAI](https://img.shields.io/badge/GPT--4-412991?style=for-the-badge&logo=openai&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
  [![Tandot CI](https://github.com/edycutjong/tandot/actions/workflows/ci.yml/badge.svg)](https://github.com/edycutjong/tandot/actions/workflows/ci.yml)

  <p>
    <a href="README.es.md">🇲🇽 Versión en Español</a>
  </p>
</div>

---

## 📸 See it in Action

<div align="center">
  <h3>1. Trustless Savings Platform</h3>
  <img width="100%" alt="tandot-landing" src="https://github.com/user-attachments/assets/dfd12f15-b8a6-4933-8800-2cfcffdcdea6" />
  <br/><br/>

  <h3>2. AI-Powered Dashboard & Analysis</h3>
  <img width="100%" alt="my-tandas-1" src="https://github.com/user-attachments/assets/1421f154-c56d-493b-9851-b51e2449ac8d" />
  <br/><br/>

  <h3>3. Automated BOT Chain Escrow Flow</h3>
  <img width="100%" alt="tandot-flow" src="https://github.com/user-attachments/assets/b7ea2d21-a853-450f-a765-78ffd2a56d8e" />
</div>

> **Three steps, zero trust required.** Únete → Contribuye en MXNB → Cobra tu turno.

---

## 💡 The Problem & Solution

In Mexico, **tandas** (rotating savings circles) are the most popular informal savings tool — yet 1 in 3 tandas fail because the organizer disappears with the money. There's no recourse, no insurance, no proof.

**Tandot** eliminates the human organizer entirely. An AI agent manages trust scoring, group matching, and fraud detection, while MXNB (the Mexican peso stablecoin) flows through BOT Chain escrow smart contracts — guaranteeing every payout, every round, every time.

**Key Features:**
- 🤖 **AI Trust Scoring:** GPT-4 evaluates each member's reliability (0-100) using 5-factor analysis: payment history, on-time rate, group diversity, account age, and referral quality.
- 💰 **MXNB Escrow on BOT Chain:** All contributions flow into a trustless smart contract — funds are locked until automatic payout conditions are met.
- 🔒 **Fraud-Proof by Design:** No single person controls the pool. The contract enforces rotation order and the AI flags risky members before they join. Trustless refund capabilities ensure funds cannot be permanently locked if a round fails to form.
- 🎨 **Bilingual Premium UX:** Spanish-first emotional design with English technical depth. Glassmorphism fintech aesthetic, dark mode, Inter + JetBrains Mono + Outfit typography.

## 🏗️ Architecture & Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19 |
| **Styling** | Tailwind CSS v4 |
| **Database** | Supabase (PostgreSQL + Realtime) |
| **Payments** | Bitso Business API (Pay-ins, Payouts, MXNB, Webhooks, Mass Payouts) |
| **Chain** | BOT Chain (MXNB stablecoin, escrow smart contract) |
| **AI** | OpenAI GPT-4 (trust scoring, group matching, fraud detection) |
| **Deploy** | Vercel |

```mermaid
graph TB
    User[👤 Tanda Member] -->|Deposit MXNB| Bitso[Bitso Business API]
    Bitso -->|Webhook| API[Next.js API Routes]
    API -->|Record| DB[(Supabase PostgreSQL)]
    API -->|Lock Funds| Escrow[BOT Chain Escrow Contract]
    API -->|Score Member| AI[OpenAI GPT-4]
    AI -->|Trust Score| DB
    Escrow -->|Auto Payout| Bitso
    Bitso -->|MXNB Transfer| Winner[🏆 Round Winner]

    DB -->|Realtime| Dashboard[Dashboard UI]
```

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 20
- npm

### Installation
```bash
git clone https://github.com/edycutjong/tandot.git
cd tandot
npm install
cp .env.example .env.local   # Add your API keys
npm run dev                  # http://localhost:3000
```

### 🚀 Quick Start

| What | Status |
|---|---|
| **Wallet** | Install [MetaMask](https://metamask.io) → switch to **BOT Chain** |
| **Smart Contracts** | ✅ Already deployed (see addresses below) |
| **Supabase DB** | ✅ Pre-seeded with demo data |
| **Bitso API** | ✅ Staging keys included in demo — no personal account needed |
| **OpenAI** | ✅ Trust scoring works with pre-computed scores locally |
| **Testnet BOT** | Get free BOT from [BOT Chain Faucet](https://faucet.botchain.ai) |

### Deployed Contracts (BOT Chain)

#### 🟢 Mainnet (Chain 677)

| Contract | Address |
|---|---|
| **TandaEscrow** | [`0x8413eCc78A8110D0EA05F346c9c2C7d0886B352c`](https://scan.botchain.ai/address/0x8413eCc78A8110D0EA05F346c9c2C7d0886B352c) |
| **MXNB Token (ERC-20)** | [`0x0B551C18aAF6b1c1c12c026e7ABd2CFAd511BFe7`](https://scan.botchain.ai/address/0x0B551C18aAF6b1c1c12c026e7ABd2CFAd511BFe7) |

#### 🟡 Testnet (Chain 968)

| Contract | Address |
|---|---|
| **TandaEscrow** | [`0x15eF821fEc9eEFd20f30e443A5a8239873EDe80e`](https://scan.bohr.life/address/0x15eF821fEc9eEFd20f30e443A5a8239873EDe80e) |
| **MockMXNB (ERC-20)** | [`0xC57D472C2CD8fbE83B2B9FABd9c167A0C2c6DCEa`](https://scan.bohr.life/address/0xC57D472C2CD8fbE83B2B9FABd9c167A0C2c6DCEa) |

### Switching Networks (Testnet ↔ Mainnet)

The app defaults to **testnet (968)**. The active network is selected by a single
env var, `NEXT_PUBLIC_NETWORK` — chain ID, RPC, explorer, and both contract
addresses are defined per-network in [`src/lib/constants.ts`](src/lib/constants.ts)
and always switch together.

```bash
npm run dev                 # testnet (default)
npm run dev:mainnet         # mainnet (chain 677)
npm run dev:testnet         # testnet (chain 968)
npm run build:mainnet       # production build pinned to mainnet
```

Or set it persistently in `.env.local`:

```bash
NEXT_PUBLIC_NETWORK=mainnet   # or testnet
```

> The `dev:*` / `build:*` scripts override `.env.local` for that run.

### Redeploy Contracts (Optional)

To deploy your own instance of the escrow contract and Mock MXNB token:

```bash
cd contracts
npm install
cp .env.example .env   # Add your BOT Chain RPC URL and Private Key
npx hardhat compile
npx hardhat run scripts/deploy.ts --network botChainTestnet
```

Then update the deployed addresses in the `NETWORKS` registry in [`src/lib/constants.ts`](src/lib/constants.ts) (the `escrow` / `mxnb` fields for the network you deployed to).

### Bitso Business API (Staging)

> ⚠️ **Use the staging environment** — never production for local testing.

1. Create an account at [`stage.bitso.com`](https://stage.bitso.com)
2. Generate API keys under API Settings
3. Add `BITSO_API_KEY` and `BITSO_API_SECRET` to your `.env.local`

## 🧪 Testing & CI

**6-stage pipeline:** Quality (frontend lint/typecheck/jest + solidity hardhat tests) → Security (TruffleHog + npm audit) → Build Verification & bundle budget → Playwright E2E → Performance (Lighthouse CI) → Deploy Gate

```bash
# ── Code Quality & Unit Tests ───────────────
npm run lint          # ESLint
npm run lint:fix      # Auto-fix lint issues
npm run typecheck     # TypeScript compiler check
npm run test          # Run Jest tests
npm run test:coverage # Jest coverage report
npm run ci            # Full quality gate (lint + typecheck + test:coverage)

# ── Smart Contract Quality ──────────────────
cd contracts
npx hardhat compile   # Hardhat compile
npx hardhat test      # Hardhat smart contract test suite

# ── Advanced E2E & Perf Testing ─────────────
npm run e2e           # Playwright E2E tests
npm run e2e:ui        # Playwright interactive E2E UI
npm run lighthouse    # Lighthouse CI compliance audit
```

### Engineering Harness Summary

| Layer | Tool | Status | Details |
|---|---|---|---|
| **Code Quality** | ESLint + TypeScript | ✅ | Strict mode, zero lint errors/warnings |
| **Unit Testing** | Jest | ✅ | 32 suites, 150 tests, 100% statements/branches/functions/lines coverage |
| **Contract Testing** | Hardhat + Chai | ✅ | 35 contract tests passing (deposits, isolated accounting, payouts, trustless refunds) |
| **E2E Testing** | Playwright | ✅ | 3 suites: smoke tests, responsive layout, create Tanda flow |
| **Security (SAST)** | CodeQL | ✅ | GitHub Actions static code scanning |
| **Security (SCA)** | Dependabot + Audit | ✅ | Weekly dependency scanning and automated PRs |
| **Secret Scanning** | TruffleHog | ✅ | Commit history scan on PR and pushes |
| **Performance** | Lighthouse CI | ✅ | Desktop presets with automated local server execution |

## 📁 Project Structure

```
tandot/
├── docs/              # README assets (hero, screenshots)
├── src/
│   ├── app/              # Next.js 16 App Router pages
│   │   ├── page.tsx      # Landing page (bilingual hero)
│   │   └── dashboard/    # Dashboard, tanda detail views
│   ├── components/       # React 19 components
│   └── lib/              # Types, constants, mock data, clients
├── db/
│   └── schema.sql        # Supabase schema (tandas, members, contributions, payouts)
├── contracts/            # Solidity escrow contract
├── public/               # Icon, OG image
├── .env.example          # Environment variable template (with source URLs)
├── .github/workflows/    # CI pipeline (Node 20/22/24 matrix)
├── README.md             # You are here
└── README.es.md          # Spanish version

```

## 📄 License

[MIT](LICENSE) © 2026 Edy Cu

## 🙏 Acknowledgments

Thank you to Bitso and BOT Chain for the APIs and tools.

¡Gracias por revisar este proyecto! 🇲🇽
