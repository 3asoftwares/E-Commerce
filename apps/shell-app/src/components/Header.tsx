
import React from 'react';
import { Header as UIHeader } from '@e-commerce/ui-library';
import { useUIStore } from '../store/uiStore';
import { Logo3A } from '@e-commerce/utils';

interface HeaderProps {
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLoginClick, onSignupClick }) => {
  const { theme, toggleTheme, language, setLanguage } = useUIStore();

  return (
    <UIHeader
      logoUrl={Logo3A}
      appName="3A Softwares"
      theme={theme}
      onToggleTheme={toggleTheme}
      language={language}
      onLanguageChange={setLanguage}
      onLogin={onLoginClick}
      onCreateAccount={onSignupClick}
    />
  );
};
