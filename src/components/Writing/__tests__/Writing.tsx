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
      readingMinutes: 5,
      tags: ['react', 'typescript'],
      Content: () => <p>Newer body</p>
    },
    {
      slug: 'older-post',
      title: 'Older post',
      date: '2023-11-20',
      description: 'The older description',
      readingMinutes: 12,
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
        <Route path="/writing/tags/:tag" element={<Writing />} />
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

  it('shows the reading time next to each date', () => {
    renderAt('/writing');
    const articles = screen.getAllByRole('article');
    expect(within(articles[0]).getByText(/5 min read/)).toBeInTheDocument();
    expect(within(articles[1]).getByText(/12 min read/)).toBeInTheDocument();
  });

  it("lists each post's tags, and nothing for a post without them", () => {
    renderAt('/writing');
    const articles = screen.getAllByRole('article');
    const tags = within(articles[0]).getByRole('list', { name: 'Tags' });
    expect(
      within(tags)
        .getAllByRole('listitem')
        .map((item) => item.textContent)
    ).toEqual(['react', 'typescript']);
    expect(
      within(articles[1]).queryByRole('list', { name: 'Tags' })
    ).not.toBeInTheDocument();
  });

  it('links each tag to the list filtered by it', () => {
    renderAt('/writing');
    expect(screen.getByRole('link', { name: 'typescript' })).toHaveAttribute(
      'href',
      '/writing/tags/typescript'
    );
  });

  it('sets the document title', () => {
    renderAt('/writing');
    expect(document.title).toBe('Writing — Kenechukwu Ajufo');
  });
});

describe('Writing filtered by tag', () => {
  it('shows only posts with that tag', () => {
    renderAt('/writing/tags/typescript');
    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(1);
    expect(
      within(articles[0]).getByRole('link', { name: 'Newer post' })
    ).toBeInTheDocument();
  });

  it('names the tag, counts the posts and links back to all writing', () => {
    renderAt('/writing/tags/typescript');
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'writing tagged typescript'
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/^1 post/)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'show all writing' })
    ).toHaveAttribute('href', '/writing');
    expect(document.title).toBe('Writing tagged typescript — Kenechukwu Ajufo');
  });

  it('marks the tag being viewed', () => {
    renderAt('/writing/tags/typescript');
    expect(screen.getByRole('link', { name: 'typescript' })).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(screen.getByRole('link', { name: 'react' })).not.toHaveAttribute(
      'aria-current'
    );
  });

  it('shows the 404 page for a tag no post has', () => {
    renderAt('/writing/tags/not-a-tag');
    expect(screen.getByRole('heading', { name: /^404$/i })).toBeInTheDocument();
  });
});

describe('Post', () => {
  it('renders the title, date, reading time and body', () => {
    renderAt('/writing/older-post');
    expect(
      screen.getByRole('heading', { level: 1, name: 'Older post' })
    ).toBeInTheDocument();
    expect(screen.getByText('20 November 2023')).toBeInTheDocument();
    expect(screen.getByText(/12 min read/)).toBeInTheDocument();
    expect(screen.getByText('Older body')).toBeInTheDocument();
    expect(document.title).toBe('Older post — Kenechukwu Ajufo');
  });

  it("links the post's tags after the body, not under the title", () => {
    renderAt('/writing/newer-post');
    const tags = screen.getByRole('list', { name: 'Tags' });
    expect(within(tags).getByRole('link', { name: 'react' })).toHaveAttribute(
      'href',
      '/writing/tags/react'
    );
    expect(
      screen.getByText('Newer body').compareDocumentPosition(tags) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(screen.getByText('more on')).toBeInTheDocument();
  });

  it('leaves out the tags row for a post without tags', () => {
    renderAt('/writing/older-post');
    expect(
      screen.queryByRole('list', { name: 'Tags' })
    ).not.toBeInTheDocument();
    expect(screen.queryByText('more on')).not.toBeInTheDocument();
  });

  it('links back to the list of posts', () => {
    renderAt('/writing/newer-post');
    expect(
      screen.getByRole('link', { name: /back to writing/i })
    ).toHaveAttribute('href', '/writing');
  });

  it('shows the 404 page for an unknown post', () => {
    renderAt('/writing/not-a-post');
    expect(screen.getByRole('heading', { name: /^404$/i })).toBeInTheDocument();
  });
});
