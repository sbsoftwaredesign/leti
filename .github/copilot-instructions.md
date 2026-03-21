# Leticia Cáceres — Application & CV Workspace

## Project Purpose

This workspace manages professional documents for **Leticia Cáceres**, an award-winning Australian director preparing applications for international film programmes (currently: TIFF Directors' Lab 2026) and maintaining her CV/filmography materials.

## Workspace Structure

```
sources/              — Original/reference materials (read-only)
  application-url.txt — Programme criteria & requirements
  md-conversions/     — Raw Word→Markdown conversions (historical)

drafts/               — Active working documents (edit these)
  directors-statement.md  — Director's Statement / Artist Statement
  logline-and-synopsis.md — Project logline & synopsis
  cv-filmography.md       — CV & filmography (markdown source)

output/               — Final deliverables (HTML/CSS → PDF via browser print)
  cv-v2.html + cv-v2-style.css       — Current CV & Filmography
  cv.html + cv-style.css             — Earlier CV version
  assessment.html + assessment-style.css — TIFF Application Assessment
  assessment.md                      — Assessment (markdown version)
  pdf/                               — Generated PDF exports
```

## Key Conventions

### Document Workflow
1. Edit content in `drafts/*.md`
2. Generate/update HTML in `output/`
3. Export PDF via browser Print → Save as PDF
4. Store PDFs in `output/pdf/`

### Styling
- **Design system**: Source Serif 4 (body/headings) + Inter (UI/meta) — warm palette
- **CSS tokens**: See `output/cv-v2-style.css` for the canonical design tokens (colours, spacing, fonts)
- All output HTML uses `@page` rules for A4 print with proper margins
- New output pages should reuse the same font imports and colour variables

### Writing Style for Leticia's Documents
- First person, professional but warm tone
- UK/Australian English spelling (e.g., "colour", "programme", "destigmatise")
- Film/show titles in *italics*
- Character names in **BOLD CAPS** (in synopses only)
- Theatre company names unabbreviated on first mention

### Application Context (TIFF Directors' Lab 2026)
- **Bean** is Leticia's **feature debut** — always position it as such
- Programme targets "creators embarking on their directorial debuts"
- Key differentiator: 20+ years of theatre + award-winning TV + two feature attachments
- Key themes: reproductive access, rural youth, coming-of-age, Australian road movie
- Consolidated PDF required: CV (1p) + Filmography (2p) + Artist Statement (2p) + Logline & Synopsis (1p)
- Word limits: Logline ≤50 words, Synopsis ≤250 words, Biography 150–300 words

### Important Facts
- **Agent**: Cameron's Management — Joel Pettersson
- **Website**: www.leticiacaceres.com
- **Awards**: Helpmann, Green Room, Sydney Theatre Awards (wins); AACTA, LOGIE, ADG (nominations)
- **Key credits**: *The Drover's Wife* (stage, Helpmann winner), *Erotic Stories* (SBS), *Bump* (Stan), *RFDS* S3
- **Project team**: Writer Claire Phillips, Producer Miriam Stein (Tama Films)
- **Funding**: Screen NSW development funding secured
