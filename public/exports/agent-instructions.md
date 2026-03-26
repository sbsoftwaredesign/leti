# AI Agent Instructions

_Workflow agents for document management_

This project uses three specialised AI agents to manage professional documents for Leticia Cáceres. Each agent has a defined role, set of rules, and workflow.

## @writer Agent

The Writer agent improves and creates professional documents. It operates on source files in `src/content/projects/` and follows strict AU/UK English conventions.

### Responsibilities

- Improve existing documents and draft new content
- Revise application answers for programme submissions
- Verify word and page counts against stated limits
- Apply the quality checklist before finalising any document

### Writing Rules

All content must use Australian/UK English: colour, programme, organise, centre, defence, travelling. Never use American spellings.

Never use em dashes or en dashes in prose. Use commas, semicolons, colons, parentheses, or full stops. Date ranges use "to" (e.g., "2012 to 2015").

### Tone

First person, professional but warm. Active voice. Film titles in italics. Show, don't tell: reference specific credits and outcomes. Quantify achievements.

### Quality Checklist

Before finalising any document, the Writer verifies:

1. No em dashes or en dashes in prose
2. All spellings are AU/UK English
3. Word and page counts are within limits
4. Active voice throughout
5. Film titles in italics
6. No thematic redundancy between sections

## @translator Agent

The Translator agent maintains Argentinean Spanish (es-AR) versions of all documents.

### Responsibilities

- Translate new or updated content to Argentinean Spanish
- Maintain translation parity between English and Spanish versions
- Preserve markdown formatting, frontmatter structure, and layout
- Ensure cultural accuracy with Argentinean conventions

### Translation Rules

- Film titles: keep original English titles in italics
- Award names: keep in English (Helpmann, AACTA, LOGIE)
- Company and programme names: keep in English
- Character names in synopses: keep in bold caps in English
- The no-dash rule applies equally to Spanish content
- Spanish files must include `locale: "es"` in frontmatter

## @app Agent

The App agent maintains the web application, handles builds, testing, security, and deployment.

### Responsibilities

- Build the site (`pnpm build`) and generate exports (`pnpm exports`)
- Run tests (`pnpm test:run`) and ensure all pass before committing
- Audit dependencies (`pnpm audit`) and fix all vulnerabilities
- Push to both GitHub and Gitea remotes
- Update the progress log (PROGRESS.md) after significant changes
- Keep AI instructions current when architecture changes

### Pre-Commit Checklist

1. Build succeeds with expected page count
2. All tests pass
3. Zero audit vulnerabilities
4. Exports generated successfully
5. Pushed to both `origin` (GitHub) and `gitea` (Woodpecker CI)

### Git Remotes

| Remote | Purpose                                        |
| ------ | ---------------------------------------------- |
| origin | GitHub repository                              |
| gitea  | Gitea server with Woodpecker CI for deployment |

### Key Commands

| Command           | Purpose                           |
| ----------------- | --------------------------------- |
| pnpm dev          | Development server                |
| pnpm build        | Build static site                 |
| pnpm exports      | Generate markdown and PDF exports |
| pnpm test:run     | Run all tests                     |
| pnpm audit        | Check for vulnerabilities         |
| pnpm lint:content | Validate spelling and punctuation |

## Document Workflow

The standard workflow for document updates:

1. **@writer** improves or creates content in `src/content/projects/*.md`
2. **@translator** translates to `src/content/projects/es/*.md`
3. **@app** builds, tests, generates exports, and pushes to both remotes

All three agents follow the writing rules defined in `.github/instructions/writing-rules.instructions.md` and the project conventions in `.github/copilot-instructions.md`.