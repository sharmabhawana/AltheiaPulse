import React, { useState } from 'react';
import { Mail, Phone, Globe, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      // Reset form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">Contact & Support</h1>
        <p className="text-sm text-slate-650 dark:text-slate-400 max-w-xl mx-auto">
          Need support with API integrations or want to license AltheiaPulse for your municipality? Drop us a line.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Contact Info */}
        <div className="space-y-4 md:col-span-1">
          {[
            { icon: Mail, title: 'Email Support', val: 'supportaltheiapulse@gmail.com' },
            { icon: Globe, title: 'Global Operations', val: 'Jammu, India' }
          ].map((c, idx) => {
            const Icon = c.icon;
            return (
              <div key={idx} className="glass-panel rounded-2xl p-5 border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/30 flex gap-4 items-center">
                <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-purple-600 dark:text-[#00F0FF]" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 uppercase block font-semibold">{c.title}</span>
                  <span className="text-sm text-slate-800 dark:text-white mt-0.5 block font-mono">{c.val}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Form */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 md:col-span-2 space-y-6 border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/30">
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Send Message</h3>
          
          {success && (
            <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 text-xs">
              <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
              <span>Your message has been sent successfully! Our SLA team will respond shortly.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                  className="w-full glass-input rounded-xl px-4 py-2.5 text-sm"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="w-full glass-input rounded-xl px-4 py-2.5 text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enterprise API inquiry"
                className="w-full glass-input rounded-xl px-4 py-2.5 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Message Body</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                rows={4}
                className="w-full glass-input rounded-xl px-4 py-3 resize-none text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#AD00FF] text-slate-950 font-bold text-sm shadow-glow-blue hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Ticket
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
