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

  it('replaces values correctly in the translation string', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockT: any = {
      welcome_user: 'Welcome {user} to {app}'
    };
    
    jest.spyOn(LocaleContext, 'useLocale').mockReturnValue({
      locale: 'en',
      setLocale: jest.fn(),
      t: mockT as Dictionary
    });

    render(
      <span data-testid="translation-values">
        <ClientTranslation tKey={"welcome_user" as keyof Dictionary} values={{ user: 'Alice', app: 'Tandot' }} />
      </span>
    );
    expect(screen.getByTestId('translation-values').textContent).toBe('Welcome Alice to Tandot');
  });
});
