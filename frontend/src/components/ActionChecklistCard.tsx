import React from 'react';
import { ChecklistItem } from '../types';
import { CheckSquare, CheckCircle2, Circle } from 'lucide-react';

interface ActionChecklistCardProps {
  tasks: ChecklistItem[];
  onToggleTask: (taskId: string) => void;
}

export const ActionChecklistCard: React.FC<ActionChecklistCardProps> = ({
  tasks,
  onToggleTask,
}) => {
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = Math.round((completedCount / (totalCount || 1)) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              What You Need To Do
            </h3>
            <p className="text-xs text-slate-400">
              Interactive step-by-step action checklist
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2 flex items-center gap-3 self-start sm:self-auto">
          <div className="text-right">
            <span className="text-sm font-bold text-white">
              {completedCount} of {totalCount}
            </span>
            <span className="text-xs text-slate-400 ml-1">completed</span>
          </div>
          <div className="w-20 bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Checklist items */}
      <div className="mt-6 space-y-3">
        {tasks.map((task) => (
          <label
            key={task.id}
            onClick={() => onToggleTask(task.id)}
            className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all duration-150 select-none ${
              task.completed
                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/30 text-slate-200'
            }`}
          >
            <div className="mt-0.5 shrink-0 text-emerald-400">
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
              ) : (
                <Circle className="w-5 h-5 text-slate-600 hover:text-indigo-400 transition-colors" />
              )}
            </div>
            <span
              className={`text-sm sm:text-base font-medium leading-normal ${
                task.completed ? 'line-through text-slate-400' : 'text-slate-200'
              }`}
            >
              {task.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};
