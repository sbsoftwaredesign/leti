---
description: Regenerate HTML output from a draft markdown file
---

Convert a draft markdown file into styled HTML output.

Steps:
1. Read the source content from `drafts/`
2. Read the design tokens and structure from `output/cv-v2-style.css` (reference implementation)
3. Generate/update the HTML file in `output/` using:
   - Source Serif 4 + Inter fonts (Google Fonts import)
   - The canonical CSS colour tokens from copilot-instructions.md
   - A4 `@page` rules with 16mm margins for print
4. If a standalone version exists (`*-standalone.html`), update it too with:
   - All CSS inlined in `<style>` block
   - AAA-accessible font sizes (14pt body minimum)
   - 960px wide desktop layout
   - No external dependencies except Google Fonts
5. Verify both files render correctly
