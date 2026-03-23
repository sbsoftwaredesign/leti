/**
 * lint-content.ts
 *
 * Lints markdown content files for writing rules:
 * - En: AU/UK English, no em/en dashes, American spellings
 * - Es: Argentinean Spanish, no em/en dashes, Peninsular Spanish forms
 *
 * Locale is auto-detected from path: files under es/ are Spanish.
 *
 * Usage: pnpm lint:content
 */

import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const CONTENT_DIR = join(
  import.meta.dirname,
  "..",
  "src",
  "content",
  "projects",
);

interface LintIssue {
  file: string;
  line: number;
  rule: string;
  message: string;
  excerpt: string;
}

const AMERICAN_SPELLINGS: [RegExp, string][] = [
  [/\bcolor\b/gi, "colour"],
  [/\bfavor\b/gi, "favour"],
  [/\bhonor\b/gi, "honour"],
  [/\bbehavior\b/gi, "behaviour"],
  [/\bprogram\b(?!m)/gi, "programme"],
  [/\bcatalog\b/gi, "catalogue"],
  [/\borganize\b/gi, "organise"],
  [/\brecognize\b/gi, "recognise"],
  [/\bemphasize\b/gi, "emphasise"],
  [/\bcenter\b/gi, "centre"],
  [/\btheater\b/gi, "theatre"],
  [/\bdefense\b/gi, "defence"],
  [/\blabor\b/gi, "labour"],
  [/\bjudgment\b/gi, "judgement"],
  [/\bfulfill\b/gi, "fulfil"],
  [/\benroll\b/gi, "enrol"],
];

/** Peninsular/non-Rioplatense forms to flag in Argentinean Spanish */
const PENINSULAR_FORMS: [RegExp, string][] = [
  [/\bordenador\b/gi, "computadora"],
  [/\bcoche\b/gi, "auto"],
  [/\bvosotros\b/gi, "ustedes"],
  [/\bcoger\b/gi, "tomar/agarrar"],
];

type Locale = "en" | "es";

function lintLine(
  line: string,
  lineNum: number,
  file: string,
  locale: Locale,
): LintIssue[] {
  const issues: LintIssue[] = [];

  // Skip frontmatter, code blocks, and HTML
  if (
    line.startsWith("---") ||
    line.startsWith("```") ||
    line.startsWith("<")
  ) {
    return issues;
  }

  // Em dash check (both locales)
  if (line.includes("\u2014")) {
    issues.push({
      file,
      line: lineNum,
      rule: "no-em-dash",
      message:
        "Em dash (\u2014) found. Use commas, semicolons, colons, or full stops instead.",
      excerpt: line.trim().substring(0, 80),
    });
  }

  // En dash check (both locales, but not in code/URLs)
  if (line.includes("\u2013") && !line.includes("://")) {
    issues.push({
      file,
      line: lineNum,
      rule: "no-en-dash",
      message: 'En dash (\u2013) found. Use "to" for ranges.',
      excerpt: line.trim().substring(0, 80),
    });
  }

  if (locale === "en") {
    // American spelling check
    for (const [pattern, replacement] of AMERICAN_SPELLINGS) {
      if (pattern.test(line)) {
        issues.push({
          file,
          line: lineNum,
          rule: "au-uk-spelling",
          message: `American spelling detected. Use "${replacement}" instead.`,
          excerpt: line.trim().substring(0, 80),
        });
      }
    }
  } else {
    // Peninsular Spanish check for Argentinean content
    for (const [pattern, replacement] of PENINSULAR_FORMS) {
      if (pattern.test(line)) {
        issues.push({
          file,
          line: lineNum,
          rule: "ar-spanish",
          message: `Peninsular Spanish form detected. Use "${replacement}" (Argentinean).`,
          excerpt: line.trim().substring(0, 80),
        });
      }
    }
  }

  return issues;
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

async function main() {
  const mdFiles = await collectMdFiles(CONTENT_DIR, CONTENT_DIR);

  let totalIssues = 0;

  for (const { path: filePath, relPath } of mdFiles) {
    const locale: Locale =
      relPath.startsWith("es/") || relPath.startsWith("es\\") ? "es" : "en";
    const content = await readFile(filePath, "utf-8");
    const lines = content.split("\n");
    let inFrontmatter = false;
    let inCodeBlock = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Track frontmatter
      if (line.trim() === "---") {
        inFrontmatter = !inFrontmatter;
        continue;
      }
      if (inFrontmatter) continue;

      // Track code blocks
      if (line.trim().startsWith("```")) {
        inCodeBlock = !inCodeBlock;
        continue;
      }
      if (inCodeBlock) continue;

      const issues = lintLine(line, i + 1, relPath, locale);
      for (const issue of issues) {
        console.log(
          `  ${issue.file}:${issue.line}  ${issue.rule}  ${issue.message}`,
        );
        console.log(`    > ${issue.excerpt}`);
      }
      totalIssues += issues.length;
    }
  }

  if (totalIssues === 0) {
    console.log("\n\u2713 No writing rule issues found.\n");
  } else {
    console.log(`\n\u2717 ${totalIssues} issue(s) found.\n`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Lint failed:", err);
  process.exit(1);
});
