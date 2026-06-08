import { render } from '@testing-library/react';
import DashboardPage from '../page';
import { createClient } from '@/lib/supabase/server';

// Mock supabase client
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}));

// Mock ClientTranslation
jest.mock('@/components/ui/ClientTranslation', () => ({
  ClientTranslation: ({ tKey }: { tKey: string }) => <span>{tKey}</span>,
}));

// Provide a mock for React's Server Components usage in tests
describe('DashboardPage', () => {
  it('renders stats correctly and lists data', async () => {
    const mockSupabase = {
      from: jest.fn().mockImplementation((table: string) => {
        let data: Record<string, unknown>[] = [];
        if (table === 'tandas') {
          data = [{ id: 't1', name: 'Tanda 1', status: 'active', ai_trust_score: 95, current_round: 1, total_rounds: 10 }];
        } else if (table === 'payouts') {
          data = [
            { id: 'p1', amount: 1000, status: 'scheduled', round: 2, recipient_id: 'abc', created_at: '2026-05-13' },
            { id: 'p2', amount: 1000, status: 'completed', round: 1, recipient_id: 'def', created_at: '2026-05-06', botchain_tx_hash: '0x123' },
          ];
        } else if (table === 'contributions') {
          data = [
            { id: 'c1', amount: 100, status: 'confirmed', round: 1, created_at: '2026-05-06', botchain_tx_hash: '0x456' },
            { id: 'c2', amount: 100, status: 'pending', round: 2, created_at: '2026-05-13' },
          ];
        }

        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          in: jest.fn().mockReturnThis(),
          order: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          then: jest.fn((resolve) => resolve({ data, count: data.length })),
        };
      }),
    };
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);

    // Resolve the async Server Component
    const JSX = await DashboardPage();
    const { getByText, getAllByText } = render(JSX);

    // Should render the Trust Score
    expect(getByText('100%')).toBeInTheDocument();
    
    // Should render items
    expect(getByText('Tanda 1')).toBeInTheDocument();
    expect(getAllByText(/1,?000(\.00)? MXNB/)[0]).toBeInTheDocument(); // from payouts
    expect(getAllByText(/100(\.00)? MXNB/)[0]).toBeInTheDocument(); // from contributions
  });

  it('renders correctly with no data', async () => {
    const mockSupabase = {
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        then: jest.fn((resolve) => resolve({ data: null, count: 0 })), // returning null handles fallback `|| []`
      }),
    };
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);

    const JSX = await DashboardPage();
    const { getByText } = render(JSX);

    expect(getByText('dash_no_recent_contributions')).toBeInTheDocument();
  });

  it('covers TandaCard branch for 0 total rounds', async () => {
    const mockSupabase = {
      from: jest.fn().mockImplementation((table: string) => {
        let data: Record<string, unknown>[] = [];
        if (table === 'tandas') {
          data = [{ id: 't2', name: 'Tanda 2', status: 'active', ai_trust_score: 50, current_round: 0, total_rounds: 0 }];
        }
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          in: jest.fn().mockReturnThis(),
          order: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          then: jest.fn((resolve) => resolve({ data, count: data.length })),
        };
      }),
    };
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);

    const JSX = await DashboardPage();
    const { getByText } = render(JSX);
    expect(getByText('Tanda 2')).toBeInTheDocument();
  });
});
