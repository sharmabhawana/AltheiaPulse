import React from 'react';
import { Shield } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="w-full bg-slate-50 dark:bg-[#050811] border-t border-slate-200 dark:border-white/5 py-12 mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Slogan */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-purple-650 dark:text-[#00F0FF]" />
              <span className="font-display font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                Altheia<span className="text-purple-600 dark:text-[#00F0FF]">Pulse</span>
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm">
              An advanced AI-powered platform for real-time verification of disaster rumors, crisis news, and emergency signals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActivePage('about')} className="text-sm text-slate-650 dark:text-slate-400 hover:text-purple-600 dark:hover:text-[#00F0FF] transition-colors">
                  NLP engine
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('analyzer')} className="text-sm text-slate-650 dark:text-slate-400 hover:text-purple-600 dark:hover:text-[#00F0FF] transition-colors">
                  AI rumor analyzer
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('contact')} className="text-sm text-slate-650 dark:text-slate-400 hover:text-purple-600 dark:hover:text-[#00F0FF] transition-colors">
                  Support / Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Security & System */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Security</h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>JWT Encrypted APIs</li>
              <li>SQL injection Shield</li>
              <li>Scikit-Learn Classifier</li>
              <li>PostgreSQL DB Store</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>&copy; {new Date().getFullYear()} AltheiaPulse Inc. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
            <a href="#" className="hover:text-slate-400">Security SLA</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
