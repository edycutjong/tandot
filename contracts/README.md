# 🛡️ Tandot Smart Contracts

Solidity escrow contracts for the Tandot rotating savings platform. Deployed on **Arbitrum Sepolia**.

## Deployed Addresses

| Contract | Address | Arbiscan |
|----------|---------|----------|
| **TandaEscrow** | `0x8413eCc78A8110D0EA05F346c9c2C7d0886B352c` | [View ↗](https://sepolia.arbiscan.io/address/0x8413eCc78A8110D0EA05F346c9c2C7d0886B352c) |
| **MockMXNB** | `0x0B551C18aAF6b1c1c12c026e7ABd2CFAd511BFe7` | [View ↗](https://sepolia.arbiscan.io/address/0x0B551C18aAF6b1c1c12c026e7ABd2CFAd511BFe7) |

> Deployer: `0x4cCB355e6e97c9cEcC936b58e5e0CfDB5ede95d8`

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

### Funding Your Deployer Wallet

Your wallet needs **Arbitrum Sepolia ETH** (L2) for gas — not regular Sepolia ETH (L1).

> [!WARNING]
> Faucets like [Google Cloud Web3 Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia) dispense **Ethereum Sepolia (L1) ETH**, which won't work for Arbitrum deployments. You must either use an Arbitrum-specific faucet or bridge L1 → L2.

**Option A — Direct Arbitrum Sepolia faucets** (recommended):

| Faucet | Auth | Link |
|--------|------|------|
| QuickNode | None | [faucet.quicknode.com/arbitrum/sepolia](https://faucet.quicknode.com/arbitrum/sepolia) |
| Chainlink | GitHub | [faucets.chain.link/arbitrum-sepolia](https://faucets.chain.link/arbitrum-sepolia) |
| Triangle | None | [faucet.triangleplatform.com/arbitrum/sepolia](https://faucet.triangleplatform.com/arbitrum/sepolia) |

**Option B — Bridge from Ethereum Sepolia**:

If you already have Sepolia L1 ETH, bridge it to Arbitrum Sepolia:

1. Go to [bridge.arbitrum.io](https://bridge.arbitrum.io/?destinationChain=arbitrum-sepolia&sourceChain=sepolia)
2. Connect wallet → select **Sepolia → Arbitrum Sepolia**
3. Bridge your ETH (keep ~0.002 ETH on L1 for gas)
4. Wait ~10 minutes for the bridge to complete

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
