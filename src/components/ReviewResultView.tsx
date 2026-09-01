import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Zap, 
  Layers, 
  ArrowRight, 
  Copy, 
  Check, 
  Sparkles, 
  ExternalLink,
  BookMarked,
  Clock,
  Cpu,
  FileCheck,
  Code2,
  GitCompare,
  TrendingUp,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CodeReviewResult, BugReport } from '../types';

interface ReviewResultViewProps {
  result: CodeReviewResult | null;
  isLoading: boolean;
  onApplyRefactoredCode: (code: string) => void;
}

export const ReviewResultView: React.FC<ReviewResultViewProps> = ({
  result,
  isLoading,
  onApplyRefactoredCode,
}) => {
  const [activeTab, setActiveTab] = useState<'bugs' | 'grounding' | 'architecture' | 'optimizations' | 'refactor'>('bugs');
  const [copiedRefactor, setCopiedRefactor] = useState(false);
  const [diffViewMode, setDiffViewMode] = useState<'refactored' | 'side-by-side'>('refactored');

  // Trigger celebratory confetti on high scores
  React.useEffect(() => {
    if (result && result.overallScore >= 8.5) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore in case of headless
      }
    }
  }, [result]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs flex flex-col items-center justify-center min-h-[460px] text-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 animate-pulse">
            <Sparkles className="w-8 h-8 animate-spin" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
            24/7
          </div>
        </div>
        <h3 className="text-base font-semibold text-slate-800">
          Evaluating Code with Vertex AI & Historical Grounding
        </h3>
        <p className="text-xs text-slate-500 max-w-md mt-2">
          Ingesting historical CSV patterns, analyzing multi-language syntax, computing 1–10 quality dimensions, and generating architectural refactorings...
        </p>
        <div className="w-48 h-1.5 bg-slate-100 rounded-full mt-6 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-full animate-[shimmer_1.5s_infinite]"></div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs flex flex-col items-center justify-center min-h-[460px] text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
          <Code2 className="w-7 h-7" />
        </div>
        <h3 className="text-sm font-semibold text-slate-700">No Active Evaluation</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          Select a sample code snippet or paste your source code in the editor, then click &quot;Review Code Now&quot; to generate an intelligent quality report.
        </p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 7.0) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 5.0) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getSeverityBadge = (severity: BugReport['severity']) => {
    switch (severity) {
      case 'critical':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-100 text-rose-800 border border-rose-200">Critical</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-orange-100 text-orange-800 border border-orange-200">High</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200">Medium</span>;
      case 'low':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800 border border-blue-200">Low</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-800 border border-slate-200">Info</span>;
    }
  };

  const handleCopyRefactor = () => {
    navigator.clipboard.writeText(result.refactoredCode);
    setCopiedRefactor(true);
    setTimeout(() => setCopiedRefactor(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-full">
      {/* Top Header & Standardized 1-10 Rating Score Card */}
      <div className="p-5 border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Main Quality Score Badge (1-10 Scale) */}
          <div className="flex items-center gap-4">
            <div className={`w-20 h-20 rounded-2xl border flex flex-col items-center justify-center p-2 shadow-xs ${getScoreColor(result.overallScore)}`}>
              <span className="text-2xl font-black tracking-tight leading-none">
                {result.overallScore.toFixed(1)}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">
                Scale 1–10
              </span>
              <span className="text-[11px] font-extrabold px-2 py-0.2 rounded-md bg-white/80 mt-1 shadow-2xs">
                Grade {result.grade}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Standardized Code Quality Rating
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-700 rounded-md border border-slate-200 uppercase">
                  {result.language}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2 max-w-xl">
                {result.summary}
              </p>
              
              {/* Telemetry Metrics */}
              <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {result.executionMetrics.durationMs}ms
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-slate-400" />
                  {result.executionMetrics.model}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-indigo-600 font-medium">
                  <BookMarked className="w-3 h-3" />
                  {result.groundedRules.length} Grounded Rules Applied
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action: Apply Refactor */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              id="apply-refactor-top-btn"
              onClick={() => onApplyRefactoredCode(result.refactoredCode)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-lg transition-colors shadow-2xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Refactored Code</span>
            </button>
          </div>
        </div>

        {/* 5-Dimensional Quality Rubric Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-4 pt-4 border-t border-slate-100">
          {[
            { label: 'Correctness', val: result.dimensions.correctness, icon: FileCheck },
            { label: 'Security', val: result.dimensions.security, icon: ShieldAlert },
            { label: 'Maintainability', val: result.dimensions.maintainability, icon: Code2 },
            { label: 'Performance', val: result.dimensions.performance, icon: Zap },
            { label: 'Architecture', val: result.dimensions.architecture, icon: Layers },
          ].map((dim) => (
            <div key={dim.label} className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 mb-1">
                <span className="flex items-center gap-1">
                  <dim.icon className="w-3 h-3 text-slate-400" />
                  {dim.label}
                </span>
                <span className="font-bold text-slate-900">{dim.val}/10</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    dim.val >= 8 ? 'bg-emerald-500' : dim.val >= 6 ? 'bg-blue-500' : dim.val >= 4 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, (dim.val / 10) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="px-5 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2 overflow-x-auto">
        <button
          id="tab-bugs-btn"
          onClick={() => setActiveTab('bugs')}
          className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'bugs'
              ? 'border-blue-600 text-blue-700 bg-white shadow-2xs rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          <span>Bug Reports ({result.bugs.length})</span>
        </button>

        <button
          id="tab-grounding-btn"
          onClick={() => setActiveTab('grounding')}
          className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'grounding'
              ? 'border-blue-600 text-blue-700 bg-white shadow-2xs rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookMarked className="w-3.5 h-3.5 text-indigo-500" />
          <span>Historical Rule Grounding ({result.groundedRules.length})</span>
        </button>

        <button
          id="tab-arch-btn"
          onClick={() => setActiveTab('architecture')}
          className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'architecture'
              ? 'border-blue-600 text-blue-700 bg-white shadow-2xs rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-purple-500" />
          <span>Architectural Guidance</span>
        </button>

        <button
          id="tab-opt-btn"
          onClick={() => setActiveTab('optimizations')}
          className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'optimizations'
              ? 'border-blue-600 text-blue-700 bg-white shadow-2xs rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Optimization Insights</span>
        </button>

        <button
          id="tab-refactor-btn"
          onClick={() => setActiveTab('refactor')}
          className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'refactor'
              ? 'border-blue-600 text-blue-700 bg-white shadow-2xs rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <GitCompare className="w-3.5 h-3.5 text-emerald-500" />
          <span>Refactored Code & Diff</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="p-5 flex-1 overflow-y-auto max-h-[500px]">
        
        {/* BUGS & VIOLATIONS TAB */}
        {activeTab === 'bugs' && (
          <div className="space-y-3">
            {result.bugs.length === 0 ? (
              <div className="p-8 text-center bg-emerald-50/50 rounded-xl border border-emerald-100">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-emerald-900">Zero Critical Bugs Detected</h4>
                <p className="text-xs text-emerald-700 mt-1">
                  The code satisfies all fundamental correctness and security constraints!
                </p>
              </div>
            ) : (
              result.bugs.map((bug) => (
                <div 
                  key={bug.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {getSeverityBadge(bug.severity)}
                      <span className="text-xs font-semibold text-slate-900">{bug.title}</span>
                      {bug.lineRange && (
                        <span className="text-[11px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          {bug.lineRange}
                        </span>
                      )}
                    </div>
                    {bug.groundedRuleId && (
                      <span className="text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <BookMarked className="w-3 h-3" />
                        Rule #{bug.groundedRuleId}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 mt-2">{bug.description}</p>

                  <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <span className="font-semibold text-slate-900 block mb-1">
                      💡 Suggested Remediation:
                    </span>
                    <code className="text-xs font-mono text-slate-800 break-words whitespace-pre-wrap">
                      {bug.suggestedFix}
                    </code>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* HISTORICAL GROUNDING TAB (RAG Learning Engine) */}
        {activeTab === 'grounding' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900">
              <div className="flex items-center gap-2 font-semibold">
                <BookMarked className="w-4 h-4 text-indigo-600" />
                <span>Historical Rule Grounding (RAG Learning System)</span>
              </div>
              <p className="mt-1 text-[11px] text-indigo-700">
                The evaluation engine cross-referenced this submission against organizational historical rules. These rules directly grounded the evaluation and scoring.
              </p>
            </div>

            {result.groundedRules.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs text-slate-600">
                  No historical rule anti-patterns were triggered. The submission aligns with organizational coding guidelines.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {result.groundedRules.map((gr, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-bold rounded-md uppercase">
                          Rule #{gr.ruleId} • {gr.type}
                        </span>
                        <span className="text-xs font-semibold text-slate-900">
                          {gr.description}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {Math.round(gr.relevanceScore * 100)}% Match
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="font-semibold text-slate-800">Grounding Rationale: </span>
                      {gr.groundingReason}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ARCHITECTURAL GUIDANCE TAB */}
        {activeTab === 'architecture' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Strengths */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
                <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Architectural Strengths
                </h4>
                <ul className="space-y-1.5 text-xs text-emerald-800">
                  {result.architecture.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40">
                <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Best-Practice Recommendations
                </h4>
                <ul className="space-y-1.5 text-xs text-blue-800">
                  {result.architecture.recommendations.map((r, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommended Design Patterns */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                <Layers className="w-4 h-4 text-purple-600" />
                Recommended Enterprise Design Patterns
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.architecture.designPatterns.map((pat, i) => (
                  <span key={i} className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 text-xs font-medium rounded-lg">
                    {pat}
                  </span>
                ))}
              </div>
            </div>

            {/* Scalability Notes */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
                <TrendingUp className="w-4 h-4 text-slate-600" />
                Scalability & Long-Term Maintenance
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {result.architecture.scalabilityNotes}
              </p>
            </div>
          </div>
        )}

        {/* OPTIMIZATION INSIGHTS TAB */}
        {activeTab === 'optimizations' && (
          <div className="space-y-3">
            {result.optimizations.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs text-slate-600">
                  No major computational or resource bottlenecks identified.
                </p>
              </div>
            ) : (
              result.optimizations.map((opt, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      {opt.area}
                    </h4>
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-bold rounded-md border border-amber-200">
                      {opt.potentialGain}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 mt-2">{opt.description}</p>

                  {(opt.timeComplexityCurrent || opt.spaceComplexityCurrent) && (
                    <div className="grid grid-cols-2 gap-2 mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-mono">
                      {opt.timeComplexityCurrent && (
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase block">Time Complexity</span>
                          <span className="text-rose-600">{opt.timeComplexityCurrent}</span>
                          <span className="mx-1 text-slate-400">→</span>
                          <span className="text-emerald-600 font-bold">{opt.timeComplexityTarget || 'O(1)'}</span>
                        </div>
                      )}
                      {opt.spaceComplexityCurrent && (
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase block">Space Complexity</span>
                          <span className="text-slate-700">{opt.spaceComplexityCurrent}</span>
                          <span className="mx-1 text-slate-400">→</span>
                          <span className="text-emerald-600 font-bold">{opt.spaceComplexityTarget || 'O(1)'}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* REFACTORED CODE & DIFF TAB */}
        {activeTab === 'refactor' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-800">
                  Refactored & Remediated Production Code
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded-md border border-emerald-200">
                  Ready to Deploy
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="copy-refactor-btn"
                  onClick={handleCopyRefactor}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
                >
                  {copiedRefactor ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedRefactor ? 'Copied' : 'Copy Refactored'}</span>
                </button>

                <button
                  id="apply-refactor-inner-btn"
                  onClick={() => onApplyRefactoredCode(result.refactoredCode)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-2xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply to Editor</span>
                </button>
              </div>
            </div>

            {/* Code Surface */}
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-100 overflow-x-auto leading-5 max-h-[380px]">
              <pre className="whitespace-pre">{result.refactoredCode}</pre>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
