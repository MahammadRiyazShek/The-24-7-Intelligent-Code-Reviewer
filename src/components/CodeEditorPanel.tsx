import React, { useState } from 'react';
import { 
  Play, 
  Code, 
  FileCode, 
  Sparkles, 
  BookOpen, 
  RotateCcw, 
  Check, 
  Copy,
  Layers,
  ShieldAlert,
  Zap,
  Info
} from 'lucide-react';
import { SupportedLanguage } from '../types';
import { SAMPLE_SNIPPETS, CodeSample } from '../data/sampleSnippets';

interface CodeEditorPanelProps {
  code: string;
  setCode: (code: string) => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  fileName: string;
  setFileName: (name: string) => void;
  isLoading: boolean;
  onRunReview: () => void;
  activeRulesCount: number;
}

const SUPPORTED_LANGUAGES: { value: SupportedLanguage; label: string; ext: string }[] = [
  { value: 'python', label: 'Python', ext: 'py' },
  { value: 'typescript', label: 'TypeScript', ext: 'ts' },
  { value: 'javascript', label: 'JavaScript', ext: 'js' },
  { value: 'go', label: 'Go (Golang)', ext: 'go' },
  { value: 'rust', label: 'Rust', ext: 'rs' },
  { value: 'java', label: 'Java', ext: 'java' },
  { value: 'cpp', label: 'C++', ext: 'cpp' },
  { value: 'csharp', label: 'C#', ext: 'cs' },
  { value: 'sql', label: 'SQL (Postgres/BigQuery)', ext: 'sql' },
  { value: 'kotlin', label: 'Kotlin', ext: 'kt' },
  { value: 'php', label: 'PHP', ext: 'php' },
  { value: 'ruby', label: 'Ruby', ext: 'rb' },
];

export const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({
  code,
  setCode,
  language,
  setLanguage,
  fileName,
  setFileName,
  isLoading,
  onRunReview,
  activeRulesCount,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedSampleTitle, setSelectedSampleTitle] = useState<string>('');

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    const matched = SUPPORTED_LANGUAGES.find((l) => l.value === newLang);
    if (matched && fileName.includes('.')) {
      const base = fileName.split('.')[0];
      setFileName(`${base}.${matched.ext}`);
    }
  };

  const handleLoadSample = (sample: CodeSample) => {
    setSelectedSampleTitle(sample.title);
    setLanguage(sample.language);
    setFileName(sample.fileName);
    setCode(sample.code);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate line numbers
  const lines = code.split('\n');
  const lineCount = Math.max(lines.length, 16);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-full">
      {/* Editor Controls Bar */}
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
        
        {/* Language & Filename */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1 shadow-2xs">
            <Code className="w-3.5 h-3.5 text-blue-600" />
            <select
              id="language-select"
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
              className="text-xs font-semibold text-slate-800 bg-transparent focus:outline-hidden cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1 shadow-2xs">
            <FileCode className="w-3.5 h-3.5 text-slate-500" />
            <input
              id="filename-input"
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="e.g. main.py"
              className="text-xs font-mono text-slate-700 bg-transparent focus:outline-hidden w-36"
            />
          </div>

          {/* Preset Sample Quick Loader */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1 shadow-2xs">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <select
              id="sample-preset-select"
              value={selectedSampleTitle}
              onChange={(e) => {
                const sample = SAMPLE_SNIPPETS.find((s) => s.title === e.target.value);
                if (sample) handleLoadSample(sample);
              }}
              className="text-xs font-medium text-slate-700 bg-transparent focus:outline-hidden cursor-pointer max-w-[200px] truncate"
            >
              <option value="">⚡ Load Sample Code...</option>
              {SAMPLE_SNIPPETS.map((sample) => (
                <option key={sample.title} value={sample.title}>
                  {sample.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="copy-code-btn"
            onClick={handleCopyCode}
            title="Copy source code"
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            id="reset-code-btn"
            onClick={() => setCode('')}
            title="Clear editor"
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor Main Surface */}
      <div className="relative flex-1 min-h-[380px] bg-slate-950 font-mono text-xs flex overflow-hidden">
        {/* Line Numbers Gutter */}
        <div className="w-12 py-3 bg-slate-900/90 text-slate-600 text-right pr-3 select-none font-mono text-xs border-r border-slate-800/80">
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea Code Input */}
        <textarea
          id="code-input-textarea"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={`// Paste or write your ${language} source code here for 24/7 intelligent review...
// The evaluation engine will test quality (1-10), bugs, architecture, and historical grounding.`}
          spellCheck={false}
          className="flex-1 p-3 bg-transparent text-slate-100 resize-none focus:outline-hidden font-mono text-xs leading-6 overflow-auto selection:bg-blue-600 selection:text-white"
        />
      </div>

      {/* Bottom Evaluation Trigger Bar */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
        {/* Rule Ingestion Status Pill */}
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-medium border border-blue-200">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>{activeRulesCount} Historical Rules Active (RAG Grounding)</span>
          </span>
          <span className="hidden md:inline-flex text-slate-400">•</span>
          <span className="hidden md:inline-flex text-[11px] text-slate-500">
            Automated 1–10 Quality Rating
          </span>
        </div>

        {/* Run Evaluation Button */}
        <button
          id="evaluate-code-btn"
          disabled={isLoading || !code.trim()}
          onClick={onRunReview}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs text-white shadow-sm transition-all ${
            isLoading || !code.trim()
              ? 'bg-slate-400 cursor-not-allowed opacity-60'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-98 shadow-blue-500/20'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Grounding with Vertex AI & Reviewing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span className="font-semibold">Review Code Now</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
