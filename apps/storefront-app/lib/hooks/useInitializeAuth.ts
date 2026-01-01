'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';

/**
 * Hook to initialize user profile from localStorage on app mount
 */
export function useInitializeAuth() {
  const { loadUserFromStorage, userProfile } = useCartStore();

  useEffect(() => {
    // Only load if userProfile is not already set
    if (!userProfile) {
      loadUserFromStorage();
    }
  }, [loadUserFromStorage, userProfile]);
}
