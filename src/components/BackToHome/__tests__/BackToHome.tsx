import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BackToHome from '../BackToHome';

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <BackToHome />
    </MemoryRouter>
  );

describe('BackToHome', () => {
  it('renders a link pointing to /', () => {
    renderAt('/projects');
    const link = screen.getByRole('link', { name: /back to home/i });
    expect(link).toHaveAttribute('href', '/');
  });

  it('leads home from the writing list', () => {
    renderAt('/writing');
    expect(screen.getByRole('link', { name: /back to home/i })).toHaveAttribute(
      'href',
      '/'
    );
  });

  it('leads back to the writing list from a post', () => {
    renderAt('/writing/some-post');
    const link = screen.getByRole('link', { name: /back to writing/i });
    expect(link).toHaveAttribute('href', '/writing');
    expect(link).toHaveTextContent('back to writing');
  });
});
