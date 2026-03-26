import BurgerMenu from '@components/BurgerMenu';
import type { ProjectMeta } from '@lib/content-utils';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

const mockProjects: ProjectMeta[] = [
  { title: 'CV & Filmography', slug: 'cv-filmography', category: 'cv', status: 'final', order: 1, date: '2026-01-01', description: 'CV' },
  { title: 'Biography', slug: 'biography', category: 'bio', status: 'final', order: 1, date: '2026-01-01', description: 'Bio' },
  { title: 'Weight Limit', slug: 'weight-limit', category: 'pitch', status: 'final', order: 1, date: '2026-01-01', description: 'Pitch', project: 'weight-limit' },
  { title: 'TIFF Assessment', slug: 'tiff-assessment', category: 'assessment', status: 'final', order: 1, date: '2026-01-01', description: 'Assessment', project: 'tiff' },
  { title: 'AI Agent Instructions', slug: 'agent-instructions', category: 'guide', status: 'final', order: 1, date: '2026-01-01', description: 'Guide' },
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

  it('shows category and project headings', () => {
    render(<BurgerMenu projects={mockProjects} />);
    fireEvent.click(screen.getByLabelText(/open navigation menu/i));
    expect(screen.getByText('CV')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /biography/i })).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /guide/i })).toBeInTheDocument();
  });

  it('shows Home link', () => {
    render(<BurgerMenu projects={mockProjects} />);
    fireEvent.click(screen.getByLabelText(/open navigation menu/i));
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('expands all sections by default', () => {
    render(<BurgerMenu projects={mockProjects} />);
    fireEvent.click(screen.getByLabelText(/open navigation menu/i));

    // All project links should be visible without clicking categories
    expect(screen.getByText('CV & Filmography')).toBeInTheDocument();
    expect(screen.getAllByText('Biography').length).toBeGreaterThanOrEqual(2); // category + project
    // Weight Limit appears as both project group heading and document link
    expect(screen.getAllByText('Weight Limit').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('AI Agent Instructions')).toBeInTheDocument();
  });

  it('highlights current page', () => {
    render(<BurgerMenu projects={mockProjects} currentSlug="cv-filmography" />);
    fireEvent.click(screen.getByLabelText(/open navigation menu/i));

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

  it('collapses section on click and re-expands on second click', () => {
    render(<BurgerMenu projects={mockProjects} />);
    fireEvent.click(screen.getByLabelText(/open navigation menu/i));

    // All expanded by default
    expect(screen.getByText('CV & Filmography')).toBeInTheDocument();

    // Click CV to collapse
    const cvButton = screen.getByText('CV');
    fireEvent.click(cvButton);
    expect(screen.queryByText('CV & Filmography')).not.toBeInTheDocument();

    // Click CV again to re-expand
    fireEvent.click(cvButton);
    expect(screen.getByText('CV & Filmography')).toBeInTheDocument();
  });

  it('renders without currentSlug', () => {
    render(<BurgerMenu projects={mockProjects} />);
    fireEvent.click(screen.getByLabelText(/open navigation menu/i));
    const homeLink = screen.getByText('Home');
    expect(homeLink).toBeInTheDocument();
  });

  // i18n / locale tests

  it('shows Spanish labels when locale is es', () => {
    render(<BurgerMenu projects={mockProjects} locale="es" />);
    fireEvent.click(screen.getByLabelText(/open navigation menu/i));
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Documentos')).toBeInTheDocument();
    // 'Biografía' appears as category heading
    expect(screen.getByRole('button', { name: /biografía/i })).toBeInTheDocument();
    // 'Proyectos' appears as projects parent
    expect(screen.getByText('Proyectos')).toBeInTheDocument();
  });

  it('links to /es/ paths when locale is es', () => {
    render(<BurgerMenu projects={mockProjects} locale="es" />);
    fireEvent.click(screen.getByLabelText(/open navigation menu/i));
    const homeLink = screen.getByText('Inicio');
    expect(homeLink.closest('a')).toHaveAttribute('href', '/es/');
  });

  it('links to / paths when locale is en', () => {
    render(<BurgerMenu projects={mockProjects} locale="en" />);
    fireEvent.click(screen.getByLabelText(/open navigation menu/i));
    const homeLink = screen.getByText('Home');
    expect(homeLink.closest('a')).toHaveAttribute('href', '/');
  });

  it('links to /es/projects/ for project items when locale is es', () => {
    render(<BurgerMenu projects={mockProjects} locale="es" />);
    fireEvent.click(screen.getByLabelText(/open navigation menu/i));
    const cvLink = screen.getByText('CV & Filmography');
    expect(cvLink.closest('a')).toHaveAttribute('href', '/es/projects/cv-filmography/');
  });
});
