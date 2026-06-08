'use client';

import '@rainbow-me/rainbowkit/styles.css';
import React, { createContext, useContext, ReactNode } from 'react';
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import { 
  metaMaskWallet,
  coinbaseWallet
} from '@rainbow-me/rainbowkit/wallets';
import { WagmiProvider, useAccount, useDisconnect } from 'wagmi';
import { defineChain } from 'viem';
import { BOT_CHAIN } from '@/lib/constants';

const botChain = defineChain(BOT_CHAIN);
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const config = getDefaultConfig({
  appName: 'Tandot',
  // Keep the ID for type strictness, but we won't hit their servers
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'b56e18d47c72ab683b10817fea6bad40',
  chains: [botChain],
  ssr: true, // Next.js App Router support
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [metaMaskWallet, coinbaseWallet],
    },
  ],
});

const queryClient = new QueryClient();

interface WalletContextType {
  address: string | undefined;
  isConnecting: boolean;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({
          accentColor: '#06b6d4', // Cyan 500
          accentColorForeground: 'white',
          borderRadius: 'large',
        })}>
          <WalletStateProvider>
            {children}
          </WalletStateProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

// Internal provider to map wagmi hooks to the old context signature
function WalletStateProvider({ children }: { children: ReactNode }) {
  const { address, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <WalletContext.Provider value={{
      address,
      isConnecting,
      disconnectWallet: () => disconnect()
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
