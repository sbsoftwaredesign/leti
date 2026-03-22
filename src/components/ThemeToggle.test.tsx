import ThemeToggle from '@components/ThemeToggle';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Mock theme module
vi.mock('@lib/theme', () => ({
  getTheme: vi.fn(() => 'light'),
  setTheme: vi.fn(),
}));

describe('ThemeToggle', () => {
  it('renders a toggle button', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('has accessible label', () => {
    render(<ThemeToggle />);
    const button = screen.getByLabelText(/switch to dark mode/i);
    expect(button).toBeInTheDocument();
  });

  it('toggles theme on click', async () => {
    const { setTheme } = await import('@lib/theme');
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(setTheme).toHaveBeenCalledWith('dark');
  });
});
