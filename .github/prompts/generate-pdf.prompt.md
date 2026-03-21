---
description: Generate a PDF from an output HTML file using Chrome headless
---

Generate a print-ready A4 PDF from the specified HTML file in `output/`.

Steps:
1. Confirm the target HTML file exists in `output/`
2. Run Chrome headless with `--no-pdf-header-footer` to generate the PDF into `output/pdf/`
3. Report the file size of the generated PDF

Use this exact command pattern:
```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="output/pdf/{NAME}.pdf" \
  "file://$PWD/output/{NAME}.html"
```

Only use A4 print versions (`assessment.html`, `cv-v2.html`) — never the standalone HTML.
