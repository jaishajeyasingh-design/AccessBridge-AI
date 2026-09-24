import React from 'react';
import { UserCheck, Info, AlertTriangle, Check } from 'lucide-react';

interface EligibilityWarningCardProps {
  eligibility: string[];
  importantPoints: string[];
  warning?: string | string[];
}

export const EligibilityWarningCard: React.FC<EligibilityWarningCardProps> = ({
  eligibility,
  importantPoints,
  warning,
}) => {
  const warningText = typeof warning === 'string'
    ? warning.trim()
    : Array.isArray(warning)
    ? warning.filter((w) => typeof w === 'string' && w.trim().length > 0).join(' ')
    : '';

  const hasWarning = warningText.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Eligibility Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              Eligibility Criteria
            </h3>
            <p className="text-xs text-slate-400">Who can apply for this document/notice</p>
          </div>
        </div>

        <ul className="space-y-3">
          {eligibility.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-slate-200 text-sm sm:text-base">
              <span className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Important Points & Warnings */}
      <div className="flex flex-col gap-6">
        {/* Important Points */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex-1">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Info className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">
              Important Points
            </h3>
          </div>

          <ul className="space-y-2.5 text-sm text-slate-300">
            {importantPoints.map((pt, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-indigo-400 font-bold">•</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Warning Banner - Rendered ONLY if warning content exists */}
        {hasWarning && (
          <div className="bg-rose-950/40 border border-rose-800/60 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-lg">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 block mb-0.5">
                Warning
              </span>
              <p className="text-sm font-medium text-rose-100/90 leading-snug">
                {warningText}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
