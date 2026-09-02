import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { meetingsAPI, analyticsAPI } from '../services/api';
import StatCard from '../components/StatCard';
import MeetingCard from '../components/MeetingCard';
import {
  Mic,
  UploadCloud,
  Sparkles,
  TrendingUp,
  Target,
  Smile,
  CheckSquare,
  DollarSign,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Activity,
  Calendar
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell
} from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentMeetings, setRecentMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, meetingsRes] = await Promise.all([
        analyticsAPI.getDashboardStats(),
        meetingsAPI.getAll({ limit: 4, sort: '-createdAt' }),
      ]);

      if (analyticsRes.data.success) {
        setStats(analyticsRes.data.data);
      }
      if (meetingsRes.data.success) {
        setRecentMeetings(meetingsRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const actionStats = stats?.actionItemsStats || { total: 0, completed: 0, pending: 0, highPriority: 0 };
  const sentimentBreakdown = stats?.sentimentBreakdown || { positive: 70, neutral: 22, negative: 8 };

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-dark-900 via-dark-850 to-brand-950/40 border border-white/10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>AI Revenue Intelligence Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Sales Pipeline Intelligence Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Transform sales conversations into closed revenue. Automatically transcribe audio calls, track buyer sentiment, identify customer objections, and generate follow-up tasks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/record"
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm shadow-xl shadow-brand-500/25 transition-all duration-200 active:scale-95"
            >
              <Mic className="w-4 h-4 animate-pulse" />
              <span>Record / Upload Call</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Calls Analyzed"
          value={stats?.totalMeetings || '0'}
          subtitle="Enterprise voice records"
          icon={Layers}
          trend="+18% vs last week"
          trendPositive={true}
          glowColor="indigo"
        />

        <StatCard
          title="Pipeline Value"
          value={`$${((stats?.totalPipelineValue || 0) / 1000).toFixed(0)}k`}
          subtitle="Analyzed deal opportunities"
          icon={DollarSign}
          trend="+24% deal momentum"
          trendPositive={true}
          glowColor="emerald"
        />

        <StatCard
          title="Avg Sentiment Score"
          value={`${stats?.avgSentimentScore || 75}%`}
          subtitle={`${sentimentBreakdown.positive}% positive buyer tone`}
          icon={Smile}
          trend="+6 pts this month"
          trendPositive={true}
          glowColor="cyan"
        />

        <StatCard
          title="Pending Action Items"
          value={actionStats.pending}
          subtitle={`${actionStats.highPriority} high priority tasks`}
          icon={CheckSquare}
          trend={`${actionStats.completed} completed`}
          trendPositive={true}
          glowColor="amber"
        />
      </div>

      {/* Intelligence Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sentiment & Buyer Intent Progression */}
        <div className="lg:col-span-2 p-6 rounded-3xl glass-card border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Call-by-Call Sentiment & Buyer Intent Trends</span>
              </h3>
              <p className="text-xs text-slate-400">
                Tracking prospect sentiment and intent scores across recent sales meetings
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
              Live AI Metrics
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stats?.sentimentTrends || []}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorIntent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="title" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0b0f19',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  name="Sentiment Score"
                  dataKey="sentiment"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorSentiment)"
                />
                <Area
                  type="monotone"
                  name="Buyer Intent"
                  dataKey="buyerIntent"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorIntent)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline Deal Stage Distribution */}
        <div className="p-6 rounded-3xl glass-card border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-brand-400" />
                <span>Deal Stages</span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">Meetings by funnel velocity</p>

            <div className="space-y-3">
              {(stats?.dealStageDistribution || []).map((stg) => (
                <div key={stg.stage} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{stg.stage}</span>
                    <span className="text-slate-400 font-mono">
                      {stg.count} call{stg.count > 1 ? 's' : ''} (${(stg.value / 1000).toFixed(0)}k)
                    </span>
                  </div>
                  <div className="w-full bg-dark-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-brand-500 to-cyan-400 h-2 rounded-full"
                      style={{
                        width: `${Math.min(100, (stg.count / (stats?.totalMeetings || 1)) * 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 mt-4">
            <Link
              to="/analytics"
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center justify-between group"
            >
              <span>Explore Full Pipeline Analytics</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Analyzed Meetings Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-400" />
              <span>Recent Sales Call Intelligence</span>
            </h2>
            <p className="text-xs text-slate-400">
              Latest recordings analyzed with speaker diarization & sentiment metrics
            </p>
          </div>

          <Link
            to="/meetings"
            className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1 group"
          >
            <span>View All ({stats?.totalMeetings || 0})</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {recentMeetings.map((meeting) => (
            <MeetingCard key={meeting._id} meeting={meeting} />
          ))}
        </div>
      </div>
    </div>
  );
}
