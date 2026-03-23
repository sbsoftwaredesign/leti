import {
    type Category,
    CATEGORY_ORDER,
    groupByCategory,
    type ProjectMeta,
} from '@lib/content-utils';
import { type Locale, t } from '@lib/i18n';
import { ChevronDown, ChevronRight, FileText, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

interface Props {
  projects: ProjectMeta[];
  currentSlug?: string;
  locale?: Locale;
}

export default function BurgerMenu({ projects, currentSlug, locale = 'en' }: Props) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<Set<Category>>(new Set(CATEGORY_ORDER));
  const [mounted, setMounted] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Close on Escape
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) setOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  // Lock body scroll when sidebar overlay is open (mobile only)
  useEffect(() => {
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (open && !isDesktop) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  function toggleCategory(cat: Category) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  const grouped = groupByCategory(projects);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        className="burger-toggle p-2 rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors"
      >
        <Menu size={20} />
      </button>

      {mounted && ReactDOM.createPortal(
        <>
          {open && (
            <div
              className="overlay-backdrop"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
          )}

          <nav
            ref={sidebarRef}
            className={`burger-sidebar ${open ? 'open' : ''}`}
            aria-label="Document navigation"
            role="navigation"
          >
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
              <span className="font-semibold text-sm">{t('documents', locale)}</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close navigation menu"
                className="sidebar-close p-1 rounded hover:bg-[var(--color-bg-secondary)] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-2">
              <a
                href={locale === 'en' ? '/' : '/es/'}
                className={`flex items-center gap-2 px-4 py-2 text-sm hover:bg-[var(--color-bg-secondary)] transition-colors ${
                  !currentSlug ? 'font-semibold text-[var(--color-accent)]' : ''
                }`}
              >
                {t('home', locale)}
              </a>

              {Array.from(grouped.entries()).map(([category, items]) => (
                <div key={category}>
                  <button
                    onClick={() => toggleCategory(category)}
                    className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                    aria-expanded={expanded.has(category)}
                  >
                    <span>{t(`category_${category}`, locale)}</span>
                    {expanded.has(category) ? (
                      <ChevronDown size={14} />
                    ) : (
                      <ChevronRight size={14} />
                    )}
                  </button>

                  {expanded.has(category) && (
                    <ul className="pb-1">
                      {items.map((project) => (
                        <li key={project.slug}>
                          <a
                            href={locale === 'en' ? `/projects/${project.slug}/` : `/es/projects/${project.slug}/`}
                            className={`flex items-center gap-2 pl-6 pr-4 py-1.5 text-sm hover:bg-[var(--color-bg-secondary)] transition-colors ${
                              currentSlug === project.slug
                                ? 'font-semibold text-[var(--color-accent)]'
                                : 'text-[var(--color-text-secondary)]'
                            }`}
                          >
                            <FileText size={14} className="shrink-0" />
                            <span className="truncate">{project.title}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </nav>
        </>,
        document.body,
      )}
    </>
  );
}
