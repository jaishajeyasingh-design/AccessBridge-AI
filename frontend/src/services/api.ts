import { AnalyzeApiResponse } from '../types';

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

