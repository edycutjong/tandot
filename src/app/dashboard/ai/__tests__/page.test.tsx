import { render } from '@testing-library/react';
import AITrustPage from '../page';
import { useLocale } from '@/lib/LocaleContext';

// Mock LocaleContext
jest.mock('@/lib/LocaleContext', () => ({
  useLocale: jest.fn(),
}));

// Mock mock-data to include members with various scores
jest.mock('@/lib/mock-data', () => ({
  MOCK_MEMBERS: [
    { id: '1', display_name: 'High', wallet_address: '0x12345678901234567890', trust_score: 95 },
    { id: '2', display_name: 'Medium', wallet_address: '0x12345678901234567890', trust_score: 70 },
    { id: '3', display_name: 'Low', wallet_address: '0x12345678901234567890', trust_score: 40 },
  ],
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  BrainCircuit: () => <div data-testid="icon-brain" />,
  ShieldCheck: () => <div data-testid="icon-shield" />,
  AlertTriangle: () => <div data-testid="icon-alert" />,
  TrendingUp: () => <div data-testid="icon-trending" />,
}));

describe('AITrustPage', () => {
  it('renders factors and members in ES locale', () => {
    (useLocale as jest.Mock).mockReturnValue({ locale: 'es', t: {} });
    const { getByText, getAllByText } = render(<AITrustPage />);
    
    // Check for es translations
    expect(getByText('IA Trust Score')).toBeInTheDocument();
    expect(getByText('Historial de Pagos')).toBeInTheDocument();
    expect(getAllByText('40')[0]).toBeInTheDocument(); // Score
  });

  it('renders factors and members in EN locale', () => {
    (useLocale as jest.Mock).mockReturnValue({ locale: 'en', t: {} });
    const { getByText } = render(<AITrustPage />);
    
    // Check for en translations
    expect(getByText('AI Trust Score')).toBeInTheDocument();
    expect(getByText('Payment History')).toBeInTheDocument();
  });
});
