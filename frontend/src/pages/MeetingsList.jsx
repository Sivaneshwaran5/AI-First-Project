import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { meetingsAPI } from '../services/api';
import MeetingCard from '../components/MeetingCard';
import {
  Search,
  Filter,
  Layers,
  Mic,
  SlidersHorizontal,
  Smile,
  Meh,
  Frown,
  DollarSign,
  Calendar,
  Sparkles,
  RotateCcw
} from 'lucide-react';

export default function MeetingsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedSentiment, setSelectedSentiment] = useState(searchParams.get('sentiment') || 'all');
  const [selectedStage, setSelectedStage] = useState(searchParams.get('dealStage') || 'all');
  const [minIntent, setMinIntent] = useState(searchParams.get('minIntent') || '');
  const [sortBy, setSortBy] = useState('-createdAt');

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const params = {
        sort: sortBy,
      };
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedSentiment !== 'all') params.sentiment = selectedSentiment;
      if (selectedStage !== 'all') params.dealStage = selectedStage;
      if (minIntent) params.minIntent = minIntent;

      const res = await meetingsAPI.getAll(params);
      if (res.data.success) {
        setMeetings(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load meetings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [searchTerm, selectedSentiment, selectedStage, minIntent, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedSentiment('all');
    setSelectedStage('all');
    setMinIntent('');
    setSortBy('-createdAt');
    setSearchParams({});
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Meeting Intelligence Library
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
              {meetings.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Browse, search, and deep-dive into sales conversations and voice analytics
          </p>
        </div>

        <Link
          to="/record"
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition-all"
        >
          <Mic className="w-3.5 h-3.5" />
          <span>New Call Analysis</span>
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 sm:p-5 rounded-3xl glass-card border border-white/10 space-y-4">
        {/* Search Bar + Sort */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by company, meeting title, or decision maker..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                <option value="-createdAt">Newest First</option>
                <option value="-dealValue">Highest Deal Value</option>
                <option value="-buyerIntent.score">Highest Buyer Intent</option>
                <option value="-sentiment.score">Highest Sentiment</option>
                <option value="createdAt">Oldest First</option>
              </select>
            </div>

            {(searchTerm || selectedSentiment !== 'all' || selectedStage !== 'all' || minIntent) && (
              <button
                onClick={handleResetFilters}
                className="px-2.5 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-slate-300 text-xs border border-white/10 flex items-center gap-1.5 transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 mr-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Tone:</span>
          </div>
          {['all', 'positive', 'neutral', 'negative'].map((sentiment) => (
            <button
              key={sentiment}
              onClick={() => setSelectedSentiment(sentiment)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-all ${
                selectedSentiment === sentiment
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-dark-900 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {sentiment === 'all' ? 'All Tones' : sentiment}
            </button>
          ))}

          <div className="h-4 w-[1px] bg-white/10 mx-2 hidden sm:block"></div>

          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 mr-2">
            <span>Stage:</span>
          </div>
          {['all', 'Discovery', 'Demo', 'Proposal', 'Negotiation', 'Closing', 'Won'].map((stage) => (
            <button
              key={stage}
              onClick={() => setSelectedStage(stage)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                selectedStage === stage
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-dark-900 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {stage === 'all' ? 'All Stages' : stage}
            </button>
          ))}
        </div>
      </div>

      {/* Meetings Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400">Loading sales meeting intelligence...</p>
        </div>
      ) : meetings.length === 0 ? (
        <div className="p-12 text-center rounded-3xl glass-card border border-white/10 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-dark-900 border border-white/10 flex items-center justify-center text-slate-500 mx-auto">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No sales meetings found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search criteria, or record a new call to generate instant AI insights.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-slate-300 text-xs border border-white/10"
            >
              Clear Filters
            </button>
            <Link
              to="/record"
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold"
            >
              Record New Call
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {meetings.map((meeting) => (
            <MeetingCard key={meeting._id} meeting={meeting} />
          ))}
        </div>
      )}
    </div>
  );
}
