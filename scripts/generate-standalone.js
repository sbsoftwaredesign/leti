#!/usr/bin/env node
/**
 * Generate standalone HTML + Markdown from A4 print-ready HTML + external CSS.
 *
 * Usage:
 *   node scripts/generate-standalone.js output/web/bio.html
 *   node scripts/generate-standalone.js --all
 *
 * Output structure (relative to project root):
 *   output/web/<name>.html              — A4 print-ready (source, not generated)
 *   output/web/<name>-standalone.html   — self-contained (CSS inlined, fonts linked)
 *   output/md/<name>.md                 — markdown extracted from HTML content
 *   output/pdf/<name>.pdf               — PDF via Chrome headless (separate step)
 */

const fs = require('fs');
const path = require('path');

// ── Config ──────────────────────────────────────────────────────────────────

const PROJECT_ROOT = path.resolve(__dirname, '..');
const WEB_DIR = path.join(PROJECT_ROOT, 'output', 'web');
const MD_DIR = path.join(PROJECT_ROOT, 'output', 'md');

const FONT_PRECONNECT = [
  '<link rel="preconnect" href="https://fonts.googleapis.com">',
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
].join('\n  ');

const DESKTOP_OVERRIDES = `
    /* ---------- STANDALONE: Desktop-reading overrides ---------- */
    body {
      background: var(--bg-body, #fdfbf7);
      max-width: 720px;
      margin: 0 auto;
      padding: 48px 32px;
    }

    a:hover { text-decoration: underline; }
`;

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// ── Standalone HTML generation ──────────────────────────────────────────────

function generateStandalone(inputFile) {
  const inputPath = path.resolve(inputFile);
  const inputDir = path.dirname(inputPath);
  const baseName = path.basename(inputPath, '.html');

  if (baseName.endsWith('-standalone')) {
    console.log('  ⊘ Skipping (already a standalone)');
    return;
  }

  ensureDir(MD_DIR);

  const standalonePath = path.join(inputDir, `${baseName}-standalone.html`);
  const mdPath = path.join(MD_DIR, `${baseName}.md`);

  // Read input HTML
  let html = fs.readFileSync(inputPath, 'utf8');

  // Find linked CSS file
  const cssLinkMatch = html.match(/<link\s+rel="stylesheet"\s+href="([^"]+)"/);
  if (!cssLinkMatch) {
    console.log('  ⊘ Skipping (no external CSS link found)');
    return;
  }

  const cssFilePath = path.join(inputDir, cssLinkMatch[1]);
  if (!fs.existsSync(cssFilePath)) {
    console.error(`  ✗ CSS file not found: ${cssLinkMatch[1]}`);
    return;
  }

  let css = fs.readFileSync(cssFilePath, 'utf8');

  // Extract Google Fonts URL from @import (we replace with <link> for performance)
  const fontImportMatch = css.match(/@import\s+url\(['"]([^'"]+)['"]\);?/);
  const fontUrl = fontImportMatch ? fontImportMatch[1] : null;
  css = css.replace(/@import\s+url\(['"][^'"]+['"]\);?\s*\n?/, '');

  // Ensure --bg-body token exists
  if (!css.includes('--bg-body')) {
    css = css.replace(':root {', ':root {\n      --bg-body: #fdfbf7;');
  }

  // Combine original CSS + desktop overrides
  const fullCss = css + DESKTOP_OVERRIDES;

  // Replace <link rel="stylesheet"> with inlined <style>
  html = html.replace(
    /<link\s+rel="stylesheet"\s+href="[^"]+"\s*\/?>/,
    `<style>\n${fullCss}\n  </style>`
  );

  // Add Google Fonts <link> tags before <style>
  if (fontUrl) {
    const fontLinkTag = `  ${FONT_PRECONNECT}\n  <link href="${fontUrl}" rel="stylesheet">`;
    html = html.replace('<style>', fontLinkTag + '\n  <style>');
  }

  fs.writeFileSync(standalonePath, html, 'utf8');
  console.log(`  ✓ ${path.relative(process.cwd(), standalonePath)}`);

  // Generate markdown
  const md = htmlToMarkdown(html);
  fs.writeFileSync(mdPath, md, 'utf8');
  console.log(`  ✓ ${path.relative(process.cwd(), mdPath)}`);
}

// ── HTML → Markdown conversion ──────────────────────────────────────────────

function htmlToMarkdown(html) {
  // Extract <body> content
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/);
  if (!bodyMatch) return '';

  let content = bodyMatch[1];

  // Process block-level elements first (order matters)
  let md = content
    // Remove <style> blocks
    .replace(/<style[\s\S]*?<\/style>/g, '')
    // Page breaks → horizontal rules
    .replace(/<div\s+class="page-break"[^>]*><\/div>/g, '\n---\n')
    // Headings (capture content, may contain nested tags)
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/g, (_, inner) => `\n# ${stripTags(inner).trim()}\n`)
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/g, (_, inner) => `\n## ${stripTags(inner).trim()}\n`)
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/g, (_, inner) => `\n### ${stripTags(inner).trim()}\n`)
    // Subtitle divs → h2
    .replace(/<div[^>]*class="subtitle"[^>]*>([\s\S]*?)<\/div>/g, (_, inner) => `\n## ${stripTags(inner).trim()}\n`)
    // Emphasis and strong
    .replace(/<em>(.*?)<\/em>/g, '*$1*')
    .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
    // Links
    .replace(/<a[^>]+href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g, '[$2]($1)')
    // Line breaks
    .replace(/<br\s*\/?>/g, '\n')
    // List items
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/g, (_, inner) => `- ${stripTags(inner).trim()}\n`)
    // Paragraphs → text + double newline
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/g, (_, inner) => `${inner.trim()}\n\n`)
    // Separators
    .replace(/<span[^>]*class="sep"[^>]*>[\s\S]*?<\/span>/g, ' · ')
    // Remaining spans → just their text
    .replace(/<span[^>]*>([\s\S]*?)<\/span>/g, '$1')
    // Strip all remaining HTML tags
    .replace(/<\/?[^>]+>/g, '')
    // Decode entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#\d+;/g, '')
    // Clean up whitespace
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return md + '\n';
}

function stripTags(html) {
  return html.replace(/<\/?[^>]+>/g, '');
}

// ── CLI ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log(`
Generate standalone HTML + Markdown from A4 print-ready HTML + external CSS.

Usage:
  node scripts/generate-standalone.js <file.html>     Process a single file
  node scripts/generate-standalone.js --all            Process all HTML in output/web/

Output structure:
  output/web/<name>-standalone.html   Self-contained HTML (CSS inlined, fonts linked)
  output/md/<name>.md                 Markdown extracted from HTML content
  output/pdf/<name>.pdf               PDF (generated separately via Chrome headless)
`);
  process.exit(0);
}

if (args.includes('--all')) {
  const files = fs.readdirSync(WEB_DIR)
    .filter(f => f.endsWith('.html') && !f.endsWith('-standalone.html'))
    .map(f => path.join(WEB_DIR, f));

  if (files.length === 0) {
    console.log('No HTML files found in output/web/');
    process.exit(0);
  }

  console.log(`Processing ${files.length} file(s):\n`);
  for (const file of files) {
    console.log(`→ ${path.basename(file)}`);
    generateStandalone(file);
    console.log('');
  }
  console.log('Done.');
} else {
  for (const file of args) {
    console.log(`→ ${path.basename(file)}`);
    generateStandalone(file);
  }
}
