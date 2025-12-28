
import React from 'react';
import { Button, Select } from '@e-commerce/ui-library';
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
          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="sm"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </Button>
          <Select
            value={language}
            onChange={(e:any) => setLanguage(e.target.value)}
            size="sm"
            options={[
              { value: 'en', label: 'EN' },
              { value: 'hi', label: 'HI' },
              { value: 'ca', label: 'CA' }
            ]}
          />
        </div>
      </div>
    </header>
  );
};
