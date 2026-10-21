import { render, screen } from '@testing-library/react';
import SamplePost, { frontmatter } from '../../../test/fixtures/sample-post.md';
import SectionsPost from '../../../test/fixtures/sample-post-h2.md';

describe('Markdown pipeline', () => {
  it('exports the frontmatter', () => {
    expect(frontmatter).toEqual({
      title: 'Sample post',
      date: '2024-01-15',
      description: 'A fixture for testing the Markdown pipeline.'
    });
  });

  it('makes the top heading h2 when posts start at #', () => {
    render(<SamplePost />);
    expect(
      screen.getByRole('heading', { level: 2, name: 'Top heading' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 4, name: 'Third-level heading' })
    ).toBeInTheDocument();
  });

  it('makes the top heading h2 when posts start at ##', () => {
    render(<SectionsPost />);
    expect(
      screen.getByRole('heading', { level: 2, name: 'First section' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: 'Detail' })
    ).toBeInTheDocument();
  });

  it('highlights code as JavaScript and makes it keyboard scrollable', () => {
    const { container } = render(<SamplePost />);
    const pre = container.querySelector('pre');
    expect(pre).toHaveAttribute('data-language', 'js');
    expect(pre).toHaveAttribute('tabindex', '0');
  });

  it('lazy-loads images', () => {
    render(<SamplePost />);
    expect(screen.getByRole('img', { name: 'A sample image' })).toHaveAttribute(
      'loading',
      'lazy'
    );
  });
});
