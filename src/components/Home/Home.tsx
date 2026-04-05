import { useState } from 'react';
import { IconSet } from '../IconSet';
import DownloadIcon from '@mui/icons-material/Download';
import { Link } from 'react-router-dom';

export default function Home() {
  const [showSocials, setShowSocials] = useState(false);

  const handleGetInTouchClick = () => {
    setShowSocials(!showSocials);
  };

  return (
    <div className="md:max-w-[420px] m-6 md:m-20 text-neutral-500 font-[380] mt-[50px] lg:mt-[180px]">
      <h1 className="text-neutral-700 font-semibold pb-6">kenechukwu ajufo</h1>

      <p className="leading-[25px] pb-4 text-neutral-500">
        Frontend Engineer based in Dublin, Ireland.
      </p>

      <p className="leading-[25px] pb-4 text-neutral-500 w-11/12">
        I specialise in building clean, thoughtful web interfaces with React and
        TypeScript. I currently work at{' '}
        <a
          aria-label="Poppulo"
          href="https://poppulo.com/"
          className="text-neutral-900 border-b hover:text-neutral-400"
        >
          Poppulo
        </a>
        , working on their digital signage platform. Before that, I built
        features for a cloud-based CRM at{' '}
        <a
          aria-label="bxp software"
          href="https://www.bxpsoftware.com/"
          className="text-neutral-900 border-b hover:text-neutral-400"
        >
          bxp software
        </a>
        .
      </p>

      <p className="leading-[25px] pb-4 text-neutral-500 w-11/12">
        I'm currently open to new opportunities — frontend or full-stack roles
        where craft and attention to detail matter.
      </p>

      <div className="mt-4">
        <p className="leading-[25px] pb-4 text-neutral-500 w-11/12">
          Take a look at my{' '}
          <Link
            aria-label="work experience"
            to="/work"
            className="text-green-800 underline"
          >
            work experience
          </Link>
          {', some recent '}
          <Link
            aria-label="my personal projects"
            to="/projects"
            className="text-indigo-600 underline"
          >
            projects
          </Link>
          {', or a little more '}
          <Link
            aria-label="about me"
            to="/about"
            className="text-neutral-900 underline"
          >
            about me
          </Link>
          {". Or if you're bored, play "}
          <a
            aria-label="eMatchi Game"
            href="https://ematchi-game-six.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-900 underline hover:text-neutral-400"
          >
            eMatchi
          </a>
          .
        </p>

        <p className="leading-[25px] pb-4 text-neutral-500 w-11/12">
          Feel free to{' '}
          <span
            onClick={handleGetInTouchClick}
            className="underline cursor-pointer"
          >
            get in touch
          </span>
          .
        </p>
        <a
          aria-label="kenechukwu's CV"
          href="/kenechukwu-ajufo-cv.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-neutral-700 transition-colors"
        >
          <span>download cv</span>
          <DownloadIcon style={{ fontSize: 14 }} />
        </a>

        {showSocials && <IconSet />}
      </div>
    </div>
  );
}
