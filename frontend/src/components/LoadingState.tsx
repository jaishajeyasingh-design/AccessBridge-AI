import React, { useEffect, useState } from 'react';
import { Sparkles, Brain, FileSearch, CheckCircle2 } from 'lucide-react';

interface LoadingStateProps {
  onComplete: () => void;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ onComplete }) => {
  const steps = [
    { label: "Understanding your document...", icon: Brain },
    { label: "Extracting important information...", icon: FileSearch },
    { label: "Preparing your simplified version...", icon: Sparkles },
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 800);
          return prev;
        }
      });
    }, 1100);

    return () => clearInterval(interval);
  }, [onComplete, steps.length]);

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        {/* Animated Glow aura */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 animate-pulse pointer-events-none" />

        {/* Outer Spinner Ring */}
        <div className="relative w-20 h-20 mx-auto mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center text-indigo-400">
            {React.createElement(steps[currentStepIndex].icon, { className: "w-6 h-6 animate-bounce" })}
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-6">
          AccessBridge AI Processing
        </h3>

        {/* Step List */}
        <div className="space-y-4 max-w-md mx-auto text-left">
          {steps.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const Icon = step.icon;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3.5 p-3.5 rounded-xl border transition-all ${
                  isDone
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : isCurrent
                    ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-200 shadow-md'
                    : 'bg-slate-950/40 border-slate-800 text-slate-500'
                }`}
              >
                <div className="shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : isCurrent ? (
                    <div className="w-5 h-5 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
                  ) : (
                    <Icon className="w-5 h-5 opacity-40" />
                  )}
                </div>

                <span className="text-sm font-medium">
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-slate-500 mt-8">
          Analyzing document layout, extracting deadlines & generating accessible summaries...
        </p>
      </div>
    </div>
  );
};
