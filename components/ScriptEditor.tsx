import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useIconContext } from '../context/IconContext';
import Tooltip from './Tooltip';
import CommandPalette, { Command } from './CommandPalette';
import { ValidationIssue, GithubUser, EditorType } from '../types';
import { ArrowsPointingOutIcon, ArrowsPointingInIcon, SaveIcon, HistoryIcon, ChevronDownIcon, ShieldExclamationIcon, ClipboardIcon, CheckCircleIcon, GithubIcon, UndoIcon, RedoIcon, ChevronUpIcon, ICON_LIBRARY } from '../icons';
import { useEditorTheme } from '../context/EditorThemeContext';
import { getCodeCompletion } from '../services/geminiService';
import CompletionSuggestions from './CompletionSuggestions';

const SeverityIcon: React.FC<{ severity: 'error' | 'warning' | 'performance' }> = ({ severity }) => {
  const iconMap = {
    error: (
      <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    ),
    performance: (
      <svg className="h-4 w-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
    ),
  };
  return iconMap[severity];
};

interface ScriptEditorProps {
  content: string;
  setContent: (content: string) => void;
  onSave: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onAnalyze: () => void;
  onImprove: () => void;
  onValidate: () => void;
  onExecute: (withSudo: boolean) => void;
  onAutoValidate: () => void;
  onToggleHistoryPanel: () => void;
  onToggleGithubPanel: () => void;
  isLoading: boolean;
  notificationMessage: string | null;
  issues: ValidationIssue[];
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onAddDocstrings: () => void;
  onOptimizePerformance: () => void;
  onCheckSecurity: () => void;
  onTestApi: (scriptFragment: string) => void;
  onClearScript: () => void;
  onRunInTerminal: () => void;
  onRefactorSelection: (selection: string, range: { start: number, end: number }) => void;
  githubUser: GithubUser | null;
  currentGistId: string | null;
  onUpdateGist: () => void;
  onOpenExecutionConfig: () => void;
  activeEditor: EditorType;
  onSetEditor: (editor: EditorType) => void;
}

const highlightBash = (code: string): string => {
    code = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const comments: string[] = [];
    const strings: string[] = [];
    code = code.replace(/(#.*)/g, (match) => {
        const placeholder = `__COMMENT_${comments.length}__`;
        comments.push(`<span class="syntax-comment">${match}</span>`);
        return placeholder;
    });
    code = code.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, (match) => {
        const placeholder = `__STRING_${strings.length}__`;
        strings.push(`<span class="syntax-string">${match}</span>`);
        return placeholder;
    });
    const keywords = '\\b(if|then|else|fi|for|in|do|done|while|case|esac|function|echo|read|exit|return|source|export|local|declare|unset|sudo|chmod|chown|ls|cd|pwd|mkdir|rm|cp|mv|cat|grep|find|tar|ssh|ping|apt|apt-get|yum|dnf|systemctl)\\b';
    const keywordRegex = new RegExp(keywords, 'g');
    code = code.replace(keywordRegex, '<span class="syntax-keyword">$1</span>');
    code = code.replace(/(\$\w+|\${\w+.*?})/g, '<span class="syntax-variable">$1</span>');
    code = code.replace(/__STRING_(\d+)__/g, (_, index) => strings[parseInt(index, 10)]);
    code = code.replace(/__COMMENT_(\d+)__/g, (_, index) => comments[parseInt(index, 10)]);
    return code;
};

const highlightJson = (code: string): string => {
    code = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    code = code.replace(/"(\\.|[^"\\])*"/g, (match) => {
        return `<span class="syntax-string">${match}</span>`;
    });
    code = code.replace(/<span class="syntax-string">"([^"]*)"<\/span>\s*:/g, '<span class="syntax-keyword">"$1"</span>:');
    code = code.replace(/\b(-?\d+(\.\d+)?([eE][+-]?\d+)?)\b/g, '<span class="syntax-variable">$&</span>');
    code = code.replace(/\b(true|false|null)\b/g, '<span class="syntax-variable">$&</span>');
    return code;
};

