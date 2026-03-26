import {
    buildNavSections,
    type Category,
    PROJECT_ORDER,
    type ProjectMeta,
} from '@lib/content-utils';
import { type Locale, t } from '@lib/i18n';
import { ChevronDown, ChevronRight, FileText, FolderOpen, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

interface Props {
  projects: ProjectMeta[];
  currentSlug?: string;
  locale?: Locale;
}

export default function BurgerMenu({ projects, currentSlug, locale = 'en' }: Props) {
  const [open, setOpen] = useState(false);
  const defaultExpanded = new Set<string>([
    ...(['cv', 'bio', 'guide'] as Category[]),
    ...PROJECT_ORDER,
    'projects',
  ]);
  const [expanded, setExpanded] = useState<Set<string>>(defaultExpanded);
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

  function toggleSection(key: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const sections = buildNavSections(projects);
  const projectSections = sections.filter((s) => s.type === 'project');
  const standaloneSections = sections.filter((s) => s.type === 'standalone');
  const standaloneBeforeProjects = standaloneSections.filter(
    (s) => s.type === 'standalone' && s.category !== 'guide'
  );
  const guideSection = standaloneSections.find(
    (s) => s.type === 'standalone' && s.category === 'guide'
  );

  function renderLink(project: ProjectMeta, indent: string) {
    const href = locale === 'en' ? `/projects/${project.slug}/` : `/es/projects/${project.slug}/`;
    return (
      <li key={project.slug}>
        <a
          href={href}
          className={`flex items-center gap-2 ${indent} pr-4 py-1.5 text-sm hover:bg-[var(--color-bg-secondary)] transition-colors ${
            currentSlug === project.slug
              ? 'font-semibold text-[var(--color-accent)]'
              : 'text-[var(--color-text-secondary)]'
          }`}
        >
          <FileText size={14} className="shrink-0" />
          <span className="truncate">{project.title}</span>
        </a>
      </li>
    );
  }

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

              {/* Standalone categories before projects (CV, Biography) */}
              {standaloneBeforeProjects.map((section) => {
                if (section.type !== 'standalone') return null;
                return (
                  <div key={section.category}>
                    <button
                      onClick={() => toggleSection(section.category)}
                      className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                      aria-expanded={expanded.has(section.category)}
                    >
                      <span>{t(`category_${section.category}`, locale)}</span>
                      {expanded.has(section.category) ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronRight size={14} />
                      )}
                    </button>
                    {expanded.has(section.category) && (
                      <ul className="pb-1">
                        {section.items.map((project) => renderLink(project, 'pl-6'))}
                      </ul>
                    )}
                  </div>
                );
              })}

              {/* Projects parent group */}
              {projectSections.length > 0 && (
                <div>
                  <button
                    onClick={() => toggleSection('projects')}
                    className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                    aria-expanded={expanded.has('projects')}
                  >
                    <span>{t('projects', locale)}</span>
                    {expanded.has('projects') ? (
                      <ChevronDown size={14} />
                    ) : (
                      <ChevronRight size={14} />
                    )}
                  </button>

                  {expanded.has('projects') && projectSections.map((section) => {
                    if (section.type !== 'project') return null;
                    return (
                      <div key={section.projectKey} className="pl-2">
                        <button
                          onClick={() => toggleSection(section.projectKey)}
                          className="flex items-center justify-between w-full px-4 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                          aria-expanded={expanded.has(section.projectKey)}
                        >
                          <span className="flex items-center gap-1.5">
                            <FolderOpen size={13} className="shrink-0" />
                            {t(`project_${section.projectKey}`, locale)}
                          </span>
                          {expanded.has(section.projectKey) ? (
                            <ChevronDown size={12} />
                          ) : (
                            <ChevronRight size={12} />
                          )}
                        </button>
                        {expanded.has(section.projectKey) && (
                          <ul className="pb-1">
                            {section.items.map((project) => renderLink(project, 'pl-10'))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Guide at the end */}
              {guideSection && guideSection.type === 'standalone' && (
                <div>
                  <button
                    onClick={() => toggleSection('guide')}
                    className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                    aria-expanded={expanded.has('guide')}
                  >
                    <span>{t('category_guide', locale)}</span>
                    {expanded.has('guide') ? (
                      <ChevronDown size={14} />
                    ) : (
                      <ChevronRight size={14} />
                    )}
                  </button>
                  {expanded.has('guide') && (
                    <ul className="pb-1">
                      {guideSection.items.map((project) => renderLink(project, 'pl-6'))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </nav>
        </>,
        document.body,
      )}
    </>
  );
}
