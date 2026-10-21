// True when src/content/writing has at least one Markdown post. The writing
// link and routes stay hidden until then. A lazy glob only adds the file list
// to the main bundle, not the posts themselves.
export const hasPosts = Object.keys(import.meta.glob('./*.md')).length > 0;
