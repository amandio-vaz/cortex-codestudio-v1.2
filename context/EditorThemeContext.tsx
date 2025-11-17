import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo, useCallback } from 'react';
import { EditorTheme } from '../types';
import { EDITOR_THEMES } from '../themes';
import { useAppearance } from './ThemeContext';

interface EditorThemeContextType {
  theme: EditorTheme;
  setTheme: (themeName: string) => void;
  availableThemes: Record<string, EditorTheme>;
}

const EditorThemeContext = createContext<EditorThemeContextType | undefined>(undefined);

export const EditorThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { appearance } = useAppearance();
  const [themeName, setThemeName] = useState<string>(() => {
    return localStorage.getItem('bashstudio-editor-theme') || 'default';
  });

  const theme = useMemo(() => {
    if (themeName === 'default') {
      return appearance === 'dark' ? EDITOR_THEMES.defaultDark : EDITOR_THEMES.default;
    }
    return EDITOR_THEMES[themeName] || EDITOR_THEMES.default;
  }, [themeName, appearance]);

  const setTheme = (name: string) => {
    setThemeName(name);
    localStorage.setItem('bashstudio-editor-theme', name);
  };

  useEffect(() => {
    const styleId = 'editor-theme-styles';
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    const { colors } = theme;
    styleTag.innerHTML = `
      /* Modern Scrollbar Styling */
      /* For Firefox */
      * {
        scrollbar-width: auto;
        scrollbar-color: ${colors.scrollbarThumb} ${colors.scrollbarTrack};
      }
      
      /* For Webkit browsers (Chrome, Safari, Edge) */
      ::-webkit-scrollbar {
        width: 12px;
        height: 12px;
      }
      ::-webkit-scrollbar-track {
        background: ${colors.scrollbarTrack};
      }
      ::-webkit-scrollbar-thumb {
        background-color: ${colors.scrollbarThumb};
        border-radius: 10px;
        border: 3px solid ${colors.scrollbarTrack}; /* Creates padding around thumb */
      }
      ::-webkit-scrollbar-thumb:hover {
        background-color: ${colors.scrollbarThumbHover};
      }
      
      /* Other themed styles */
      .themed-code-block {
        background-color: ${colors.codeBg} !important;
        border-color: rgba(255, 255, 255, 0.1) !important;
      }
      .themed-code-block-header {
         background-color: rgba(0, 0, 0, 0.2) !important;
         border-color: rgba(255, 255, 255, 0.1) !important;
      }
      .themed-code-block-lang {
        color: ${colors.lineNumbers} !important;
      }
      .themed-code-block pre, .themed-code-block code {
        color: ${colors.codeText} !important;
        background-color: transparent !important;
      }
      .themed-inline-code {
        background-color: ${colors.codeBg} !important;
        color: ${colors.codeText} !important;
      }
    `;
  }, [theme]);

  const contextValue = useMemo(() => ({
    theme,
    setTheme,
    availableThemes: EDITOR_THEMES,
  }), [theme, setTheme]);

  return (
    <EditorThemeContext.Provider value={contextValue}>
      {children}
    </EditorThemeContext.Provider>
  );
};

export const useEditorTheme = () => {
  const context = useContext(EditorThemeContext);
  if (context === undefined) {
    throw new Error('useEditorTheme must be used within an EditorThemeProvider');
  }
  return context;
};