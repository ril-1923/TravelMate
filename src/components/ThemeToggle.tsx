import { MoonStarsFill, SunFill } from 'react-bootstrap-icons';
import { useApp } from '@/hooks/useApp';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useApp();
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      className={`btn btn-icon ${isDark ? 'btn-warning' : 'btn-dark'}`}
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label="Toggle theme"
    >
      {isDark ? <SunFill /> : <MoonStarsFill />}
    </button>
  );
}
