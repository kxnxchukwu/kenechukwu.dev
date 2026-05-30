import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Home from '../Home';

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

  it('has a CV download link', () => {
    renderHome();
    const cvLink = screen.getByRole('link', { name: /kenechukwu's cv/i });
    expect(cvLink).toHaveAttribute('href', expect.stringMatching(/\.pdf$/));
  });
});
