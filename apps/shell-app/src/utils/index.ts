export const renderApp = (role: string) => {
  if (role === 'admin') {
    window.location.href = 'http://localhost:3001';
  } else if (role === 'seller') {
    window.location.href = 'http://localhost:3002';
  } else {
    window.location.href = 'http://localhost:3003';
  }
};

export const changeTheme = (theme: 'light' | 'dark') => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};
