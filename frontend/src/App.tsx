import React from 'react';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-sm text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 mb-6 border border-indigo-500/30">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent mb-2">
          AccessBridge AI
        </h1>
        
        <p className="text-slate-400 font-medium italic text-sm mb-6">
          "Understand. Translate. Act. Listen."
        </p>
        
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-400 text-sm font-semibold tracking-wide">
            System is ready.
          </span>
        </div>
      </div>
    </div>
  );
};

export default App;
