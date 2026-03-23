import LanguageSwitcher from '@components/LanguageSwitcher';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('LanguageSwitcher', () => {
  it('renders a link element', () => {
    render(<LanguageSwitcher locale="en" />);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
  });

  it('shows ES label when current locale is en', () => {
    render(<LanguageSwitcher locale="en" />);
    expect(screen.getByText('ES')).toBeInTheDocument();
  });

  it('shows EN label when current locale is es', () => {
    render(<LanguageSwitcher locale="es" />);
    expect(screen.getByText('EN')).toBeInTheDocument();
  });

  it('links to /es/ when on en home page (no slug)', () => {
    render(<LanguageSwitcher locale="en" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/es/');
  });

  it('links to / when on es home page (no slug)', () => {
    render(<LanguageSwitcher locale="es" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/');
  });

  it('links to /es/projects/slug/ when on en project page', () => {
    render(<LanguageSwitcher locale="en" currentSlug="biography" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/es/projects/biography/');
  });

  it('links to /projects/slug/ when on es project page', () => {
    render(<LanguageSwitcher locale="es" currentSlug="biography" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/projects/biography/');
  });

  it('has accessible aria-label for switching to Spanish', () => {
    render(<LanguageSwitcher locale="en" />);
    const link = screen.getByLabelText(/switch to spanish/i);
    expect(link).toBeInTheDocument();
  });

  it('has accessible aria-label for switching to English', () => {
    render(<LanguageSwitcher locale="es" />);
    const link = screen.getByLabelText(/switch to english/i);
    expect(link).toBeInTheDocument();
  });

  it('has title attribute for Spanish', () => {
    render(<LanguageSwitcher locale="en" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('title', 'Español');
  });

  it('has title attribute for English', () => {
    render(<LanguageSwitcher locale="es" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('title', 'English');
  });
});
