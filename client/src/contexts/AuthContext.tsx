import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, UserRoleType } from '@shared/schema';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithOTP: (emailOrPhone: string, otp: string) => Promise<void>;
  requestOTP: (emailOrPhone: string) => Promise<string>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRoleType;
  phone?: string;
  company?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'));
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('auth_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const loginWithOTP = async (emailOrPhone: string, otp: string) => {
    const isEmail = emailOrPhone.includes('@');
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        [isEmail ? 'email' : 'phone']: emailOrPhone,
        otp,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('auth_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const requestOTP = async (emailOrPhone: string): Promise<string> => {
    const isEmail = emailOrPhone.includes('@');
    const response = await fetch('/api/auth/request-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        [isEmail ? 'email' : 'phone']: emailOrPhone,
        type: 'login',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send OTP');
    }

    const data = await response.json();
    return data.otp; // In production, this would not be returned
  };

  const register = async (data: RegisterData) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    const result = await response.json();
    localStorage.setItem('auth_token', result.token);
    setToken(result.token);
    setUser(result.user);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        loginWithOTP,
        requestOTP,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
