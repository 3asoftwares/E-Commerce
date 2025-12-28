import React from 'react';
import { Header as UIHeader } from '@e-commerce/ui-library';
import { useUIStore } from '../store/uiStore';
import { useAppDispatch, useAppSelector } from '../store/store';
import { logout } from '../store/authSlice';
import { Logo3A } from '@e-commerce/utils';

export const Header: React.FC = () => {
  const { theme, toggleTheme, language, setLanguage } = useUIStore();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = 'http://localhost:3000?logout=true';
  };

  return (
    <UIHeader
      logoUrl={Logo3A}
      appName="Admin Portal"
      theme={theme}
      onToggleTheme={toggleTheme}
      language={language}
      onLanguageChange={setLanguage}
      user={user ? { name: user.name } : undefined}
      onLogout={handleLogout}
    />
  );
};
