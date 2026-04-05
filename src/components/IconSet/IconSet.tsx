import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import XIcon from '@mui/icons-material/X';

export default function IconSet() {
  return (
    <div className="mt-10 flex items-center justify-between w-[120px] overflow-hidden">
      <a
        href="https://github.com/kxnxchukwu"
        target="_blank"
        aria-label="GitHub"
        className="hover:text-green-700"
      >
        <GitHubIcon />
      </a>
      <a
        href="https://instagram.com/kxnxchukwu"
        target="_blank"
        aria-label="Instagram"
        className="hover:text-green-700"
      >
        <InstagramIcon />
      </a>
      <a
        href="https://linkedin.com/in/kene-ajufo"
        target="_blank"
        aria-label="LinkedIn"
        className="hover:text-green-700"
      >
        <LinkedInIcon />
      </a>
      <a
        href="mailto:kenechukwu.ajufo@gmail.com"
        aria-label="Email"
        className="hover:text-green-700"
      >
        <MarkEmailUnreadIcon />
      </a>
      <a
        aria-label="X formerly Twitter"
        href="https://x.com/kxnxchukwu"
        target="_blank"
        className="hover:text-green-700"
      >
        <XIcon />
      </a>
    </div>
  );
}
