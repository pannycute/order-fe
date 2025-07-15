import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { User, LoginForm, RegisterForm } from '../types';
import { axiosInstance } from '../utils/axiosInstance';
import { STORAGE_KEYS } from '../utils/constants';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });
  
  const router = useRouter();

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        if (typeof window === 'undefined') {
          setAuthState(prev => ({ ...prev, isLoading: false }));
          return;
        }
        
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        const userData = localStorage.getItem(STORAGE_KEYS.USER);
        
        if (token && userData) {
          const user = JSON.parse(userData);
          setAuthState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (credentials: LoginForm) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response = await axiosInstance.post('/login', credentials);
      const { token, user } = response.data.data || response.data;
      
      // Store in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      }
      
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true };
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  }, []);

  const register = useCallback(async (userData: RegisterForm) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response = await axiosInstance.post('/register', userData);
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: true };
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Call logout API
      await axiosInstance.post('/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
      
      // Reset state
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      // Redirect to login
      router.push('/login');
    }
  }, [router]);

  const updateUser = useCallback((userData: User) => {
    setAuthState(prev => ({ ...prev, user: userData }));
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    }
  }, []);

  const checkAuth = useCallback(() => {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    
    if (!token || !userData) {
      // Clear state without redirecting
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return false;
    }
    
    return true;
  }, []);

  const requireAuth = useCallback((redirectTo = '/login') => {
    if (!authState.isAuthenticated && !authState.isLoading) {
      router.push(redirectTo);
      return false;
    }
    return true;
  }, [authState.isAuthenticated, authState.isLoading, router]);

  const requireRole = useCallback((requiredRole: string, redirectTo = '/') => {
    if (!authState.isAuthenticated) {
      router.push('/login');
      return false;
    }
    
    if (authState.user?.role !== requiredRole) {
      router.push(redirectTo);
      return false;
    }
    
    return true;
  }, [authState.isAuthenticated, authState.user?.role, router]);

  return {
    ...authState,
    login,
    register,
    logout,
    updateUser,
    checkAuth,
    requireAuth,
    requireRole,
  };
}; 