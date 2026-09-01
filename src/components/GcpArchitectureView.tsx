import React from 'react';
import { 
  Server, 
  Database, 
  Cpu, 
  ShieldCheck, 
  Cloud, 
  Activity, 
  Lock, 
  Repeat, 
  CheckCircle2, 
  Layers,
  ArrowRight,
  Terminal,
  FileSpreadsheet
} from 'lucide-react';

export const GcpArchitectureView: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* Technical Approach Note Card (Strictly Under 200 Words) */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-800">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Terminal className="w-4 h-4" />
          <span>Technical Approach Note • Strictly Under 200 Words</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-4">
          The 24/7 Intelligent Code Reviewer: Technical Execution Strategy
        </h2>

        {/* The Exact Under-200 Words Note from User Prompt */}
        <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700 text-sm sm:text-base leading-relaxed text-slate-200 font-normal space-y-3">
          <p>
            <strong className="text-white font-semibold">Architecture (GCP-native):</strong> Users authenticate via Firebase Authentication, submitting code through a Cloud Run front-end backed by a Cloud Functions ingestion endpoint. Submissions are stored in Cloud Storage; metadata, quality ratings (1–10), and per-user review history persist in Firestore, enabling longitudinal growth tracking.
          </p>
          <p>
            <strong className="text-white font-semibold">Evaluation Engine:</strong> A Cloud Run service orchestrates reviews using Vertex AI (Gemini) with language-aware prompts for multi-language bug detection, architectural guidance, and optimization insights, producing a standardized rubric-based score.
          </p>
          <p>
            <strong className="text-white font-semibold">Historical Learning:</strong> The historical CSV (id, type, description) is loaded into BigQuery for pattern analytics, while rule descriptions are embedded via Vertex AI Embeddings and indexed in Vertex AI Vector Search. At review time, retrieved rules ground Gemini&apos;s output (RAG), ensuring consistency with proven past findings. Cloud Scheduler triggers periodic re-embedding as new reviews accumulate, creating a continuous learning loop.
          </p>
          <p>
            <strong className="text-white font-semibold">Reliability & Scale:</strong> Pub/Sub decouples submission from analysis for always-on, burstable throughput; Cloud Monitoring and Cloud Logging provide observability; IAM and VPC Service Controls secure the pipeline end-to-end.
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            100% GCP-Native Tooling & Elements
          </span>
          <span className="font-mono text-slate-400">Word count: ~180 words</span>
        </div>
      </div>

      {/* Interactive GCP Architectural Pipeline Diagram */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1 flex items-center gap-2">
          <Server className="w-4 h-4 text-blue-600" />
          End-to-End GCP Cloud Pipeline Blueprint
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Interactive view of data ingestion, model inference, vector RAG grounding, and longitudinal persistence.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Phase 1: Authentication & Ingestion */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 relative">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center mb-3">
              1
            </div>
            <h4 className="text-xs font-bold text-blue-900 mb-1">Ingestion & Auth</h4>
            <ul className="text-xs text-blue-800 space-y-2 mt-2">
              <li className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                Firebase Auth
              </li>
              <li className="flex items-center gap-1.5 font-medium">
                <Cloud className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                Cloud Run UI / API
              </li>
              <li className="flex items-center gap-1.5 font-medium">
                <Layers className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                Cloud Functions Ingest
              </li>
              <li className="flex items-center gap-1.5 font-medium">
                <Database className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                Cloud Storage Blobs
              </li>
            </ul>
          </div>

          {/* Phase 2: Asynchronous Scale & Pub/Sub */}
          <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 relative">
            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mb-3">
              2
            </div>
            <h4 className="text-xs font-bold text-indigo-900 mb-1">Decoupled Queue</h4>
            <ul className="text-xs text-indigo-800 space-y-2 mt-2">
              <li className="flex items-center gap-1.5 font-medium">
                <Activity className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                Cloud Pub/Sub Queue
              </li>
              <li className="flex items-center gap-1.5 font-medium">
                <Repeat className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                Cloud Scheduler Loop
              </li>
              <li className="flex items-center gap-1.5 font-medium">
                <Server className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                Burstable Workers
              </li>
              <li className="flex items-center gap-1.5 font-medium">
                <Lock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                VPC Service Controls
              </li>
            </ul>
          </div>

          {/* Phase 3: Vertex AI & Vector Grounding */}
          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 relative">
            <div className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center mb-3">
              3
            </div>
            <h4 className="text-xs font-bold text-purple-900 mb-1">Vertex AI & RAG</h4>
            <ul className="text-xs text-purple-800 space-y-2 mt-2">
              <li className="flex items-center gap-1.5 font-medium">
                <Cpu className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                Vertex AI (Gemini 3.7)
              </li>
              <li className="flex items-center gap-1.5 font-medium">
                <Database className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                Vertex Vector Search
              </li>
              <li className="flex items-center gap-1.5 font-medium">
                <FileSpreadsheet className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                Vertex Embeddings
              </li>
              <li className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                1–10 Quality Rubrics
              </li>
            </ul>
          </div>

          {/* Phase 4: BigQuery & Firestore Analytics */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 relative">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mb-3">
              4
            </div>
            <h4 className="text-xs font-bold text-emerald-900 mb-1">Storage & Growth</h4>
            <ul className="text-xs text-emerald-800 space-y-2 mt-2">
              <li className="flex items-center gap-1.5 font-medium">
                <Database className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Cloud Firestore (Sessions)
              </li>
              <li className="flex items-center gap-1.5 font-medium">
                <Server className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                BigQuery Analytics
              </li>
              <li className="flex items-center gap-1.5 font-medium">
                <Activity className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Cloud Monitoring Logs
              </li>
              <li className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                IAM Least Privilege
              </li>
            </ul>
          </div>

        </div>
      </div>

    </div>
  );
};
