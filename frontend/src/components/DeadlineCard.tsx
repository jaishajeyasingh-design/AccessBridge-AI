import React from 'react';
import { Calendar, AlertCircle } from 'lucide-react';

interface DeadlineCardProps {
  deadline: string;
  warning: string;
}

export const DeadlineCard: React.FC<DeadlineCardProps> = ({ deadline, warning }) => {
  const isNotSpecified =
    !deadline ||
    deadline.toLowerCase().includes('not specified') ||
    deadline.toLowerCase().includes('no deadline') ||
    deadline.toLowerCase().includes('none');

  const displayWarning = isNotSpecified
    ? 'No deadline was found in the uploaded document.'
    : warning;

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      {/* Decorative side bar */}
      <div className="absolute top-0 bottom-0 left-0 w-2 bg-gradient-to-b from-amber-400 to-amber-600" />

      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
          <Calendar className="w-6 h-6" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              Important Deadline
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 mb-2">
            {deadline}
          </h3>

          <div className="flex items-center gap-2 text-amber-200/90 text-sm font-medium">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{displayWarning}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
