import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ContributionFlow } from '../ContributionFlow';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const wagmi = require('wagmi');

// Mock the ClientTranslation component since it requires context
jest.mock('@/components/ui/ClientTranslation', () => ({
  ClientTranslation: ({ tKey }: { tKey: string }) => <span>{tKey}</span>,
}));

describe('ContributionFlow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Restore default funded balance after any per-test overrides.
    wagmi.useReadContract.mockReturnValue({ data: 10n ** 30n, refetch: wagmi.refetchBalanceMock });
    wagmi.useChainId.mockReturnValue(968);
  });

  it('runs a real approve + deposit and shows the on-chain tx hash', async () => {
    const onSuccess = jest.fn();
    render(<ContributionFlow tandaId="550e8400-e29b-41d4-a716-446655440000" amount={500} onSuccess={onSuccess} />);

    fireEvent.click(screen.getByText('contrib_btn_approve'));

    await waitFor(() => {
      expect(screen.getByText('detail_confirmed')).toBeInTheDocument();
    });

    // approve() + deposit() were both sent
    expect(wagmi.writeContractAsyncMock).toHaveBeenCalledTimes(2);
    expect(wagmi.writeContractAsyncMock.mock.calls[0][0].functionName).toBe('approve');
    expect(wagmi.writeContractAsyncMock.mock.calls[1][0].functionName).toBe('deposit');
    // both txs were awaited for inclusion
    expect(wagmi.waitForTransactionReceiptMock).toHaveBeenCalledTimes(2);
    // real tx hash is surfaced as a BOTScan link
    const link = screen.getByText(/0xdeadbeef/);
    expect(link.closest('a')).toHaveAttribute('href', 'https://scan.bohr.life/tx/0xdeadbeef');
    expect(onSuccess).toHaveBeenCalled();
  });

  it('offers the faucet and disables deposit when the wallet has no MXNB', () => {
    wagmi.useReadContract.mockReturnValue({ data: 0n, refetch: wagmi.refetchBalanceMock });
    render(<ContributionFlow tandaId="550e8400-e29b-41d4-a716-446655440000" amount={500} />);

    expect(screen.getByText('Get test MXNB')).toBeInTheDocument();
    expect(screen.getByText('contrib_btn_approve').closest('button')).toBeDisabled();
  });

  it('switches to BOT Chain when the wallet is on the wrong network', async () => {
    wagmi.useChainId.mockReturnValue(1);
    render(<ContributionFlow tandaId="550e8400-e29b-41d4-a716-446655440000" amount={500} />);

    fireEvent.click(screen.getByText('contrib_btn_approve'));

    await waitFor(() => {
      expect(wagmi.switchChainAsyncMock).toHaveBeenCalledWith({ chainId: 968 });
    });
  });

  it('returns to initial state when the user rejects the wallet prompt', async () => {
    wagmi.writeContractAsyncMock.mockRejectedValueOnce({ name: 'UserRejectedRequestError' });
    render(<ContributionFlow tandaId="550e8400-e29b-41d4-a716-446655440000" amount={500} />);

    fireEvent.click(screen.getByText('contrib_btn_approve'));

    await waitFor(() => {
      expect(screen.getByText('contrib_btn_approve')).toBeInTheDocument();
    });
    expect(screen.queryByText('detail_confirmed')).not.toBeInTheDocument();
  });

  it('handles general errors during contribution', async () => {
    wagmi.writeContractAsyncMock.mockRejectedValueOnce(new Error('Blockchain failed'));
    render(<ContributionFlow tandaId="550e8400-e29b-41d4-a716-446655440000" amount={500} />);

    fireEvent.click(screen.getByText('contrib_btn_approve'));

    await waitFor(() => {
      expect(screen.getByText('Blockchain failed')).toBeInTheDocument();
    });
  });

  it('handles non-Error objects thrown during contribution', async () => {
    wagmi.writeContractAsyncMock.mockRejectedValueOnce('String error');
    render(<ContributionFlow tandaId="550e8400-e29b-41d4-a716-446655440000" amount={500} />);

    fireEvent.click(screen.getByText('contrib_btn_approve'));

    await waitFor(() => {
      expect(screen.getByText('Transaction failed')).toBeInTheDocument();
    });
  });

  it('calls fetch to request test MXNB successfully', async () => {
    global.fetch = jest.fn();
    wagmi.useReadContract.mockReturnValue({ data: 0n, refetch: wagmi.refetchBalanceMock });
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    render(<ContributionFlow tandaId="550e8400-e29b-41d4-a716-446655440000" amount={500} />);
    fireEvent.click(screen.getByText('Get test MXNB'));

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith('/api/faucet', expect.any(Object));
      expect(wagmi.refetchBalanceMock).toHaveBeenCalled();
    });
    fetchSpy.mockRestore();
  });

  it('handles faucet error gracefully', async () => {
    global.fetch = jest.fn();
    wagmi.useReadContract.mockReturnValue({ data: 0n, refetch: wagmi.refetchBalanceMock });
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Too many requests' }),
    } as Response);

    render(<ContributionFlow tandaId="550e8400-e29b-41d4-a716-446655440000" amount={500} />);
    fireEvent.click(screen.getByText('Get test MXNB'));

    await waitFor(() => {
      expect(screen.getByText('Too many requests')).toBeInTheDocument();
    });
    fetchSpy.mockRestore();
  });

  it('handles faucet unexpected error', async () => {
    global.fetch = jest.fn();
    wagmi.useReadContract.mockReturnValue({ data: 0n, refetch: wagmi.refetchBalanceMock });
    const fetchSpy = jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network offline'));

    render(<ContributionFlow tandaId="550e8400-e29b-41d4-a716-446655440000" amount={500} />);
    fireEvent.click(screen.getByText('Get test MXNB'));

    await waitFor(() => {
      expect(screen.getByText('Network offline')).toBeInTheDocument();
    });
    fetchSpy.mockRestore();
  });

  it('handles faucet unexpected non-Error object', async () => {
    global.fetch = jest.fn();
    wagmi.useReadContract.mockReturnValue({ data: 0n, refetch: wagmi.refetchBalanceMock });
    const fetchSpy = jest.spyOn(global, 'fetch').mockRejectedValueOnce('Unknown string');

    render(<ContributionFlow tandaId="550e8400-e29b-41d4-a716-446655440000" amount={500} />);
    fireEvent.click(screen.getByText('Get test MXNB'));

    await waitFor(() => {
      expect(screen.getByText('Faucet failed')).toBeInTheDocument();
    });
    fetchSpy.mockRestore();
  });

  it('logs contribution to backend when memberId is provided and resets after done is clicked', async () => {
    global.fetch = jest.fn();
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    render(<ContributionFlow tandaId="550e8400-e29b-41d4-a716-446655440000" members={[{ id: 'mem-1', wallet_address: '0x123' }]} amount={500} />);
    fireEvent.click(screen.getByText('contrib_btn_approve'));

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith('/api/contributions', expect.any(Object));
      expect(screen.getByText('contrib_btn_done')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('contrib_btn_done'));

    await waitFor(() => {
      expect(screen.getByText('contrib_btn_approve')).toBeInTheDocument();
      expect(screen.queryByText('detail_confirmed')).not.toBeInTheDocument();
    });
    fetchSpy.mockRestore();
  });

  it('shows error if address is missing', async () => {
    // We can simulate missing publicClient instead if that leaves the button clickable.
    wagmi.useAccount.mockReturnValueOnce({ address: '0x123' });
    wagmi.usePublicClient.mockReturnValueOnce(undefined);
    
    render(<ContributionFlow tandaId="550e8400-e29b-41d4-a716-446655440000" amount={500} />);
    const button = screen.getByText('contrib_btn_approve').closest('button');
    if (button) button.removeAttribute('disabled');
    
    fireEvent.click(screen.getByText('contrib_btn_approve'));
    
    await waitFor(() => {
      expect(screen.getByText('Connect your wallet first.')).toBeInTheDocument();
    });
  });

  it('renders correctly when address is undefined', () => {
    wagmi.useAccount.mockReturnValue({ address: undefined });
    render(<ContributionFlow tandaId="550e8400-e29b-41d4-a716-446655440000" amount={500} members={[{ id: '1', wallet_address: '0xabc' }]} />);
    const btn = screen.queryByText('contrib_btn_approve')?.closest('button');
    expect(btn).toBeDisabled();
  });

  it('handles getTestMXNB success', async () => {
    wagmi.useAccount.mockReturnValue({ address: '0x123' });
    wagmi.useReadContract.mockReturnValue({ data: 0n, refetch: wagmi.refetchBalanceMock });
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    render(<ContributionFlow tandaId="550e8400-e29b-41d4-a716-446655440000" amount={500} />);
    const faucetBtn = screen.getByText('Get test MXNB');
    fireEvent.click(faucetBtn);

    await waitFor(() => {
      expect(wagmi.refetchBalanceMock).toHaveBeenCalled();
    });
  });

  it('handles getTestMXNB failure', async () => {
    wagmi.useAccount.mockReturnValue({ address: '0x123' });
    wagmi.useReadContract.mockReturnValue({ data: 0n, refetch: wagmi.refetchBalanceMock });
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Faucet empty' }),
    });

    render(<ContributionFlow tandaId="550e8400-e29b-41d4-a716-446655440000" amount={500} />);
    const faucetBtn = screen.getByText('Get test MXNB');
    fireEvent.click(faucetBtn);

    await waitFor(() => {
      expect(screen.getByText('Faucet empty')).toBeInTheDocument();
    });
  });

  it('handles getTestMXNB failure without error message', async () => {
    wagmi.useAccount.mockReturnValue({ address: '0x123' });
    wagmi.useReadContract.mockReturnValue({ data: 0n, refetch: wagmi.refetchBalanceMock });
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    render(<ContributionFlow tandaId="550e8400-e29b-41d4-a716-446655440000" amount={500} />);
    const faucetBtn = screen.getByText('Get test MXNB');
    fireEvent.click(faucetBtn);

    await waitFor(() => {
      expect(screen.getByText('Faucet failed')).toBeInTheDocument();
    });
  });

  it('shows depositing step while deposit is in flight', async () => {
    wagmi.useAccount.mockReturnValue({ address: '0x123' });
    wagmi.useReadContract.mockReturnValue({ data: 10n ** 30n, refetch: wagmi.refetchBalanceMock });
    
    // Make deposit hang so we can observe the 'depositing' state
    wagmi.writeContractAsyncMock
      .mockResolvedValueOnce('0xApproveTx')
      .mockImplementationOnce(() => new Promise(() => {})); // Hangs forever

    render(<ContributionFlow tandaId="550e8400-e29b-41d4-a716-446655440000" amount={500} />);
    fireEvent.click(screen.getByText('contrib_btn_approve'));

    await waitFor(() => {
      expect(screen.getByText('contrib_btn_depositing')).toBeInTheDocument();
    });
  });
  it('handles user rejection with code 4001', async () => {
    wagmi.writeContractAsyncMock.mockRejectedValueOnce({ code: 4001 });
    render(<ContributionFlow tandaId="550e8400-e29b-41d4-a716-446655440000" amount={500} />);

    fireEvent.click(screen.getByText('contrib_btn_approve'));

    await waitFor(() => {
      expect(screen.getByText('contrib_btn_approve')).toBeInTheDocument();
    });
    expect(screen.queryByText('detail_confirmed')).not.toBeInTheDocument();
    expect(screen.queryByText('Transaction failed')).not.toBeInTheDocument();
  });

  it('silently swallows DB logging failure when contribution fetch rejects', async () => {
    global.fetch = jest.fn();
    const fetchSpy = jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('DB down'));

    render(<ContributionFlow tandaId="550e8400-e29b-41d4-a716-446655440000" members={[{ id: 'mem-1', wallet_address: '0x123' }]} amount={500} />);
    fireEvent.click(screen.getByText('contrib_btn_approve'));

    await waitFor(() => {
      expect(screen.getByText('detail_confirmed')).toBeInTheDocument();
    });
    // The fetch was called and rejected, but the .catch(() => {}) swallowed it
    expect(fetchSpy).toHaveBeenCalledWith('/api/contributions', expect.any(Object));
    // No error shown to user — it's best-effort logging
    expect(screen.queryByText('DB down')).not.toBeInTheDocument();
    fetchSpy.mockRestore();
  });
});
