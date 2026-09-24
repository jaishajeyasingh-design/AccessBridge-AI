import React, { useState } from 'react';
import { Sparkles, Type } from 'lucide-react';

interface SimpleExplanationCardProps {
  explanation: string;
}

type FontSizeOption = 'sm' | 'base' | 'lg' | 'xl';

export const SimpleExplanationCard: React.FC<SimpleExplanationCardProps> = ({ explanation }) => {
  const [fontSize, setFontSize] = useState<FontSizeOption>('base');

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm':
        return 'text-sm sm:text-base leading-relaxed';
      case 'base':
        return 'text-base sm:text-lg leading-relaxed';
      case 'lg':
        return 'text-lg sm:text-xl leading-relaxed font-medium';
      case 'xl':
        return 'text-xl sm:text-2xl leading-relaxed font-medium';
      default:
        return 'text-base sm:text-lg leading-relaxed';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      {/* Top Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              Simple Explanation
            </h3>
            <p className="text-xs text-slate-400">
              Jargon-free overview of the document
            </p>
          </div>
        </div>

        {/* Accessibility Font Size Control: A- A A+ */}
        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl p-1 self-start sm:self-auto">
          <div className="flex items-center gap-1 px-2 py-1 text-slate-400 text-xs font-semibold">
            <Type className="w-3.5 h-3.5 text-indigo-400" />
            <span className="sr-only">Font Size Controls</span>
          </div>
          
          <button
            onClick={() => setFontSize('sm')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
              fontSize === 'sm'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            aria-label="Decrease text size"
            title="Small font size"
          >
            A−
          </button>

          <button
            onClick={() => setFontSize('base')}
            className={`px-2.5 py-1 text-sm font-bold rounded-lg transition-colors ${
              fontSize === 'base'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            aria-label="Default text size"
            title="Normal font size"
          >
            A
          </button>

          <button
            onClick={() => setFontSize('lg')}
            className={`px-2.5 py-1 text-base font-bold rounded-lg transition-colors ${
              fontSize === 'lg' || fontSize === 'xl'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            aria-label="Increase text size"
            title="Large font size"
          >
            A+
          </button>
        </div>
      </div>

      {/* Main Readable Text */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 sm:p-6 text-slate-200">
        <p className={`${getFontSizeClass()} transition-all duration-200`}>
          "{explanation}"
        </p>
      </div>
    </div>
  );
};
