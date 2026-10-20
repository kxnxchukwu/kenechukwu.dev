import { DarkModeIcon, LightModeIcon } from '../Icons';
import { useTheme } from '../../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${next} theme`}
      className="fixed top-6 right-6 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
    >
      {theme === 'dark' ? (
        <LightModeIcon size={14} />
      ) : (
        <DarkModeIcon size={14} />
      )}
      <span>{next}</span>
    </button>
  );
}
