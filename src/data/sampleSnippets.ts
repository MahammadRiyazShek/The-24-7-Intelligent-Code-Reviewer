import { SupportedLanguage } from '../types';

export interface CodeSample {
  title: string;
  language: SupportedLanguage;
  fileName: string;
  description: string;
  code: string;
}

export const SAMPLE_SNIPPETS: CodeSample[] = [
  {
    title: 'Python: Vulnerable API & N+1 Database Query Loop',
    language: 'python',
    fileName: 'user_service.py',
    description: 'Contains raw SQL string interpolation, single letter variable names (x, u, d), and repeated DB queries inside a loop.',
    code: `import sqlite3
from flask import Flask, request, jsonify

app = Flask(__name__)

def get_user_details(user_id):
    conn = sqlite3.connect("prod_users.db")
    c = conn.cursor()
    # Problematic: Raw string interpolation (SQL Injection)
    q = "SELECT * FROM users WHERE id = '" + str(user_id) + "'"
    c.execute(q)
    u = c.fetchone()
    
    # Problematic: Repeated database queries in a loop & single-letter vars
    items = []
    for x in range(10):
        # Database lookup in loop
        c.execute(f"SELECT order_id, amount FROM orders WHERE user_id = '{user_id}' AND item_idx = {x}")
        d = c.fetchall()
        for r in d:
            items.append(r)
            
    # Unclosed connection descriptor
    return {"user": u, "orders": items}

@app.route('/api/user', methods=['GET'])
def fetch():
    uid = request.args.get('id')
    res = get_user_details(uid)
    return jsonify(res)
`,
  },
  {
    title: 'TypeScript: Payment Processor with Async Leaks & Naming',
    language: 'typescript',
    fileName: 'paymentProcessor.ts',
    description: 'Demonstrates unhandled promise rejections, lack of sanitization, single-character vars (k, v, p), and missing domain layer separation.',
    code: `import express, { Request, Response } from 'express';
import { db } from './database';

const router = express.Router();

router.post('/checkout', async (req: Request, res: Response) => {
  const { u, a, c } = req.body; // Single letter vars for userId, amount, cardNumber

  // Hardcoded secrets & magic numbers
  const SECRET_KEY = "sk_live_9812491823719823";
  
  // Unhandled asynchronous error
  const user = await db.query("SELECT * FROM accounts WHERE id = " + u);
  
  if (!user) {
    res.status(404).send("User not found");
    return;
  }

  // Performing direct stripe/payment call directly in the controller presentation layer
  const p = await fetch("https://api.gateway.com/v1/charge", {
    method: "POST",
    headers: { "Authorization": \`Bearer \${SECRET_KEY}\` },
    body: JSON.stringify({ card: c, val: a })
  });

  const respData = await p.json();

  // No audit logging or structured error recovery
  res.json({ success: true, txn: respData.id });
});

export default router;
`,
  },
  {
    title: 'Go: Concurrency Goroutine Leak & Connection Pool Exhaustion',
    language: 'go',
    fileName: 'worker_pool.go',
    description: 'Goroutine channel blocking without timeout or context cancellation, unclosed HTTP responses.',
    code: `package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"time"
)

func processJobs(db *sql.DB, jobIDs []string) {
	ch := make(chan string)

	// Goroutine leak: worker sends to unbuffered channel without consumer guarantee
	for _, id := range jobIDs {
		go func(j string) {
			resp, err := http.Get("https://api.external.com/status/" + j)
			if err != nil {
				return
			}
			// Missing resp.Body.Close() leads to socket exhaustion
			
			// Hardcoded DB query in loop
			_, err = db.Exec(fmt.Sprintf("UPDATE jobs SET status = 'DONE' WHERE id = '%s'", j))
			ch <- j
		}(id)
	}

	time.Sleep(2 * time.Second)
}
`,
  },
  {
    title: 'Rust: Fragile Panic Unwraps & Vector Allocations in Hot Path',
    language: 'rust',
    fileName: 'data_parser.rs',
    description: 'Direct .unwrap() calls on external inputs causing runtime panics, and repeated heap allocations inside loop.',
    code: `use std::fs::File;
use std::io::{BufRead, BufReader};

pub fn parse_customer_records(path: &str) -> Vec<String> {
    // Dangerous unwrap on file I/O
    let file = File::open(path).unwrap();
    let reader = BufReader::new(file);
    let mut results = Vec::new();

    for line in reader.lines() {
        let raw = line.unwrap();
        // Magic delimiter string and fragile indexing
        let parts: Vec<&str> = raw.split(":::").collect();
        let name = parts[0];
        let score: i32 = parts[1].parse().unwrap(); // Panic on malformed input

        if score > 100 {
            // Unnecessary cloning and format allocation in tight loop
            let formatted = format!("HIGH_PRIORITY_USER_{}", name.to_uppercase());
            results.push(formatted);
        }
    }

    results
}
`,
  },
  {
    title: 'SQL: Unindexed Cartesian Product & Dynamic Filter Injection',
    language: 'sql',
    fileName: 'analytics_query.sql',
    description: 'Missing JOIN condition causing massive Cartesian explosion, lack of pagination, and unindexed full table scans.',
    code: `-- Unbounded analytics query without pagination
SELECT 
    u.id, 
    u.name, 
    u.email, 
    o.total_amount, 
    p.product_title
FROM users u, orders o, products p
-- Problematic: Implicit cross-join without proper ON predicates
WHERE u.status = 'ACTIVE'
  AND o.created_at >= '2025-01-01'
-- Missing index hints & ORDER BY without LIMIT clause
ORDER BY o.total_amount DESC;
`,
  },
];
