import React, { useState } from 'react';
import { Button, Input, Select } from '@e-commerce/ui-library';
import { login as loginService, register as registerService } from '../services/authService';
import { renderApp } from '../utils';

export const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      let data;
      if (isLogin) {
        data = await loginService(email, password);
      } else {
        data = await registerService(email, password, role);
      }
      if (!data || !data.user) throw new Error(data.message || 'Auth failed');
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('accessToken', data.accessToken);
      renderApp(data.user.role);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          error=""
          size="md"
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          error=""
          size="md"
        />
        {!isLogin && (
          <Select
            value={role}
            onChange={(e: any) => setRole(e.target.value)}
            options={[
              { value: 'customer', label: 'Customer' },
              { value: 'seller', label: 'Seller' },
              { value: 'admin', label: 'Admin' },
            ]}
          />
        )}
        {error && <div className="text-red-600">{error}</div>}
        <Button type="submit" variant="primary" className="w-full">
          {isLogin ? 'Login' : 'Sign Up'}
        </Button>
      </form>
      <div className="mt-4 text-center">
        <Button variant="primary" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Create an account' : 'Already have an account? Login'}
        </Button>
      </div>
    </div>
  );
};
