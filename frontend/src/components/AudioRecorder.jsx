import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { meetingsAPI } from '../services/api';
import {
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Building2,
  User,
  DollarSign,
  Tag,
  Loader2,
  Radio
} from 'lucide-react';

export default function AudioRecorder({ onAnalysisComplete }) {
  const navigate = useNavigate();

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  // Audio Playback
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioPlayerRef = useRef(null);

  // Meeting Metadata Form
  const [formData, setFormData] = useState({
    title: '',
    clientCompany: '',
    clientName: '',
    dealStage: 'Demo',
    dealValue: '45000',
  });

  // Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  // Web Audio Visualizer Refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start Live Audio Visualizer
  const startVisualizer = (stream) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      source.connect(analyser);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const canvasCtx = canvas.getContext('2d');
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        animationFrameRef.current = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        canvasCtx.fillStyle = 'rgba(11, 15, 25, 0.4)';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = (dataArray[i] / 255) * canvas.height * 0.85;

          // Gradient color from Cyan to Indigo
          const gradient = canvasCtx.createLinearGradient(0, canvas.height, 0, 0);
          gradient.addColorStop(0, '#6366f1');
          gradient.addColorStop(0.5, '#06b6d4');
          gradient.addColorStop(1, '#10b981');

          canvasCtx.fillStyle = gradient;
          canvasCtx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);

          x += barWidth;
        }
      };

      draw();
    } catch (err) {
      console.warn('Audio Visualizer could not start:', err);
    }
  };

  // Stop Visualizer
  const stopVisualizer = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
  };

  // Start Recording Action
  const startRecording = async () => {
    setErrorMsg('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
        stopVisualizer();
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);

      startVisualizer(stream);

      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone access error:', err);
      setErrorMsg('Microphone access denied or not available. Please allow mic permissions in your browser.');
    }
  };

  // Pause / Resume Recording
  const togglePause = () => {
    if (!mediaRecorderRef.current) return;

    if (isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      clearInterval(timerIntervalRef.current);
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      clearInterval(timerIntervalRef.current);
    }
  };

  // Reset Recording
  const resetRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    clearInterval(timerIntervalRef.current);
    stopVisualizer();
  };

  useEffect(() => {
    return () => {
      clearInterval(timerIntervalRef.current);
      stopVisualizer();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  // Submit and Analyze
  const handleAnalyze = async () => {
    if (!audioBlob) {
      setErrorMsg('Please record audio first before analyzing.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');
    setProcessingStep(1);

    const stepsTimer1 = setTimeout(() => setProcessingStep(2), 1200);
    const stepsTimer2 = setTimeout(() => setProcessingStep(3), 2600);
    const stepsTimer3 = setTimeout(() => setProcessingStep(4), 4200);

    try {
      const form = new FormData();
      const file = new File([audioBlob], `live_record_${Date.now()}.webm`, { type: 'audio/webm' });
      form.append('audio', file);
      form.append('title', formData.title || `Sales Call with ${formData.clientCompany || 'Client'}`);
      form.append('clientCompany', formData.clientCompany || 'Acme Solutions');
      form.append('clientName', formData.clientName || 'Key Decision Maker');
      form.append('dealStage', formData.dealStage);
      form.append('dealValue', formData.dealValue || '45000');
      form.append('duration', recordingTime || 1200);

      const res = await meetingsAPI.uploadAudio(form);

      if (res.data.success && res.data.data) {
        if (onAnalysisComplete) onAnalysisComplete(res.data.data);
        navigate(`/meetings/${res.data.data._id}`);
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setErrorMsg(err.message || 'Failed to analyze recording. Please try again.');
    } finally {
      clearTimeout(stepsTimer1);
      clearTimeout(stepsTimer2);
      clearTimeout(stepsTimer3);
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
      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Recording Notice</p>
            <p className="text-xs text-rose-300/90">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Recording Studio Box */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/10 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-900 border border-white/10 text-xs font-semibold mb-6">
            {isRecording ? (
              <>
                <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
                <span className="text-rose-400">
                  {isPaused ? 'Recording Paused' : 'Live Microphone Active'}
                </span>
              </>
            ) : audioBlob ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Audio Captured ({formatTime(recordingTime)})</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-brand-400" />
                <span className="text-slate-300">Ready to Record Sales Call</span>
              </>
            )}
          </div>

          {/* Real-time Frequency Visualizer Canvas */}
          <div className="w-full max-w-lg h-32 rounded-2xl bg-dark-900/90 border border-white/10 flex items-center justify-center p-2 mb-6 overflow-hidden relative shadow-inner">
            <canvas
              ref={canvasRef}
              width={480}
              height={120}
              className={`w-full h-full ${!isRecording ? 'opacity-30' : 'opacity-100'} transition-opacity`}
            />
            {!isRecording && !audioBlob && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 text-xs gap-1">
                <Mic className="w-6 h-6 text-slate-600 mb-1" />
                <span>Click "Start Recording" to capture call audio live</span>
              </div>
            )}
          </div>

          {/* Time Counter */}
          <div className="font-mono text-4xl sm:text-5xl font-black tracking-tight text-white mb-8">
            {formatTime(recordingTime)}
          </div>

          {/* Primary Controls */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {!isRecording && !audioBlob && (
              <button
                onClick={startRecording}
                className="flex items-center gap-3 px-6 py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 shadow-xl shadow-rose-500/25 hover:shadow-rose-500/40 transition-all transform active:scale-95"
              >
                <div className="w-3 h-3 rounded-full bg-white animate-ping"></div>
                <span>Start Recording Call</span>
              </button>
            )}

            {isRecording && (
              <>
                <button
                  onClick={togglePause}
                  className="px-5 py-3 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-200 border border-white/10 font-semibold text-sm flex items-center gap-2 transition-all"
                >
                  {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
                  <span>{isPaused ? 'Resume' : 'Pause'}</span>
                </button>

                <button
                  onClick={stopRecording}
                  className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm flex items-center gap-2.5 shadow-lg shadow-rose-600/30 transition-all"
                >
                  <Square className="w-4 h-4 fill-white" />
                  <span>Stop & Review</span>
                </button>
              </>
            )}

            {audioBlob && !isRecording && (
              <button
                onClick={resetRecording}
                className="px-4 py-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 text-slate-300 border border-white/10 text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-Record</span>
              </button>
            )}
          </div>

          {/* Audio Playback Preview */}
          {audioUrl && (
            <div className="w-full max-w-md mt-6 pt-6 border-t border-white/10">
              <audio ref={audioPlayerRef} src={audioUrl} controls className="w-full h-10 rounded-lg" />
            </div>
          )}
        </div>
      </div>

      {/* Metadata Configuration Form */}
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
              placeholder="e.g. Enterprise Cloud Security Demo"
              className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Client Company</label>
            <input
              type="text"
              value={formData.clientCompany}
              onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
              placeholder="e.g. Apex Dynamics"
              className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Decision Maker Name</label>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              placeholder="e.g. Sarah Vance (CIO)"
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
              placeholder="e.g. 50000"
              className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* AI Processing Animation / Submit Button */}
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
              {/* Progress bar */}
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
              disabled={!audioBlob}
              className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all duration-200 ${
                audioBlob
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
