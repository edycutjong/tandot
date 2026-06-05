# 🛡️ Tandot Smart Contracts

Solidity escrow contracts for the Tandot rotating savings platform. Deployed on **BOT Chain Mainnet** and **Testnet**.

## Deployed Addresses

### 🟢 Mainnet (chain 677 — `scan.botchain.ai`)

| Contract | Address | Explorer |
|----------|---------|----------|
| **TandaEscrow** | `0x8413eCc78A8110D0EA05F346c9c2C7d0886B352c` | [View ↗](https://scan.botchain.ai/address/0x8413eCc78A8110D0EA05F346c9c2C7d0886B352c) |
| **MockMXNB** | `0x0B551C18aAF6b1c1c12c026e7ABd2CFAd511BFe7` | [View ↗](https://scan.botchain.ai/address/0x0B551C18aAF6b1c1c12c026e7ABd2CFAd511BFe7) |

### 🟡 Testnet (chain 968 — `scan.bohr.life`)

| Contract | Address | Explorer |
|----------|---------|----------|
| **TandaEscrow** | `0x15eF821fEc9eEFd20f30e443A5a8239873EDe80e` | [View ↗](https://scan.bohr.life/address/0x15eF821fEc9eEFd20f30e443A5a8239873EDe80e) |
| **MockMXNB** | `0xC57D472C2CD8fbE83B2B9FABd9c167A0C2c6DCEa` | [View ↗](https://scan.bohr.life/address/0xC57D472C2CD8fbE83B2B9FABd9c167A0C2c6DCEa) |

> Deployer (Both): `0x4cCB355e6e97c9cEcC936b58e5e0CfDB5ede95d8`

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
# Edit .env with your PRIVATE_KEY and BOT_CHAIN_RPC_URL
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PRIVATE_KEY` | ✅ | Deployer wallet private key (needs BOT for gas) |
| `BOT_CHAIN_RPC_URL` | ❌ | RPC endpoint (defaults to public BOT Chain RPC) |
| `BOTSCAN_API_KEY` | ❌ | For contract verification on BOTScan |

### Funding Your Deployer Wallet

Your wallet needs **BOT** tokens for gas.

> [!NOTE]
> Use a BOT Chain–specific faucet to fund the deployer wallet. Faucets for other
> networks (Ethereum Sepolia, Arbitrum, etc.) will **not** work for BOT Chain
> deployments.

**BOT Chain faucet:** [faucet.botchain.ai](https://faucet.botchain.ai)

- RPC (mainnet): `https://rpc.botchain.ai`
- RPC (testnet): `https://rpc.bohr.life`
- Explorer: [scan.bohr.life](https://scan.bohr.life)
- Chain ID: `677` (mainnet) / `968` (testnet)

## Commands

```bash
# Compile contracts
npx hardhat compile

# Run tests (28 tests)
npx hardhat test

# Deploy to BOT Chain testnet (968, rpc.bohr.life) — matches the live demo contracts
npx hardhat run scripts/deploy.ts --network botChainTestnet

# Deploy to BOT Chain mainnet (677, rpc.botchain.ai)
npx hardhat run scripts/deploy.ts --network botChainMainnet

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
| Chain | BOT Chain Testnet (968) |

## License

MIT
