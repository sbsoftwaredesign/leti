# Progress Log

Reverse-chronological log of significant changes. Completed sessions are summarised; only the most recent session has full detail.

---

## 2026-03-27 · Session 5: Multi-project navigation + new content

### Navigation restructure

- **Rewrote** BurgerMenu and index pages to use hierarchical navigation via `buildNavSections()`
- **Added** `project` field to content schema, `PROJECT_ORDER` and `STANDALONE_CATEGORIES` to content-utils
- **Menu structure**: CV, Biography → Projects (TIFF sub-group, Carrar, Weight Limit) → AI Agent Instructions
- **Impact**: 34 pages (8 projects × 2 routes × 2 locales + 2 index)

### New content

- **Created** `carrar.md` (EN + ES): Señora Carrar's Rifles pitch for Belvoir, improved from draft
- **Created** `tiff-pitch.md` (EN + ES): Bean project pitch extracted from TIFF assessment recommendations
- **Added** `project` field to existing TIFF and Weight Limit content files

### AI context optimisation

- Cleaned up AI memory: removed Gardel Network references, updated repo state file
- Expanded `.copilotignore` to exclude all legacy/generated/binary files
- Updated `copilot-instructions.md` for current architecture

---

## Completed Sessions (Summary)

| Session | Date       | Key Changes                                                                                  |
| ------- | ---------- | -------------------------------------------------------------------------------------------- |
| 4       | 2026-03-26 | Agent system (@writer, @translator, @app), guide category, clip submission update            |
| 3       | 2026-03-22 | Deployment fixes (nginx root), WCAG AA fonts, assessment Parts 5 & 6 restored, AI guardrails |
| 2       | 2026-03-21 | Desktop sidebar, test coverage (51→72, 90% stmt), CI/CD fixes                                |
| 1       | 2026-03-20 | Initial Astro app build, 4 content docs, React islands, Pagefind, Woodpecker CI              |

---

## Content Inventory

| Document                | Category    | Project      | Status | H2 Sections |
| ----------------------- | ----------- | ------------ | ------ | ----------- |
| `biography.md`          | bio         | —            | final  | 0 (prose)   |
| `cv-filmography.md`     | cv          | —            | final  | Varies      |
| `tiff-assessment.md`    | assessment  | tiff         | final  | 6           |
| `tiff-questionnaire.md` | application | tiff         | final  | 7           |
| `tiff-pitch.md`         | pitch       | tiff         | draft  | 4           |
| `weight-limit.md`       | pitch       | weight-limit | final  | 6           |
| `carrar.md`             | pitch       | carrar       | draft  | 5           |
| `agent-instructions.md` | guide       | —            | final  | 6           |

All EN files have corresponding ES translations in `es/` subfolder.

---

## Known Issues

- [ ] biography.md line 17: false-positive lint warning ("Cortile Theater im Hof" is a German proper name)
- [ ] `weight-limit.pdf` not generated in last deploy (Chrome path issue on server)
- [ ] Legacy `output/` and `drafts/` folders could be archived or removed
