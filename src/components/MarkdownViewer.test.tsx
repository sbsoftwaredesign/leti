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
});
