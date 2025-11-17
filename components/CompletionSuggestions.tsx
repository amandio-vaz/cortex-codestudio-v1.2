import React from 'react';
import { useEditorTheme } from '../context/EditorThemeContext';

interface CompletionSuggestionsProps {
  suggestions: string[];
  position: { top: number; left: number };
  selectedIndex: number;
  onSelect: (index: number) => void;
}

const CompletionSuggestions: React.FC<CompletionSuggestionsProps> = ({ suggestions, position, selectedIndex, onSelect }) => {
  const { theme } = useEditorTheme();

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div
      className="absolute z-50 w-64 border rounded-md shadow-lg backdrop-blur-xl"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        backgroundColor: `${theme.colors.editorGutterBg}E6`, // Add transparency
        borderColor: theme.colors.lineNumbers,
      }}
    >
      <ul className="py-1 max-h-48 overflow-y-auto">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            onClick={() => onSelect(index)}
            onMouseOver={() => {}} // Could be used to set active index on hover
            className={`px-3 py-1.5 text-sm cursor-pointer font-mono ${
              index === selectedIndex
                ? 'bg-cyan-500/20'
                : ''
            }`}
            style={{ color: theme.colors.editorText }}
          >
            {suggestion}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompletionSuggestions;
