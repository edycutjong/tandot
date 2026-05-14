'use client';

import { createContext, useContext, useMemo, useEffect, type ReactNode } from 'react';
import { type Locale, type Dictionary, dictionaries } from './i18n';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Dictionary;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  setLocale,
  children,
}: {
  locale: Locale;
  setLocale: (l: Locale) => void;
  children: ReactNode;
}) {
  const t = useMemo(() => dictionaries[locale], [locale]);

  useEffect(() => {
    // Update document title and HTML lang attribute dynamically when switching languages
    document.documentElement.lang = locale;
    document.title = `Tandot — ${t.dash_tagline}`;
    
    const longDescEs = 'AI-managed, fraud-proof rotating savings circles (tandas) on MXNB — the Mexican peso stablecoin on Arbitrum. Elimina el riesgo de las tandas tradicionales.';
    const longDescEn = 'AI-managed, fraud-proof rotating savings circles (tandas) on MXNB — the Mexican peso stablecoin on Arbitrum. Eliminate the risk of traditional tandas.';

    const shortDescEs = 'Tandas inteligentes protegidas por IA y contratos inteligentes en Arbitrum.';
    const shortDescEn = 'Smart tandas protected by AI and smart contracts on Arbitrum.';

    // Update main meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', locale === 'es' ? longDescEs : longDescEn);
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', `Tandot — ${t.dash_tagline}`);
    
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', locale === 'es' ? shortDescEs : shortDescEn);

    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', `Tandot — ${t.dash_tagline}`);
    
    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc) twitterDesc.setAttribute('content', locale === 'es' ? shortDescEs : shortDescEn);

    // Update Open Graph locale
    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) ogLocale.setAttribute('content', locale === 'es' ? 'es_MX' : 'en_US');

  }, [locale, t]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used inside <LocaleProvider>');
  return ctx;
}
