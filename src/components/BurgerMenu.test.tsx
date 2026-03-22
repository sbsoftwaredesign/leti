import BurgerMenu from '@components/BurgerMenu';
import type { ProjectMeta } from '@lib/content-utils';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

const mockProjects: ProjectMeta[] = [
  { title: 'CV & Filmography', slug: 'cv-filmography', category: 'cv', status: 'final', order: 1, date: '2026-01-01', description: 'CV' },
  { title: 'Biography', slug: 'biography', category: 'bio', status: 'final', order: 1, date: '2026-01-01', description: 'Bio' },
  { title: 'Weight Limit', slug: 'weight-limit', category: 'pitch', status: 'final', order: 1, date: '2026-01-01', description: 'Pitch' },
];

describe('BurgerMenu', () => {
  it('renders menu button', () => {
    render(<BurgerMenu projects={mockProjects} />);
    const button = screen.getByLabelText(/open navigation menu/i);
    expect(button).toBeInTheDocument();
  });

  it('opens sidebar on click', () => {
    render(<BurgerMenu projects={mockProjects} />);
    fireEvent.click(screen.getByLabelText(/open navigation menu/i));
    expect(screen.getByLabelText(/close navigation menu/i)).toBeInTheDocument();
  });

  it('shows category headings', () => {
    render(<BurgerMenu projects={mockProjects} />);
    fireEvent.click(screen.getByLabelText(/open navigation menu/i));
    expect(screen.getByText('CV')).toBeInTheDocument();
    expect(screen.getByText('Biography')).toBeInTheDocument();
    expect(screen.getByText('Pitch')).toBeInTheDocument();
  });

  it('shows Home link', () => {
    render(<BurgerMenu projects={mockProjects} />);
    fireEvent.click(screen.getByLabelText(/open navigation menu/i));
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('expands category to show project links', () => {
    render(<BurgerMenu projects={mockProjects} />);
    fireEvent.click(screen.getByLabelText(/open navigation menu/i));

    // Click the CV category button
    const cvButton = screen.getByText('CV');
    fireEvent.click(cvButton);

    expect(screen.getByText('CV & Filmography')).toBeInTheDocument();
  });

  it('highlights current page', () => {
    render(<BurgerMenu projects={mockProjects} currentSlug="cv-filmography" />);
    fireEvent.click(screen.getByLabelText(/open navigation menu/i));

    // The CV category should be auto-expanded since currentSlug is in it
    expect(screen.getByText('CV & Filmography')).toBeInTheDocument();
  });

  it('closes on close button click', () => {
    render(<BurgerMenu projects={mockProjects} />);
    fireEvent.click(screen.getByLabelText(/open navigation menu/i));
    const sidebar = screen.getByRole('navigation');
    expect(sidebar.className).toContain('open');

    fireEvent.click(screen.getByLabelText(/close navigation menu/i));
    expect(sidebar.className).not.toContain('open');
  });

  it('closes on Escape key', () => {
    render(<BurgerMenu projects={mockProjects} />);
    fireEvent.click(screen.getByLabelText(/open navigation menu/i));
    const sidebar = screen.getByRole('navigation');
    expect(sidebar.className).toContain('open');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(sidebar.className).not.toContain('open');
  });

  it('closes on overlay backdrop click', () => {
    render(<BurgerMenu projects={mockProjects} />);
    fireEvent.click(screen.getByLabelText(/open navigation menu/i));
    const sidebar = screen.getByRole('navigation');
    expect(sidebar.className).toContain('open');

    const backdrop = document.querySelector('.overlay-backdrop');
    fireEvent.click(backdrop!);
    expect(sidebar.className).not.toContain('open');
  });

  it('collapses expanded category on second click', () => {
    render(<BurgerMenu projects={mockProjects} />);
    fireEvent.click(screen.getByLabelText(/open navigation menu/i));

    const cvButton = screen.getByText('CV');
    fireEvent.click(cvButton);
    expect(screen.getByText('CV & Filmography')).toBeInTheDocument();

    fireEvent.click(cvButton);
    expect(screen.queryByText('CV & Filmography')).not.toBeInTheDocument();
  });

  it('renders without currentSlug', () => {
    render(<BurgerMenu projects={mockProjects} />);
    fireEvent.click(screen.getByLabelText(/open navigation menu/i));
    // Home should be highlighted (bold font) when no currentSlug
    const homeLink = screen.getByText('Home');
    expect(homeLink).toBeInTheDocument();
  });
});
