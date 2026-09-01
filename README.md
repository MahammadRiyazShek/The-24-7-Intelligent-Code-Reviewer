# The 24/7 Intelligent Code Reviewer

An always-on, multi-language code review workspace that combines structured quality scoring, bug analysis, architecture guidance, optimization suggestions, historical-rule grounding, and refactored code generation in one browser-based interface.

The application supports two review modes:

- **AI-assisted reviews** through the Google Gemini API when `GEMINI_API_KEY` is configured.
- **Deterministic fallback reviews** through a local rule and pattern engine when no API key is available.

> This project is a developer-facing prototype. The user interface presents a GCP-oriented architecture view, while the current implementation stores review history and rules in browser `localStorage` and calls Gemini directly from the server when configured.

## Features

| Area | Capabilities |
| --- | --- |
| Review Engine | Paste or edit source code, select a language and file name, and run a structured review. |
| Quality Scoring | Generates an overall score from 1–10, a letter grade, and scores for correctness, security, maintainability, performance, and architecture. |
| Bug Analysis | Reports issue title, severity, category, line range when available, explanation, and suggested fix. |
| Historical Learning | Enables, disables, imports, and resets historical review rules used for grounding. |
| Refactoring | Returns a complete refactored-code proposal that can be applied back to the editor. |
| Architecture Guidance | Shows strengths, recommendations, design patterns, and scalability notes. |
| Optimization Insights | Describes current and target time/space complexity and estimated potential gains. |
| Growth & History | Persists reviews locally and displays historical progress and review metrics. |
| Developer Profiles | Includes switchable sample developer sessions for demonstration and testing. |
| Health Check | Provides an `/api/health` endpoint for service status and architecture metadata. |

## Supported Languages

The editor currently provides presets for **Python, TypeScript, JavaScript, Go, Rust, Java, C++, C#, SQL, Kotlin, PHP, and Ruby**. The AI review prompt is designed for multi-language analysis, including additional source formats when supplied through the API.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, TypeScript, Vite 6 |
| Styling | Tailwind CSS 4 with the Vite plugin |
| Backend | Node.js, Express, and TypeScript via `tsx` |
| AI integration | Google Gemini API through `@google/genai` |
| Visualization | Recharts |
| UI icons and motion | Lucide React and Motion |
| Client persistence | Browser `localStorage` |
| Package lockfile | Bun (`bun.lock`) |

## Prerequisites

Install the following before running the project:

- Node.js 18 or newer
- npm, pnpm, or Bun
- A Gemini API key if AI-assisted reviews are required

