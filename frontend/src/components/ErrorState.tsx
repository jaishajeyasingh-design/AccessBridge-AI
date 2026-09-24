import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = "Please try again.",
  onRetry,
}) => {
  return (
    <div className="max-w-md mx-auto px-4 py-12 text-center">
      <div className="bg-rose-950/40 border border-rose-800/60 rounded-3xl p-8 shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-rose-900/40 border border-rose-700/50 flex items-center justify-center text-rose-400 mx-auto mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-bold text-white mb-2">
          Something went wrong.
        </h3>

        <p className="text-rose-200/80 text-sm mb-6">
          {message}
        </p>

        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-rose-600/30"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
};
