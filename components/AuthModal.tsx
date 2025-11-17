import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { login, register, isLoading } = useAuth();
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({ email: '', password: '' });

  // Reset state when modal is opened
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setError('');
      setValidationErrors({ email: '', password: '' });
      setIsLoginView(true); // Default to login view
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('authErrorInvalidEmail');
      isValid = false;
    }

    // Only check password length for registration for better login UX, or for both
    if (password.length < 6) {
      newErrors.password = t('authErrorPasswordLength');
      isValid = false;
    }

    setValidationErrors(newErrors);
    return isValid;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) {
      return;
    }

    const action = isLoginView ? login : register;
    const success = await action(email, password);
    
    if (success) {
      onClose();
    } else {
      setError('Authentication failed. Please try again.'); // Generic error
    }
  };

  const handleSwitchView = () => {
    setIsLoginView(!isLoginView);
    setError('');
    setValidationErrors({ email: '', password: '' });
  };
  
  const title = isLoginView ? t('authModalTitleLogin') : t('authModalTitleRegister');
  const submitButtonText = isLoginView ? t('buttonLogin') : t('authModalTitleRegister');
  const switchButtonText = isLoginView ? t('authSwitchToRegister') : t('authSwitchToLogin');

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900/70 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-2xl w-full max-w-sm flex flex-col shadow-2xl shadow-black/40"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-300 dark:border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('authEmailLabel')}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className={`mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-800/60 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm ${validationErrors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-slate-700 focus:ring-cyan-500 focus:border-cyan-500'}`}
            />
             {validationErrors.email && <p className="mt-1 text-xs text-red-500">{validationErrors.email}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('authPasswordLabel')}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className={`mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-800/60 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm ${validationErrors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-slate-700 focus:ring-cyan-500 focus:border-cyan-500'}`}
            />
            {validationErrors.password && <p className="mt-1 text-xs text-red-500">{validationErrors.password}</p>}
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50"
            >
              {isLoading ? '...' : submitButtonText}
            </button>
          </div>
          <div className="text-center">
            <button type="button" onClick={handleSwitchView} className="text-sm text-cyan-600 hover:underline dark:text-cyan-400">
              {switchButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
