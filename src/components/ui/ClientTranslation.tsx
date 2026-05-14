'use client';

import { useLocale } from '@/lib/LocaleContext';
import type { Dictionary } from '@/lib/i18n';

export function ClientTranslation({ tKey, values }: { tKey: keyof Dictionary, values?: Record<string, string | number> }) {
  const { t } = useLocale();
  let text = t[tKey] as string;
  
  if (values) {
    Object.entries(values).forEach(([key, value]) => {
      text = text.replace(`{${key}}`, String(value));
    });
  }
  
  return <>{text}</>;
}
