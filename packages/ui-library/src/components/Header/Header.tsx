import React from 'react';
import { Button } from '../Button/Button';

type User = {
  name: string;
};

export interface HeaderProps {
  user?: User;
  onLogin?: () => void;
  onLogout?: () => void;
  onCreateAccount?: () => void;
  extraContent?: React.ReactNode;
  logoUrl?: string;
  appName?: string;
}

export const Header = ({ 
  user, 
  onLogin, 
  onLogout, 
  onCreateAccount,
  extraContent,
  logoUrl,
  appName = "3A Softwares"
}: HeaderProps) => (
  <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200">
    <div className="flex items-center justify-between px-5 py-4">
      <div className="flex items-center gap-3d">
        {logoUrl ? (
          <img src={logoUrl} alt={appName} width={32} height={32} className="object-contain" />
        ) : (
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            {appName.charAt(0)}
          </div>
        )}
        <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-none m-0">{appName}</h1>
      </div>
      <div className="flex items-center gap-3">
        {extraContent}
        {user ? (
          <>
            <span className="text-sm text-gray-700 dark:text-gray-300 mr-2.5">
              Welcome, <b className="font-bold text-gray-900 dark:text-white">{user.name}</b>!
            </span>
            <Button size="sm" onClick={onLogout} variant="outline">Log Out</Button>
          </>
        ) : (
          <>
            <Button size="sm" onClick={onLogin} variant="outline">Log In</Button>
            <Button variant="primary" size="sm" onClick={onCreateAccount}>Sign Up</Button>
          </>
        )}
      </div>
    </div>
  </header>
);
