import { Link, useParams } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import {
  formatDate,
  getPost,
  type Post as PostData
} from '../../content/writing/posts';
import { NotFound } from '../NotFound';

function PostArticle({ post }: Readonly<{ post: PostData }>) {
  useDocumentTitle(`${post.title} — Kenechukwu Ajufo`);
  const { Content } = post;
  return (
    <article className="md:max-w-[520px] m-6 md:m-20 mt-[50px]">
      <p className="text-xs text-neutral-500 pb-1">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
      </p>
      <h1 className="text-neutral-700 font-semibold pb-6">{post.title}</h1>
      <div className="post">
        <Content />
      </div>
      <Link
        to="/writing"
        className="text-neutral-900 border-b hover:text-neutral-500 text-sm"
      >
        all writing
      </Link>
    </article>
  );
}

export default function Post() {
  const { slug } = useParams();
  const post = getPost(slug);
  return post ? <PostArticle post={post} /> : <NotFound />;
}
