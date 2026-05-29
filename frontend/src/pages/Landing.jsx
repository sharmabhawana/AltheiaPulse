import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, BrainCircuit, Activity, Globe, Send, Flame, Zap, 
  ShieldCheck, AlertTriangle, TrendingUp, Radio, MapPin, 
  Users, CheckCircle2, Database, Network, Cpu, Layers, BellRing 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { API_URL } from '../components/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Landing({ setActivePage }) {
  const { isDark } = useTheme();
  const [inputText, setInputText] = useState('');
  const [demoResult, setDemoResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzingText, setAnalyzingText] = useState('');
  const [stats, setStats] = useState({ total: 1420, real: 720, fake: 540, accuracy: 88.7 });
  const [selectedThreat, setSelectedThreat] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const examples = [
    { text: "CRITICAL: Wildfire spreading in San Diego near Highway 8. Mandatory evacuations ordered.", label: "Real" },
    { text: "ZOMBIE OUTBREAK IN CHICAGO! Government hiding the truth, military quarantine declared!", label: "Fake" },
    { text: "Suspicious gas odor reported near subway station in Manhattan. Authorities checking.", label: "Suspicious" }
  ];

  // Simulated live threat streams
  const liveThreats = [
    { id: 1, type: 'wildfire', title: 'Forest Fire', location: 'California, US', status: 'Verifying', confidence: 91, time: 'Just now', severity: 'High', source: 'Twitter' },
    { id: 2, type: 'flood', title: 'Flash Flood warning', location: 'Queensland, AU', status: 'Verified Real', confidence: 97, time: '2m ago', severity: 'High', source: 'Local News' },
    { id: 3, type: 'storm', title: 'Tornado sighting hoax', location: 'Kansas, US', status: 'Verified Fake', confidence: 94, time: '5m ago', severity: 'Low', source: 'Telegram' },
    { id: 4, type: 'earthquake', title: 'Seismic tremors registered', location: 'Tokyo, JP', status: 'Verified Real', confidence: 99, time: '12m ago', severity: 'Medium', source: 'USGS API' },
    { id: 5, type: 'infrastructure', title: 'Bridge collapse rumor', location: 'London, UK', status: 'Verified Fake', confidence: 88, time: '15m ago', severity: 'Medium', source: 'WhatsApp' }
  ];

  // Recharts simulation data
  const chartData = [
    { name: '00:00', real: 40, fake: 24, total: 64 },
    { name: '04:00', real: 30, fake: 13, total: 43 },
    { name: '08:00', real: 85, fake: 60, total: 145 },
    { name: '12:00', real: 120, fake: 85, total: 205 },
    { name: '16:00', real: 140, fake: 95, total: 235 },
    { name: '20:00', real: 90, fake: 50, total: 140 },
    { name: '24:00', real: 60, fake: 30, total: 90 },
  ];

  const radarData = [
    { subject: 'Rumor Detection', A: 92, B: 85, fullMark: 100 },
    { subject: 'Response Latency', A: 98, B: 80, fullMark: 100 },
    { subject: 'Location Parsing', A: 86, B: 75, fullMark: 100 },
    { subject: 'Sentiment Analysis', A: 90, B: 90, fullMark: 100 },
    { subject: 'Source Trust Score', A: 94, B: 70, fullMark: 100 },
  ];

  useEffect(() => {
    fetch(`${API_URL}/api/stats`)
      .then(res => res.json())
      .then(data => {
        if (data && data.total_predictions !== undefined) {
          setStats({
            total: data.total_predictions,
            real: data.distribution.real,
            fake: data.distribution.fake,
            accuracy: data.ml_metrics.accuracy
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleDemoAnalyze = async (text) => {
    setLoading(true);
    setDemoResult(null);
    setAnalyzingText('Running lexical analysis...');
    
    // Simulate thinking steps
    setTimeout(() => setAnalyzingText('Extracting spatial features & locations...'), 350);
    setTimeout(() => setAnalyzingText('Comparing vector weights...'), 700);

    try {
      const response = await fetch(`${API_URL}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      setTimeout(() => {
        setDemoResult(data);
        setLoading(false);
      }, 1000);
    } catch (e) {
      // Offline fallback
      setTimeout(() => {
        const isFake = text.toLowerCase().includes('zombie') || text.toLowerCase().includes('hoax') || text.toLowerCase().includes('monster') || text.toLowerCase().includes('alien');
        const isSuspicious = text.toLowerCase().includes('odor') || text.toLowerCase().includes('unconfirmed') || text.toLowerCase().includes('hear');
        setDemoResult({
          prediction: isFake ? 'Fake' : isSuspicious ? 'Suspicious' : 'Real',
          confidence: isFake ? 94.6 : isSuspicious ? 58.2 : 91.4,
          risk_level: isFake ? 'Low' : isSuspicious ? 'Medium' : 'High',
          detected_location: text.includes('San Diego') ? 'San Diego, CA' : text.includes('Chicago') ? 'Chicago, IL' : text.includes('Manhattan') ? 'Manhattan, NY' : 'Unknown',
          keywords: ['emergency', 'disaster', 'warning'],
          explanation: "System parsed message for hazard classification. The lexical weights and location references suggest high similarity with emergency broadcast messages."
        });
        setLoading(false);
      }, 1100);
    }
  };

  return (
    <div className="space-y-20 py-12 overflow-visible select-none">
      
      {/* ━━━━━━━━━━━━━━━━━━━━━━━ HERO SECTION ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative text-center max-w-5xl mx-auto px-4 pt-10 pb-8 flex flex-col items-center">
        {/* Futuristic glowing scanner overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.06)_0%,transparent_60%)] -z-10" />

        {/* Dynamic Glowing Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00F0FF]/30 bg-slate-950/80 text-xs text-[#00F0FF] mb-8 shadow-[0_0_20px_rgba(0,240,255,0.15)] backdrop-blur-md"
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Zap className="h-3.5 w-3.5 text-[#00F0FF]" />
          </motion.div>
          <span>ALTHEIAPULSE AI ENGINE ACTIVE & SCANNING v2.4</span>
        </motion.div>

        {/* Main Header */}
        <motion.h1 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display font-extrabold text-5xl sm:text-7xl tracking-tight text-slate-900 dark:text-white leading-none"
        >
          Altheia<span className="shimmer-text">Pulse</span>
        </motion.h1>

        {/* Animated Cybernetic Graphic below title */}
        <div className="w-64 h-1 bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent my-6 relative">
          <motion.div 
            animate={{ left: ['0%', '100%', '0%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-1 w-2.5 h-2.5 rounded-full bg-[#AD00FF] shadow-[0_0_8px_#AD00FF]"
          />
        </div>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-lg sm:text-2xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto font-sans font-light leading-relaxed mb-10"
        >
          An advanced AI-powered SaaS emergency engine detecting disaster rumors, fake warning reports, and hazardous event spikes with sub-second accuracy.
        </motion.p>

        {/* Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-md"
        >
          <button
            onClick={() => setActivePage('signup')}
            className="w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#AD00FF] hover:brightness-110 text-slate-950 font-bold text-base shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2 group"
          >
            <Shield className="h-5 w-5" />
            Deploy Intelligence
            <motion.span 
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              →
            </motion.span>
          </button>
          <a
            href="#demo"
            className="w-full sm:w-auto text-center px-10 py-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-900/60 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-800/80 text-base font-semibold transition-all backdrop-blur-md hover:border-[#00F0FF]/30 flex items-center justify-center gap-2"
          >
            <Activity className="h-5 w-5 text-purple-600 dark:text-[#00F0FF]" />
            Sandbox Engine
          </a>
        </motion.div>

        {/* Animated Hero Neural Visualizer */}
        <div className="w-full max-w-4xl mt-16 relative">
          <svg className="w-full h-40 opacity-40" viewBox="0 0 800 160">
            <defs>
              <linearGradient id="cyber-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00F0FF" />
                <stop offset="100%" stopColor="#AD00FF" />
              </linearGradient>
            </defs>
            <motion.path 
              d="M 50 80 C 150 20, 250 140, 350 80 C 450 20, 550 140, 650 80 C 750 20, 800 80, 850 80" 
              fill="none" 
              stroke="url(#cyber-grad)" 
              strokeWidth="2"
              strokeDasharray="8 4"
              animate={{ strokeDashoffset: [0, -100] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            />
            {/* Blinking Node Sensors */}
            {[50, 150, 250, 350, 450, 550, 650, 750].map((cx, i) => (
              <g key={i}>
                <motion.circle 
                  cx={cx} 
                  cy={80 + Math.sin(cx) * 35} 
                  r="6" 
                  fill={i % 2 === 0 ? '#00F0FF' : '#AD00FF'} 
                />
                <motion.circle 
                  cx={cx} 
                  cy={80 + Math.sin(cx) * 35} 
                  r="14" 
                  stroke={i % 2 === 0 ? '#00F0FF' : '#AD00FF'} 
                  strokeWidth="1.5"
                  fill="none"
                  animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                />
              </g>
            ))}
          </svg>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━ INTERACTIVE STATISTICS ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-[#00F0FF]/2 blur-[80px] -z-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: stats.total, label: 'Claims Analyzed', icon: Database, color: '#00F0FF' },
            { value: `${stats.accuracy}%`, label: 'NLP Accuracy Rate', icon: BrainCircuit, color: '#AD00FF' },
            { value: stats.real, label: 'Verified Emergencies', icon: Flame, color: '#10B981' },
            { value: stats.fake, label: 'Fake News Neutralized', icon: Shield, color: '#EF4444' }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                key={idx}
                whileHover={{ y: -8, scale: 1.03 }}
                className="glass-panel border-slate-200 dark:border-white/10 rounded-2xl p-6 text-left relative overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
              >
                {/* Visual glow on hover */}
                <div 
                  className="absolute -right-10 -top-10 w-24 h-24 rounded-full opacity-10 blur-xl group-hover:opacity-30 transition-all duration-500"
                  style={{ backgroundColor: stat.color }}
                />
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
                    <Icon className="h-6 w-6" style={{ color: stat.color }} />
                  </div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">LIVE STREAM</span>
                </div>
                <div className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white mb-1 tracking-tight text-glow-blue">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-semibold tracking-wider uppercase">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━ AI VERIFICATION ENGINE (SANDBOX) ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="demo" className="max-w-4xl mx-auto px-4 scroll-mt-24">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel border-slate-200 dark:border-white/15 rounded-3xl p-6 sm:p-10 space-y-8 relative overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.08)] bg-white/80 dark:bg-slate-950/60"
        >
          {/* Cyber scan lines */}
          <div className="absolute inset-0 bg-cyber-grid pointer-events-none opacity-5" />
          
          <div className="text-center space-y-3 relative z-10">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">AI Verification Engine</h2>
            <p className="text-sm text-slate-650 dark:text-slate-400 max-w-md mx-auto">Input simulated claims or select an alert profile below to initiate automated neural classification.</p>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10">
            {examples.map((ex, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(ex.text);
                  handleDemoAnalyze(ex.text);
                }}
                className="p-4 text-left rounded-xl border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-slate-900/60 hover:bg-slate-200 dark:hover:bg-slate-800/80 hover:border-[#00F0FF]/30 text-xs transition-all text-slate-700 dark:text-slate-300 flex flex-col justify-between gap-3 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-2 h-2 bg-[#00F0FF] opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-clamp-2 italic text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">"{ex.text}"</span>
                <span className={`text-xs uppercase font-black self-end px-3 py-1 rounded-full ${
                  ex.label === 'Real' ? 'text-emerald-500 dark:text-emerald-400 bg-emerald-500/10' :
                  ex.label === 'Fake' ? 'text-red-500 dark:text-red-400 bg-red-500/10' : 'text-amber-500 dark:text-amber-400 bg-amber-500/10'
                }`}>{ex.label}</span>
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="space-y-4 relative z-10">
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ex: Heavy flooding reported at downtown subway station, trains suspended..."
                rows={3}
                className="w-full rounded-2xl glass-input px-5 py-4 text-sm focus:ring-1 focus:ring-[#00F0FF] placeholder-slate-400 dark:placeholder-slate-600 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-white"
              />
              <div className="absolute bottom-4 right-4 text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                Vectored-Lexical Mode
              </div>
            </div>

            <button
              onClick={() => handleDemoAnalyze(inputText)}
              disabled={loading || !inputText.trim()}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#AD00FF] text-slate-950 font-black text-sm shadow-[0_0_20px_rgba(0,240,255,0.3)] disabled:opacity-50 flex items-center justify-center gap-2 group transition-all"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <BrainCircuit className="h-5 w-5" />
                  Run AI Diagnostics
                </>
              )}
            </button>
          </div>

          {/* Analyzing Progress Panel */}
          {loading && (
            <div className="p-6 rounded-2xl border border-[#00F0FF]/25 bg-slate-950/80 flex flex-col items-center justify-center space-y-4 relative overflow-hidden">
              <motion.div 
                className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent"
                animate={{ left: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
              <Radio className="h-8 w-8 text-[#00F0FF] animate-pulse" />
              <div className="text-xs font-mono text-slate-300">{analyzingText}</div>
            </div>
          )}

          {/* Verification Outcome */}
          <AnimatePresence>
            {demoResult && !loading && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/90 space-y-6 relative overflow-hidden"
              >
                {/* Gauge visualization bar */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-slate-200 dark:bg-slate-800">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${demoResult.confidence}%` }}
                    transition={{ duration: 1.2 }}
                    className={`h-full ${
                      demoResult.prediction === 'Real' ? 'bg-emerald-500' :
                      demoResult.prediction === 'Fake' ? 'bg-red-500' : 'bg-amber-500'
                    }`}
                  />
                </div>

                <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-200 dark:border-white/5 pb-4 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">VERDICT:</span>
                    <span className={`text-sm font-black uppercase px-3 py-1 rounded-full ${
                      demoResult.prediction === 'Real' ? 'text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30' :
                      demoResult.prediction === 'Fake' ? 'text-red-500 dark:text-red-400 bg-red-500/10 border border-red-500/30' : 'text-amber-500 dark:text-amber-400 bg-amber-500/10 border border-amber-500/30'
                    }`}>{demoResult.prediction}</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm font-mono">
                    <div className="text-slate-500 dark:text-slate-400">
                      Confidence: <span className="font-bold text-slate-900 dark:text-white">{demoResult.confidence}%</span>
                    </div>
                    <div className="w-px h-3 bg-slate-200 dark:bg-white/10" />
                    <div className="text-slate-500 dark:text-slate-400">
                      Risk Level: <span className={`font-bold ${
                        demoResult.risk_level === 'High' ? 'text-red-500' :
                        demoResult.risk_level === 'Medium' ? 'text-amber-500' : 'text-emerald-500'
                      }`}>{demoResult.risk_level}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Detected Location</div>
                    <div className="flex items-center gap-1.5 text-sm text-slate-800 dark:text-slate-200">
                      <MapPin className="h-3.5 w-3.5 text-purple-600 dark:text-[#00F0FF]" />
                      {demoResult.detected_location || 'Not Specified'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Categorization Vectors</div>
                    <div className="flex flex-wrap gap-1.5">
                      {demoResult.keywords?.map((word, wIdx) => (
                        <span key={wIdx} className="text-xs font-mono px-2.5 py-1 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300">
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Diagnostic Details</div>
                  <p className="text-sm text-slate-750 dark:text-slate-300 leading-relaxed font-sans">{demoResult.explanation}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━ AI THREAT MONITORING ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">AI Threat Monitoring</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">Live ingestion pipelines scanning networks for disaster rumors, anomalous reports, and panic indicators.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Logs Feed */}
          <div className="lg:col-span-2 glass-panel border-slate-250/80 dark:border-white/10 rounded-2xl p-6 space-y-6 bg-white/80 dark:bg-slate-950/40">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Live Intelligence Stream</span>
              </div>
              <div className="flex gap-2">
                {['all', 'real', 'fake'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full border transition-all ${
                      activeTab === tab 
                        ? 'border-[#00F0FF]/40 bg-[#00F0FF]/10 text-[#00F0FF]' 
                        : 'border-white/5 hover:border-white/10 text-slate-400'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-white/5 max-h-[400px] overflow-y-auto pr-2 space-y-4">
              {liveThreats
                .filter(t => {
                  if (activeTab === 'real') return t.status.includes('Real');
                  if (activeTab === 'fake') return t.status.includes('Fake');
                  return true;
                })
                .map((threat) => (
                  <motion.div 
                    layout
                    key={threat.id} 
                    className="flex justify-between items-start pt-4 first:pt-0 group cursor-pointer"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-[#00F0FF] transition-colors">{threat.title}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">• {threat.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-mono text-slate-400 dark:text-slate-500">{threat.time}</span>
                        <span>via</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{threat.source}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <span className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full ${
                        threat.status.includes('Real') ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' :
                        threat.status.includes('Fake') ? 'text-red-600 dark:text-red-400 bg-red-500/10' : 'text-amber-600 dark:text-amber-400 bg-amber-500/10'
                      }`}>{threat.status}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Confidence: <b className="text-slate-900 dark:text-white">{threat.confidence}%</b></span>
                    </div>
                  </motion.div>
                ))
              }
            </div>
          </div>

          {/* Threat Meter Radar Widget */}
          <div className="glass-panel border-slate-250/80 dark:border-white/10 rounded-2xl p-6 flex flex-col justify-between items-center text-center bg-white/80 dark:bg-slate-950/40 relative overflow-hidden">
            <div className="w-full flex justify-between items-center border-b border-slate-200 dark:border-white/5 pb-4 mb-4">
              <span className="text-xs font-bold uppercase text-slate-900 dark:text-white">Active Sensor Coverage</span>
              <Network className="h-4 w-4 text-purple-600 dark:text-[#AD00FF]" />
            </div>

            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" radius="70%" data={radarData}>
                  <PolarGrid stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.05)"} />
                  <PolarAngleAxis dataKey="subject" stroke={isDark ? "rgba(255,255,255,0.4)" : "rgba(15,23,42,0.6)"} fontSize={11} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.1)"} />
                  <Radar name="Coverage" dataKey="A" stroke={isDark ? "#00F0FF" : "#6366F1"} fill={isDark ? "#00F0FF" : "#6366F1"} fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full space-y-2 mt-4">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Dynamic Target Health</div>
              <div className="w-full bg-slate-200 dark:bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '92%' }}
                  transition={{ duration: 1.5 }}
                  className="h-full bg-gradient-to-r from-[#00F0FF] to-[#AD00FF]"
                />
              </div>
              <div className="flex justify-between text-xs font-mono text-purple-600 dark:text-[#00F0FF]">
                <span>92% Operational</span>
                <span>Latency: 12ms</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━ LIVE DISASTER ANALYTICS ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">Live Disaster Analytics</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">Visualizing rumor frequency, threat categorization streams, and pipeline verification workloads.</p>
        </div>

        <div className="glass-panel border-slate-250/80 dark:border-white/10 rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-slate-900/30">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Telemetry & Volatility Metrics</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Aggregated tracking of claims classified across the system over the last 24 hours.</p>
            </div>
            <div className="flex items-center gap-4 text-sm font-mono">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded bg-[#00F0FF]" />
                <span className="text-slate-700 dark:text-slate-300">Verified Real ({stats.real})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded bg-[#AD00FF]" />
                <span className="text-slate-700 dark:text-slate-300">Verified Fake ({stats.fake})</span>
              </div>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#00F0FF" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFake" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#AD00FF" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#AD00FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke={isDark ? "rgba(255,255,255,0.3)" : "rgba(15,23,42,0.4)"} fontSize={11} tickLine={false} />
                <YAxis stroke={isDark ? "rgba(255,255,255,0.3)" : "rgba(15,23,42,0.4)"} fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    background: isDark ? 'rgba(5, 8, 17, 0.95)' : 'rgba(255, 255, 255, 0.95)', 
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0, 0, 0, 0.1)', 
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: isDark ? '#fff' : '#0f172a'
                  }} 
                />
                <Area type="monotone" dataKey="real" stroke="#00F0FF" strokeWidth={2} fillOpacity={1} fill="url(#colorReal)" />
                <Area type="monotone" dataKey="fake" stroke="#AD00FF" strokeWidth={2} fillOpacity={1} fill="url(#colorFake)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━ EMERGENCY ALERT VISUALIZATION ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">Emergency Alert Diagnostics</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">Pre-configured diagnostic frameworks classifying active threat properties.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Wildfire Indicators', desc: 'Preprocesses heat signals, thermal hotspots, evacuation alerts, and wind indexes.', type: 'fire', color: '#EF4444' },
            { title: 'Hydrological Spikes', desc: 'Evaluates rainfall spikes, storm surge data, high-water metrics, and river warnings.', type: 'water', color: '#3B82F6' },
            { title: 'Metereological Crises', desc: 'Scans air pressure anomalies, lightning maps, cyclone updates, and tornado sightings.', type: 'wind', color: '#10B981' },
            { title: 'Seismic Anomalies', desc: 'Monitors real-time Richter scales, epicenter reports, tsunami alerts, and volcanic activity.', type: 'earth', color: '#F59E0B' }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedThreat(idx)}
              className={`glass-panel border-slate-200 dark:border-white/10 rounded-2xl p-6 text-left cursor-pointer transition-all hover:border-[#00F0FF]/30 relative overflow-hidden group shadow-lg ${
                selectedThreat === idx ? 'border-[#00F0FF]/40 bg-[#00F0FF]/5 ring-1 ring-[#00F0FF]/20' : 'bg-white/85 dark:bg-slate-950/40'
              }`}
            >
              <div 
                className="absolute top-0 right-0 w-16 h-16 rounded-bl-full opacity-5 group-hover:opacity-10 transition-opacity"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex items-center gap-3 mb-4">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-[#00F0FF] transition-colors">{item.title}</h4>
              </div>
              <p className="text-sm text-slate-650 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              
              <div className="mt-4 flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-350 transition-colors">
                <span>SYSTEM PARAMETERS ACTIVE</span>
                <span className="animate-pulse">●</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━ GLOBAL CRISIS HEATMAP ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">Global Crisis Heatmap</h2>
          <p className="text-sm text-slate-700 dark:text-slate-300 max-w-md mx-auto">Tracking geopolitical threat nodes and rumor activity coordinates on a cybernetic visual grid.</p>
        </div>

        <div className="glass-panel border-slate-200 dark:border-white/10 rounded-3xl p-4 bg-white/80 dark:bg-slate-900/30 relative overflow-hidden shadow-2xl">
          {/* Cyber map representation - responsive height and theme-based map backdrop */}
          <div className="w-full h-64 sm:h-80 relative flex items-center justify-center bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
            
            {/* Dot Grid Map Overlay - opacity adjusted to be visible on both themes */}
            <div className="absolute inset-0 bg-cyber-grid opacity-20 dark:opacity-[0.03] scale-125" />
            
            {/* Blinking Danger Hotspots */}
            <div className="absolute top-1/4 left-1/3 group z-20 cursor-pointer">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"/>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 shadow-[0_0_10px_#ef4444]"/>
              </span>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 px-2.5 py-1 rounded text-xs text-slate-800 dark:text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-all w-28 text-center font-mono shadow-md z-30">
                California Fire Rumor Verified High Confidence
              </div>
            </div>

            <div className="absolute top-1/3 left-2/3 group z-20 cursor-pointer">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-yellow-500 shadow-[0_0_10px_#eab308]"></span>
              </span>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 px-2.5 py-1 rounded text-xs text-slate-800 dark:text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-all w-28 text-center font-mono shadow-md z-30">
                Europe Storm Panic Verifying...
              </div>
            </div>

            <div className="absolute top-2/3 left-3/4 group z-20 cursor-pointer">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 shadow-[0_0_10px_#3b82f6]"></span>
              </span>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 px-2.5 py-1 rounded text-xs text-slate-800 dark:text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-all w-28 text-center font-mono shadow-md z-30">
                Tokyo Tremor Log Verified 99%
              </div>
            </div>

            {/* Central scanning radar sweeper - responsive light/dark gradients */}
            <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(99,102,241,0.06)_0deg,transparent_120deg)] dark:bg-[conic-gradient(from_0deg_at_50%_50%,rgba(0,240,255,0.06)_0deg,transparent_120deg)] animate-[spin_8s_linear_infinite] pointer-events-none" />

            <div className="text-center space-y-2 pointer-events-none relative z-10 p-5 bg-white/90 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-white/5 backdrop-blur-md max-w-xs shadow-lg">
              <div className="flex justify-center gap-1">
                <Globe className="h-5 w-5 text-purple-600 dark:text-[#00F0FF] animate-spin-slow" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Spatial Node Mapping</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">Interactive telemetry mapping identifies crisis location vectors. Click glowing beacons to drill down on localized telemetry reports.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━ TRUSTED SOURCES ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">Verification Network Partners</h2>
          <p className="text-sm text-slate-650 dark:text-slate-400 max-w-md mx-auto">Cross-referencing telemetry claims with trusted global crisis authorities.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {[
            { name: 'USGS Seismics', label: 'Tectonic Ingestion' },
            { name: 'FEMA Alerts', label: 'Response Verification' },
            { name: 'NOAA Meteorology', label: 'Atmospheric Vectors' },
            { name: 'Red Cross Intel', label: 'Logistics Relief' },
            { name: 'WHO Disease Hub', label: 'Biological Streams' }
          ].map((partner, idx) => (
            <div 
              key={idx} 
              className="glass-panel border-slate-200 dark:border-white/5 rounded-2xl p-6 text-center bg-white/90 dark:bg-slate-950/30 flex flex-col justify-center items-center gap-2 hover:border-[#00F0FF]/20 transition-all hover:bg-slate-50 dark:hover:bg-slate-900/60"
            >
              <ShieldCheck className="h-6 w-6 text-purple-600 dark:text-[#00F0FF] mb-1 opacity-70" />
              <div className="text-xs font-black text-slate-900 dark:text-white">{partner.name}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{partner.label}</div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
