import type { ComponentType } from 'react';

interface Frontmatter {
  title: string;
  date: string;
  description: string;
}

interface PostModule {
  default: ComponentType;
  frontmatter: Frontmatter;
}

export interface Post extends Frontmatter {
  slug: string;
  Content: ComponentType;
}

// Posts are Markdown files compiled to React components at build time.
// The slug is the file name, matching the URLs of the old Gatsby blog.
const modules = import.meta.glob<PostModule>('./*.md', { eager: true });

export const posts: Post[] = Object.entries(modules)
  .map(([path, { default: Content, frontmatter }]) => ({
    ...frontmatter,
    slug: path.replace(/^\.\/(.+)\.md$/, '$1'),
    Content
  }))
  .sort((a, b) => b.date.localeCompare(a.date));

export function getPost(slug: string | undefined) {
  return posts.find((post) => post.slug === slug);
}

const dateFormat = new Intl.DateTimeFormat('en-IE', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC'
});

export function formatDate(date: string) {
  return dateFormat.format(new Date(date));
}
