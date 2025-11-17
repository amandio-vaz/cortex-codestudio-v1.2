import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useIconContext } from '../context/IconContext';
import Tooltip from './Tooltip';
import TemplateSelector from './TemplateSelector';
import { useEditorTheme } from '../context/EditorThemeContext';

interface GeneratorViewProps {
  onGenerate: (prompt: string, systemInstruction: string, requiredCommands: string) => void;
  isLoading: boolean;
}

const GeneratorView: React.FC<GeneratorViewProps> = ({ onGenerate, isLoading }) => {
  const { t } = useLanguage();
  const { getIconComponent } = useIconContext();
  const { theme } = useEditorTheme();
  const GenerateIcon = getIconComponent('generateAction');

  const [prompt, setPrompt] = useState<string>(() => {
    return localStorage.getItem('bashstudio-generator-prompt') || 'Crie um script que lista todos os arquivos no diretório atual e os ordena por tamanho.';
  });
  
  const [systemInstruction, setSystemInstruction] = useState<string>(() => {
    return localStorage.getItem('bashstudio-generator-instruction') || '';
  });

  const [requiredCommands, setRequiredCommands] = useState<string>(() => {
    return localStorage.getItem('bashstudio-generator-commands') || '';
  });

  // Debounced auto-save for generator fields
  useEffect(() => {
    const handler = setTimeout(() => {
      localStorage.setItem('bashstudio-generator-prompt', prompt);
      localStorage.setItem('bashstudio-generator-instruction', systemInstruction);
      localStorage.setItem('bashstudio-generator-commands', requiredCommands);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [prompt, systemInstruction, requiredCommands]);

  const handleSelectTemplate = (templatePrompt: string) => {
    setPrompt(templatePrompt);
  };

  return (
    <div className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-xl flex flex-col h-full p-4 shadow-lg dark:shadow-2xl dark:shadow-black/20 overflow-y-auto"
         style={{ backgroundColor: theme.colors.resultBg }}>
      <h2 className="text-xl font-semibold mb-2 border-b border-gray-300 dark:border-white/10 pb-2" style={{ color: theme.colors.resultTitle }}>{t('generatorTitle')}</h2>
      
      <div className="mb-2">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('generatorSystemInstruction')}</label>
          <input
            type="text"
            value={systemInstruction}
            onChange={(e) => setSystemInstruction(e.target.value)}
            placeholder={t('generatorSystemInstructionPlaceholder')}
            className="w-full bg-gray-100 dark:bg-slate-900/50 text-gray-900 dark:text-gray-200 p-2 text-sm rounded-md border border-gray-300 dark:border-white/10 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none"
          />
      </div>

      <div className="mb-4">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('generatorRequiredCommands')}</label>
          <input
            type="text"
            value={requiredCommands}
            onChange={(e) => setRequiredCommands(e.target.value)}
            placeholder={t('generatorRequiredCommandsPlaceholder')}
            className="w-full bg-gray-100 dark:bg-slate-900/50 text-gray-900 dark:text-gray-200 p-2 text-sm rounded-md border border-gray-300 dark:border-white/10 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none"
          />
      </div>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={t('generatorPlaceholder')}
        className="w-full flex-grow p-3 rounded-md font-mono text-sm border border-gray-300 dark:border-white/10 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none resize-none min-h-[10rem]"
        style={{
          backgroundColor: theme.colors.editorBg,
          color: theme.colors.editorText
        }}
      />
      <div className="mt-4">
        <Tooltip text={t('tooltipGenerateFromPrompt')}>
          <button
            onClick={() => onGenerate(prompt, systemInstruction, requiredCommands)}
            disabled={isLoading || !prompt.trim()}
            className="w-full relative inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-500 hover:to-indigo-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
          >
            {isLoading && (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <span className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 opacity-50 blur-lg group-hover:opacity-75 transition duration-500 animate-pulse"></span>
            <span className="relative flex items-center justify-center">
                {isLoading ? t('buttonGenerating') : <><GenerateIcon className="h-5 w-5 mr-2" /> {t('buttonGenerate')}</>}
            </span>
          </button>
        </Tooltip>
      </div>
      <div className="mt-6 border-t border-gray-300 dark:border-white/10 pt-4">
        <TemplateSelector onSelectTemplate={handleSelectTemplate} />
      </div>
    </div>
  );
};

export default GeneratorView;