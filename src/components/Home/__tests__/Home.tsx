import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Home from '../Home';

const writing = vi.hoisted(() => ({ hasPosts: false }));
vi.mock('../../../content/writing/hasPosts', () => writing);

const renderHome = () =>
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

describe('Home', () => {
  it('renders the name heading', () => {
    renderHome();
    expect(
      screen.getByRole('heading', { name: /kenechukwu ajufo/i })
    ).toBeInTheDocument();
  });

  it('renders links to work, projects and about', () => {
    renderHome();
    expect(
      screen.getByRole('link', { name: /work experience/i })
    ).toHaveAttribute('href', '/work');
    expect(
      screen.getByRole('link', { name: /my personal projects/i })
    ).toHaveAttribute('href', '/projects');
    expect(screen.getByRole('link', { name: /about me/i })).toHaveAttribute(
      'href',
      '/about'
    );
  });

  it('hides the writing link until there are posts', () => {
    writing.hasPosts = false;
    renderHome();
    expect(
      screen.queryByRole('link', { name: /my writing/i })
    ).not.toBeInTheDocument();
  });

  it('links to writing once there are posts', () => {
    writing.hasPosts = true;
    renderHome();
    expect(screen.getByRole('link', { name: /my writing/i })).toHaveAttribute(
      'href',
      '/writing'
    );
    writing.hasPosts = false;
  });

  it('renders an external link to eMatchi', () => {
    renderHome();
    const ematchiLink = screen.getByRole('link', { name: /ematchi game/i });
    expect(ematchiLink).toHaveAttribute(
      'href',
      'https://ematchi-game-six.vercel.app/'
    );
    expect(ematchiLink).toHaveAttribute('target', '_blank');
  });

  it('does not show social icons by default', () => {
    renderHome();
    expect(
      screen.queryByRole('link', { name: /github/i })
    ).not.toBeInTheDocument();
  });

  it('shows social icons when "get in touch" is clicked', async () => {
    const user = userEvent.setup();
    renderHome();
    await user.click(screen.getByText(/get in touch/i));
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument();
  });

  it('hides social icons when "get in touch" is clicked again', async () => {
    const user = userEvent.setup();
    renderHome();
    const trigger = screen.getByText(/get in touch/i);
    await user.click(trigger);
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument();
    await user.click(trigger);
    expect(
      screen.queryByRole('link', { name: /github/i })
    ).not.toBeInTheDocument();
  });

  it('makes "get in touch" a keyboard-operable button', async () => {
    const user = userEvent.setup();
    renderHome();
    const trigger = screen.getByRole('button', { name: /get in touch/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    trigger.focus();
    await user.keyboard('{Enter}');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument();
  });

  it('has a CV download link', () => {
    renderHome();
    const cvLink = screen.getByRole('link', { name: /download cv/i });
    expect(cvLink).toHaveAttribute('href', expect.stringMatching(/\.pdf$/));
  });

  it('sets the document title', () => {
    renderHome();
    expect(document.title).toBe('Kenechukwu Ajufo — Frontend Engineer');
  });
});
