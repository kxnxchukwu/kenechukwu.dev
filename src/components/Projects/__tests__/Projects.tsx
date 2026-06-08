import { render, screen } from '@testing-library/react';
import Projects from '../Projects';

describe('Projects', () => {
  it('renders the projects heading', () => {
    render(<Projects />);
    expect(
      screen.getByRole('heading', { name: /^projects$/i })
    ).toBeInTheDocument();
  });

  it('renders all project names', () => {
    render(<Projects />);
    const names = [
      'TinyHouse',
      'Crown Clothing',
      'Linear Clone',
      'Padre Ginos',
      'eMatchi'
    ];
    names.forEach((name) => {
      expect(screen.getByRole('heading', { name })).toBeInTheDocument();
    });
  });

  it('renders GitHub links pointing to the correct URLs', () => {
    render(<Projects />);
    const githubLinks = screen.getAllByLabelText(/github/i);
    expect(githubLinks.length).toBeGreaterThan(0);
    githubLinks.forEach((link) => {
      expect(link).toHaveAttribute(
        'href',
        expect.stringContaining('github.com/kxnxchukwu')
      );
      expect(link).toHaveAttribute('target', '_blank');
    });
  });

  it('renders live links that open in a new tab', () => {
    render(<Projects />);
    const liveLinks = screen.getAllByLabelText(/live site/i);
    expect(liveLinks.length).toBeGreaterThan(0);
    liveLinks.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('sets the document title', () => {
    render(<Projects />);
    expect(document.title).toBe('Projects — Kenechukwu Ajufo');
  });
});
