# Deployment — Testnet & Mainnet

How Tandot's BOT Chain version is branched, databased, and deployed. The
Arbitrum hackathon submission is preserved separately (see [Branches](#branches)).

## Branches

| Branch / tag | Purpose | Touch it? |
|---|---|---|
| `main` | Active default branch | yes (BOT Chain line lives here once merged) |
| `botchain` | The BOT Chain codebase — **one branch, both networks** | yes — this is where work happens |
| `v1-arbitrum-hackathon` (tag) | Frozen ETH Mexico 2026 Arbitrum submission | **no — historical record** |

There is **no "testnet branch" vs "mainnet branch."** The network is chosen by an
environment variable, not by code. The same `botchain` branch deploys to both.

## The network switch

`NEXT_PUBLIC_NETWORK` selects the active network. Everything network-dependent
(chain id, RPC, explorer, both contract addresses) lives in the typed `NETWORKS`
registry in [`src/lib/constants.ts`](../src/lib/constants.ts) and moves together —
the active chain can never drift from the contracts it points at.

| `NEXT_PUBLIC_NETWORK` | Chain | RPC | Explorer |
|---|---|---|---|
| `testnet` (default) | 968 | `rpc.bohr.life` | `scan.bohr.life` |
| `mainnet` | 677 | `rpc.botchain.ai` | `scan.botchain.ai` |

> ⚠️ `NEXT_PUBLIC_*` vars are **inlined at build time**. Set it before the build;
> changing it requires a **redeploy** to take effect.

Local:

```bash
npm run dev:testnet     # or dev:mainnet / build:testnet / build:mainnet
```

## Databases — one per network

Testnet and mainnet use **separate Supabase projects** (like staging vs prod).
The schema has no `chain_id` column, and mainnet holds real-value records, so the
isolation is the safety mechanism — never share a DB between them.

1. Create a Supabase project per network (e.g. `tandot-testnet`, `tandot-mainnet`).
   - Mind the free-tier limit of 2 active projects per org; pause the old Arbitrum
     project or use a separate org if needed.
2. In each, run [`db/schema.sql`](../db/schema.sql) **unchanged** — it works as-is
   per network.
3. Use each project's own URL + keys in the matching deployment below.

## Vercel — one project per network

Two Vercel projects, **both building from `botchain`**. Every variable is identical
except the two marked **⟂** (they differ per network):

| Env var | Testnet project | Mainnet project |
|---|---|---|
| `NEXT_PUBLIC_NETWORK` ⟂ | `testnet` | `mainnet` |
| `NEXT_PUBLIC_SUPABASE_URL` ⟂ | testnet project URL | mainnet project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` ⟂ | testnet anon key | mainnet anon key |
| `SUPABASE_SERVICE_ROLE_KEY` ⟂ | testnet service key | mainnet service key |
| `BITSO_API_KEY` | same | same |
| `BITSO_API_SECRET` | same | same |
| `BITSO_API_URL` | same | same |
| `OPENAI_API_KEY` | same | same |
| `FAUCET_PRIVATE_KEY` | MockMXNB owner on 968 | (unused — faucet off on mainnet) |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | same | same |

Set them in **Vercel → Project → Settings → Environment Variables**, or via CLI
(`vercel env add <NAME> production`). Use [`.env.example`](../.env.example) as the
checklist. **Never commit real secret values** — only variable names live in git.

## Faucet behaviour

The test-token faucet (`/api/faucet` + the "Get test MXNB" button) is **automatically
disabled on mainnet** — the API returns `403` and the UI button is hidden when
`NEXT_PUBLIC_NETWORK=mainnet`. No configuration needed.

## Mainnet pre-flight checklist

- [ ] Mainnet contracts verified on chain 677 (escrow + MockMXNB have bytecode).
- [ ] Separate mainnet Supabase project created and `db/schema.sql` applied.
- [ ] Wallets used can add BOT Chain mainnet (677) and hold real BOT for gas.
- [ ] Confirm intent: mainnet contributions move **real MXNB** and cost real gas.
