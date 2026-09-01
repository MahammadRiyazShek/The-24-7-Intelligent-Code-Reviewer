export type SupportedLanguage = 
  | 'typescript'
  | 'javascript'
  | 'python'
  | 'go'
  | 'rust'
  | 'java'
  | 'cpp'
  | 'csharp'
  | 'sql'
  | 'php'
  | 'ruby'
  | 'kotlin';

export interface HistoricalRule {
  id: number | string;
  type: 'formatting' | 'performance' | 'security' | 'architecture' | 'reliability' | 'maintainability' | string;
  description: string;
  enabled?: boolean;
  matchScore?: number;
  timesApplied?: number;
}

export interface QualityDimensions {
  correctness: number; // 1-10
  security: number; // 1-10
  maintainability: number; // 1-10
  performance: number; // 1-10
  architecture: number; // 1-10
}

export interface BugReport {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: 'security' | 'bug' | 'performance' | 'formatting' | 'architecture';
  lineRange?: string;
  description: string;
  suggestedFix: string;
  groundedRuleId?: string | number;
}

export interface GroundedRuleMatch {
  ruleId: number | string;
  type: string;
  description: string;
  relevanceScore: number;
  groundingReason: string;
}

export interface ArchitecturalGuidance {
  strengths: string[];
  recommendations: string[];
  designPatterns: string[];
  scalabilityNotes: string;
}

export interface OptimizationInsight {
  area: string;
  timeComplexityCurrent?: string;
  timeComplexityTarget?: string;
  spaceComplexityCurrent?: string;
  spaceComplexityTarget?: string;
  description: string;
  potentialGain: string;
}

export interface CodeReviewResult {
  id: string;
  timestamp: string;
  userId: string;
  language: SupportedLanguage;
  fileName?: string;
  codeSnippet: string;
  overallScore: number; // 1.0 - 10.0
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  dimensions: QualityDimensions;
  summary: string;
  bugs: BugReport[];
  groundedRules: GroundedRuleMatch[];
  architecture: ArchitecturalGuidance;
  optimizations: OptimizationInsight[];
  refactoredCode: string;
  executionMetrics: {
    durationMs: number;
    tokensEvaluated: number;
    model: string;
    ragRulesIngestedCount: number;
  };
}

export interface UserSession {
  userId: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: string;
  tier: string;
}

export interface GrowthTimelinePoint {
  date: string;
  reviewId: string;
  score: number;
  language: string;
  bugsFixedCount: number;
  securityScore: number;
  performanceScore: number;
}
