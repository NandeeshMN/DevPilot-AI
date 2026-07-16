import React, { createContext, useContext, useState, useEffect } from 'react';
import { getItem, setItem, removeItem } from '../utils/storage';

export interface User {
  fullName: string;
  email: string;
  photoURL?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  authView: 'landing' | 'login' | 'register' | 'forgot';
  setAuthView: (view: 'landing' | 'login' | 'register' | 'forgot') => void;
  loginUser: (user: User, token: string) => void;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * High-level provider mapping login state variables, token storage, and session caches.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<'landing' | 'login' | 'register' | 'forgot'>('landing');

  useEffect(() => {
    const savedToken = getItem<string>('auth_token');
    const savedUser = getItem<User>('auth_user');
    if (savedToken && savedUser) {
      setIsLoggedIn(true);
      setUser(savedUser);
    }
  }, []);

  const loginUser = (userData: User, token: string) => {
    setItem('auth_token', token);
    setItem('auth_user', userData);
    setIsLoggedIn(true);
    setUser(userData);
    setAuthView('landing');
  };

  const logoutUser = () => {
    removeItem('auth_token');
    removeItem('auth_user');
    setIsLoggedIn(false);
    setUser(null);
    setAuthView('landing');
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      user,
      authView,
      setAuthView,
      loginUser,
      logoutUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Access hook for reading authentication states.
 */
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
export default AuthContext;
