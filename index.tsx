// FIX: Replaced incorrect bash script content with the proper React application entry point.
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { EditorThemeProvider } from './context/EditorThemeContext';
import { IconProvider } from './context/IconContext';
import { LanguageProvider } from './context/LanguageContext';
import { AppearanceProvider } from './context/ThemeContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find the root element');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <AppearanceProvider>
      <LanguageProvider>
        <AuthProvider>
          <EditorThemeProvider>
            <IconProvider>
              <App />
            </IconProvider>
          </EditorThemeProvider>
        </AuthProvider>
      </LanguageProvider>
    </AppearanceProvider>
  </React.StrictMode>
);
