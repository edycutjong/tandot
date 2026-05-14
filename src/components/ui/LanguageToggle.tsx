'use client';

import { useLocale } from '@/lib/LocaleContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';

/**
 * Animated ES ↔ EN toggle button for the navbar.
 * Displays a globe icon with the target language label.
 */
export function LanguageToggle() {
  const { locale, setLocale, t } = useLocale();

  return (
    <button
      id="language-toggle"
      onClick={() => setLocale(locale === 'es' ? 'en' : 'es')}
      className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 backdrop-blur-sm text-sm font-mono font-medium text-[var(--text-mid)] hover:text-[var(--text-hi)] hover:border-[var(--cyan-500)]/40 transition-all duration-200 cursor-pointer"
      aria-label={`Switch to ${locale === 'es' ? 'English' : 'Spanish'}`}
    >
      <Globe className="w-3.5 h-3.5" />
      <AnimatePresence mode="wait">
        <motion.span
          key={locale}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.15 }}
          className="inline-block w-5 text-center"
        >
          {t.lang_toggle}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
