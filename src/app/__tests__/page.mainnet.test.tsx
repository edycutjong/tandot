import { render } from '@testing-library/react';
import LandingPage from '../page';

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  ShieldCheck: () => <div data-testid="icon-shield-check" />,
  BrainCircuit: () => <div data-testid="icon-brain-circuit" />,
  Zap: () => <div data-testid="icon-zap" />,
  ArrowRight: () => <div data-testid="icon-arrow-right" />,
  Coins: () => <div data-testid="icon-coins" />,
  Globe: () => <div data-testid="icon-globe" />,
  ArrowRightLeft: () => <div data-testid="icon-arrow-right-left" />,
}));

import React from 'react';

const sanitizeProps = (props: Record<string, unknown>) => {
  const sanitized = { ...props };
  delete sanitized.initial;
  delete sanitized.animate;
  delete sanitized.transition;
  delete sanitized.whileHover;
  delete sanitized.whileTap;
  delete sanitized.layout;
  return sanitized;
};

jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion');
  type MockProps = Record<string, unknown> & { children?: React.ReactNode };
  const MockComponent = ({ children, ...props }: MockProps) => <div {...sanitizeProps(props)}>{children}</div>;
  const MockCircle = ({ children, ...props }: MockProps) => <circle {...sanitizeProps(props)}>{children}</circle>;
  const MockSpan = ({ children, ...props }: MockProps) => <span {...sanitizeProps(props)}>{children}</span>;
  return {
    ...actual,
    motion: {
      div: MockComponent,
      h1: ({ children, ...props }: MockProps) => <h1 {...sanitizeProps(props)}>{children}</h1>,
      p: ({ children, ...props }: MockProps) => <p {...sanitizeProps(props)}>{children}</p>,
      circle: MockCircle,
      span: MockSpan,
    },
  };
});

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { priority, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...rest} alt={rest.alt as string} />;
  },
}));

jest.mock('@/lib/constants', () => ({
  ...jest.requireActual('@/lib/constants'),
  NETWORK: 'mainnet',
}));

describe('LandingPage on mainnet', () => {
  it('renders correctly on mainnet', () => {
    Storage.prototype.getItem = jest.fn(() => 'en');
    Storage.prototype.setItem = jest.fn();

    const { getByText } = render(<LandingPage />);
    expect(getByText(/without blind trust/i)).toBeInTheDocument();
  });
});
