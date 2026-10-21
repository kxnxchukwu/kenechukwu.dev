import { describe, expect, it } from 'vitest';
import {
  countWords,
  readingMinutes,
  remarkReadingTime,
  WORDS_PER_MINUTE
} from '../remarkReadingTime';

interface Node {
  type: string;
  value?: string;
  children?: Node[];
}

const text = (value: string): Node => ({ type: 'text', value });
const words = (count: number) => Array(count).fill('word').join(' ');

const tree = (yaml: string | null, ...children: Node[]) => ({
  type: 'root',
  children: [
    ...(yaml === null ? [] : [{ type: 'yaml', value: yaml }]),
    ...children
  ]
});

const run = (root: ReturnType<typeof tree>) => {
  remarkReadingTime()(root);
  return root.children.find((node) => node.type === 'yaml')?.value;
};

describe('countWords', () => {
  it('counts words, keeping contractions together', () => {
    expect(countWords("I didn't stop to design a custom hook.")).toBe(8);
  });

  it('ignores punctuation and symbols', () => {
    expect(countWords('() => { a, b } — ok!')).toBe(3);
  });

  it('returns 0 for empty text', () => {
    expect(countWords('')).toBe(0);
  });
});

describe('readingMinutes', () => {
  it('divides by the reading speed and rounds', () => {
    expect(readingMinutes(WORDS_PER_MINUTE * 5, 0)).toBe(5);
    expect(readingMinutes(WORDS_PER_MINUTE * 2.6, 0)).toBe(3);
  });

  it('counts code at half weight', () => {
    expect(readingMinutes(0, WORDS_PER_MINUTE * 4)).toBe(2);
  });

  it('never goes below 1 minute', () => {
    expect(readingMinutes(0, 0)).toBe(1);
  });
});

describe('remarkReadingTime', () => {
  it('adds readingMinutes to the frontmatter', () => {
    const root = tree("title: 'Post'", {
      type: 'paragraph',
      children: [text(words(WORDS_PER_MINUTE * 3))]
    });
    expect(run(root)).toBe("title: 'Post'\nreadingMinutes: 3");
  });

  it('counts inline code as prose and code blocks at half weight', () => {
    const root = tree(
      "title: 'Post'",
      {
        type: 'paragraph',
        children: [{ type: 'inlineCode', value: words(WORDS_PER_MINUTE) }]
      },
      { type: 'code', value: words(WORDS_PER_MINUTE * 2) }
    );
    expect(run(root)).toBe("title: 'Post'\nreadingMinutes: 2");
  });

  it('keeps a reading time set by the post', () => {
    const root = tree('readingMinutes: 9', text(words(10)));
    expect(run(root)).toBe('readingMinutes: 9');
  });

  it('leaves files without frontmatter alone', () => {
    const root = tree(null, text(words(10)));
    expect(run(root)).toBeUndefined();
    expect(root.children).toHaveLength(1);
  });
});
