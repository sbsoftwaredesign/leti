# Writer Factory

A static web application for managing, viewing, and exporting professional documents. Built with Astro, React, and Tailwind CSS.

Currently used to prepare application materials for **Leticia Cáceres** (TIFF Directors' Lab 2026) and maintain her CV/filmography.

## How It Works

Markdown files in `src/content/projects/` are the single source of truth. Astro renders them into a browsable website with three route types:

| Route | Purpose |
|-------|---------|
| `/` | Document listing grouped by category |
| `/projects/:slug/` | Full document view with markdown source viewer and downloads |
| `/print/:slug/` | Print-optimised A4 layout for PDF generation |

On every push to `main`, Woodpecker CI deploys to the server, builds the site, generates downloadable exports (markdown + PDF via Chrome headless), and runs the test suite.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Astro 6 (static output) |
| UI Islands | React 19 (`client:load`, `client:idle`) |
| Styling | Tailwind CSS 4 + custom CSS (document.css, print.css) |
| Fonts | Source Serif 4 (body/headings), Inter (UI/meta) |
| Search | Pagefind (post-build indexing) |
| Testing | Vitest 4 + Testing Library + happy-dom |
| CI/CD | Woodpecker CI (Gitea) |
| Server | Nginx on miniweb-vm (192.168.50.21:8085) |
| PDF | Chrome headless with `@page` A4 rules |

## Content Structure

Each document is a markdown file with YAML frontmatter:

```yaml
---
title: "Document Title"
subtitle: "Optional subtitle"
date: "2026-03-01"
category: "application" | "pitch" | "cv" | "bio" | "assessment"
status: "draft" | "review" | "final"
order: 1
description: "Brief description for the card listing."
---
```

Current documents:

| File | Category | Description |
|------|----------|-------------|
| `biography.md` | bio | Professional biography (150 to 300 words) |
| `cv-filmography.md` | cv | CV (1 page) + filmography (2 pages) |
| `tiff-assessment.md` | assessment | TIFF application assessment with 6 parts |
| `weight-limit.md` | pitch | Short film pitch document |

## Commands

```bash
pnpm dev              # Dev server with HMR
pnpm build            # Build static site + Pagefind index
pnpm exports          # Generate markdown + PDF exports to public/exports/
pnpm test:run         # Run 72 tests (single run)
pnpm test:coverage    # Tests with coverage report (85%+ branches)
pnpm lint:content     # Validate AU/UK spelling and no-dash rules
pnpm preview          # Preview built site locally
```

## Project Structure

```
src/
  content/projects/         Source of truth markdown files
  content.config.ts         Content collection schema (Zod)
  pages/
    index.astro             Home page (document listing)
    projects/[slug].astro   Document detail pages
    print/[slug].astro      Print-optimised pages (PDF source)
  layouts/                  BaseLayout, ProjectLayout, PrintLayout
  components/               React islands + Astro components
  styles/
    global.css              Tailwind @theme tokens + app styles
    document.css            Scoped .document-content serif styles
    print.css               A4 PDF stylesheet (@page rules)
  lib/
    content-utils.ts        Category labels, badges, helpers

scripts/
  generate-exports.ts       Strips frontmatter, generates PDF via Chrome
  lint-content.ts           AU/UK spelling + dash rule validator
  generate-standalone.js    Legacy standalone HTML generator

public/exports/             Generated downloadable files (markdown + PDF)
drafts/                     Reference drafts (not part of build)
output/                     Legacy output (superseded by Astro)
sources/                    Original reference materials (read-only)
```

## Design System

Warm serif design with a neutral, professional palette:

- **Body/headings**: Source Serif 4 Variable
- **UI/meta**: Inter Variable
- **Accent**: `#8b5e3c` (warm brown)
- **Body background**: `#fdfbf7` (warm white)
- **Dark mode**: Full support via localStorage toggle

Font sizes meet WCAG AA standards (minimum 12px for decorative, 14px for content).

## Deployment Pipeline

```
git push to main (Gitea)
  → Woodpecker CI triggers
  → SSH: clean old src/ and public/ on server
  → SCP: copy project files to /var/www/writer-factory
  → SSH: pnpm install → pnpm build → pnpm exports → pnpm test:run
  → Nginx serves dist/ on port 8085
```

## Interactive Features

- **Sidebar navigation**: Always visible on desktop (1024px+), slide-out drawer on mobile
- **Full-text search**: Pagefind-powered overlay (Cmd/Ctrl+K)
- **Dark/light mode**: Toggle with localStorage persistence
- **Markdown viewer**: Expandable syntax-highlighted source view per document
- **Download bar**: Direct links to markdown and PDF exports

## Writing Rules

All content follows strict AU/UK English spelling and punctuation rules:
- No em dashes or en dashes in prose (use commas, semicolons, colons)
- Australian/UK spellings throughout (colour, programme, organise, centre)
- Active voice, first person, professional but warm tone
- Enforced by `pnpm lint:content` and documented in `.github/instructions/writing-rules.instructions.md`

## Remotes

| Remote | URL | Purpose |
|--------|-----|---------|
| origin | github.com:sbsoftwaredesign/leti.git | GitHub mirror |
| gitea | ssh://git@192.168.10.110:2222/sebastian/leti.git | Primary (triggers CI) |
