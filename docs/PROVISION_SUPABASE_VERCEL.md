# Task: Provision per-network Supabase + wire Vercel env

**For an agent with Supabase MCP and Vercel access (MCP or CLI).** Self-contained —
everything you need is here or in the referenced repo files. Do the tasks in order.

## Objective

Tandot runs on BOT Chain with **two networks** selected by one env var,
`NEXT_PUBLIC_NETWORK` (`testnet` | `mainnet`). Each network must have its **own
Supabase project** (no shared DB — mainnet holds real-value records and the schema
has no `chain_id` column, so isolation is the safety boundary).

Two Vercel projects already exist — one per network (referred to here as the
**testnet Vercel project** and the **mainnet Vercel project**). Your job:

1. Create two Supabase projects (testnet + mainnet).
2. Apply the DB schema to each.
3. Put each project's credentials into the matching Vercel project as env vars.
4. Trigger a redeploy of each.

## Prerequisites / constraints

- **Supabase free tier = 2 active projects per org.** An existing "Arbitrum" project
  already occupies a slot. Two *new* projects therefore need a **paid org** or a
  **separate/fresh org**. Confirm the target org before creating; do not create in an
  org that's already at its limit.
- Pick a **region** close to Mexico (e.g. `us-east-1`); use the same region for both.
- Generate a **strong DB password** per project and record it in your final report
  (the human needs to save these — they cannot be retrieved later).
- **Never invent secret values.** Shared secrets (Bitso/OpenAI/WalletConnect/faucet)
  must be copied verbatim from the existing deployment — see Task 3.

## Task 1 — Create the Supabase projects

Create two projects in the confirmed org, same region:

| Project name | For network |
|---|---|
| `tandot-testnet` | testnet (chain 968) |
| `tandot-mainnet` | mainnet (chain 677) |

## Task 2 — Apply the schema to each

Run the **entire contents of [`db/schema.sql`](../db/schema.sql)** (in this repo)
against **both** new projects, unchanged. It creates the `tandas`, `tanda_members`,
`contributions`, `payouts`, `webhook_events` tables, indexes, and RLS policies.
Verify all five tables exist in each project afterward.

## Task 3 — Collect credentials

For **each** new project, retrieve from Supabase:

- Project URL → `https://<project-ref>.supabase.co`
- **anon / public** API key
- **service_role / secret** API key

For the **shared** secrets (identical across both networks), copy the existing values —
do NOT regenerate. Get them from the existing testnet Vercel project's env vars (or
the repo owner's `.env.local`). These names are listed in
[`.env.example`](../.env.example):

```
BITSO_API_KEY
BITSO_API_SECRET
BITSO_API_URL
OPENAI_API_KEY
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
FAUCET_PRIVATE_KEY    # only meaningful on testnet; see note in Task 4
```

## Task 4 — Set Vercel env vars

Set these on each Vercel project, for the `production`, `preview`, and `development`
environments. **Only the rows marked ⟂ differ between the two projects** — everything
else is identical.

| Env var | testnet Vercel project | mainnet Vercel project |
|---|---|---|
| `NEXT_PUBLIC_NETWORK` ⟂ | `testnet` | `mainnet` |
| `NEXT_PUBLIC_SUPABASE_URL` ⟂ | tandot-testnet URL | tandot-mainnet URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` ⟂ | tandot-testnet anon key | tandot-mainnet anon key |
| `SUPABASE_SERVICE_ROLE_KEY` ⟂ | tandot-testnet service_role key | tandot-mainnet service_role key |
| `BITSO_API_KEY` | (shared) | (shared) |
| `BITSO_API_SECRET` | (shared) | (shared) |
| `BITSO_API_URL` | (shared) | (shared) |
| `OPENAI_API_KEY` | (shared) | (shared) |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | (shared) | (shared) |
| `FAUCET_PRIVATE_KEY` | MockMXNB owner key on chain 968 | (optional — faucet auto-disabled on mainnet) |

CLI form (one env per invocation; value piped on stdin so it isn't echoed):

```bash
printf '%s' "<value>" | vercel env add <NAME> production
# repeat for preview, development
```

Notes:
- `NEXT_PUBLIC_*` vars are **inlined at build time** — they only take effect after a
  rebuild (Task 5).
- The faucet (`/api/faucet` + "Get test MXNB" button) is **automatically disabled when
  `NEXT_PUBLIC_NETWORK=mainnet`** (API returns 403, button hidden). `FAUCET_PRIVATE_KEY`
  on the mainnet project is unused; you may omit it.

## Task 5 — Redeploy

Trigger a fresh production deployment of **each** Vercel project (because the network
var is build-time). Build/start commands are unchanged (`next build` / `next start`);
both projects build from the same git branch (`botchain`, or `main` after PR #16 merges).

## Verification

- [ ] Both Supabase projects exist in the intended org, same region.
- [ ] All 5 tables present in each (`tandas`, `tanda_members`, `contributions`, `payouts`, `webhook_events`).
- [ ] testnet Vercel project: `NEXT_PUBLIC_NETWORK=testnet` + tandot-testnet Supabase creds.
- [ ] mainnet Vercel project: `NEXT_PUBLIC_NETWORK=mainnet` + tandot-mainnet Supabase creds.
- [ ] Shared secrets identical across both projects.
- [ ] Both redeployed; testnet site footer/links point to `scan.bohr.life`, mainnet to `scan.botchain.ai`.

## Report back

- Both project URLs + refs.
- The two **DB passwords** you generated (human must save these).
- Confirmation of which org was used and whether a paid/new org was needed for the
  free-tier limit.

---
_Background: `docs/DEPLOYMENT.md` has the full architecture. Network config lives in
`src/lib/constants.ts` (`NETWORKS` registry). Do not create per-network git branches —
the network is config, not code._
