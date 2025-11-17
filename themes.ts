import { EditorTheme } from './types';

export const EDITOR_THEMES: Record<string, EditorTheme> = {
  default: {
    name: 'Default',
    isDark: false,
    colors: {
      editorBg: '#F9FAFB', // gray-50
      editorGutterBg: '#F9FAFB',
      editorText: '#111827', // gray-900
      lineNumbers: '#9CA3AF', // gray-400
      resultBg: '#FFFFFF',
      resultText: '#374151', // gray-700
      resultTitle: '#111827', // gray-900
      codeBg: '#F3F4F6', // gray-100
      codeText: '#1E40AF', // blue-800
      highlightError: 'rgba(239, 68, 68, 0.15)', // red-500/15
      highlightWarning: 'rgba(245, 158, 11, 0.15)', // amber-500/15
      highlightPerformance: 'rgba(59, 130, 246, 0.15)', // blue-500/15
      scrollbarThumb: 'rgba(107, 114, 128, 0.5)', // gray-500/50
      scrollbarThumbHover: 'rgba(107, 114, 128, 0.7)',
      scrollbarTrack: 'rgba(0, 0, 0, 0.05)',
    },
  },
  defaultDark: {
    name: 'Default Dark',
    isDark: true,
    colors: {
      editorBg: '#0f172a', // slate-900
      editorGutterBg: '#0f172a',
      editorText: '#E2E8F0', // slate-200
      lineNumbers: '#475569', // slate-600
      resultBg: '#020617', // slate-950
      resultText: '#CBD5E1', // slate-300
      resultTitle: '#F1F5F9', // slate-100
      codeBg: '#1E293B', // slate-800
      codeText: '#93C5FD', // blue-300
      highlightError: 'rgba(239, 68, 68, 0.2)', // red-500/20
      highlightWarning: 'rgba(245, 158, 11, 0.2)', // amber-500/20
      highlightPerformance: 'rgba(59, 130, 246, 0.2)', // blue-500/20
      scrollbarThumb: 'rgba(100, 116, 139, 0.5)', // slate-500/50
      scrollbarThumbHover: 'rgba(100, 116, 139, 0.7)',
      scrollbarTrack: '#1E293B',
    },
  },
  monokai: {
    name: 'Monokai',
    isDark: true,
    colors: {
      editorBg: '#272822',
      editorGutterBg: '#272822',
      editorText: '#F8F8F2',
      lineNumbers: '#75715E',
      resultBg: '#20211C',
      resultText: '#F8F8F2',
      resultTitle: '#E6DB74',
      codeBg: '#3E3D32',
      codeText: '#A6E22E',
      highlightError: 'rgba(249, 38, 114, 0.25)', // #F92672
      highlightWarning: 'rgba(253, 151, 31, 0.25)', // #FD971F
      highlightPerformance: 'rgba(102, 217, 239, 0.25)', // #66D9EF
      scrollbarThumb: 'rgba(117, 113, 94, 0.6)',
      scrollbarThumbHover: 'rgba(117, 113, 94, 0.8)',
      scrollbarTrack: '#3E3D32',
    },
  },
  solarizedDark: {
    name: 'Solarized Dark',
    isDark: true,
    colors: {
      editorBg: '#002b36',
      editorGutterBg: '#002b36',
      editorText: '#839496',
      lineNumbers: '#586e75',
      resultBg: '#00212b',
      resultText: '#839496',
      resultTitle: '#93a1a1',
      codeBg: '#073642',
      codeText: '#268bd2',
      highlightError: 'rgba(220, 50, 47, 0.25)', // #dc322f
      highlightWarning: 'rgba(181, 137, 0, 0.25)', // #b58900
      highlightPerformance: 'rgba(42, 161, 152, 0.25)', // #2aa198
      scrollbarThumb: 'rgba(88, 110, 117, 0.6)',
      scrollbarThumbHover: 'rgba(88, 110, 117, 0.8)',
      scrollbarTrack: '#073642',
    },
  },
  dracula: {
    name: 'Dracula',
    isDark: true,
    colors: {
      editorBg: '#282a36',
      editorGutterBg: '#282a36',
      editorText: '#f8f8f2',
      lineNumbers: '#6272a4',
      resultBg: '#21222C',
      resultText: '#f8f8f2',
      resultTitle: '#bd93f9',
      codeBg: '#44475a',
      codeText: '#50fa7b',
      highlightError: 'rgba(255, 85, 85, 0.25)', // #ff5555
      highlightWarning: 'rgba(241, 250, 140, 0.25)', // #f1fa8c
      highlightPerformance: 'rgba(139, 233, 253, 0.25)', // #8be9fd
      scrollbarThumb: 'rgba(98, 114, 164, 0.6)',
      scrollbarThumbHover: 'rgba(98, 114, 164, 0.8)',
      scrollbarTrack: '#44475a',
    },
  },
};