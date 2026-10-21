// Build-time reading time for Markdown posts. Runs while Vite compiles each
// post and adds `readingMinutes` to its frontmatter, so nothing is counted in
// the browser and the number updates whenever a post changes.

export const WORDS_PER_MINUTE = 230;

// Readers skim code, so a word in a code block counts as half a word
export const CODE_WEIGHT = 0.5;

interface MdastNode {
  type: string;
  value?: string;
  children?: MdastNode[];
}

export function countWords(text: string) {
  return text.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu)?.length ?? 0;
}

export function readingMinutes(proseWords: number, codeWords: number) {
  const words = proseWords + codeWords * CODE_WEIGHT;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function remarkReadingTime() {
  return (tree: MdastNode) => {
    let prose = 0;
    let code = 0;
    const walk = (node: MdastNode) => {
      if (node.type === 'code') code += countWords(node.value ?? '');
      else if (node.type === 'text' || node.type === 'inlineCode')
        prose += countWords(node.value ?? '');
      node.children?.forEach(walk);
    };
    walk(tree);

    // Add to the YAML frontmatter before remark-mdx-frontmatter exports it.
    // A post can set its own `readingMinutes` to override the estimate.
    const yaml = tree.children?.find((node) => node.type === 'yaml');
    if (yaml && !/^readingMinutes:/m.test(yaml.value ?? '')) {
      yaml.value = `${yaml.value ?? ''}\nreadingMinutes: ${readingMinutes(prose, code)}`;
    }
  };
}
