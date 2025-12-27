import React, { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store, useAppDispatch } from './store/store';
import { logout, setUser } from './store/authSlice';
import { Dashboard } from './pages/Dashboard';
import { Users } from './pages/Users';
import { Products } from './pages/Products';
import { Orders } from './pages/Orders';

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    if (userStr && token) {
      try {
        const user = JSON.parse(userStr);
        dispatch(setUser({ user, token }));
      } catch {}
    }
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = 'http://localhost:3000?logout=true';
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Header */}
      <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            👥 Admin Portal
          </h1>
          <div className="flex items-center space-x-4">
            <button className="btn btn-ghost btn-sm">Profile</button>
            <button className="btn btn-sm btn-outline" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 min-h-screen">
          <nav className="p-4 space-y-2">
            <Link
              to="/"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700"
            >
              <span>📊</span>
              <span>Dashboard</span>
            </Link>
            <Link
              to="/users"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700"
            >
              <span>👥</span>
              <span>Users</span>
            </Link>
            <Link
              to="/products"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700"
            >
              <span>📦</span>
              <span>Products</span>
            </Link>
            <Link
              to="/orders"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700"
            >
              <span>🛒</span>
              <span>Orders</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <Provider store={store}>
    <AppContent />
  </Provider>
);

export default App;
