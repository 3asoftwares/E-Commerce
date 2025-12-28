import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from '@e-commerce/ui-library';
import { useSellerAuthStore } from './store/authStore';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Sidebar } from './components/Sidebar';
import { Logo3A } from '@e-commerce/utils';

// Pages
import { Dashboard } from './pages/Dashboard';
import { SellerUpload } from './pages/SellerUpload';
import { SellerOrders } from './pages/SellerOrders';
import { SellerEarnings } from './pages/SellerEarnings';

function App() {
  const { isAuthenticated, user, hydrate } = useSellerAuthStore();

  useEffect(() => {
    // Extract auth data from query parameters and store in localStorage
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');
    const tokenExpiry = params.get('tokenExpiry');
    const userParam = params.get('user');
    
    // If auth data is in URL params, store it in localStorage
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      if (tokenExpiry) localStorage.setItem('tokenExpiry', tokenExpiry);
      if (userParam) localStorage.setItem('user', userParam);
    }

    hydrate();
    
    // If not authenticated, redirect to shell-app login
    if (!isAuthenticated) {
      const checkAuth = () => {
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('accessToken');
        
        if (!userStr || !token) {
          // Give a moment for hydrate to complete, then redirect
          setTimeout(() => {
            window.location.href = 'http://localhost:3000';
          }, 500);
        }
      };
      checkAuth();
    }
  }, [hydrate, isAuthenticated]);

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && (
        <Header
          logoUrl={Logo3A}
          appName="Seller Portal"
          user={user ? { name: user.name } : undefined}
        />
      )}

      <div className="flex">
        {isAuthenticated && <Sidebar />}
        
        <div className={`flex-1 ${isAuthenticated ? 'lg:ml-64' : ''}`}>
          {isAuthenticated ? (
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products"
                element={
                  <ProtectedRoute>
                    <SellerUpload />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products/new"
                element={
                  <ProtectedRoute>
                    <SellerUpload />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <SellerOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/earnings"
                element={
                  <ProtectedRoute>
                    <SellerEarnings />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          ) : (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-600">Redirecting to login...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
