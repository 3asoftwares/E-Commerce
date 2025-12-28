import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store, useAppDispatch } from './store/store';
import { setUser } from './store/authSlice';
import { Dashboard } from './pages/Dashboard';
import { Users } from './pages/Users';
import { Products } from './pages/Products';
import { Orders } from './pages/Orders';
import { Coupons } from './pages/Coupons';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { useUIStore } from './store/uiStore';
import { isTokenExpired, validateUserRole, clearAuth } from '@e-commerce/utils';

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { theme } = useUIStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    // Extract auth data from query parameters and store in localStorage
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');
    const tokenExpiry = params.get('tokenExpiry');
    const user = params.get('user');
    
    // If auth data is in URL params, store it in localStorage
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      if (tokenExpiry) localStorage.setItem('tokenExpiry', tokenExpiry);
      if (user) localStorage.setItem('user', user);
    }

    // Check if token has expired
    if (isTokenExpired()) {
      clearAuth();
      window.location.href = 'http://localhost:3000';
      return;
    }
    
    // Validate user has admin role
    if (!validateUserRole('admin')) {
      clearAuth();
      window.location.href = 'http://localhost:3000';
      return;
    }
    
    // Load user data into Redux store
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    
    if (userStr && token) {
      try {
        const user = JSON.parse(userStr);
        dispatch(setUser({ user, token }));
      } catch (error) {
        console.error('Failed to parse user:', error);
        clearAuth();
        window.location.href = 'http://localhost:3000';
      }
    } else {
      window.location.href = 'http://localhost:3000';
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-200">
      <Header />
      
      <div className="flex flex-1">
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/coupons" element={<Coupons />} />
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
