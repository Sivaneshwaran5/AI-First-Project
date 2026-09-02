import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { meetingsAPI } from '../services/api';
import TranscriptViewer from '../components/TranscriptViewer';
import SentimentChart from '../components/SentimentChart';
import ActionItemsList from '../components/ActionItemsList';
import CoachingCard from '../components/CoachingCard';
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  Building2,
  User,
  Sparkles,
  FileText,
  Smile,
  CheckSquare,
  Award,
  Trash2,
  Share2,
  Download,
  Flame,
  Volume2,
  Tag,
  ShieldCheck,
  CheckCircle2,
  Lightbulb
} from 'lucide-react';

export default function MeetingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'transcript' | 'sentiment' | 'actionItems' | 'coaching'
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMeeting = async () => {
    try {
      setLoading(true);
      const res = await meetingsAPI.getById(id);
      if (res.data.success) {
        setMeeting(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load meeting:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeeting();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this meeting intelligence record?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await meetingsAPI.deleteMeeting(id);
      navigate('/meetings');
    } catch (err) {
      console.error('Failed to delete meeting:', err);
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-10 h-10 rounded-full border-2 border-brand-500 border-t-transparent animate-spin mx-auto"></div>
        <p className="text-sm font-semibold text-slate-300">
          Synthesizing AI sales intelligence...
        </p>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="p-12 text-center rounded-3xl glass-card border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white">Meeting record not found</h3>
        <p className="text-xs text-slate-400">The requested meeting may have been deleted.</p>
        <Link
          to="/meetings"
          className="inline-block px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold"
        >
          Back to Meetings
        </Link>
      </div>
    );
  }

  const summary = meeting.summary || {};
  const sentiment = meeting.sentiment || {};
  const buyerIntent = meeting.buyerIntent || {};
  const actionItems = meeting.actionItems || [];
  const coaching = meeting.coachingInsights || {};

  const tabs = [
    { id: 'overview', label: 'Executive Summary', icon: Sparkles },
    { id: 'transcript', label: `Diarized Transcript (${meeting.transcript?.length || 0})`, icon: FileText },
    { id: 'sentiment', label: 'Sentiment & Buyer Intent', icon: Smile },
    { id: 'actionItems', label: `Action Items (${actionItems.length})`, icon: CheckSquare },
    { id: 'coaching', label: 'AI Sales Coach', icon: Award },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Top Navigation & Actions Bar */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/meetings"
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Library</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 rounded-xl bg-dark-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/10 transition-colors"
            title="Delete Meeting"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Header Box */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-brand-400" />
              <span>{meeting.clientCompany}</span>
            </span>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-cyan-400" />
              <span>{meeting.dealStage || 'Demo'} Stage</span>
            </span>

            {meeting.dealValue && (
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ${meeting.dealValue.toLocaleString()} ARR
              </span>
            )}

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-dark-800 text-slate-300 border border-white/10">
              {coaching.dealHealthStatus || 'Healthy'}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            {meeting.title}
          </h1>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-300 pt-2 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-brand-400" />
              <span>
                Prospect: <strong className="text-white">{meeting.clientName}</strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                Sales Rep: <strong className="text-white">{meeting.salesRepName}</strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>
                {new Date(meeting.meetingDate || meeting.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{Math.round((meeting.duration || 1200) / 60)} mins</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25 border border-brand-500/40'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-dark-850'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panels */}
      <div className="mt-6">
        {/* TAB 1: OVERVIEW & EXECUTIVE SUMMARY */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Executive Summary Card */}
            <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-brand-400 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Executive Summary & Call Synthesis</span>
              </div>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                {summary.executive || 'Meeting successfully transcribed and evaluated.'}
              </p>

              {summary.nextStepsSummary && (
                <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-xs sm:text-sm text-brand-200 space-y-1">
                  <span className="font-bold text-brand-300 uppercase tracking-wider text-[10px] block">
                    Agreed Next Milestone:
                  </span>
                  <p>{summary.nextStepsSummary}</p>
                </div>
              )}
            </div>

            {/* Key Takeaways & Prospect Needs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Key Discussion Points */}
              <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Key Discussion Takeaways</span>
                </div>
                <ul className="space-y-2.5">
                  {(summary.keyPoints || []).map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0"></span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prospect Core Needs */}
              <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4" />
                  <span>Prospect Pain Points & Needs</span>
                </div>
                <ul className="space-y-2.5">
                  {(summary.prospectNeeds || []).map((need, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                      <span>{need}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quick Preview of Action Items */}
            <div className="p-6 rounded-3xl glass-card border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-brand-400" />
                  <span>Immediate Next Steps ({actionItems.length})</span>
                </h3>
                <button
                  onClick={() => setActiveTab('actionItems')}
                  className="text-xs font-semibold text-brand-400 hover:text-brand-300"
                >
                  Manage All Tasks →
                </button>
              </div>
              <ActionItemsList
                meetingId={meeting._id}
                initialItems={actionItems}
                onItemsUpdated={(updated) => setMeeting({ ...meeting, actionItems: updated })}
              />
            </div>
          </div>
        )}

        {/* TAB 2: TRANSCRIPT & AUDIO */}
        {activeTab === 'transcript' && (
          <div className="p-6 rounded-3xl glass-card border border-white/10">
            <TranscriptViewer
              transcript={meeting.transcript || []}
              audioUrl={meeting.audioUrl ? meeting.audioUrl : ''}
            />
          </div>
        )}

        {/* TAB 3: SENTIMENT & BUYER INTENT */}
        {activeTab === 'sentiment' && (
          <SentimentChart sentiment={sentiment} buyerIntent={buyerIntent} />
        )}

        {/* TAB 4: ACTION ITEMS CHECKLIST */}
        {activeTab === 'actionItems' && (
          <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/10">
            <ActionItemsList
              meetingId={meeting._id}
              initialItems={actionItems}
              onItemsUpdated={(updated) => setMeeting({ ...meeting, actionItems: updated })}
            />
          </div>
        )}

        {/* TAB 5: AI COACHING & OBJECTIONS */}
        {activeTab === 'coaching' && (
          <CoachingCard coachingInsights={coaching} buyerIntent={buyerIntent} />
        )}
      </div>
    </div>
  );
}
