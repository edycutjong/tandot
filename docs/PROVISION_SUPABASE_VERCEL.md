# Task: Wire the two Vercel projects (shared single Supabase)

**For an agent with Vercel access (MCP or CLI) and optional Supabase access.**
Self-contained — everything needed is here or in referenced repo files.

## Context

Tandot runs on BOT Chain with **two networks** chosen by one env var,
`NEXT_PUBLIC_NETWORK` (`testnet` | `mainnet`). On the **free tier there is ONE
Supabase project**, shared by both deployments. Network isolation is handled **in
app code** via the `escrow_address` discriminator (testnet/mainnet have different
escrow contracts), so no second database and no schema change are needed.

Two Vercel projects already exist — one per network ("tandot testnet" and "tandot
mainnet"). Both build from the `botchain` branch and use the **same** Supabase.

## Objective

1. (Optional) Apply the one-time backfill so legacy rows show on testnet.
2. Set env vars on both Vercel projects — **only `NEXT_PUBLIC_NETWORK` differs.**
3. Redeploy both.

## Task 1 — (Optional) Supabase backfill

The schema is already applied to the existing DB. If older/seeded tandas have a
null or non-current `escrow_address`, run this once (Supabase SQL editor or MCP) so
they appear on the **testnet** deployment:

```sql
UPDATE tandas
SET escrow_address = '0x15eF821fEc9eEFd20f30e443A5a8239873EDe80e'  -- testnet escrow
WHERE escrow_address IS NULL
   OR escrow_address NOT IN (
     '0x15eF821fEc9eEFd20f30e443A5a8239873EDe80e',   -- testnet
     '0x8413eCc78A8110D0EA05F346c9c2C7d0886B352c'    -- mainnet
   );
```

No `db/schema.sql` re-run is needed — the DB already has the tables.

## Task 2 — Set Vercel env vars

Set these on **both** Vercel projects for `production`, `preview`, and `development`.
**Every value is identical between the two projects except `NEXT_PUBLIC_NETWORK`** —
including the Supabase credentials (same shared DB).

| Env var | testnet project | mainnet project |
|---|---|---|
| `NEXT_PUBLIC_NETWORK` ⟂ | `testnet` | `mainnet` |
| `NEXT_PUBLIC_SUPABASE_URL` | (shared) | (shared) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (shared) | (shared) |
| `SUPABASE_SERVICE_ROLE_KEY` | (shared) | (shared) |
| `BITSO_API_KEY` | (shared) | (shared) |
| `BITSO_API_SECRET` | (shared) | (shared) |
| `BITSO_API_URL` | (shared) | (shared) |
| `OPENAI_API_KEY` | (shared) | (shared) |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | (shared) | (shared) |
| `FAUCET_PRIVATE_KEY` | MockMXNB owner key on chain 968 | (optional — faucet auto-disabled on mainnet) |

- **Do not invent secret values.** Copy the `(shared)` values verbatim from the
  existing/testnet Vercel project's env vars (or the repo owner's `.env.local`).
  Variable names are listed in [`.env.example`](../.env.example).
- CLI form (value piped on stdin so it isn't echoed):
  ```bash
  printf '%s' "<value>" | vercel env add <NAME> production
  # repeat for preview, development
  ```
- The likely **only change needed on the mainnet project** is setting
  `NEXT_PUBLIC_NETWORK=mainnet` (if it currently has the shared secrets from a copy,
  just flip this one var).

## Task 3 — Redeploy

Trigger a fresh production deployment of **both** Vercel projects.
`NEXT_PUBLIC_NETWORK` is **build-time** — it only takes effect after a rebuild.

## Verification

- [ ] testnet project: `NEXT_PUBLIC_NETWORK=testnet`; site footer/links point to `scan.bohr.life`.
- [ ] mainnet project: `NEXT_PUBLIC_NETWORK=mainnet`; site footer/links point to `scan.botchain.ai`.
- [ ] Both projects share identical Supabase creds + other secrets.
- [ ] Tandas created on one network do NOT appear on the other (escrow filter works).
- [ ] Faucet ("Get test MXNB") visible on testnet, absent on mainnet.

---
_Background: `docs/DEPLOYMENT.md` has the full architecture. Network config lives in
`src/lib/constants.ts` (`NETWORKS` registry); the shared-DB discriminator is
`escrow_address`. Do not create per-network git branches — network is config, not code._
