import { render, screen } from '@testing-library/react';
import HistoryPage from '../page';
import { HistoryList, type HistoryRow } from '../HistoryList';

// Mock the GlassCard component
jest.mock('@/components/ui/GlassCard', () => ({
  GlassCard: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="glass-card" className={className}>
      {children}
    </div>
  ),
}));

// Mock the LocaleContext
jest.mock('@/lib/LocaleContext', () => ({
  useLocale: jest.fn(),
}));

// Mock constants
jest.mock('@/lib/constants', () => ({
  formatMXNB: (amount: number) => `${amount} MXNB`,
  botScanUrl: (path: string) => `https://scan.bohr.life/${path}`,
  ESCROW_ADDRESS: '0xESCROW',
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  History: () => <div data-testid="history-icon" />,
  ArrowUpRight: () => <div data-testid="arrow-up-right-icon" />,
  ArrowDownLeft: () => <div data-testid="arrow-down-left-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
}));

// Mock Supabase server client for the server-component test. The page now runs
// two queries: tandas (for the active network's ids) then contributions.
const CONTRIB_ROWS = [
  { id: 'tx-1', tanda_id: 'tanda-1', amount: 1000, status: 'confirmed', created_at: '2026-05-13T10:00:00Z', botchain_tx_hash: '0xabc123def4567890' },
];
function makeHistoryChain(rows: unknown) {
  const chain: Record<string, jest.Mock> = {};
  chain.select = jest.fn(() => chain);
  chain.eq = jest.fn(() => chain);
  chain.in = jest.fn(() => chain);
  chain.order = jest.fn(() => chain);
  chain.limit = jest.fn().mockResolvedValue({ data: rows, error: null });
  // The tandas query is awaited directly (no .limit), so make the chain thenable.
  chain.then = jest.fn((resolve) => resolve({ data: [{ id: 'tanda-1' }], error: null }));
  return chain;
}
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn().mockResolvedValue({
    from: jest.fn((table: string) =>
      makeHistoryChain(table === 'contributions' ? CONTRIB_ROWS : [{ id: 'tanda-1' }]),
    ),
  }),
}));

import { useLocale } from '@/lib/LocaleContext';

const ROWS: HistoryRow[] = [
  { id: 'tx-1', tanda_id: 'tanda-1', amount: 1000, status: 'confirmed', created_at: '2026-05-13T10:00:00Z', botchain_tx_hash: '0xabc123def4567890' },
  { id: 'tx-2', tanda_id: 'tanda-2', amount: 500, status: 'pending', created_at: '2026-05-14T12:00:00Z', botchain_tx_hash: null },
];

describe('HistoryList', () => {
  it('renders the title in EN locale', () => {
    (useLocale as jest.Mock).mockReturnValue({ locale: 'en', t: {} });
    render(<HistoryList contributions={ROWS} />);
    expect(screen.getByText('Transaction History')).toBeInTheDocument();
  });

  it('renders the title in ES locale', () => {
    (useLocale as jest.Mock).mockReturnValue({ locale: 'es', t: {} });
    render(<HistoryList contributions={ROWS} />);
    expect(screen.getByText('Historial de Transacciones')).toBeInTheDocument();
  });

  it('renders contribution rows with amounts and a BOTScan tx link', () => {
    (useLocale as jest.Mock).mockReturnValue({ locale: 'en', t: {} });
    render(<HistoryList contributions={ROWS} />);
    expect(screen.getByText('Contribution · tanda-1')).toBeInTheDocument();
    expect(screen.getByText('1000 MXNB')).toBeInTheDocument();
    expect(screen.getByText('Contribution · tanda-2')).toBeInTheDocument();
    expect(screen.getByText('500 MXNB')).toBeInTheDocument();
    expect(screen.getByText(/0xabc123de/).closest('a')).toHaveAttribute(
      'href',
      'https://scan.bohr.life/tx/0xabc123def4567890',
    );
  });

  it('shows an empty state when there are no contributions', () => {
    (useLocale as jest.Mock).mockReturnValue({ locale: 'en', t: {} });
    render(<HistoryList contributions={[]} />);
    expect(screen.getByText('No contributions recorded yet.')).toBeInTheDocument();
  });

  it('shows an empty state when there are no contributions in ES locale', () => {
    (useLocale as jest.Mock).mockReturnValue({ locale: 'es', t: {} });
    render(<HistoryList contributions={[]} />);
    expect(screen.getByText('Aún no hay contribuciones registradas.')).toBeInTheDocument();
  });
});

describe('HistoryPage (server)', () => {
  it('fetches contributions and renders them', async () => {
    (useLocale as jest.Mock).mockReturnValue({ locale: 'en', t: {} });
    const ui = await HistoryPage();
    render(ui);
    expect(screen.getByText('Contribution · tanda-1')).toBeInTheDocument();
    expect(screen.getByText('1000 MXNB')).toBeInTheDocument();
  });

  it('handles null data gracefully', async () => {
    (useLocale as jest.Mock).mockReturnValue({ locale: 'en', t: {} });
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mockSupabase = require('@/lib/supabase/server').createClient;
    const nullChain: Record<string, jest.Mock> = {};
    nullChain.select = jest.fn(() => nullChain);
    nullChain.eq = jest.fn(() => nullChain);
    nullChain.in = jest.fn(() => nullChain);
    nullChain.order = jest.fn(() => nullChain);
    nullChain.limit = jest.fn().mockResolvedValue({ data: null, error: null });
    nullChain.then = jest.fn((resolve) => resolve({ data: null, error: null }));
    mockSupabase.mockResolvedValueOnce({
      from: jest.fn().mockReturnValue(nullChain),
    });
    
    const ui = await HistoryPage();
    render(ui);
    expect(screen.getByText('No contributions recorded yet.')).toBeInTheDocument();
  });
});
