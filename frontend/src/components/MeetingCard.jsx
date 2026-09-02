import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  DollarSign,
  Building2,
  CheckSquare,
  Sparkles,
  ArrowRight,
  Smile,
  Meh,
  Frown,
  Target
} from 'lucide-react';

export default function MeetingCard({ meeting }) {
  const sentiment = meeting.sentiment || { score: 75, overall: 'positive' };
  const intent = meeting.buyerIntent || { score: 80, level: 'High', winProbability: 75 };
  const actionItems = meeting.actionItems || [];
  const completedActions = actionItems.filter((i) => i.completed).length;

  const getSentimentIcon = (overall) => {
    switch (overall) {
      case 'positive':
        return <Smile className="w-3.5 h-3.5 text-emerald-400" />;
      case 'negative':
        return <Frown className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <Meh className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'Closing':
      case 'Won':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'Negotiation':
      case 'Proposal':
        return 'bg-brand-500/15 text-brand-300 border-brand-500/30';
      case 'Demo':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600/50';
    }
  };

  return (
    <Link
      to={`/meetings/${meeting._id}`}
      className="block p-5 rounded-3xl glass-card glass-card-hover border border-white/10 group relative overflow-hidden"
    >
      {/* Top Banner / Client info */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-white group-hover:text-brand-300 transition-colors">
              {meeting.clientCompany || 'Client Call'}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStageColor(
                meeting.dealStage
              )}`}
            >
              {meeting.dealStage || 'Demo'}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium line-clamp-1">
            {meeting.title}
          </p>
        </div>

        {/* Deal Value Pill */}
        {meeting.dealValue && (
          <div className="px-2.5 py-1 rounded-xl bg-dark-900 border border-white/10 text-xs font-mono font-bold text-emerald-400 flex items-center shrink-0">
            ${(meeting.dealValue).toLocaleString()}
          </div>
        )}
      </div>

      {/* Summary Snippet */}
      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
        {meeting.summary?.executive || 'Voice conversation analyzed and transcribed with full speaker diarization.'}
      </p>

      {/* Intelligence Metrics Row */}
      <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-dark-900/80 border border-white/5 mb-4 text-xs">
        {/* Sentiment */}
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
            Tone Sentiment
          </span>
          <div className="flex items-center gap-1.5 font-bold text-white">
            {getSentimentIcon(sentiment.overall)}
            <span>{sentiment.score || 75}%</span>
          </div>
        </div>

        {/* Buyer Intent */}
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
            Buyer Intent
          </span>
          <div className="flex items-center gap-1.5 font-bold text-cyan-400">
            <Target className="w-3.5 h-3.5" />
            <span>{intent.score || 80}%</span>
            <span className="text-[10px] text-slate-400 font-normal">({intent.level})</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-white/5">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-500" />
            {new Date(meeting.meetingDate || meeting.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
          <span className="flex items-center gap-1">
            <CheckSquare className="w-3 h-3 text-brand-400" />
            {completedActions}/{actionItems.length} Tasks
          </span>
        </div>

        <span className="flex items-center gap-1 font-semibold text-brand-400 group-hover:translate-x-1 transition-transform">
          <span>View Insights</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}
