import { render, screen } from '@testing-library/react';
import Experience from '../Experience';
import { experienceData } from '../data';

describe('Experience', () => {
  it('renders the work heading', () => {
    render(<Experience />);
    expect(
      screen.getByRole('heading', { name: /^work$/i })
    ).toBeInTheDocument();
  });

  it('renders all experience items from data', () => {
    render(<Experience />);
    experienceData.forEach(({ role, company }) => {
      expect(screen.getAllByText(role).length).toBeGreaterThan(0);
      expect(screen.getByText(`at ${company}`)).toBeInTheDocument();
    });
  });

  it('renders all year ranges', () => {
    render(<Experience />);
    experienceData.forEach(({ yearRange }) => {
      expect(screen.getByText(yearRange)).toBeInTheDocument();
    });
  });

  it('renders technology chips for each role', () => {
    render(<Experience />);
    experienceData.forEach(({ technologies }) => {
      technologies.forEach((tech) => {
        // Tech may appear in multiple roles, so getAllByText
        expect(screen.getAllByText(tech).length).toBeGreaterThan(0);
      });
    });
  });

  it('sets the document title', () => {
    render(<Experience />);
    expect(document.title).toBe('Work — Kenechukwu Ajufo');
  });
});
