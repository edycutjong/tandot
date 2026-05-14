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
}));

import React from 'react';

// Helper to remove framer-motion specific props that cause React warnings
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

// Mock framer-motion to avoid animation issues in tests
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

// Mock next/image to avoid src warnings
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { priority, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...rest} alt={rest.alt as string} />;
  },
}));

describe('LandingPage', () => {
  it('renders correctly and respects local storage for locale', () => {
    // Set mock local storage
    Storage.prototype.getItem = jest.fn(() => 'en');
    Storage.prototype.setItem = jest.fn();

    const { getByText } = render(<LandingPage />);
    
    // We expect some english string to be rendered based on the mock or fallback
    expect(getByText(/without blind trust/i)).toBeInTheDocument();
    
    // Ensure get item was called
    expect(Storage.prototype.getItem).toHaveBeenCalledWith('tandot-locale');
  });

  it('updates locale correctly when toggled', async () => {
    const { getByText } = render(<LandingPage />);
    const { fireEvent } = await import('@testing-library/react');
    const enButton = getByText('EN');
    fireEvent.click(enButton);
    expect(Storage.prototype.setItem).toHaveBeenCalledWith('tandot-locale', 'es');
  });

  it('handles null locale from storage', () => {
    Storage.prototype.getItem = jest.fn(() => null);
    render(<LandingPage />);
    expect(Storage.prototype.getItem).toHaveBeenCalledWith('tandot-locale');
  });
});
