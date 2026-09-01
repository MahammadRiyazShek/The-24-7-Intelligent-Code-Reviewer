/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CodeEditorPanel } from './components/CodeEditorPanel';
import { ReviewResultView } from './components/ReviewResultView';
import { HistoricalLearningView } from './components/HistoricalLearningView';
import { GrowthAnalyticsView } from './components/GrowthAnalyticsView';
import { GcpArchitectureView } from './components/GcpArchitectureView';
import { 
  CodeReviewResult, 
  HistoricalRule, 
  SupportedLanguage, 
  UserSession 
} from './types';
import { 
  getStoredRules, 
  saveStoredRules, 
  getStoredReviews, 
  saveStoredReviews, 
  getStoredActiveUser, 
  saveStoredActiveUser 
} from './utils/storage';
import { SAMPLE_SNIPPETS } from './data/sampleSnippets';
import { INITIAL_RULES } from './data/initialRules';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'reviewer' | 'historical' | 'growth' | 'architecture'>('reviewer');
  const [currentUser, setCurrentUser] = useState<UserSession>(getStoredActiveUser());
  const [rules, setRules] = useState<HistoricalRule[]>(getStoredRules());
  const [reviews, setReviews] = useState<CodeReviewResult[]>(getStoredReviews());

  // Active editor state
  const [code, setCode] = useState<string>(SAMPLE_SNIPPETS[0].code);
  const [language, setLanguage] = useState<SupportedLanguage>(SAMPLE_SNIPPETS[0].language);
  const [fileName, setFileName] = useState<string>(SAMPLE_SNIPPETS[0].fileName);
  const [isLoadingReview, setIsLoadingReview] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<CodeReviewResult | null>(reviews[0] || null);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync to local storage
  const handleUpdateRules = (newRules: HistoricalRule[]) => {
    setRules(newRules);
    saveStoredRules(newRules);
    showToast(`Updated historical rules dataset (${newRules.length} rules active).`, 'success');
  };

  const handleResetRules = () => {
    setRules(INITIAL_RULES);
    saveStoredRules(INITIAL_RULES);
    showToast('Reset to enterprise default historical rules dataset.', 'info');
  };

  const handleSwitchUser = (user: UserSession) => {
    setCurrentUser(user);
    saveStoredActiveUser(user);
    showToast(`Switched active developer profile to ${user.name}.`, 'info');
  };

  // Execute Code Review
  const handleRunReview = async () => {
    if (!code.trim()) {
      showToast('Please provide source code to evaluate.', 'error');
      return;
    }

    setIsLoadingReview(true);
    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          fileName,
          userId: currentUser.userId,
          rules,
        }),
      });

      if (!response.ok) {
        throw new Error(`Review failed with HTTP status ${response.status}`);
      }

      const data: CodeReviewResult = await response.json();
      setCurrentResult(data);

      // Save to longitudinal session reviews
      const updatedReviews = [data, ...reviews];
      setReviews(updatedReviews);
      saveStoredReviews(updatedReviews);

      showToast(`Evaluation completed! Standardized Quality Rating: ${data.overallScore}/10 (Grade ${data.grade})`, 'success');
    } catch (err: any) {
      console.error('Code review error:', err);
      showToast(`Evaluation notice: ${err.message || 'An error occurred during evaluation.'}`, 'error');
    } finally {
      setIsLoadingReview(false);
    }
  };

  // Apply refactored code to the editor
  const handleApplyRefactoredCode = (refactoredCode: string) => {
    setCode(refactoredCode);
    showToast('Applied refactored code to the active editor.', 'success');
    if (activeTab !== 'reviewer') {
      setActiveTab('reviewer');
    }
  };

  // Select a historical review from Growth view
  const handleSelectHistoricalReview = (review: CodeReviewResult) => {
    setCurrentResult(review);
    setCode(review.codeSnippet);
    setLanguage(review.language);
    setFileName(review.fileName || `submission.${review.language}`);
    setActiveTab('reviewer');
    showToast(`Loaded review #${review.id} into active reviewer view.`, 'info');
  };

  const activeRulesCount = rules.filter((r) => r.enabled !== false).length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        setCurrentUser={handleSwitchUser}
        activeRulesCount={activeRulesCount}
        reviewsCount={reviews.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Tab 1: Review Engine */}
        {activeTab === 'reviewer' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Code Editor & Selector (5 cols on lg) */}
              <div className="lg:col-span-5 h-full">
                <CodeEditorPanel
                  code={code}
                  setCode={setCode}
                  language={language}
                  setLanguage={setLanguage}
                  fileName={fileName}
                  setFileName={setFileName}
                  isLoading={isLoadingReview}
                  onRunReview={handleRunReview}
                  activeRulesCount={activeRulesCount}
                />
              </div>

              {/* Right Column: Review Results & Score Cards (7 cols on lg) */}
              <div className="lg:col-span-7 h-full">
                <ReviewResultView
                  result={currentResult}
                  isLoading={isLoadingReview}
                  onApplyRefactoredCode={handleApplyRefactoredCode}
                />
              </div>

            </div>
          </div>
        )}

        {/* Tab 2: Historical Learning & Ingestion */}
        {activeTab === 'historical' && (
          <HistoricalLearningView
            rules={rules}
            onUpdateRules={handleUpdateRules}
            onResetRules={handleResetRules}
          />
        )}

        {/* Tab 3: Growth & Session History */}
        {activeTab === 'growth' && (
          <GrowthAnalyticsView
            currentUser={currentUser}
            reviews={reviews}
            onSelectReview={handleSelectHistoricalReview}
          />
        )}

        {/* Tab 4: GCP Architecture & Approach Note */}
        {activeTab === 'architecture' && (
          <GcpArchitectureView />
        )}

      </main>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold ${
            toastMessage.type === 'error'
              ? 'bg-rose-900 text-white border-rose-700'
              : toastMessage.type === 'info'
              ? 'bg-indigo-900 text-white border-indigo-700'
              : 'bg-slate-900 text-white border-slate-700'
          }`}>
            {toastMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : toastMessage.type === 'info' ? (
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Footer Status */}
      <footer className="border-t border-slate-200 bg-white py-3 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>The 24/7 Intelligent Code Reviewer • Always-On Multi-Language Evaluation</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Powered by Vertex AI (Gemini 3.7 Flash) & BigQuery Historical RAG Grounding
          </div>
        </div>
      </footer>

    </div>
  );
}
