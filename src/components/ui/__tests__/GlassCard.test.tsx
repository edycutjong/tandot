import React from 'react';
import { render, screen } from '@testing-library/react';
import { GlassCard } from '../GlassCard';

describe('GlassCard', () => {
  it('renders children and applies the base glass-card class along with custom classes', () => {
    render(<GlassCard className="custom-class" data-testid="glass-card">Content</GlassCard>);
    const card = screen.getByTestId('glass-card');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('glass-card');
    expect(card).toHaveClass('custom-class');
    expect(card.textContent).toBe('Content');
  });

  it('renders with default empty className', () => {
    render(<GlassCard data-testid="glass-card-default">Default Content</GlassCard>);
    const card = screen.getByTestId('glass-card-default');
    expect(card).toHaveClass('glass-card');
    expect(card).not.toHaveClass('custom-class');
  });
});
