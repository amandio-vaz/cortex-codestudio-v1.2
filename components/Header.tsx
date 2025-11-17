import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ICON_LIBRARY, SunIcon, MoonIcon, UserCircleIcon, LogoutIcon } from '../icons';
import Tooltip from './Tooltip';
import { useAppearance } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenAuthModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings, onOpenAuthModal }) => {
  const { t } = useLanguage();
  const { appearance, toggleAppearance } = useAppearance();
  const { isAuthenticated, user, logout } = useAuth();
  const SettingsIcon = ICON_LIBRARY.settings.Gear;

  return (
    <header className="p-4 text-center relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30 dark:opacity-50"></div>
      
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <Tooltip text={appearance === 'light' ? t('tooltipThemeDark') : t('tooltipThemeLight')}>
            <button
                onClick={toggleAppearance}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors duration-200"
                aria-label="Toggle theme"
            >
                {appearance === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
            </button>
        </Tooltip>
        <Tooltip text={t('tooltipCustomizeInterface')}>
          <button 
            onClick={onOpenSettings}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors duration-200"
            aria-label="Open settings"
          >
            <SettingsIcon className="h-6 w-6" />
          </button>
        </Tooltip>
        <div className="h-6 w-px bg-gray-200 dark:bg-white/10"></div>
        {isAuthenticated && user ? (
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <UserCircleIcon className="h-6 w-6" />
              <span className="hidden sm:inline">{user.email}</span>
            </div>
            <Tooltip text={t('buttonLogout')}>
              <button
                onClick={logout}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors duration-200"
                aria-label="Logout"
              >
                <LogoutIcon className="h-6 w-6" />
              </button>
            </Tooltip>
          </div>
        ) : (
          <Tooltip text={t('tooltipLogin')}>
            <button
              onClick={onOpenAuthModal}
              className="px-4 py-2 text-sm font-semibold rounded-full text-cyan-700 bg-cyan-100/50 hover:bg-cyan-100 dark:text-cyan-300 dark:bg-cyan-500/10 dark:hover:bg-cyan-500/20 transition-colors duration-200"
            >
              {t('buttonLogin')}
            </button>
          </Tooltip>
        )}
      </div>

      <h1 className="text-5xl font-extrabold tracking-tighter text-gray-900 dark:text-transparent">
        <span className="dark:bg-clip-text dark:bg-gradient-to-r dark:from-cyan-400 dark:to-purple-500">
          {t('headerTitle')}
        </span>
      </h1>
      <p className="mt-3 text-lg tracking-wide text-slate-600 dark:text-slate-400">
        {t('headerSubtitle')}
      </p>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-20 dark:opacity-30"></div>
    </header>
  );
};

export default Header;