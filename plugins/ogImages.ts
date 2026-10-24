// Build-time social previews. After Vite writes dist/, this draws 1200×630
// PNGs into dist/og/: home.png, which index.html points at for every page
// without its own preview, and one per post. For each post it also writes
// dist/writing/<slug>/index.html: a copy of the built index.html with that
// post's title, description and image in the meta tags. Crawlers don't run
// JavaScript, so without these every shared link would show the home page
// preview. Vercel serves real files before the SPA rewrite, so visitors still
// get the same app.

import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import type { Plugin } from 'vite';
import { parse } from 'yaml';

// kenechukwu.dev redirects here, so previews link to it directly
export const SITE_URL = 'https://www.kenechukwu.dev';
export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

export interface OgPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags?: string[];
}

// What a preview image shows, top to bottom
export interface OgCard {
  eyebrow: string;
  title: string;
  subtitle?: string;
  // The first item is bold; items are separated by a dot
  footer: string[];
}

type Font = Parameters<typeof satori>[1]['fonts'][number];

export async function readPosts(dir: string): Promise<OgPost[]> {
  const files = (await readdir(dir)).filter((file) => file.endsWith('.md'));
  return Promise.all(
    files.map(async (file) => {
      const source = await readFile(path.join(dir, file), 'utf8');
      const yaml = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source)?.[1] ?? '';
      const { title, date, description, tags } = (parse(yaml) ?? {}) as OgPost;
      const slug = file.slice(0, -'.md'.length);
      return { slug, title, date, description, tags };
    })
  );
}

export async function loadFonts(): Promise<Font[]> {
  // Satori reads WOFF but not WOFF2; @fontsource/inter ships both
  const require = createRequire(import.meta.url);
  const file = (weight: number) =>
    readFile(
      require.resolve(
        `@fontsource/inter/files/inter-latin-${weight}-normal.woff`
      )
    );
  return [
    { name: 'Inter', data: await file(400), weight: 400, style: 'normal' },
    { name: 'Inter', data: await file(600), weight: 600, style: 'normal' }
  ];
}

const dateFormat = new Intl.DateTimeFormat('en-IE', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC'
});

export const HOME_CARD: OgCard = {
  eyebrow: '',
  title: 'Kenechukwu Ajufo',
  subtitle: 'Frontend Engineer · Dublin, Ireland',
  footer: ['kenechukwu.dev']
};

export function postCard(post: OgPost): OgCard {
  return {
    eyebrow: 'kenechukwu.dev / writing',
    // No @fontsource/inter subset has →, so "v5 → v6" would draw a box
    title: post.title.replaceAll('→', 'to'),
    footer: ['Kenechukwu Ajufo', dateFormat.format(new Date(post.date))]
  };
}

// Satori takes React-shaped elements; building them by hand avoids JSX here
type Element = Parameters<typeof satori>[0];
const h = (style: object, children: string | Element[]) =>
  ({
    type: 'div',
    props: { style: { display: 'flex', ...style }, children }
  }) as Element;

export async function renderOgImage(card: OgCard, fonts: Font[]) {
  const [first, ...rest] = card.footer;
  // Colours match the light theme: neutral-700/500 text, green-700 accent
  // Satori sizes boxes without their padding or borders, so a full-size root
  // with padding would overflow; the margin on the inner box keeps it inside
  const svg = await satori(
    h(
      {
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        fontFamily: 'Inter'
      },
      [
        h({ height: 12, backgroundColor: '#15803d' }, []),
        h(
          {
            flexGrow: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            margin: 80
          },
          [
            h({ fontSize: 28, color: '#737373' }, card.eyebrow),
            h({ flexDirection: 'column', gap: 20 }, [
              h(
                {
                  fontSize: card.title.length > 60 ? 60 : 72,
                  fontWeight: 600,
                  lineHeight: 1.15,
                  color: '#404040'
                },
                card.title
              ),
              ...(card.subtitle
                ? [h({ fontSize: 36, color: '#737373' }, card.subtitle)]
                : [])
            ]),
            h({ fontSize: 28, color: '#737373', gap: 16 }, [
              h({ color: '#404040', fontWeight: 600 }, first),
              ...rest.flatMap((item) => [h({}, '·'), h({}, item)])
            ])
          ]
        )
      ]
    ),
    { width: OG_WIDTH, height: OG_HEIGHT, fonts }
  );
  return new Resvg(svg).render().asPng();
}

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

function setMeta(html: string, key: string, value: string) {
  const tag = new RegExp(
    `(<meta\\s+(?:name|property)="${key}"\\s+content=")[^"]*(")`
  );
  if (!tag.test(html)) throw new Error(`index.html has no ${key} meta tag`);
  return html.replace(tag, `$1${escapeHtml(value)}$2`);
}

export function postHtml(template: string, post: OgPost) {
  const title = `${post.title} — Kenechukwu Ajufo`;
  const url = `${SITE_URL}/writing/${post.slug}`;
  const image = `${SITE_URL}/og/${post.slug}.png`;
  const tags: [string, string][] = [
    ['description', post.description],
    ['og:type', 'article'],
    ['og:url', url],
    ['og:title', title],
    ['og:description', post.description],
    ['og:image', image],
    ['twitter:title', title],
    ['twitter:description', post.description],
    ['twitter:image', image]
  ];
  // index.html has no article:tag tags to fill, so these are added
  const articleTags = (post.tags ?? [])
    .map(
      (tag) =>
        `<meta property="article:tag" content="${escapeHtml(tag)}" />\n  `
    )
    .join('');
  return tags.reduce(
    (html, [key, value]) => setMeta(html, key, value),
    template
      .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`)
      .replace('</head>', `${articleTags}</head>`)
  );
}

// postsDir is relative to the project root
export function ogImages(postsDir: string): Plugin {
  let outDir = '';
  return {
    name: 'og-images',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
      postsDir = path.resolve(config.root, postsDir);
    },
    async closeBundle() {
      const [posts, fonts, template] = await Promise.all([
        readPosts(postsDir),
        loadFonts(),
        readFile(path.join(outDir, 'index.html'), 'utf8')
      ]);
      await mkdir(path.join(outDir, 'og'), { recursive: true });
      await Promise.all([
        writeFile(
          path.join(outDir, 'og', 'home.png'),
          await renderOgImage(HOME_CARD, fonts)
        ),
        ...posts.map(async (post) => {
          const pageDir = path.join(outDir, 'writing', post.slug);
          await mkdir(pageDir, { recursive: true });
          await Promise.all([
            writeFile(
              path.join(outDir, 'og', `${post.slug}.png`),
              await renderOgImage(postCard(post), fonts)
            ),
            writeFile(
              path.join(pageDir, 'index.html'),
              postHtml(template, post)
            )
          ]);
        })
      ]);
    }
  };
}
