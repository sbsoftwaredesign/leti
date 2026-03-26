# Leticia Cáceres: Application & CV Workspace

## Project Purpose

This workspace manages professional documents for **Leticia Cáceres**, an award-winning Australian director preparing applications for international film programmes (currently: TIFF Directors' Lab 2026) and maintaining her CV/filmography materials.

---

## Workspace Structure

This project is an **Astro SSG web application** (Writer Factory) that renders professional documents from markdown content collections.

```
src/
  content/projects/               : ⭐ SOURCE OF TRUTH — edit content here
    biography.md                  : Biography (category: bio)
    cv-filmography.md             : CV & Filmography (category: cv)
    tiff-assessment.md            : TIFF Application Assessment (category: assessment)
    tiff-questionnaire.md         : TIFF Questionnaire responses (category: application)
    weight-limit.md               : Weight Limit pitch (category: pitch)
    agent-instructions.md         : AI Agent Instructions (category: guide)
  content.config.ts               : Content collection schema (Zod validation)
  pages/
    index.astro                   : Home page (document listing)
    projects/[slug].astro         : Project detail pages
    print/[slug].astro            : Print-optimised pages (for PDF generation)
  layouts/                        : BaseLayout, ProjectLayout, PrintLayout
  components/                     : React islands (BurgerMenu, SearchOverlay, ThemeToggle, MarkdownViewer)
  styles/
    global.css                    : Tailwind @theme tokens + component styles
    document.css                  : Scoped .document-content styles (warm serif design)
    print.css                     : A4 PDF stylesheet (@page rules)
  lib/
    content-utils.ts              : Category labels, badge classes, helpers

scripts/
  generate-exports.ts             : Generates public/exports/ (markdown + PDF) from content collection
  generate-standalone.js          : Legacy: generates standalone HTML from output/web/ (not part of main pipeline)
  lint-content.ts                 : Validates AU/UK spelling, no-dash rules

public/exports/                   : 🔄 Generated downloadable files (markdown + PDF)

drafts/                           : Reference drafts and legacy working documents
output/                           : Legacy output (superseded by Astro pipeline)
sources/                          : Original reference materials (READ-ONLY)
```

### File Purposes Quick-Reference

| File                        | Purpose                                    | Editable?                         |
| --------------------------- | ------------------------------------------ | --------------------------------- |
| `src/content/projects/*.md` | Source of truth content (edit here)        | ✅ Primary                        |
| `src/styles/*.css`          | Application and document styling           | ✅ Design changes                 |
| `src/layouts/*.astro`       | Page layouts                               | ✅ Structure changes              |
| `src/components/*.tsx`      | React interactive components               | ✅ Behaviour changes              |
| `public/exports/*`          | Downloadable exports                       | 🔄 Regenerated via `pnpm exports` |
| `output/*`                  | Legacy output (not part of Astro pipeline) | ⚠️ Reference only                 |
| `drafts/*`                  | Reference drafts                           | ⚠️ Reference only                 |
| `sources/*`                 | Original reference materials               | ❌ Read-only                      |

---

## Key Conventions

### Document Workflow

1. Edit content in `src/content/projects/*.md` (source of truth)
2. Run `pnpm build` to generate static site in `dist/`
3. Run `pnpm exports` to generate downloadable markdown + PDF in `public/exports/`
4. CI/CD (Woodpecker) handles deployment to miniweb-vm on push to main

### Content Collection Schema

Each `.md` file in `src/content/projects/` requires YAML frontmatter:

```yaml
---
title: "Document Title"
subtitle: "Optional subtitle"
date: "2026-03-01"
category: "application" | "pitch" | "cv" | "bio" | "assessment" | "guide"
status: "draft" | "review" | "final"
order: 1
description: "Brief description for card listing."
---
```

### Routes

| Route              | Purpose                                               |
| ------------------ | ----------------------------------------------------- |
| `/`                | Document listing (grouped by category)                |
| `/projects/:slug/` | Full document view (with markdown viewer + downloads) |
| `/print/:slug/`    | Print-optimised view (for PDF generation)             |

### PDF Generation (Chrome Headless)

```bash
# After pnpm build:
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless \
  --disable-gpu \
  --no-pdf-header-footer \
  --print-to-pdf="public/exports/SLUG.pdf" \
  "file://$PWD/dist/print/SLUG/index.html"
```

- Uses the A4 `@page` rules and margins defined in `output/web/styles.css`
- `--no-pdf-header-footer` suppresses Chrome's default URL/date headers
- PDFs are gitignored (regenerable from HTML)
- Only use A4 print versions (`output/web/<name>.html`), never standalone versions, for PDF

### Styling

**Design system**: Source Serif 4 (body/headings) + Inter (UI/meta), warm palette

**CSS colour tokens** (canonical; use these everywhere):
| Token | Value | Usage |
|-------|-------|-------|
| `--text-primary` | `#2c2416` | Body text, headings |
| `--text-secondary` | `#5c4f3a` | Supporting text |
| `--text-muted` | `#8a7d6b` | Meta, captions |
| `--accent` | `#8b5e3c` | Links, decorative accents |
| `--accent-green` | `#4a7c59` | Strengths, recommendations |
| `--accent-amber` | `#b5872a` | Issues, warnings, deadlines |
| `--accent-red` | `#a3403a` | Missing/critical items |
| `--border` | `#e0d5c4` | Light borders |
| `--bg-body` | `#fdfbf7` | Page background |
| `--bg-callout` | `#f7f3ec` | Callout boxes |

**Font imports** (Google Fonts):

```html
<link
  href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&family=Inter:wght@300;400;500;600&display=swap"
  rel="stylesheet"
/>
```

New output pages should reuse these tokens; see `output/cv-v2-style.css` for the full reference implementation.

---

## Writing Style for Leticia's Documents

### Tone & Voice

- First person, professional but warm tone
- Active voice; avoid passive constructions
- Film/show titles in _italics_
- Character names in **BOLD CAPS** (in synopses only)
- Theatre company names unabbreviated on first mention
- Avoid jargon; prefer concrete, specific language over abstract claims
- When describing Leticia's strengths, show don't tell, reference specific credits and outcomes

### Spelling & Language (AU/UK English)

**⚠️ PRE-ACTION RULE:** AU/UK English and no-dash rules must be applied **before and during writing**, not as post-production fixes. Write correctly from the first draft. Never use American spellings intending to fix them later.

All content must use Australian/UK English throughout. Never use American spellings.

Common examples:

- colour (not color), favour (not favor), honour (not honor), behaviour (not behavior)
- programme (not program, except for computer programs), catalogue (not catalog)
- organise, recognise, destigmatise, emphasise (not -ize endings)
- centre (not center), theatre (not theater), metre (not meter)
- defence (not defense), offence (not offense), licence (noun; license is the verb)
- labour (not labor), endeavour (not endeavor)
- judgement (not judgment), acknowledgement (not acknowledgment)
- practise (verb), practice (noun)
- fulfil (not fulfill), enrol (not enroll), instil (not instill)
- travelling, cancelled, modelling (doubled L before suffix)
- whilst, amongst (acceptable alongside while, among)

### Punctuation Rules

**Never use em dashes (—) or en dashes (–) in prose.** Use commas, semicolons, colons, parentheses, or full stops instead.

Replacement patterns:
| Instead of | Use |
|------------|-----|
| Parenthetical clause with em dashes | Commas or parentheses |
| List or explanation after em dash | Colon |
| Date/number ranges with en dashes (2012–2015) | "to" (2012 to 2015) |
| Attribution or aside after em dash | Comma, semicolon, or full stop |
| Contrast or pivot after em dash | Semicolon or full stop. Start a new sentence |

Exceptions:

- Hyphens in compound adjectives are fine: "coming-of-age", "award-winning", "beat-up"
- Hyphens in prefixed words are fine: "co-producer", "first-hand"

### Professional Application Writing

- Lead with the strongest credential or most relevant qualification
- Quantify achievements: years of experience, number of productions, specific awards
- Every paragraph must earn its place; cut filler and redundancy
- Mirror the programme's own language and priorities (e.g., "feature debut", "market readiness")
- Respect word and page limits strictly; verify counts before finalising
- One idea per paragraph; avoid thematic overlap between sections
- End sections with forward momentum, not summaries

---

## Application Context (TIFF Directors' Lab 2026)

### Programme Facts

- **Deadline**: Early bird 23 March 2026 ($46.75 CAD) / Regular 13 April 2026 ($55 CAD)
- **Programme dates**: September 9 to 13, 2026 in Toronto
- **Selects**: 20 directors (Canadian + international) from hundreds of applications
- **Focus**: creators embarking on their directorial debuts
- **Platform**: FilmFreeway, project named "LETICIA CACERES – TIFF DIRECTORS' LAB – 2026"

### Submission Materials Checklist

| #   | Material                             | Format           | Constraint                                    |
| --- | ------------------------------------ | ---------------- | --------------------------------------------- |
| 1   | Feature script                       | PDF              | 80 to 120 pages, first draft minimum          |
| 2a  | Project logline & synopsis           | Consolidated PDF | ≤50 words / ≤250 words                        |
| 2b  | Artist statement / creative approach | Consolidated PDF | Max 2 pages                                   |
| 2c  | CV & filmography                     | Consolidated PDF | CV 1p + filmography 2p                        |
| 3   | Lookbook                             | PDF              | Max 10 pages                                  |
| 4   | Biography                            | Text (pasted)    | 150 to 300 words                              |
| 4   | Headshot                             | JPEG             | Uploaded to FilmFreeway                       |
| 5   | Pitch video                          | Online screener  | Max 2 min, password: DLTIFF2026               |
| 6   | Work sample clip                     | Trailer upload   | Max 5 min, English subs, password: DLTIFF2026 |
| 7   | Custom form                          | FilmFreeway      | Clip description + other fields               |

### Project: _Bean_

- **Genre**: Coming-of-age road movie / drama
- **Setting**: Rural Australia
- **Themes**: reproductive access, rural youth, bodily autonomy, female friendship
- **Position**: Leticia's **feature debut** (always frame it this way)
- **Writer**: Claire Phillips
- **Producer**: Miriam Stein (Tama Films)
- **Funding**: Screen NSW development funding secured

### Leticia's Key Differentiators

- 20+ years directing theatre (30+ professional productions) → deep actor collaboration skills
- Award-winning TV across drama, comedy, children's (Stan, SBS, Seven, ABC, Nickelodeon, BBC)
- Two previous feature attachments (positions her as experienced but still a debut feature director)
- Unique perspective: mature-age woman with real-world experience of the themes in _Bean_

---

## Important Facts

- **Agent**: Cameron's Management, Joel Pettersson (joel.pettersson@cameronsmanagement.com.au)
- **Website**: www.leticiacaceres.com
- **Education**: MFA Drama Direction (VCA/Melbourne), BA Drama Hons (QUT)
- **Awards won**: Helpmann, Green Room, Sydney Theatre Awards
- **Awards nominated**: AACTA, LOGIE, ADG
- **Key credits**: _The Drover's Wife_ (stage, Helpmann winner), _Erotic Stories_ (SBS), _Bump_ (Stan), _RFDS_ S3 (Seven)
- **Key positions held**: Associate Director at Melbourne Theatre Company (2012 to 2015), Artistic Director at Tantrum Theatre (2006 to 2008)

---

## AI Agent Rules

### Content Integrity

- **Source of truth is `src/content/projects/*.md`** — never edit `output/`, `drafts/md/`, or `public/exports/` directly (these are generated or legacy)
- Before editing any content file, **read the full file first** to understand its complete structure
- After editing a content file, verify the edit preserved all existing sections (count headings before and after)
- Never assume content is complete from a summary; always read the actual file

### Content Structure Registry

These are the expected section counts for each content file. If a file has fewer sections after editing, something was lost.

| File                    | Expected H2 sections                                                         |
| ----------------------- | ---------------------------------------------------------------------------- |
| `tiff-assessment.md`    | 6 (Exec Summary, Parts 1 to 6)                                               |
| `cv-filmography.md`     | Varies (CV + Filmography sections)                                           |
| `biography.md`          | 0 (flowing prose, no H2s)                                                    |
| `weight-limit.md`       | 6 (Logline, Synopsis, Director's Vision, Specifications, Key Cast, Key Crew) |
| `tiff-questionnaire.md` | 7 (form fields + creative responses)                                         |
| `agent-instructions.md` | 6 (@writer, @translator, @app agents + Document Workflow)                    |

### Build Verification

- Always run `pnpm build` after content changes to verify rendering
- Always run `pnpm test:run` before committing
- Check that page count in build output matches expected number of content files (currently 6 projects × 2 routes × 2 locales + 2 index = 26 pages)

### Agent System

Three custom VS Code agents are defined in `.github/agents/`:

| Agent       | File                  | Purpose                                   |
| ----------- | --------------------- | ----------------------------------------- |
| @writer     | `writer.agent.md`     | Improve and create professional documents |
| @translator | `translator.agent.md` | Translate to Argentinean Spanish          |
| @app        | `app.agent.md`        | Build, test, deploy, and maintain the app |

Workflow: @writer edits content → @translator creates ES versions → @app builds, tests, and deploys.
