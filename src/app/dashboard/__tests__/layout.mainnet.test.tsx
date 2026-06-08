import { render } from '@testing-library/react';
import DashboardLayout from '../layout';
import { usePathname } from 'next/navigation';

jest.mock('@/lib/WalletContext', () => ({
  WalletProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useWallet: jest.fn(() => ({ address: '0x123' })),
}));

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { priority, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...rest} alt={rest.alt as string} />;
  },
}));

jest.mock('lucide-react', () => ({
  LayoutDashboard: () => <div data-testid="icon-dashboard" />,
  CircleDollarSign: () => <div data-testid="icon-dollar" />,
  PlusCircle: () => <div data-testid="icon-plus" />,
  History: () => <div data-testid="icon-history" />,
  BrainCircuit: () => <div data-testid="icon-brain" />,
  Search: () => <div data-testid="icon-search" />,
  User: () => <div data-testid="icon-user" />,
  Globe: () => <div data-testid="icon-globe" />,
  Menu: () => <div data-testid="icon-menu" />,
  X: () => <div data-testid="icon-x" />,
  Wallet: () => <div data-testid="icon-wallet" />,
  ChevronDown: () => <div data-testid="icon-chevron-down" />,
  LogOut: () => <div data-testid="icon-log-out" />,
  Settings: () => <div data-testid="icon-settings" />,
}));

jest.mock('@/lib/constants', () => ({
  ...jest.requireActual('@/lib/constants'),
  NETWORK: 'mainnet',
}));

describe('DashboardLayout on mainnet', () => {
  it('renders mainnet network label', () => {
    (usePathname as jest.Mock).mockReturnValue('/dashboard');
    const { getByText } = render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    );
    expect(getByText('BOT Mainnet')).toBeInTheDocument();
  });
});
