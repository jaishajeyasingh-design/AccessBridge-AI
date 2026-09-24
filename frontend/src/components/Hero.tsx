import React from 'react';
import { Sparkles, Upload, Play, CheckCircle2, Volume2, Languages, FileText } from 'lucide-react';

interface HeroProps {
  onUploadClick: () => void;
  onDemoClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onUploadClick, onDemoClick }) => {
  return (
    <div className="relative overflow-hidden bg-slate-950 py-12 sm:py-16 border-b border-slate-800/60">
      {/* Background Glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-indigo-600/15 via-purple-600/15 to-pink-600/15 blur-3xl pointer-events-none rounded-full" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
        {/* Small badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>AI-Powered Accessibility</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Understand complicated information.{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            Take the right action.
          </span>
        </h1>

        {/* Main Supporting Text */}
        <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto mb-4 font-medium">
          Turn complicated information into simple, actionable guidance.
        </p>

        {/* Description */}
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
          Upload a document and AccessBridge AI will simplify it, identify important information, create an action checklist, translate it and read it aloud.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <button
            onClick={onUploadClick}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base flex items-center justify-center gap-2.5 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Document</span>
          </button>
          
          <button
            onClick={onDemoClick}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 hover:text-white font-semibold text-base flex items-center justify-center gap-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <Play className="w-4 h-4 text-indigo-400 fill-indigo-400" />
            <span>Try Interactive Demo</span>
          </button>
        </div>

        {/* Quick Features Micro-pills */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-slate-400 text-xs sm:text-sm font-medium pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>PDF, Image & Text</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Action Checklist</span>
          </div>
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-purple-400" />
            <span>Multilingual Support</span>
          </div>
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-pink-400" />
            <span>Voice Reader</span>
          </div>
        </div>
      </div>
    </div>
  );
};
