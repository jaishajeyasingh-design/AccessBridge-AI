import React from 'react';
import { ChecklistItem } from '../types';
import { FileCheck, CheckCircle2, Circle } from 'lucide-react';

interface RequiredDocumentsCardProps {
  documents: ChecklistItem[];
  onToggleDoc: (docId: string) => void;
}

export const RequiredDocumentsCard: React.FC<RequiredDocumentsCardProps> = ({
  documents,
  onToggleDoc,
}) => {
  const readyCount = documents.filter((d) => d.completed).length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-md">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              Documents You Need
            </h3>
            <p className="text-xs text-slate-400">
              {documents.length > 0
                ? 'Gather these required certificates before submitting'
                : 'No specific documents are listed in this document.'}
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
          {documents.length > 0 ? `${readyCount} / ${documents.length} Ready` : '0 Listed'}
        </span>
      </div>

      {documents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {documents.map((doc) => (
            <label
              key={doc.id}
              onClick={() => onToggleDoc(doc.id)}
              className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all select-none ${
                doc.completed
                  ? 'bg-purple-950/30 border-purple-500/40 text-purple-200'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-200'
              }`}
            >
              <div className="shrink-0">
                {doc.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-purple-400" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-600 hover:text-purple-400 transition-colors" />
                )}
              </div>
              <span
                className={`text-sm font-medium ${
                  doc.completed ? 'line-through text-slate-400' : 'text-slate-200'
                }`}
              >
                {doc.label}
              </span>
            </label>
          ))}
        </div>
      ) : (
        <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl text-slate-400 text-sm italic">
          No specific documents are listed in this document.
        </div>
      )}
    </div>
  );
};
