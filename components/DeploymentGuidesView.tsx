import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DEPLOYMENT_GUIDES_DATA } from '../data/deploymentGuides';
import { DeploymentGuide, DeploymentGuideStep } from '../types';
import Tooltip from './Tooltip';
import { ClipboardIcon, CheckCircleIcon } from '../icons';

// FIX: Added optional `children` prop to allow custom content and fixed state management.
const CopyButton: React.FC<{ code: string; onCopy?: () => void; children?: React.ReactNode }> = ({ code, onCopy, children }) => {
    const { t } = useLanguage();
    const [isCopied, setIsCopied] = useState(false);
  
    const handleCopy = (e: React.MouseEvent) => {
      e.stopPropagation();
      navigator.clipboard.writeText(code);
      setIsCopied(true);
      if (onCopy) onCopy();
      setTimeout(() => setIsCopied(false), 2000);
    };
  
    return (
      <Tooltip text={isCopied ? t('tooltipCopied') : t('tooltipCopy')}>
        <button
          onClick={handleCopy}
          className="bg-gray-300/30 hover:bg-gray-400/50 text-gray-600 dark:bg-slate-700/50 dark:hover:bg-slate-600/50 dark:text-gray-300 p-1.5 rounded-md transition-all flex items-center"
        >
          {children ?? (isCopied ? (
            <CheckCircleIcon className="h-5 w-5 text-green-500 dark:text-green-400" />
          ) : (
            <ClipboardIcon className="h-5 w-5" />
          ))}
        </button>
      </Tooltip>
    );
};

const CommandStep: React.FC<{ step: DeploymentGuideStep }> = ({ step }) => {
  return (
    <div className="mb-4">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{step.description}</p>
      {step.isCode !== false && (
        <div className="relative bg-gray-100 dark:bg-slate-900/70 rounded-lg border border-gray-200 dark:border-white/10 group">
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <CopyButton code={step.command} />
          </div>
          <pre className="p-4 text-sm text-gray-900 dark:text-gray-200 overflow-x-auto font-mono">
            <div className="flex">
              <span className="text-gray-500 dark:text-gray-600 mr-4 select-none">$</span>
              <code className="text-purple-600 dark:text-purple-400">{step.command}</code>
            </div>
          </pre>
        </div>
      )}
    </div>
  );
};


const GuideDetail: React.FC<{ guide: DeploymentGuide | null }> = ({ guide }) => {
    const { t } = useLanguage();
    const [isAllCopied, setIsAllCopied] = useState(false);

    useEffect(() => {
        setIsAllCopied(false);
    }, [guide]);

    // FIX: Added timeout to reset copied state for better UX.
    const handleCopyAll = () => {
        setIsAllCopied(true);
        setTimeout(() => setIsAllCopied(false), 2000);
    };

    if (!guide) {
        return <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">Selecione um guia para começar.</div>;
    }

    const fullScript = guide.steps
      .filter(step => step.isCode !== false)
      .map(step => step.command)
      .join(' && \\\n');

    return (
        <div className="p-6 h-full overflow-y-auto hide-scrollbar">
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-2xl text-gray-900 dark:text-gray-100">{guide.title}</h3>
                <CopyButton code={fullScript} onCopy={handleCopyAll}>
                    <div className="flex items-center gap-2">
                        {isAllCopied ? <CheckCircleIcon className="h-5 w-5 text-green-400" /> : <ClipboardIcon className="h-5 w-5" />}
                        {isAllCopied ? t('buttonCopied') : 'Copiar Todos os Comandos'}
                    </div>
                </CopyButton>
            </div>
            
            <div className="mb-6 p-4 bg-gray-100/50 dark:bg-slate-800/40 rounded-lg border border-gray-200 dark:border-white/10">
                <h5 className="font-semibold text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">{t('guideDescription')}</h5>
                <p className="text-sm text-gray-700 dark:text-gray-300">{guide.description}</p>
            </div>

            <div className="mb-6 p-4 bg-gray-100/50 dark:bg-slate-800/40 rounded-lg border border-gray-200 dark:border-white/10">
                <h5 className="font-semibold text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">{t('guideUseCase')}</h5>
                <p className="text-sm text-gray-700 dark:text-gray-300">{guide.useCase}</p>
            </div>
            
            <div>
                <h5 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-4">{t('guideCommands')}</h5>
                {guide.steps.map((step, index) => (
                    <CommandStep key={index} step={step} />
                ))}
            </div>
        </div>
    );
};


