import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo } from 'react';

type Appearance = 'light' | 'dark';

interface AppearanceContextType {
  appearance: Appearance;
  toggleAppearance: () => void;
}

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined);

export const AppearanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appearance, setAppearance] = useState<Appearance>(() => {
    const storedTheme = localStorage.getItem('bashstudio-appearance');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (appearance === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('bashstudio-appearance', appearance);
  }, [appearance]);

  const toggleAppearance = () => {
    setAppearance(prev => (prev === 'light' ? 'dark' : 'light'));
  };
  
  const contextValue = useMemo(() => ({ appearance, toggleAppearance }), [appearance]);

  return (
    <AppearanceContext.Provider value={contextValue}>
      {children}
    </AppearanceContext.Provider>
  );
};

export const useAppearance = () => {
  const context = useContext(AppearanceContext);
  if (context === undefined) {
    throw new Error('useAppearance must be used within an AppearanceProvider');
  }
  return context;
};