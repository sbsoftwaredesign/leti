/**
 * generate-exports.ts
 *
 * Generates downloadable exports from the content collection:
 * 1. Strips frontmatter from each .md file → writes to public/exports/<slug>.md
 *    (Spanish files go to public/exports/es/<slug>.md)
 * 2. Generates PDF via Chrome headless from the built HTML → writes to public/exports/<slug>.pdf
 *
 * Usage: pnpm exports (after pnpm build)
 */

import { execSync } from "node:child_process";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { basename, extname, join, relative } from "node:path";

const CONTENT_DIR = join(
  import.meta.dirname,
  "..",
  "src",
  "content",
  "projects",
);
const EXPORTS_DIR = join(import.meta.dirname, "..", "public", "exports");
const DIST_DIR = join(import.meta.dirname, "..", "dist");

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

function stripFrontmatter(content: string): string {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  return match ? match[2].trim() : content.trim();
}

interface ExportEntry {
  slug: string;
  locale: "en" | "es";
}

async function collectMdFiles(
  dir: string,
  base: string,
): Promise<{ path: string; relPath: string }[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: { path: string; relPath: string }[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectMdFiles(fullPath, base)));
    } else if (extname(entry.name) === ".md") {
      files.push({ path: fullPath, relPath: relative(base, fullPath) });
    }
  }

  return files;
}

async function generateMarkdownExports(): Promise<ExportEntry[]> {
  await mkdir(EXPORTS_DIR, { recursive: true });
  await mkdir(join(EXPORTS_DIR, "es"), { recursive: true });

  const mdFiles = await collectMdFiles(CONTENT_DIR, CONTENT_DIR);
  const entries: ExportEntry[] = [];

  for (const { path: filePath, relPath } of mdFiles) {
    const isEs = relPath.startsWith("es/") || relPath.startsWith("es\\");
    const locale = isEs ? ("es" as const) : ("en" as const);
    const slug = basename(relPath, ".md");
    const raw = await readFile(filePath, "utf-8");
    const content = stripFrontmatter(raw);

    const outPath = isEs
      ? join(EXPORTS_DIR, "es", `${slug}.md`)
      : join(EXPORTS_DIR, `${slug}.md`);

    await writeFile(outPath, content, "utf-8");
    entries.push({ slug, locale });
    console.log(`  \u2713 ${isEs ? "es/" : ""}${slug}.md`);
  }

  return entries;
}

async function generatePdfExports(entries: ExportEntry[]): Promise<void> {
  for (const { slug, locale } of entries) {
    const htmlPath =
      locale === "es"
        ? join(DIST_DIR, "es", "print", slug, "index.html")
        : join(DIST_DIR, "print", slug, "index.html");
    const pdfPath =
      locale === "es"
        ? join(EXPORTS_DIR, "es", `${slug}.pdf`)
        : join(EXPORTS_DIR, `${slug}.pdf`);

    try {
      execSync(
        `"${CHROME}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfPath}" "file://${htmlPath}"`,
        { stdio: "pipe" },
      );
      console.log(`  \u2713 ${locale === "es" ? "es/" : ""}${slug}.pdf`);
    } catch {
      console.warn(
        `  \u2717 ${locale === "es" ? "es/" : ""}${slug}.pdf (Chrome headless failed; skipping)`,
      );
    }
  }
}

async function main() {
  console.log("\nGenerating markdown exports\u2026");
  const entries = await generateMarkdownExports();

  console.log("\nGenerating PDF exports\u2026");
  await generatePdfExports(entries);

  console.log(
    `\nDone. ${entries.length} documents exported to public/exports/\n`,
  );
}

main().catch((err) => {
  console.error("Export failed:", err);
  process.exit(1);
});
