import React from 'react';
import { 
  Code2, 
  Database, 
  TrendingUp, 
  Server, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  ChevronDown,
  UserCheck
} from 'lucide-react';
import { UserSession } from '../types';
import { DEFAULT_USERS } from '../utils/storage';

interface NavbarProps {
  activeTab: 'reviewer' | 'historical' | 'growth' | 'architecture';
  setActiveTab: (tab: 'reviewer' | 'historical' | 'growth' | 'architecture') => void;
  currentUser: UserSession;
  setCurrentUser: (user: UserSession) => void;
  activeRulesCount: number;
  reviewsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  setCurrentUser,
  activeRulesCount,
  reviewsCount,
}) => {
  const [showUserDropdown, setShowUserDropdown] = React.useState(false);

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & 24/7 Status */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-sm ring-1 ring-blue-500/20">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-semibold text-slate-900 tracking-tight">
                  The 24/7 Intelligent Code Reviewer
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  24/7 Always-On
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Multi-Language Reviews • 1–10 Quality Rubrics • RAG Grounded Learning
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="flex items-center space-x-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
            <button
              id="tab-reviewer-btn"
              onClick={() => setActiveTab('reviewer')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'reviewer'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Review Engine</span>
            </button>

            <button
              id="tab-historical-btn"
              onClick={() => setActiveTab('historical')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'historical'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Historical Learning</span>
              <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 text-[10px] rounded-full font-bold">
                {activeRulesCount}
              </span>
            </button>

            <button
              id="tab-growth-btn"
              onClick={() => setActiveTab('growth')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'growth'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Growth & History</span>
              {reviewsCount > 0 && (
                <span className="px-1.5 py-0.2 bg-slate-200 text-slate-700 text-[10px] rounded-full font-bold">
                  {reviewsCount}
                </span>
              )}
            </button>

            <button
              id="tab-architecture-btn"
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'architecture'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>GCP Architecture</span>
            </button>
          </nav>

          {/* User Profile & Auth Session */}
          <div className="relative">
            <button
              id="user-menu-btn"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2.5 p-1.5 pl-2 pr-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors bg-white"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-300"
              />
              <div className="text-left hidden md:block">
                <div className="text-xs font-semibold text-slate-800 leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {currentUser.role}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserDropdown && (
              <div 
                id="user-dropdown-menu"
                className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Authenticated Session (Firebase Auth)
                  </p>
                  <p className="text-xs font-medium text-slate-800 mt-1">{currentUser.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded-md">
                    {currentUser.tier}
                  </span>
                </div>

                <div className="px-3 py-2">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Switch Test Developer Account
                  </p>
                  <div className="space-y-1">
                    {DEFAULT_USERS.map((user) => (
                      <button
                        key={user.userId}
                        onClick={() => {
                          setCurrentUser(user);
                          setShowUserDropdown(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-2 py-1.5 text-left rounded-lg text-xs transition-colors ${
                          user.userId === currentUser.userId
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-medium">{user.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">{user.role}</p>
                        </div>
                        {user.userId === currentUser.userId && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
