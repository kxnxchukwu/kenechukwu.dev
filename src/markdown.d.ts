// Markdown files are compiled to React components by @mdx-js/rollup (see vite.config.ts)
declare module '*.md' {
  import type { ComponentType } from 'react';

  export const frontmatter: Record<string, string>;
  const Content: ComponentType;
  export default Content;
}
