# Leticia Cáceres: Application & CV Workspace

## Project Purpose

This workspace manages professional documents for **Leticia Cáceres**, an award-winning Australian director preparing applications for international film programmes (currently: TIFF Directors' Lab 2026) and maintaining her CV/filmography materials.

---

## Workspace Structure

```
sources/                        : Original/reference materials (READ-ONLY)
  application-url.txt           : Programme criteria, deadlines & requirements
  md-conversions/               : Raw Word→Markdown conversions (historical reference)

drafts/                         : Active working documents (EDIT THESE)
  directors-statement.md        : Director's Statement / Artist Statement (max 2 pages)
  logline-and-synopsis.md       : Project logline (≤50 words) & synopsis (≤250 words)
  cv-filmography.md             : CV (1 page) & filmography (2 pages) markdown source

output/                         : Final deliverables (HTML/CSS → PDF via Chrome headless)
  cv-v2.html + cv-v2-style.css  : Current CV & Filmography (A4 print-ready)
  cv.html + cv-style.css        : Earlier CV version (legacy, kept for reference)
  assessment.html               : TIFF Application Assessment (A4 multi-file)
  assessment-style.css          : Assessment stylesheet (A4 print-optimised)
  assessment-standalone.html    : Assessment (self-contained, AAA-accessible, desktop layout)
  assessment.md                 : Assessment (markdown version)
  pdf/                          : Generated PDF exports (gitignored)
```

### File Purposes Quick-Reference

| File | Purpose | Editable? |
|------|---------|-----------|
| `drafts/*.md` | Source content (edit here first) | ✅ Primary |
| `output/*.html` | Generated HTML for PDF/sharing | ✅ Regenerate from drafts |
| `output/*-style.css` | Stylesheets for A4 print output | ✅ Design changes |
| `output/assessment-standalone.html` | Self-contained shareable HTML (CSS inlined) | ✅ But keep CSS in sync |
| `sources/*` | Reference materials | ❌ Read-only |

---

## Key Conventions

### Document Workflow
1. Edit content in `drafts/*.md`
2. Generate/update HTML in `output/`
3. Generate PDF via Chrome headless (see command below)
4. Store PDFs in `output/pdf/`

### Two Output Modes
- **A4 print** (`assessment.html` + `assessment-style.css`): optimised for `@page` A4 PDF generation
- **Desktop reading** (`assessment-standalone.html`): self-contained single file, AAA-accessible fonts (14pt body), 960px wide layout, all CSS inlined, for sharing directly with clients

When updating assessment content, **both files must be updated** to stay in sync.

### PDF Generation (Chrome Headless)
```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless \
  --disable-gpu \
  --no-pdf-header-footer \
  --print-to-pdf="output/pdf/FILENAME.pdf" \
  "file://$PWD/output/FILENAME.html"
```
- Uses the A4 `@page` rules and margins defined in each CSS file
- `--no-pdf-header-footer` suppresses Chrome's default URL/date headers
- PDFs are gitignored (regenerable from HTML)
- Only use A4 print versions (`assessment.html`, `cv-v2.html`) for PDF, not the standalone

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
<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
```

New output pages should reuse these tokens; see `output/cv-v2-style.css` for the full reference implementation.

---

## Writing Style for Leticia's Documents

### Tone & Voice
- First person, professional but warm tone
- Active voice; avoid passive constructions
- Film/show titles in *italics*
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
| # | Material | Format | Constraint |
|---|----------|--------|------------|
| 1 | Feature script | PDF | 80 to 120 pages, first draft minimum |
| 2a | Project logline & synopsis | Consolidated PDF | ≤50 words / ≤250 words |
| 2b | Artist statement / creative approach | Consolidated PDF | Max 2 pages |
| 2c | CV & filmography | Consolidated PDF | CV 1p + filmography 2p |
| 3 | Lookbook | PDF | Max 10 pages |
| 4 | Biography | Text (pasted) | 150 to 300 words |
| 4 | Headshot | JPEG | Uploaded to FilmFreeway |
| 5 | Pitch video | Online screener | Max 2 min, password: DLTIFF2026 |
| 6 | Work sample clip | Trailer upload | Max 5 min, English subs, password: DLTIFF2026 |
| 7 | Custom form | FilmFreeway | Clip description + other fields |

### Project: *Bean*
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
- Unique perspective: mature-age woman with real-world experience of the themes in *Bean*

---

## Important Facts
- **Agent**: Cameron's Management, Joel Pettersson (joel.pettersson@cameronsmanagement.com.au)
- **Website**: www.leticiacaceres.com
- **Education**: MFA Drama Direction (VCA/Melbourne), BA Drama Hons (QUT)
- **Awards won**: Helpmann, Green Room, Sydney Theatre Awards
- **Awards nominated**: AACTA, LOGIE, ADG
- **Key credits**: *The Drover's Wife* (stage, Helpmann winner), *Erotic Stories* (SBS), *Bump* (Stan), *RFDS* S3 (Seven)
- **Key positions held**: Associate Director at Melbourne Theatre Company (2012 to 2015), Artistic Director at Tantrum Theatre (2006 to 2008)
