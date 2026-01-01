/**
 * Authentication Hooks
 * Using Apollo Client with TanStack Query for optimal performance
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apolloClient } from '../apollo/client';
import {
  LOGIN_MUTATION,
  REGISTER_MUTATION,
  LOGOUT_MUTATION,
  GET_ME_QUERY,
} from '../apollo/queries/auth';
import type { AuthPayload, UserGraphQL } from '@e-commerce/types';

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

interface LoginResponse {
  login: AuthPayload;
}

interface RegisterResponse {
  register: AuthPayload;
}

interface MeResponse {
  me: UserGraphQL;
}

/**
 * Hook for user login
 */
export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (input: LoginInput) => {
      const { data } = await apolloClient.mutate<LoginResponse>({
        mutation: LOGIN_MUTATION,
        variables: { input },
      });

      if (!data?.login) {
        throw new Error('Login failed');
      }

      return data.login;
    },
    onSuccess: (data) => {
      // Store tokens and user info
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      // Invalidate and refetch user queries
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.setQueryData(['me'], data.user);
    },
  });

  return {
    login: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}

/**
 * Hook for user registration
 */
export function useRegister() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (input: RegisterInput) => {
      const { data } = await apolloClient.mutate<RegisterResponse>({
        mutation: REGISTER_MUTATION,
        variables: { input },
      });

      if (!data?.register) {
        throw new Error('Registration failed');
      }

      return data.register;
    },
    onSuccess: (data) => {
      // Store tokens and user info
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      // Invalidate and refetch user queries
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.setQueryData(['me'], data.user);
    },
  });

  return {
    register: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}

/**
 * Hook for user logout
 */
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      await apolloClient.mutate({
        mutation: LOGOUT_MUTATION,
      });
    },
    onSuccess: () => {
      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }

      // Clear Apollo cache
      apolloClient.clearStore();

      // Clear React Query cache
      queryClient.clear();

      // Redirect to login
      router.push('/login');
    },
  });

  return {
    logout: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}

/**
 * Hook to get current user
 */
export function useCurrentUser() {
  return useQuery<UserGraphQL | null>({
    queryKey: ['me'],
    queryFn: async () => {
      try {
        // Check if user is in localStorage first
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('accessToken');
          if (!token) {
            return null;
          }
        }

        const { data } = await apolloClient.query<MeResponse>({
          query: GET_ME_QUERY,
          fetchPolicy: 'network-only',
        });

        return data.me;
      } catch (error) {
        // If query fails (e.g., token expired), return null
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated() {
  const { data: user, isLoading } = useCurrentUser();
  return {
    isAuthenticated: !!user,
    isLoading,
    user,
  };
}
