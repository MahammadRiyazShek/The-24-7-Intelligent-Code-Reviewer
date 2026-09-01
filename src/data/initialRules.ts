import { HistoricalRule } from '../types';

export const INITIAL_HISTORICAL_CSV = `id, type, description
1, formatting, Avoid single-character variable names — they hurt readability
2, performance, Cache repeated database lookups inside the request loop
3, security, Never interpolate raw user input directly into SQL queries
4, security, Validate and sanitize all external payload inputs before processing
5, performance, Avoid O(N^2) nested loops when a hash lookup can provide O(N) lookup
6, reliability, Always close open file descriptors and release database connection pool handles in finally or defer blocks
7, architecture, Separate business domain logic from HTTP controller presentation layers
8, formatting, Enforce consistent snake_case or camelCase naming matching the host language idiomatic style
9, performance, Use pagination or cursor-based streaming for unbounded database query result sets
10, security, Never log plaintext secrets, tokens, passwords, or personal identifying information (PII)
11, architecture, Favor dependency injection and interfaces over hard-coded concrete instantiations for testability
12, reliability, Handle asynchronous promise rejections and unchecked error returns explicitly
13, performance, Debounce or throttle high-frequency client side events and batch bulk database mutations
14, security, Use constant-time comparison algorithms when verifying cryptographic signatures or hashes
15, maintainability, Extract magic numbers and hardcoded constant strings into centralized enum or config definitions`;

export function parseCsvToRules(csvContent: string): HistoricalRule[] {
  const lines = csvContent.trim().split('\n');
  const rules: HistoricalRule[] = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) continue;

    // Check if header line
    if (i === 0 && (rawLine.toLowerCase().includes('id') && rawLine.toLowerCase().includes('type'))) {
      continue;
    }

    // Split by comma with basic CSV handling
    const parts = rawLine.split(/,(.+)/);
    if (parts.length < 2) continue;

    const idPart = parts[0].trim();
    const rest = parts[1].trim();
    const secondSplit = rest.split(/,(.+)/);

    if (secondSplit.length >= 2) {
      const typePart = secondSplit[0].trim().toLowerCase();
      const descPart = secondSplit[1].trim().replace(/^["']|["']$/g, '');
      rules.push({
        id: isNaN(Number(idPart)) ? idPart : Number(idPart),
        type: typePart,
        description: descPart,
        enabled: true,
        timesApplied: 0,
      });
    } else if (secondSplit.length === 1) {
      // Fallback
      rules.push({
        id: isNaN(Number(idPart)) ? idPart : Number(idPart),
        type: 'general',
        description: secondSplit[0].trim(),
        enabled: true,
        timesApplied: 0,
      });
    }
  }

  return rules;
}

export const INITIAL_RULES: HistoricalRule[] = parseCsvToRules(INITIAL_HISTORICAL_CSV);
