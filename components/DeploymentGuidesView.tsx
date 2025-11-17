import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DEPLOYMENT_GUIDES_DATA } from '../data/deploymentGuides';
import { DeploymentGuide } from '../types';
import Tooltip from './Tooltip';
import { ClipboardIcon, CheckCircleIcon } from '../icons';

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
          className="absolute top-2 right-2 bg-gray-300/50 hover:bg-gray-400/50 text-gray-700 dark:bg-slate-700/50 dark:hover:bg-slate-600/50 dark:text-gray-300 p-1.5 rounded-md transition-all flex items-center"
        >
          {isCopied ? (
            <CheckCircleIcon className="h-4 w-4 text-green-500 dark:text-green-400" />
          ) : (
            <ClipboardIcon className="h-4 w-4" />
          )}
        </button>
      </Tooltip>
    );
};

const GuideCard: React.FC<{ guide: DeploymentGuide }> = ({ guide }) => {
    const { t } = useLanguage();

    const getFullCommand = (steps: typeof guide.steps) => {
        return steps
            .filter(step => step.isCode !== false)
            .map(step => step.command)
            .join('\n');
    }

    return (
        <div className="bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-white/10 rounded-xl p-4 flex flex-col transition-all duration-300 shadow-md">
            <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">{guide.title}</h4>
            <div className="mb-3">
                <h5 className="font-semibold text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">{t('guideDescription')}</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300">{guide.description}</p>
            </div>
            <div className="mb-4">
                <h5 className="font-semibold text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">{t('guideUseCase')}</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300">{guide.useCase}</p>
            </div>
            
            <div className="mt-auto">
                 <h5 className="font-semibold text-xs uppercase text-gray-500 dark:text-gray-400 mb-2">{t('guideCommands')}</h5>
                <div className="relative bg-gray-100 dark:bg-slate-900/70 rounded-lg border border-gray-200 dark:border-white/10 overflow-hidden">
                    <CopyButton code={getFullCommand(guide.steps)} />
                    <pre className="p-4 text-sm text-gray-900 dark:text-gray-200 overflow-x-auto font-mono">
                        {guide.steps.map((step, index) => (
                            <div key={index} className="flex">
                                <span className="text-gray-500 dark:text-gray-600 mr-4 select-none">$</span>
                                <code className="text-purple-600 dark:text-purple-400">{step.command}</code>
                            </div>
                        ))}
                    </pre>
                </div>
            </div>
        </div>
    );
};

const DeploymentGuidesView: React.FC = () => {
    const { t } = useLanguage();
    const categories = Object.keys(DEPLOYMENT_GUIDES_DATA);
    const [activeCategory, setActiveCategory] = useState(categories[0]);
    const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  
    const activeCategoryData = DEPLOYMENT_GUIDES_DATA[activeCategory];
    const hasSubCategories = !!activeCategoryData.subCategories;
  
    useEffect(() => {
      if (hasSubCategories && activeCategoryData.subCategories) {
        setActiveSubCategory(Object.keys(activeCategoryData.subCategories)[0]);
      } else {
        setActiveSubCategory(null);
      }
    }, [activeCategory, hasSubCategories, activeCategoryData.subCategories]);
  
    const activeGuides = useMemo(() => {
      if (!activeCategoryData) return [];
      if (hasSubCategories && activeSubCategory && activeCategoryData.subCategories) {
        return activeCategoryData.subCategories[activeSubCategory]?.guides || [];
      }
      return activeCategoryData.guides || [];
    }, [activeCategoryData, hasSubCategories, activeSubCategory]);

    return (
        <div className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-xl flex flex-col h-full p-4 shadow-lg dark:shadow-2xl dark:shadow-black/20">
            <div className="flex justify-between items-center mb-4 border-b border-gray-300 dark:border-white/10 pb-2 flex-shrink-0">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">{t('deploymentGuidesTitle')}</h2>
            </div>
            
            <div className="flex border-b border-gray-300 dark:border-white/10 flex-shrink-0 overflow-x-auto">
                {categories.map(categoryKey => (
                    <button
                        key={categoryKey}
                        onClick={() => setActiveCategory(categoryKey)}
                        className={`px-4 py-2 -mb-px text-sm font-medium border-b-2 transition-colors duration-200 flex-shrink-0 whitespace-nowrap ${
                            activeCategory === categoryKey
                                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                                : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'
                        }`}
                    >
                        {t(DEPLOYMENT_GUIDES_DATA[categoryKey].displayName)}
                    </button>
                ))}
            </div>

            {hasSubCategories && activeCategoryData.subCategories && (
                <div className="flex border-b border-gray-200 dark:border-slate-800 my-4 flex-shrink-0 overflow-x-auto">
                {Object.keys(activeCategoryData.subCategories).map(subKey => (
                    <button
                    key={subKey}
                    onClick={() => setActiveSubCategory(subKey)}
                    className={`px-4 py-2 text-sm font-semibold transition-colors duration-200 rounded-t-lg flex-shrink-0 whitespace-nowrap ${
                        activeSubCategory === subKey
                        ? 'bg-white/60 dark:bg-slate-800/60 text-cyan-600 dark:text-cyan-400'
                        : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'
                    }`}
                    >
                    {t(activeCategoryData.subCategories![subKey].displayName)}
                    </button>
                ))}
                </div>
            )}

            <div className={`flex-grow overflow-y-auto pr-2 ${!hasSubCategories ? 'mt-4' : ''}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {activeGuides.map(guide => (
                        <GuideCard key={guide.title} guide={guide} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DeploymentGuidesView;