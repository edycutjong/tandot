import { render, screen } from '@testing-library/react';
import TandaDetailPage from '../page';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LocaleProvider } from '@/lib/LocaleContext';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));

// Mock Supabase
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn().mockResolvedValue({
    from: jest.fn().mockImplementation((table) => {
      if (table === 'tandas') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: {
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
            error: null,
          }),
        };
      }
      if (table === 'tanda_members') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({
            data: [
              {
                id: 'member-1',
                display_name: 'Alice',
                trust_score: 90,
                payout_position: 1,
                wallet_address: '0x1234567890abcdef',
                total_contributed: 1000,
                is_current_recipient: false,
              },
            ],
            error: null,
          }),
        };
      }
      if (table === 'contributions') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({
            data: [
              {
                id: 'contrib-1',
                amount: 1000,
                round: 2,
                status: 'confirmed',
                created_at: '2026-05-13T10:00:00Z',
              },
            ],
            error: null,
          }),
        };
      }
      if (table === 'payouts') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({
            data: [
              {
                id: 'payout-1',
                amount: 10000,
                round: 1,
                status: 'completed',
                recipient_id: 'member-1',
                created_at: '2026-05-06T10:00:00Z',
              },
            ],
            error: null,
          }),
        };
      }
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
      };
    }),
  }),
}));

// Mock constants
jest.mock('@/lib/constants', () => ({
  formatMXN: (amount: number) => `$${amount} MXN`,
  formatMXNB: (amount: number) => `${amount} MXNB`,
  trustLabel: () => ({ label: 'High Trust', color: '#10b981', text: 'High Trust' }),
  FREQUENCY_LABELS: { weekly: 'Weekly' },
  STATUS_LABELS: { active: 'Active' },
  timeAgo: () => '2 days ago',
}));

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}));

describe('TandaDetailPage', () => {
  it('renders the tanda details page', async () => {
    const Component = await TandaDetailPage({ params: Promise.resolve({ id: 'tanda-1' }) });
    render(
      <LocaleProvider locale="es" setLocale={jest.fn()}>
        {Component}
      </LocaleProvider>
    );
    
    expect(screen.getByText('Test Tanda 1')).toBeInTheDocument();
    expect(screen.getByText('A test tanda')).toBeInTheDocument();
    
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getAllByText('1000 MXNB')[0]).toBeInTheDocument(); // Contribution
    expect(screen.getByText('10000 MXNB')).toBeInTheDocument(); // Payout
  });

  it('calls notFound when tanda does not exist', async () => {
    // Override the createClient mock for this specific test
    (createClient as jest.Mock).mockResolvedValueOnce({
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
      order: jest.fn().mockResolvedValue({ data: [], error: null }),
    });

    try {
      await TandaDetailPage({ params: Promise.resolve({ id: 'missing-id' }) });
    } catch {
      // ignore
    }
    
    expect(notFound).toHaveBeenCalled();
  });

  it('renders alternative state branches (0 rounds, current recipient, tx hashes, escrow, pending statuses)', async () => {
    // Override the createClient mock for this specific test
    (createClient as jest.Mock).mockResolvedValueOnce({
      from: jest.fn().mockImplementation((table) => {
        if (table === 'tandas') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: {
                id: 'tanda-2',
                name: 'Test Tanda 2',
                description: 'A test tanda',
                status: 'pending',
                ai_trust_score: 95,
                total_rounds: 0,
                current_round: 0,
                contribution_amount: 1000,
                frequency: 'monthly',
                max_members: 10,
                created_at: '2026-05-13T10:00:00Z',
                escrow_address: '0xabc123',
              },
              error: null,
            }),
          };
        }
        if (table === 'tanda_members') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            order: jest.fn().mockResolvedValue({
              data: [
                {
                  id: 'member-2',
                  display_name: 'Bob',
                  trust_score: 90,
                  payout_position: 1,
                  wallet_address: '0x1234567890abcdef',
                  total_contributed: 1000,
                  is_current_recipient: true,
                },
              ],
              error: null,
            }),
          };
        }
        if (table === 'contributions') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            order: jest.fn().mockResolvedValue({
              data: [
                {
                  id: 'contrib-2',
                  amount: 1000,
                  round: 0,
                  status: 'pending',
                  created_at: '2026-05-13T10:00:00Z',
                  arbitrum_tx_hash: '0xhash1',
                },
              ],
              error: null,
            }),
          };
        }
        if (table === 'payouts') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            order: jest.fn().mockResolvedValue({
              data: [
                {
                  id: 'payout-2',
                  amount: 10000,
                  round: 1,
                  status: 'pending',
                  recipient_id: 'member-2',
                  created_at: '2026-05-06T10:00:00Z',
                  arbitrum_tx_hash: '0xhash2',
                },
              ],
              error: null,
            }),
          };
        }
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({ data: [], error: null }),
          single: jest.fn().mockResolvedValue({ data: null, error: null }),
        };
      }),
    });

    const Component = await TandaDetailPage({ params: Promise.resolve({ id: 'tanda-2' }) });
    render(
      <LocaleProvider locale="es" setLocale={jest.fn()}>
        {Component}
      </LocaleProvider>
    );
    
    expect(screen.getByText('Test Tanda 2')).toBeInTheDocument();
    expect(screen.getByText('🎉 Este turno')).toBeInTheDocument();
    expect(screen.getByText('0xabc123')).toBeInTheDocument();
    expect(screen.getAllByText('Pendiente').length).toBeGreaterThan(0);
  });

  it('covers fallback branches when members/contributions/payouts are null', async () => {
    (createClient as jest.Mock).mockResolvedValueOnce({
      from: jest.fn().mockImplementation((table) => {
        if (table === 'tandas') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: {
                id: 'tanda-3',
                name: 'Test Tanda 3',
                status: 'active',
                ai_trust_score: 95,
                total_rounds: 10,
                current_round: 2,
                contribution_amount: 1000,
                frequency: 'weekly',
                max_members: 10,
              },
              error: null,
            }),
          };
        }
        // return null for others
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({ data: null, error: null }),
        };
      }),
    });

    const Component = await TandaDetailPage({ params: Promise.resolve({ id: 'tanda-3' }) });
    render(
      <LocaleProvider locale="es" setLocale={jest.fn()}>
        {Component}
      </LocaleProvider>
    );
    expect(screen.getByText('Test Tanda 3')).toBeInTheDocument();
  });
});
