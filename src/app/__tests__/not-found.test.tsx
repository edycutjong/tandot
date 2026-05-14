import React from 'react';
import { render, screen } from '@testing-library/react';
import NotFound from '../not-found';

describe('NotFound Page', () => {
  it('renders 404 heading and back link', () => {
    render(<NotFound />);
    
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found / Página No Encontrada')).toBeInTheDocument();
    
    const link = screen.getByRole('link', { name: /Back to Dashboard/i });
    expect(link).toHaveAttribute('href', '/');
    
    const logoLink = screen.getByRole('link', { name: /Tandot logo/i });
    expect(logoLink).toHaveAttribute('href', '/');
  });
});
