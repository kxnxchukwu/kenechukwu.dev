import { Link } from 'react-router-dom';
import { ArrowBackIcon } from '../Icons';

export default function BackToHome() {
  return (
    <div className="flex items-center justify-between w-[160px] overflow-hidden">
      <Link
        to="/"
        className="hover:text-green-700 flex items-center justify-between"
        aria-label="Back to Home"
      >
        <ArrowBackIcon size={20} /> {'  '} back to home
      </Link>
    </div>
  );
}
