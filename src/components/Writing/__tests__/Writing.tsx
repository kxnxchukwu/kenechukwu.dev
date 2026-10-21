import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Writing from '../Writing';
import Post from '../Post';

// Stand-in posts keep these tests independent of the real content
vi.mock('../../../content/writing/posts', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../../../content/writing/posts')>();
  const posts = [
    {
      slug: 'newer-post',
      title: 'Newer post',
      date: '2024-03-02',
      description: 'The newer description',
      Content: () => <p>Newer body</p>
    },
    {
      slug: 'older-post',
      title: 'Older post',
      date: '2023-11-20',
      description: 'The older description',
      Content: () => <p>Older body</p>
    }
  ];
  return {
    ...actual,
    posts,
    getPost: (slug?: string) => posts.find((post) => post.slug === slug)
  };
});

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/writing" element={<Writing />} />
        <Route path="/writing/:slug" element={<Post />} />
      </Routes>
    </MemoryRouter>
  );

describe('Writing', () => {
  it('lists every post in order, linking to its page', () => {
    renderAt('/writing');
    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(2);
    expect(
      within(articles[0]).getByRole('link', { name: 'Newer post' })
    ).toHaveAttribute('href', '/writing/newer-post');
    expect(
      within(articles[1]).getByRole('link', { name: 'Older post' })
    ).toHaveAttribute('href', '/writing/older-post');
    expect(screen.getByText('The newer description')).toBeInTheDocument();
  });

  it('shows each post date in a readable format', () => {
    renderAt('/writing');
    expect(screen.getByText('2 March 2024')).toHaveAttribute(
      'datetime',
      '2024-03-02'
    );
  });

  it('sets the document title', () => {
    renderAt('/writing');
    expect(document.title).toBe('Writing — Kenechukwu Ajufo');
  });
});

describe('Post', () => {
  it('renders the title, date and body', () => {
    renderAt('/writing/older-post');
    expect(
      screen.getByRole('heading', { level: 1, name: 'Older post' })
    ).toBeInTheDocument();
    expect(screen.getByText('20 November 2023')).toBeInTheDocument();
    expect(screen.getByText('Older body')).toBeInTheDocument();
    expect(document.title).toBe('Older post — Kenechukwu Ajufo');
  });

  it('links back to the list of posts', () => {
    renderAt('/writing/newer-post');
    expect(screen.getByRole('link', { name: /all writing/i })).toHaveAttribute(
      'href',
      '/writing'
    );
  });

  it('shows the 404 page for an unknown post', () => {
    renderAt('/writing/not-a-post');
    expect(screen.getByRole('heading', { name: /^404$/i })).toBeInTheDocument();
  });
});
