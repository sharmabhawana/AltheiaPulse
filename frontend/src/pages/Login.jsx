import React, { useState } from 'react';
import { Shield, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../components/AuthContext';

export default function Login({ setActivePage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return setError('Please fill in all fields.');
    }
    
    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
      setActivePage('dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-panel border-slate-200 dark:border-white/10 rounded-3xl p-8 space-y-6 bg-white/80 dark:bg-slate-900/30 shadow-2xl">
        {/* Branding & Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00F0FF]/15 border border-[#00F0FF]/30 mb-2">
            <Shield className="h-6 w-6 text-purple-600 dark:text-[#00F0FF]" />
          </div>
          <h2 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">Welcome Back</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Enter your credentials to access your verification dashboard.</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-500 dark:text-red-400 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
              <button
                type="button"
                onClick={() => alert("Password reset link is sent to your email (simulated).")}
                className="text-[10px] text-purple-600 dark:text-[#00F0FF] hover:underline font-semibold"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#AD00FF] text-slate-950 font-bold text-sm shadow-glow-blue disabled:opacity-50 flex items-center justify-center gap-1.5 transition-opacity"
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Sign In
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Helper */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/40 text-center">
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            Testing accounts seeded on startup:
          </p>
          <div className="grid grid-cols-2 gap-2 mt-1.5 text-[9px] font-mono text-slate-700 dark:text-slate-300">
            <button
              onClick={() => {
                setEmail('admin@altheiapulse.com');
                setPassword('adminpassword');
              }}
              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 py-1.5 px-1.5 rounded border border-slate-250 dark:border-slate-700/50 transition-colors font-semibold"
            >
              Admin Role
            </button>
            <button
              onClick={() => {
                setEmail('user@altheiapulse.com');
                setPassword('userpassword');
              }}
              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 py-1.5 px-1.5 rounded border border-slate-250 dark:border-slate-700/50 transition-colors font-semibold"
            >
              User Role
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-slate-550 dark:text-slate-400">
            Don't have an account?{' '}
            <button onClick={() => setActivePage('signup')} className="text-purple-600 dark:text-[#00F0FF] font-semibold hover:underline">
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
