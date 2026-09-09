// Powered by OnSpace.AI
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authService, User } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load initial session
    authService.getSession().then(u => {
      setUser(u);
      setIsLoading(false);
    });

    // Listen to auth state changes
    const { data: sub } = authService.onAuthStateChange(u => {
      setUser(u);
      setIsLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const u = await authService.login(email, password);
    setUser(u);
  };

  const register = async (name: string, email: string, password: string) => {
    const u = await authService.register(name, email, password);
    setUser(u);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
