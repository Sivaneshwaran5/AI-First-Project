import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Smile, Meh, Frown, TrendingUp, Target, ShieldCheck } from 'lucide-react';

export default function SentimentChart({ sentiment = {}, buyerIntent = {} }) {
  const breakdown = sentiment.breakdown || { positive: 65, neutral: 25, negative: 10 };
  const timeline = sentiment.timeline && sentiment.timeline.length > 0
    ? sentiment.timeline
    : [
        { minute: 1, sentimentScore: 60, topic: 'Introduction' },
        { minute: 5, sentimentScore: 75, topic: 'Pain Points' },
        { minute: 10, sentimentScore: 70, topic: 'Architecture' },
        { minute: 15, sentimentScore: 85, topic: 'Pricing & Pilot' },
        { minute: 20, sentimentScore: 92, topic: 'Next Steps' },
      ];

  const pieData = [
    { name: 'Positive Sentiment', value: breakdown.positive || 0, color: '#10b981' },
    { name: 'Neutral Inquiry', value: breakdown.neutral || 0, color: '#f59e0b' },
    { name: 'Objection / Friction', value: breakdown.negative || 0, color: '#ef4444' },
  ];

  const overallScore = sentiment.score !== undefined ? sentiment.score : 75;
  const buyerScore = buyerIntent.score || 78;
  const winProb = buyerIntent.winProbability || 72;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 rounded-xl bg-dark-900 border border-white/10 shadow-xl text-xs space-y-1">
          <p className="font-bold text-white">Minute {data.minute}:00</p>
          {data.topic && <p className="text-slate-400">Topic: {data.topic}</p>}
          <p className="font-semibold text-emerald-400">
            Sentiment Score: {data.sentimentScore}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Top 3 Metric Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Overall Sentiment Score */}
        <div className="p-4 rounded-2xl bg-dark-900 border border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Overall Sentiment</span>
            <Smile className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{overallScore}%</span>
            <span
              className={`text-xs font-semibold ${
                overallScore >= 70
                  ? 'text-emerald-400'
                  : overallScore >= 50
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {sentiment.overall ? sentiment.overall.toUpperCase() : 'POSITIVE'}
            </span>
          </div>
          <div className="w-full bg-dark-800 rounded-full h-2 mt-3 overflow-hidden relative">
            <div
              className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-1000 ease-out"
              style={{ width: `${overallScore}%` }}
            ></div>
          </div>
        </div>

        {/* Buyer Intent Score */}
        <div className="p-4 rounded-2xl bg-dark-900 border border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Buyer Intent Score</span>
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{buyerScore}%</span>
            <span className="text-xs font-semibold text-cyan-400">
              {buyerIntent.level || 'High'} Intent
            </span>
          </div>
          <div className="w-full bg-dark-800 rounded-full h-2 mt-3 overflow-hidden relative">
            <div
              className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-brand-500 to-cyan-400 transition-all duration-1000 ease-out"
              style={{ width: `${buyerScore}%` }}
            ></div>
          </div>
        </div>

        {/* Win Probability */}
        <div className="p-4 rounded-2xl bg-dark-900 border border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Predicted Win Probability</span>
            <TrendingUp className="w-4 h-4 text-brand-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{winProb}%</span>
            <span className="text-xs font-semibold text-brand-400">
              {winProb >= 80 ? 'Hot Deal' : winProb >= 60 ? 'High Likelihood' : 'Nurturing'}
            </span>
          </div>
          <div className="w-full bg-dark-800 rounded-full h-2 mt-3 overflow-hidden relative">
            <div
              className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-cyan-400 to-brand-400 transition-all duration-1000 ease-out"
              style={{ width: `${winProb}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sentiment Timeline Area Chart */}
        <div className="lg:col-span-2 p-5 rounded-3xl glass-card border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-white">Sentiment Progression Curve</h4>
              <p className="text-xs text-slate-400">Moment-by-moment tone across the meeting</p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              AI Monitored
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="minute"
                  stroke="#64748b"
                  fontSize={11}
                  tickFormatter={(val) => `${val}m`}
                />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="sentimentScore"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#sentimentGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sentiment Breakdown Donut Chart */}
        <div className="p-5 rounded-3xl glass-card border border-white/10 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-white mb-1">Tone Breakdown</h4>
            <p className="text-xs text-slate-400 mb-2">Positive vs Neutral vs Objections</p>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [`${val}%`, '']}
                  contentStyle={{
                    backgroundColor: '#0b0f19',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-xs pt-2 border-t border-white/5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                Positive Affirmations
              </span>
              <span className="font-bold text-emerald-400">{breakdown.positive}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                Neutral Inquiries
              </span>
              <span className="font-bold text-amber-400">{breakdown.neutral}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                Objections / Concerns
              </span>
              <span className="font-bold text-rose-400">{breakdown.negative}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
