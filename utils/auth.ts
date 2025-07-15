// utils/auth.ts
export function checkAuthClient() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      console.log(token);
      if (!token) {
        window.location.href = '/login';
      }
    }
  }