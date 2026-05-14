'use client';

import { useLocale } from '@/lib/LocaleContext';
import type { Dictionary } from '@/lib/i18n';

export function ClientTranslation({ tKey }: { tKey: keyof Dictionary }) {
  const { t } = useLocale();
  return <>{t[tKey]}</>;
}
