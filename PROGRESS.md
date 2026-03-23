# Progress Log

Reverse-chronological log of work done on the Writer Factory project. Used for tracking progress and maintaining continuity across AI-assisted sessions.

---

## 2026-03-22 · Session 3: Deployment fixes, guardrails, documentation

### Deployment pipeline fix

- **Problem**: Site on miniweb-vm was not updating after pushes
- **Root cause**: Nginx `root` pointed to `/var/www/writer-factory` (project root) instead of `/var/www/writer-factory/dist` (Astro build output). A stale `index.html` from a previous SCP copy was being served instead of the freshly built one.
- **Fix**: Updated nginx config on server to `root /var/www/writer-factory/dist;`. Cleaned up stale files (`index.html`, `_astro/`, `pagefind/`, `exports/`) from project root.

### WCAG AA font sizes

- Audited all font sizes across `document.css` and `global.css`
- Bumped 4 sizes below AA thresholds:
  - Table headers: 0.75rem (12px) → 0.875rem (14px)
  - Contact line: 0.8125rem → 0.875rem
  - Badges: 0.6875rem (11px) → 0.75rem (12px)
  - Code viewer: 0.8125rem → 0.875rem

### Assessment content restoration

- **Problem**: `tiff-assessment.md` was missing Part 5 (Pitch Video Guidance) and Part 6 (Application Alignment Checklist)
- **Root cause**: Content was never added to the Astro source file when the project was initially set up. The complete content existed in `output/md/assessment.md` and `output/web/assessment.html` but was not fully transferred to `src/content/projects/tiff-assessment.md`.
- **Fix**: Added Parts 5 & 6 from the output sources. Assessment now has all 6 expected H2 sections.

### AI content integrity guardrails

- **Problem**: No safeguards existed to prevent content loss across AI conversation boundaries
- **Fixes applied**:
  1. Updated `copilot-instructions.md` from legacy pipeline docs to Astro content collection architecture
  2. Added "AI Agent Rules" section with content integrity requirements (read before edit, verify sections after edit)
  3. Added "Content Structure Registry" documenting expected H2 section counts per file
  4. Extended `writing-rules.instructions.md` scope to include `src/content/projects/**` (was only `drafts/` and `output/`)
  5. Added legacy `output/`, `drafts/md/`, `drafts/Web Format/` to `.copilotignore` to reduce context noise
  6. Added `pnpm exports` step to Woodpecker CI pipeline

### Deployment verification

- Pushed to both remotes, Woodpecker CI ran successfully
- Server confirmed: HTTP 200 on all pages, exports generated (4 markdown + 3 PDF files)

### Documentation

- Created `README.md` with full project summary
- Created this progress log

---

## 2026-03-21 · Session 2: Desktop sidebar, test coverage, CI fixes

### Desktop sidebar (always visible)

- Added CSS media query `@media (min-width: 1024px)` to show sidebar permanently on desktop
- Hid burger/close buttons and overlay on desktop via CSS classes
- Added `desktop-sidebar-offset` class for main content margin-left
- Modified `BurgerMenu.tsx` with `burger-toggle` and `sidebar-close` CSS classes
- Mobile-only body scroll lock

### Test coverage improvement

- **Starting point**: 51 tests, 51% statement coverage (scripts/ at 0% dragging it down)
- Excluded `scripts/**/*.ts` from coverage include in `vitest.config.ts`
- Added tests for:
  - MarkdownViewer: frontmatter, blockquotes, HR, list items, inline formatting, keyboard copy
  - SearchOverlay: backdrop click, no pagefind, clear results, Ctrl+K, Cmd+K toggle
  - BurgerMenu: Escape key, overlay click, category collapse, no currentSlug
  - ThemeToggle: double-click (dark→light branch)
  - Clipboard: execCommand throw, navigator undefined SSR guard
  - Theme: dark prefers-color-scheme with matchMedia mock
- **Final**: 72 tests, 90.26% statements, 85.71% branches, 96.42% functions, 91.3% lines

### CI/CD fixes

- Updated `.woodpecker.yml` to use `/var/www/writer-factory` instead of `/home/sebastian/writer-factory`
- Fixed nginx config to match new deploy path

---

## 2026-03-20 · Session 1: Initial Astro app build

### Astro writer factory app

- Built complete Astro SSG application from scratch
- Created content collection with 4 markdown documents (biography, cv-filmography, tiff-assessment, weight-limit)
- Implemented 3 route types: index, project detail (`/projects/:slug/`), print (`/print/:slug/`)
- Created 3 layouts: BaseLayout (app shell), ProjectLayout (document view), PrintLayout (PDF)
- Built 4 React island components:
  - BurgerMenu (portal-based slide-out navigation)
  - SearchOverlay (Pagefind full-text search)
  - ThemeToggle (dark/light with localStorage)
  - MarkdownViewer (syntax-highlighted expandable source)
- Implemented design system: Source Serif 4 + Inter fonts, warm colour palette, dark mode
- Created `document.css` (scoped serif styling), `print.css` (A4 @page rules), `global.css` (Tailwind theme)
- Set up Woodpecker CI pipeline for automated deployment
- Integrated Pagefind for post-build search indexing

### Legacy pipeline

- Prior to this session, documents were managed as standalone HTML files in `output/web/`
- The `generate-standalone.js` script converted print-ready HTML to self-contained files
- This pipeline is now superseded by Astro but files remain as reference

---

## Content Inventory

Current state of all source documents in `src/content/projects/`:

| Document             | Status | Sections             | Word Count (approx) | Notes                              |
| -------------------- | ------ | -------------------- | ------------------- | ---------------------------------- |
| `biography.md`       | final  | 0 H2s (prose)        | ~400                | Complete                           |
| `cv-filmography.md`  | final  | Varies               | ~2,500              | Complete                           |
| `tiff-assessment.md` | final  | 6 H2s (Parts 1 to 6) | ~5,000              | Restored Parts 5 & 6 on 2026-03-22 |
| `weight-limit.md`    | final  | 6 H2s                | ~1,200              | Complete                           |

---

## Known Issues & Future Work

- [ ] Page content centering needs adjustment with desktop sidebar offset
- [ ] Sidebar may flicker on initial desktop load (portal mount delay)
- [ ] Footer could be made fixed/sticky
- [ ] Document styles could better match the reference HTML files in `drafts/Web Format/`
- [ ] `weight-limit.pdf` not generated in last deploy (possibly Chrome path issue on server)
- [ ] Legacy `output/` and `drafts/` folders could be cleaned up or archived
