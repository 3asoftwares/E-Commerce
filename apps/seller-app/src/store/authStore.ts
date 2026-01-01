import { create } from 'zustand';

export interface SellerUser {
  id: string;
  email: string;
  name: string;
  role: string;
  businessName?: string;
  isApproved?: boolean;
}

interface SellerAuthState {
  user: SellerUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  hydrate: () => void;
}

export const useSellerAuthStore = create<SellerAuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  clearAuth: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
    window.location.href = 'http://localhost:3000?logout=true';
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  hydrate: () => {
    // Read from global shell-app localStorage keys
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');

    if (userStr && token) {
      try {
        const user = JSON.parse(userStr);
        // Verify user has seller role
        if (user && user.role === 'seller') {
          set({
            user: {
              id: user._id,
              email: user.email,
              name: user.name,
              role: user.role
            },
            token,
            isAuthenticated: true,
          });
        } else {
          // User exists but is not a seller, clear and redirect
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      } catch (e:any) {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
  },
}));
