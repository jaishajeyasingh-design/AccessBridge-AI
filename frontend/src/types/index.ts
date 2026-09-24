export type LanguageCode = 'en' | 'ta' | 'hi' | 'te' | 'ml';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  localName: string;
  voiceLang: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface TranslationData {
  title: string;
  simpleExplanation: string;
  actionStepsSummary: string;
  warnings?: string;
}

export interface MockAnalysisData {
  title: string;
  documentType: string;
  simpleExplanation: string;
  eligibility: string[];
  deadline: string;
  deadlineWarning: string;
  requiredDocuments: ChecklistItem[];
  actionSteps: ChecklistItem[];
  importantPoints: string[];
  warnings: string;
  translations: Record<LanguageCode, TranslationData>;
}

export interface UploadedFileState {
  name: string;
  type: string;
  size: number;
  fileObj?: File;
}

export type AnalysisStatus = 'idle' | 'uploading' | 'analyzing' | 'success' | 'error';
