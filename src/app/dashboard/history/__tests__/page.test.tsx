import { render, screen } from '@testing-library/react';
import HistoryPage from '../page';

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

// Mock constants and mock data
jest.mock('@/lib/constants', () => ({
  formatMXNB: (amount: number) => `${amount} MXNB`,
}));

jest.mock('@/lib/mock-data', () => ({
  MOCK_CONTRIBUTIONS: [
    {
      id: 'tx-1',
      tanda_id: 'tanda-1',
      member_id: 'member-1',
      amount: 1000,
      status: 'confirmed',
      created_at: '2026-05-13T10:00:00Z',
    },
    {
      id: 'tx-2',
      tanda_id: 'tanda-2',
      member_id: 'member-1',
      amount: 500,
      status: 'pending',
      created_at: '2026-05-14T12:00:00Z',
    },
  ],
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  History: () => <div data-testid="history-icon" />,
  ArrowUpRight: () => <div data-testid="arrow-up-right-icon" />,
  ArrowDownLeft: () => <div data-testid="arrow-down-left-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
}));

import { useLocale } from '@/lib/LocaleContext';

describe('HistoryPage', () => {
  it('renders the history page with title in EN locale', () => {
    (useLocale as jest.Mock).mockReturnValue({ locale: 'en', t: {} });
    render(<HistoryPage />);
    
    expect(screen.getByText('Transaction History')).toBeInTheDocument();
    expect(screen.getByText('All your contributions and payouts recorded on-chain.')).toBeInTheDocument();
  });

  it('renders the history page with title in ES locale', () => {
    (useLocale as jest.Mock).mockReturnValue({ locale: 'es', t: {} });
    render(<HistoryPage />);
    
    expect(screen.getByText('Historial de Transacciones')).toBeInTheDocument();
    expect(screen.getByText('Todas tus contribuciones y pagos registrados on-chain.')).toBeInTheDocument();
  });

  it('renders the transactions list in EN locale', () => {
    (useLocale as jest.Mock).mockReturnValue({ locale: 'en', t: {} });
    render(<HistoryPage />);
    
    expect(screen.getByText('Contribution · tanda-1')).toBeInTheDocument();
    expect(screen.getByText('1000 MXNB')).toBeInTheDocument();
    
    expect(screen.getByText('Contribution · tanda-2')).toBeInTheDocument();
    expect(screen.getByText('500 MXNB')).toBeInTheDocument();
  });

  it('renders the transactions list in ES locale', () => {
    (useLocale as jest.Mock).mockReturnValue({ locale: 'es', t: {} });
    render(<HistoryPage />);
    
    expect(screen.getByText('Contribución · tanda-1')).toBeInTheDocument();
    expect(screen.getByText('Contribución · tanda-2')).toBeInTheDocument();
  });
});
