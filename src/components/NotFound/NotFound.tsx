import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="md:max-w-[420px] m-6 md:m-20 mt-[50px] lg:mt-[180px]">
      <h1 className="text-neutral-700 font-semibold pb-6">404</h1>
      <p className="leading-[25px] pb-4 text-neutral-500 font-[380] w-11/12">
        This page doesn't exist.
      </p>
      <Link
        to="/"
        className="text-neutral-900 border-b hover:text-neutral-400 text-sm"
      >
        back to home
      </Link>
    </div>
  );
}
