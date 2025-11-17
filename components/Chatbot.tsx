import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { getChatResponse } from '../services/geminiService';
import { useLanguage } from '../context/LanguageContext';
import Tooltip from './Tooltip';
import { useEditorTheme } from '../context/EditorThemeContext';

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

const Chatbot: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useEditorTheme();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [systemInstruction, setSystemInstruction] = useState<string>(() => {
    return localStorage.getItem('bashstudio-chat-instruction') || 'Você é um assistente prestativo e amigável, especializado em scripts Bash e ferramentas de linha de comando. Responda em Markdown bem formatado.';
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
      try {
          const savedMessages = localStorage.getItem('bashstudio-chat-history');
          if (savedMessages) return JSON.parse(savedMessages);
      } catch (e) {
          console.error("Failed to parse chat history from localStorage", e);
      }
      return [{ role: 'model', content: t('chatWelcome') }];
  });

  useEffect(() => {
    localStorage.setItem('bashstudio-chat-instruction', systemInstruction);
  }, [systemInstruction]);

  useEffect(() => {
    localStorage.setItem('bashstudio-chat-history', JSON.stringify(messages));
  }, [messages]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setInput('');
    setIsLoading(true);

    const geminiHistory = currentMessages
      .filter(msg => msg.role !== 'user' || msg.content !== input) // Don't include the immediate user message in history for the API call
      .map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }));

    try {
        const responseContent = await getChatResponse(geminiHistory, input, systemInstruction);
        const modelMessage: ChatMessage = { role: 'model', content: responseContent };
        setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
        console.error("Chat Error:", error);
        const modelMessage: ChatMessage = { role: 'model', content: t('errorChat') };
        setMessages(prev => [...prev, modelMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
  
  const renderMessageContent = (content: string) => {
    const parts = content.split(/(```\w*[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const langMatch = part.match(/^```(\w*)/);
        const language = langMatch && langMatch[1] ? langMatch[1] : 'text';
        const code = part.replace(/^```\w*\n?/, '').replace(/```\n?$/, '');
        
        return (
          <div key={index} className="themed-code-block bg-gray-100 dark:bg-slate-900/70 rounded-lg my-2 border border-gray-200 dark:border-white/10 overflow-hidden text-left">
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
      return <div key={index} dangerouslySetInnerHTML={{ __html: part.replace(/`([^`]+)`/g, '<code class="themed-inline-code bg-gray-200 text-cyan-700 dark:bg-slate-700/50 dark:text-cyan-400 py-0.5 px-1.5 rounded text-sm font-mono">$1</code>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} className="whitespace-pre-wrap" />;
    });
  };

  return (
    <div className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-xl flex flex-col h-full p-4 shadow-lg dark:shadow-2xl dark:shadow-black/20"
         style={{ backgroundColor: theme.colors.resultBg }}>
      <h2 className="text-xl font-semibold mb-2 border-b border-gray-300 dark:border-white/10 pb-2" style={{ color: theme.colors.resultTitle }}>{t('chatTitle')}</h2>
      
      <div className="mb-2">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('chatSystemInstruction')}</label>
          <input
            type="text"
            value={systemInstruction}
            onChange={(e) => setSystemInstruction(e.target.value)}
            placeholder={t('chatSystemInstructionPlaceholder')}
            className="w-full bg-gray-100 dark:bg-slate-900/50 text-gray-900 dark:text-gray-200 p-2 text-sm rounded-md border border-gray-300 dark:border-white/10 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none"
          />
      </div>

      <div className="flex-grow overflow-y-auto mb-4 pr-2 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl shadow-lg ${msg.role === 'user' ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white' : 'bg-gray-200 text-gray-800 dark:bg-slate-800/80 dark:text-gray-200 border border-gray-300 dark:border-white/10'}`}
                 style={ msg.role === 'model' ? { backgroundColor: theme.colors.codeBg, color: theme.colors.codeText } : {}}>
              <div className="text-sm">{renderMessageContent(msg.content)}</div>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="px-4 py-2 rounded-xl border border-gray-300 dark:border-white/10" style={{ backgroundColor: theme.colors.codeBg }}>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-cyan-500 dark:bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-cyan-500 dark:bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-cyan-500 dark:bg-cyan-400 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex relative items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t('chatPlaceholder')}
          className="w-full bg-gray-100 dark:bg-slate-900/50 text-gray-900 dark:text-gray-200 p-2 pl-4 pr-12 rounded-full border border-gray-300 dark:border-white/10 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none"
          disabled={isLoading}
        />
        <Tooltip text={t('tooltipSend')}>
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-gradient-to-br from-cyan-500 to-purple-600 text-white rounded-full hover:from-cyan-400 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-110"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default Chatbot;