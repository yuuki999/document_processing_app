"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext, AuthContextType } from './AuthContext';
import { useRouter } from 'next/navigation';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuthStatus = useCallback(async () => {
    if (!isLoading && isLoggedIn !== null) return; // 既にチェック済みの場合は何もしない

    setIsLoading(true);
    try {
      const response = await fetch('/api/check-auth', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      setIsLoggedIn(data.isLoggedIn);
    } catch (error) {
      console.error('Authentication check failed:', error);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, isLoggedIn]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        await checkAuthStatus(); // 認証状態を即座に更新
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setIsLoggedIn(false);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const contextValue: AuthContextType = {
    isLoggedIn: isLoggedIn === null ? false : isLoggedIn, // nullの場合はfalseとして扱う
    isLoading,
    login,
    logout,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
