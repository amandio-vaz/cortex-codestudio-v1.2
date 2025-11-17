import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MagnifyingGlassIcon } from '../icons';

export interface Command {
  id: string;
  name: string;
  icon: React.ReactNode;
  action: () => void;
  disabled: boolean;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: Command[];
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, commands }) => {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filteredCommands = useMemo(() => {
    return commands.filter(cmd => cmd.name.toLowerCase().includes(search.toLowerCase()));
  }, [search, commands]);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const command = filteredCommands[selectedIndex];
        if (command && !command.disabled) {
          command.action();
          onClose();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);
  
  useEffect(() => {
    const selectedItem = listRef.current?.children[selectedIndex] as HTMLLIElement | undefined;
    selectedItem?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);


  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900/90 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-xl w-full max-w-xl flex flex-col shadow-2xl shadow-black/40 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-3 border-b border-gray-300 dark:border-white/10 flex items-center space-x-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder={t('commandPalettePlaceholder')}
              className="w-full bg-transparent focus:outline-none text-gray-900 dark:text-gray-100"
            />
        </div>
        <ul ref={listRef} className="max-h-80 overflow-y-auto p-2">
            {filteredCommands.length > 0 ? (
                filteredCommands.map((cmd, index) => (
                    <li key={cmd.id}>
                        <button
                          onClick={() => {
                            if (!cmd.disabled) {
                                cmd.action();
                                onClose();
                            }
                          }}
                          disabled={cmd.disabled}
                          className={`w-full flex items-center space-x-3 p-2 rounded-md text-left transition-colors duration-150 ${
                            selectedIndex === index ? 'bg-cyan-100 dark:bg-cyan-500/20' : ''
                          } ${
                            cmd.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-slate-800/60'
                          }`}
                        >
                            {/* FIX: Cast the icon to a ReactElement with a className prop to satisfy TypeScript's type checking for React.cloneElement. */}
                            <span className="text-gray-600 dark:text-gray-400">{React.cloneElement(cmd.icon as React.ReactElement<{ className?: string }>, { className: 'h-5 w-5' })}</span>
                            <span className="text-sm text-gray-800 dark:text-gray-200">{cmd.name}</span>
                        </button>
                    </li>
                ))
            ) : (
                <li className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No commands found.
                </li>
            )}
        </ul>
      </div>
    </div>
  );
};

export default CommandPalette;