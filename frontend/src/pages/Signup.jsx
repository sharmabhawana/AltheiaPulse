import React, { useState } from 'react';
import { Shield, User, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../components/AuthContext';

export default function Signup({ setActivePage }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      return setError('Please fill in all fields.');
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await signup(fullName, email, password);
      setSuccess('Account created successfully! Redirecting to sign in...');
      setTimeout(() => {
        setActivePage('login');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-panel border-slate-200 dark:border-white/10 rounded-3xl p-8 space-y-6 bg-white/80 dark:bg-slate-900/30 shadow-2xl">
        {/* Branding & Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#AD00FF]/15 border border-[#AD00FF]/30 mb-2">
            <Shield className="h-6 w-6 text-purple-600 dark:text-[#AD00FF]" />
          </div>
          <h2 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">Create Account</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Join the AltheiaPulse network and help secure public updates.</p>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-500 dark:text-red-400 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-550 dark:text-emerald-400 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0 text-emerald-500" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm"
                required
              />
            </div>
          </div>

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
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
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
                Register Account
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-xs text-slate-550 dark:text-slate-400">
            Already have an account?{' '}
            <button onClick={() => setActivePage('login')} className="text-purple-600 dark:text-[#00F0FF] font-semibold hover:underline">
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
