import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageToggle } from '../LanguageToggle';
import * as LocaleContext from '@/lib/LocaleContext';
import { Dictionary } from '@/lib/i18n';

describe('LanguageToggle', () => {
  it('toggles language on click from es to en', () => {
    const setLocaleMock = jest.fn();
    jest.spyOn(LocaleContext, 'useLocale').mockReturnValue({
      locale: 'es',
      setLocale: setLocaleMock,
      t: {} as Dictionary
    });

    render(<LanguageToggle />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(setLocaleMock).toHaveBeenCalledWith('en');
  });

  it('toggles language on click from en to es', () => {
    const setLocaleMock = jest.fn();
    jest.spyOn(LocaleContext, 'useLocale').mockReturnValue({
      locale: 'en',
      setLocale: setLocaleMock,
      t: {} as Dictionary
    });

    render(<LanguageToggle />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(setLocaleMock).toHaveBeenCalledWith('es');
  });
});
