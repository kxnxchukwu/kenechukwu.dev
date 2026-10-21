// @vitest-environment node
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  loadFonts,
  OG_HEIGHT,
  OG_WIDTH,
  postHtml,
  readPosts,
  renderOgImage
} from '../ogImages';

const post = {
  slug: 'my-post',
  title: 'Tom & Jerry\'s "great" <escape>',
  date: '2024-01-15',
  description: 'A post about cats & mice.'
};

const template = (key: string, value: string) =>
  key === 'title'
    ? `<title>${value}</title>`
    : `<meta\n      property="${key}"\n      content="${value}"\n    />`;

const keys = [
  'description',
  'og:type',
  'og:url',
  'og:title',
  'og:description',
  'og:image',
  'twitter:title',
  'twitter:description',
  'twitter:image'
];

const indexHtml = [
  template('title', 'Home'),
  ...keys.map((key) =>
    template(key, 'home value').replace(
      'property',
      key.startsWith('og:') ? 'property' : 'name'
    )
  )
].join('\n');

describe('postHtml', () => {
  const html = postHtml(indexHtml, post);
  const meta = (key: string) =>
    new RegExp(`(?:name|property)="${key}"\\s+content="([^"]*)"`).exec(
      html
    )?.[1];

  it('sets the page title, escaped', () => {
    expect(html).toContain(
      '<title>Tom &amp; Jerry\'s &quot;great&quot; &lt;escape&gt; — Kenechukwu Ajufo</title>'
    );
  });

  it("points the social tags at the post's URL and image", () => {
    expect(meta('og:type')).toBe('article');
    expect(meta('og:url')).toBe('https://kenechukwu.dev/writing/my-post');
    expect(meta('og:image')).toBe('https://kenechukwu.dev/og/my-post.png');
    expect(meta('twitter:image')).toBe(
      'https://kenechukwu.dev/og/my-post.png'
    );
  });

  it('uses the post description', () => {
    for (const key of ['description', 'og:description', 'twitter:description'])
      expect(meta(key)).toBe('A post about cats &amp; mice.');
  });

  it('replaces every home value', () => {
    expect(html).not.toContain('home value');
  });

  it('fails the build if index.html loses a tag', () => {
    expect(() =>
      postHtml(indexHtml.replace('og:image', 'og:picture'), post)
    ).toThrow('index.html has no og:image meta tag');
  });
});

describe('readPosts', () => {
  it('reads the slug and frontmatter of each Markdown file', async () => {
    const posts = await readPosts(
      path.resolve(__dirname, '../../src/test/fixtures')
    );
    expect(posts).toContainEqual({
      slug: 'sample-post',
      title: 'Sample post',
      date: '2024-01-15',
      description: 'A fixture for testing the Markdown pipeline.'
    });
  });

  it('reads every real post', async () => {
    const posts = await readPosts(
      path.resolve(__dirname, '../../src/content/writing')
    );
    for (const { title, date, description } of posts) {
      expect(title).toBeTruthy();
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(description).toBeTruthy();
    }
  });
});

describe('renderOgImage', () => {
  it(
    'draws a 1200×630 PNG',
    async () => {
      const png = await renderOgImage(post, await loadFonts());
      // PNG signature, then the IHDR chunk holds width and height
      expect(png.subarray(1, 4).toString()).toBe('PNG');
      expect(png.readUInt32BE(16)).toBe(OG_WIDTH);
      expect(png.readUInt32BE(20)).toBe(OG_HEIGHT);
    },
    30_000
  );
});

// Guards the regexes in postHtml against the real template
describe('index.html', () => {
  it('has every tag postHtml replaces', async () => {
    const html = await readFile(
      path.resolve(__dirname, '../../index.html'),
      'utf8'
    );
    expect(() => postHtml(html, post)).not.toThrow();
  });
});
