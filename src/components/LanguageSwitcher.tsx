import { type Locale, LOCALE_LABELS, projectPath } from '@lib/i18n';
import { Globe } from 'lucide-react';

interface Props {
  locale: Locale;
  currentSlug?: string;
}

export default function LanguageSwitcher({ locale, currentSlug }: Props) {
  const otherLocale: Locale = locale === 'en' ? 'es' : 'en';

  let otherHref: string;
  if (currentSlug) {
    otherHref = projectPath(currentSlug, otherLocale);
  } else {
    otherHref = otherLocale === 'es' ? '/es/' : '/';
  }

  return (
    <a
      href={otherHref}
      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors"
      aria-label={`Switch to ${otherLocale === 'es' ? 'Spanish' : 'English'}`}
      title={otherLocale === 'es' ? 'Español' : 'English'}
    >
      <Globe size={16} />
      <span>{LOCALE_LABELS[otherLocale]}</span>
    </a>
  );
}
