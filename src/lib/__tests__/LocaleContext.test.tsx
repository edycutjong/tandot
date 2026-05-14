import React from 'react';
import { render, screen } from '@testing-library/react';
import { LocaleProvider, useLocale } from '../LocaleContext';

describe('LocaleContext', () => {
  beforeEach(() => {
    // Clear document attributes before each test
    document.documentElement.lang = '';
    document.title = '';
    document.head.innerHTML = `
      <meta name="description" content="" />
      <meta property="og:title" content="" />
      <meta property="og:description" content="" />
      <meta name="twitter:title" content="" />
      <meta name="twitter:description" content="" />
      <meta property="og:locale" content="" />
    `;
  });

  it('throws an error if useLocale is used outside of LocaleProvider', () => {
    // Suppress console.error for the expected throw
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const TestComponent = () => {
      useLocale();
      return <div>Test</div>;
    };

    expect(() => render(<TestComponent />)).toThrow('useLocale must be used inside <LocaleProvider>');
    consoleSpy.mockRestore();
  });

  it('provides the locale, setLocale, and t to children', () => {
    const TestComponent = () => {
      const { locale, t } = useLocale();
      return (
        <div>
          <span data-testid="locale">{locale}</span>
          <span data-testid="t-nav-launch">{t.nav_launch}</span>
        </div>
      );
    };

    const setLocale = jest.fn();

    render(
      <LocaleProvider locale="en" setLocale={setLocale}>
        <TestComponent />
      </LocaleProvider>
    );

    expect(screen.getByTestId('locale').textContent).toBe('en');
    expect(screen.getByTestId('t-nav-launch').textContent).toBe('Launch App');
  });

  it('updates document.title and meta tags correctly for en', () => {
    const setLocale = jest.fn();

    render(
      <LocaleProvider locale="en" setLocale={setLocale}>
        <div />
      </LocaleProvider>
    );

    expect(document.documentElement.lang).toBe('en');
    expect(document.title).toBe('Tandot — Trustless Rotating Savings');
    
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toContain('Eliminate the risk');
    expect(document.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe('Tandot — Trustless Rotating Savings');
    expect(document.querySelector('meta[property="og:description"]')?.getAttribute('content')).toContain('Smart tandas');
    expect(document.querySelector('meta[name="twitter:title"]')?.getAttribute('content')).toBe('Tandot — Trustless Rotating Savings');
    expect(document.querySelector('meta[name="twitter:description"]')?.getAttribute('content')).toContain('Smart tandas');
    expect(document.querySelector('meta[property="og:locale"]')?.getAttribute('content')).toBe('en_US');
  });

  it('updates document.title and meta tags correctly for es', () => {
    const setLocale = jest.fn();

    render(
      <LocaleProvider locale="es" setLocale={setLocale}>
        <div />
      </LocaleProvider>
    );

    expect(document.documentElement.lang).toBe('es');
    expect(document.title).toBe('Tandot — Tandas sin confianza ciega');
    
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toContain('Elimina el riesgo');
    expect(document.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe('Tandot — Tandas sin confianza ciega');
    expect(document.querySelector('meta[property="og:description"]')?.getAttribute('content')).toContain('Tandas inteligentes');
    expect(document.querySelector('meta[name="twitter:title"]')?.getAttribute('content')).toBe('Tandot — Tandas sin confianza ciega');
    expect(document.querySelector('meta[name="twitter:description"]')?.getAttribute('content')).toContain('Tandas inteligentes');
    expect(document.querySelector('meta[property="og:locale"]')?.getAttribute('content')).toBe('es_MX');
  });

  it('handles missing meta tags gracefully', () => {
    // Remove all meta tags
    document.head.innerHTML = '';
    const setLocale = jest.fn();

    expect(() => {
      render(
        <LocaleProvider locale="en" setLocale={setLocale}>
          <div />
        </LocaleProvider>
      );
    }).not.toThrow();
  });
});
