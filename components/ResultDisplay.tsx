import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Tooltip from './Tooltip';
import { ArrowsPointingInIcon, ArrowsPointingOutIcon } from '../icons';
import { useEditorTheme } from '../context/EditorThemeContext';
import { RefactorSuggestion } from '../types';

interface ResultDisplayProps {
  title: string;
  content: string;
  isLoading: boolean;
  isThinking: boolean;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  refactorSuggestion: RefactorSuggestion | null;
  onApplyRefactoring: () => void;
}

const CopyButton: React.FC<{ code: string }> = ({ code }) => {
  const { t } = useLanguage();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Tooltip text={isCopied ? t('tooltipCopied') : t('tooltipCopy')}>
      <button
        onClick={handleCopy}
        className="bg-gray-300/50 hover:bg-gray-400/50 text-gray-700 dark:bg-slate-700/50 dark:hover:bg-slate-600/50 dark:text-gray-300 text-xs px-2 py-1 rounded-md transition-all flex items-center"
      >
        {isCopied ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </button>
    </Tooltip>
  );
};

const ApiResultFormatter: React.FC<{ content: string }> = ({ content }) => {
  const { theme } = useEditorTheme();

  const formattedContent = useMemo(() => {
    try {
      // Check if the entire content is a single JSON object/array
      const parsed = JSON.parse(content);
      return <pre className="p-0 m-0"><code>{JSON.stringify(parsed, null, 2)}</code></pre>;
    } catch (e) {
      // Not a single JSON object, process line by line for status codes
      return content.split('\n').map((line, index) => {
        const match = line.match(/^(HTTP\/[\d\.]+\s+)(\d{3})/);
        if (match) {
          const statusCode = parseInt(match[2], 10);
          let colorClass = '';
          if (statusCode >= 200 && statusCode < 300) colorClass = 'text-green-500 dark:text-green-400 font-bold';
          else if (statusCode >= 300 && statusCode < 400) colorClass = 'text-yellow-500 dark:text-yellow-400 font-bold';
          else if (statusCode >= 400) colorClass = 'text-red-500 dark:text-red-400 font-bold';
          return <div key={index} className={colorClass}>{line}</div>;
        }
        return <div key={index}>{line}</div>;
      });
    }
  }, [content]);

  return (
    <div className="p-4 text-sm overflow-x-auto font-mono whitespace-pre" style={{ color: theme.colors.editorText }}>
        {formattedContent}
    </div>
  );
};

