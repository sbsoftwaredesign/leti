/**
 * generate-exports.ts
 *
 * Generates downloadable exports from the content collection:
 * 1. Strips frontmatter from each .md file → writes to public/exports/<slug>.md
 * 2. Generates PDF via Chrome headless from the built HTML → writes to public/exports/<slug>.pdf
 *
 * Usage: pnpm exports (after pnpm build)
 */

import { execSync } from "node:child_process";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";

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

async function generateMarkdownExports(): Promise<string[]> {
  await mkdir(EXPORTS_DIR, { recursive: true });

  const files = await readdir(CONTENT_DIR);
  const mdFiles = files.filter((f) => extname(f) === ".md");
  const slugs: string[] = [];

  for (const file of mdFiles) {
    const slug = basename(file, ".md");
    const raw = await readFile(join(CONTENT_DIR, file), "utf-8");
    const content = stripFrontmatter(raw);
    await writeFile(join(EXPORTS_DIR, `${slug}.md`), content, "utf-8");
    slugs.push(slug);
    console.log(`  ✓ ${slug}.md`);
  }

  return slugs;
}

async function generatePdfExports(slugs: string[]): Promise<void> {
  for (const slug of slugs) {
    const htmlPath = join(DIST_DIR, "print", slug, "index.html");
    const pdfPath = join(EXPORTS_DIR, `${slug}.pdf`);

    try {
      execSync(
        `"${CHROME}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfPath}" "file://${htmlPath}"`,
        { stdio: "pipe" },
      );
      console.log(`  ✓ ${slug}.pdf`);
    } catch {
      console.warn(`  ✗ ${slug}.pdf (Chrome headless failed; skipping)`);
    }
  }
}

async function main() {
  console.log("\nGenerating markdown exports…");
  const slugs = await generateMarkdownExports();

  console.log("\nGenerating PDF exports…");
  await generatePdfExports(slugs);

  console.log(
    `\nDone. ${slugs.length} documents exported to public/exports/\n`,
  );
}

main().catch((err) => {
  console.error("Export failed:", err);
  process.exit(1);
});
