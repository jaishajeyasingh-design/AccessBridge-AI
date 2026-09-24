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
import { LanguageCode, MockAnalysisData, UploadedFileState, AnalysisStatus, AnalysisResult } from '../types';
import { MOCK_SCHOLARSHIP_ANALYSIS } from '../utils/mockData';
import { analyzeDocument } from '../services/api';
import { Award, RefreshCw } from 'lucide-react';

export const Home: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<UploadedFileState | null>(null);
  const [analysisData, setAnalysisData] = useState<MockAnalysisData>(MOCK_SCHOLARSHIP_ANALYSIS);

  const ensureArray = (val: unknown): string[] => {
    if (Array.isArray(val)) return val.map((v) => String(v));
    if (typeof val === 'string' && val.trim().length > 0) return [val.trim()];
    return [];
  };

  const mapBackendResultToUIState = (analysis: AnalysisResult, filename: string): MockAnalysisData => {
    const eligibilityArr = ensureArray(analysis.eligibility);
    const reqDocsArr = ensureArray(analysis.requiredDocuments);
    const stepsArr = ensureArray(analysis.steps);
    const warningsArr = ensureArray(analysis.warnings);
    const pointsArr = ensureArray(analysis.importantPoints);

    return {
      title: analysis.title || filename || 'Extracted Document',
      documentType: analysis.documentType || 'General Document',
      simpleExplanation: analysis.simpleExplanation || 'No simple explanation provided.',
      eligibility: eligibilityArr.length > 0 ? eligibilityArr : ['Not specified'],
      deadline: analysis.deadline || 'Not specified',
      deadlineWarning: analysis.deadline && analysis.deadline !== 'Not specified'
        ? 'Make sure your application is submitted before this date.'
        : 'Check document details for deadline & submission rules.',
      requiredDocuments: reqDocsArr.map((docStr, idx) => ({
        id: `doc-${idx}`,
        label: docStr,
        completed: false,
      })),
      actionSteps: stepsArr.map((stepStr, idx) => ({
        id: `act-${idx}`,
        label: stepStr,
        completed: false,
      })),
      importantPoints: pointsArr,
      warnings: warningsArr.length > 0
        ? warningsArr.join(' ')
        : 'Make sure all required information is verified before submission.',
      translations: {
        en: {
          title: analysis.title || 'Document Summary',
          simpleExplanation: analysis.simpleExplanation || '',
          actionStepsSummary: stepsArr.join('; '),
          warnings: warningsArr.join(' '),
        },
        ta: MOCK_SCHOLARSHIP_ANALYSIS.translations.ta,
        hi: MOCK_SCHOLARSHIP_ANALYSIS.translations.hi,
        te: MOCK_SCHOLARSHIP_ANALYSIS.translations.te,
        ml: MOCK_SCHOLARSHIP_ANALYSIS.translations.ml,
      },
    };
  };

  // REAL FLOW: Upload document -> Call FastAPI + Gemini -> Render UI
  const handleStartAnalysis = async (fileState: UploadedFileState) => {
    setUploadedFile(fileState);
    setErrorMessage('');

    if (!fileState.fileObj) {
      const errText = 'File object is missing. Please select a valid file.';
      setErrorMessage(errText);
      setAnalysisStatus('error');
      return;
    }

    const file = fileState.fileObj;

    // Frontend validation
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    const allowedExts = ['pdf', 'png', 'jpg', 'jpeg', 'txt'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    if (!allowedExts.includes(ext)) {
      const errText = `Unsupported file type '.${ext}'. Please upload a PDF, PNG, JPG, or TXT file.`;
      setErrorMessage(errText);
      setAnalysisStatus('error');
      return;
    }

    if (file.size === 0) {
      const errText = 'Uploaded file is empty (0 bytes). Please select a document with readable content.';
      setErrorMessage(errText);
      setAnalysisStatus('error');
      return;
    }

    if (file.size > maxSizeBytes) {
      const errText = `File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds maximum allowed limit of 10 MB.`;
      setErrorMessage(errText);
      setAnalysisStatus('error');
      return;
    }

    setAnalysisStatus('analyzing');

    try {
      const response = await analyzeDocument(file);

      if (response.success && response.analysis) {
        const mappedData = mapBackendResultToUIState(response.analysis, file.name);
        setAnalysisData(mappedData);
        setAnalysisStatus('success');
        setTimeout(() => {
          const resultElem = document.getElementById('analysis-result');
          if (resultElem) {
            resultElem.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      } else {
        const errorMsg = response.error || response.aiNotice || 'Unable to understand this document. Please try another file.';
        console.error('AccessBridge analysis error:', errorMsg);
        setErrorMessage(errorMsg);
        setAnalysisStatus('error');
        setTimeout(() => {
          const errorElem = document.getElementById('error-section');
          if (errorElem) {
            errorElem.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      }
    } catch (err: unknown) {
      console.error('Unhandled error during analysis:', err);
      const errText = 'Unable to connect to AccessBridge AI. Please make sure the backend is running.';
      setErrorMessage(errText);
      setAnalysisStatus('error');
      setTimeout(() => {
        const errorElem = document.getElementById('error-section');
        if (errorElem) {
          errorElem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  };

  // DEMO FLOW: Offline sample demo
  const handleSelectSample = () => {
    setUploadedFile({
      name: 'Scholarship_Application_Notice_2026.pdf',
      type: 'application/pdf',
      size: 245000,
    });
    setAnalysisData(MOCK_SCHOLARSHIP_ANALYSIS);
    setAnalysisStatus('analyzing');
    setTimeout(() => {
      setAnalysisStatus('success');
      const resultElem = document.getElementById('analysis-result');
      if (resultElem) {
        resultElem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1800);
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

  const handleReset = () => {
    setUploadedFile(null);
    setErrorMessage('');
    setAnalysisStatus('idle');
    const uploadElem = document.getElementById('upload-section');
    if (uploadElem) {
      uploadElem.scrollIntoView({ behavior: 'smooth' });
    }
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
  const voiceText = `${analysisData.title}. ${analysisData.simpleExplanation}. Deadline: ${analysisData.deadline}. Required documents: ${analysisData.requiredDocuments.map(d => d.label).join(', ')}. Required steps: ${analysisData.actionSteps.map(a => a.label).join(', ')}`;

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
          errorMessage={analysisStatus === 'error' ? errorMessage : undefined}
        />

        {/* Dynamic State Rendering */}
        {analysisStatus === 'analyzing' && (
          <LoadingState onComplete={() => {}} />
        )}

        {analysisStatus === 'idle' && (
          <EmptyState onUploadClick={handleScrollToUpload} />
        )}

        {analysisStatus === 'error' && (
          <div id="error-section" className="scroll-mt-24">
            <ErrorState
              message={errorMessage || 'Unable to process document. Please check your backend connection or try another file.'}
              onRetry={handleReset}
            />
          </div>
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
                  onClick={handleReset}
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
