import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSellerAuthStore } from '../store/authStore';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useSellerAuthStore();
  const [isOpen, setIsOpen] = useState(true);

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const getLinkClass = (path: string) => {
    const base = 'flex items-center px-6 py-3 rounded-lg transition-all duration-200';
    return isActive(path)
      ? `${base} bg-blue-600 text-white font-semibold`
      : `${base} text-gray-700 hover:bg-gray-100`;
  };

  const menuItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: '📊',
    },
    {
      path: '/products',
      label: 'My Products',
      icon: '📦',
    },
    {
      path: '/orders',
      label: 'Orders',
      icon: '🛒',
    },
    {
      path: '/earnings',
      label: 'Earnings',
      icon: '💰',
    },
  ];

  return (
    <>
      {/* Sidebar Toggle Button - Mobile Only */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-24 z-40 p-2 rounded-lg bg-blue-600 text-white lg:hidden"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-20 h-[calc(100vh-80px)] w-64 bg-white border-r border-gray-200 shadow-lg transition-transform duration-300 z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6">
          {/* User Info */}
          <div className="mb-8 pb-6 border-b border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white font-bold mb-3">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h3 className="font-semibold text-gray-900">{user?.name}</h3>
            <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={getLinkClass(item.path)}
                onClick={() => {
                  // Close sidebar on mobile when clicking a link
                  if (window.innerWidth < 1024) {
                    setIsOpen(false);
                  }
                }}
              >
                <span className="text-xl mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={() => {
              localStorage.removeItem('user');
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('tokenExpiry');
              window.location.href = 'http://localhost:3000';
            }}
            className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-semibold"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Overlay - Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
