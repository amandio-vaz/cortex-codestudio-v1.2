import React from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children, className }) => {
  return (
    <div className={`relative group ${className || ''}`}>
      {children}
      <div className="absolute bottom-full mb-2 w-max max-w-xs bg-gray-900/90 dark:bg-black/50 backdrop-blur-md text-white text-xs rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none left-1/2 -translate-x-1/2 z-10 border border-gray-700 dark:border-white/10 shadow-lg">
        {text}
      </div>
    </div>
  );
};

export default Tooltip;