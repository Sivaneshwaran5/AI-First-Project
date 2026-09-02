import React from 'react';
import {
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  MessageSquare,
  Swords,
  TrendingUp,
  Percent
} from 'lucide-react';

export default function CoachingCard({ coachingInsights = {}, buyerIntent = {} }) {
  const talkRatio = coachingInsights.talkRatio || { salesRepPercent: 44, prospectPercent: 56 };
  const strengths = coachingInsights.strengths || [
    'Superb active listening during pain discovery',
    'Clear ROI articulation tailored to prospect objections',
  ];
  const improvements = coachingInsights.improvements || [
    'Could probe deeper into budget authorization chain before sharing rate card',
  ];
  const objections = buyerIntent.objections || [];
  const competitors = buyerIntent.competitorsMentioned || [];
  const signals = buyerIntent.signals || [];

  return (
    <div className="space-y-6">
      {/* Talk-to-Listen Ratio Widget */}
      <div className="p-5 rounded-3xl glass-card border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Percent className="w-4 h-4 text-brand-400" />
            <h4 className="text-sm font-bold text-white">Talk-to-Listen Ratio</h4>
          </div>
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {talkRatio.prospectPercent >= 50 ? 'Optimal Ratio Achieved' : 'Rep Talked Too Much'}
          </span>
        </div>

        <div className="w-full bg-dark-800 rounded-full h-4 overflow-hidden flex mb-3">
          <div
            className="bg-brand-500 h-full flex items-center justify-center text-[10px] font-bold text-white transition-all duration-500"
            style={{ width: `${talkRatio.salesRepPercent}%` }}
          >
            Rep {talkRatio.salesRepPercent}%
          </div>
          <div
            className="bg-cyan-400 h-full flex items-center justify-center text-[10px] font-bold text-dark-950 transition-all duration-500"
            style={{ width: `${talkRatio.prospectPercent}%` }}
          >
            Prospect {talkRatio.prospectPercent}%
          </div>
        </div>
        <p className="text-[11px] text-slate-400">
          Target: Rep 40–45% | Prospect 55–60%. Prospects who speak more than 50% of the meeting close with a 2.4x higher win probability.
        </p>
      </div>

      {/* Strengths & Improvements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="p-5 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Rep Strengths & Effective Tactics</span>
          </div>
          <ul className="space-y-2">
            {strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-200 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Opportunities for Improvement */}
        <div className="p-5 rounded-3xl bg-amber-500/5 border border-amber-500/20 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Lightbulb className="w-4 h-4" />
            <span>AI Coaching Recommendations</span>
          </div>
          <ul className="space-y-2">
            {improvements.map((imp, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-200 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Customer Objections & Recommended Counter-Responses */}
      {objections.length > 0 && (
        <div className="p-5 rounded-3xl glass-card border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <h4 className="text-sm font-bold text-white">
                Prospect Objections & Counter-Rebuttals
              </h4>
            </div>
            <span className="text-[11px] text-slate-400">
              {objections.length} Objection{objections.length > 1 ? 's' : ''} Tracked
            </span>
          </div>

          <div className="space-y-3">
            {objections.map((obj, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-dark-900 border border-white/10 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        obj.severity === 'High'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {obj.severity} Severity
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        obj.status === 'Addressed'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {obj.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs font-semibold text-slate-200">"{obj.objection}"</p>

                {obj.suggestedResponse && (
                  <div className="p-3 rounded-xl bg-dark-800/80 border border-brand-500/20 text-xs text-brand-200">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-brand-400 mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Recommended AI Counter-Strategy:
                    </p>
                    <p className="leading-relaxed">{obj.suggestedResponse}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competitors & Buying Signals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Buying Signals */}
        <div className="p-5 rounded-3xl glass-card border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>Key Buying Signals Detected</span>
          </div>
          {signals.length === 0 ? (
            <p className="text-xs text-slate-500">No explicit buying signals recorded.</p>
          ) : (
            <ul className="space-y-2">
              {signals.map((sig, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                  <span>{sig}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Competitor Mentions */}
        <div className="p-5 rounded-3xl glass-card border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
            <Swords className="w-4 h-4" />
            <span>Competitor Mentions</span>
          </div>
          {competitors.length === 0 ? (
            <p className="text-xs text-slate-500">No competitors mentioned in call dialogue.</p>
          ) : (
            <div className="flex flex-wrap gap-2 pt-1">
              {competitors.map((comp, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30"
                >
                  {comp}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
