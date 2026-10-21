import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tailwind from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import mdx from '@mdx-js/rollup';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import rehypePrettyCode from 'rehype-pretty-code';
import { remarkReadingTime } from './plugins/remarkReadingTime';
import { ogImages } from './plugins/ogImages';

interface HastNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

const headingLevel = (node: HastNode) => {
  const match = /^h([1-6])$/.exec(node.tagName ?? '');
  return match ? Number(match[1]) : undefined;
};

// Post headings sit under the page's own h1, so the post's top heading level
// (# or ##) becomes h2 and the rest keep their relative depth.
// Images load lazily and code blocks get a tab stop so keyboard users can scroll them.
function rehypePostElements() {
  return (tree: HastNode) => {
    let topLevel = 6;
    const findTop = (node: HastNode) => {
      const level = headingLevel(node);
      if (level) topLevel = Math.min(topLevel, level);
      node.children?.forEach(findTop);
    };
    findTop(tree);
    const shift = 2 - topLevel;

    const walk = (node: HastNode) => {
      if (node.type === 'element' && node.tagName) {
        const level = headingLevel(node);
        if (level) node.tagName = `h${Math.min(level + shift, 6)}`;
        if (node.tagName === 'img') {
          node.properties = {
            ...node.properties,
            loading: 'lazy',
            decoding: 'async'
          };
        }
        if (node.tagName === 'pre') {
          node.properties = { ...node.properties, tabIndex: 0 };
        }
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [
          remarkFrontmatter,
          remarkReadingTime,
          remarkMdxFrontmatter
        ],
        rehypePlugins: [
          [
            rehypePrettyCode,
            {
              theme: {
                // The default light theme's comment grey is 4.2:1 on --code-bg
                light: 'github-light-high-contrast',
                dark: 'github-dark-default'
              },
              keepBackground: false,
              defaultLang: 'js'
            }
          ],
          rehypePostElements
        ]
      })
    },
    react(),
    tailwindcss(),
    ogImages('src/content/writing')
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    include: ['**/__tests__/**/*.{ts,tsx}'],
    coverage: {
      exclude: ['**/index.ts', '**/*.css', '**/main.tsx']
    }
  },
  css: {
    postcss: {
      plugins: [tailwind, autoprefixer]
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      },
      treeshake: {
        moduleSideEffects: false
      }
    }
  }
});
