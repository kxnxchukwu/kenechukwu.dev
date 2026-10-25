// @vitest-environment node
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { readPosts } from '../ogImages';
import { FEED_PATH, rssXml } from '../rssFeed';

const older = {
  slug: 'older-post',
  title: 'Older post',
  date: '2023-11-20',
  description: 'The older description'
};

const newer = {
  slug: 'newer-post',
  title: 'Tom & Jerry\'s "great" <escape>',
  date: '2024-03-02',
  description: 'Cats & mice.',
  tags: ['react', 'cats & mice']
};

const items = (xml: string) => xml.split('<item>').slice(1);

describe('rssXml', () => {
  const xml = rssXml([older, newer]);

  it('is an RSS 2.0 feed that points at itself', () => {
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain(
      '<atom:link href="https://www.kenechukwu.dev/rss.xml" rel="self" type="application/rss+xml" />'
    );
    expect(xml).toContain('<link>https://www.kenechukwu.dev/writing</link>');
  });

  it('lists posts newest first', () => {
    const [first, second] = items(xml);
    expect(first).toContain('/writing/newer-post');
    expect(second).toContain('/writing/older-post');
  });

  it('gives each post its link, date, description and tags, escaped', () => {
    const [first] = items(xml);
    expect(first).toContain(
      '<title>Tom &amp; Jerry&apos;s &quot;great&quot; &lt;escape&gt;</title>'
    );
    expect(first).toContain(
      '<link>https://www.kenechukwu.dev/writing/newer-post</link>'
    );
    expect(first).toContain(
      '<guid isPermaLink="true">https://www.kenechukwu.dev/writing/newer-post</guid>'
    );
    expect(first).toContain('<pubDate>Sat, 02 Mar 2024 00:00:00 GMT</pubDate>');
    expect(first).toContain('<description>Cats &amp; mice.</description>');
    expect(first).toContain('<category>react</category>');
    expect(first).toContain('<category>cats &amp; mice</category>');
  });

  it('leaves out categories for a post without tags', () => {
    const [, second] = items(xml);
    expect(second).not.toContain('<category>');
  });

  it('dates the feed by its newest post, so it only changes with a post', () => {
    expect(xml).toContain(
      '<lastBuildDate>Sat, 02 Mar 2024 00:00:00 GMT</lastBuildDate>'
    );
  });

  it('is still a valid, empty feed with no posts', () => {
    const empty = rssXml([]);
    expect(items(empty)).toHaveLength(0);
    expect(empty).not.toContain('lastBuildDate');
    expect(empty).toContain('</channel>');
  });

  it('lists every real post', async () => {
    const posts = await readPosts(
      path.resolve(__dirname, '../../src/content/writing')
    );
    expect(items(rssXml(posts))).toHaveLength(posts.length);
  });
});

describe('index.html', () => {
  it('links the feed from the page head', async () => {
    const html = await readFile(
      path.resolve(__dirname, '../../index.html'),
      'utf8'
    );
    expect(html).toMatch(
      new RegExp(
        `rel="alternate"\\s+type="application/rss\\+xml"[^>]*href="${FEED_PATH}"`
      )
    );
  });
});
