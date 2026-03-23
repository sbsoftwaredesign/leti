export type Locale = "en" | "es";

export const LOCALES: Locale[] = ["en", "es"];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  es: "ES",
};

const translations: Record<string, Record<Locale, string>> = {
  documents: { en: "Documents", es: "Documentos" },
  home: { en: "Home", es: "Inicio" },
  downloads: { en: "Downloads", es: "Descargas" },
  skip_to_content: { en: "Skip to content", es: "Ir al contenido" },
  footer_rights: {
    en: "All rights reserved",
    es: "Todos los derechos reservados",
  },
  search_placeholder: { en: "Search documents…", es: "Buscar documentos…" },
  open_nav: { en: "Open navigation menu", es: "Abrir menú de navegación" },
  close_nav: { en: "Close navigation menu", es: "Cerrar menú de navegación" },
  category_cv: { en: "CV", es: "CV" },
  category_bio: { en: "Biography", es: "Biografía" },
  category_application: { en: "Application", es: "Solicitud" },
  category_pitch: { en: "Pitch", es: "Pitch" },
  category_assessment: { en: "Assessment", es: "Evaluación" },
  status_draft: { en: "Draft", es: "Borrador" },
  status_review: { en: "Review", es: "Revisión" },
  status_final: { en: "Final", es: "Final" },
  professional_documents: {
    en: "Professional documents and application materials for Leticia Cáceres.",
    es: "Documentos profesionales y materiales de solicitud para Leticia Cáceres.",
  },
  download_pdf: { en: "PDF", es: "PDF" },
  download_markdown: { en: "Markdown", es: "Markdown" },
  markdown_source: { en: "Markdown Source", es: "Fuente Markdown" },
};

export function t(key: string, locale: Locale = "en"): string {
  const entry = translations[key];
  if (!entry) return key;
  return entry[locale] ?? entry.en ?? key;
}

export function getLocaleDateFormat(locale: Locale): string {
  return locale === "es" ? "es-AR" : "en-AU";
}

/**
 * Derives the locale from a content collection slug.
 * Slugs for Spanish content start with "es/" (e.g. "es/biography").
 */
export function localeFromSlug(slug: string): Locale {
  return slug.startsWith("es/") ? "es" : "en";
}

/**
 * Strips the locale prefix from a slug.
 * "es/biography" → "biography", "biography" → "biography"
 */
export function stripLocalePrefix(slug: string): string {
  return slug.startsWith("es/") ? slug.slice(3) : slug;
}

/**
 * Build a project path for the given locale.
 */
export function projectPath(slug: string, locale: Locale): string {
  return locale === "es" ? `/es/projects/${slug}/` : `/projects/${slug}/`;
}
