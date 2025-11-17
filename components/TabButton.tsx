import React from 'react';
import Tooltip from './Tooltip';
import { ActiveView } from '../types';

interface TabButtonProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  tooltipText: string;
  view: ActiveView;
}

const TabButton: React.FC<TabButtonProps> = ({ label, icon, isActive, onClick, tooltipText, view }) => {
  const activeClasses = 'text-cyan-600 dark:text-cyan-400';
  const inactiveClasses = 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white';

  return (
    <Tooltip text={tooltipText} className="flex-1">
      <button
        onClick={onClick}
        className={`flex items-center justify-center w-full h-full px-4 py-3 font-medium transition-colors duration-300 ease-in-out z-10 ${isActive ? activeClasses : inactiveClasses}`}
        data-view={view}
      >
        {icon}
        <span className="hidden md:inline-block">{label}</span>
      </button>
    </Tooltip>
  );
};

export default TabButton;