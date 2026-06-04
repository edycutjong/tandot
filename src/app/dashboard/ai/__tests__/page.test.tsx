import { render, screen } from '@testing-library/react';
import AITrustPage from '../page';
import { AITrustList, type TrustMember } from '../AITrustList';
import { useLocale } from '@/lib/LocaleContext';

// Mock LocaleContext
jest.mock('@/lib/LocaleContext', () => ({
  useLocale: jest.fn(),
}));

// Mock TrustRing (renders an svg with canvas-ish math we don't need here)
jest.mock('@/components/ui/TrustRing', () => ({
  TrustRing: () => <div data-testid="trust-ring" />,
}));

// Mock GlassCard
jest.mock('@/components/ui/GlassCard', () => ({
  GlassCard: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="glass-card" className={className}>{children}</div>
  ),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  BrainCircuit: () => <div data-testid="icon-brain" />,
  ShieldCheck: () => <div data-testid="icon-shield" />,
  AlertTriangle: () => <div data-testid="icon-alert" />,
  TrendingUp: () => <div data-testid="icon-trending" />,
}));

// Mock Supabase server client for the server-component test. Includes a duplicate
// wallet to exercise dedupe.
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn().mockResolvedValue({
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({
        data: [
          { id: '1', display_name: 'High', wallet_address: '0xaaaa000000000000000000000000000000000001', trust_score: 95 },
          { id: '2', display_name: 'Dup', wallet_address: '0xaaaa000000000000000000000000000000000001', trust_score: 70 },
          { id: '3', display_name: 'Low', wallet_address: '0xbbbb000000000000000000000000000000000002', trust_score: 40 },
        ],
        error: null,
      }),
    }),
  }),
}));

const MEMBERS: TrustMember[] = [
  { id: '1', display_name: 'High', wallet_address: '0xaaaa000000000000000000000000000000000001', trust_score: 95 },
  { id: '3', display_name: 'Low', wallet_address: '0xbbbb000000000000000000000000000000000002', trust_score: 40 },
];

describe('AITrustList', () => {
  it('renders factors and members in ES locale', () => {
    (useLocale as jest.Mock).mockReturnValue({ locale: 'es', t: {} });
    render(<AITrustList members={MEMBERS} />);
    expect(screen.getByText('IA Trust Score')).toBeInTheDocument();
    expect(screen.getByText('Historial de Pagos')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
  });

  it('renders factors in EN locale', () => {
    (useLocale as jest.Mock).mockReturnValue({ locale: 'en', t: {} });
    render(<AITrustList members={MEMBERS} />);
    expect(screen.getByText('AI Trust Score')).toBeInTheDocument();
    expect(screen.getByText('Payment History')).toBeInTheDocument();
  });

  it('shows an empty state when there are no members', () => {
    (useLocale as jest.Mock).mockReturnValue({ locale: 'en', t: {} });
    render(<AITrustList members={[]} />);
    expect(screen.getByText('No scored members yet.')).toBeInTheDocument();
  });

  it('shows an empty state when there are no members in ES locale', () => {
    (useLocale as jest.Mock).mockReturnValue({ locale: 'es', t: {} });
    render(<AITrustList members={[]} />);
    expect(screen.getByText('Aún no hay miembros evaluados.')).toBeInTheDocument();
  });

  it('renders mid-tier trust score', () => {
    (useLocale as jest.Mock).mockReturnValue({ locale: 'en', t: {} });
    render(<AITrustList members={[{ id: '4', display_name: 'Mid', wallet_address: '0xcccc000000000000000000000000000000000003', trust_score: 75 }]} />);
    expect(screen.getByText('75')).toBeInTheDocument();
  });
});

describe('AITrustPage (server)', () => {
  it('fetches members, dedupes by wallet, and renders', async () => {
    (useLocale as jest.Mock).mockReturnValue({ locale: 'en', t: {} });
    const ui = await AITrustPage();
    render(ui);
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Low')).toBeInTheDocument();
    // Duplicate wallet (display_name "Dup") should be filtered out.
    expect(screen.queryByText('Dup')).not.toBeInTheDocument();
  });

  it('handles null data gracefully', async () => {
    (useLocale as jest.Mock).mockReturnValue({ locale: 'en', t: {} });
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    jest.mocked(require('@/lib/supabase/server').createClient).mockResolvedValueOnce({
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      }),
    });
    
    const ui = await AITrustPage();
    render(ui);
    expect(screen.getByText('No scored members yet.')).toBeInTheDocument();
  });
});
