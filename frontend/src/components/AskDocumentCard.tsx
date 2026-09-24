import React, { useState, useRef, useEffect } from 'react';
import {
  HelpCircle,
  Send,
  Sparkles,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Mic,
  MicOff,
} from 'lucide-react';
import { askQuestion } from '../services/api';
import { LanguageCode } from '../types';

interface AskDocumentCardProps {
  documentText: string;
  analysis: object;
  selectedLanguage: LanguageCode;
}

const SUGGESTED_QUESTIONS = [
  'What is this document about?',
  'What is my transaction number?',
  'How much did I pay?',
  'What should I do next?',
];

const LANGUAGE_NAME_MAP: Record<LanguageCode, string> = {
  en: 'English',
  ta: 'Tamil',
  hi: 'Hindi',
  te: 'Telugu',
  ml: 'Malayalam',
};

const SPEECH_LANG_MAP: Record<LanguageCode, string> = {
  en: 'en-IN',
  ta: 'ta-IN',
  hi: 'hi-IN',
  te: 'te-IN',
  ml: 'ml-IN',
};

export const AskDocumentCard: React.FC<AskDocumentCardProps> = ({
  documentText,
  analysis,
  selectedLanguage,
}) => {
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [askedQuestionText, setAskedQuestionText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Cleanup recognition on unmount
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore cleanup errors
        }
      }
    };
  }, []);

  const handleToggleListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Voice input is not supported in this browser. You can type your question instead.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore stop error
        }
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = SPEECH_LANG_MAP[selectedLanguage] || 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setError('');
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          setQuestion(transcript);
          if (error) setError('');
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error !== 'no-speech') {
          setError('Voice input is not supported in this browser. You can type your question instead.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: unknown) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
      setError('Voice input is not supported in this browser. You can type your question instead.');
    }
  };

  const handleSubmit = async (customQuestion?: string) => {
    const query = (customQuestion !== undefined ? customQuestion : question).trim();
    if (!query) {
      setError('Please type a question or select a suggestion.');
      return;
    }

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    }

    setQuestion(query);
    setError('');
    setIsLoading(true);
    setAnswer('');
    setAskedQuestionText(query);

    const targetLang = LANGUAGE_NAME_MAP[selectedLanguage] || 'English';

    try {
      const response = await askQuestion(query, documentText, analysis, targetLang);

      if (response.success && response.answer) {
        setAnswer(response.answer);
      } else {
        setError(response.error || 'Could not find an answer in the document.');
      }
    } catch (err: unknown) {
      console.error('AskDocumentCard error:', err);
      setError('Unable to connect to AccessBridge Q&A service.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (q: string) => {
    setQuestion(q);
    handleSubmit(q);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit();
    }
  };

  return (
    <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0 shadow-lg">
          <HelpCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <span>Ask AccessBridge</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>AI Q&A</span>
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Ask questions about your document in simple language.
          </p>
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Suggested Questions:
        </p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestionClick(sq)}
              disabled={isLoading || isListening}
              className="text-xs font-medium px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-white transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              💬 {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Voice Listening Active Indicator */}
      {isListening && (
        <div className="flex items-center gap-2.5 mb-3 px-4 py-2 bg-red-950/40 border border-red-500/40 rounded-xl text-red-300 text-xs font-medium animate-pulse">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0 animate-ping" />
          <span>
            Listening... Speak your question now in {LANGUAGE_NAME_MAP[selectedLanguage]} ({SPEECH_LANG_MAP[selectedLanguage]})
          </span>
        </div>
      )}

      {/* Input Field & Mic & Submit Button */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 flex items-center">
          <input
            type="text"
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              if (error) setError('');
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              isListening
                ? 'Listening to your question...'
                : 'Type your question here (e.g. What is my transaction number?)...'
            }
            disabled={isLoading}
            className={`w-full pl-4 pr-12 py-3.5 bg-slate-950/80 border ${
              isListening
                ? 'border-red-500/80 ring-2 ring-red-500/20'
                : 'border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
            } rounded-2xl text-slate-100 placeholder-slate-500 text-sm outline-none transition-all disabled:opacity-50`}
          />

          {/* Voice Input Microphone Button */}
          <button
            type="button"
            onClick={handleToggleListening}
            disabled={isLoading}
            title={isListening ? 'Stop listening' : 'Ask by voice'}
            aria-label={isListening ? 'Stop listening' : 'Ask by voice'}
            className={`absolute right-3 p-2 rounded-xl transition-all flex items-center justify-center ${
              isListening
                ? 'bg-red-500/30 text-red-400 border border-red-500/50 animate-pulse'
                : 'bg-slate-800/80 hover:bg-indigo-600/30 text-slate-400 hover:text-indigo-300 border border-slate-700/60'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isListening ? (
              <MicOff className="w-4 h-4 text-red-400" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>
        </div>

        <button
          onClick={() => handleSubmit()}
          disabled={isLoading || !question.trim()}
          className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-2xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Searching...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Ask Question</span>
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-2xl text-red-300 text-sm flex items-center gap-3 mb-4">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Answer Output Container */}
      {answer && (
        <div className="p-5 bg-slate-950/90 border border-indigo-500/30 rounded-2xl space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Answer</span>
            </span>
            {askedQuestionText && (
              <span className="text-xs font-mono text-slate-400 italic truncate max-w-xs">
                "{askedQuestionText}"
              </span>
            )}
          </div>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal whitespace-pre-wrap">
            {answer}
          </p>

          <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium flex items-center gap-1">
              ✨ Answer based on your uploaded document
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
