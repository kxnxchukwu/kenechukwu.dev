import { render, screen } from '@testing-library/react';
import SamplePost, { frontmatter } from '../../../test/fixtures/sample-post.md';

describe('Markdown pipeline', () => {
  it('exports the frontmatter', () => {
    expect(frontmatter).toEqual({
      title: 'Sample post',
      date: '2024-01-15',
      description: 'A fixture for testing the Markdown pipeline.'
    });
  });

  it('shifts headings down a level under the page h1', () => {
    render(<SamplePost />);
    expect(
      screen.getByRole('heading', { level: 2, name: 'Top heading' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 4, name: 'Third-level heading' })
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
