import React, { useEffect, useState, Suspense } from 'react';
const Header = React.lazy(() => import('./components/Header').then((m) => ({ default: (m as any).Header ?? (m as any).default })));
const Footer = React.lazy(() => import('./components/Footer').then((m) => ({ default: (m as any).Footer ?? (m as any).default })));
const AuthForm = React.lazy(() => import('./components/AuthForm').then((m) => ({ default: (m as any).AuthForm ?? (m as any).default })));
import { useUIStore } from './store/uiStore';
import { changeTheme, renderApp } from './utils';

const App: React.FC = () => {
  const { theme } = useUIStore();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    changeTheme(theme);
  }, [theme]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('logout') === 'true') {
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }

    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user && user.role) {
        renderApp(user.role);
        return;
      }
    }
    setChecked(true);
  }, []);

  if (!checked) return null;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex flex-col">
      <Suspense fallback={<div />}> 
        <Header />
      </Suspense>
      <div className="flex flex-1">
        <main className="max-w-7xl mx-auto">
          <Suspense fallback={<div />}>
            <AuthForm />
          </Suspense>
        </main>
      </div>
      <Suspense fallback={<div />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default App;
