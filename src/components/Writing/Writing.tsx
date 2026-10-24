import { Link, useParams } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import {
  formatDate,
  posts,
  type Post as PostData
} from '../../content/writing/posts';
import { NotFound } from '../NotFound';
import { Tags } from './Tags';

function PostList({
  posts,
  tag
}: Readonly<{ posts: PostData[]; tag?: string }>) {
  useDocumentTitle(
    tag
      ? `Writing tagged ${tag} — Kenechukwu Ajufo`
      : 'Writing — Kenechukwu Ajufo'
  );
  return (
    <div className="md:max-w-[420px] m-6 md:m-20 mt-[50px]">
      <header className="pb-6">
        <h1 className="text-neutral-700 font-semibold">
          writing
          {tag && (
            <>
              {' '}
              <span className="text-neutral-500">tagged {tag}</span>
            </>
          )}
        </h1>
        {tag && (
          <p className="text-xs text-neutral-500 pt-1">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            <span aria-hidden="true"> · </span>
            <Link
              to="/writing"
              className="text-neutral-900 border-b hover:text-neutral-500"
            >
              show all writing
            </Link>
          </p>
        )}
      </header>
      {posts.map(({ slug, title, date, description, readingMinutes, tags }) => (
        <article key={slug} className="mb-8">
          <p className="text-xs text-neutral-500 pb-1">
            <time dateTime={date}>{formatDate(date)}</time>
            <span aria-hidden="true"> · </span>
            {readingMinutes} min read
          </p>
          <h2 className="text-neutral-700 font-semibold">
            <Link
              to={`/writing/${slug}`}
              className="text-neutral-700 hover:text-green-700"
            >
              {title}
            </Link>
          </h2>
          <p className="leading-[25px] pt-1 text-neutral-500 font-[380] text-sm w-11/12">
            {description}
          </p>
          <Tags tags={tags} current={tag} className="pt-3" />
        </article>
      ))}
    </div>
  );
}

// Serves /writing and /writing/tags/:tag; a tag with no posts is a 404
export default function Writing() {
  const { tag } = useParams();
  const shown = tag ? posts.filter((post) => post.tags?.includes(tag)) : posts;
  return tag && shown.length === 0 ? (
    <NotFound />
  ) : (
    <PostList posts={shown} tag={tag} />
  );
}
