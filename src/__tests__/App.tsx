import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

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
