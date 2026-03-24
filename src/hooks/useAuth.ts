import { useStore, User } from '@/store/useStore';
import { useCallback, useEffect } from 'react';

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, setLoading, logout } = useStore();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };

    checkAuth();
  }, [setUser]);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch {
      return { success: false, error: 'Network error' };
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading]);

  const register = useCallback(async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Registration failed' };
      }
    } catch {
      return { success: false, error: 'Network error' };
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  const signOut = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } finally {
      logout();
    }
  }, [logout]);

  const isAdmin = user?.role === 'ADMIN';

  return {
    user,
    isAuthenticated,
    isLoading,
    isAdmin,
    login,
    register,
    signOut
  };
}
