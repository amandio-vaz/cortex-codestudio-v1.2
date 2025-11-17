import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { User } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('bashstudio-user');
      const storedToken = localStorage.getItem('bashstudio-token');
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

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // MOCK: This will be replaced with a real API call
    console.log(`Attempting login for ${email} with password ${password}`);
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network request

    const mockUser: User = { id: '1', email };
    const mockToken = `mock-token-for-${email}`;

    setUser(mockUser);
    setToken(mockToken);
    localStorage.setItem('bashstudio-user', JSON.stringify(mockUser));
    localStorage.setItem('bashstudio-token', mockToken);
    setIsLoading(false);
    return true;
  }, []);

  const register = useCallback(async (email: string, password: string): Promise<boolean> => {
    // MOCK: This will also be replaced with a real API call
    console.log(`Attempting to register ${email} with password ${password}`);
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockUser: User = { id: '2', email };
    const mockToken = `mock-token-for-${email}`;

    setUser(mockUser);
    setToken(mockToken);
    localStorage.setItem('bashstudio-user', JSON.stringify(mockUser));
    localStorage.setItem('bashstudio-token', mockToken);
    setIsLoading(false);
    return true;
  }, []);


  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('bashstudio-user');
    localStorage.removeItem('bashstudio-token');
  }, []);

  const contextValue = useMemo(() => ({
    isAuthenticated: !!token,
    user,
    token,
    isLoading,
    login,
    register,
    logout,
  }), [user, token, isLoading, login, register, logout]);

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