The application can run without a Gemini API key by using the deterministic fallback review engine.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/MahammadRiyazShek/The-24-7-Intelligent-Code-Reviewer.git
cd The-24-7-Intelligent-Code-Reviewer
```

### 2. Install dependencies

Using npm:

```bash
npm install
```

Using Bun:

```bash
bun install
```

### 3. Configure environment variables

Create a local environment file from the provided template:

```bash
cp .env.example .env
```

Set the Gemini API key in `.env`:

```env
GEMINI_API_KEY=your_gemini_api_key
```

`APP_URL` is also included in the template for hosted deployments. It is optional for local development.

> Never commit `.env` or expose your API key in client-side code. The server reads `GEMINI_API_KEY` at runtime.

### 4. Start the development server

```bash
npm run dev
```

The application is served at [http://localhost:3000](http://localhost:3000).

The development command starts the Express server with Vite middleware and enables hot module replacement unless `DISABLE_HMR=true` is set.

## Production Build

Create a production build with:

```bash
npm run build
```

This command builds the frontend with Vite and bundles the server into `dist/server.cjs`.

Start the production server with:

```bash
npm start
```

The production server listens on port `3000`.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Express/Vite development server. |
| `npm run build` | Builds the frontend and bundles the server. |
| `npm start` | Starts the bundled production server. |
| `npm run preview` | Runs Vite’s frontend preview server. |
| `npm run lint` | Runs the TypeScript compiler without emitting files. |
| `npm run clean` | Removes generated build output. |

## API Endpoints

### `GET /api/health`

Returns service status, uptime, timestamp, and the GCP architecture metadata displayed by the application.

Example:

```bash
curl http://localhost:3000/api/health
```

### `POST /api/review`

Evaluates a source-code submission. The request body accepts the following fields:

```json
{
  "code": "def greet(name):\n    return 'Hello ' + name",
  "language": "python",
  "fileName": "greetings.py",
  "userId": "usr_dev_01",
  "rules": []
}
```

The response includes the review identifier, timestamp, score, grade, dimension scores, bug reports, grounded rules, architecture guidance, optimization insights, refactored code, and execution metrics.

When `GEMINI_API_KEY` is configured, the endpoint requests a JSON-structured review from Gemini. Otherwise, it uses the local deterministic rule matcher.

### `POST /api/rules/ingest`

Accepts CSV rule data for the historical-learning view. The basic format is:

```csv
id,type,description
101,security,Never interpolate raw user input directly into SQL queries
102,performance,Cache repeated database lookups inside request loops
```

The endpoint parses the CSV content and returns the imported rules and any parsing errors. The browser stores the resulting rule set in `localStorage`.

## How to Use the Interface

1. Open the **Review Engine** tab.
2. Select a supported language and enter a file name.
3. Paste source code into the editor or load one of the built-in sample snippets.
4. Confirm the active historical-rule count.
5. Select **Review Code Now**.
6. Inspect the score, grade, issue list, grounded rules, architecture notes, and optimization recommendations.
7. Apply the proposed refactoring to the editor when appropriate.
8. Use **Growth & History** to revisit previous reviews and compare progress.
9. Use **Historical Learning** to import, enable, disable, or reset review rules.
10. Open **GCP Architecture** to review the intended production-oriented architecture and implementation notes.

## Persistence and Data Handling

The current frontend stores the following data in the browser’s `localStorage`:

- Historical review rules
- Review history
- Active developer profile

Clearing browser storage resets the application to its seeded demo data. Review requests are sent to the local Express API. When Gemini is enabled, source code is included in the request sent from the server to the configured Gemini API, so do not submit confidential code unless your organization permits that data flow.

## Project Structure

```text
.
├── server.ts                         # Express server, review API, health check, and rule ingestion
├── src/
│   ├── App.tsx                       # Main application shell and tab routing
│   ├── components/                   # Editor, result, analytics, architecture, and navigation views
│   ├── data/                         # Seed rules and sample code snippets
│   ├── utils/storage.ts              # Browser persistence and seeded sessions/reviews
│   ├── types.ts                      # Shared TypeScript domain types
│   ├── index.css                     # Global styles
│   └── main.tsx                      # React entrypoint
├── .env.example                      # Environment variable template
├── package.json                      # Scripts and dependencies
├── tsconfig.json                     # TypeScript configuration
├── vite.config.ts                    # Vite and Tailwind configuration
└── README.md                         # Project documentation
```

## Validation

Before opening a pull request, run:

```bash
npm run lint
npm run build
```

You can also verify the health endpoint after starting the server:

```bash
curl http://localhost:3000/api/health
```

## Limitations

The current implementation is intentionally self-contained for local and demo use. It does not yet include production authentication, a server-side database, a real vector-search index, asynchronous ingestion workers, rate limiting, repository webhooks, or CI-based pull-request integration. The GCP architecture view documents a target direction rather than confirming that each named GCP service is provisioned by this repository.

The deterministic fallback engine is useful for offline testing, but it is pattern-based and should not be treated as a substitute for a full static-analysis toolchain or expert review.

## Security Notes

- Keep Gemini credentials in environment variables or a managed secrets store.
- Do not commit `.env` files or API keys.
- Treat submitted source code as sensitive data.
- Add authentication, authorization, request validation, rate limiting, and audit logging before exposing the API publicly.
- Review AI-generated refactoring before merging it into production code.

## License

The source files include Apache-2.0 license headers where applicable. If you plan to distribute or publish this project, add a repository-level `LICENSE` file with the exact license terms you intend to use.

## References

[1]: https://github.com/MahammadRiyazShek/The-24-7-Intelligent-Code-Reviewer "The 24/7 Intelligent Code Reviewer repository"
[2]: https://vite.dev/guide/ "Vite documentation"
[3]: https://react.dev/learn "React documentation"
[4]: https://ai.google.dev/gemini-api/docs "Google Gemini API documentation"
[5]: https://expressjs.com/en/starter/hello-world.html "Express documentation"
