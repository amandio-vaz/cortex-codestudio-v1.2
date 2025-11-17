import React, { useState, useCallback, useEffect, useRef } from 'react';
import Header from './components/Header';
import ScriptEditor from './components/ScriptEditor';
import ResultDisplay from './components/ResultDisplay';
import Chatbot from './components/Chatbot';
import TabButton from './components/TabButton';
import GeneratorView from './components/GeneratorView';
import SettingsModal from './components/SettingsModal';
import HistoryPanel from './components/HistoryPanel';
import GithubPanel from './components/GithubPanel';
import KnowledgeBaseView from './components/KnowledgeBaseView';
import ApiTestingView from './components/ApiTestingView';
import DeploymentGuidesView from './components/DeploymentGuidesView';
import AuthModal from './components/AuthModal';
import { ActiveView, ValidationIssue, ScriptHistoryEntry, GithubUser, Gist, RefactorSuggestion, ApiRequest } from './types';
import { analyzeScript, improveScript, generateScript, validateScript, executeScript, addDocstrings, optimizePerformance, checkSecurity, generateApiTestsFromScript, refactorSelection } from './services/geminiService';
import { getUser, getGistContent, createGist, updateGist } from './services/githubService';
import { useLanguage } from './context/LanguageContext';
import { useIconContext } from './context/IconContext';
import { useUndoRedo } from './hooks/useUndoRedo';
import { INITIAL_SCRIPT } from './constants';

const MAX_HISTORY_ENTRIES = 20;

