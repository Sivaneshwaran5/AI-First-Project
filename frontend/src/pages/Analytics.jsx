import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  Target,
  Smile,
  DollarSign,
  ShieldAlert,
  Swords,
  Layers,
  ArrowRight,
  Flame,
  CheckCircle2,
  Clock
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
  AreaChart,
  Area
} from 'recharts';

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await analyticsAPI.getDashboardStats();
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin mx-auto"></div>
        <p className="text-xs text-slate-400">Aggregating sales intelligence metrics...</p>
      </div>
    );
  }

  const stageData = stats?.dealStageDistribution || [];
  const competitors = stats?.competitorMentions || [];
  const objections = stats?.objectionsBreakdown || [];
  const topDeals = stats?.topDeals || [];

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Revenue & Sales Intelligence Analytics
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            Enterprise View
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          High-level insights across all analyzed customer conversations and sales deals
        </p>
      </div>

      {/* Top 4 Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-3xl glass-card border border-brand-500/30">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Pipeline Analyzed
          </span>
          <div className="mt-2 text-3xl font-black text-white">
            ${((stats?.totalPipelineValue || 0) / 1000).toFixed(0)}k
          </div>
          <p className="text-xs text-brand-300 mt-1">Across {stats?.totalMeetings || 0} active deals</p>
        </div>

        <div className="p-5 rounded-3xl glass-card border border-emerald-500/30">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Average Sentiment
          </span>
          <div className="mt-2 text-3xl font-black text-emerald-400">
            {stats?.avgSentimentScore || 75}%
          </div>
          <p className="text-xs text-emerald-300/80 mt-1">
            {stats?.sentimentBreakdown?.positive || 70}% positive affirmation rate
          </p>
        </div>

        <div className="p-5 rounded-3xl glass-card border border-cyan-500/30">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Buyer Intent Index
          </span>
          <div className="mt-2 text-3xl font-black text-cyan-400">
            {stats?.avgBuyerIntent || 78}%
          </div>
          <p className="text-xs text-cyan-300/80 mt-1">High purchase readiness</p>
        </div>

        <div className="p-5 rounded-3xl glass-card border border-amber-500/30">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Action Completion Rate
          </span>
          <div className="mt-2 text-3xl font-black text-amber-400">
            {stats?.actionItemsStats?.completionRate || 0}%
          </div>
          <p className="text-xs text-amber-300/80 mt-1">
            {stats?.actionItemsStats?.completed || 0} of {stats?.actionItemsStats?.total || 0} tasks closed
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deal Stage Value Distribution */}
        <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-brand-400" />
                <span>Pipeline Value by Deal Stage ($)</span>
              </h3>
              <p className="text-xs text-slate-400">Revenue volume currently progressing per funnel phase</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="stage" stroke="#64748b" fontSize={11} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip
                  formatter={(val) => [`$${val.toLocaleString()}`, 'Pipeline Value']}
                  contentStyle={{
                    backgroundColor: '#0b0f19',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {stageData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index % 2 === 0 ? '#6366f1' : '#06b6d4'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Competitor Mentions Frequency */}
        <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Swords className="w-4 h-4 text-rose-400" />
                <span>Competitor Mentions in Customer Calls</span>
              </h3>
              <p className="text-xs text-slate-400">Most frequently referenced competing vendors</p>
            </div>
          </div>

          {competitors.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-xs text-slate-500">
              No competitor mentions logged yet.
            </div>
          ) : (
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={competitors} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" stroke="#64748b" fontSize={11} />
                  <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} width={90} />
                  <Tooltip
                    formatter={(val) => [`${val} mentions`, 'Frequency']}
                    contentStyle={{
                      backgroundColor: '#0b0f19',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="#f43f5e" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Top High-Value Deal Opportunities */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Top Revenue Opportunities by Pipeline Value</span>
            </h3>
            <p className="text-xs text-slate-400">
              Highest ARR opportunities with real-time AI win probability
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-3">Client Company</th>
                <th className="pb-3">Deal Stage</th>
                <th className="pb-3">Value</th>
                <th className="pb-3">Buyer Intent</th>
                <th className="pb-3">Win Probability</th>
                <th className="pb-3">Open Tasks</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {topDeals.map((deal) => (
                <tr key={deal.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 pr-3">
                    <span className="font-bold text-white block">{deal.clientCompany}</span>
                    <span className="text-[11px] text-slate-400">{deal.clientName}</span>
                  </td>
                  <td className="py-3.5 pr-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-dark-800 text-slate-300 border border-white/10">
                      {deal.dealStage}
                    </span>
                  </td>
                  <td className="py-3.5 pr-3 font-mono font-bold text-emerald-400">
                    ${(deal.dealValue || 0).toLocaleString()}
                  </td>
                  <td className="py-3.5 pr-3 font-semibold text-cyan-400">
                    {deal.intentScore || 75}%
                  </td>
                  <td className="py-3.5 pr-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-dark-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-brand-400 h-1.5 rounded-full"
                          style={{ width: `${deal.winProbability || 70}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold text-white">{deal.winProbability || 70}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 pr-3 text-slate-400">
                    {deal.actionItemsPending} pending
                  </td>
                  <td className="py-3.5 text-right">
                    <Link
                      to={`/meetings/${deal.id}`}
                      className="px-3 py-1 rounded-lg bg-brand-600/20 text-brand-300 hover:bg-brand-600 hover:text-white border border-brand-500/30 text-xs font-semibold transition-all inline-block"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
