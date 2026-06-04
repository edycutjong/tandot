// Server-only module: only import from API routes / server code (uses a private key).
import { createPublicClient, createWalletClient, defineChain, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { BOT_CHAIN } from '@/lib/constants';

/** viem chain object for BOT Chain (testnet 968). */
export const botChain = defineChain(BOT_CHAIN);

export const publicClient = createPublicClient({
  chain: botChain,
  transport: http(),
});

/**
 * Wallet client signed by the faucet/owner key. Returns null when the key is
 * not configured so callers can fail gracefully instead of throwing at import.
 */
export function getFaucetWallet() {
  const key = process.env.FAUCET_PRIVATE_KEY;
  if (!key) return null;
  const account = privateKeyToAccount(
    (key.startsWith('0x') ? key : `0x${key}`) as `0x${string}`,
  );
  return createWalletClient({ account, chain: botChain, transport: http() });
}
