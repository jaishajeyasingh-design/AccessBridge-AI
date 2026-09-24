import React, { useState, useEffect } from 'react';
import { Volume2, Play, Pause, Square, AlertCircle, Radio } from 'lucide-react';
import { speechService } from '../utils/speech';
import { LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from '../utils/mockData';

interface VoiceCardProps {
  textToRead: string;
  selectedLanguage: LanguageCode;
}

export const VoiceCard: React.FC<VoiceCardProps> = ({ textToRead, selectedLanguage }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    // Reset audio state if component unmounts or text changes
    return () => {
      speechService.stop();
    };
  }, [textToRead, selectedLanguage]);

  const handleListen = () => {
    setErrorMessage(null);

    if (!speechService.isSupported()) {
      setErrorMessage("Web Speech API is not supported in this browser.");
      return;
    }

    if (isPaused) {
      speechService.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    setIsPlaying(true);
    setIsPaused(false);

    speechService.speak(
      textToRead,
      langObj.voiceLang,
      () => {
        setIsPlaying(false);
        setIsPaused(false);
      },
      (err) => {
        console.warn("Speech synthesis notice:", err);
        setIsPlaying(false);
        setIsPaused(false);
        setErrorMessage("Voice playback completed or unavailable for this accent.");
      }
    );
  };

  const handlePause = () => {
    if (isPlaying && !isPaused) {
      speechService.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    speechService.stop();
    setIsPlaying(false);
    setIsPaused(false);
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
            <Volume2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white">
                Listen to this information
              </h3>
              {isPlaying && (
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold animate-pulse border border-emerald-500/30">
                  <Radio className="w-3 h-3" /> Speaking ({langObj.name})
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Screen reader & voice assistance powered by Web Speech API
            </p>
          </div>
        </div>

        {/* Audio Action Buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {!isPlaying ? (
            <button
              onClick={handleListen}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400"
              aria-label="Listen to information"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isPaused ? 'Resume' : 'Listen'}</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-amber-600/30 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400"
              aria-label="Pause voice playback"
            >
              <Pause className="w-4 h-4 fill-white" />
              <span>Pause</span>
            </button>
          )}

          <button
            onClick={handleStop}
            disabled={!isPlaying && !isPaused}
            className={`px-4 py-2.5 rounded-xl border text-sm font-semibold flex items-center gap-2 transition-all ${
              isPlaying || isPaused
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-slate-900/40 text-slate-600 border-slate-800 cursor-not-allowed'
            }`}
            aria-label="Stop voice playback"
          >
            <Square className="w-4 h-4 fill-current" />
            <span>Stop</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="mt-4 p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl flex items-center gap-2 text-xs text-amber-300">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="mt-4 text-xs text-slate-400 flex items-center gap-2">
        <span>Target Accent: <strong className="text-indigo-300">{langObj.voiceLang}</strong></span>
        <span>•</span>
        <span>Includes simplified explanation & action steps.</span>
      </div>
    </div>
  );
};
