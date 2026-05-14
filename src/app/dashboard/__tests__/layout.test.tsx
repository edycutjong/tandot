import { render } from '@testing-library/react';
import DashboardLayout from '../layout';
import { usePathname } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { priority, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...rest} alt={rest.alt as string} />;
  },
}));

// Mock lucide-react icons
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

describe('DashboardLayout', () => {
  it('renders children and navigation', () => {
    (usePathname as jest.Mock).mockReturnValue('/dashboard');
    
    // Set mock local storage
    Storage.prototype.getItem = jest.fn(() => 'en');
    Storage.prototype.setItem = jest.fn();

    const { getByText, getByTestId } = render(
      <DashboardLayout>
        <div>Dashboard Content Child</div>
      </DashboardLayout>
    );

    expect(getByText('Dashboard Content Child')).toBeInTheDocument();
    expect(getByTestId('icon-dashboard')).toBeInTheDocument();
  });

  it('updates locale correctly', async () => {
    (usePathname as jest.Mock).mockReturnValue('/dashboard');
    const { getByText } = render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    );
    const { fireEvent } = await import('@testing-library/react');
    const enButton = getByText('EN');
    fireEvent.click(enButton);
    expect(Storage.prototype.setItem).toHaveBeenCalledWith('tandot-locale', 'es');
  });

  it('handles null locale from storage', () => {
    Storage.prototype.getItem = jest.fn(() => null);
    (usePathname as jest.Mock).mockReturnValue('/dashboard');
    render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    );
    expect(Storage.prototype.getItem).toHaveBeenCalledWith('tandot-locale');
  });
});
