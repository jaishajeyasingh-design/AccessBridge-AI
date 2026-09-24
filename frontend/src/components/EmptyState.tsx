import React from 'react';
import { FileText, ArrowUpCircle } from 'lucide-react';

interface EmptyStateProps {
  onUploadClick: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onUploadClick }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="bg-slate-900/60 border border-slate-800 border-dashed rounded-3xl p-10 sm:p-14 shadow-inner">
        <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-400 mx-auto mb-4">
          <FileText className="w-8 h-8 text-slate-400" />
        </div>

        <h3 className="text-xl font-bold text-white mb-2">
          Your simplified document will appear here.
        </h3>

        <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
          Upload a document to get started. AccessBridge AI will analyze the text, extract deadlines, create an action checklist, and provide text-to-speech audio.
        </p>

        <button
          onClick={onUploadClick}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors shadow-md shadow-indigo-600/20"
        >
          <ArrowUpCircle className="w-4 h-4" />
          <span>Upload a Document</span>
        </button>
      </div>
    </div>
  );
};
