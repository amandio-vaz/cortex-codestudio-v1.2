import React from 'react';
import { ScriptHistoryEntry } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { HistoryIcon } from '../icons';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: ScriptHistoryEntry[];
  onRestore: (content: string) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ isOpen, onClose, history, onRestore }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const formatHistoryDate = (timestamp: number) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffSeconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const diffMinutes = Math.round(diffSeconds / 60);

    if (diffSeconds < 60) return t('historyDate_now');
    if (diffMinutes < 60) return t('historyDate_minutesAgo', { minutes: diffMinutes.toString() });

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (date > today) {
      return `${t('historyDate_today')} ${time}`;
    }
    if (date > yesterday) {
      return `${t('historyDate_yesterday')} ${time}`;
    }
    const dateString = date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
    return t('historyDateLabel', { date: dateString, time });
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900/70 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl shadow-black/40"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-300 dark:border-white/10 flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <HistoryIcon className="h-6 w-6 mr-2" />
            {t('historyTitle')}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="p-6 overflow-y-auto">
          {history.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-10">
              <p>{t('historyEmpty')}</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {history.map(entry => (
                <li key={entry.timestamp} className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg border border-gray-200 dark:border-white/10 hover:shadow-md hover:border-cyan-500/30 dark:hover:border-cyan-400/30 transition-all duration-200">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {formatHistoryDate(entry.timestamp)}
                    </p>
                    <button
                      onClick={() => onRestore(entry.content)}
                      className="px-3 py-1 text-xs font-semibold rounded-md bg-cyan-100 hover:bg-cyan-200 text-cyan-800 dark:text-white dark:bg-gradient-to-br dark:from-cyan-500 dark:to-blue-500 dark:hover:from-cyan-500 dark:hover:to-blue-600 transition-colors"
                    >
                      {t('buttonRestore')}
                    </button>
                  </div>
                  <pre className="mt-2 p-2 bg-white dark:bg-slate-900/70 rounded-md text-xs text-gray-600 dark:text-gray-400 font-mono overflow-x-auto max-h-24">
                    <code>{entry.content.split('\n').slice(0, 5).join('\n')}</code>
                  </pre>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPanel;
