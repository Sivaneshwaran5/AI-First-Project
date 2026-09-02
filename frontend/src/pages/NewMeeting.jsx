import React, { useState } from 'react';
import AudioRecorder from '../components/AudioRecorder';
import AudioUploader from '../components/AudioUploader';
import {
  Mic,
  UploadCloud,
  Sparkles,
  Bot,
  Layers,
  Zap,
  ShieldCheck
} from 'lucide-react';

export default function NewMeeting() {
  const [activeMode, setActiveMode] = useState('record'); // 'record' | 'upload'

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Speech-to-Text & Sales Intelligence Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Capture & Analyze Sales Meeting
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          Record a live call directly with microphone audio visualizer or upload an existing meeting audio file (MP3, WAV, WEBM) to extract real-time sales intelligence.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center justify-center">
        <div className="flex items-center p-1.5 rounded-2xl bg-dark-900 border border-white/10 shadow-xl">
          <button
            onClick={() => setActiveMode('record')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
              activeMode === 'record'
                ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-lg shadow-rose-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Live Microphone Recording</span>
          </button>

          <button
            onClick={() => setActiveMode('upload')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
              activeMode === 'upload'
                ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Audio File / Text</span>
          </button>
        </div>
      </div>

      {/* Main Studio View */}
      {activeMode === 'record' ? (
        <AudioRecorder />
      ) : (
        <AudioUploader />
      )}

      {/* AI Processing Capabilities Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-center">
        <div className="p-4 rounded-2xl bg-dark-900/50 border border-white/5 space-y-1">
          <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center mx-auto mb-2">
            <Mic className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-200">Neural Diarization</h4>
          <p className="text-[11px] text-slate-400">
            Automatically isolates Sales Rep vs. Customer prospect turns with 96%+ accuracy.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-dark-900/50 border border-white/5 space-y-1">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-2">
            <Zap className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-200">Moment-by-Moment Tone</h4>
          <p className="text-[11px] text-slate-400">
            Traces buyer enthusiasm, hesitancy, and objection severity across the conversation.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-dark-900/50 border border-white/5 space-y-1">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-2">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-200">Automated Next Steps</h4>
          <p className="text-[11px] text-slate-400">
            Extracts clear action items with assignees, priorities, and agreed commitments.
          </p>
        </div>
      </div>
    </div>
  );
}
