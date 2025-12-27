import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuthForm } from './components/AuthForm';
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
      <Header />
      <div className="flex flex-1">
        <main className="max-w-7xl mx-auto">
          <AuthForm />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default App;
