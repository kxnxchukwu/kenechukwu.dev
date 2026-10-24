import { Link } from 'react-router-dom';

// A post's tags as chips, styled like the technology chips on projects. Each
// links to the writing list filtered by that tag; `current` marks the tag
// being viewed. min-h-6 keeps each link a 24px touch target, and green-800
// rather than the usual green-700 keeps 4.5:1 on the light chip.
export function Tags({
  tags,
  current,
  className = ''
}: Readonly<{ tags?: string[]; current?: string; className?: string }>) {
  if (!tags?.length) return null;
  return (
    <ul aria-label="Tags" className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <li key={tag}>
          <Link
            to={`/writing/tags/${encodeURIComponent(tag)}`}
            aria-current={tag === current ? 'page' : undefined}
            className="inline-flex items-center min-h-6 px-2.5 rounded-full whitespace-nowrap text-[11px] text-[var(--chip-fg)] bg-[var(--chip-bg)] hover:text-green-800 aria-[current=page]:text-green-800"
          >
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
