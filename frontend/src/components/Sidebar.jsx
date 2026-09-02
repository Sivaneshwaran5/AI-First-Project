import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Mic,
  BarChart3,
  CheckSquare,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Flame
} from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, exact: true },
    { name: 'Meeting Library', path: '/meetings', icon: Layers },
    { name: 'Record & Upload Studio', path: '/record', icon: Mic, badge: 'Live AI' },
    { name: 'Revenue Analytics', path: '/analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col border-r border-white/10 bg-dark-950/60 backdrop-blur-md p-4 min-h-[calc(100vh-4rem)]">
      {/* Navigation Links */}
      <div className="space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Sales Navigation
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-brand-600/20 text-brand-300 border border-brand-500/40 shadow-sm shadow-brand-500/20'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-dark-850 border border-transparent'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>{item.name}</span>
            </div>
            {item.badge && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded-md bg-brand-500/20 text-brand-400 border border-brand-500/30">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </div>

      {/* AI Pipeline Status Card */}
      <div className="mt-8 p-4 rounded-2xl glass-card border border-brand-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
          <span className="text-xs font-bold text-slate-200 flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-brand-400" />
            AI Intelligence Engine
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
          Whisper & Gemini neural models active for real-time speech diarization and sentiment tracking.
        </p>
        <div className="space-y-1.5 text-[10px] text-slate-400">
          <div className="flex items-center justify-between">
            <span>Speech-to-Text:</span>
            <span className="text-emerald-400 font-mono font-medium">Whisper v3 (Ready)</span>
          </div>
          <div className="flex items-center justify-between">
            <span>LLM Synthesis:</span>
            <span className="text-brand-300 font-mono font-medium">Gemini 2.5 / GPT-4o</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Diarization Accuracy:</span>
            <span className="text-cyan-300 font-mono font-medium">96.8%</span>
          </div>
        </div>
      </div>

      {/* Pro Tips Box */}
      <div className="mt-auto pt-6">
        <div className="p-3.5 rounded-xl bg-dark-900/80 border border-white/5 text-slate-400 text-xs">
          <div className="flex items-center gap-2 text-slate-200 font-medium mb-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Sales Tip of the Day</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            Calls with a prospect talk ratio above 55% have a <strong className="text-emerald-400 font-semibold">2.4x higher close rate</strong>.
          </p>
        </div>
      </div>
    </aside>
  );
}
