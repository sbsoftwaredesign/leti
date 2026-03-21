---
description: Sync content changes from A4 print HTML to standalone HTML
---

After editing `output/assessment.html`, sync the content changes to `output/assessment-standalone.html`.

The standalone version has:
- All CSS inlined (not in a separate file)
- AAA-accessible fonts (14pt body, scaled headings)
- 960px max-width desktop layout (not A4 210mm)
- Table of contents (screen-only, hidden in print)

When syncing:
1. Compare the body content of both files
2. Copy content changes from the A4 version to the standalone
3. Verify all content complies with writing rules (no em/en dashes, AU/UK English)
4. Keep the standalone's CSS, layout, and TOC intact
5. Do NOT copy A4-specific font sizes or layout widths into the standalone
