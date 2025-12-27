import React from 'react';
import { useUIStore } from '../store/uiStore';

export const Header: React.FC = () => {
  const { theme, toggleTheme, language, setLanguage } = useUIStore();

  return (
    <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            3A Softwares
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-sm btn-circle"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="select select-bordered select-sm dark:bg-neutral-800 dark:border-neutral-600"
          >
            <option value="en">EN</option>
            <option value="es">HI</option>
            <option value="es">CA</option>
          </select>
        </div>
      </div>
    </header>
  );
};