const DeploymentGuidesView: React.FC = () => {
    const { t } = useLanguage();
    const categories = Object.keys(DEPLOYMENT_GUIDES_DATA);
    const [activeCategory, setActiveCategory] = useState(categories[0]);
    const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
    const [selectedGuide, setSelectedGuide] = useState<DeploymentGuide | null>(null);
  
    const activeCategoryData = DEPLOYMENT_GUIDES_DATA[activeCategory];
    const hasSubCategories = !!activeCategoryData.subCategories;
  
    useEffect(() => {
      const firstSubCategory = hasSubCategories && activeCategoryData.subCategories 
        ? Object.keys(activeCategoryData.subCategories)[0] 
        : null;
      setActiveSubCategory(firstSubCategory);
      
      let firstGuide: DeploymentGuide | null = null;
      if (firstSubCategory && activeCategoryData.subCategories) {
        firstGuide = activeCategoryData.subCategories[firstSubCategory].guides?.[0] || null;
      } else {
        firstGuide = activeCategoryData.guides?.[0] || null;
      }
      setSelectedGuide(firstGuide);
    }, [activeCategory, hasSubCategories, activeCategoryData]);

    useEffect(() => {
        if (!activeSubCategory && hasSubCategories && activeCategoryData.subCategories) {
            const firstSub = Object.keys(activeCategoryData.subCategories)[0];
            setActiveSubCategory(firstSub);
        }
    }, [activeSubCategory, hasSubCategories, activeCategoryData]);

    useEffect(() => {
        let currentGuides: DeploymentGuide[] = [];
        if (hasSubCategories && activeSubCategory && activeCategoryData.subCategories) {
            currentGuides = activeCategoryData.subCategories[activeSubCategory]?.guides || [];
        } else if (activeCategoryData.guides) {
            currentGuides = activeCategoryData.guides;
        }
        setSelectedGuide(currentGuides[0] || null);
    }, [activeCategory, activeSubCategory, activeCategoryData, hasSubCategories]);
  
    const activeGuides = useMemo(() => {
      if (!activeCategoryData) return [];
      if (hasSubCategories && activeSubCategory && activeCategoryData.subCategories) {
        return activeCategoryData.subCategories[activeSubCategory]?.guides || [];
      }
      return activeCategoryData.guides || [];
    }, [activeCategoryData, hasSubCategories, activeSubCategory]);

    return (
        <div className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-xl flex flex-col h-full shadow-lg dark:shadow-2xl dark:shadow-black/20 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-white/10 flex-shrink-0">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">{t('deploymentGuidesTitle')}</h2>
            </div>
            
            <div className="flex flex-grow min-h-0">
                <div className="w-1/3 lg:w-1/4 flex flex-col border-r border-gray-300 dark:border-white/10 bg-gray-50/30 dark:bg-slate-900/20">
                    {/* Main Categories */}
                    <div className="flex-shrink-0 border-b border-gray-300 dark:border-white/10">
                        <div className="overflow-x-auto hide-scrollbar">
                            <div className="flex">
                                {categories.map(categoryKey => (
                                    <button
                                        key={categoryKey}
                                        onClick={() => setActiveCategory(categoryKey)}
                                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200 flex-shrink-0 whitespace-nowrap ${
                                            activeCategory === categoryKey
                                                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                                                : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'
                                        }`}
                                    >
                                        {t(DEPLOYMENT_GUIDES_DATA[categoryKey].displayName)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sub Categories */}
                    {hasSubCategories && activeCategoryData.subCategories && (
                        <div className="flex-shrink-0 border-b border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/30">
                            <div className="overflow-x-auto hide-scrollbar">
                                <div className="flex">
                                    {Object.keys(activeCategoryData.subCategories).map(subKey => (
                                        <button
                                            key={subKey}
                                            onClick={() => setActiveSubCategory(subKey)}
                                            className={`px-3 py-2 text-xs font-semibold transition-colors duration-200 flex-shrink-0 whitespace-nowrap rounded-t-lg ${
                                                activeSubCategory === subKey
                                                ? 'text-cyan-600 dark:text-cyan-400 bg-white/60 dark:bg-black/20'
                                                : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'
                                            }`}
                                        >
                                            {t(activeCategoryData.subCategories![subKey].displayName)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Guides List */}
                    <div className="flex-grow overflow-y-auto p-2 hide-scrollbar">
                        {activeGuides.map(guide => (
                           <button key={guide.title} onClick={() => setSelectedGuide(guide)} className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${selectedGuide?.title === guide.title ? 'bg-cyan-100 dark:bg-cyan-500/20' : 'hover:bg-gray-100/50 dark:hover:bg-slate-800/50'}`}>
                                <h4 className={`font-semibold text-sm ${selectedGuide?.title === guide.title ? 'text-cyan-800 dark:text-cyan-300' : 'text-gray-800 dark:text-gray-200'}`}>{guide.title}</h4>
                           </button>
                        ))}
                    </div>
                </div>

                <div className="w-2/3 lg:w-3/4 flex-grow bg-white/30 dark:bg-black/10">
                    <GuideDetail guide={selectedGuide} />
                </div>
            </div>
        </div>
    );
};

export default DeploymentGuidesView;