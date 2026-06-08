# Deployment — Testnet & Mainnet

How Tandot's BOT Chain version is branched, databased, and deployed. The
Arbitrum V1 submission is preserved separately (see [Branches](#branches)).

## Branches

| Branch / tag | Purpose | Touch it? |
|---|---|---|
| `main` | Active default branch | yes (BOT Chain line lives here once merged) |
| `botchain` | The BOT Chain codebase — **one branch, both networks** | yes — this is where work happens |
| `v1-arbitrum-legacy` (tag) | Frozen V1 Arbitrum submission | **no — historical record** |

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

## Database — one shared DB, separated in-app

On the free tier there is **one Supabase project**, shared by both deployments.
Network isolation is enforced **in application code**: every tanda row is stamped
with the active network's `escrow_address` on insert (testnet and mainnet have
different escrow contracts), and all tanda reads filter by it
(`.eq('escrow_address', ESCROW_ADDRESS)`). The dashboard's recent activity and the
history page scope their contribution/payout reads to the current network's tanda
ids. So testnet and mainnet rows live in the same tables but never appear in each
other's views.

- Run [`db/schema.sql`](../db/schema.sql) once (already applied to the existing DB).
- **Optional one-time backfill** so any legacy/seeded rows show on testnet (assigns
  everything that isn't the mainnet escrow to the testnet escrow):
  ```sql
  UPDATE tandas
  SET escrow_address = '0x15eF821fEc9eEFd20f30e443A5a8239873EDe80e'  -- testnet escrow
  WHERE escrow_address IS NULL
     OR escrow_address NOT IN (
       '0x15eF821fEc9eEFd20f30e443A5a8239873EDe80e',   -- testnet
       '0x8413eCc78A8110D0EA05F346c9c2C7d0886B352c'    -- mainnet
     );
  ```

> ⚠️ Real-value safety: a shared DB keeps mainnet financial rows in the same tables
> as test rows. The escrow filter is the only thing separating them — if you ever
> move to a paid tier, prefer a **separate Supabase project for mainnet**.

## Vercel — one project per network

Two Vercel projects, **both building from `botchain`**, sharing the **same single
Supabase**. Only the row marked **⟂** differs between them — everything else
(including the Supabase creds) is identical:

| Env var | Testnet project | Mainnet project |
|---|---|---|
| `NEXT_PUBLIC_NETWORK` ⟂ | `testnet` | `mainnet` |
| `NEXT_PUBLIC_SUPABASE_URL` | same (shared DB) | same (shared DB) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | same | same |
| `SUPABASE_SERVICE_ROLE_KEY` | same | same |
| `BITSO_API_KEY` | same | same |
| `BITSO_API_SECRET` | same | same |
| `BITSO_API_URL` | same | same |
| `OPENAI_API_KEY` | same | same |
| `FAUCET_PRIVATE_KEY` | MockMXNB owner on 968 | (unused — faucet off on mainnet) |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | same | same |

So the **only** env difference between the two projects is `NEXT_PUBLIC_NETWORK`.
Set vars in **Vercel → Project → Settings → Environment Variables**, or via CLI
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
