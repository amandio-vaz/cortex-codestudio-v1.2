import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { User } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, otp: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('codexstudio-user');
      const storedToken = localStorage.getItem('codexstudio-token');
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Failed to load auth data from localStorage", error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, otp: string): Promise<boolean> => {
    // MOCK: This simulates OTP verification.
    console.log(`Attempting login for ${email} with OTP ${otp}`);
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network request

    // For mock purposes, any 6-digit OTP is valid.
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
        setIsLoading(false);
        return false;
    }

    const mockUser: User = { id: Date.now().toString(), email };
    const mockToken = `mock-token-for-${email}`;

    setUser(mockUser);
    setToken(mockToken);
    localStorage.setItem('codexstudio-user', JSON.stringify(mockUser));
    localStorage.setItem('codexstudio-token', mockToken);
    setIsLoading(false);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('codexstudio-user');
    localStorage.removeItem('codexstudio-token');
  }, []);

  const contextValue = useMemo(() => ({
    isAuthenticated: !!token,
    user,
    token,
    isLoading,
    login,
    logout,
  }), [user, token, isLoading, login, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};