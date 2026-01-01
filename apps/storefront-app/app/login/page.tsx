'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLogin } from '@/lib/hooks/useAuth';
import { useCartStore } from '@/store/cartStore';
import { Button, Input } from '@e-commerce/ui-library';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error: loginError } = useLogin();
  const { setUserProfile } = useCartStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const result = await login({ email, password });
      // Save user profile to cart store
      if (result?.user) {
        setUserProfile({
          id: result.user.id,
          email: result.user.email,
          name: result.user.name || result.user.email.split('@')[0],
          addresses: [],
        });
      }
      // Redirect to home on success
      router.push('/');
    } catch (err) {
      setError(loginError?.message || (err instanceof Error ? err.message : 'Login failed'));
    }
  };

  return (
    <div className="min-h-[calc(100vh_-_80px)] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-gray-900 to-gray-600 px-8 py-10 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">🛍️ 3A Softwares</h1>
            <p className="text-blue-100 text-sm">Welcome back to your favorite store</p>
          </div>

          <div className="px-8 py-10">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              label="Email Address"
              placeholder="your@email.com"
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              label="Password"
              placeholder="••••••••"
            />
            <Button type="submit" disabled={isLoading} onClick={handleSubmit}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            </div>
           
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/signup" className="text-gray-600 font-semibold hover:text-gray-900">
                Create one
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
