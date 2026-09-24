import React from 'react';
import { LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from '../utils/mockData';
import { Languages, Globe, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

interface TranslationCardProps {
  selectedLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  translatedTitle: string;
  translatedExplanation: string;
  translatedActionSummary: string;
  isTranslating?: boolean;
  translationError?: string;
}

export const TranslationCard: React.FC<TranslationCardProps> = ({
  selectedLanguage,
  onLanguageChange,
  translatedTitle,
  translatedExplanation,
  translatedActionSummary,
  isTranslating = false,
  translationError = '',
}) => {
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-md">
            <Languages className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              Make this information accessible in your language
            </h3>
            <p className="text-xs text-slate-400">
              Instant AI multilingual translation for Indian regional languages
            </p>
          </div>
        </div>

        {/* Dropdown */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
          <Globe className="w-4 h-4 text-purple-400 shrink-0" />
          <label htmlFor="translation-select" className="sr-only">Choose Language</label>
          <select
            id="translation-select"
            value={selectedLanguage}
            disabled={isTranslating}
            onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
            className="bg-transparent text-sm text-slate-200 font-semibold focus:outline-none cursor-pointer pr-1 disabled:opacity-50"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-100">
                {lang.name} — {lang.localName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {translationError && (
        <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{translationError} (Preserving previous result)</span>
        </div>
      )}

      {/* Translated Content View */}
      {isTranslating ? (
        <div className="mt-6 bg-slate-950/80 border border-purple-500/30 rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-3 animate-pulse">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          <span className="text-sm font-semibold text-purple-300">
            Translating to {currentLangObj.name} ({currentLangObj.localName})...
          </span>
        </div>
      ) : (
        <div className="mt-6 bg-slate-950/80 border border-purple-500/30 rounded-2xl p-6 relative">
          <div className="flex items-center justify-between gap-2 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Translated Content ({currentLangObj.name} - {currentLangObj.localName})
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {selectedLanguage.toUpperCase()}
            </span>
          </div>

          <h4 className="text-lg font-bold text-white mb-3">
            {translatedTitle}
          </h4>

          <div className="space-y-3 text-slate-200 text-base leading-relaxed">
            <p className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80">
              {translatedExplanation}
            </p>

            <div className="pt-2">
              <span className="text-xs font-semibold text-purple-300 uppercase tracking-wide block mb-1">
                Action Summary:
              </span>
              <p className="text-sm text-slate-300 italic">
                "{translatedActionSummary}"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