const App: React.FC = () => {
  const { t } = useLanguage();
  const { getIconComponent } = useIconContext();

  const [script, { set: setScript, undo, redo, reset: resetScript, canUndo, canRedo }] = useUndoRedo<string>(() => {
    const savedScript = localStorage.getItem('bashstudio-script');
    return savedScript || INITIAL_SCRIPT;
  });

  const [result, setResult] = useState<string>('');
  const [resultTitle, setResultTitle] = useState<string>(t('tabAssistant'));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<ActiveView>(ActiveView.Assistant);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState<boolean>(false);
  const [isGithubPanelOpen, setIsGithubPanelOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const [fullscreenView, setFullscreenView] = useState<'editor' | 'result' | null>(null);
  const [scriptHistory, setScriptHistory] = useState<ScriptHistoryEntry[]>([]);
  const [refactorSuggestion, setRefactorSuggestion] = useState<RefactorSuggestion | null>(null);
  const [apiTestCollection, setApiTestCollection] = useState<ApiRequest[] | null>(null);

  // GitHub State
  const [githubToken, setGithubToken] = useState<string | null>(null);
  const [githubUser, setGithubUser] = useState<GithubUser | null>(null);
  const [currentGistId, setCurrentGistId] = useState<string | null>(null);

  const tabContainerRef = useRef<HTMLDivElement>(null);
  const [sliderStyle, setSliderStyle] = useState({});

  const scriptRef = useRef(script);
  useEffect(() => {
    scriptRef.current = script;
  }, [script]);

  // Handle notification timeouts
  useEffect(() => {
    if (notificationMessage) {
      const timer = setTimeout(() => {
        setNotificationMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notificationMessage]);

  // Load data from localStorage on initial render & check for KB updates
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('bashstudio-script-history');
      if (savedHistory) setScriptHistory(JSON.parse(savedHistory));

      const savedToken = localStorage.getItem('bashstudio-github-token');
      if (savedToken) handleTokenSubmit(savedToken);

      // Knowledge Base automatic update check (every 30 days)
      const lastCheckKey = 'bashstudio-last-kb-check';
      const lastCheck = localStorage.getItem(lastCheckKey);
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      const now = Date.now();

      if (!lastCheck || (now - parseInt(lastCheck, 10)) > thirtyDays) {
        // In a real app, you might fetch updates here.
        // For this mock, we just notify the user and update the timestamp.
        setNotificationMessage(t('knowledgeUpdateCheckNotification'));
        localStorage.setItem(lastCheckKey, now.toString());
      }

    } catch (error) {
      console.error("Failed to load data from localStorage:", error);
    }
  }, [t]);

  const handleToggleFullscreen = (view: 'editor' | 'result') => {
    setFullscreenView(prev => (prev === view ? null : view));
  };

  const handleScriptChange = (newScript: string) => {
    setScript(newScript);
    if (validationIssues.length > 0) {
      setValidationIssues([]);
    }
  };
  
  const handleSaveScript = useCallback(() => {
    localStorage.setItem('bashstudio-script', script);
    setNotificationMessage(t('saveNotification'));
    
    // Update history
    setScriptHistory(prevHistory => {
        if (prevHistory.length > 0 && prevHistory[0].content === script) {
            return prevHistory;
        }
        const newEntry: ScriptHistoryEntry = { timestamp: Date.now(), content: script };
        const updatedHistory = [newEntry, ...prevHistory].slice(0, MAX_HISTORY_ENTRIES);
        localStorage.setItem('bashstudio-script-history', JSON.stringify(updatedHistory));
        return updatedHistory;
    });

  }, [script, t]);

  const handleRunInTerminal = useCallback(() => {
    navigator.clipboard.writeText(script)
      .then(() => {
        setNotificationMessage(t('runInTerminalNotification'));
      })
      .catch(err => {
        console.error('Failed to copy script to clipboard:', err);
      });
  }, [script, t]);

  const handleClearScript = () => resetScript('');

  // FIX: Added handler for opening execution config.
  const handleOpenExecutionConfig = useCallback(() => {
    // TODO: Implement execution configuration modal
    console.log("Opening execution configuration...");
    setNotificationMessage(t('executionConfigNotImplemented'));
  }, [t]);

  // Keyboard shortcuts for save, undo, redo
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.userAgent.includes('Mac');
      const modKey = isMac ? event.metaKey : event.ctrlKey;

      if (modKey && event.key === 's') {
        event.preventDefault();
        handleSaveScript();
      } else if (modKey && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if (!isMac && event.ctrlKey && event.key.toLowerCase() === 'y') {
        event.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSaveScript, undo, redo]);

  const handleRestoreScript = (content: string) => {
    resetScript(content);
    setCurrentGistId(null);
    setIsHistoryPanelOpen(false);
  };
  
  useEffect(() => {
    if (tabContainerRef.current) {
      const activeTabElement = tabContainerRef.current.querySelector(`[data-view='${activeView}']`) as HTMLElement;
      if (activeTabElement) {
        setSliderStyle({
          left: `${activeTabElement.offsetLeft}px`,
          width: `${activeTabElement.offsetWidth}px`,
        });
      }
    }
  }, [activeView]);

  // --- GitHub Handlers ---
  const handleTokenSubmit = async (token: string) => {
    try {
      const user = await getUser(token);
      setGithubUser(user);
      setGithubToken(token);
      localStorage.setItem('bashstudio-github-token', token);
      return true;
    } catch (error) {
      console.error("GitHub token validation failed:", error);
      setGithubUser(null);
      setGithubToken(null);
      localStorage.removeItem('bashstudio-github-token');
      return false;
    }
  };

  const handleGithubLogout = () => {
    setGithubUser(null);
    setGithubToken(null);
    localStorage.removeItem('bashstudio-github-token');
  };

  const handleLoadGist = async (gist: Gist) => {
    if (!githubToken) return;
    const bashFile = Object.values(gist.files).find(f => f.filename.endsWith('.sh') || f.language === 'Shell');
    if (bashFile) {
        try {
            const content = await getGistContent(bashFile.raw_url, githubToken);
            resetScript(content);
            setCurrentGistId(gist.id);
            setIsGithubPanelOpen(false);
        } catch (error) {
            console.error("Failed to load Gist content:", error);
        }
    }
  };

  const handleSaveToGist = async (description: string, isPublic: boolean) => {
    if (!githubToken || !script) return;
    const filename = description.toLowerCase().replace(/\s+/g, '-') + '.sh';
    try {
      const newGist = await createGist(description, filename, script, isPublic, githubToken);
      setCurrentGistId(newGist.id);
      setNotificationMessage(t('gistUpdateSuccessNotification'));
    } catch(error) {
      console.error("Failed to create Gist:", error);
    }
  };

  const handleUpdateGist = async () => {
    if (!githubToken || !script || !currentGistId) return;
    try {
        await updateGist(currentGistId, script, githubToken);
        setNotificationMessage(t('gistUpdateSuccessNotification'));
    } catch (error) {
        console.error("Failed to update Gist:", error);
    }
  };

  // --- API Call Handler ---
  const handleApiCall = useCallback(async (
    apiFunc: (param: any) => Promise<any>, 
    param: any, 
    titleKey: string, 
    isGenerateOp: boolean = false,
    onSuccess?: (response: any) => void
  ) => {
    const title = t(titleKey);
    setRefactorSuggestion(null);
    setValidationIssues([]);
    setIsLoading(true);
    if (isGenerateOp) setIsThinking(true);
    setResult('');
    setActiveView(ActiveView.Assistant);
    setResultTitle(t('thinkingTitle', { title }));
    try {
      const response = await apiFunc(param);
      if (onSuccess) {
        onSuccess(response);
      } else {
        setResult(response);
      }
      setResultTitle(title);
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : t('errorGeneric');
      const detailedMessage = `${t('errorApiCall')}\n\n**${t('errorDetails')}:**\n\`\`\`\n${errorMessage}\n\`\`\``;
      setResult(detailedMessage);
      setResultTitle(t('errorTitle', { title }));
    } finally {
      setIsLoading(false);
      if (isGenerateOp) setIsThinking(false);
    }
  }, [t]);

  const handleAnalyze = () => handleApiCall(analyzeScript, script, 'analysisTitle');
  const handleImprove = () => handleApiCall(improveScript, script, 'improvementTitle');
  
  const handleExecute = (withSudo: boolean = false) => {
    const escapedScript = script.replace(/'/g, "'\\''");
    const scriptToExecute = withSudo ? `sudo bash -c '${escapedScript}'` : script;
    handleApiCall(executeScript, scriptToExecute, 'executionTitle', false, (response: string) => {
      setResult(response);
      setResultTitle(t('executionTitle'));
      const lines = response.replace(/```text\n?/, '').replace(/```\n?$/, '').split('\n');
      const newIssues: ValidationIssue[] = [];
      lines.forEach(line => {
        const match = line.match(/^L(\d+):\s*(.*)/);
        if (match) {
          newIssues.push({ line: parseInt(match[1], 10), message: `Execution Error: ${match[2]}`, severity: 'error' });
        }
      });
      if (newIssues.length > 0) setValidationIssues(newIssues);
    });
  };

  const handleAutoValidate = useCallback(async () => {
    const scriptToValidate = scriptRef.current;
    if (!scriptToValidate.trim()) {
      setValidationIssues([]);
      return;
    }
    try {
      const validationResult = await validateScript(scriptToValidate);
      if (scriptRef.current === scriptToValidate) setValidationIssues(validationResult.issues);
    } catch (error) {
      console.error("Auto-validation error:", error);
    }
  }, []);

  const handleValidate = async () => {
    setRefactorSuggestion(null);
    setIsLoading(true);
    setValidationIssues([]);
    setResult('');
    setActiveView(ActiveView.Assistant);
    const titleKey = 'validationSucceededWithIssuesTitle';
    setResultTitle(t('thinkingTitle', { title: t(titleKey) }));
    try {
      const res = await validateScript(script);
      setValidationIssues(res.issues);
      let report = `## ${t(titleKey)}\n\n`;
      if (res.issues.length === 0) {
        report += `**${t('validationPassedMessage')}**\n\n${t('validationPassedBody')}`;
      } else {
        const summary = res.isValid ? t('validationSucceededWithIssuesHeader') : t('validationReportHeader');
        report += `${summary}\n\n`;
        res.issues.forEach(issue => {
          const linePrefix = issue.line ? `${t('validationIssueLine', { line: issue.line.toString() })}: ` : '';
          report += `- **[${issue.severity.toUpperCase()}]** ${linePrefix}${issue.message}\n`;
        });
      }
      setResult(report);
      setResultTitle(t(titleKey));
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : t('errorGeneric');
      setResult(`Error: ${errorMessage}`);
      setResultTitle(t('errorTitle', { title: t(titleKey) }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async (promptToGenerate: string, systemInstruction: string, requiredCommands: string) => {
    const title = t('generationTitle');
    setRefactorSuggestion(null);
    setValidationIssues([]);
    setIsLoading(true);
    setIsThinking(true);
    setResult('');
    setActiveView(ActiveView.Assistant);
    setResultTitle(t('thinkingTitle', { title }));

    try {
      const genResponse = await generateScript(promptToGenerate, systemInstruction, requiredCommands);
      const match = genResponse.match(/```bash([\s\S]*?)```/);
      const extractedScript = match?.[1]?.trim();

      if (!extractedScript) {
        setResult(genResponse);
        setResultTitle(title);
        return;
      }

      const validation = await validateScript(extractedScript);
      let report = '';

      if (validation.isValid) {
        resetScript(extractedScript);
        setCurrentGistId(null);
        setValidationIssues(validation.issues); // Show warnings in editor
        
        report = `**${t('generationValidAndLoaded')}**\n\n`;
        if (validation.issues.length > 0) {
            report += `### ${t('validationSucceededWithIssuesTitle')}\n${t('validationSucceededWithIssuesHeader')}\n\n`;
            validation.issues.forEach(issue => {
                const linePrefix = issue.line ? `${t('validationIssueLine', { line: issue.line.toString() })}: ` : '';
                report += `- **[${issue.severity.toUpperCase()}]** ${linePrefix}${issue.message}\n`;
            });
            report += `\n\n---\n\n### ${t('originalGenerationTitle')}\n\n`;
        }
        setResult(report + genResponse);
        setResultTitle(title);
      } else {
        report = `## ${t('validationFailedTitle')}\n\n${t('validationReportHeader')}\n\n`;
        validation.issues.forEach(issue => {
            const linePrefix = issue.line ? `${t('validationIssueLine', { line: issue.line.toString() })}: ` : '';
            report += `- **[${issue.severity.toUpperCase()}]** ${linePrefix}${issue.message}\n`;
        });
        report += `\n\n---\n\n### ${t('originalGenerationTitle')}\n\n`;
        setResult(report + genResponse);
        setResultTitle(t('validationFailedTitle'));
      }

    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : t('errorGeneric');
      const detailedMessage = `${t('errorApiCall')}\n\n**${t('errorDetails')}:**\n\`\`\`\n${errorMessage}\n\`\`\``;
      setResult(detailedMessage);
      setResultTitle(t('errorTitle', { title }));
    } finally {
      setIsLoading(false);
      setIsThinking(false);
    }
  };

  const handleRefactorSelection = async (selectedText: string, range: { start: number; end: number }) => {
    if (!selectedText) return;
    
    setRefactorSuggestion(null); // Clear previous suggestion
    setIsLoading(true);
    setResult('');
    setActiveView(ActiveView.Assistant);
    const title = t('refactoringTitle');
    setResultTitle(t('thinkingTitle', { title }));

    try {
        const { suggestedCode, explanation } = await refactorSelection(selectedText);
        setRefactorSuggestion({ originalSelection: range, suggestedCode });
        setResult(explanation);
        setResultTitle(title);
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : t('errorGeneric');
        const detailedMessage = `${t('errorApiCall')}\n\n**${t('errorDetails')}:**\n\`\`\`\n${errorMessage}\n\`\`\``;
        setResult(detailedMessage);
        setResultTitle(t('errorTitle', { title }));
    } finally {
        setIsLoading(false);
    }
  };

  const handleApplyRefactoring = () => {
    if (!refactorSuggestion) return;
    
    const { originalSelection, suggestedCode } = refactorSuggestion;
    const currentScript = scriptRef.current;
    
    const newScript = 
        currentScript.substring(0, originalSelection.start) +
        suggestedCode +
        currentScript.substring(originalSelection.end);
        
    setScript(newScript);
    setRefactorSuggestion(null);
    setNotificationMessage(t('refactoringAppliedNotification'));
  };

  const handleAddDocstrings = () => handleApiCall(addDocstrings, script, 'docstringsTitle', false, (response: string) => {
      resetScript(response);
      setCurrentGistId(null);
      const resultMessage = `**${t('docstringsTitle')}**\n\n${t('docstringsSuccessMessage')}\n\n\`\`\`bash\n${response}\n\`\`\``;
      setResult(resultMessage);
      setResultTitle(t('docstringsTitle'));
  });
  const handleOptimizePerformance = () => handleApiCall(optimizePerformance, script, 'optimizationTitle');
  const handleCheckSecurity = () => handleApiCall(checkSecurity, script, 'securityTitle');
  
  const handleTestApi = (scriptFragment: string) => {
    if (!scriptFragment?.trim()) return;
    const title = t('apiTestTitle');
    setApiTestCollection(null);
    setIsLoading(true);
    setResult('');
    setResultTitle(t('thinkingTitle', { title }));
    setActiveView(ActiveView.Assistant);
    
    generateApiTestsFromScript(scriptFragment)
      .then(tests => {
        if (tests && tests.length > 0) {
            setApiTestCollection(tests);
            setActiveView(ActiveView.ApiTesting);
            setNotificationMessage(t('apiTestSuiteGenerated'));
        } else {
            setResult(t('apiTestsNotFound'));
            setResultTitle(title);
        }
      })
      .catch(err => {
        console.error(err);
        const errorMessage = err instanceof Error ? err.message : t('errorGeneric');
        const detailedMessage = `${t('errorApiCall')}\n\n**${t('errorDetails')}:**\n\`\`\`\n${errorMessage}\n\`\`\``;
        setResult(detailedMessage);
        setResultTitle(t('errorTitle', { title }));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  
  const AssistantIcon = getIconComponent('assistantTab');
  const GeneratorIcon = getIconComponent('generatorTab');
  const ChatIcon = getIconComponent('chatTab');
  const KnowledgeBaseIcon = getIconComponent('knowledgeBaseTab');
  const ApiTestingIcon = getIconComponent('apiTestingTab');
  const DeploymentGuidesIcon = getIconComponent('deploymentGuidesTab');

  const renderActiveView = () => {
    switch(activeView) {
      case ActiveView.Assistant:
        return (
          <ResultDisplay
            title={resultTitle}
            content={result}
            isLoading={isLoading}
            isThinking={isThinking}
            isFullscreen={fullscreenView === 'result'}
            onToggleFullscreen={() => handleToggleFullscreen('result')}
            refactorSuggestion={refactorSuggestion}
            onApplyRefactoring={handleApplyRefactoring}
          />
        );
      case ActiveView.Generator:
        return (
          <GeneratorView
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
        );
      case ActiveView.Chat:
        return <Chatbot />;
      case ActiveView.KnowledgeBase:
        return <KnowledgeBaseView />;
      case ActiveView.ApiTesting:
        return <ApiTestingView initialCollection={apiTestCollection} onCollectionUpdate={setApiTestCollection} />;
      case ActiveView.DeploymentGuides:
        return <DeploymentGuidesView />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen text-gray-800 dark:text-white flex flex-col font-sans">
      <Header 
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />
      <main className="flex-grow p-4 lg:p-6 flex flex-col lg:flex-row gap-6">
        <div className={`
          ${fullscreenView === 'result' ? 'hidden' : 'flex'}
          ${fullscreenView === 'editor' ? 'w-full' : 'lg:w-1/2'}
           flex-col transition-all duration-300
        `}>
          <ScriptEditor
            script={script}
            setScript={handleScriptChange}
            onSave={handleSaveScript}
            onUndo={undo}
            onRedo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
            onAnalyze={handleAnalyze}
            onImprove={handleImprove}
            onValidate={handleValidate}
            onExecute={handleExecute}
            onAutoValidate={handleAutoValidate}
            onToggleHistoryPanel={() => setIsHistoryPanelOpen(true)}
            onToggleGithubPanel={() => setIsGithubPanelOpen(true)}
            isLoading={isLoading}
            notificationMessage={notificationMessage}
            issues={validationIssues}
            isFullscreen={fullscreenView === 'editor'}
            onToggleFullscreen={() => handleToggleFullscreen('editor')}
            onAddDocstrings={handleAddDocstrings}
            onOptimizePerformance={handleOptimizePerformance}
            onCheckSecurity={handleCheckSecurity}
            onTestApi={handleTestApi}
            onClearScript={handleClearScript}
            onRunInTerminal={handleRunInTerminal}
            onRefactorSelection={handleRefactorSelection}
            githubUser={githubUser}
            currentGistId={currentGistId}
            onUpdateGist={handleUpdateGist}
            onOpenExecutionConfig={handleOpenExecutionConfig}
          />
        </div>
        <div className={`
          ${fullscreenView === 'editor' ? 'hidden' : 'flex'}
          ${fullscreenView === 'result' ? 'w-full' : 'lg:w-1/2'}
          flex-col min-h-[500px] lg:min-h-0 transition-all duration-300
        `}>
          <div ref={tabContainerRef} className="relative flex border-b border-gray-300 dark:border-white/10 mb-4">
             <TabButton 
                label={t('tabAssistant')}
                icon={<AssistantIcon className="h-5 w-5 mr-2" />}
                isActive={activeView === ActiveView.Assistant}
                onClick={() => setActiveView(ActiveView.Assistant)}
                tooltipText={t('tooltipAssistantTab')}
                view={ActiveView.Assistant}
             />
             <TabButton 
                label={t('tabGenerator')}
                icon={<GeneratorIcon className="h-5 w-5 mr-2" />}
                isActive={activeView === ActiveView.Generator}
                onClick={() => setActiveView(ActiveView.Generator)}
                tooltipText={t('tooltipGeneratorTab')}
                view={ActiveView.Generator}
             />
              <TabButton 
                label={t('tabApiTesting')}
                icon={<ApiTestingIcon className="h-5 w-5 mr-2" />}
                isActive={activeView === ActiveView.ApiTesting}
                onClick={() => setActiveView(ActiveView.ApiTesting)}
                tooltipText={t('tooltipApiTestingTab')}
                view={ActiveView.ApiTesting}
             />
             <TabButton 
                label={t('tabChatbot')}
                icon={<ChatIcon className="h-5 w-5 mr-2" />}
                isActive={activeView === ActiveView.Chat}
                onClick={() => setActiveView(ActiveView.Chat)}
                tooltipText={t('tooltipChatbotTab')}
                view={ActiveView.Chat}
             />
             <TabButton
                label={t('tabKnowledgeBase')}
                icon={<KnowledgeBaseIcon className="h-5 w-5 mr-2" />}
                isActive={activeView === ActiveView.KnowledgeBase}
                onClick={() => setActiveView(ActiveView.KnowledgeBase)}
                tooltipText={t('tooltipKnowledgeBaseTab')}
                view={ActiveView.KnowledgeBase}
             />
              <TabButton
                label={t('tabDeploymentGuides')}
                icon={<DeploymentGuidesIcon className="h-5 w-5 mr-2" />}
                isActive={activeView === ActiveView.DeploymentGuides}
                onClick={() => setActiveView(ActiveView.DeploymentGuides)}
                tooltipText={t('tooltipDeploymentGuidesTab')}
                view={ActiveView.DeploymentGuides}
             />
             <div 
               className="absolute bottom-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 dark:from-cyan-400 dark:to-purple-500 transition-all duration-300 ease-in-out" 
               style={sliderStyle}
              />
          </div>
          <div className="flex-grow transition-opacity duration-300" key={activeView}>
             {renderActiveView()}
          </div>
        </div>
      </main>
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      <HistoryPanel
        isOpen={isHistoryPanelOpen}
        onClose={() => setIsHistoryPanelOpen(false)}
        history={scriptHistory}
        onRestore={handleRestoreScript}
      />
      <GithubPanel
        isOpen={isGithubPanelOpen}
        onClose={() => setIsGithubPanelOpen(false)}
        token={githubToken}
        user={githubUser}
        onTokenSubmit={handleTokenSubmit}
        onLogout={handleGithubLogout}
        onLoadGist={handleLoadGist}
        onSaveGist={handleSaveToGist}
        onUpdateGist={handleUpdateGist}
        currentScript={script}
        currentGistId={currentGistId}
      />
      <footer className="py-3 px-6 text-xs text-gray-500 dark:text-gray-500 flex justify-between items-center border-t border-gray-200 dark:border-white/10">
        <span>Desenvolvido com ❤️ por Amândio Vaz - 2025</span>
        <div className="bg-gray-100 dark:bg-slate-800/60 text-gray-600 dark:text-gray-400 px-2.5 py-1 rounded-full font-mono tracking-wider">
          Release: v1.2
        </div>
      </footer>
    </div>
  );
};

export default App;
