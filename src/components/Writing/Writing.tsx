import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { formatDate, posts } from '../../content/writing/posts';

export default function Writing() {
  useDocumentTitle('Writing — Kenechukwu Ajufo');
  return (
    <div className="md:max-w-[420px] m-6 md:m-20 mt-[50px]">
      <h1 className="text-neutral-700 font-semibold pb-6">writing</h1>
      {posts.map(({ slug, title, date, description }) => (
        <article key={slug} className="mb-6">
          <p className="text-xs text-neutral-500 pb-1">
            <time dateTime={date}>{formatDate(date)}</time>
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
        </article>
      ))}
    </div>
  );
}
