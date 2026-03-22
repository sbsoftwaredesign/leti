# AI Agent Optimization Playbook

> **Purpose**: This document serves as a comprehensive guide for AI agents to optimize any project for efficient context window usage. Use this as instructions when setting up new projects or running optimization passes on existing ones.

---

## Table of Contents
1. [Overview](#1-overview)
2. [File Structure for AI Optimization](#2-file-structure-for-ai-optimization)
3. [Ignore Files Implementation](#3-ignore-files-implementation)
4. [VS Code Configuration](#4-vs-code-configuration)
5. [AI-Specific Rule Files](#5-ai-specific-rule-files)
6. [Documentation Structure](#6-documentation-structure)
7. [Context Loading Strategies](#7-context-loading-strategies)
8. [Implementation Checklist](#8-implementation-checklist)
9. [Maintenance Guidelines](#9-maintenance-guidelines)

---

## 1. Overview

### Why Optimize for AI Agents?

AI agents have limited context windows (typically 100K-200K tokens). Wasting context on low-value files like lock files or binary assets reduces the agent's ability to understand and work with actual code.

### Key Principles

| Principle | Description |
|-----------|-------------|
| **Selective Loading** | Only load files relevant to the current task |
| **Explicit Exclusions** | Prevent agents from reading zero-value files |
| **Structured Documentation** | Provide quick-reference guides agents can use |
| **Tiered Context** | Load context in priority order based on task type |
| **Standardized Patterns** | Document patterns so agents don't need to infer them |

### Estimated Impact

| Optimization | Context Saved |
|--------------|---------------|
| Excluding `pnpm-lock.yaml` | 5,000-50,000 tokens |
| Excluding `node_modules/` | Unlimited (never indexed) |
| Excluding binary assets | 1,000+ tokens per file avoided |
| Targeted line ranges | 50-80% reduction per file read |
| Quick-reference index | Eliminates exploratory reads |

---

## 2. File Structure for AI Optimization

### Required Files

Create these files in every project:

```
project-root/
├── .github/
│   └── copilot-instructions.md    # GitHub Copilot context
├── .vscode/
│   └── settings.json              # VS Code workspace settings
├── .copilotignore                 # GitHub Copilot exclusions
├── .cursorignore                  # Cursor AI exclusions
├── .cursorrules                   # Cursor AI rules and patterns
├── .gitattributes                 # Mark generated files
└── ai-docs/                       # AI-specific documentation
    ├── PROJECT_INDEX.md           # Quick reference for agents
    ├── agent-optimization-guide.md # Context loading strategies
    └── progress-log.md            # Change history
```

### File Purposes

| File | Purpose | When Agents Read It |
|------|---------|---------------------|
| `copilot-instructions.md` | Project patterns, conventions, anti-patterns | Automatically by Copilot |
| `.cursorrules` | Code templates, file patterns, task workflows | Automatically by Cursor |
| `PROJECT_INDEX.md` | File registry, line counts, quick lookups | Start of every session |
| `progress-log.md` | Recent changes, current state | Before making changes |
| `agent-optimization-guide.md` | Context strategies, file reading patterns | When optimizing behavior |

---

## 3. Ignore Files Implementation

### 3.1 `.copilotignore`

Prevents GitHub Copilot from indexing specified files.

```gitignore
# AI Agent Ignore File
# Files and directories that AI agents should NOT read or index

# Lock files (large, auto-generated, no value for context)
pnpm-lock.yaml
package-lock.json
yarn.lock
bun.lockb

# Build outputs
dist/
build/
.next/
out/

# Dependencies
node_modules/

# System files
.DS_Store
Thumbs.db
*.log

# IDE/Editor directories
.idea/

# Large binary files
*.png
*.jpg
*.jpeg
*.gif
*.svg
*.ico
*.pdf
*.mp4
*.mp3
*.m4a
*.mov
*.zip
*.tar
*.gz

# Generated files
*.min.js
*.min.css
*.map

# Raw content files (project-specific)
# files/*.txt
# files/*.csv
```

### 3.2 `.cursorignore`

Prevents Cursor AI from indexing specified files.

```gitignore
# Cursor AI Ignore File
# Prevents indexing of low-value files

# Lock files
pnpm-lock.yaml
package-lock.json
yarn.lock

# Build & Dependencies
dist/
node_modules/

# Binary assets
*.png
*.jpg
*.mp4
*.m4a
*.pdf

# System
.DS_Store
*.log
```

### 3.3 `.gitattributes`

Marks files as generated to improve diff behavior and reduce noise.

```gitattributes
# Git Attributes - Mark generated files for better AI agent behavior
# These files will be excluded from language statistics and diffs

# Lock files - treat as generated/binary
pnpm-lock.yaml linguist-generated=true -diff
package-lock.json linguist-generated=true -diff
yarn.lock linguist-generated=true -diff

# Build outputs
dist/** linguist-generated=true
*.min.js linguist-generated=true
*.min.css linguist-generated=true

# Binary files
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.svg binary
*.ico binary
*.pdf binary
*.mp4 binary
*.mp3 binary
*.m4a binary
*.mov binary
*.zip binary

# Vendor files
node_modules/** linguist-vendored=true
```

### Why Each File Type is Excluded

| File/Pattern | Lines | Reason for Exclusion |
|--------------|-------|---------------------|
| `pnpm-lock.yaml` | 5,000-50,000+ | Auto-generated, no semantic value, huge token cost |
| `package-lock.json` | 10,000-100,000+ | Same as above |
| `node_modules/` | Millions | Never useful for context |
| `*.png`, `*.jpg` | Binary | Cannot be read as text |
| `*.min.js` | Thousands | Minified, unreadable |
| `dist/` | Varies | Build output, derived from source |

---

## 4. VS Code Configuration

### `.vscode/settings.json`

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.organizeImports": "explicit"
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.DS_Store": true,
    "**/pnpm-lock.yaml": true,
    "**/package-lock.json": true,
    "**/yarn.lock": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/pnpm-lock.yaml": true,
    "**/package-lock.json": true,
    "**/yarn.lock": true,
    "**/*.min.js": true,
    "**/*.min.css": true
  },
  "github.copilot.chat.codeGeneration.instructions": [
    {
      "file": ".github/copilot-instructions.md"
    }
  ],
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### Key Settings Explained

| Setting | Purpose |
|---------|---------|
| `files.exclude` | Hides files from VS Code file explorer |
| `search.exclude` | Excludes files from search results (used by AI tools) |
| `github.copilot.chat.codeGeneration.instructions` | Points Copilot to project-specific instructions |

---

## 5. AI-Specific Rule Files

### 5.1 `.github/copilot-instructions.md`

Template structure:

```markdown
# Copilot Instructions for [Project Name]

## Project Context
[Brief description of the project]

## Tech Stack
- **Framework**: [e.g., React 18 with TypeScript]
- **Build Tool**: [e.g., Vite]
- **Styling**: [e.g., TailwindCSS]

## Architecture Overview
[Directory structure with brief descriptions]

## Key Patterns
[Code patterns used in the project with examples]

## File Naming Conventions
[How files are named]

## Common Tasks
[Step-by-step instructions for common operations]

## Important Files for Context
[List of key files with relevant line ranges]

## Do NOT
[Anti-patterns and things to avoid]
```

### 5.2 `.cursorrules`

Template structure:

```markdown
# Cursor Rules for [Project Name]

## Project Type
[Framework + language + key libraries]

## Context Window Optimization

### Always Read First
1. [Primary instruction file]
2. [Progress/change log]
3. [Main entry point - with line ranges]

### Read On Demand
- [File] - Only when [condition]

### Never Read (Exclude)
See `.copilotignore` and `.cursorignore` for full list.

## Code Generation Rules

### [Language/Framework] Patterns
[Code templates with examples]

### Import Order
[Standard import ordering]

## Task Execution

### Before Making Changes
[Checklist]

### After Making Changes
[Verification steps]
```

---

## 6. Documentation Structure

### 6.1 `ai-docs/PROJECT_INDEX.md`

Quick reference that agents should load at session start:

```markdown
# [Project Name] Index

> Quick reference for AI agents. Last updated: [DATE]

## Project Structure Summary
[Annotated directory tree]

## File Registry
| File | Route/Purpose | Lines |
|------|---------------|-------|
[Table of all significant files]

## Quick Reference: Key Line Ranges
[Specific line ranges for important sections]

## Common Tasks Cheatsheet
| Task | Files to Touch | Estimated Context |
|------|----------------|-------------------|
[Table of common operations]

## Dependencies (Key Only)
[List of main dependencies]
```

### 6.2 `ai-docs/progress-log.md`

Reverse chronological change history:

```markdown
# [Project Name] Progress Log

> Reverse chronological order. Most recent entries first.

---

## YYYY-MM-DD (Feature Name)
- **Feature**: [Description]
- **Files**: [List of created/modified files]
- **Notes**: [Context for future agents]

---
[Previous entries...]
```

---

## 7. Context Loading Strategies

### Tiered Loading System

| Tier | Files | Load When | Token Cost |
|------|-------|-----------|------------|
| **T1: Always** | Instructions, progress log | Every session | ~500-1000 |
| **T2: Navigation** | Entry points, routers | Modifying structure | ~200-500 |
| **T3: Specific** | Target file only | Editing content | ~100-500 |
| **T4: Reference** | Config, styling | Theme/config changes | ~100-300 |

### Line Range Strategy

Instead of reading entire files, read only relevant sections:

```
# Good: Targeted reading
read_file App.tsx startLine=1 endLine=30      # Just imports
read_file App.tsx startLine=53 endLine=79     # Just route cases

# Bad: Full file read
read_file App.tsx startLine=1 endLine=500     # Wastes context
```

### Task-Specific Workflows

**Adding a new page/component:**
1. Read PROJECT_INDEX.md (understand structure)
2. Read entry point imports section
3. Create new file
4. Update imports and routing
5. Update progress log

**Editing existing content:**
1. Read target file only
2. Make changes
3. Update progress log

**Debugging:**
1. Read error context
2. Read relevant file(s)
3. Check for similar patterns in codebase

---

## 8. Implementation Checklist

Use this checklist when optimizing a new or existing project:

### Phase 1: Ignore Files
- [ ] Create `.copilotignore` with standard exclusions
- [ ] Create `.cursorignore` with standard exclusions
- [ ] Create `.gitattributes` marking generated files
- [ ] Add project-specific exclusions (e.g., raw content directories)

### Phase 2: VS Code Configuration
- [ ] Create/update `.vscode/settings.json`
- [ ] Add `files.exclude` for lock files and build outputs
- [ ] Add `search.exclude` for same
- [ ] Configure `github.copilot.chat.codeGeneration.instructions`

### Phase 3: AI Rule Files
- [ ] Create `.github/copilot-instructions.md` with project patterns
- [ ] Create `.cursorrules` with code templates
- [ ] Include architecture overview
- [ ] Document key file line ranges
- [ ] List anti-patterns (things to avoid)

### Phase 4: Documentation
- [ ] Create `ai-docs/` directory
- [ ] Create `PROJECT_INDEX.md` with file registry
- [ ] Create `progress-log.md` for change tracking
- [ ] Create `agent-optimization-guide.md` if complex project
- [ ] Update any existing master plan/roadmap

### Phase 5: Verification
- [ ] Run build to ensure no files are broken
- [ ] Test that search excludes work in VS Code
- [ ] Commit all optimization files

---

## 9. Maintenance Guidelines

### When to Update

| Trigger | Action |
|---------|--------|
| New file type added | Update ignore files if needed |
| New page/component created | Update PROJECT_INDEX.md |
| Major feature completed | Add entry to progress-log.md |
| New pattern established | Update copilot-instructions.md |
| Significant refactor | Update all relevant docs |

### Review Cadence

- **Weekly**: Update progress log with significant changes
- **Monthly**: Review PROJECT_INDEX for accuracy
- **Per Release**: Update master plan/roadmap

### Signs of Needed Optimization

- Agents reading lock files or node_modules
- Agents asking for context they should already have
- Repeated pattern inference instead of using documented patterns
- Long file reads when line ranges would suffice

---

## Appendix: File Templates

### Minimal Setup (Small Projects)

For small projects, only these files are required:
1. `.copilotignore`
2. `.cursorignore`
3. `.github/copilot-instructions.md`

### Full Setup (Large Projects)

For large or complex projects, implement all files:
1. All ignore files (`.copilotignore`, `.cursorignore`, `.gitattributes`)
2. VS Code settings (`.vscode/settings.json`)
3. AI rules (`.github/copilot-instructions.md`, `.cursorrules`)
4. Full `ai-docs/` directory with all documentation

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-16 | 1.0 | Initial implementation |

---

*This document should be copied to new projects and customized for project-specific needs.*
