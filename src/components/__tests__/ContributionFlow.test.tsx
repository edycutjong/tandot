import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { ContributionFlow } from '../ContributionFlow';

// Mock the ClientTranslation component since it requires context
jest.mock('@/components/ui/ClientTranslation', () => ({
  ClientTranslation: ({ tKey }: { tKey: string }) => <span>{tKey}</span>
}));

describe('ContributionFlow', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('progresses through all steps and calls onSuccess', async () => {
    const mockOnSuccess = jest.fn();
    render(<ContributionFlow amount={500} onSuccess={mockOnSuccess} />);

    // Initial state
    expect(screen.getByText('contrib_btn_approve')).toBeInTheDocument();

    // Click approve button
    await act(async () => {
      fireEvent.click(screen.getByText('contrib_btn_approve'));
    });

    // Approving state
    expect(screen.getByText('contrib_btn_approving')).toBeInTheDocument();

    // Advance first timeout (1500ms)
    await act(async () => {
      jest.advanceTimersByTime(1500);
    });

    // Depositing state
    expect(screen.getByText('contrib_btn_depositing')).toBeInTheDocument();

    // Advance second timeout (2000ms)
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    // Success state
    expect(screen.getByText('detail_confirmed')).toBeInTheDocument();
    expect(mockOnSuccess).toHaveBeenCalled();

    // Reset back to initial
    await act(async () => {
      fireEvent.click(screen.getByText('contrib_btn_done'));
    });

    // Should be back to initial state
    expect(screen.getByText('contrib_btn_approve')).toBeInTheDocument();
  });

  it('progresses through steps without onSuccess callback', async () => {
    render(<ContributionFlow amount={500} />);

    await act(async () => {
      fireEvent.click(screen.getByText('contrib_btn_approve'));
    });

    await act(async () => {
      jest.advanceTimersByTime(1500);
    });

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    expect(screen.getByText('detail_confirmed')).toBeInTheDocument();
  });
});
