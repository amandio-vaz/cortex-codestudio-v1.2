import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useEditorTheme } from '../context/EditorThemeContext';
import { ApiRequest, ApiResponse, ApiMethod, ApiHeader, ApiRequestParam } from '../types';
import { analyzeApiResponse } from '../services/geminiService';

const LOCAL_STORAGE_KEY = 'bashstudio-api-collection';

// --- Helper Functions ---
const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const createNewRequest = (): ApiRequest => ({
  id: generateId(),
  name: 'Nova Requisição',
  method: 'GET',
  url: 'https://api.example.com/v1/users',
  headers: [{ id: generateId(), key: 'Content-Type', value: 'application/json', enabled: true }],
  params: [{ id: generateId(), key: '', value: '', enabled: true }],
  body: '',
});

// --- Main Component ---
const ApiTestingView: React.FC<{ initialCollection: ApiRequest[] | null, onCollectionUpdate: (collection: ApiRequest[] | null) => void }> = ({ initialCollection, onCollectionUpdate }) => {
  const { t } = useLanguage();
  const { theme } = useEditorTheme();

  // --- State Management ---
  const [collection, setCollection] = useState<ApiRequest[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [createNewRequest()];
    } catch {
      return [createNewRequest()];
    }
  });

  const [activeRequestId, setActiveRequestId] = useState<string | null>(collection[0]?.id || null);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- Effects ---
  useEffect(() => {
    // Load AI-generated collection when it becomes available
    if (initialCollection && initialCollection.length > 0) {
      setCollection(initialCollection);
      setActiveRequestId(initialCollection[0]?.id || null);
      onCollectionUpdate(null); // Clear the initial collection prop after loading
    }
  }, [initialCollection, onCollectionUpdate]);

  useEffect(() => {
    // Persist collection to localStorage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(collection));
  }, [collection]);

  // --- Derived State ---
  const activeRequest = useMemo(() => collection.find(req => req.id === activeRequestId), [collection, activeRequestId]);

  // --- Handlers ---
  const updateActiveRequest = (field: keyof ApiRequest, value: any) => {
    if (!activeRequestId) return;
    setCollection(current =>
      current.map(req =>
        req.id === activeRequestId ? { ...req, [field]: value } : req
      )
    );
  };

  const handleSendRequest = async () => {
    if (!activeRequest) return;

    setIsLoading(true);
    setResponse(null);

    const startTime = Date.now();
    try {
      const urlWithParams = new URL(activeRequest.url);
      activeRequest.params
        .filter(p => p.enabled && p.key)
        .forEach(p => urlWithParams.searchParams.append(p.key, p.value));

      const requestHeaders = activeRequest.headers
        .filter(h => h.enabled && h.key)
        .reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {});
      
      const res = await fetch(urlWithParams.toString(), {
        method: activeRequest.method,
        headers: requestHeaders,
        body: ['POST', 'PUT', 'PATCH'].includes(activeRequest.method) && activeRequest.body ? activeRequest.body : undefined,
      });

      const endTime = Date.now();
      const responseBody = await res.text();
      const responseHeaders: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
        body: responseBody,
        time: endTime - startTime,
      });

    } catch (error) {
      const endTime = Date.now();
      const errorMessage = error instanceof Error ? error.message : "Fetch failed";
      setResponse({
        status: 0,
        statusText: "Client Error",
        headers: {},
        body: JSON.stringify({ error: "Request Failed", message: errorMessage }, null, 2),
        time: endTime - startTime,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render ---
  return (
    <div className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-xl flex flex-col h-full shadow-lg dark:shadow-2xl dark:shadow-black/20" style={{ backgroundColor: theme.colors.resultBg }}>
      <h2 className="text-xl font-semibold p-4 border-b border-gray-300 dark:border-white/10" style={{ color: theme.colors.resultTitle }}>
        {t('apiTestingStudioTitle')}
      </h2>
      <div className="flex-grow flex overflow-hidden">
        {/* Collection Column */}
        <div className="w-1/4 border-r border-gray-300 dark:border-white/10 flex flex-col">
          <div className="p-2 border-b border-gray-300 dark:border-white/10 flex-shrink-0">
            <button
              onClick={() => {
                const newReq = createNewRequest();
                setCollection(c => [...c, newReq]);
                setActiveRequestId(newReq.id);
              }}
              className="w-full text-sm text-center bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-slate-700/50 dark:hover:bg-slate-600/50 dark:text-white font-medium py-2 px-4 rounded-lg transition-all"
            >
              {t('apiNewRequest')}
            </button>
          </div>
          <div className="overflow-y-auto p-2 space-y-1">
            {collection.map(req => (
              <button
                key={req.id}
                onClick={() => setActiveRequestId(req.id)}
                className={`w-full text-left p-2 rounded-md text-sm truncate ${req.id === activeRequestId ? 'bg-cyan-100 dark:bg-cyan-500/20' : 'hover:bg-gray-100 dark:hover:bg-slate-800/60'}`}
              >
                <span className={`font-bold mr-2 ${req.method === 'GET' ? 'text-green-500' : 'text-yellow-500'}`}>{req.method}</span>
                <span className="text-gray-700 dark:text-gray-300">{req.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Request & Response Columns */}
        <div className="w-3/4 flex flex-col">
          {activeRequest ? (
            <>
              {/* Request Editor */}
              <div className="flex-1 flex flex-col p-4 border-b border-gray-300 dark:border-white/10 min-h-0">
                <div className="flex space-x-2 mb-4">
                  <select value={activeRequest.method} onChange={e => updateActiveRequest('method', e.target.value as ApiMethod)} className="font-mono p-2 rounded-md border border-gray-300 dark:border-slate-700 focus:ring-2 focus:ring-cyan-500/50 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-200">
                    <option>GET</option><option>POST</option><option>PUT</option><option>PATCH</option><option>DELETE</option><option>HEAD</option>
                  </select>
                  <input type="text" value={activeRequest.url} onChange={e => updateActiveRequest('url', e.target.value)} placeholder="https://api.example.com" className="w-full font-mono p-2 rounded-md border border-gray-300 dark:border-slate-700 focus:ring-2 focus:ring-cyan-500/50 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-200" />
                  <button onClick={handleSendRequest} disabled={isLoading} className="px-6 py-2 rounded-lg text-white font-bold bg-gradient-to-br from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500">
                    {isLoading ? t('apiSending') : t('apiSend')}
                  </button>
                </div>
                <RequestTabs request={activeRequest} onRequestChange={updateActiveRequest} />
              </div>
              
              {/* Response Viewer */}
              <div className="flex-1 flex flex-col p-4 min-h-0">
                <ResponseViewer response={response} request={activeRequest} isLoading={isLoading} />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">{t('apiCollectionEmpty')}</div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Sub-components ---
const RequestTabs: React.FC<{ request: ApiRequest; onRequestChange: (field: keyof ApiRequest, value: any) => void }> = ({ request, onRequestChange }) => {
    const [activeTab, setActiveTab] = useState('params');
    const { t } = useLanguage();
    // FIX: In the `RequestTabs` component, added the `useEditorTheme` hook to correctly access the `theme` object for styling, resolving a 'Cannot find name 'theme'' error.
    const { theme } = useEditorTheme();

    const tabs = ['params', 'headers', 'body'];
    const tabLabels: Record<string, string> = {
        params: t('apiParams'),
        headers: t('apiHeaders'),
        body: t('apiBody'),
    };
  
    return (
      <div className="flex flex-col flex-grow min-h-0">
        <div className="flex border-b border-gray-300 dark:border-white/10">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === tab ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'}`}>
              {tabLabels[tab]}
            </button>
          ))}
        </div>
        <div className="flex-grow overflow-auto p-2 mt-2" style={{ backgroundColor: theme.colors.editorBg, borderRadius: '6px' }}>
          {activeTab === 'params' && <KeyValueEditor items={request.params} onChange={v => onRequestChange('params', v)} />}
          {activeTab === 'headers' && <KeyValueEditor items={request.headers} onChange={v => onRequestChange('headers', v)} />}
          {activeTab === 'body' && <BodyEditor value={request.body} onChange={v => onRequestChange('body', v)} />}
        </div>
      </div>
    );
};

const KeyValueEditor: React.FC<{ items: (ApiHeader | ApiRequestParam)[], onChange: (items: (ApiHeader | ApiRequestParam)[]) => void }> = ({ items, onChange }) => {
    const updateItem = (index: number, field: 'key' | 'value' | 'enabled', value: string | boolean) => {
        const newItems = [...items];
        (newItems[index] as any)[field] = value;
        onChange(newItems);
    };

    const addItem = () => {
        onChange([...items, { id: generateId(), key: '', value: '', enabled: true }]);
    };

    return (
        <div className="space-y-2">
            {items.map((item, index) => (
                <div key={item.id} className="flex items-center space-x-2">
                    <input type="checkbox" checked={item.enabled} onChange={e => updateItem(index, 'enabled', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" />
                    <input type="text" placeholder="Key" value={item.key} onChange={e => updateItem(index, 'key', e.target.value)} className="w-1/3 font-mono p-1 text-sm rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-200" />
                    <input type="text" placeholder="Value" value={item.value} onChange={e => updateItem(index, 'value', e.target.value)} className="w-2/3 font-mono p-1 text-sm rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-200" />
                </div>
            ))}
            <button onClick={addItem} className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline">+ Add</button>
        </div>
    );
};

const BodyEditor: React.FC<{ value: string; onChange: (value: string) => void }> = ({ value, onChange }) => {
    return <textarea value={value} onChange={e => onChange(e.target.value)} rows={6} className="w-full h-full font-mono p-2 text-sm rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-200 resize-none" />;
};
  
const ResponseViewer: React.FC<{ response: ApiResponse | null; request: ApiRequest; isLoading: boolean }> = ({ response, request, isLoading }) => {
    const [activeTab, setActiveTab] = useState('body');
    const { t } = useLanguage();
    const { theme } = useEditorTheme();
    const [aiAnalysis, setAiAnalysis] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);

    useEffect(() => {
        // Reset AI analysis when response changes
        setAiAnalysis('');
        setActiveTab('body');
    }, [response]);

    const handleGetAiAnalysis = async () => {
        if (!response) return;
        setIsAiLoading(true);
        try {
            const analysis = await analyzeApiResponse(request, response);
            setAiAnalysis(analysis);
        } catch (error) {
            setAiAnalysis('Error getting AI analysis.');
        } finally {
            setIsAiLoading(false);
        }
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-full text-gray-500">{t('apiSending')}</div>;
    }
    if (!response) {
        return <div className="flex items-center justify-center h-full text-gray-500">{t('apiNoResponse')}</div>;
    }

    const statusColor = response.status >= 400 ? 'text-red-500' : response.status >= 300 ? 'text-yellow-500' : 'text-green-500';

    const tabs = ['body', 'headers', 'ai'];
    const tabLabels: Record<string, string> = { body: t('apiResponseBody'), headers: t('apiResponseHeaders'), ai: t('apiAiAnalysis') };

    let formattedBody = response.body;
    try {
        formattedBody = JSON.stringify(JSON.parse(response.body), null, 2);
    } catch {}

    return (
        <div className="flex flex-col h-full min-h-0">
            <div className="flex items-center space-x-4 mb-2">
                <span className="text-sm">{t('apiStatus')}: <strong className={statusColor}>{response.status} {response.statusText}</strong></span>
                <span className="text-sm">{t('apiTime')}: <strong>{response.time}ms</strong></span>
            </div>
            <div className="flex border-b border-gray-300 dark:border-white/10">
                {tabs.map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === tab ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'}`}>
                        {tabLabels[tab]}
                    </button>
                ))}
            </div>
            <div className="flex-grow overflow-auto p-2 mt-2" style={{ backgroundColor: theme.colors.editorBg, borderRadius: '6px' }}>
                {activeTab === 'body' && <pre className="text-sm whitespace-pre-wrap"><code>{formattedBody}</code></pre>}
                {activeTab === 'headers' && <pre className="text-sm whitespace-pre-wrap"><code>{JSON.stringify(response.headers, null, 2)}</code></pre>}
                {activeTab === 'ai' && (
                    <div>
                        {!aiAnalysis && !isAiLoading && (
                            <button onClick={handleGetAiAnalysis} className="px-4 py-2 rounded-lg text-white font-semibold bg-purple-600 hover:bg-purple-700">Get AI Analysis</button>
                        )}
                        {isAiLoading && <p>Thinking...</p>}
                        {aiAnalysis && <div className="prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: aiAnalysis.replace(/```/g, '') }} />}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApiTestingView;