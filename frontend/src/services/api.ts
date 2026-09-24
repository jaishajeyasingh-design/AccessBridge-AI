import { AnalyzeApiResponse, AskApiResponse } from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

export async function analyzeDocument(file: File): Promise<AnalyzeApiResponse> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      body: formData,
      // Do NOT manually set Content-Type for FormData; browser sets multi-part boundary automatically.
    });

    let data: AnalyzeApiResponse;
    try {
      data = await response.json();
    } catch {
      return {
        success: false,
        error: 'Unable to understand response from AccessBridge AI server.',
      };
    }

    if (!response.ok) {
      return {
        success: false,
        error: data?.error || `Server returned error (${response.status}).`,
      };
    }

    return data;
  } catch (err: unknown) {
    console.error('API Error in analyzeDocument:', err);
    return {
      success: false,
      error: 'Unable to connect to AccessBridge AI. Please make sure the backend is running.',
    };
  }
}

export interface TranslateApiResponse {
  success: boolean;
  targetLanguage?: string;
  translatedText?: string;
  translatedAnalysis?: any;
  error?: string;
}

export async function translateContent(
  textOrObj: string | object,
  targetLanguage: string
): Promise<TranslateApiResponse> {
  const payloadText = typeof textOrObj === 'string' ? textOrObj : JSON.stringify(textOrObj);

  try {
    const response = await fetch(`${API_BASE_URL}/api/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: payloadText,
        targetLanguage: targetLanguage,
      }),
    });

    let data: TranslateApiResponse;
    try {
      data = await response.json();
    } catch {
      return {
        success: false,
        error: 'Unable to parse translation response from server.',
      };
    }

    if (!response.ok) {
      return {
        success: false,
        error: data?.error || `Translation request failed (${response.status}).`,
      };
    }

    return data;
  } catch (err: unknown) {
    console.error('API Error in translateContent:', err);
    return {
      success: false,
      error: 'Unable to connect to AccessBridge AI translation server.',
    };
  }
}

export async function askQuestion(
  question: string,
  documentText: string,
  analysis: object = {},
  language: string = 'English'
): Promise<AskApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        documentText,
        analysis,
        language,
      }),
    });

    let data: AskApiResponse;
    try {
      data = await response.json();
    } catch {
      return {
        success: false,
        error: 'Unable to parse Q&A response from server.',
      };
    }

    if (!response.ok) {
      return {
        success: false,
        error: data?.error || `Q&A request failed (${response.status}).`,
      };
    }

    return data;
  } catch (err: unknown) {
    console.error('API Error in askQuestion:', err);
    return {
      success: false,
      error: 'Unable to connect to AccessBridge AI server.',
    };
  }
}

