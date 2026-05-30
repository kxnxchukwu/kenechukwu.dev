import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BackToHome from '../BackToHome';

describe('BackToHome', () => {
  it('renders a link pointing to /', () => {
    render(
      <MemoryRouter>
        <BackToHome />
      </MemoryRouter>
    );
    const link = screen.getByRole('link', { name: /back to home/i });
    expect(link).toHaveAttribute('href', '/');
  });
});
