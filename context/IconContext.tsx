import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { ICON_LIBRARY, DEFAULT_ICONS } from '../icons';
import { CustomizableAction } from '../types';

type IconSettings = Record<CustomizableAction, string>;

interface IconContextType {
  getIconComponent: (action: CustomizableAction) => React.FC<{ className?: string }>;
  setIcon: (action: CustomizableAction, iconName: string) => void;
  iconSettings: IconSettings;
}

const IconContext = createContext<IconContextType | undefined>(undefined);

export const IconProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [iconSettings, setIconSettings] = useState<IconSettings>(() => {
    try {
      const savedSettings = localStorage.getItem('bashstudio-icons');
      return savedSettings ? JSON.parse(savedSettings) : DEFAULT_ICONS;
    } catch (error) {
      console.error("Failed to parse icon settings from localStorage", error);
      return DEFAULT_ICONS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('bashstudio-icons', JSON.stringify(iconSettings));
    } catch (error) {
      console.error("Failed to save icon settings to localStorage", error);
    }
  }, [iconSettings]);

  const setIcon = useCallback((action: CustomizableAction, iconName: string) => {
    setIconSettings(prev => ({ ...prev, [action]: iconName }));
  }, []);

  const getIconComponent = useCallback((action: CustomizableAction): React.FC<{ className?: string }> => {
    const iconName = iconSettings[action] || DEFAULT_ICONS[action];
    const iconSet = ICON_LIBRARY[action];
    return iconSet?.[iconName] || Object.values(iconSet)[0];
  }, [iconSettings]);

  const contextValue = useMemo(() => ({
    getIconComponent,
    setIcon,
    iconSettings,
  }), [getIconComponent, setIcon, iconSettings]);


  return (
    <IconContext.Provider value={contextValue}>
      {children}
    </IconContext.Provider>
  );
};

export const useIconContext = () => {
  const context = useContext(IconContext);
  if (context === undefined) {
    throw new Error('useIconContext must be used within an IconProvider');
  }
  return context;
};