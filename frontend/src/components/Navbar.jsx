import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { meetingsAPI } from '../services/api';
import {
  Mic,
  Search,
  Sparkles,
  Database,
  User,
  LogOut,
  ChevronDown,
  Bell,
  CheckCircle2,
  TrendingUp,
  Activity,
  Plus
} from 'lucide-react';

export default function Navbar({ onRefreshData }) {
  const { user, logout, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/meetings?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSeedDemo = async () => {
    setIsSeeding(true);
    try {
      await meetingsAPI.seedDemoData();
      setSeedSuccess(true);
      if (onRefreshData) onRefreshData();
      setTimeout(() => setSeedSuccess(false), 3000);
    } catch (err) {
      console.error('Seed demo data error:', err);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleSwitchRole = async (newRole) => {
    setDropdownOpen(false);
    await demoLogin(newRole);
    if (onRefreshData) onRefreshData();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-dark-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-brand-accent p-0.5 shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-all duration-300">
              <div className="w-full h-full bg-dark-900 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-brand-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  SalesPulse
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wider bg-brand-500/20 text-brand-300 border border-brand-500/30 uppercase">
                  AI v2.5
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Voice & Deal Intelligence Platform
              </p>
            </div>
          </Link>
        </div>

        {/* Middle: Search bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search meetings, prospects, deals, objections..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-dark-900/90 border border-white/10 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20 transition-all"
            />
          </form>
        </div>

        {/* Right: Actions & User menu */}
        <div className="flex items-center gap-3">
          {/* Seed Demo Data Button */}
          <button
            onClick={handleSeedDemo}
            disabled={isSeeding}
            title="Reset and populate realistic demo sales meetings"
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
              seedSuccess
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-dark-850 hover:bg-dark-800 text-slate-300 hover:text-white border-white/10'
            }`}
          >
            {seedSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Seeded!</span>
              </>
            ) : isSeeding ? (
              <>
                <Activity className="w-3.5 h-3.5 text-brand-400 animate-spin" />
                <span>Seeding...</span>
              </>
            ) : (
              <>
                <Database className="w-3.5 h-3.5 text-brand-400" />
                <span>Demo Data</span>
              </>
            )}
          </button>

          {/* Record / Analyze CTA */}
          <Link
            to="/record"
            className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all duration-200 active:scale-95"
          >
            <Mic className="w-4 h-4 animate-pulse" />
            <span>Record / Upload</span>
          </Link>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1.5 pl-2 rounded-xl bg-dark-850 hover:bg-dark-800 border border-white/10 text-slate-200 transition-all"
            >
              <img
                src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=SalesUser'}
                alt={user?.name || 'User'}
                className="w-7 h-7 rounded-lg object-cover bg-dark-700"
              />
              <div className="hidden lg:block text-left text-xs">
                <div className="font-semibold text-slate-200 truncate max-w-[100px]">{user?.name || 'Alex Carter'}</div>
                <div className="text-[10px] text-brand-400">{user?.role || 'Sales Rep'}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-2xl bg-dark-900 border border-white/10 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <div className="px-4 py-2.5 border-b border-white/5">
                  <p className="text-xs font-semibold text-slate-200">{user?.name || 'Alex Carter'}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email || 'alex@salesai.com'}</p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-brand-500/20 text-brand-300 border border-brand-500/30">
                    {user?.role || 'Sales Rep'} • {user?.organization || 'Apex Intelligence'}
                  </span>
                </div>

                <div className="px-2 py-1.5">
                  <div className="text-[10px] font-semibold uppercase text-slate-500 px-2 py-1">Quick Switch Profile</div>
                  <button
                    onClick={() => handleSwitchRole('Sales Rep')}
                    className="w-full text-left px-2 py-1.5 text-xs text-slate-300 hover:bg-brand-500/10 hover:text-brand-300 rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span>Alex Carter (Sales Rep)</span>
                    {user?.role === 'Sales Rep' && <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />}
                  </button>
                  <button
                    onClick={() => handleSwitchRole('Sales Manager')}
                    className="w-full text-left px-2 py-1.5 text-xs text-slate-300 hover:bg-brand-500/10 hover:text-brand-300 rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span>Elena Rostova (Sales Manager)</span>
                    {user?.role === 'Sales Manager' && <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />}
                  </button>
                </div>

                <div className="border-t border-white/5 px-2 pt-1.5">
                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                      navigate('/login');
                    }}
                    className="w-full text-left px-2 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
