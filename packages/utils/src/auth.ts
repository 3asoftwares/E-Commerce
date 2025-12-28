/**
 * Authentication utility functions
 * Handles token management, expiration, and refresh
 * Shared across all apps (shell-app, admin-app, seller-app, storefront-app)
 */

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface StoredAuth {
  user: any;
  token: string;
  expiresIn: number;
}

/**
 * Store authentication data in localStorage
 */
export const storeAuth = (data: {
  user: any;
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}) => {
  localStorage.setItem('user', JSON.stringify(data.user));
  localStorage.setItem('accessToken', data.accessToken);
  
  if (data.refreshToken) {
    localStorage.setItem('refreshToken', data.refreshToken);
  }
  
  const expiresIn = data.expiresIn || 3600; // Default 1 hour
  const expiryTime = new Date().getTime() + expiresIn * 1000;
  localStorage.setItem('tokenExpiry', expiryTime.toString());
};

/**
 * Retrieve stored authentication data
 */
export const getStoredAuth = (): StoredAuth | null => {
  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('accessToken');
  const expiryStr = localStorage.getItem('tokenExpiry');
  
  if (!userStr || !token) {
    return null;
  }
  
  try {
    const user = JSON.parse(userStr);
    const expiresIn = expiryStr ? parseInt(expiryStr) - new Date().getTime() : 0;
    
    return {
      user,
      token,
      expiresIn: Math.max(0, expiresIn),
    };
  } catch {
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (): boolean => {
  const tokenExpiry = localStorage.getItem('tokenExpiry');
  
  if (!tokenExpiry) {
    return true;
  }
  
  const now = new Date().getTime();
  return now > parseInt(tokenExpiry);
};

/**
 * Check if token will expire soon (within 5 minutes)
 */
export const willTokenExpireSoon = (): boolean => {
  const tokenExpiry = localStorage.getItem('tokenExpiry');
  
  if (!tokenExpiry) {
    return true;
  }
  
  const now = new Date().getTime();
  const expiryTime = parseInt(tokenExpiry);
  const timeUntilExpiry = expiryTime - now;
  
  // 5 minutes = 300000 milliseconds
  return timeUntilExpiry < 300000;
};

/**
 * Clear all authentication data from localStorage
 */
export const clearAuth = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('tokenExpiry');
};

/**
 * Validate user role
 */
export const validateUserRole = (requiredRole: string): boolean => {
  const userStr = localStorage.getItem('user');
  
  if (!userStr) {
    return false;
  }
  
  try {
    const user = JSON.parse(userStr);
    return user.role === requiredRole;
  } catch {
    return false;
  }
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  
  if (!userStr) {
    return null;
  }
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * Get current access token
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

/**
 * Get refresh token
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};

/**
 * Update access token (for token refresh)
 */
export const updateAccessToken = (newToken: string, expiresIn?: number) => {
  localStorage.setItem('accessToken', newToken);
  
  if (expiresIn) {
    const expiryTime = new Date().getTime() + expiresIn * 1000;
    localStorage.setItem('tokenExpiry', expiryTime.toString());
  }
};

/**
 * Setup auto token refresh
 * Refreshes token before it expires
 */
export const setupAutoRefresh = (refreshFn: () => Promise<void>) => {
  const checkAndRefresh = async () => {
    if (willTokenExpireSoon() && !isTokenExpired()) {
      try {
        await refreshFn();
      } catch (error) {
        console.error('Token refresh failed:', error);
        clearAuth();
        window.location.href = 'http://localhost:3000';
      }
    }
  };
  
  // Check every 5 minutes
  const interval = setInterval(checkAndRefresh, 5 * 60 * 1000);
  
  return () => clearInterval(interval);
};
