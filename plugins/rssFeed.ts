// Build-time RSS feed. After Vite writes dist/, this writes dist/rss.xml
// listing every post, newest first, with its title, link, date, description
// and tags, so people can follow the writing in a feed reader. Vercel serves
// it as a static file before the SPA rewrite.

import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Plugin } from 'vite';
import { readPosts, SITE_URL, type OgPost } from './ogImages';

export const FEED_PATH = '/rss.xml';
export const FEED_TITLE = 'Kenechukwu Ajufo — Writing';

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

// RSS wants RFC 822 dates; toUTCString gives "Wed, 21 Oct 2026 00:00:00 GMT"
const rfc822 = (date: string) => new Date(date).toUTCString();

function item(post: OgPost) {
  const url = `${SITE_URL}/writing/${post.slug}`;
  const categories = (post.tags ?? []).map(
    (tag) => `\n      <category>${escapeXml(tag)}</category>`
  );
  return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(post.date)}</pubDate>
      <description>${escapeXml(post.description)}</description>${categories.join('')}
    </item>`;
}

export function rssXml(posts: OgPost[]) {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  // The newest post's date, so the feed only changes when a post does
  const updated = sorted[0]
    ? `\n    <lastBuildDate>${rfc822(sorted[0].date)}</lastBuildDate>`
    : '';
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${SITE_URL}/writing</link>
    <description>Writing by Kenechukwu Ajufo, a frontend engineer in Dublin, on React, TypeScript and the work around them.</description>
    <language>en-ie</language>
    <atom:link href="${SITE_URL}${FEED_PATH}" rel="self" type="application/rss+xml" />${updated}${sorted.map(item).join('')}
  </channel>
</rss>
`;
}

// postsDir is relative to the project root
export function rssFeed(postsDir: string): Plugin {
  let outDir = '';
  return {
    name: 'rss-feed',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
      postsDir = path.resolve(config.root, postsDir);
    },
    async closeBundle() {
      const posts = await readPosts(postsDir);
      await writeFile(path.join(outDir, FEED_PATH), rssXml(posts));
    }
  };
}
