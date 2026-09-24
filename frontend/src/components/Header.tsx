import React from 'react';
import { LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from '../utils/mockData';
import { Shield, Globe } from 'lucide-react';

interface HeaderProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onNavigateHome: () => void;
  onNavigateHowItWorks: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  onNavigateHome,
  onNavigateHowItWorks,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Branding */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-3 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl p-1 transition-all group"
          aria-label="AccessBridge AI Home"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                AccessBridge <span className="text-indigo-400">AI</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                MVP
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Accessibility Transformation Platform
            </p>
          </div>
        </button>

        {/* Right Navigation & Language Picker */}
        <div className="flex items-center gap-3 sm:gap-6">
          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={onNavigateHome}
              className="px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Home
            </button>
            <button
              onClick={onNavigateHowItWorks}
              className="px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              How it Works
            </button>
          </nav>

          {/* Language Selector */}
          <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-1.5 shadow-inner">
            <Globe className="w-4 h-4 text-indigo-400 shrink-0" aria-hidden="true" />
            <label htmlFor="language-select" className="sr-only">Select Interface Language</label>
            <select
              id="language-select"
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              className="bg-transparent text-sm text-slate-200 font-medium focus:outline-none cursor-pointer pr-2"
              aria-label="Language selector"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-100">
                  {lang.name} ({lang.localName})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
