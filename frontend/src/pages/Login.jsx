import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Zap,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login, demoLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to sign in. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async (role) => {
    setErrorMsg('');
    setLoading(true);
    try {
      await demoLogin(role);
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message || 'Demo sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-cyan-400 p-0.5 shadow-xl shadow-brand-500/25 mx-auto">
            <div className="w-full h-full bg-dark-900 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-brand-400" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Sign in to SalesPulse AI
          </h2>
          <p className="text-xs text-slate-400">
            Voice & Deal Intelligence Platform for high-performance sales teams
          </p>
        </div>

        {/* 1-Click Demo Shortcut Box */}
        <div className="p-4 rounded-2xl bg-dark-900 border border-brand-500/30 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-brand-300">
            <Zap className="w-3.5 h-3.5 text-brand-400" />
            <span>Instant Demo Access (No password required)</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoSignIn('Sales Rep')}
              className="px-3 py-2 rounded-xl bg-brand-600/20 hover:bg-brand-600/30 text-brand-200 border border-brand-500/40 text-xs font-semibold text-left transition-all"
            >
              <span className="block font-bold">Alex Carter</span>
              <span className="text-[10px] text-slate-400">Sales Rep Profile</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoSignIn('Sales Manager')}
              className="px-3 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-200 border border-cyan-500/40 text-xs font-semibold text-left transition-all"
            >
              <span className="block font-bold">Elena Rostova</span>
              <span className="text-[10px] text-slate-400">Sales Manager Profile</span>
            </button>
          </div>
        </div>

        {/* Credentials Form */}
        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/10 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@salesai.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In with Email'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-brand-400 hover:text-brand-300">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
