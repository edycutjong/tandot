import { renderHook, render } from '@testing-library/react';
import { WalletProvider, useWallet } from '../WalletContext';
import { useAccount, useDisconnect } from 'wagmi';

// Mock wagmi hooks
jest.mock('wagmi', () => ({
  WagmiProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="wagmi-provider">{children}</div>,
  useAccount: jest.fn(),
  useDisconnect: jest.fn(),
}));

// Mock rainbowkit provider
jest.mock('@rainbow-me/rainbowkit', () => ({
  RainbowKitProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="rainbowkit-provider">{children}</div>,
  getDefaultConfig: jest.fn(() => ({})),
  darkTheme: jest.fn(() => ({})),
}));

jest.mock('@rainbow-me/rainbowkit/wallets', () => ({
  metaMaskWallet: {},
  coinbaseWallet: {},
}));

// Mock tanstack query provider
jest.mock('@tanstack/react-query', () => ({
  QueryClient: jest.fn(),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="query-provider">{children}</div>,
}));

// Mock viem to avoid TextEncoder issues in jsdom
jest.mock('viem', () => ({
  defineChain: jest.fn(() => ({})),
}));

describe('WalletContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides wallet context to children', () => {
    (useAccount as jest.Mock).mockReturnValue({
      address: '0x123',
      isConnecting: false,
    });
    
    const disconnectMock = jest.fn();
    (useDisconnect as jest.Mock).mockReturnValue({
      disconnect: disconnectMock,
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <WalletProvider>{children}</WalletProvider>
    );

    const { result } = renderHook(() => useWallet(), { wrapper });

    expect(result.current.address).toBe('0x123');
    expect(result.current.isConnecting).toBe(false);
    
    result.current.disconnectWallet();
    expect(disconnectMock).toHaveBeenCalled();
  });

  it('throws error if useWallet is used outside WalletProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useWallet())).toThrow('useWallet must be used within a WalletProvider');
    consoleError.mockRestore();
  });

  it('renders all providers', () => {
    (useAccount as jest.Mock).mockReturnValue({
      address: undefined,
      isConnecting: false,
    });
    (useDisconnect as jest.Mock).mockReturnValue({
      disconnect: jest.fn(),
    });

    const { getByTestId } = render(
      <WalletProvider>
        <div>Test Child</div>
      </WalletProvider>
    );

    expect(getByTestId('wagmi-provider')).toBeInTheDocument();
    expect(getByTestId('query-provider')).toBeInTheDocument();
    expect(getByTestId('rainbowkit-provider')).toBeInTheDocument();
  });
});
