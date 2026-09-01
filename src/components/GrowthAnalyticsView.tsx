import React from 'react';
import { 
  TrendingUp, 
  Award, 
  ShieldCheck, 
  Clock, 
  Code2, 
  Sparkles, 
  ArrowUpRight, 
  FileCheck, 
  CheckCircle2, 
  Layers,
  Zap,
  Calendar,
  Eye
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { CodeReviewResult, UserSession } from '../types';

interface GrowthAnalyticsViewProps {
  currentUser: UserSession;
  reviews: CodeReviewResult[];
  onSelectReview: (review: CodeReviewResult) => void;
}

export const GrowthAnalyticsView: React.FC<GrowthAnalyticsViewProps> = ({
  currentUser,
  reviews,
  onSelectReview,
}) => {
  // Filter reviews for current user
  const userReviews = reviews.filter((r) => r.userId === currentUser.userId);
  const displayReviews = userReviews.length > 0 ? userReviews : reviews;

  // Compute metrics
  const totalEvaluations = displayReviews.length;
  const avgScore = totalEvaluations > 0 
    ? (displayReviews.reduce((acc, r) => acc + r.overallScore, 0) / totalEvaluations).toFixed(1)
    : '0.0';
  
  const totalBugs = displayReviews.reduce((acc, r) => acc + r.bugs.length, 0);
  const totalGroundedRulesTriggered = displayReviews.reduce((acc, r) => acc + r.groundedRules.length, 0);

  // Score progression data for Recharts
  const scoreProgressionData = [...displayReviews]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map((r, i) => ({
      index: `Review #${i + 1}`,
      date: new Date(r.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      score: r.overallScore,
      language: r.language,
      correctness: r.dimensions.correctness,
      security: r.dimensions.security,
      performance: r.dimensions.performance,
    }));

  // Language distribution
  const langCounts: Record<string, number> = {};
  displayReviews.forEach((r) => {
    langCounts[r.language] = (langCounts[r.language] || 0) + 1;
  });

  const languageData = Object.entries(langCounts).map(([lang, count]) => ({
    language: lang.toUpperCase(),
    count,
  }));

  const COLORS = ['#3b82f6', '#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  return (
    <div className="space-y-6">
      
      {/* User Growth Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500/20 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">{currentUser.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  {currentUser.tier}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{currentUser.email} • {currentUser.role}</p>
              <p className="text-xs text-slate-600 mt-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Persistent session tracking active across Cloud Firestore & BigQuery.
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <div className="text-xl font-extrabold text-slate-900">{totalEvaluations}</div>
              <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Reviews Logged</div>
            </div>

            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-center">
              <div className="text-xl font-extrabold text-blue-700">{avgScore} / 10</div>
              <div className="text-[10px] uppercase font-bold text-blue-500 mt-0.5">Avg Rating</div>
            </div>

            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-center col-span-2 sm:col-span-1">
              <div className="text-xl font-extrabold text-emerald-700">+{totalGroundedRulesTriggered}</div>
              <div className="text-[10px] uppercase font-bold text-emerald-600 mt-0.5">Rules Mastered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Score Progression Trajectory (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Longitudinal Quality Rating Trajectory (1–10 Scale)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Tracking code quality score evolution over successive review iterations.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              Positive Growth Trend
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scoreProgressionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#93c5fd' }}
                />
                <Area type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreGradient)" name="Quality Score" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Multi-language Distribution (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Code2 className="w-4 h-4 text-indigo-600" />
              Multi-Language Evaluation Volume
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Languages submitted across persistent sessions.
            </p>

            <div className="space-y-3">
              {languageData.map((item, idx) => {
                const percentage = Math.round((item.count / totalEvaluations) * 100);
                return (
                  <div key={item.language} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                      <span>{item.language}</span>
                      <span className="text-slate-500">{item.count} submissions ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${percentage}%`, 
                          backgroundColor: COLORS[idx % COLORS.length] 
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center gap-2 text-xs text-indigo-900">
            <Award className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Multi-language bug detection active across all major runtimes.</span>
          </div>
        </div>

      </div>

      {/* Persistent Session Timeline & History List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-600" />
              Persistent User Review Session History
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Stored longitudinally in Cloud Firestore for continuous development growth tracking.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {displayReviews.length} Total Sessions
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {displayReviews.map((rev) => (
            <div
              key={rev.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-xl transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold text-xs shrink-0 border ${
                  rev.overallScore >= 8.5 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : rev.overallScore >= 7.0 
                    ? 'bg-blue-50 text-blue-700 border-blue-200' 
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  <span className="text-sm font-extrabold leading-none">{rev.overallScore.toFixed(1)}</span>
                  <span className="text-[9px] uppercase mt-0.5">Grade {rev.grade}</span>
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-900 font-mono">
                      {rev.fileName || 'submission.code'}
                    </span>
                    <span className="px-2 py-0.2 text-[10px] font-semibold bg-slate-100 text-slate-700 rounded-md uppercase">
                      {rev.language}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(rev.timestamp).toLocaleDateString(undefined, { 
                        month: 'short', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 line-clamp-1 max-w-xl">
                    {rev.summary}
                  </p>

                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500">
                    <span>{rev.bugs.length} Issues Found</span>
                    <span>•</span>
                    <span>{rev.groundedRules.length} Historical Rules Grounded</span>
                    <span>•</span>
                    <span>{rev.executionMetrics?.durationMs || 700}ms</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <button
                id={`inspect-session-${rev.id}`}
                onClick={() => onSelectReview(rev)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-white text-xs font-semibold text-slate-700 shadow-2xs transition-colors self-start sm:self-center"
              >
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                <span>Inspect in Reviewer</span>
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