const ResultDisplay: React.FC<ResultDisplayProps> = ({ title, content, isLoading, isThinking, isFullscreen, onToggleFullscreen, refactorSuggestion, onApplyRefactoring }) => {
  const { t } = useLanguage();
  const { theme } = useEditorTheme();
  const [isAllCopied, setIsAllCopied] = useState(false);

  const handleCopyAll = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      setIsAllCopied(true);
      setTimeout(() => setIsAllCopied(false), 2000);
    }
  };

  const renderContent = () => {
    if (isLoading && isThinking) {
      return (
        <div className="flex flex-col justify-center items-center h-full text-center text-gray-500 dark:text-gray-400">
          <div className="relative flex justify-center items-center">
              <div className="absolute w-24 h-24 rounded-full animate-pulse bg-gradient-to-r from-cyan-500 to-purple-500 opacity-30 blur-2xl"></div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-cyan-500 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l.707.707M6.343 17.657l-.707.707m12.728 0l.707.707M12 21v-1" />
              </svg>
          </div>
          <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">{t('thinkingMessage')}</p>
          <p className="text-sm">{t('thinkingSubmessage')}</p>
        </div>
      );
    }
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-full">
          <div className="w-16 h-16">
            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="40" cy="40" r="38" stroke="url(#spinner-gradient)" strokeWidth="4" strokeLinecap="round"/>
              <defs>
                <linearGradient id="spinner-gradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#67e8f9"/>
                  <stop offset="100%" stopColor="#c084fc"/>
                </linearGradient>
              </defs>
              <animateTransform attributeName="transform" type="rotate" from="0 40 40" to="360 40 40" dur="1s" repeatCount="indefinite" />
            </svg>
          </div>
        </div>
      );
    }
    if (!content) {
      return (
        <div className="text-center text-gray-500 flex flex-col items-center justify-center h-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l.707.707M6.343 17.657l-.707.707m12.728 0l.707.707M12 21v-1m-4-4H5a2 2 0 00-2 2v2a2 2 0 002 2h14a2 2 0 002-2v-2a2 2 0 00-2-2h-3" />
            </svg>
          <p>{t('assistantReadyTitle')}</p>
          <p className="text-sm">{t('assistantReadySubtitle')}</p>
        </div>
      );
    }
    
    const parts = content.split(/(```\w*[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const langMatch = part.match(/^```(\w*)/);
        const language = langMatch && langMatch[1] ? langMatch[1] : 'text';
        const code = part.replace(/^```\w*\n?/, '').replace(/```\n?$/, '');
        
        if (language === 'text' && title === t('executionTitle')) {
            return (
                <div key={index} className="themed-code-block bg-gray-100 dark:bg-slate-900/70 rounded-lg my-4 border border-gray-200 dark:border-white/10 overflow-hidden">
                    <div className="themed-code-block-header flex justify-between items-center px-4 py-1.5 bg-gray-200/70 dark:bg-black/20 border-b border-gray-200 dark:border-white/10">
                        <span className="themed-code-block-lang text-xs font-mono text-cyan-700 dark:text-cyan-400">execution-log</span>
                        <CopyButton code={code.trim()} />
                    </div>
                    <ApiResultFormatter content={code.trim()} />
                </div>
            );
        }

        return (
          <div key={index} className="themed-code-block bg-gray-100 dark:bg-slate-900/70 rounded-lg my-4 border border-gray-200 dark:border-white/10 overflow-hidden">
            <div className="themed-code-block-header flex justify-between items-center px-4 py-1.5 bg-gray-200/70 dark:bg-black/20 border-b border-gray-200 dark:border-white/10">
              <span className="themed-code-block-lang text-xs font-mono text-cyan-700 dark:text-cyan-400">{language}</span>
              <CopyButton code={code.trim()} />
            </div>
            <pre className="p-4 text-sm text-gray-900 dark:text-gray-200 overflow-x-auto font-mono">
              <code>{code.trim()}</code>
            </pre>
          </div>
        );
      }
      return <div key={index} dangerouslySetInnerHTML={{ __html: part.replace(/`([^`]+)`/g, '<code class="themed-inline-code bg-gray-200 text-cyan-700 dark:bg-slate-700/50 dark:text-cyan-400 py-0.5 px-1.5 rounded text-sm font-mono">$1</code>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} className="whitespace-pre-wrap my-2" />;
    });
  };

  return (
    <div className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-xl flex flex-col h-full p-4 shadow-lg dark:shadow-2xl dark:shadow-black/20"
         style={{ backgroundColor: theme.colors.resultBg }}>
      <div className="flex justify-between items-center mb-2 border-b border-gray-300 dark:border-white/10 pb-2">
        <h2 className="text-xl font-semibold" style={{ color: theme.colors.resultTitle }}>{title}</h2>
        <div className="flex items-center space-x-2">
          {!isLoading && content && (
            <Tooltip text={isAllCopied ? t('tooltipCopiedAll') : t('tooltipCopyAll')}>
              <button
                onClick={handleCopyAll}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors duration-200"
                aria-label="Copy all content"
              >
                {isAllCopied ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 00-2.25 2.25v6" />
                  </svg>
                )}
              </button>
            </Tooltip>
          )}
          <Tooltip text={isFullscreen ? t('tooltipExitFullscreen') : t('tooltipEnterFullscreen')}>
            <button 
              onClick={onToggleFullscreen}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors duration-200"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? <ArrowsPointingInIcon className="h-5 w-5" /> : <ArrowsPointingOutIcon className="h-5 w-5" />}
            </button>
          </Tooltip>
        </div>
      </div>

      {refactorSuggestion && (
        <div className="mb-3 p-3 bg-cyan-50 dark:bg-cyan-500/10 border-l-4 border-cyan-400 dark:border-cyan-500 rounded-r-lg flex items-center justify-between shadow-sm">
            <p className="text-sm font-medium text-cyan-800 dark:text-cyan-200">{t('refactoringSuggestionPrompt')}</p>
            <Tooltip text={t('tooltipApplyRefactoring')}>
                <button
                    onClick={onApplyRefactoring}
                    className="px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 bg-cyan-100 hover:bg-cyan-200 text-cyan-800 dark:text-white dark:bg-gradient-to-br dark:from-cyan-500 dark:to-blue-500 dark:hover:from-cyan-600 dark:hover:to-blue-600 focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
                >
                    {t('buttonApplyRefactoring')}
                </button>
            </Tooltip>
        </div>
      )}

      <div className="prose dark:prose-invert max-w-none flex-grow overflow-y-auto pr-2"
           style={{ color: theme.colors.resultText }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default ResultDisplay;