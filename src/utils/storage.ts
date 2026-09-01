import { CodeReviewResult, HistoricalRule, UserSession, GrowthTimelinePoint } from '../types';
import { INITIAL_RULES } from '../data/initialRules';

const STORAGE_KEYS = {
  RULES: 'aicr_historical_rules_v1',
  REVIEWS: 'aicr_reviews_history_v1',
  ACTIVE_USER: 'aicr_active_user_v1',
};

export const DEFAULT_USERS: UserSession[] = [
  {
    userId: 'usr_sarah_chen',
    name: 'Sarah Chen',
    email: 'sarah.chen@engineering.corp',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'Lead Cloud Architect',
    tier: 'Enterprise Engineer',
  },
  {
    userId: 'usr_alex_rivera',
    name: 'Alex Rivera',
    email: 'alex.rivera@engineering.corp',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Full-Stack Systems Engineer',
    tier: 'Staff Engineer',
  },
  {
    userId: 'usr_marcus_vance',
    name: 'Marcus Vance',
    email: 'marcus.vance@engineering.corp',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'Security & Backend Developer',
    tier: 'Senior Engineer',
  },
];

// Seed initial historical reviews to demonstrate growth trends over time
export const INITIAL_SEED_REVIEWS: CodeReviewResult[] = [
  {
    id: 'rev_seed_01',
    timestamp: new Date(Date.now() - 14 * 86400000).toISOString(),
    userId: 'usr_sarah_chen',
    language: 'python',
    fileName: 'raw_query_handler.py',
    codeSnippet: 'def fetch_data(uid):\n  q = "SELECT * FROM t WHERE id=" + uid\n  for i in range(10):\n    db.query(f"SELECT * FROM items WHERE u={uid}")',
    overallScore: 4.2,
    grade: 'D',
    dimensions: {
      correctness: 5.0,
      security: 3.0,
      maintainability: 4.5,
      performance: 3.8,
      architecture: 4.7,
    },
    summary: 'High security risk due to unparameterized SQL interpolation. Critical N+1 database queries detected inside iterative loops.',
    bugs: [
      {
        id: 'bug-1',
        title: 'SQL Injection Vulnerability',
        severity: 'critical',
        category: 'security',
        lineRange: 'Line 2',
        description: 'Direct string concatenation of user identifier into SQL query.',
        suggestedFix: 'Use parameterized queries: cursor.execute("SELECT * FROM t WHERE id = ?", (uid,))',
        groundedRuleId: 3,
      },
      {
        id: 'bug-2',
        title: 'N+1 Database Query in Loop',
        severity: 'high',
        category: 'performance',
        lineRange: 'Line 3-4',
        description: 'Repeated query execution in loop exhausts connection handles.',
        suggestedFix: 'Batch query using IN clause or single join.',
        groundedRuleId: 2,
      },
    ],
    groundedRules: [
      {
        ruleId: 3,
        type: 'security',
        description: 'Never interpolate raw user input directly into SQL queries',
        relevanceScore: 0.98,
        groundingReason: 'Direct string concatenation in SQL statement.',
      },
      {
        ruleId: 2,
        type: 'performance',
        description: 'Cache repeated database lookups inside the request loop',
        relevanceScore: 0.94,
        groundingReason: 'Loop iteration executes repetitive query calls.',
      },
    ],
    architecture: {
      strengths: ['Compact script flow'],
      recommendations: ['Introduce repository layer', 'Use connection pooling'],
      designPatterns: ['Repository Pattern'],
      scalabilityNotes: 'Sub-linear scalability until queries are batched.',
    },
    optimizations: [
      {
        area: 'Database I/O',
        timeComplexityCurrent: 'O(N) remote I/O',
        timeComplexityTarget: 'O(1) bulk fetch',
        description: 'Batch N single queries into 1 bulk query.',
        potentialGain: '85% latency reduction',
      },
    ],
    refactoredCode: 'def fetch_data(uid: int):\n    with db.cursor() as cursor:\n        cursor.execute("SELECT * FROM t WHERE id = %s", (uid,))\n        user = cursor.fetchone()\n        cursor.execute("SELECT * FROM items WHERE user_id = %s", (uid,))\n        items = cursor.fetchall()\n    return {"user": user, "items": items}',
    executionMetrics: {
      durationMs: 780,
      tokensEvaluated: 420,
      model: 'Vertex AI / Gemini 3.7 Flash',
      ragRulesIngestedCount: 15,
    },
  },
  {
    id: 'rev_seed_02',
    timestamp: new Date(Date.now() - 7 * 86400000).toISOString(),
    userId: 'usr_sarah_chen',
    language: 'python',
    fileName: 'user_repository.py',
    codeSnippet: 'class UserRepo:\n  def get(self, uid):\n    return db.query("SELECT * FROM users WHERE id = %s", (uid,))',
    overallScore: 6.8,
    grade: 'B',
    dimensions: {
      correctness: 7.0,
      security: 7.5,
      maintainability: 6.8,
      performance: 6.5,
      architecture: 6.2,
    },
    summary: 'Marked security improvement with parameterized SQL. Minor naming conventions and resource cleanup opportunities remaining.',
    bugs: [
      {
        id: 'bug-1',
        title: 'Single-character Parameter Names',
        severity: 'low',
        category: 'formatting',
        lineRange: 'Line 2',
        description: 'Use explicit user_id instead of uid.',
        suggestedFix: 'Rename parameter to user_id for enterprise readability.',
        groundedRuleId: 1,
      },
    ],
    groundedRules: [
      {
        ruleId: 1,
        type: 'formatting',
        description: 'Avoid single-character variable names — they hurt readability',
        relevanceScore: 0.91,
        groundingReason: 'Identified single-character parameter "uid".',
      },
    ],
    architecture: {
      strengths: ['Repository class encapsulation', 'Parameterized SQL queries'],
      recommendations: ['Add context manager for database connection cleanup', 'Add type annotations'],
      designPatterns: ['Repository Pattern'],
      scalabilityNotes: 'Good single-row query performance.',
    },
    optimizations: [
      {
        area: 'Connection Lifecycle',
        description: 'Use context manager for connection handle closure.',
        potentialGain: 'Prevents pool starvation',
      },
    ],
    refactoredCode: 'class UserRepository:\n    def get_user_by_id(self, user_id: int) -> dict | None:\n        with get_db_connection() as conn:\n            with conn.cursor() as cursor:\n                cursor.execute("SELECT id, name, email FROM users WHERE id = %s", (user_id,))\n                return cursor.fetchone()',
    executionMetrics: {
      durationMs: 820,
      tokensEvaluated: 560,
      model: 'Vertex AI / Gemini 3.7 Flash',
      ragRulesIngestedCount: 15,
    },
  },
  {
    id: 'rev_seed_03',
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
    userId: 'usr_sarah_chen',
    language: 'typescript',
    fileName: 'accountService.ts',
    codeSnippet: 'export async function getAccountDetails(accountId: string) {\n  const user = await db.users.findById(accountId);\n  return user;\n}',
    overallScore: 8.9,
    grade: 'A',
    dimensions: {
      correctness: 9.0,
      security: 9.2,
      maintainability: 9.0,
      performance: 8.5,
      architecture: 8.8,
    },
    summary: 'Exceptional progress! Clean architecture, strong typing, zero security flaws, and full adherence to organizational rule standards.',
    bugs: [],
    groundedRules: [],
    architecture: {
      strengths: ['Idiomatic async/await', 'Descriptive variable naming', 'Clean domain boundary'],
      recommendations: ['Add unit test coverage and circuit breaker on external dependencies'],
      designPatterns: ['Service Layer Pattern'],
      scalabilityNotes: 'Horizontally scalable stateless service pattern.',
    },
    optimizations: [],
    refactoredCode: 'export async function getAccountDetails(accountId: string): Promise<AccountDetails | null> {\n  return db.users.findById(accountId);\n}',
    executionMetrics: {
      durationMs: 640,
      tokensEvaluated: 610,
      model: 'Vertex AI / Gemini 3.7 Flash',
      ragRulesIngestedCount: 15,
    },
  },
];

export function getStoredRules(): HistoricalRule[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RULES);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load stored rules:', e);
  }
  return INITIAL_RULES;
}

export function saveStoredRules(rules: HistoricalRule[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(rules));
  } catch (e) {
    console.error('Failed to save rules to storage:', e);
  }
}

export function getStoredReviews(): CodeReviewResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load reviews history:', e);
  }
  return INITIAL_SEED_REVIEWS;
}

export function saveStoredReviews(reviews: CodeReviewResult[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  } catch (e) {
    console.error('Failed to save reviews:', e);
  }
}

export function getStoredActiveUser(): UserSession {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load active user:', e);
  }
  return DEFAULT_USERS[0];
}

export function saveStoredActiveUser(user: UserSession): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save active user:', e);
  }
}
