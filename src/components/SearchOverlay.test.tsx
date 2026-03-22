import SearchOverlay from '@components/SearchOverlay';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('SearchOverlay', () => {
  it('renders search button', () => {
    render(<SearchOverlay />);
    const button = screen.getByLabelText(/search documents/i);
    expect(button).toBeInTheDocument();
  });

  it('opens on button click', () => {
    render(<SearchOverlay />);
    fireEvent.click(screen.getByLabelText(/search documents/i));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('shows search input when open', () => {
    render(<SearchOverlay />);
    fireEvent.click(screen.getByLabelText(/search documents/i));
    expect(screen.getByLabelText(/search input/i)).toBeInTheDocument();
  });

  it('closes on close button click', () => {
    render(<SearchOverlay />);
    fireEvent.click(screen.getByLabelText(/search documents/i));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/close search/i));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes on Escape key', () => {
    render(<SearchOverlay />);
    fireEvent.click(screen.getByLabelText(/search documents/i));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens on Cmd+K keyboard shortcut', () => {
    render(<SearchOverlay />);
    fireEvent.keyDown(document, { key: 'k', metaKey: true });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('shows placeholder text when no query', () => {
    render(<SearchOverlay />);
    fireEvent.click(screen.getByLabelText(/search documents/i));
    expect(screen.getByText(/type to search/i)).toBeInTheDocument();
  });
});
