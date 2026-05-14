'use client';

import { useLocale } from '@/lib/LocaleContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';

/**
 * Animated ES ↔ EN toggle button for the navbar.
 * Displays a globe icon with the target language label.
 */
export function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex items-center gap-2 bg-(--bg-elevated)/40 backdrop-blur-sm p-1 rounded-full border border-(--border-subtle)">
      <Globe className="w-4 h-4 text-(--text-muted) ml-2" />
      <button
        id="language-toggle"
        onClick={() => setLocale(locale === 'es' ? 'en' : 'es')}
        className="relative flex items-center p-0.5 rounded-full cursor-pointer transition-all"
        aria-label={`Switch to ${locale === 'es' ? 'English' : 'Spanish'}`}
      >
        <div className="relative flex items-center">
          {/* Sliding background for active state */}
          <motion.div
            layout
            className="absolute inset-y-0 w-8 bg-(--cyan-500)/20 border border-(--cyan-500)/40 rounded-full"
            initial={false}
            animate={{ x: locale === 'es' ? 0 : 32 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
          
          <span
            className={`relative z-10 w-8 text-center text-xs font-mono font-bold py-1 transition-colors ${
              locale === 'es' ? 'text-(--cyan-400)' : 'text-(--text-muted)'
            }`}
          >
            ES
          </span>
          <span
            className={`relative z-10 w-8 text-center text-xs font-mono font-bold py-1 transition-colors ${
              locale === 'en' ? 'text-(--cyan-400)' : 'text-(--text-muted)'
            }`}
          >
            EN
          </span>
        </div>
      </button>
    </div>
  );
}