const highlightYaml = (code: string): string => {
    code = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    code = code.replace(/(#.*)/g, '<span class="syntax-comment">$1</span>');
    code = code.replace(/^(\s*(?:- )?)([\w.-]+):/gm, '$1<span class="syntax-keyword">$2</span>:');
    code = code.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, '<span class="syntax-string">$&</span>');
    code = code.replace(/\b(true|false|null|yes|no)\b/g, '<span class="syntax-variable">$&</span>');
    return code;
};


const ScriptEditor: React.FC<ScriptEditorProps> = ({ content, setContent, onSave, undo, redo, canUndo, canRedo, onAnalyze, onImprove, onValidate, onExecute, onAutoValidate, onToggleHistoryPanel, onToggleGithubPanel, isLoading, notificationMessage, issues, isFullscreen, onToggleFullscreen, isCollapsed, onToggleCollapse, onAddDocstrings, onOptimizePerformance, onCheckSecurity, onTestApi, onClearScript, onRunInTerminal, onRefactorSelection, githubUser, currentGistId, onUpdateGist, onOpenExecutionConfig, activeEditor, onSetEditor }) => {
  const { t } = useLanguage();
  const { getIconComponent } = useIconContext();
  const { theme } = useEditorTheme();
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const [scrollTop, setScrollTop] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [tabSliderStyle, setTabSliderStyle] = useState({});

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [suggestionPosition, setSuggestionPosition] = useState<{ top: number; left: number } | null>(null);
  const suggestionTimeoutRef = useRef<number | null>(null);
  const isApplyingSuggestion = useRef(false);

  const LINE_HEIGHT = 20;
  const PADDING_TOP = 12;

  const lineCount = useMemo(() => content.split('\n').length || 1, [content]);
  const lineNumbers = useMemo(() => Array.from({ length: lineCount }, (_, i) => i + 1), [lineCount]);
  
  const highlightedHtml = useMemo(() => {
    switch (activeEditor) {
      case 'bash': return highlightBash(content);
      case 'json': return highlightJson(content);
      case 'yaml': return highlightYaml(content);
      default: return content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
  }, [content, activeEditor]);

  useEffect(() => {
    const validationTimeout = setTimeout(() => {
      onAutoValidate();
    }, 1000);
    return () => clearTimeout(validationTimeout);
  }, [content, onAutoValidate]);

  useEffect(() => {
    onSave();
  }, [content, onSave]);

  const fetchSuggestions = async () => {
    if (!textareaRef.current || activeEditor !== 'bash') return;
    const textarea = textareaRef.current;
    const cursorPosition = textarea.selectionStart;
    const textUpToCursor = textarea.value.substring(0, cursorPosition);
    const lines = textUpToCursor.split('\n');
    const currentLine = lines[lines.length - 1];

    if (currentLine.trim() === '') {
        setShowSuggestions(false);
        return;
    }

    const res = await getCodeCompletion(currentLine);
    if (res.length > 0) {
        setSuggestions(res);
        setSuggestionIndex(0);
        const FONT_WIDTH = 8;
        const GUTTER_WIDTH = 40;
        const currentLineNumber = lines.length;
        const currentColumn = lines[lines.length - 1].length;
        const top = (currentLineNumber * LINE_HEIGHT) - textarea.scrollTop + PADDING_TOP;
        const left = (currentColumn * FONT_WIDTH) + GUTTER_WIDTH + 16;
        setSuggestionPosition({ top, left });
        setShowSuggestions(true);
    } else {
        setShowSuggestions(false);
    }
  };

  useEffect(() => {
    if (isApplyingSuggestion.current) {
        isApplyingSuggestion.current = false;
        return;
    }
    if (suggestionTimeoutRef.current) clearTimeout(suggestionTimeoutRef.current);
    
    suggestionTimeoutRef.current = window.setTimeout(() => {
      if (activeEditor === 'bash') fetchSuggestions();
      else setShowSuggestions(false);
    }, 300);

    return () => { if (suggestionTimeoutRef.current) clearTimeout(suggestionTimeoutRef.current) };
  }, [content, activeEditor]);

  const applySuggestion = (index: number) => {
    if (!textareaRef.current) return;
    const suggestion = suggestions[index];
    const textarea = textareaRef.current;
    const cursorPosition = textarea.selectionStart;
    const textUpToCursor = textarea.value.substring(0, cursorPosition);
    const lastSpaceIndex = textUpToCursor.lastIndexOf(' ');
    const startOfWord = lastSpaceIndex === -1 ? 0 : lastSpaceIndex + 1;
    
    const newScript = 
        textarea.value.substring(0, startOfWord) +
        suggestion + " " +
        textarea.value.substring(cursorPosition);

    isApplyingSuggestion.current = true;
    setContent(newScript);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSuggestions && activeEditor === 'bash') {
        if (e.key === 'ArrowDown') { e.preventDefault(); setSuggestionIndex(prev => (prev + 1) % suggestions.length); } 
        else if (e.key === 'ArrowUp') { e.preventDefault(); setSuggestionIndex(prev => (prev - 1 + suggestions.length) % suggestions.length); } 
        else if (e.key === 'Tab' || e.key === 'Enter') { e.preventDefault(); applySuggestion(suggestionIndex); } 
        else if (e.key === 'Escape') { e.preventDefault(); setShowSuggestions(false); }
    } else if ((e.ctrlKey || e.metaKey) && e.key === ' ') {
        e.preventDefault();
        if (activeEditor === 'bash') fetchSuggestions();
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);
  
  const checkScroll = () => {
    if (textareaRef.current) {
        setShowScrollButtons(textareaRef.current.scrollHeight > textareaRef.current.clientHeight);
    }
  };

  useEffect(() => {
      checkScroll();
      const textarea = textareaRef.current;
      const resizeObserver = new ResizeObserver(checkScroll);
      if (textarea) resizeObserver.observe(textarea);
      return () => { if (textarea) resizeObserver.unobserve(textarea) };
  }, [content]);

  useEffect(() => {
    if (tabsRef.current) {
      const activeTabElement = tabsRef.current.querySelector(`[data-editor='${activeEditor}']`) as HTMLElement;
      if (activeTabElement) {
        setTabSliderStyle({
          left: `${activeTabElement.offsetLeft}px`,
          width: `${activeTabElement.offsetWidth}px`,
        });
      }
    }
  }, [activeEditor]);

  const handleScroll = () => {
    if (textareaRef.current) {
        const { scrollTop, scrollLeft } = textareaRef.current;
        setScrollTop(scrollTop);
        if (preRef.current) {
            preRef.current.scrollTop = scrollTop;
            preRef.current.scrollLeft = scrollLeft;
        }
    }
    setShowSuggestions(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const scrollToTop = () => textareaRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollToBottom = () => textareaRef.current?.scrollTo({ top: textareaRef.current.scrollHeight, behavior: 'smooth' });

  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const { selectionStart, selectionEnd } = e.currentTarget;
    setSelection({ start: selectionStart, end: selectionEnd });
  };

  const ClearIcon = getIconComponent('clearScript');
  const AnalyzeIcon = getIconComponent('analyze');
  const ValidateIcon = getIconComponent('validate');
  const ImproveIcon = getIconComponent('improve');
  const ExecuteIcon = getIconComponent('execute');
  const RunInTerminalIcon = getIconComponent('runInTerminal');
  const AddDocstringsIcon = getIconComponent('addDocstrings');
  const OptimizePerformanceIcon = getIconComponent('optimizePerformance');
  const CheckSecurityIcon = getIconComponent('checkSecurity');
  const TestApiIcon = getIconComponent('testApi');
  const RefactorIcon = getIconComponent('refactorSelection');

  const commands = useMemo((): Command[] => [
    { id: 'analyze', name: t('buttonAnalyze'), icon: <AnalyzeIcon />, action: onAnalyze, disabled: isLoading || !content },
    { id: 'improve', name: t('buttonImprove'), icon: <ImproveIcon />, action: onImprove, disabled: isLoading || !content },
    { id: 'validate', name: t('buttonValidate'), icon: <ValidateIcon />, action: onValidate, disabled: isLoading || !content },
    { id: 'execute', name: t('buttonExecute'), icon: <ExecuteIcon />, action: () => onExecute(false), disabled: isLoading || !content || activeEditor !== 'bash' },
    { id: 'executeSudo', name: t('buttonRunWithSudo'), icon: <ShieldExclamationIcon />, action: () => onExecute(true), disabled: isLoading || !content || activeEditor !== 'bash' },
    { id: 'addDocstrings', name: t('buttonAddDocstrings'), icon: <AddDocstringsIcon />, action: onAddDocstrings, disabled: isLoading || !content || activeEditor !== 'bash' },
    { id: 'optimize', name: t('buttonOptimizePerformance'), icon: <OptimizePerformanceIcon />, action: onOptimizePerformance, disabled: isLoading || !content || activeEditor !== 'bash' },
    { id: 'security', name: t('buttonCheckSecurity'), icon: <CheckSecurityIcon />, action: onCheckSecurity, disabled: isLoading || !content || activeEditor !== 'bash' },
    { id: 'testApi', name: t('buttonTestApi'), icon: <TestApiIcon />, action: () => onTestApi(content), disabled: isLoading || !content || activeEditor !== 'bash' },
  ], [t, content, isLoading, onAnalyze, onImprove, onValidate, onExecute, onAddDocstrings, onOptimizePerformance, onCheckSecurity, onTestApi, activeEditor]);

  const highlightColors = {
      error: theme.colors.highlightError,
      warning: theme.colors.highlightWarning,
      performance: theme.colors.highlightPerformance
  };

  const ConfigIcon = ICON_LIBRARY.settings.Gear;

  const utilityButtonClasses = "w-full flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 hover:bg-gray-300 text-gray-800 dark:text-gray-200 dark:bg-gradient-to-br dark:from-gray-500 dark:to-gray-600 dark:hover:from-gray-600 dark:hover:to-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800";
  
  const editorTabs: { id: EditorType; label: string }[] = [
    { id: 'bash', label: 'Bash' },
    { id: 'yaml', label: 'YAML' },
    { id: 'json', label: 'JSON' },
  ];

  return (
    <div
      className={`bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-xl relative shadow-lg dark:shadow-2xl dark:shadow-black/20 transition-all duration-300 flex flex-col h-full ${
        isCollapsed ? 'p-2 items-center justify-start' : 'p-4'
      }`}
      style={{ backgroundColor: theme.isDark ? theme.colors.resultBg : undefined }}
    >
      {isCollapsed ? (
        <Tooltip text={t('tooltipExpandEditor')}>
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors duration-200"
              aria-label={t('tooltipExpandEditor')}
            >
              <ChevronDownIcon className="h-6 w-6" />
            </button>
        </Tooltip>
      ) : (
        <>
          <CommandPalette
            isOpen={isPaletteOpen}
            onClose={() => setIsPaletteOpen(false)}
            commands={commands}
          />
          
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-500 dark:from-slate-200 dark:to-slate-400">
              {t('editorsTitle')}
            </h2>
            <div className="flex items-center space-x-1">
              <Tooltip text={t('tooltipCollapseEditor')}>
                <button
                  onClick={onToggleCollapse}
                  className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors duration-200"
                  aria-label={t('tooltipCollapseEditor')}
                >
                  <ChevronUpIcon className="h-5 w-5" />
                </button>
              </Tooltip>
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

          <div className="mt-4 flex flex-col flex-grow min-h-0">
              <div ref={tabsRef} className="relative flex border-b border-gray-300/50 dark:border-white/10 mb-4">
                {editorTabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => onSetEditor(tab.id)}
                        className={`px-6 py-2 text-sm font-semibold transition-colors duration-300 relative ${
                            activeEditor === tab.id
                                ? 'text-cyan-600 dark:text-cyan-400'
                                : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'
                        }`}
                        data-editor={tab.id}
                    >
                        {tab.label}
                    </button>
                ))}
                <div
                    className="absolute bottom-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-300 ease-in-out"
                    style={tabSliderStyle}
                />
              </div>

              <div className="w-full flex-grow relative flex border border-gray-300 dark:border-white/10 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-cyan-500/50 transition-shadow"
                  style={{ backgroundColor: theme.colors.editorBg }}>
                  {showScrollButtons && (
                      <div className="absolute bottom-4 right-4 z-20 flex flex-col space-y-2">
                          <Tooltip text={t('tooltipScrollTop')}><button onClick={scrollToTop} className="p-2 rounded-full bg-gray-800/50 dark:bg-black/30 backdrop-blur-md text-white hover:bg-gray-800/70 dark:hover:bg-black/50 transition-colors"><ChevronUpIcon className="h-5 w-5" /></button></Tooltip>
                          <Tooltip text={t('tooltipScrollBottom')}><button onClick={scrollToBottom} className="p-2 rounded-full bg-gray-800/50 dark:bg-black/30 backdrop-blur-md text-white hover:bg-gray-800/70 dark:hover:bg-black/50 transition-colors"><ChevronDownIcon className="h-5 w-5" /></button></Tooltip>
                      </div>
                  )}
                  <div className="p-3 pr-2 text-right font-mono text-sm select-none z-10 border-r border-gray-300 dark:border-white/10" style={{ lineHeight: `${LINE_HEIGHT}px`, color: theme.colors.lineNumbers, backgroundColor: theme.colors.editorGutterBg }} aria-hidden="true">
                    <div style={{ transform: `translateY(-${scrollTop}px)` }}>
                        {lineNumbers.map((num) => (<div key={num}>{num}</div>))}
                    </div>
                  </div>

                  <div className="relative flex-grow">
                  <div className="absolute top-0 left-0 h-full w-full pointer-events-none z-0" style={{ transform: `translateY(-${scrollTop}px)` }}>
                      {issues.filter(issue => issue.line !== null).map((issue, index) => (
                          <div key={index} className="absolute left-0 w-full" style={{ backgroundColor: highlightColors[issue.severity], top: `${PADDING_TOP + (issue.line! - 1) * LINE_HEIGHT}px`, height: `${LINE_HEIGHT}px` }} />
                      ))}
                  </div>
                  
                  <pre ref={preRef} aria-hidden="true" className="syntax-highlight absolute inset-0 p-3 pl-8 font-mono text-sm overflow-hidden z-0 pointer-events-none" style={{ color: theme.colors.editorText, lineHeight: `${LINE_HEIGHT}px`, whiteSpace: 'pre', overflowWrap: 'normal' }}>
                    <code dangerouslySetInnerHTML={{ __html: highlightedHtml + '\n' }} />
                  </pre>
                  
                  <textarea ref={textareaRef} value={content} onChange={(e) => setContent(e.target.value)} onScroll={handleScroll} onSelect={handleSelect} onKeyDown={handleKeyDown} placeholder={t('editorPlaceholder')} className="absolute inset-0 w-full h-full bg-transparent p-3 pl-8 font-mono text-sm focus:outline-none resize-none z-10" style={{ color: 'transparent', caretColor: theme.colors.editorText, WebkitTextFillColor: 'transparent', whiteSpace: 'pre', overflowWrap: 'normal', lineHeight: `${LINE_HEIGHT}px` }} wrap="off" spellCheck="false" />
                  {showSuggestions && suggestionPosition && ( <CompletionSuggestions suggestions={suggestions} position={suggestionPosition} selectedIndex={suggestionIndex} onSelect={(index) => applySuggestion(index)} /> )}
                  <div className="absolute top-0 h-full pointer-events-none" style={{ left: '-28px', transform: `translateY(-${scrollTop}px)`, width: 'calc(100% + 28px)' }}>
                      {issues.map((issue, index) => {
                          const issuesForLine = issues.filter(i => i.line === issue.line);
                          if (issues.findIndex(i => i.line === issue.line) !== index) return null;
                          if (issue.line === null) return null;
                          return (
                              <div key={`${issue.line}-${index}`} className="absolute left-4 group pointer-events-auto z-20" style={{ top: `${PADDING_TOP + (issue.line - 1) * LINE_HEIGHT + 2}px` }}>
                                  <SeverityIcon severity={issue.severity} />
                                  <div className="absolute left-full ml-2 w-max max-w-xs bg-gray-800/90 dark:bg-black/60 backdrop-blur-md text-white text-xs rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-30 border border-gray-600 dark:border-white/10 shadow-lg">
                                      {issuesForLine.map((i, idx) => ( <div key={idx}>{`[${i.severity.toUpperCase()}] ${i.message}`}</div> ))}
                                  </div>
                              </div>
                          )
                      })}
                  </div>
                  </div>
              </div>
              <div className={`absolute bottom-20 right-4 bg-gray-800/90 dark:bg-black/30 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg transition-opacity duration-500 pointer-events-none border border-gray-600 dark:border-white/10 ${ notificationMessage ? 'opacity-100' : 'opacity-0' }`} aria-live="polite">
                  <div className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-green-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>{notificationMessage}</div>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                      <Tooltip text={t('tooltipClear')}><button onClick={onClearScript} disabled={isLoading || !content} className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-red-100 hover:bg-red-200 text-red-800 dark:text-white dark:bg-gradient-to-br dark:from-red-600 dark:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-900"><ClearIcon className="h-5 w-5 sm:mr-2" /><span className="hidden sm:inline">{t('buttonClear')}</span></button></Tooltip>
                      <Tooltip text={t('tooltipUndo')}><button onClick={undo} disabled={isLoading || !canUndo} className={utilityButtonClasses}><UndoIcon className="h-5 w-5 sm:mr-2" /><span className="hidden sm:inline">{t('buttonUndo')}</span></button></Tooltip>
                      <Tooltip text={t('tooltipRedo')}><button onClick={redo} disabled={isLoading || !canRedo} className={utilityButtonClasses}><RedoIcon className="h-5 w-5 sm:mr-2" /><span className="hidden sm:inline">{t('buttonRedo')}</span></button></Tooltip>
                      <Tooltip text={t('tooltipSave')}><button onClick={onSave} disabled={isLoading} className={utilityButtonClasses}><SaveIcon className="h-5 w-5 sm:mr-2" /><span className="hidden sm:inline">{t('buttonSave')}</span></button></Tooltip>
                      <Tooltip text={t('tooltipCopyScript')}><button onClick={handleCopy} disabled={isLoading || !content || isCopied} className={`${utilityButtonClasses} ${isCopied ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300 cursor-default' : ''}`}>{isCopied ? <CheckCircleIcon className="h-5 w-5 sm:mr-2" /> : <ClipboardIcon className="h-5 w-5 sm:mr-2" />}<span className="hidden sm:inline">{isCopied ? t('buttonCopied') : t('buttonCopy')}</span></button></Tooltip>
                      <Tooltip text={t('tooltipHistory')}><button onClick={onToggleHistoryPanel} disabled={isLoading || activeEditor !== 'bash'} className={utilityButtonClasses}><HistoryIcon className="h-5 w-5 sm:mr-2" /><span className="hidden sm:inline">{t('buttonHistory')}</span></button></Tooltip>
                      {githubUser ? ( currentGistId ? (
                          <Tooltip text={t('tooltipSyncGist')}><button onClick={onUpdateGist} disabled={isLoading} className={utilityButtonClasses}><GithubIcon className="h-5 w-5 sm:mr-2" /><span className="hidden sm:inline">{t('githubUpdateGist')}</span></button></Tooltip>
                      ) : (
                          <Tooltip text={t('tooltipGithub')}><button onClick={onToggleGithubPanel} disabled={isLoading} className={utilityButtonClasses}><GithubIcon className="h-5 w-5 sm:mr-2" /><span className="hidden sm:inline">{t('githubSaveNewGist')}</span></button></Tooltip>
                      )) : (
                          <Tooltip text={t('tooltipGithub')}><button onClick={onToggleGithubPanel} disabled={isLoading} className={utilityButtonClasses}><GithubIcon className="h-5 w-5 sm:mr-2" /><span className="hidden sm:inline">GitHub</span></button></Tooltip>
                      )}
                  </div>

                  <hr className="border-gray-300/50 dark:border-white/10" />
                  
                  <div className="grid grid-cols-5 gap-3 items-center">
                      <div className="col-span-1"><Tooltip text={t('tooltipRunInTerminal')}><button onClick={onRunInTerminal} disabled={isLoading || !content || activeEditor !== 'bash'} className={utilityButtonClasses}><RunInTerminalIcon className="h-5 w-5 mr-2" /> {t('buttonRunInTerminal')}</button></Tooltip></div>
                      <div className="col-span-3"><Tooltip text={t('tooltipExecute')}><button onClick={() => onExecute(false)} disabled={isLoading || !content || activeEditor !== 'bash'} className="w-full flex items-center justify-center px-4 py-3 text-base font-bold rounded-lg transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-purple-100 hover:bg-purple-200 text-purple-800 dark:text-white dark:bg-gradient-to-br dark:from-purple-600 dark:to-pink-500 dark:hover:from-purple-700 dark:hover:to-pink-600 focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 shadow-lg hover:shadow-xl hover:scale-105 active:scale-100"><ExecuteIcon className="h-6 w-6 mr-2" /><span>{t('buttonExecute')}</span></button></Tooltip></div>
                      <div className="col-span-1"><Tooltip text={t('tooltipConfigureExecution')}><button onClick={onOpenExecutionConfig} disabled={activeEditor !== 'bash'} className={utilityButtonClasses}><ConfigIcon className="h-5 w-5 mr-2" /> {t('buttonConfigureExecution')}</button></Tooltip></div>
                  </div>

                  <hr className="border-gray-300/50 dark:border-white/10" />

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <Tooltip text={t('tooltipAnalyze')}><button onClick={onAnalyze} disabled={isLoading || !content} className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-cyan-100 hover:bg-cyan-200 text-cyan-800 dark:text-white dark:bg-gradient-to-br dark:from-cyan-500 dark:to-blue-500 dark:hover:from-cyan-500 dark:hover:to-blue-500 focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"><AnalyzeIcon className="h-5 w-5 mr-2" /> {t('buttonAnalyze')}</button></Tooltip>
                      <Tooltip text={t('tooltipImprove')}><button onClick={onImprove} disabled={isLoading || !content} className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-green-100 hover:bg-green-200 text-green-800 dark:text-white dark:bg-gradient-to-br dark:from-green-500 dark:to-teal-500 dark:hover:from-green-500 dark:hover:to-teal-500 focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"><ImproveIcon className="h-5 w-5 mr-2" /> {t('buttonImprove')}</button></Tooltip>
                      <Tooltip text={t('tooltipValidate')}><button onClick={onValidate} disabled={isLoading || !content} className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-yellow-100 hover:bg-yellow-200 text-yellow-800 dark:text-white dark:bg-gradient-to-br dark:from-yellow-500 dark:to-orange-500 dark:hover:from-yellow-500 dark:hover:to-orange-500 focus:ring-4 focus:outline-none focus:ring-yellow-200 dark:focus:ring-yellow-800"><ValidateIcon className="h-5 w-5 mr-2" />{t('buttonValidate')}</button></Tooltip>
                      <Tooltip text={t('tooltipRefactorSelection')}><button onClick={() => onRefactorSelection(content.substring(selection.start, selection.end), selection)} disabled={isLoading || selection.start === selection.end || activeEditor !== 'bash'} className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-pink-100 hover:bg-pink-200 text-pink-800 dark:text-white dark:bg-gradient-to-br dark:from-pink-500 dark:to-rose-500 dark:hover:from-pink-500 dark:hover:to-rose-500 focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"><RefactorIcon className="h-5 w-5 mr-2" /> {t('buttonRefactorSelection')}</button></Tooltip>
                      <Tooltip text={t('tooltipAddDocstrings')}><button onClick={onAddDocstrings} disabled={isLoading || !content || activeEditor !== 'bash'} className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-blue-100 hover:bg-blue-200 text-blue-800 dark:text-white dark:bg-gradient-to-br dark:from-blue-500 dark:to-sky-500 dark:hover:from-blue-500 dark:hover:to-sky-500 focus:ring-4 focus:outline-none focus:ring-blue-200 dark:focus:ring-blue-800"><AddDocstringsIcon className="h-5 w-5 mr-2" /> {t('buttonAddDocstrings')}</button></Tooltip>
                      <Tooltip text={t('tooltipOptimizePerformance')}><button onClick={onOptimizePerformance} disabled={isLoading || !content || activeEditor !== 'bash'} className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-100 hover:bg-indigo-200 text-indigo-800 dark:text-white dark:bg-gradient-to-br dark:from-indigo-500 dark:to-violet-500 dark:hover:from-indigo-500 dark:hover:to-violet-500 focus:ring-4 focus:outline-none focus:ring-indigo-200 dark:focus:ring-indigo-800"><OptimizePerformanceIcon className="h-5 w-5 mr-2" /> {t('buttonOptimizePerformance')}</button></Tooltip>
                      <Tooltip text={t('tooltipCheckSecurity')}><button onClick={onCheckSecurity} disabled={isLoading || !content || activeEditor !== 'bash'} className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-red-100 hover:bg-red-200 text-red-800 dark:text-white dark:bg-gradient-to-br dark:from-red-500 dark:to-pink-500 dark:hover:from-red-500 dark:hover:to-pink-500 focus:ring-4 focus:outline-none focus:ring-red-200 dark:focus:ring-red-800"><CheckSecurityIcon className="h-5 w-5 mr-2" /> {t('buttonCheckSecurity')}</button></Tooltip>
                      <Tooltip text={t('tooltipTestApi')}><button onClick={() => onTestApi(selection.start !== selection.end ? content.substring(selection.start, selection.end) : content)} disabled={isLoading || !content || activeEditor !== 'bash'} className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-orange-100 hover:bg-orange-200 text-orange-800 dark:text-white dark:bg-gradient-to-br dark:from-orange-500 dark:to-amber-500 dark:hover:from-orange-500 dark:hover:to-amber-500 focus:ring-4 focus:outline-none focus:ring-orange-200 dark:focus:ring-orange-800"><TestApiIcon className="h-5 w-5 mr-2" /> {t('buttonTestApi')}</button></Tooltip>
                  </div>
              </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ScriptEditor;