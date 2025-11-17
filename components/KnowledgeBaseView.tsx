import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { KNOWLEDGE_BASE_DATA } from '../data/knowledgeBase';
import { MagnifyingGlassIcon } from '../icons';
import { CommandEntry } from '../types';

const KnowledgeBaseView: React.FC = () => {
  const { t } = useLanguage();
  const categories = Object.keys(KNOWLEDGE_BASE_DATA);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');

  const currentCategoryData = KNOWLEDGE_BASE_DATA[activeCategory];
  const hasSubCategories = !!currentCategoryData.subCategories;

  useEffect(() => {
    if (hasSubCategories && currentCategoryData.subCategories) {
      setActiveSubCategory(Object.keys(currentCategoryData.subCategories)[0]);
    } else {
      setActiveSubCategory(null);
    }
  }, [activeCategory, hasSubCategories, currentCategoryData.subCategories]);

  // Memoized search for the selected category/subcategory
  const filteredCategoryCommands = useMemo(() => {
    let commands: CommandEntry[] = [];
    if (hasSubCategories && activeSubCategory && currentCategoryData.subCategories) {
      commands = currentCategoryData.subCategories[activeSubCategory]?.commands || [];
    } else if (currentCategoryData.commands) {
      commands = currentCategoryData.commands;
    }
    
    const lowercasedFilter = categorySearchTerm.toLowerCase().trim();
    if (!lowercasedFilter) {
      return commands;
    }
    return commands.filter(cmd =>
      cmd.command.toLowerCase().includes(lowercasedFilter) ||
      cmd.description.toLowerCase().includes(lowercasedFilter) ||
      cmd.example.toLowerCase().includes(lowercasedFilter)
    );
  }, [activeCategory, activeSubCategory, categorySearchTerm, hasSubCategories, currentCategoryData]);

  // Memoized search across ALL categories for the global search
  const globalFilteredCommands = useMemo(() => {
    const lowercasedFilter = globalSearchTerm.toLowerCase().trim();
    if (!lowercasedFilter) {
      return [];
    }
    const results: ({ category: string } & CommandEntry)[] = [];
    for (const categoryKey in KNOWLEDGE_BASE_DATA) {
      const categoryData = KNOWLEDGE_BASE_DATA[categoryKey];
      const displayName = t(categoryData.displayName);

      if (categoryData.commands) {
        categoryData.commands.forEach(cmd => {
          if (
            cmd.command.toLowerCase().includes(lowercasedFilter) ||
            cmd.description.toLowerCase().includes(lowercasedFilter) ||
            cmd.example.toLowerCase().includes(lowercasedFilter)
          ) {
            results.push({ ...cmd, category: displayName });
          }
        });
      } else if (categoryData.subCategories) {
        for (const subCategoryKey in categoryData.subCategories) {
          const subCategory = categoryData.subCategories[subCategoryKey];
          const subDisplayName = `${displayName} / ${t(subCategory.displayName)}`;
          subCategory.commands.forEach(cmd => {
            if (
              cmd.command.toLowerCase().includes(lowercasedFilter) ||
              cmd.description.toLowerCase().includes(lowercasedFilter) ||
              cmd.example.toLowerCase().includes(lowercasedFilter)
            ) {
              results.push({ ...cmd, category: subDisplayName });
            }
          });
        }
      }
    }
    return results;
  }, [globalSearchTerm, t]);

  const handleGlobalSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalSearchTerm(e.target.value);
    if (e.target.value) {
        setCategorySearchTerm('');
    }
  };

  return (
    <div className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-xl flex flex-col h-full p-4 shadow-lg dark:shadow-2xl dark:shadow-black/20">
      <div className="flex justify-between items-center mb-4 border-b border-gray-300 dark:border-white/10 pb-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">{t('knowledgeBaseTitle')}</h2>
      </div>

      <div className="mb-4 relative">
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
        <input
          type="text"
          value={globalSearchTerm}
          onChange={handleGlobalSearchChange}
          placeholder={t('knowledgeBaseGlobalSearchPlaceholder')}
          className="w-full bg-gray-100/50 dark:bg-slate-900/50 text-gray-900 dark:text-gray-200 p-2 pl-11 rounded-full border border-gray-300 dark:border-white/10 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none"
        />
      </div>

      {globalSearchTerm.trim() === '' ? (
        <>
          <div className="flex border-b border-gray-300 dark:border-white/10 overflow-x-auto">
            {categories.map(categoryKey => (
              <button
                key={categoryKey}
                onClick={() => { setActiveCategory(categoryKey); setCategorySearchTerm(''); }}
                className={`px-4 py-2 -mb-px text-sm font-medium border-b-2 transition-colors duration-200 flex-shrink-0 ${
                  activeCategory === categoryKey
                    ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                    : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                {t(KNOWLEDGE_BASE_DATA[categoryKey].displayName)}
              </button>
            ))}
          </div>

          {hasSubCategories && currentCategoryData.subCategories && (
            <div className="flex border-b border-gray-200 dark:border-slate-800 mt-4">
              {Object.keys(currentCategoryData.subCategories).map(subKey => (
                 <button
                 key={subKey}
                 onClick={() => { setActiveSubCategory(subKey); setCategorySearchTerm(''); }}
                 className={`px-4 py-2 text-sm font-semibold transition-colors duration-200 rounded-t-lg ${
                   activeSubCategory === subKey
                     ? 'bg-white/60 dark:bg-slate-800/60 text-cyan-600 dark:text-cyan-400'
                     : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'
                 }`}
               >
                 {t(currentCategoryData.subCategories![subKey].displayName)}
               </button>
              ))}
            </div>
          )}

          <div className="my-4 relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
            <input
              type="text"
              value={categorySearchTerm}
              onChange={e => setCategorySearchTerm(e.target.value)}
              placeholder={t('knowledgeBaseSearchPlaceholder')}
              className="w-full bg-gray-100/50 dark:bg-slate-800/60 text-gray-900 dark:text-gray-200 p-2 pl-11 rounded-full border border-gray-300 dark:border-white/10 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none"
            />
          </div>

          <div className="flex-grow overflow-y-auto pr-2">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50/50 dark:bg-slate-800/60 dark:text-gray-300 sticky top-0">
                <tr>
                  <th scope="col" className="px-6 py-3 w-1/4">{t('knowledgeBaseHeaderCommand')}</th>
                  <th scope="col" className="px-6 py-3 w-1/2">{t('knowledgeBaseHeaderDescription')}</th>
                  <th scope="col" className="px-6 py-3 w-1/4">{t('knowledgeBaseHeaderExample')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategoryCommands.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200 dark:border-slate-800 hover:bg-gray-100/50 dark:hover:bg-slate-800/40 transition-colors duration-150">
                    <td className="px-6 py-4 font-mono text-cyan-700 dark:text-cyan-400">
                      <code>{item.command}</code>
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{item.description}</td>
                    <td className="px-6 py-4 font-mono text-purple-600 dark:text-purple-400">
                      <code>{item.example}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCategoryCommands.length === 0 && categorySearchTerm.trim() && (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                    {t('knowledgeBaseNoResults', { searchTerm: categorySearchTerm })}
                </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex-grow overflow-y-auto pr-2">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50/50 dark:bg-slate-800/60 dark:text-gray-300 sticky top-0">
              <tr>
                <th scope="col" className="px-6 py-3 w-1/5">{t('knowledgeBaseHeaderCategory')}</th>
                <th scope="col" className="px-6 py-3 w-1/4">{t('knowledgeBaseHeaderCommand')}</th>
                <th scope="col" className="px-6 py-3 w-1/3">{t('knowledgeBaseHeaderDescription')}</th>
                <th scope="col" className="px-6 py-3 w-auto">{t('knowledgeBaseHeaderExample')}</th>
              </tr>
            </thead>
            <tbody>
              {globalFilteredCommands.map((item, index) => (
                <tr key={index} className="border-b border-gray-200 dark:border-slate-800 hover:bg-gray-100/50 dark:hover:bg-slate-800/40 transition-colors duration-150">
                  <td className="px-6 py-4 text-gray-800 dark:text-gray-200 font-medium">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 font-mono text-cyan-700 dark:text-cyan-400">
                    <code>{item.command}</code>
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{item.description}</td>
                  <td className="px-6 py-4 font-mono text-purple-600 dark:text-purple-400">
                    <code>{item.example}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {globalFilteredCommands.length === 0 && (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                  {t('knowledgeBaseGlobalNoResults', { searchTerm: globalSearchTerm })}
              </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KnowledgeBaseView;