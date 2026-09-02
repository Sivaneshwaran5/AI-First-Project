import React, { useState } from 'react';
import {
  Search,
  User,
  Bot,
  Sparkles,
  Smile,
  Meh,
  Frown,
  Copy,
  Check,
  Filter,
  Play,
  Volume2
} from 'lucide-react';

export default function TranscriptViewer({ transcript = [], audioUrl = '' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL'); // 'ALL' | 'Sales Rep' | 'Prospect'
  const [copiedIndex, setCopiedIndex] = useState(null);

  const filteredTurns = transcript.filter((turn) => {
    const matchesRole =
      roleFilter === 'ALL' ||
      (roleFilter === 'Sales Rep' && turn.role === 'Sales Rep') ||
      (roleFilter === 'Prospect' && turn.role === 'Prospect');

    const matchesSearch =
      !searchTerm.trim() ||
      turn.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      turn.speaker.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesRole && matchesSearch;
  });

  const handleCopyText = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getSentimentBadge = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <Smile className="w-3 h-3" />
            <span>Positive</span>
          </span>
        );
      case 'negative':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <Frown className="w-3 h-3" />
            <span>Objection / Risk</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Meh className="w-3 h-3" />
            <span>Neutral</span>
          </span>
        );
    }
  };

  const highlightMatch = (text, term) => {
    if (!term.trim()) return text;
    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <mark key={i} className="bg-amber-400/30 text-amber-200 px-1 py-0.5 rounded font-medium">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="space-y-4">
      {/* Audio Player Header if audioUrl exists */}
      {audioUrl && (
        <div className="p-4 rounded-2xl bg-dark-900 border border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Volume2 className="w-4 h-4 text-brand-400" />
            <span>Audio Playback:</span>
          </div>
          <audio src={audioUrl} controls className="w-full max-w-md h-9 rounded-lg" />
        </div>
      )}

      {/* Transcript Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-dark-900/80 border border-white/10">
        {/* Search inside transcript */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search dialogue keywords..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-dark-800 border border-white/10 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <span className="text-[11px] text-slate-400 font-medium mr-1 hidden md:inline">Speaker:</span>
          {['ALL', 'Sales Rep', 'Prospect'].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                roleFilter === role
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-dark-800 hover:bg-dark-750 text-slate-400 hover:text-slate-200 border border-white/5'
              }`}
            >
              {role === 'ALL' ? 'All Speakers' : role}
            </button>
          ))}
        </div>
      </div>

      {/* Transcript Turns List */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
        {filteredTurns.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-dark-900/50 border border-white/5 text-slate-500 text-xs">
            No dialogue turns match your search filter.
          </div>
        ) : (
          filteredTurns.map((turn, idx) => {
            const isRep = turn.role === 'Sales Rep';

            return (
              <div
                key={turn._id || idx}
                className={`p-4 rounded-2xl border transition-all duration-200 ${
                  isRep
                    ? 'bg-dark-900/90 border-brand-500/20 hover:border-brand-500/40 ml-0 sm:mr-8'
                    : 'bg-dark-850/90 border-cyan-500/20 hover:border-cyan-500/40 mr-0 sm:ml-8'
                }`}
              >
                {/* Turn Header */}
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isRep
                          ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      {turn.speaker ? turn.speaker.charAt(0) : isRep ? 'R' : 'P'}
                    </div>
                    <span className="text-xs font-bold text-slate-200">{turn.speaker}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        isRep
                          ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                          : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      }`}
                    >
                      {turn.role}
                    </span>
                    {turn.timestamp && (
                      <span className="font-mono text-[10px] text-slate-500 bg-dark-800 px-1.5 py-0.5 rounded">
                        {turn.timestamp}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {getSentimentBadge(turn.sentiment)}
                    <button
                      onClick={() => handleCopyText(turn.text, idx)}
                      title="Copy Quote"
                      className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Turn Body Text */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {highlightMatch(turn.text, searchTerm)}
                </p>

                {/* Turn Intent Score footer if present */}
                {turn.intentScore !== undefined && turn.intentScore > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Buyer Intent Level at this turn:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-dark-750 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${
                            turn.intentScore >= 80
                              ? 'bg-emerald-400'
                              : turn.intentScore >= 60
                              ? 'bg-brand-400'
                              : 'bg-amber-400'
                          }`}
                          style={{ width: `${turn.intentScore}%` }}
                        ></div>
                      </div>
                      <span className="font-mono font-semibold text-white">{turn.intentScore}%</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
