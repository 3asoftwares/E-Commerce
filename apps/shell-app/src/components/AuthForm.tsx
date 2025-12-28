import React, { useState } from 'react';
import { Button, Input, Select } from '@e-commerce/ui-library';
import { login as loginService, register as registerService } from '../services/authService';
import { renderApp } from '../utils';

interface AuthFormProps {
  initialMode?: 'login' | 'signup';
  setAuthMode: (mode: 'login' | 'signup') => void;
  onSuccess?: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ initialMode = 'login', setAuthMode, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    role?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) {
      return 'Name is required';
    }
    if (name.trim().length < 2) {
      return 'Name must be at least 2 characters long';
    }
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Password must contain at least one special character';
    }
    return undefined;
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
    if (!confirmPassword) {
      return 'Please confirm your password';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const errors: typeof fieldErrors = {};
    
    // Validate email
    const emailError = validateEmail(email);
    if (emailError) errors.email = emailError;

    // For login, only check if password exists
    if (isLogin) {
      if (!password) {
        errors.password = 'Password is required';
      }
    } else {
      // For signup, validate name
      const nameError = validateName(name);
      if (nameError) errors.name = nameError;

      // For signup, apply strict password validation
      const passwordError = validatePassword(password);
      if (passwordError) errors.password = passwordError;

      const confirmPasswordError = validateConfirmPassword(password, confirmPassword);
      if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

      if (!role) {
        errors.role = 'Please select a role';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let data;
      if (isLogin) {
        data = await loginService(email, password);
      } else {
        data = await registerService(email, password, role, name);
      }
      if (!data || !data.user) throw new Error(data.message || 'Authentication failed');
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('accessToken', data.accessToken);
      onSuccess?.();
      renderApp(data.user.role);
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModeToggle = () => {
    setIsLogin(!isLogin);
    setError('');
    setFieldErrors({});
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setRole('customer');
    setAuthMode(!isLogin ? 'login' : 'signup');
  };

  return (
    <div className="py-2">
      <form onSubmit={handleSubmit} className="space-y-5">
        {!isLogin && (
          <Input
            label="Name"
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (fieldErrors.name) {
                setFieldErrors((prev) => ({ ...prev, name: undefined }));
              }
            }}
            error={fieldErrors.name || ''}
            size="md"
            fullWidth
          />
        )}

        <Input
          label="E-mail"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.email) {
              setFieldErrors((prev) => ({ ...prev, email: undefined }));
            }
          }}
          error={fieldErrors.email || ''}
          size="md"
          fullWidth
        />

        <div>
          <Input
            label="Password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password) {
                setFieldErrors((prev) => ({ ...prev, password: undefined }));
              }
            }}
            error={fieldErrors.password || ''}
            size="md"
            fullWidth
          />
          {!isLogin && !fieldErrors.password && (
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              Must be 8+ characters with uppercase, lowercase, number & special character
            </p>
          )}
        </div>

        {!isLogin && (
          <>
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (fieldErrors.confirmPassword) {
                  setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }
              }}
              error={fieldErrors.confirmPassword || ''}
              size="md"
              fullWidth
            />

            <div className="w-full">
              <Select
                value={role}
                label="Select Role"
                onChange={(role: any) => {
                  setRole(role);
                  if (fieldErrors.role) {
                    setFieldErrors((prev) => ({ ...prev, role: undefined }));
                  }
                }}
                options={[
                  { value: '', label: 'Select your role' },
                  { value: 'customer', label: 'Customer' },
                  { value: 'seller', label: 'Seller' },
                  { value: 'admin', label: 'Admin' },
                ]}
                className="w-full"
              />
              {fieldErrors.role && (
                <p className="mt-2 text-sm text-red-700 dark:text-red-400 font-semibold">
                  {fieldErrors.role}
                </p>
              )}
            </div>
          </>
        )}

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-700 rounded-lg">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-red-700 dark:text-red-400 font-semibold">{error}</p>
            </div>
          </div>
        )}

        <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {isLogin ? 'Logging in...' : 'Signing up...'}
            </span>
          ) : isLogin ? (
            'Login'
          ) : (
            'Sign Up'
          )}
        </Button>
      </form>
      <div className="mt-6 text-center">
        <Button
          variant="ghost"
          onClick={handleModeToggle}
          className="text-sm"
          disabled={isSubmitting}
        >
          {isLogin ? 'Create an account' : 'Already have an account? Login'}
        </Button>
      </div>
    </div>
  );
};
