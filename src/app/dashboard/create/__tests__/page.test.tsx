import { render, fireEvent, waitFor } from '@testing-library/react';
import CreateTandaPage from '../page';

import { useLocale } from '@/lib/LocaleContext';
import { useAccount } from 'wagmi';
// @ts-expect-error - mock file export
import { signMessageAsyncMock } from 'wagmi';

jest.mock('@/lib/WalletContext', () => ({
  WalletProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useWallet: jest.fn(() => ({ address: '0x123' })),
}));

// Mock LocaleContext
jest.mock('@/lib/LocaleContext', () => ({
  useLocale: jest.fn(),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  PlusCircle: () => <div data-testid="icon-plus" />,
  Users: () => <div data-testid="icon-users" />,
  DollarSign: () => <div data-testid="icon-dollar" />,
  Clock: () => <div data-testid="icon-clock" />,
}));

describe('CreateTandaPage', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    (useAccount as jest.Mock).mockReturnValue({ address: '0x123' });
  });
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ tanda: { id: 'test-id' } })
    });
  });
  beforeEach(() => {
    signMessageAsyncMock.mockClear();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useWallet } = require('@/lib/WalletContext');
    useWallet.mockReturnValue({ address: '0x123' });
    // Suppress jsdom 'Not implemented: navigation' errors
    const originalError = console.error.bind(console);
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
      if (String(args[0]).includes('Not implemented: navigation')) return;
      originalError(...args);
    });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renders form inputs and handles click in EN locale', async () => {
    (useLocale as jest.Mock).mockReturnValue({ locale: 'en', t: {} });

    const { getByText, getByPlaceholderText } = render(<CreateTandaPage />);
    
    expect(getByText('Create New Tanda')).toBeInTheDocument();
    expect(getByPlaceholderText('e.g. Holiday Tanda 2026')).toBeInTheDocument();

    const nameInput = getByPlaceholderText('e.g. Holiday Tanda 2026');
    const amountInput = getByPlaceholderText('1,000');
    const membersInput = getByPlaceholderText('10');
    fireEvent.change(nameInput, { target: { value: 'Test' } });
    fireEvent.change(amountInput, { target: { value: '1000' } });
    fireEvent.change(membersInput, { target: { value: '10' } });

    const button = getByText('Create Tanda');
    fireEvent.click(button);

    await waitFor(() => {
      expect(signMessageAsyncMock).toHaveBeenCalledWith({
        message: 'Register tanda on Tandot\n\nSign to confirm you are the organizer. This is a gasless signature — not a transaction and no gas fee. On-chain deposits happen when members contribute.'
      });
    });
  });

  it('renders form inputs and handles click in ES locale', async () => {
    (useLocale as jest.Mock).mockReturnValue({ locale: 'es', t: {} });

    const { getByText, getByPlaceholderText } = render(<CreateTandaPage />);
    
    expect(getByText('Crear Nueva Tanda')).toBeInTheDocument();
    expect(getByPlaceholderText('ej. Tanda Navideña 2026')).toBeInTheDocument();

    const nameInput = getByPlaceholderText('ej. Tanda Navideña 2026');
    const amountInput = getByPlaceholderText('1,000');
    const membersInput = getByPlaceholderText('10');
    fireEvent.change(nameInput, { target: { value: 'Test ES' } });
    fireEvent.change(amountInput, { target: { value: '2000' } });
    fireEvent.change(membersInput, { target: { value: '5' } });

    const button = getByText('Crear Tanda');
    fireEvent.click(button);

    await waitFor(() => {
      expect(signMessageAsyncMock).toHaveBeenCalledWith({
        message: 'Registrar tanda en Tandot\n\nFirma para confirmar que eres el organizador. Es una firma sin costo — no es una transacción ni cobra gas. Los depósitos on-chain ocurren al contribuir.'
      });
    });
  });

  it('handles click without address', async () => {
    (useLocale as jest.Mock).mockReturnValue({ locale: 'en', t: {} });
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useWallet } = require('@/lib/WalletContext');
    (useWallet as jest.Mock).mockReturnValue({ address: undefined });
    const { getByText, getByPlaceholderText } = render(<CreateTandaPage />);
    const nameInput = getByPlaceholderText('e.g. Holiday Tanda 2026');
    const amountInput = getByPlaceholderText('1,000');
    const membersInput = getByPlaceholderText('10');
    fireEvent.change(nameInput, { target: { value: 'Test' } });
    fireEvent.change(amountInput, { target: { value: '1000' } });
    fireEvent.change(membersInput, { target: { value: '10' } });

    const button = getByText('Create Tanda');
    fireEvent.click(button);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Please connect your wallet first.');
    });
    alertMock.mockRestore();
  });

  it('switches chain if wrong chain id', async () => {
    (useLocale as jest.Mock).mockReturnValue({ locale: 'en', t: {} });
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useChainId, switchChainAsyncMock } = require('wagmi');
    (useChainId as jest.Mock).mockReturnValue(1); // Not BOT_CHAIN_ID
    
    const { getByText, getByPlaceholderText } = render(<CreateTandaPage />);
    const nameInput = getByPlaceholderText('e.g. Holiday Tanda 2026');
    const amountInput = getByPlaceholderText('1,000');
    const membersInput = getByPlaceholderText('10');
    fireEvent.change(nameInput, { target: { value: 'Test' } });
    fireEvent.change(amountInput, { target: { value: '1000' } });
    fireEvent.change(membersInput, { target: { value: '10' } });

    const button = getByText('Create Tanda');
    fireEvent.click(button);

    await waitFor(() => {
      expect(switchChainAsyncMock).toHaveBeenCalledWith({ chainId: 968 }); // BOT_CHAIN_ID
      expect(signMessageAsyncMock).toHaveBeenCalled();
    });
  });

  it('handles signMessageAsync error', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useChainId } = require('wagmi');
    (useChainId as jest.Mock).mockReturnValue(968);
    (useLocale as jest.Mock).mockReturnValue({ locale: 'en', t: {} });
    
    signMessageAsyncMock.mockRejectedValueOnce(new Error('User rejected'));
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { getByText, getByPlaceholderText } = render(<CreateTandaPage />);
    const nameInput = getByPlaceholderText('e.g. Holiday Tanda 2026');
    const amountInput = getByPlaceholderText('1,000');
    const membersInput = getByPlaceholderText('10');
    fireEvent.change(nameInput, { target: { value: 'Test' } });
    fireEvent.change(amountInput, { target: { value: '1000' } });
    fireEvent.change(membersInput, { target: { value: '10' } });

    const button = getByText('Create Tanda');
    fireEvent.click(button);

    await waitFor(() => {
      expect(getByText('User rejected')).toBeInTheDocument();
    });
    consoleError.mockRestore();
  });

  it('swallows UserRejectedRequestError', async () => {
    (useLocale as jest.Mock).mockReturnValue({ locale: 'en', t: {} });
    
    const error = new Error('User rejected');
    error.name = 'UserRejectedRequestError';
    signMessageAsyncMock.mockRejectedValueOnce(error);

    const { getByText, getByPlaceholderText } = render(<CreateTandaPage />);
    const nameInput = getByPlaceholderText('e.g. Holiday Tanda 2026');
    const amountInput = getByPlaceholderText('1,000');
    const membersInput = getByPlaceholderText('10');
    fireEvent.change(nameInput, { target: { value: 'Test' } });
    fireEvent.change(amountInput, { target: { value: '1000' } });
    fireEvent.change(membersInput, { target: { value: '10' } });

    const button = getByText('Create Tanda');
    fireEvent.click(button);

    await waitFor(() => {
      expect(getByText('Create Tanda')).toBeInTheDocument();
    });
  });

  it('handles non-Error thrown from signMessageAsync', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useChainId } = require('wagmi');
    (useChainId as jest.Mock).mockReturnValue(968);
    (useLocale as jest.Mock).mockReturnValue({ locale: 'en', t: {} });

    signMessageAsyncMock.mockRejectedValueOnce(42); // non-Error, non-UserRejected

    const { getByText, getByPlaceholderText } = render(<CreateTandaPage />);
    fireEvent.change(getByPlaceholderText('e.g. Holiday Tanda 2026'), { target: { value: 'Test' } });
    fireEvent.change(getByPlaceholderText('1,000'), { target: { value: '1000' } });
    fireEvent.change(getByPlaceholderText('10'), { target: { value: '10' } });

    fireEvent.click(getByText('Create Tanda'));

    await waitFor(() => {
      expect(getByText('Failed to create tanda')).toBeInTheDocument();
    });
  });

  it('shows validation error if fields are invalid', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useWallet } = require('@/lib/WalletContext');
    (useWallet as jest.Mock).mockReturnValue({ address: '0x123' });
    const { getByText, getByPlaceholderText } = render(<CreateTandaPage />);
    const nameInput = getByPlaceholderText('e.g. Holiday Tanda 2026');
    const amountInput = getByPlaceholderText('1,000');
    
    // Test empty name
    fireEvent.change(nameInput, { target: { value: '   ' } });
    fireEvent.click(getByText('Create Tanda'));
    expect(getByText('Fill in a name, amount (> 0) and at least 2 members.')).toBeInTheDocument();

    // Test invalid amount
    fireEvent.change(nameInput, { target: { value: 'Test' } });
    fireEvent.change(amountInput, { target: { value: '0' } });
    fireEvent.click(getByText('Create Tanda'));
    expect(getByText('Fill in a name, amount (> 0) and at least 2 members.')).toBeInTheDocument();
  });

  it('allows changing frequency and description', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useWallet } = require('@/lib/WalletContext');
    (useWallet as jest.Mock).mockReturnValue({ address: '0x123' });
    const { getByRole, getByPlaceholderText } = render(<CreateTandaPage />);
    
    const frequencySelect = getByRole('combobox');
    fireEvent.change(frequencySelect, { target: { value: 'biweekly' } });
    expect((frequencySelect as HTMLSelectElement).value).toBe('biweekly');

    const descInput = getByPlaceholderText('Describe your tanda to attract members...');
    fireEvent.change(descInput, { target: { value: 'A cool tanda' } });
    expect((descInput as HTMLTextAreaElement).value).toBe('A cool tanda');
  });

  it('shows Spanish error messages when locale is es', async () => {
    (useLocale as jest.Mock).mockReturnValue({ locale: 'es', t: {} });
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useWallet } = require('@/lib/WalletContext');
    (useWallet as jest.Mock).mockReturnValue({ address: undefined });
    
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const { getByText, getByPlaceholderText, rerender } = render(<CreateTandaPage />);
    
    // Line 30 check (wallet)
    fireEvent.click(getByText('Crear Tanda'));
    expect(alertMock).toHaveBeenCalledWith('Por favor conecta tu wallet primero.');
    alertMock.mockRestore();

    // Line 34 check (validation)
    (useWallet as jest.Mock).mockReturnValue({ address: '0x123' });
    rerender(<CreateTandaPage />);
    fireEvent.change(getByPlaceholderText('ej. Tanda Navideña 2026'), { target: { value: '   ' } });
    fireEvent.click(getByText('Crear Tanda'));
    expect(getByText('Completa nombre, cuota (> 0) y al menos 2 miembros.')).toBeInTheDocument();

    // Line 63/72 check (fetch fail)
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({}), // No error provided
    });
    fireEvent.change(getByPlaceholderText('ej. Tanda Navideña 2026'), { target: { value: 'Test' } });
    fireEvent.change(getByPlaceholderText('1,000'), { target: { value: '1000' } });
    fireEvent.change(getByPlaceholderText('10'), { target: { value: '10' } });
    
    fireEvent.click(getByText('Crear Tanda'));
    await waitFor(() => {
      expect(getByText('Failed to create tanda')).toBeInTheDocument();
    });
  });
});
