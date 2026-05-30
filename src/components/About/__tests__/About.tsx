import { render, screen } from '@testing-library/react';
import About from '../About';

describe('About', () => {
  it('renders the about heading', () => {
    render(<About />);
    expect(
      screen.getByRole('heading', { name: /^about$/i })
    ).toBeInTheDocument();
  });

  it('renders the Front End Happy Hour link', () => {
    render(<About />);
    const link = screen.getByRole('link', { name: /frontend happy hour/i });
    expect(link).toHaveAttribute('href', 'https://frontendhappyhour.com/');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('renders the IconSet with social links', () => {
    render(<About />);
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument();
  });

  it('renders the Apple Music link', () => {
    render(<About />);
    const link = screen.getByRole('link', { name: /apple music/i });
    expect(link).toHaveAttribute(
      'href',
      expect.stringContaining('music.apple.com')
    );
  });
});
