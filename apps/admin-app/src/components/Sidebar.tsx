import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUIStore } from '../store/uiStore';
import { Button } from '@e-commerce/ui-library';

interface NavItem {
  path: string;
  icon: string;
  label: string;
}

const navItems: NavItem[] = [
  { path: '/', icon: '📊', label: 'Dashboard' },
  { path: '/users', icon: '👥', label: 'Users' },
  { path: '/products', icon: '📦', label: 'Products' },
  { path: '/orders', icon: '🛒', label: 'Orders' },
  { path: '/coupons', icon: '🎟️', label: 'Coupons' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  if (!sidebarOpen) {
    return (
      <div className="w-16 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen transition-all duration-200">
        <div className="p-2">
          <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="sm"
            className="w-full"
            aria-label="Open sidebar"
          >
            ☰
          </Button>
        </div>
        <nav className="p-2 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-center px-2 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              title={item.label}
            >
              <span className="text-xl">{item.icon}</span>
            </Link>
          ))}
        </nav>
      </div>
    );
  }

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen transition-all duration-200">
      <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Navigation</h2>
        <Button
          onClick={toggleSidebar}
          variant="ghost"
          size="sm"
          aria-label="Close sidebar"
        >
          ◄
        </Button>
      </div>
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};
