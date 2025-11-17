import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DEPLOYMENT_GUIDES_DATA } from '../data/deploymentGuides';
import { DeploymentGuide, DeploymentGuideStep, DeploymentCategory } from '../types';
import Tooltip from './Tooltip';
import { ClipboardIcon, CheckCircleIcon, ChevronDownIcon } from '../icons';

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

    const handleCopyAll = () => {
        setIsAllCopied(true);
    };

    if (!guide) {
        return <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">Selecione um guia para começar.</div>;
    }

    const fullScript = guide.steps
      .filter(step => step.isCode !== false)
      .map(step => step.command)
      .join(' && \\\n');

    const buttonText = isAllCopied ? t('buttonCopied') : 'Copiar Todos os Comandos';

    return (
        <div className="p-6 h-full overflow-y-auto hide-scrollbar">
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-2xl text-gray-900 dark:text-gray-100">{guide.title}</h3>
                <CopyButton code={fullScript} onCopy={handleCopyAll}>
                    <div className="flex items-center gap-2 px-2">
                        {isAllCopied ? <CheckCircleIcon className="h-5 w-5 text-green-400" /> : <ClipboardIcon className="h-5 w-5" />}
                        <span>{buttonText}</span>
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

const GuideListItem: React.FC<{ guide: DeploymentGuide, isSelected: boolean, onSelect: () => void }> = ({ guide, isSelected, onSelect }) => {
    return (
      <button onClick={onSelect} className={`w-full text-left p-3 rounded-md transition-colors duration-200 ${isSelected ? 'bg-cyan-100 dark:bg-cyan-500/20' : 'hover:bg-gray-200/50 dark:hover:bg-slate-800/50'}`}>
        <h4 className={`font-medium text-sm ${isSelected ? 'text-cyan-800 dark:text-cyan-300' : 'text-gray-800 dark:text-gray-200'}`}>{guide.title}</h4>
      </button>
    );
};

const AccordionSection: React.FC<{
  categoryKey: string;
  categoryData: DeploymentCategory;
  isOpen: boolean;
  onToggle: () => void;
  selectedGuideTitle: string | null;
  onSelectGuide: (title: string) => void;
}> = ({ categoryKey, categoryData, isOpen, onToggle, selectedGuideTitle, onSelectGuide }) => {
    const { t } = useLanguage();
    
    return (
        <div className="border-b border-gray-200 dark:border-white/10">
            <h2>
                <button
                    type="button"
                    className="flex items-center justify-between w-full p-4 font-bold text-left text-gray-800 dark:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-slate-800/30"
                    onClick={onToggle}
                >
                    <span>{t(categoryData.displayName)}</span>
                    <ChevronDownIcon className={`w-5 h-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
            </h2>
            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="p-2 space-y-1">
                        {categoryData.subCategories ? (
                            Object.entries(categoryData.subCategories).map(([subKey, subCatData]) => (
                                <div key={subKey} className="ml-2 border-l border-gray-200 dark:border-gray-700/50">
                                    <h4 className="px-3 pt-2 pb-1 text-xs font-semibold uppercase text-gray-500/80 dark:text-gray-400/80">
                                        {t(subCatData.displayName)}
                                    </h4>
                                    <div className="pl-2 space-y-1">
                                        {subCatData.guides.map(guide => (
                                            <GuideListItem 
                                                key={guide.title} 
                                                guide={guide} 
                                                isSelected={selectedGuideTitle === guide.title}
                                                onSelect={() => onSelectGuide(guide.title)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            categoryData.guides?.map(guide => (
                                <GuideListItem 
                                    key={guide.title} 
                                    guide={guide} 
                                    isSelected={selectedGuideTitle === guide.title}
                                    onSelect={() => onSelectGuide(guide.title)}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const DeploymentGuidesView: React.FC = () => {
    const { t } = useLanguage();
    
    const { initialGuideTitle, initialCategoryKey, guideMap } = useMemo(() => {
        const guideMap = new Map<string, { guide: DeploymentGuide, categoryKey: string }>();
        let firstGuide: DeploymentGuide | null = null;
        let firstCategoryKey: string | null = null;

        for (const catKey in DEPLOYMENT_GUIDES_DATA) {
            const category = DEPLOYMENT_GUIDES_DATA[catKey];
            if (category.guides) {
                category.guides.forEach(guide => {
                    if (!firstGuide) {
                        firstGuide = guide;
                        firstCategoryKey = catKey;
                    }
                    guideMap.set(guide.title, { guide, categoryKey: catKey });
                });
            }
            if (category.subCategories) {
                for (const subKey in category.subCategories) {
                    const subCat = category.subCategories[subKey];
                    subCat.guides.forEach(guide => {
                        if (!firstGuide) {
                            firstGuide = guide;
                            firstCategoryKey = catKey;
                        }
                        guideMap.set(guide.title, { guide, categoryKey: catKey });
                    });
                }
            }
        }
        return { initialGuideTitle: firstGuide?.title || null, initialCategoryKey: firstCategoryKey, guideMap };
    }, []);

    const [selectedGuideTitle, setSelectedGuideTitle] = useState<string | null>(initialGuideTitle);
    const [openCategoryKey, setOpenCategoryKey] = useState<string | null>(initialCategoryKey);

    const handleSelectGuide = (title: string) => {
        setSelectedGuideTitle(title);
        const guideInfo = guideMap.get(title);
        if (guideInfo && guideInfo.categoryKey !== openCategoryKey) {
            setOpenCategoryKey(guideInfo.categoryKey);
        }
    };
    
    const handleToggleCategory = (catKey: string) => {
        setOpenCategoryKey(prevKey => (prevKey === catKey ? null : catKey));
    };

    const selectedGuide = useMemo(() => {
        if (!selectedGuideTitle) return null;
        return guideMap.get(selectedGuideTitle)?.guide || null;
    }, [selectedGuideTitle, guideMap]);

    return (
        <div className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-xl flex flex-col h-full shadow-lg dark:shadow-2xl dark:shadow-black/20 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-white/10 flex-shrink-0">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">{t('deploymentGuidesTitle')}</h2>
            </div>
            
            <div className="flex flex-grow min-h-0">
                <div className="w-1/3 lg:w-1/4 flex flex-col border-r border-gray-300 dark:border-white/10 bg-gray-50/30 dark:bg-slate-900/20">
                    <div className="flex-grow overflow-y-auto hide-scrollbar">
                         {Object.entries(DEPLOYMENT_GUIDES_DATA).map(([catKey, categoryData]) => (
                            <AccordionSection
                                key={catKey}
                                categoryKey={catKey}
                                categoryData={categoryData}
                                isOpen={openCategoryKey === catKey}
                                onToggle={() => handleToggleCategory(catKey)}
                                selectedGuideTitle={selectedGuideTitle}
                                onSelectGuide={handleSelectGuide}
                            />
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
