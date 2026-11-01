import { render } from '@testing-library/react';
import { softBreaks } from '../softBreaks';

describe('softBreaks', () => {
  it('adds a line-break opportunity after each underscore', () => {
    const { container } = render(<h1>{softBreaks('DO_NOT_USE: a title')}</h1>);
    expect(container.querySelectorAll('wbr')).toHaveLength(2);
  });

  it('leaves the text itself unchanged', () => {
    const { container } = render(<h1>{softBreaks('DO_NOT_USE: a title')}</h1>);
    expect(container.textContent).toBe('DO_NOT_USE: a title');
  });

  it('adds nothing to a title without underscores', () => {
    const { container } = render(<h1>{softBreaks('A plain title')}</h1>);
    expect(container.querySelectorAll('wbr')).toHaveLength(0);
    expect(container.textContent).toBe('A plain title');
  });
});
