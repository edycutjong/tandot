import React from 'react';
import { render, screen } from '@testing-library/react';
import { TandaCard } from '../TandaCard';
import { Database } from '@/lib/supabase/database.types';

type Tanda = Database['public']['Tables']['tandas']['Row'];

// Mock the ClientTranslation component since it requires context
jest.mock('@/components/ui/ClientTranslation', () => ({
  ClientTranslation: ({ tKey }: { tKey: string }) => <span>{tKey}</span>
}));

const mockTanda: Tanda = {
  id: 'tanda-1',
  name: 'Test Tanda',
  description: 'Test Description',
  status: 'active',
  ai_trust_score: 95,
  current_round: 2,
  total_rounds: 10,
  contribution_amount: 500,
  frequency: 'weekly',
  max_members: 10,
  escrow_address: '0x1234567890abcdef1234567890abcdef12345678',
  created_at: new Date().toISOString(),
  creator_id: 'owner-1',
  next_payout_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  network: 'testnet'
};

describe('TandaCard', () => {
  it('renders correctly with default props', () => {
    render(<TandaCard tanda={mockTanda} />);
    expect(screen.getByText('Test Tanda')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders description conditionally based on showDescription', () => {
    const { container, rerender } = render(<TandaCard tanda={mockTanda} showDescription={true} />);
    
    // Test the branch where showDescription is true and tanda has a description
    const descEl = container.querySelector('.line-clamp-2');
    expect(descEl).toBeInTheDocument();
    expect(descEl?.textContent).toBe('Test Description');

    // Test the branch where showDescription is false
    rerender(<TandaCard tanda={mockTanda} showDescription={false} />);
    const hiddenDescEl = container.querySelector('p:not(.line-clamp-2)');
    expect(hiddenDescEl).toBeInTheDocument();
    expect(hiddenDescEl?.textContent).toBe('Test Description');
  });

  it('renders escrow address conditionally based on showEscrow', () => {
    const { rerender } = render(<TandaCard tanda={mockTanda} showEscrow={true} />);
    
    // Should show formatted escrow address (first 6 and last 4 chars)
    expect(screen.getByText('0x1234…5678')).toBeInTheDocument();

    // Re-render with showEscrow false
    rerender(<TandaCard tanda={mockTanda} showEscrow={false} />);
    expect(screen.queryByText('0x1234…5678')).not.toBeInTheDocument();
  });

  it('handles 0 total rounds safely for progress bar', () => {
    const zeroRoundsTanda = { ...mockTanda, total_rounds: 0, current_round: 0 };
    render(<TandaCard tanda={zeroRoundsTanda} />);
    expect(screen.getByText('0/0')).toBeInTheDocument();
  });
});
