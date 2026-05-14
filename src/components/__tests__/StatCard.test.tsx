import React from 'react';
import { render, screen } from '@testing-library/react';
import { StatCard } from '../StatCard';

describe('StatCard', () => {
  it('renders default color when no color is provided', () => {
    const { container } = render(
      <StatCard label="Total" value="100" icon="🚀" />
    );
    expect(screen.getByText('Total')).toBeInTheDocument();
    
    // The default color var(--cyan-400) should be applied to the background glow
    const glowDiv = container.querySelector('.blur-3xl');
    expect(glowDiv).toHaveStyle({ backgroundColor: 'var(--cyan-400)' });
  });

  it('renders provided color and trend', () => {
    const { container } = render(
      <StatCard label="Active" value="50" icon="✨" color="#ff0000" trend="+5%" />
    );
    expect(screen.getByText('+5%')).toBeInTheDocument();
    
    const glowDiv = container.querySelector('.blur-3xl');
    expect(glowDiv).toHaveStyle({ backgroundColor: '#ff0000' });
  });

  it('renders suffix and subValue', () => {
    render(
      <StatCard label="Amount" value="200" icon="💰" suffix="MXN" subValue="Per Month" />
    );
    expect(screen.getByText('MXN')).toBeInTheDocument();
    expect(screen.getByText('Per Month')).toBeInTheDocument();
  });
});
