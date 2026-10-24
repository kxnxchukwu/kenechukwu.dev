import { Link, useLocation } from 'react-router-dom';
import { ArrowBackIcon } from '../Icons';

// Goes up one level: posts are two clicks from home, so they lead back to
// the writing list; every other page leads home
export default function BackToHome() {
  const { pathname } = useLocation();
  const [to, label] = pathname.startsWith('/writing/')
    ? ['/writing', 'writing']
    : ['/', 'home'];
  return (
    <div className="flex items-center justify-between w-[160px] overflow-hidden">
      <Link
        to={to}
        className="hover:text-green-700 flex items-center justify-between"
        aria-label={`Back to ${label}`}
      >
        <ArrowBackIcon size={20} /> {'  '} back to {label}
      </Link>
    </div>
  );
}
