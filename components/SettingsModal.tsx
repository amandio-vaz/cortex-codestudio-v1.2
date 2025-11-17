import React from 'react';
import { useIconContext } from '../context/IconContext';
import { ICON_LIBRARY } from '../icons';
import { CustomizableAction, EditorTheme } from '../types';
import { useEditorTheme } from '../context/EditorThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const actionLabels: Record<CustomizableAction, string> = {
    analyze: 'Analyze Button',
    improve: 'Improve Button',
    validate: 'Validate Button',
    execute: 'Execute Button',
    runInTerminal: 'Run in Terminal Button',
    assistantTab: 'Assistant Tab',
    generatorTab: 'Generator Tab',
    chatTab: 'Chat Tab',
    knowledgeBaseTab: 'Knowledge Base Tab',
    generateAction: 'Generate Button',
    addDocstrings: 'Add Docs Button',
    optimizePerformance: 'Optimize Button',
    checkSecurity: 'Security Check Button',
    testApi: 'API Test Button',
    apiTestingTab: 'API Testing Tab',
    deploymentGuidesTab: 'Deployment Guides Tab',
    refactorSelection: 'Refactor Selection Button',
    clearScript: 'Clear Button',
};

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { iconSettings, setIcon, getIconComponent } = useIconContext();
  const { theme, setTheme, availableThemes } = useEditorTheme();
  
  const currentThemeName = theme.name.includes('Dark') ? 'Default' : theme.name;

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900/70 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl shadow-black/40"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-300 dark:border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('settingsTitle')}</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Editor Theme Section */}
          <div>
            <h3 className="text-lg font-medium text-purple-600 dark:text-purple-400 mb-3">{t('settingsThemeTitle')}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Object.values(availableThemes)
                .filter((t: EditorTheme) => !t.name.includes('Dark'))
                .map((themeOption: EditorTheme) => {
                const isSelected = currentThemeName === themeOption.name;
                const themeKey = Object.keys(availableThemes).find(key => availableThemes[key].name === themeOption.name) || 'default';
                
                return (
                  <button
                    key={themeOption.name}
                    onClick={() => setTheme(themeKey)}
                    className={`p-3 rounded-lg flex flex-col items-start transition-all duration-200 text-left border-2 ${
                      isSelected
                        ? 'border-cyan-500 dark:border-cyan-400 bg-cyan-50 dark:bg-cyan-500/10'
                        : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 hover:border-gray-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <span className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-2">{themeOption.name}</span>
                    <div className="flex space-x-1.5">
                      <div className="h-5 w-5 rounded-full" style={{ backgroundColor: themeOption.colors.editorBg, border: '1px solid rgba(0,0,0,0.1)' }}></div>
                      <div className="h-5 w-5 rounded-full" style={{ backgroundColor: themeOption.colors.editorText }}></div>
                      <div className="h-5 w-5 rounded-full" style={{ backgroundColor: themeOption.colors.codeText }}></div>
                      <div className="h-5 w-5 rounded-full" style={{ backgroundColor: themeOption.colors.highlightError }}></div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Icon Customization Section */}
          {Object.entries(ICON_LIBRARY)
            .filter(([action]) => action !== 'settings')
            .map(([action, icons]) => {
            const currentIconName = iconSettings[action as CustomizableAction];
            const CurrentIcon = getIconComponent(action as CustomizableAction);

            return (
              <div key={action}>
                <h3 className="text-lg font-medium text-cyan-600 dark:text-cyan-400 mb-3 flex items-center">
                  <CurrentIcon className="h-5 w-5 mr-2" />
                  {actionLabels[action as CustomizableAction] || action}
                </h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                  {Object.entries(icons).map(([iconName, IconComponent]) => {
                    const isSelected = currentIconName === iconName;
                    return (
                      <button
                        key={iconName}
                        onClick={() => setIcon(action as CustomizableAction, iconName)}
                        className={`p-3 rounded-lg flex items-center justify-center transition-all duration-200 ${
                          isSelected 
                            ? 'bg-cyan-100 dark:bg-cyan-500/20 ring-2 ring-cyan-500 dark:ring-cyan-400 text-cyan-700 dark:text-white' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-slate-800/60 dark:hover:bg-slate-700/60 dark:text-gray-300'
                        }`}
                        title={iconName}
                      >
                        <IconComponent className="h-7 w-7" />
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;