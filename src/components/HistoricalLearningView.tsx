import React, { useState } from 'react';
import { 
  Database, 
  Upload, 
  Plus, 
  Search, 
  Check, 
  Trash2, 
  RefreshCw, 
  ShieldAlert, 
  Zap, 
  Code2, 
  Layers, 
  Sparkles,
  FileSpreadsheet,
  AlertCircle,
  Cpu,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { HistoricalRule } from '../types';
import { INITIAL_HISTORICAL_CSV, parseCsvToRules } from '../data/initialRules';

interface HistoricalLearningViewProps {
  rules: HistoricalRule[];
  onUpdateRules: (newRules: HistoricalRule[]) => void;
  onResetRules: () => void;
}

export const HistoricalLearningView: React.FC<HistoricalLearningViewProps> = ({
  rules,
  onUpdateRules,
  onResetRules,
}) => {
  const [csvInput, setCsvInput] = useState<string>(INITIAL_HISTORICAL_CSV);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRuleType, setNewRuleType] = useState('security');
  const [newRuleDesc, setNewRuleDesc] = useState('');
  const [ingestStatus, setIngestStatus] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Parse and ingest CSV
  const handleIngestCsv = () => {
    setIsProcessing(true);
    setIngestStatus('Parsing schema <id>, <type>, <description> & embedding in Vertex AI Vector Search...');

    setTimeout(() => {
      try {
        const parsed = parseCsvToRules(csvInput);
        if (parsed.length === 0) {
          setIngestStatus('Error: No valid rules parsed. Check CSV formatting.');
          setIsProcessing(false);
          return;
        }

        onUpdateRules(parsed);
        setIngestStatus(`Successfully indexed ${parsed.length} rules into BigQuery & Vertex AI Vector Search!`);
        setIsProcessing(false);
      } catch (err: any) {
        setIngestStatus(`Ingestion failed: ${err.message}`);
        setIsProcessing(false);
      }
    }, 600);
  };

  // Handle file drop/upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setCsvInput(content);
      }
    };
    reader.readAsText(file);
  };

  // Toggle rule state
  const handleToggleRule = (id: string | number) => {
    const updated = rules.map((r) =>
      r.id === id ? { ...r, enabled: r.enabled === false ? true : false } : r
    );
    onUpdateRules(updated);
  };

  // Delete rule
  const handleDeleteRule = (id: string | number) => {
    const updated = rules.filter((r) => r.id !== id);
    onUpdateRules(updated);
  };

  // Add individual rule
  const handleAddIndividualRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleDesc.trim()) return;

    const newId = rules.length > 0 ? Math.max(...rules.map((r) => Number(r.id) || 0)) + 1 : 1;
    const newRule: HistoricalRule = {
      id: newId,
      type: newRuleType,
      description: newRuleDesc.trim(),
      enabled: true,
      timesApplied: 0,
    };

    const updated = [newRule, ...rules];
    onUpdateRules(updated);
    setNewRuleDesc('');
    setShowAddModal(false);
  };

  // Filter rules
  const filteredRules = rules.filter((r) => {
    const matchesSearch =
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(r.id).includes(searchQuery);
    const matchesType = selectedType === 'all' || r.type.toLowerCase() === selectedType.toLowerCase();
    return matchesSearch && matchesType;
  });

  const ruleTypes = Array.from(new Set(rules.map((r) => r.type.toLowerCase())));

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'security':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />;
      case 'performance':
        return <Zap className="w-3.5 h-3.5 text-amber-500" />;
      case 'formatting':
        return <Code2 className="w-3.5 h-3.5 text-blue-500" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-purple-500" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Historical Learning Engine & CSV Ingestion
              </h2>
              <p className="text-xs text-slate-600 max-w-2xl mt-1 leading-relaxed">
                Ingest historical review datasets conforming to schema <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-indigo-700 font-semibold">&lt;id&gt;, &lt;type&gt;, &lt;description&gt;</code>. Rules are embedded in Vertex AI Vector Search and synced to BigQuery for continuous RAG grounding across all code reviews.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="open-add-rule-btn"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Rule</span>
            </button>

            <button
              id="reset-rules-btn"
              onClick={onResetRules}
              title="Reset to default dataset"
              className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-medium transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        {/* GCP Engine Pipeline Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
              BQ
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-800">BigQuery Pattern Store</div>
              <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {rules.length} Rules Partitioned
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
              VS
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-800">Vertex Vector Search</div>
              <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Dense Text Embeddings Indexed
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
              RAG
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-800">Gemini 3.7 Flash Grounding</div>
              <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Live Ingestion Active
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Workspace: CSV Ingestion Area + Live Indexed Rules Catalog */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: CSV Ingestion Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
                CSV Schema Ingestion
              </h3>
              
              <label className="cursor-pointer text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                <Upload className="w-3 h-3" />
                <span>Upload .csv File</span>
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <p className="text-xs text-slate-500 mb-2">
              Paste custom CSV or edit directly. Must follow format:
              <br />
              <code className="text-[11px] font-mono text-indigo-700 font-bold">id, type, description</code>
            </p>

            <textarea
              id="csv-textarea"
              rows={12}
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              className="w-full p-3 font-mono text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-500 leading-relaxed resize-none"
              spellCheck={false}
            />

            {ingestStatus && (
              <div className={`mt-3 p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                ingestStatus.includes('Error') || ingestStatus.includes('failed')
                  ? 'bg-rose-50 text-rose-800 border border-rose-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}>
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="leading-tight">{ingestStatus}</span>
              </div>
            )}

            <button
              id="ingest-csv-btn"
              disabled={isProcessing || !csvInput.trim()}
              onClick={handleIngestCsv}
              className="w-full mt-3 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              {isProcessing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Embedding & Indexing Rules...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                  <span>Ingest & Index Dataset</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Indexed Historical Rules Table (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="rules-search-input"
                  type="text"
                  placeholder="Search historical rules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
                <button
                  onClick={() => setSelectedType('all')}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                    selectedType === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({rules.length})
                </button>
                {ruleTypes.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedType(t)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium capitalize transition-colors ${
                      selectedType === t
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Rules List */}
            <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
              {filteredRules.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-500">No matching historical rules found.</p>
                </div>
              ) : (
                filteredRules.map((rule) => (
                  <div
                    key={rule.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      rule.enabled === false
                        ? 'bg-slate-50/70 border-slate-200 opacity-60'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                          #{rule.id}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            {getTypeIcon(rule.type)}
                            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded-sm">
                              {rule.type}
                            </span>
                            {rule.enabled === false && (
                              <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded-sm">
                                Disabled
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-800 font-medium leading-relaxed">
                            {rule.description}
                          </p>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleToggleRule(rule.id)}
                          title={rule.enabled === false ? 'Enable rule for RAG' : 'Disable rule'}
                          className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                            rule.enabled === false
                              ? 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteRule(rule.id)}
                          title="Remove rule"
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Add Custom Rule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Add New Historical Learning Rule
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Add a specialized organizational standard to ground future code reviews.
            </p>

            <form onSubmit={handleAddIndividualRule} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rule Category / Type
                </label>
                <select
                  value={newRuleType}
                  onChange={(e) => setNewRuleType(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
                >
                  <option value="security">Security</option>
                  <option value="performance">Performance</option>
                  <option value="formatting">Formatting & Naming</option>
                  <option value="architecture">Architecture & Patterns</option>
                  <option value="reliability">Reliability & Resource Management</option>
                  <option value="maintainability">Maintainability</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rule Description
                </label>
                <textarea
                  rows={3}
                  value={newRuleDesc}
                  onChange={(e) => setNewRuleDesc(e.target.value)}
                  placeholder="e.g. Always wrap HTTP external network calls in timeout contexts..."
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs"
                >
                  Add Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
