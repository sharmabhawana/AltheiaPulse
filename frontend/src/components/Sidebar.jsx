import React from 'react';
import { LayoutDashboard, SearchCode, History, Settings, FileText } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function Sidebar({ activePage, setActivePage }) {
  const { user } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyzer', label: 'AI Analyzer', icon: SearchCode },
    { id: 'history', label: 'Prediction History', icon: History },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ id: 'admin', label: 'Admin Logs', icon: Settings });
  }

  return (
    <div className="w-64 shrink-0 hidden md:block">
      <div className="sticky top-20 glass-panel rounded-2xl p-4 space-y-2">
        <div className="px-3 py-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Navigation</p>
        </div>
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'dark:bg-[#00F0FF]/15 bg-purple-50 dark:text-[#00F0FF] text-purple-600 border-l-2 dark:border-[#00F0FF] border-purple-600'
                    : 'text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-purple-600 dark:text-[#00F0FF]' : 'text-slate-400 dark:text-slate-500'}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
