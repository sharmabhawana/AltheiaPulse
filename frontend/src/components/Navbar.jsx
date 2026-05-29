import React, { useState } from 'react';
import { Shield, Menu, X, LogOut, LayoutDashboard, SearchCode, History, Settings } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ activePage, setActivePage }) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDark } = useTheme();

  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'about', label: 'NLP Model' },
    { id: 'contact', label: 'Contact' },
  ];

  const authItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyzer', label: 'AI Analyzer', icon: SearchCode },
    { id: 'history', label: 'History', icon: History },
  ];

  if (user?.role === 'admin') {
    authItems.push({ id: 'admin', label: 'Admin Panel', icon: Settings });
  }

  const handleNavClick = (id) => {
    setActivePage(id);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full transition-colors duration-300 bg-white/80 dark:bg-[#080C16]/80 backdrop-blur-md border-b border-slate-250/80 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick('landing')}>
            <div className="relative">
              <Shield className="h-8 w-8 text-purple-600 dark:text-[#00F0FF] filter drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#00F0FF] to-[#AD00FF] rounded-full filter blur opacity-20 dark:opacity-30"></div>
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-slate-900 dark:text-white">
              Altheia<span className="text-purple-600 dark:text-[#00F0FF] dark:text-glow-blue">Pulse</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm font-medium transition-colors hover:text-purple-600 dark:hover:text-[#00F0FF] ${
                  activePage === item.id 
                    ? 'text-purple-600 dark:text-[#00F0FF]' 
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {item.label}
              </button>
            ))}

            {user && (
              <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
            )}

            {user && authItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-purple-600 dark:hover:text-[#00F0FF] ${
                    activePage === item.id 
                      ? 'text-purple-600 dark:text-[#00F0FF]' 
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Auth CTA buttons + ThemeToggle */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 px-2.5 py-1 rounded-full text-slate-700 dark:text-slate-300">
                  {user.full_name} ({user.role})
                </span>
                <button
                  onClick={() => {
                    logout();
                    handleNavClick('landing');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/5 dark:bg-red-500/10 text-red-500 dark:text-red-400 hover:bg-red-500/15 text-sm font-medium transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => handleNavClick('login')}
                  className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick('signup')}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 dark:from-[#00F0FF] dark:to-[#AD00FF] hover:opacity-90 text-white dark:text-slate-950 font-bold text-sm shadow-md dark:shadow-glow-blue transition-all"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white p-1"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#080C16]/95 px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-base font-medium ${
                activePage === item.id 
                  ? 'bg-purple-50 dark:bg-[#00F0FF]/10 text-purple-600 dark:text-[#00F0FF]' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
          {user && <div className="h-px bg-slate-200 dark:bg-white/10 my-2"></div>}
          {user && authItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-base font-medium ${
                  activePage === item.id 
                    ? 'bg-purple-50 dark:bg-[#00F0FF]/10 text-purple-600 dark:text-[#00F0FF]' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
          <div className="h-px bg-slate-200 dark:bg-white/10 my-2"></div>
          {user ? (
            <div className="pt-2">
              <div className="px-3 pb-2 text-sm text-slate-500 dark:text-slate-400">
                Logged in as <span className="text-slate-900 dark:text-white font-medium">{user.full_name}</span>
              </div>
              <button
                onClick={() => {
                  logout();
                  handleNavClick('landing');
                }}
                className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 font-medium"
              >
                <LogOut className="h-5 w-5" />
                Log Out
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => handleNavClick('login')}
                className="w-full py-2 text-center rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 text-sm font-medium"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNavClick('signup')}
                className="w-full py-2 text-center rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 dark:from-[#00F0FF] dark:to-[#AD00FF] text-white dark:text-slate-950 font-bold text-sm"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
