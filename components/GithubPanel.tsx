import React, { useState, useEffect, useMemo } from 'react';
import { GithubUser, Gist } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getGists } from '../services/githubService';
import { GithubIcon } from '../icons';

interface GithubPanelProps {
  isOpen: boolean;
  onClose: () => void;
  token: string | null;
  user: GithubUser | null;
  onTokenSubmit: (token: string) => Promise<boolean>;
  onLogout: () => void;
  onLoadGist: (gist: Gist) => void;
  onSaveGist: (description: string, isPublic: boolean) => void;
  onUpdateGist: () => void;
  currentScript: string;
  currentGistId: string | null;
}

interface SaveGistModalProps {
    onClose: () => void;
    onSave: (description: string, isPublic: boolean) => void;
    isSaving: boolean;
}

const SaveGistModal: React.FC<SaveGistModalProps> = ({ onClose, onSave, isSaving }) => {
    const { t } = useLanguage();
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(false);

    const handleSave = () => {
        if (description.trim()) {
            onSave(description, isPublic);
        }
    };

    return (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-20 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-sm border border-gray-200 dark:border-white/10 shadow-xl">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">{t('githubSaveNewGist')}</h3>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t('githubGistDescription')}
                    className="w-full bg-gray-100 dark:bg-slate-900/50 p-2 rounded-md border border-gray-300 dark:border-white/10 focus:ring-2 focus:ring-cyan-500/50"
                />
                <div className="flex items-center my-4">
                    <input type="checkbox" id="gist-public" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" />
                    <label htmlFor="gist-public" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">{t('githubGistPublic')}</label>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                    <button onClick={onClose} className="px-4 py-2 text-sm rounded-md text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600">{t('githubGistCancelButton')}</button>
                    <button onClick={handleSave} disabled={!description.trim() || isSaving} className="px-4 py-2 text-sm rounded-md text-white bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400">
                        {isSaving ? t('githubGistSavingButton') : t('githubGistSaveButton')}
                    </button>
                </div>
            </div>
        </div>
    );
};

const GithubPanel: React.FC<GithubPanelProps> = ({ isOpen, onClose, token, user, onTokenSubmit, onLogout, onLoadGist, onSaveGist, onUpdateGist, currentScript, currentGistId }) => {
  const { t } = useLanguage();
  const [pat, setPat] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [gists, setGists] = useState<Gist[]>([]);
  const [isGistLoading, setIsGistLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  useEffect(() => {
    if (user && token) {
      setIsGistLoading(true);
      getGists(token)
        .then(allGists => {
          const bashGists = allGists.filter(gist => 
            Object.values(gist.files).some(file => file.language === 'Shell' || file.filename.endsWith('.sh'))
          );
          setGists(bashGists);
        })
        .catch(err => console.error("Failed to fetch gists", err))
        .finally(() => setIsGistLoading(false));
    }
  }, [user, token]);

  const handleConnect = async () => {
    setIsLoading(true);
    setError(null);
    const success = await onTokenSubmit(pat);
    if (!success) {
      setError(t('githubInvalidToken'));
    }
    setPat('');
    setIsLoading(false);
  };

  const filteredGists = useMemo(() => {
    return gists.filter(gist => 
      (gist.description || Object.keys(gist.files)[0] || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [gists, searchTerm]);

  if (!isOpen) return null;
  
  const handleSave = (description: string, isPublic: boolean) => {
    onSaveGist(description, isPublic);
    setIsSaveModalOpen(false);
  }

  const formatUpdateDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
  }

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900/70 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl shadow-black/40 relative" onClick={e => e.stopPropagation()}>
        <header className="p-4 border-b border-gray-300 dark:border-white/10 flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <GithubIcon className="h-6 w-6 mr-2" />
            {t('githubTitle')}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>

        {!user ? (
          <div className="p-6 text-center">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">{t('githubConnectTitle')}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">{t('githubConnectDescription')}</p>
            <a href="https://github.com/settings/tokens/new?scopes=gist" target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline">{t('githubConnectLink')}</a>
            <input
              type="password"
              value={pat}
              onChange={(e) => setPat(e.target.value)}
              placeholder={t('githubTokenPlaceholder')}
              className="mt-4 w-full max-w-sm mx-auto bg-gray-100 dark:bg-slate-900/50 p-2 rounded-md border border-gray-300 dark:border-white/10 focus:ring-2 focus:ring-cyan-500/50"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <button onClick={handleConnect} disabled={isLoading || !pat} className="mt-4 px-6 py-2 rounded-lg text-white bg-gradient-to-br from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500">
              {isLoading ? t('githubConnectingButton') : t('githubConnectButton')}
            </button>
          </div>
        ) : (
          <div className="flex flex-col flex-grow overflow-hidden">
            <div className="p-4 border-b border-gray-300 dark:border-white/10 flex justify-between items-center">
              <div className="flex items-center">
                <img src={user.avatar_url} alt={user.login} className="h-10 w-10 rounded-full mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('githubConnectedAs')}</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{user.login}</p>
                </div>
              </div>
              <button onClick={onLogout} className="text-sm text-red-600 dark:text-red-400 hover:underline">{t('githubLogout')}</button>
            </div>
            <div className="p-4 flex-grow overflow-y-auto">
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">{t('githubYourGists')}</h3>
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder={t('githubGistSearchPlaceholder')}
                className="w-full bg-gray-100/50 dark:bg-slate-800/50 p-2 rounded-md border border-gray-300 dark:border-white/10 focus:ring-2 focus:ring-cyan-500/50 mb-4"
              />
              {isGistLoading ? (
                <div className="text-center py-10 text-gray-500">Loading gists...</div>
              ) : filteredGists.length > 0 ? (
                <ul className="space-y-2">
                  {filteredGists.map(gist => (
                    <li key={gist.id} className="bg-gray-50 dark:bg-slate-800/50 p-3 rounded-lg border border-gray-200 dark:border-white/10 flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{gist.description || Object.keys(gist.files)[0]}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('githubGistLastUpdated')}: {formatUpdateDate(gist.updated_at)}</p>
                      </div>
                      <button onClick={() => onLoadGist(gist)} className="px-3 py-1 text-xs font-semibold rounded-md bg-cyan-100 text-cyan-800 hover:bg-cyan-200 dark:bg-cyan-500/20 dark:text-cyan-300 dark:hover:bg-cyan-500/30">
                        {t('githubLoadGist')}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-10 text-gray-500">{t('githubNoGists')}</div>
              )}
            </div>
            <footer className="p-4 border-t border-gray-300 dark:border-white/10 flex-shrink-0 flex items-center justify-end space-x-2">
              <button
                onClick={onUpdateGist}
                disabled={!currentGistId}
                className="px-4 py-2 text-sm rounded-md text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('githubUpdateGist')}
              </button>
              <button
                onClick={() => setIsSaveModalOpen(true)}
                className="px-4 py-2 text-sm rounded-md text-white bg-purple-600 hover:bg-purple-700"
              >
                {t('githubSaveNewGist')}
              </button>
            </footer>
            {isSaveModalOpen && (
              <SaveGistModal
                onClose={() => setIsSaveModalOpen(false)}
                onSave={handleSave}
                isSaving={isLoading}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GithubPanel;
