import React, { useState, useRef } from 'react';
import { Upload, FileText, X, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { UploadedFileState } from '../types';

interface UploadCardProps {
  onAnalyze: (file: UploadedFileState) => void;
  onSelectSample: () => void;
  isAnalyzing: boolean;
}

export const UploadCard: React.FC<UploadCardProps> = ({
  onAnalyze,
  onSelectSample,
  isAnalyzing,
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<UploadedFileState | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    const fileState: UploadedFileState = {
      name: file.name,
      type: file.type || 'application/pdf',
      size: file.size,
      fileObj: file,
    };
    setSelectedFile(fileState);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleRemove = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div id="upload-section" className="scroll-mt-24 max-w-4xl mx-auto px-4 py-8">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Subtle accent border top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Upload your document
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
            Upload a PDF, image or text file to extract actionable steps and simplified explanations.
          </p>
        </div>

        {/* File Dropzone or Selected File Display */}
        {!selectedFile ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
              dragActive
                ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
                : 'border-slate-700/80 bg-slate-950/60 hover:border-slate-600 hover:bg-slate-800/40'
            }`}
            tabIndex={0}
            role="button"
            aria-label="Upload document drag and drop area"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                fileInputRef.current?.click();
              }
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.txt"
              onChange={handleChange}
              className="hidden"
            />

            <div className="w-16 h-16 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4 text-indigo-400">
              <Upload className="w-8 h-8" />
            </div>

            <p className="text-lg font-semibold text-slate-200 mb-1">
              Drop your document here
            </p>
            <p className="text-slate-400 text-sm mb-4">or</p>

            <button
              type="button"
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white font-medium text-sm rounded-xl border border-slate-700 transition-colors inline-flex items-center gap-2 mb-4"
            >
              <FileText className="w-4 h-4" />
              Browse Files
            </button>

            <div className="text-xs text-slate-500 font-medium">
              Supported formats: <span className="text-slate-400 font-semibold">PDF • PNG • JPG • TXT</span> (Max 10MB)
            </div>
          </div>
        ) : (
          /* File Preview Card */
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 mb-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-base font-semibold text-white truncate">
                    {selectedFile.name}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="uppercase font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                      {selectedFile.type.split('/')[1] || 'PDF'}
                    </span>
                    <span>{formatFileSize(selectedFile.size)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleRemove}
                disabled={isAnalyzing}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
                aria-label="Remove uploaded file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>Ready for AI Analysis</span>
              </div>

              <button
                onClick={() => onAnalyze(selectedFile)}
                disabled={isAnalyzing}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Analyze Document</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Quick Sample Demo Banner */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="text-xs text-slate-400">
            Want to test immediately without uploading?
          </div>
          <button
            onClick={onSelectSample}
            disabled={isAnalyzing}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 px-3.5 py-2 rounded-xl transition-all inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Try Sample Scholarship Notice
          </button>
        </div>
      </div>
    </div>
  );
};
