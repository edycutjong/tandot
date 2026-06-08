import { render, screen } from '@testing-library/react';
import TandasPage from '../page';
import { createClient } from '@/lib/supabase/server';

// Mock Supabase
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}));

// Mock constants
jest.mock('@/lib/constants', () => ({
  formatMXN: (amount: number) => `$${amount} MXN`,
  trustLabel: () => ({ label: 'High Trust', color: '#10b981' }),
  ESCROW_ADDRESS: '0xESCROW',
}));

// Mock ClientTranslation
jest.mock('@/components/ui/ClientTranslation', () => ({
  ClientTranslation: ({ tKey }: { tKey: string }) => <span>{tKey}</span>,
}));

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('TandasPage', () => {
  it('renders the tandas page with data', async () => {
    const mockQuery = {
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      then: jest.fn().mockImplementation((callback) => {
        return Promise.resolve(callback({
          data: [
            {
              id: 'tanda-1',
              name: 'Test Tanda 1',
              description: 'A test tanda',
              status: 'active',
              ai_trust_score: 95,
              total_rounds: 10,
              current_round: 2,
              contribution_amount: 1000,
              frequency: 'weekly',
              max_members: 10,
              created_at: '2026-05-13T10:00:00Z',
            },
          ],
          error: null,
        }));
      }),
    };
    (createClient as jest.Mock).mockResolvedValue({
      from: jest.fn().mockReturnValue(mockQuery),
    });

    const Component = await TandasPage({ searchParams: Promise.resolve({ filter: 'all' }) });
    render(Component);
    
    expect(screen.getByText('dash_my_tandas')).toBeInTheDocument();
    expect(screen.getByText('Test Tanda 1')).toBeInTheDocument();
  });

  it('renders with escrow address', async () => {
    const mockQuery = {
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      then: jest.fn().mockImplementation((callback) => {
        return Promise.resolve(callback({
          data: [
            {
              id: 'tanda-escrow',
              name: 'Escrow Tanda',
              status: 'active',
              ai_trust_score: 95,
              total_rounds: 10,
              current_round: 2,
              contribution_amount: 1000,
              frequency: 'weekly',
              max_members: 10,
              escrow_address: '0x1234567890123456789012345678901234567890',
              created_at: '2026-05-13T10:00:00Z',
            },
          ],
          error: null,
        }));
      }),
    };
    (createClient as jest.Mock).mockResolvedValue({
      from: jest.fn().mockReturnValue(mockQuery),
    });

    const Component = await TandasPage({ searchParams: Promise.resolve({ filter: 'all' }) });
    render(Component);
    expect(screen.getByText(/0x1234…7890/)).toBeInTheDocument();
  });

  it('renders with no search params and zero total rounds', async () => {
    const mockQuery = {
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      then: jest.fn().mockImplementation((callback) => {
        return Promise.resolve(callback({
          data: [
            {
              id: 'tanda-1',
              name: 'Test Tanda 1',
              description: 'A test tanda',
              status: 'active',
              ai_trust_score: 95,
              total_rounds: 0,
              current_round: 2,
              contribution_amount: 1000,
              frequency: 'weekly',
              max_members: 10,
              created_at: '2026-05-13T10:00:00Z',
            },
          ],
          error: null,
        }));
      }),
    };
    (createClient as jest.Mock).mockResolvedValue({
      from: jest.fn().mockReturnValue(mockQuery),
    });

    // no search params
    const Component = await TandasPage({ searchParams: Promise.resolve({}) });
    render(Component);
    expect(screen.getByText('Test Tanda 1')).toBeInTheDocument();
  });

  it('renders empty state with active filter', async () => {
    const mockQuery = {
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      then: jest.fn().mockImplementation((callback) => {
        return Promise.resolve(callback({
          data: null, // to hit the fallback
          error: null,
        }));
      }),
    };
    (createClient as jest.Mock).mockResolvedValue({
      from: jest.fn().mockReturnValue(mockQuery),
    });

    const Component = await TandasPage({ searchParams: Promise.resolve({ filter: 'active' }) });
    render(Component);
    
    expect(screen.getByText('dash_no_tandas_filter')).toBeInTheDocument();
  });
});
