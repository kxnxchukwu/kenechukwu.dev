import { formatDate, getPost, posts } from '../posts';

describe('posts', () => {
  it('gives every post a slug, title, date and description', () => {
    for (const post of posts) {
      expect(post.slug).toMatch(/^[a-z0-9-]+$/);
      expect(post.title).toBeTruthy();
      expect(post.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(post.description).toBeTruthy();
    }
  });

  it('gives every post a whole-minute reading time', () => {
    for (const post of posts) {
      expect(Number.isInteger(post.readingMinutes)).toBe(true);
      expect(post.readingMinutes).toBeGreaterThan(0);
    }
  });

  it('sorts posts newest first', () => {
    const dates = posts.map((post) => post.date);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it('finds posts by slug', () => {
    for (const post of posts) {
      expect(getPost(post.slug)).toBe(post);
    }
    expect(getPost('not-a-post')).toBeUndefined();
    expect(getPost(undefined)).toBeUndefined();
  });

  it('formats dates as day, month and year', () => {
    expect(formatDate('2022-05-21')).toBe('21 May 2022');
  });
});
