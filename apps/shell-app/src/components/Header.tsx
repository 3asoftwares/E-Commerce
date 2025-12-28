
import React from 'react';
import { Header as UIHeader, Button, Select } from '@e-commerce/ui-library';
import { useUIStore } from '../store/uiStore';
import { Logo3A } from '@e-commerce/utils';

interface HeaderProps {
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLoginClick, onSignupClick }) => {
  const { theme, toggleTheme, language, setLanguage } = useUIStore();

  const extraContent = (
    <div className='flex items-center'>
      <Button
        onClick={toggleTheme}
        variant="ghost"
        size="sm"
        className="text-xl px-3"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </Button>
      
      <Select
        value={language}
        onChange={setLanguage}
        size="sm"
        variant="outline"
        options={[
          { value: 'en', label: 'EN' },
          { value: 'hi', label: 'HI' },
          { value: 'ca', label: 'CA' }
        ]}
        className="min-w-[80px]"
      />
    </div>
  );

  return (
    <UIHeader
      logoUrl={Logo3A}
      appName="3A Softwares"
      extraContent={extraContent}
      onLogin={onLoginClick}
      onCreateAccount={onSignupClick}
    />
  );
};
