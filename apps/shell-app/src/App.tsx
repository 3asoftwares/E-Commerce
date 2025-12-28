import React, { useEffect, useState, Suspense } from 'react';
import { clearAuth } from '@e-commerce/utils';
const Header = React.lazy(() => import('./components/Header').then((m) => ({ default: (m as any).Header ?? (m as any).default }))) as React.LazyExoticComponent<React.ComponentType<{ onLoginClick: () => void; onSignupClick: () => void;}>>;
const Footer = React.lazy(() => import('./components/Footer').then((m) => ({ default: (m as any).Footer ?? (m as any).default })));
const WelcomePage = React.lazy(() => import('./components/WelcomePage').then((m) => ({ default: (m as any).WelcomePage ?? (m as any).default }))) as React.LazyExoticComponent<React.ComponentType<{
  onSignupClick: () => void;
}>>;
const AuthForm = React.lazy(() => import('./components/AuthForm').then((m) => ({ default: (m as any).AuthForm ?? (m as any).default }))) as React.LazyExoticComponent<React.ComponentType<{
  initialMode: 'login' | 'signup';
  setAuthMode: React.Dispatch<React.SetStateAction<'login' | 'signup'>>;
  onSuccess: () => void;
}>>;
import { Modal } from '@e-commerce/ui-library';
import { useUIStore } from './store/uiStore';
import { changeTheme, renderApp } from './utils';

const App: React.FC = () => {
  const { theme } = useUIStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const verifyLogin = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.role) {
          renderApp(user.role);
          return true;
        }
      } catch (e:any) {
        localStorage.removeItem('user');
        return true;
      }
    }
    return false;
  } 

  const login = ()  =>  {
    const isLogin = verifyLogin()
    if(!isLogin){
      setAuthMode('login');
      setShowAuthModal(true);
    }
  }

  const signup = ()  => {
    const isLogin = verifyLogin();
    if (!isLogin) {
     setAuthMode('signup');
     setShowAuthModal(true);
    }
  } 

  useEffect(() => {
    changeTheme(theme);
  }, [theme]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('logout') === 'true') {
      clearAuth();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-200">
      <Suspense
        fallback={
          <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700" />
        }
      >
        <Header
          onLoginClick={login}
          onSignupClick={signup}
        />
      </Suspense>
      <div className="flex flex-1">
        <main className="flex-1">
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
              </div>
            }
          >
            <WelcomePage
              onSignupClick={signup}
            />
          </Suspense>
        </main>
      </div>
      <Suspense fallback={<div />}>
        <Footer />
      </Suspense>

      <Modal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title={authMode === 'login' ? 'Login' : 'Sign Up'}
        size="md"
      >
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            </div>
          }
        >
          <AuthForm
            initialMode={authMode}
            setAuthMode={setAuthMode}
            onSuccess={() => setShowAuthModal(false)}
          />
        </Suspense>
      </Modal>
    </div>
  );
};

export default App;
