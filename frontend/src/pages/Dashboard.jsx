import React, { useState, useEffect } from 'react';
import { ShieldCheck, Skull, AlertCircle, BarChart3, Clock, AlertTriangle, AlertOctagon } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useAuth, API_URL } from '../components/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Sidebar from '../components/Sidebar';
import AlertBanner from '../components/AlertBanner';

export default function Dashboard({ setActivePage }) {
  const { token } = useAuth();
  const { isDark } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_URL}/api/stats`);
        const data = await response.json();
        setStats(data);
      } catch (e) {
        // Fallback default statistics for demonstration
        setStats({
          total_predictions: 182,
          distribution: { real: 85, fake: 62, suspicious: 35 },
          risk_levels: { high: 12, medium: 45 },
          ml_metrics: { accuracy: 88.7, precision: 87.9, recall: 89.4, f1_score: 88.6 },
          weekly_activity: [
            { day: 'Mon', total: 10, real: 6, fake: 4 },
            { day: 'Tue', total: 24, real: 12, fake: 12 },
            { day: 'Wed', total: 18, real: 10, fake: 8 },
            { day: 'Thu', total: 32, real: 15, fake: 17 },
            { day: 'Fri', total: 28, real: 14, fake: 14 },
            { day: 'Sat', total: 15, real: 8, fake: 7 },
            { day: 'Sun', total: 55, real: 20, fake: 35 }
          ],
          latest_predictions: [
            {
              id: 1,
              input_text: "Severe wildfire reported in Northern California. Air quality warning issued.",
              prediction: "Real",
              confidence: 94.2,
              risk_level: "High",
              detected_location: "California",
              created_at: new Date().toISOString()
            },
            {
              id: 2,
              input_text: "Conspiracy: Alien spaceship crashed near Sydney, local authorities covering it up.",
              prediction: "Fake",
              confidence: 98.1,
              risk_level: "Low",
              detected_location: "Sydney",
              created_at: new Date().toISOString()
            },
            {
              id: 3,
              input_text: "Suspicious explosion sound reported near Tokyo train station. Under investigation.",
              prediction: "Suspicious",
              confidence: 58.4,
              risk_level: "High",
              detected_location: "Tokyo",
              created_at: new Date().toISOString()
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-8 w-8 border-4 border-[#00F0FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Recharts color palettes
  const PIE_COLORS = ['#10B981', '#EF4444', '#F59E0B']; // Emerald Green (Real), Red (Fake), Amber (Suspicious)
  
  const pieData = stats ? [
    { name: 'Real', value: stats.distribution.real },
    { name: 'Fake', value: stats.distribution.fake },
    { name: 'Suspicious', value: stats.distribution.suspicious }
  ] : [];

  // Determine top active banners based on latest prediction
  const latestPred = stats?.latest_predictions?.[0];

  return (
    <div className="flex flex-col md:flex-row gap-6 py-8">
      {/* Sidebar navigation */}
      <Sidebar activePage="dashboard" setActivePage={setActivePage} />

      {/* Main Content Area */}
      <div className="flex-1 space-y-6">
        {/* Banner Alert Header */}
        {latestPred && (
          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Active Verification Feed Alert</h2>
            <AlertBanner prediction={latestPred.prediction} riskLevel={latestPred.risk_level} />
          </div>
        )}

        {/* Numeric Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Total Checked', value: stats.total_predictions, icon: BarChart3, border: 'border-slate-200 dark:border-white/10' },
            { title: 'Real Hazards', value: stats.distribution.real, icon: ShieldCheck, border: 'border-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-glow-green/10' },
            { title: 'Fake Hoaxes', value: stats.distribution.fake, icon: Skull, border: 'border-red-500/20 text-red-650 dark:text-red-400 shadow-glow-red/10' },
            { title: 'Suspicious', value: stats.distribution.suspicious, icon: AlertCircle, border: 'border-amber-500/20 text-amber-600 dark:text-amber-400' }
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <div key={idx} className={`glass-panel rounded-2xl p-5 border ${card.border} flex items-center justify-between bg-white/80 dark:bg-slate-900/30`}>
                <div className="space-y-1.5">
                  <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">{card.title}</span>
                  <p className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">{card.value}</p>
                </div>
                <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-white/5">
                  <Icon className="h-4.5 w-4.5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts & Analytics Visuals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart 1: Pie Chart Breakdown */}
          <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between min-h-[300px] border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/30">
            <div>
              <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">Rumor Distribution</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Verdict breakdown of verified crisis items.</p>
            </div>
            <div className="h-44 w-full my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: isDark ? '#0F172A' : '#FFFFFF', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', borderRadius: '10px' }}
                    itemStyle={{ color: isDark ? '#F8FAFC' : '#1E293B', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Custom Legend */}
            <div className="flex justify-center gap-4 text-xs">
              {pieData.map((d, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: PIE_COLORS[idx] }}></span>
                  <span className="text-slate-500 dark:text-slate-400">{d.name} ({d.value})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 2: Weekly Activity Trend */}
          <div className="glass-panel rounded-2xl p-5 lg:col-span-2 flex flex-col justify-between min-h-[300px] border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/30">
            <div>
              <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">Weekly Verification Flow</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Daily breakdown of rumors categorized by system output.</p>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.weekly_activity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isDark ? '#00F0FF' : '#4F46E5'} stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={isDark ? '#00F0FF' : '#4F46E5'} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                  <XAxis dataKey="day" stroke={isDark ? "#94A3B8" : "#475569"} fontSize={10} tickLine={false} />
                  <YAxis stroke={isDark ? "#94A3B8" : "#475569"} fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: isDark ? '#0F172A' : '#FFFFFF', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', borderRadius: '10px' }}
                    itemStyle={{ color: isDark ? '#F8FAFC' : '#1E293B', fontSize: '11px' }}
                  />
                  <Area type="monotone" dataKey="total" stroke={isDark ? '#00F0FF' : '#4F46E5'} fillOpacity={1} fill="url(#colorTotal)" name="Total Checked" />
                  <Area type="monotone" dataKey="real" stroke="#10B981" fillOpacity={0} name="Real Updates" />
                  <Area type="monotone" dataKey="fake" stroke="#EF4444" fillOpacity={0} name="Fake Rumors" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Prediction Table */}
        <div className="glass-panel border-slate-200 dark:border-white/10 rounded-2xl p-5 space-y-4 bg-white/80 dark:bg-slate-900/30 shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">Recent Verification Logs</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Latest analysis inputs processed by the NLP vector pipeline.</p>
            </div>
            <button
              onClick={() => setActivePage('history')}
              className="text-xs text-purple-600 dark:text-[#00F0FF] font-semibold hover:underline"
            >
              View History &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/5 text-slate-500 dark:text-slate-400 font-semibold">
                  <th className="pb-3 pl-2">Input Statement</th>
                  <th className="pb-3">Verdict</th>
                  <th className="pb-3">Confidence</th>
                  <th className="pb-3">Risk</th>
                  <th className="pb-3">Location</th>
                  <th className="pb-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300">
                {stats.latest_predictions.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3 pl-2 max-w-xs truncate pr-4 font-mono">{p.input_text}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                        p.prediction === 'Real' ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' :
                        p.prediction === 'Fake' ? 'text-red-600 dark:text-red-400 bg-red-500/10' : 'text-amber-600 dark:text-amber-400 bg-amber-500/10'
                      }`}>
                        {p.prediction}
                      </span>
                    </td>
                    <td className="py-3 font-semibold text-slate-900 dark:text-white">{p.confidence}%</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        p.risk_level === 'High' ? 'text-purple-600 dark:text-purple-400 bg-[#AD00FF]/15' :
                        p.risk_level === 'Medium' ? 'text-amber-700 dark:text-orange-400 bg-orange-500/10' : 'text-slate-500 dark:text-slate-400 bg-slate-500/10'
                      }`}>
                        {p.risk_level}
                      </span>
                    </td>
                    <td className="py-3">{p.detected_location || 'Global'}</td>
                    <td className="py-3 text-right text-slate-500 dark:text-slate-400 font-mono">
                      {new Date(p.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
