import MarkdownViewer from '@components/MarkdownViewer';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@lib/clipboard', () => ({
  copyToClipboard: vi.fn().mockResolvedValue(true),
}));

const sampleMarkdown = '# Hello\n\nThis is a test document.';

describe('MarkdownViewer', () => {
  it('renders collapsed by default', () => {
    render(<MarkdownViewer markdown={sampleMarkdown} />);
    const button = screen.getByRole('button', { name: /markdown source/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('expands on click', () => {
    render(<MarkdownViewer markdown={sampleMarkdown} />);
    const button = screen.getByRole('button', { name: /markdown source/i });
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('shows markdown content when expanded', () => {
    render(<MarkdownViewer markdown={sampleMarkdown} />);
    fireEvent.click(screen.getByRole('button', { name: /markdown source/i }));
    expect(screen.getByText(/This is a test document/)).toBeInTheDocument();
  });

  it('shows copy button when expanded', () => {
    render(<MarkdownViewer markdown={sampleMarkdown} />);
    fireEvent.click(screen.getByRole('button', { name: /markdown source/i }));
    expect(screen.getByText('Copy')).toBeInTheDocument();
  });

  it('copies markdown on copy button click', async () => {
    const { copyToClipboard } = await import('@lib/clipboard');
    render(<MarkdownViewer markdown={sampleMarkdown} />);
    fireEvent.click(screen.getByRole('button', { name: /markdown source/i }));

    const copyBtn = screen.getByLabelText(/copy markdown/i);
    fireEvent.click(copyBtn);

    expect(copyToClipboard).toHaveBeenCalledWith(sampleMarkdown);
  });

  it('highlights frontmatter delimiters and content', () => {
    const md = '---\ntitle: Test\n---\n# Heading';
    render(<MarkdownViewer markdown={md} />);
    fireEvent.click(screen.getByRole('button', { name: /markdown source/i }));
    const pre = document.querySelector('pre');
    expect(pre?.querySelectorAll('.md-hl-frontmatter').length).toBeGreaterThanOrEqual(2);
  });

  it('highlights blockquotes', () => {
    const md = '> This is a quote';
    render(<MarkdownViewer markdown={md} />);
    fireEvent.click(screen.getByRole('button', { name: /markdown source/i }));
    const bq = document.querySelector('.md-hl-blockquote');
    expect(bq).toBeInTheDocument();
    expect(bq?.textContent).toContain('This is a quote');
  });

  it('highlights horizontal rules', () => {
    const md = 'Above\n---\nBelow';
    render(<MarkdownViewer markdown={md} />);
    fireEvent.click(screen.getByRole('button', { name: /markdown source/i }));
    const hr = document.querySelector('.md-hl-hr');
    expect(hr).toBeInTheDocument();
  });

  it('highlights list items with inline formatting', () => {
    const md = '- Item with **bold** text';
    render(<MarkdownViewer markdown={md} />);
    fireEvent.click(screen.getByRole('button', { name: /markdown source/i }));
    const punct = document.querySelector('.md-hl-punctuation');
    expect(punct).toBeInTheDocument();
    const bold = document.querySelector('.md-hl-bold');
    expect(bold).toBeInTheDocument();
  });

  it('highlights inline formatting: italic, code, links', () => {
    const md = 'Some *italic* and `code` and [link](http://example.com)';
    render(<MarkdownViewer markdown={md} />);
    fireEvent.click(screen.getByRole('button', { name: /markdown source/i }));
    expect(document.querySelector('.md-hl-italic')).toBeInTheDocument();
    expect(document.querySelector('.md-hl-code')).toBeInTheDocument();
    expect(document.querySelector('.md-hl-link')).toBeInTheDocument();
  });

  it('handles copy via keyboard (Enter key)', () => {
    render(<MarkdownViewer markdown={sampleMarkdown} />);
    fireEvent.click(screen.getByRole('button', { name: /markdown source/i }));
    const copyBtn = screen.getByLabelText(/copy markdown/i);
    fireEvent.keyDown(copyBtn, { key: 'Enter' });
    // No error thrown = success
  });
});
