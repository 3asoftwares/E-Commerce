import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUIStore } from '../store/uiStore';
import { Button } from '@e-commerce/ui-library';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faUsers, faBox, faShoppingCart, faTicket, faBars, faChevronLeft, IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface NavItem {
  path: string;
  icon: IconDefinition;
  label: string;
}

const navItems: NavItem[] = [
  { path: '/', icon: faChartLine, label: 'Dashboard' },
  { path: '/users', icon: faUsers, label: 'Users' },
  { path: '/products', icon: faBox, label: 'Products' },
  { path: '/orders', icon: faShoppingCart, label: 'Orders' },
  { path: '/coupons', icon: faTicket, label: 'Coupons' },
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
            <FontAwesomeIcon icon={faBars} />
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
              <FontAwesomeIcon icon={item.icon} className="text-lg" />
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
          <FontAwesomeIcon icon={faChevronLeft} />
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
            <FontAwesomeIcon icon={item.icon} className="text-lg" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};
