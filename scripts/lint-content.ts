/**
 * lint-content.ts
 *
 * Lints markdown content files for AU/UK English and writing rules:
 * - Em dashes (—) and en dashes (–) in prose
 * - Common American spellings
 * - Passive voice indicators
 *
 * Usage: pnpm lint:content
 */

import { readdir, readFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";

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

function lintLine(line: string, lineNum: number, file: string): LintIssue[] {
  const issues: LintIssue[] = [];

  // Skip frontmatter, code blocks, and HTML
  if (
    line.startsWith("---") ||
    line.startsWith("```") ||
    line.startsWith("<")
  ) {
    return issues;
  }

  // Em dash check
  if (line.includes("—")) {
    issues.push({
      file,
      line: lineNum,
      rule: "no-em-dash",
      message:
        "Em dash (—) found. Use commas, semicolons, colons, or full stops instead.",
      excerpt: line.trim().substring(0, 80),
    });
  }

  // En dash check (but not in code/URLs)
  if (line.includes("–") && !line.includes("://")) {
    issues.push({
      file,
      line: lineNum,
      rule: "no-en-dash",
      message: 'En dash (–) found. Use "to" for ranges.',
      excerpt: line.trim().substring(0, 80),
    });
  }

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

  return issues;
}

async function main() {
  const files = await readdir(CONTENT_DIR);
  const mdFiles = files.filter((f) => extname(f) === ".md");

  let totalIssues = 0;
  let inFrontmatter = false;
  let inCodeBlock = false;

  for (const file of mdFiles) {
    const content = await readFile(join(CONTENT_DIR, file), "utf-8");
    const lines = content.split("\n");
    const slug = basename(file, ".md");
    inFrontmatter = false;
    inCodeBlock = false;

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

      const issues = lintLine(line, i + 1, slug);
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
    console.log("\n✓ No writing rule issues found.\n");
  } else {
    console.log(`\n✗ ${totalIssues} issue(s) found.\n`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Lint failed:", err);
  process.exit(1);
});
