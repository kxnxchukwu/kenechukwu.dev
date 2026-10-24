import { Link, useParams } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import {
  formatDate,
  getPost,
  type Post as PostData
} from '../../content/writing/posts';
import { ArrowBackIcon } from '../Icons';
import { NotFound } from '../NotFound';
import { Tags } from './Tags';

function PostArticle({ post }: Readonly<{ post: PostData }>) {
  useDocumentTitle(`${post.title} — Kenechukwu Ajufo`);
  const { Content } = post;
  return (
    <article className="md:max-w-[520px] m-6 md:m-20 mt-[50px]">
      <p className="text-xs text-neutral-500 pb-1">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span aria-hidden="true"> · </span>
        {post.readingMinutes} min read
      </p>
      <h1 className="text-neutral-700 font-semibold pb-6">{post.title}</h1>
      <div className="post">
        <Content />
      </div>
      {/* Tags come after the post, so nothing clickable sits between the
          title and the first line, and they're there when the reader is
          looking for what to read next */}
      <footer>
        {!!post.tags?.length && (
          <div className="pb-6">
            <p className="text-xs text-neutral-500 pb-2">more on</p>
            <Tags tags={post.tags} />
          </div>
        )}
        {/* Matches the back link at the top of the page */}
        <Link
          to="/writing"
          className="hover:text-green-700 inline-flex items-center gap-1"
        >
          <ArrowBackIcon size={20} /> back to writing
        </Link>
      </footer>
    </article>
  );
}

export default function Post() {
  const { slug } = useParams();
  const post = getPost(slug);
  return post ? <PostArticle post={post} /> : <NotFound />;
}
