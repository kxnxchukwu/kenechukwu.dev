import { renderHook } from '@testing-library/react';
import { useDocumentTitle } from '../useDocumentTitle';

describe('useDocumentTitle', () => {
  it('sets the document title', () => {
    renderHook(() => useDocumentTitle('Test Title'));
    expect(document.title).toBe('Test Title');
  });

  it('restores the previous title on unmount', () => {
    document.title = 'Original Title';
    const { unmount } = renderHook(() => useDocumentTitle('New Title'));
    expect(document.title).toBe('New Title');
    unmount();
    expect(document.title).toBe('Original Title');
  });

  it('updates the title when the input changes', () => {
    const { rerender } = renderHook(({ title }) => useDocumentTitle(title), {
      initialProps: { title: 'First' }
    });
    expect(document.title).toBe('First');
    rerender({ title: 'Second' });
    expect(document.title).toBe('Second');
  });
});
