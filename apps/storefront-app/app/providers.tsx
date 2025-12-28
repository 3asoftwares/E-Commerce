'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RecoilRoot } from 'recoil';
import { useState, useEffect } from 'react';

function AuthLoader({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Extract auth data from query parameters and store in localStorage
    if (typeof window !== 'undefined') {
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
    }
  }, []);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 30000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <AuthLoader>{children}</AuthLoader>
      </RecoilRoot>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
