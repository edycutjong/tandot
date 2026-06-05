import React from 'react';
import { render, screen } from '@testing-library/react';
import { PayoutTimeline } from '../PayoutTimeline';
import { Database } from '@/lib/supabase/database.types';

type Payout = Database['public']['Tables']['payouts']['Row'];

jest.mock('@/lib/constants', () => ({
  formatMXNB: (val: number) => `$${val} MXNB`,
  timeAgo: () => '2 days ago',
  botScanUrl: (path: string) => `https://scan.bohr.life/${path}`,
}));

jest.mock('@/components/ui/ClientTranslation', () => ({
  ClientTranslation: ({ tKey }: { tKey: string }) => <span>{tKey}</span>
}));

const mockPayouts = [
  {
    id: '1',
    round: 1,
    status: 'completed',
    amount: 100,
    recipient_id: '0x123',
    created_at: '2023-01-01',
    botchain_tx_hash: '0xabc'
  },
  {
    id: '2',
    round: 2,
    status: 'pending',
    amount: 100,
    recipient_id: '0x456',
    created_at: '2023-01-02',
    botchain_tx_hash: null
  }
];

describe('PayoutTimeline', () => {
  it('renders completed and active payouts', () => {
    // Current round is 2, so round 2 is active
    render(<PayoutTimeline payouts={mockPayouts as Payout[]} currentRound={2} />);
    
    expect(screen.getByText('payout_paid')).toBeInTheDocument();
    expect(screen.getByText('payout_current')).toBeInTheDocument();
    expect(screen.getByText('payout_pending')).toBeInTheDocument();
    
    // Check if TX link is rendered for completed payout
    expect(screen.getByRole('link', { name: 'TX' })).toHaveAttribute('href', 'https://scan.bohr.life/tx/0xabc');
  });

  it('renders empty state when no payouts', () => {
    render(<PayoutTimeline payouts={[]} currentRound={1} />);
    expect(screen.getByText('payout_no_scheduled')).toBeInTheDocument();
  });
});
