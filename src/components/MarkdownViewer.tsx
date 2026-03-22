import { copyToClipboard } from '@lib/clipboard';
import { Check, ChevronDown, ChevronRight, Copy } from 'lucide-react';
import { useMemo, useState } from 'react';

interface Props {
  markdown: string;
}

/** Lightweight regex-based markdown syntax colouring. */
function highlightMarkdown(source: string): (string | JSX.Element)[] {
  const lines = source.split('\n');
  const result: (string | JSX.Element)[] = [];
  let inFrontmatter = false;
  let frontmatterStart = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (i > 0) result.push('\n');

    // Frontmatter delimiters
    if (line === '---') {
      if (i === 0 || inFrontmatter) {
        frontmatterStart = !inFrontmatter;
        inFrontmatter = !inFrontmatter;
        result.push(<span key={`fm-${i}`} className="md-hl-frontmatter">{line}</span>);
        continue;
      }
    }

    // Inside frontmatter
    if (inFrontmatter) {
      result.push(<span key={`fm-${i}`} className="md-hl-frontmatter">{line}</span>);
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,6}\s)(.*)/);
    if (headingMatch) {
      result.push(
        <span key={`h-${i}`} className="md-hl-heading">
          <span className="md-hl-punctuation">{headingMatch[1]}</span>
          {headingMatch[2]}
        </span>,
      );
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      result.push(<span key={`hr-${i}`} className="md-hl-hr">{line}</span>);
      continue;
    }

    // Blockquote
    if (line.startsWith('>')) {
      result.push(<span key={`bq-${i}`} className="md-hl-blockquote">{line}</span>);
      continue;
    }

    // List items (- or * or numbered)
    const listMatch = line.match(/^(\s*(?:[-*]|\d+\.)\s)(.*)/);
    if (listMatch) {
      result.push(
        <span key={`li-${i}`}>
          <span className="md-hl-punctuation">{listMatch[1]}</span>
          {highlightInline(listMatch[2], i)}
        </span>,
      );
      continue;
    }

    // Regular line with inline highlighting
    result.push(<span key={`l-${i}`}>{highlightInline(line, i)}</span>);
  }

  return result;
}

function highlightInline(text: string, lineIdx: number): (string | JSX.Element)[] {
  const parts: (string | JSX.Element)[] = [];
  // Match: **bold**, *italic*, `code`, [text](url), ![alt](url)
  const regex = /(\*\*[^*]+\*\*)|(\*[^*]+\*)|(`[^`]+`)|(!?\[[^\]]*\]\([^)]*\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let partIdx = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const m = match[0];
    const key = `${lineIdx}-${partIdx++}`;

    if (match[1]) {
      parts.push(<span key={key} className="md-hl-bold">{m}</span>);
    } else if (match[2]) {
      parts.push(<span key={key} className="md-hl-italic">{m}</span>);
    } else if (match[3]) {
      parts.push(<span key={key} className="md-hl-code">{m}</span>);
    } else if (match[4]) {
      parts.push(<span key={key} className="md-hl-link">{m}</span>);
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

export default function MarkdownViewer({ markdown }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const highlighted = useMemo(() => highlightMarkdown(markdown), [markdown]);

  async function handleCopy() {
    const success = await copyToClipboard(markdown);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="border border-[var(--color-border)] rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="md-viewer-toggle flex items-center justify-between w-full px-4 py-3 text-sm font-medium hover:bg-[var(--color-bg-secondary)] transition-colors"
        aria-expanded={open}
        aria-controls="md-source"
      >
        <span className="flex items-center gap-2">
          {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          Markdown Source
        </span>

        {open && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                handleCopy();
              }
            }}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-[var(--color-bg-secondary)] transition-colors"
            aria-label={copied ? 'Copied!' : 'Copy markdown'}
          >
            {copied ? (
              <>
                <Check size={14} className="text-[var(--color-copied)]" />
                <span className="text-[var(--color-copied)]">Copied</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                Copy
              </>
            )}
          </span>
        )}
      </button>

      <div
        id="md-source"
        className={`md-viewer-content ${open ? 'open' : ''}`}
        role="region"
        aria-label="Markdown source code"
      >
        <pre>
          <code>{highlighted}</code>
        </pre>
      </div>
    </div>
  );
}
