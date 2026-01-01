export const renderApp = (role: string) => {
  // Get auth tokens from localStorage before redirecting
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const tokenExpiry = localStorage.getItem('tokenExpiry');
  const user = localStorage.getItem('user');
  
  // Build query parameters with auth data
  const params = new URLSearchParams();
  if (accessToken) params.append('accessToken', accessToken);
  if (refreshToken) params.append('refreshToken', refreshToken);
  if (tokenExpiry) params.append('tokenExpiry', tokenExpiry);
  if (user) params.append('user', user);
  
  if (role === 'admin') {
    window.location.href = 'http://localhost:3001?' + params.toString();
  } else if (role === 'seller') {
    window.location.href = 'http://localhost:3002?' + params.toString();
  }
};

export const changeTheme = (theme: 'light' | 'dark') => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};
