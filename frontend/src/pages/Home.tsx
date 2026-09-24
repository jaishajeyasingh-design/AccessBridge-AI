import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { UploadCard } from '../components/UploadCard';
import { HowItWorks } from '../components/HowItWorks';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { SimpleExplanationCard } from '../components/SimpleExplanationCard';
import { DeadlineCard } from '../components/DeadlineCard';
import { ActionChecklistCard } from '../components/ActionChecklistCard';
import { RequiredDocumentsCard } from '../components/RequiredDocumentsCard';
import { EligibilityWarningCard } from '../components/EligibilityWarningCard';
import { TranslationCard } from '../components/TranslationCard';
import { VoiceCard } from '../components/VoiceCard';
import { LanguageCode, MockAnalysisData, UploadedFileState, AnalysisStatus } from '../types';
import { MOCK_SCHOLARSHIP_ANALYSIS } from '../utils/mockData';
import { Award, RefreshCw } from 'lucide-react';

export const Home: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('idle');
  const [uploadedFile, setUploadedFile] = useState<UploadedFileState | null>(null);
  const [analysisData, setAnalysisData] = useState<MockAnalysisData>(MOCK_SCHOLARSHIP_ANALYSIS);

  const handleStartAnalysis = (file: UploadedFileState) => {
    setUploadedFile(file);
    setAnalysisStatus('analyzing');
  };

  const handleSelectSample = () => {
    setUploadedFile({
      name: 'Scholarship_Application_Notice_2026.pdf',
      type: 'application/pdf',
      size: 245000,
    });
    setAnalysisStatus('analyzing');
    setTimeout(() => {
      const resultElem = document.getElementById('analysis-result');
      if (resultElem) {
        resultElem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 3600);
  };

  const handleLoadingComplete = () => {
    setAnalysisStatus('success');
  };

  const handleToggleTask = (taskId: string) => {
    setAnalysisData((prev) => ({
      ...prev,
      actionSteps: prev.actionSteps.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    }));
  };

  const handleToggleDoc = (docId: string) => {
    setAnalysisData((prev) => ({
      ...prev,
      requiredDocuments: prev.requiredDocuments.map((doc) =>
        doc.id === docId ? { ...doc, completed: !doc.completed } : doc
      ),
    }));
  };

  const handleScrollToUpload = () => {
    const uploadElem = document.getElementById('upload-section');
    if (uploadElem) {
      uploadElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToHowItWorks = () => {
    const section = document.getElementById('how-it-works');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeTranslation = analysisData.translations[currentLanguage] || analysisData.translations.en;

  // Text to be read by Web Speech voice assistant
  const voiceText = `${analysisData.title}. ${analysisData.simpleExplanation}. Required steps: ${analysisData.actionSteps.map(a => a.label).join(', ')}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        onNavigateHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onNavigateHowItWorks={handleScrollToHowItWorks}
      />

      {/* Hero Section */}
      <Hero
        onUploadClick={handleScrollToUpload}
        onDemoClick={handleSelectSample}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-12">
        {/* Upload Card */}
        <UploadCard
          onAnalyze={handleStartAnalysis}
          onSelectSample={handleSelectSample}
          isAnalyzing={analysisStatus === 'analyzing'}
        />

        {/* Dynamic State Rendering */}
        {analysisStatus === 'analyzing' && (
          <LoadingState onComplete={handleLoadingComplete} />
        )}

        {analysisStatus === 'idle' && (
          <EmptyState onUploadClick={handleScrollToUpload} />
        )}

        {analysisStatus === 'error' && (
          <ErrorState onRetry={() => setAnalysisStatus('idle')} />
        )}

        {analysisStatus === 'success' && (
          <section id="analysis-result" className="scroll-mt-24 space-y-8 animate-fadeIn">
            {/* Result Header Badge */}
            <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />
              
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0 shadow-lg">
                  <Award className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-0.5 rounded-full">
                      {analysisData.documentType}
                    </span>
                    {uploadedFile && (
                      <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full">
                        {uploadedFile.name}
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {analysisData.title}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setAnalysisStatus('idle')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-sm font-medium border border-slate-700 transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Analyze Another</span>
                </button>
              </div>
            </div>

            {/* Voice Audio Card */}
            <VoiceCard
              textToRead={voiceText}
              selectedLanguage={currentLanguage}
            />

            {/* Simplified Explanation */}
            <SimpleExplanationCard
              explanation={analysisData.simpleExplanation}
            />

            {/* Important Deadline */}
            <DeadlineCard
              deadline={analysisData.deadline}
              warning={analysisData.deadlineWarning}
            />

            {/* Action Checklist & Required Documents side by side or stacked */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ActionChecklistCard
                tasks={analysisData.actionSteps}
                onToggleTask={handleToggleTask}
              />

              <RequiredDocumentsCard
                documents={analysisData.requiredDocuments}
                onToggleDoc={handleToggleDoc}
              />
            </div>

            {/* Eligibility & Warning */}
            <EligibilityWarningCard
              eligibility={analysisData.eligibility}
              importantPoints={analysisData.importantPoints}
              warning={analysisData.warnings}
            />

            {/* Multilingual Translation */}
            <TranslationCard
              selectedLanguage={currentLanguage}
              onLanguageChange={setCurrentLanguage}
              translatedTitle={activeTranslation.title}
              translatedExplanation={activeTranslation.simpleExplanation}
              translatedActionSummary={activeTranslation.actionStepsSummary}
            />
          </section>
        )}

        {/* How It Works Section */}
        <HowItWorks />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-10 mt-16 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">AccessBridge AI</span>
            <span>— Accessibility Transformation Platform</span>
          </div>
          <div className="text-xs text-slate-500">
            Hackathon MVP • Designed for Maximum Accessibility & Inclusion
          </div>
        </div>
      </footer>
    </div>
  );
};
