# Custom Agents

This project defines three specialised agents for managing Leticia Cáceres's professional documents.

## Available Agents

| Agent       | File                  | Purpose                                   |
| ----------- | --------------------- | ----------------------------------------- |
| @writer     | `writer.agent.md`     | Improve and create professional documents |
| @translator | `translator.agent.md` | Translate to Argentinean Spanish          |
| @app        | `app.agent.md`        | Build, test, deploy, and maintain the app |

## Usage

Invoke an agent by name in VS Code Copilot Chat:

- `@writer` — for document writing and improvement
- `@translator` — for Spanish translations
- `@app` — for builds, tests, deployments, and maintenance

## Workflow

1. **@writer** improves content in `src/content/projects/*.md`
2. **@translator** creates/updates Spanish versions in `src/content/projects/es/*.md`
3. **@app** builds, tests, exports, commits, and pushes to GitHub + Gitea
