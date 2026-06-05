import React from 'react';
import { render, screen } from '@testing-library/react';
import { ContributionFlow } from '../ContributionFlow';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const wagmi = require('wagmi');

jest.mock('@/components/ui/ClientTranslation', () => ({
  ClientTranslation: ({ tKey }: { tKey: string }) => <span>{tKey}</span>,
}));

// Force the mainnet code path while keeping every other constant real.
jest.mock('@/lib/constants', () => ({
  ...jest.requireActual('@/lib/constants'),
  NETWORK: 'mainnet',
}));

describe('ContributionFlow on mainnet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    wagmi.useChainId.mockReturnValue(677);
  });

  it('never offers the test faucet, even with zero MXNB', () => {
    wagmi.useReadContract.mockReturnValue({ data: 0n, refetch: wagmi.refetchBalanceMock });
    render(<ContributionFlow tandaId="550e8400-e29b-41d4-a716-446655440000" amount={500} />);

    // The faucet mints test tokens — it must not appear on mainnet.
    expect(screen.queryByText('Get test MXNB')).not.toBeInTheDocument();
    // The deposit button is still rendered (disabled, since there are no funds).
    expect(screen.getByText('contrib_btn_approve')).toBeInTheDocument();
  });
});
