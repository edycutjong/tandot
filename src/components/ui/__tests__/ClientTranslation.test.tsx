import React from 'react';
import { render, screen } from '@testing-library/react';
import { ClientTranslation } from '../ClientTranslation';
import * as LocaleContext from '@/lib/LocaleContext';
import { Dictionary } from '@/lib/i18n';

describe('ClientTranslation', () => {
  it('renders the correct translation for the given key', () => {
    // Mock the useLocale hook
    const mockT: Partial<Dictionary> = {
      nav_launch: 'Launch App'
    };
    
    jest.spyOn(LocaleContext, 'useLocale').mockReturnValue({
      locale: 'en',
      setLocale: jest.fn(),
      t: mockT as Dictionary
    });

    render(<span data-testid="translation"><ClientTranslation tKey="nav_launch" /></span>);
    expect(screen.getByTestId('translation').textContent).toBe('Launch App');
  });
});
