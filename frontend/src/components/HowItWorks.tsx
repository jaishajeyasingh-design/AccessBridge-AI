import React from 'react';
import { Upload, FileSearch, Brain, Sparkles, CheckSquare, Volume2, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Upload',
      desc: 'Upload PDF, image or text file',
      icon: Upload,
      color: 'from-blue-500 to-indigo-500',
    },
    {
      step: '02',
      title: 'Extract',
      desc: 'Extract the information from your document',
      icon: FileSearch,
      color: 'from-indigo-500 to-purple-500',
    },
    {
      step: '03',
      title: 'Understand',
      desc: 'AI identifies the important information',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
    },
    {
      step: '04',
      title: 'Transform',
      desc: 'Convert complex language into simple language',
      icon: Sparkles,
      color: 'from-pink-500 to-rose-500',
    },
    {
      step: '05',
      title: 'Act',
      desc: 'Get deadlines, documents and actionable steps',
      icon: CheckSquare,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      step: '06',
      title: 'Listen',
      desc: 'Listen to the information using voice assistance',
      icon: Volume2,
      color: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <section id="how-it-works" className="scroll-mt-24 py-16 bg-slate-950 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
            The Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-4">
            How AccessBridge AI Works
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            From raw documents to simple, actionable guidance in six accessible steps.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {steps.map((s, idx) => {
            const IconComponent = s.icon;
            return (
              <div
                key={s.step}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 relative group hover:border-indigo-500/40 transition-all hover:shadow-xl hover:shadow-indigo-500/5"
              >
                {/* Step badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${s.color} p-0.5 shadow-md`}>
                    <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-white">
                      <IconComponent className="w-5 h-5 text-slate-100" />
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700/60">
                    Step {s.step}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">
                  {s.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {s.desc}
                </p>

                {/* Subtle connector indicator for non-last items */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-700 pointer-events-none">
                    <ArrowRight className="w-5 h-5 opacity-40" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
