import { render, screen } from '@testing-library/react';
import ExplorerPage from '../page';
import { useLocale } from '@/lib/LocaleContext';

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

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Search: () => <div data-testid="search-icon" />,
  ExternalLink: () => <div data-testid="external-link-icon" />,
  ShieldCheck: () => <div data-testid="shield-check-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
}));

describe('ExplorerPage', () => {
  it('renders the explorer page with title and search input in EN locale', () => {
    (useLocale as jest.Mock).mockReturnValue({ locale: 'en', t: {} });
    render(<ExplorerPage />);
    
    expect(screen.getByText('On-Chain Explorer')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search address, tx hash…')).toBeInTheDocument();
    expect(screen.getByText('Deployed Contracts')).toBeInTheDocument();
  });

  it('renders the explorer page with title and search input in ES locale', () => {
    (useLocale as jest.Mock).mockReturnValue({ locale: 'es', t: {} });
    render(<ExplorerPage />);
    
    expect(screen.getByText('Explorador On-Chain')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Buscar dirección, tx hash…')).toBeInTheDocument();
    expect(screen.getByText('Contratos Desplegados')).toBeInTheDocument();
  });

  it('renders the contracts list', () => {
    (useLocale as jest.Mock).mockReturnValue({ locale: 'en', t: {} });
    render(<ExplorerPage />);
    
    expect(screen.getByText('TandaEscrow')).toBeInTheDocument();
    expect(screen.getByText('MockMXNB Token')).toBeInTheDocument();
    
    // Check that BOTScan links are present
    const botScanLinks = screen.getAllByRole('link', { name: /BOTScan/i });
    expect(botScanLinks).toHaveLength(2);
    expect(botScanLinks[0].closest('a')).toHaveAttribute('href', expect.stringContaining('https://scan.bohr.life/address/'));
  });

  it('updates search query on input change', () => {
    (useLocale as jest.Mock).mockReturnValue({ locale: 'en', t: {} });
    render(<ExplorerPage />);
    const input = screen.getByPlaceholderText('Search address, tx hash…');
    import('@testing-library/react').then(({ fireEvent }) => {
      fireEvent.change(input, { target: { value: '0x123' } });
      expect(input).toHaveValue('0x123');
    });
  });
});
