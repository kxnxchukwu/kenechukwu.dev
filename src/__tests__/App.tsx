import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { posts } from '../content/writing/posts';
import { hasPosts } from '../content/writing/hasPosts';

const renderWithRouter = (initialRoute: string) =>
  render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
    </MemoryRouter>
  );

describe('App routing', () => {
  it('renders the Home page at /', () => {
    renderWithRouter('/');
    expect(
      screen.getByRole('heading', { name: /kenechukwu ajufo/i })
    ).toBeInTheDocument();
  });

  it('renders the Experience page at /work', () => {
    renderWithRouter('/work');
    expect(
      screen.getByRole('heading', { name: /^work$/i })
    ).toBeInTheDocument();
  });

  it('renders the About page at /about', () => {
    renderWithRouter('/about');
    expect(
      screen.getByRole('heading', { name: /^about$/i })
    ).toBeInTheDocument();
  });

  it('renders the Projects page at /projects', () => {
    renderWithRouter('/projects');
    expect(
      screen.getByRole('heading', { name: /^projects$/i })
    ).toBeInTheDocument();
  });

  it.runIf(hasPosts)('renders the Writing page at /writing', async () => {
    renderWithRouter('/writing');
    expect(
      await screen.findByRole('heading', { name: /^writing$/i })
    ).toBeInTheDocument();
  });

  it.runIf(posts.length > 0)('renders a post at /writing/:slug', async () => {
    const [post] = posts;
    renderWithRouter(`/writing/${post.slug}`);
    expect(
      await screen.findByRole('heading', { level: 1, name: post.title })
    ).toBeInTheDocument();
  });

  const tag = posts.find((post) => post.tags?.length)?.tags?.[0];
  it.runIf(tag)('renders the writing list filtered by tag', async () => {
    renderWithRouter(`/writing/tags/${tag}`);
    expect(
      await screen.findByRole('heading', { name: `writing tagged ${tag}` })
    ).toBeInTheDocument();
  });

  it.runIf(!hasPosts)(
    'shows the 404 page at /writing until there are posts',
    () => {
      renderWithRouter('/writing');
      expect(
        screen.getByRole('heading', { name: /^404$/i })
      ).toBeInTheDocument();
    }
  );

  it('renders the NotFound page for unknown posts', async () => {
    renderWithRouter('/writing/not-a-post');
    expect(
      await screen.findByRole('heading', { name: /^404$/i })
    ).toBeInTheDocument();
  });

  it('renders the NotFound page for unknown routes', () => {
    renderWithRouter('/this-does-not-exist');
    expect(screen.getByRole('heading', { name: /^404$/i })).toBeInTheDocument();
  });

  it('does not show "back to home" on the home page', () => {
    renderWithRouter('/');
    expect(screen.queryByText(/back to home/i)).not.toBeInTheDocument();
  });

  it('shows "back to home" on non-home pages', () => {
    renderWithRouter('/work');
    expect(screen.getByText(/back to home/i)).toBeInTheDocument();
  });
});
