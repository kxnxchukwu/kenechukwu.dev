import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeToggle from '../ThemeToggle';

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  it('offers the dark theme when the page is light', () => {
    render(<ThemeToggle />);
    expect(
      screen.getByRole('button', { name: /switch to dark theme/i })
    ).toHaveTextContent('dark');
  });

  it('switches to dark and back on click', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole('button', { name: /switch to dark/i }));
    expect(document.documentElement.dataset.theme).toBe('dark');

    await user.click(screen.getByRole('button', { name: /switch to light/i }));
    expect(document.documentElement.dataset.theme).toBe('light');
  });
});
