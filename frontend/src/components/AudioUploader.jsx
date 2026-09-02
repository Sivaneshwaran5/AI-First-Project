import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { meetingsAPI } from '../services/api';
import {
  UploadCloud,
  FileAudio,
  CheckCircle2,
  AlertCircle,
  Building2,
  Sparkles,
  Loader2,
  FileText,
  Play,
  RotateCcw,
  Zap
} from 'lucide-react';

export default function AudioUploader({ onAnalysisComplete }) {
  const navigate = useNavigate();

  const [mode, setMode] = useState('audio'); // 'audio' | 'text'
  const [selectedFile, setSelectedFile] = useState(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Text Transcript Mode
  const [rawTranscript, setRawTranscript] = useState('');

  // Form Metadata
  const [formData, setFormData] = useState({
    title: '',
    clientCompany: '',
    clientName: '',
    dealStage: 'Demo',
    dealValue: '55000',
  });

  // Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileChange = (file) => {
    if (!file) return;

    const allowedExtensions = ['.mp3', '.wav', '.m4a', '.webm', '.ogg', '.aac', '.flac', '.mp4'];
    const hasValidExt = allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!file.type.startsWith('audio/') && !file.type.startsWith('video/') && !hasValidExt) {
      setErrorMsg('Please upload a valid audio file (MP3, WAV, M4A, WEBM, OGG).');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setErrorMsg('File exceeds maximum size limit of 50MB.');
      return;
    }

    setErrorMsg('');
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setAudioPreviewUrl(url);

    // Auto-fill title if empty
    if (!formData.title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setFormData(prev => ({ ...prev, title: cleanName.charAt(0).toUpperCase() + cleanName.slice(1) }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Sample Demo Preset Loader
  const loadSamplePreset = (type) => {
    if (type === 'saas') {
      setFormData({
        title: 'Enterprise Cloud Architecture & AI Automation Call',
        clientCompany: 'Nexus Global Systems',
        clientName: 'Karen Reynolds (VP Technology)',
        dealStage: 'Proposal',
        dealValue: '85000',
      });
      setRawTranscript(`Alex Carter (Sales Rep): Hi Karen, thanks for joining. Let us discuss your cloud pipeline automation.
Karen Reynolds (Prospect): Hi Alex. Our 40 developers are losing time managing manual deployments. We need an automated zero-trust framework.
Alex Carter (Sales Rep): Our AI platform integrates with GitHub Actions and AWS EKS in under 15 minutes, with full SOC2 compliance.
Karen Reynolds (Prospect): That is exactly what we need. If we sign by the 15th, can we get onboarding assistance for our DevOps team?
Alex Carter (Sales Rep): Yes! We will assign a dedicated Solutions Architect to lead your onboarding.
Karen Reynolds (Prospect): Perfect. Send over the final proposal and MSA so our legal team can review.`);
      setMode('text');
    } else if (type === 'fintech') {
      setFormData({
        title: 'FinTech High-Frequency Payments & Fraud API Demo',
        clientCompany: 'NovaPay Global',
        clientName: 'Jordan Lee (Head of Infrastructure)',
        dealStage: 'Demo',
        dealValue: '110000',
      });
      setRawTranscript(`Alex Carter (Sales Rep): Hello Jordan, glad to connect on your payment gateway requirements.
Jordan Lee (Prospect): Thanks Alex. We are looking for sub-second webhook latency for 50,000 transactions per minute.
Alex Carter (Sales Rep): Our multi-region clusters provide sub-200ms latency globally with 99.999% uptime guarantee.
Jordan Lee (Prospect): How do you handle dispute resolution and chargeback fraud detection?
Alex Carter (Sales Rep): Our AI models flag anomalous behavior in real-time and automatically log evidence packages for credit card networks.
Jordan Lee (Prospect): Impressive. Let us schedule a technical sandbox trial with our core payments engineers next Tuesday.`);
      setMode('text');
    }
  };

  const handleAnalyze = async () => {
    setErrorMsg('');
    setIsProcessing(true);
    setProcessingStep(1);

    const timer1 = setTimeout(() => setProcessingStep(2), 1200);
    const timer2 = setTimeout(() => setProcessingStep(3), 2600);
    const timer3 = setTimeout(() => setProcessingStep(4), 4200);

    try {
      let res;
      if (mode === 'audio') {
        if (!selectedFile) {
          throw new Error('Please select an audio file to upload');
        }

        const form = new FormData();
        form.append('audio', selectedFile);
        form.append('title', formData.title || `Sales Call with ${formData.clientCompany || 'Prospect'}`);
        form.append('clientCompany', formData.clientCompany || 'Target Enterprise');
        form.append('clientName', formData.clientName || 'Decision Maker');
        form.append('dealStage', formData.dealStage);
        form.append('dealValue', formData.dealValue || '50000');
        form.append('duration', 1500);

        res = await meetingsAPI.uploadAudio(form);
      } else {
        if (!rawTranscript.trim()) {
          throw new Error('Please enter transcript text to analyze');
        }

        res = await meetingsAPI.analyzeText({
          title: formData.title || `Transcript Analysis: ${formData.clientCompany || 'Client'}`,
          clientCompany: formData.clientCompany || 'Target Enterprise',
          clientName: formData.clientName || 'Decision Maker',
          dealStage: formData.dealStage,
          dealValue: Number(formData.dealValue) || 50000,
          transcriptText: rawTranscript,
        });
      }

      if (res.data.success && res.data.data) {
        if (onAnalysisComplete) onAnalysisComplete(res.data.data);
        navigate(`/meetings/${res.data.data._id}`);
      }
    } catch (err) {
      console.error('Analysis submission error:', err);
      setErrorMsg(err.message || 'Failed to analyze meeting. Please try again.');
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setIsProcessing(false);
    }
  };

  const steps = [
    'Transcribing audio via OpenAI Whisper neural engine...',
    'Identifying speakers & diarizing Sales Rep vs. Prospect turns...',
    'Analyzing customer sentiment & calculating buyer intent score...',
    'Extracting follow-ups, objections, and action items...',
  ];

  return (
    <div className="space-y-6">
      {/* Tab Switcher: Upload Audio vs Direct Text */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center p-1 bg-dark-900 border border-white/10 rounded-2xl">
          <button
            onClick={() => setMode('audio')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              mode === 'audio'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileAudio className="w-3.5 h-3.5" />
            <span>Upload Audio File</span>
          </button>
          <button
            onClick={() => setMode('text')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              mode === 'text'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Direct Transcript Text</span>
          </button>
        </div>

        {/* Quick Sample Presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:inline flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            Quick Test:
          </span>
          <button
            type="button"
            onClick={() => loadSamplePreset('saas')}
            className="px-2.5 py-1 rounded-lg bg-dark-850 hover:bg-dark-800 text-slate-300 text-xs border border-white/10 transition-colors"
          >
            Cloud SaaS Sample
          </button>
          <button
            type="button"
            onClick={() => loadSamplePreset('fintech')}
            className="px-2.5 py-1 rounded-lg bg-dark-850 hover:bg-dark-800 text-slate-300 text-xs border border-white/10 transition-colors"
          >
            FinTech API Sample
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Upload Error</p>
            <p className="text-xs text-rose-300/90">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Drag & Drop Audio Upload Box */}
      {mode === 'audio' ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !selectedFile && fileInputRef.current?.click()}
          className={`p-8 sm:p-12 rounded-3xl glass-card border-2 border-dashed transition-all duration-300 cursor-pointer text-center relative overflow-hidden ${
            dragOver
              ? 'border-brand-400 bg-brand-500/10'
              : selectedFile
              ? 'border-emerald-500/40 bg-emerald-500/5'
              : 'border-white/15 hover:border-brand-500/50 bg-dark-900/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,.mp3,.wav,.m4a,.webm,.ogg,.aac,.flac,.mp4"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files[0])}
          />

          {selectedFile ? (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-white mb-1">{selectedFile.name}</h4>
              <p className="text-xs text-slate-400 mb-4">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Audio Ready for AI Analysis
              </p>

              {audioPreviewUrl && (
                <div className="w-full max-w-md my-2" onClick={(e) => e.stopPropagation()}>
                  <audio src={audioPreviewUrl} controls className="w-full h-10 rounded-lg" />
                </div>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                  setAudioPreviewUrl(null);
                }}
                className="mt-3 px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 text-slate-300 text-xs border border-white/10 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Choose Different Audio File</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400 mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-white mb-1">
                Drop your sales call audio file here
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mb-4">
                Supports MP3, WAV, M4A, WEBM, OGG recordings up to 50MB. Diarization and sentiment will be automatically calculated.
              </p>
              <span className="px-4 py-2 rounded-xl bg-brand-600/20 text-brand-300 border border-brand-500/30 text-xs font-semibold">
                Browse Files
              </span>
            </div>
          )}
        </div>
      ) : (
        /* Direct Text Transcript Input */
        <div className="p-6 rounded-3xl glass-card border border-white/10">
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Paste Sales Call Transcript
          </label>
          <textarea
            rows={8}
            value={rawTranscript}
            onChange={(e) => setRawTranscript(e.target.value)}
            placeholder="Alex Carter (Sales Rep): Hi Sarah, thanks for joining...&#10;Sarah Jenkins (Prospect): Thanks Alex, we are looking for a reliable solution..."
            className="w-full p-4 rounded-2xl bg-dark-900 border border-white/10 text-sm font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 leading-relaxed"
          ></textarea>
        </div>
      )}

      {/* Metadata Configuration */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/10">
        <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-brand-400" />
          <span>Call Metadata & Deal Context</span>
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Provide deal details to customize AI insights and buyer intent modeling.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Meeting Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Enterprise CRM Architecture Pitch"
              className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Client Company</label>
            <input
              type="text"
              value={formData.clientCompany}
              onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
              placeholder="e.g. Acme Corp"
              className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Decision Maker Name</label>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              placeholder="e.g. David Miller (VP Revenue)"
              className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Deal Stage</label>
            <select
              value={formData.dealStage}
              onChange={(e) => setFormData({ ...formData, dealStage: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-500"
            >
              <option value="Discovery">Discovery</option>
              <option value="Demo">Demo</option>
              <option value="Proposal">Proposal</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Closing">Closing</option>
              <option value="Won">Won</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Estimated Deal Value ($)</label>
            <input
              type="number"
              value={formData.dealValue}
              onChange={(e) => setFormData({ ...formData, dealValue: e.target.value })}
              placeholder="e.g. 75000"
              className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Submit Action & Progress bar */}
        <div className="mt-8 pt-6 border-t border-white/10">
          {isProcessing ? (
            <div className="p-6 rounded-2xl bg-dark-900/90 border border-brand-500/30 text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
                <span className="font-bold text-white text-base">Running Sales AI Pipeline...</span>
              </div>
              <p className="text-xs text-brand-300 font-medium animate-pulse">
                {steps[processingStep - 1] || steps[0]}
              </p>
              <div className="w-full bg-dark-800 rounded-full h-2 overflow-hidden max-w-md mx-auto">
                <div
                  className="bg-gradient-to-r from-brand-500 via-cyan-400 to-emerald-400 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${(processingStep / 4) * 100}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <button
              onClick={handleAnalyze}
              disabled={mode === 'audio' ? !selectedFile : !rawTranscript.trim()}
              className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all duration-200 ${
                (mode === 'audio' && selectedFile) || (mode === 'text' && rawTranscript.trim())
                  ? 'bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white shadow-xl shadow-brand-500/25 cursor-pointer active:scale-[0.99]'
                  : 'bg-dark-800 text-slate-500 border border-white/5 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>Analyze Call with AI Intelligence</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
