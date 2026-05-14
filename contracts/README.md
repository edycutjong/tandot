# 🛡️ Tandot Smart Contracts

Solidity escrow contracts for the Tandot rotating savings platform. Deployed on **Arbitrum Sepolia**.

## Contracts

| Contract | Description |
|----------|-------------|
| **TandaEscrow.sol** | Core escrow that holds MXNB deposits and releases payouts per tanda round |
| **MockMXNB.sol** | ERC-20 test token simulating the MXNB stablecoin (testnet only) |

## Security Features

- **ReentrancyGuard** — Prevents reentrant calls on `deposit()` and `triggerPayout()`
- **Pausable** — Emergency circuit breaker for all operations via `pause()` / `unpause()`
- **Ownable2Step** — Safe two-step ownership transfer (prevents fat-finger key loss)
- **Per-tanda accounting** — Isolated `tandaBalances` mapping prevents cross-tanda fund leakage
- **Per-user tracking** — `userDeposits` mapping enables on-chain contribution auditing
- **SafeERC20** — All token transfers use OpenZeppelin's safe wrappers

## Architecture

```
User ──► deposit(tandaId, amount) ──► TandaEscrow (holds MXNB)
                                            │
AI Backend (owner) ──► triggerPayout(recipient, tandaId, amount) ──► Winner
                                            │
Admin (owner) ──► emergencyWithdraw() ──► Owner (emergency only)
```

## Setup

```bash
# Install dependencies
npm install

# Copy env file and configure
cp .env.example .env
# Edit .env with your PRIVATE_KEY and ARBITRUM_RPC_URL
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PRIVATE_KEY` | ✅ | Deployer wallet private key (needs Arbitrum Sepolia ETH) |
| `ARBITRUM_RPC_URL` | ❌ | RPC endpoint (defaults to public Arbitrum Sepolia) |
| `ARBISCAN_API_KEY` | ❌ | For contract verification on Arbiscan |

> **Faucet**: Get testnet ETH at [faucet.quicknode.com/arbitrum/sepolia](https://faucet.quicknode.com/arbitrum/sepolia)

## Commands

```bash
# Compile contracts
npx hardhat compile

# Run tests (28 tests)
npx hardhat test

# Deploy to Arbitrum Sepolia (auto-verifies on Arbiscan)
npx hardhat run scripts/deploy.ts --network arbitrumSepolia

# Deploy locally (Hardhat network)
npx hardhat run scripts/deploy.ts
```

## Test Coverage

**28 tests passing** across 6 test groups:

| Group | Tests | Covers |
|-------|-------|--------|
| Constructor | 4 | Token setup, owner, event emission, zero-address revert |
| Deposits | 7 | Happy path, per-tanda tracking, user tracking, double deposit, isolation, zero amount, no approve, paused |
| Payouts | 8 | Happy path, balance decrement, non-admin revert, zero address, zero amount, insufficient funds, cross-tanda leakage, paused |
| Emergency Withdraw | 3 | Happy path, non-owner revert, zero balance revert |
| Pausable | 3 | Pause/unpause lifecycle, non-owner revert, deposit after unpause |
| MockMXNB Access | 2 | Owner mint, non-owner mint revert |

## Tech Stack

| Layer | Version |
|-------|---------|
| Solidity | 0.8.24 |
| Hardhat | 2.28.6 |
| OpenZeppelin | 5.6.1 |
| Optimizer | 200 runs |
| Chain | Arbitrum Sepolia (421614) |

## License

MIT
