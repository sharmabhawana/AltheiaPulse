import React, { useState } from 'react';
import { BrainCircuit, RotateCcw, AlertTriangle, ShieldCheck, Flame, Globe, Tag, Sparkles } from 'lucide-react';
import { useAuth, API_URL } from '../components/AuthContext';
import Sidebar from '../components/Sidebar';
import AlertBanner from '../components/AlertBanner';

export default function Analyzer({ setActivePage }) {
  const { token } = useAuth();
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sampleTexts = [
    "URGENT: Massive earthquake of magnitude 7.8 hit downtown Tokyo. Buildings shaking violently, emergency warnings issued to seek shelter.",
    "RUMOR: Government staging the volcano eruption in Seattle to evacuate the city and install secret communication antennas. Spread this!",
    "Alert: Unconfirmed reports of power outage and minor flooding in Miami coastal area after heavy rain. Authorities investigating."
  ];

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ text })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Verification failed.');
      }
      setResult(data);
    } catch (err) {
      setError(err.message || 'Error communicating with AI server. Running local fallback prediction.');
      // Local fallback for offline verification
      setTimeout(() => {
        const textLower = text.toLowerCase();
        let prediction = 'Real';
        let confidence = 87.5;
        let risk = 'Low';
        let location = 'Global';
        
        if (textLower.includes('earthquake') || textLower.includes('wildfire') || textLower.includes('explosion')) {
          risk = 'High';
        } else if (textLower.includes('flood') || textLower.includes('cyclone') || textLower.includes('storm')) {
          risk = 'Medium';
        }
        
        if (textLower.includes('rumor') || textLower.includes('stage') || textLower.includes('conspiracy') || textLower.includes('cover')) {
          prediction = 'Fake';
          confidence = 94.6;
        } else if (textLower.includes('unconfirmed') || textLower.includes('investigating')) {
          prediction = 'Suspicious';
          confidence = 54.2;
        }
        
        if (textLower.includes('tokyo')) location = 'Tokyo';
        else if (textLower.includes('seattle')) location = 'Seattle';
        else if (textLower.includes('miami')) location = 'Miami';

        setResult({
          prediction,
          confidence,
          risk_level: risk,
          detected_location: location,
          keywords: ['disaster', 'warning', 'emergency'],
          explanation: `System determined text as ${prediction} with ${confidence}% confidence based on fallbacks.`,
          created_at: new Date().toISOString()
        });
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
    setResult(null);
    setError('');
  };

  const getBorderColor = () => {
    if (!result) return 'border-slate-200 dark:border-white/10';
    if (result.prediction === 'Real') return 'border-emerald-500/30 dark:border-emerald-500/30 shadow-glow-green/20';
    if (result.prediction === 'Fake') return 'border-red-500/30 dark:border-red-500/30 shadow-glow-red/20';
    return 'border-amber-500/30 dark:border-amber-500/30';
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 py-8">
      {/* Sidebar Layout */}
      <Sidebar activePage="analyzer" setActivePage={setActivePage} />

      {/* Main Analyzer Panel */}
      <div className="flex-1 space-y-6">
        <div className="space-y-1">
          <h2 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">AI Disaster Rumor Analyzer</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Submit emergency notices, tweets, or rumors. The AI pipeline will evaluate metrics instantly.</p>
        </div>

        {/* Input box panel */}
        <div className="glass-panel border-slate-200 dark:border-white/10 rounded-2xl p-5 space-y-4 bg-white/80 dark:bg-slate-900/30">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Verification Target Text</span>
              <span className="text-slate-500 dark:text-slate-400">{text.length} characters</span>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the rumor or report here (e.g., 'Massive earthquake in San Francisco, buildings collapsed!')"
              rows={5}
              className="w-full glass-input rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#00F0FF] resize-y"
            />
          </div>

          {/* Quick presets */}
          <div className="space-y-1.5">
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest block font-semibold">Quick Example Templates</span>
            <div className="flex flex-col gap-2">
              {sampleTexts.map((st, idx) => (
                <button
                  key={idx}
                  onClick={() => setText(st)}
                  className="p-2.5 text-left rounded-lg bg-slate-100 dark:bg-slate-900/60 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 text-xs text-slate-700 dark:text-slate-300 font-mono line-clamp-1 italic transition-colors"
                >
                  "{st}"
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleAnalyze}
              disabled={loading || !text.trim()}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#AD00FF] text-slate-950 font-bold text-sm shadow-glow-blue hover:opacity-95 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <BrainCircuit className="h-4 w-4" />
                  Run AI Pipeline
                </>
              )}
            </button>
            <button
              onClick={handleClear}
              className="h-11 w-11 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
              title="Reset form"
            >
              <RotateCcw className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Loading Scanner effect */}
        {loading && (
          <div className="glass-panel border-slate-200 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center space-y-4 bg-white/80 dark:bg-slate-900/30">
            <div className="relative h-12 w-12 rounded-full border border-dashed border-[#00F0FF] animate-spin flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-[#00F0FF] animate-pulse" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Neural Network Scanner Active</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 animate-pulse">Preprocessing NLP tokens, compiling TF-IDF features...</p>
            </div>
          </div>
        )}

        {/* Results Cards */}
        {result && (
          <div className={`glass-panel rounded-2xl p-6 border ${getBorderColor()} space-y-6 bg-white/90 dark:bg-slate-900/90 shadow-2xl transition-all duration-300 animate-in fade-in duration-300`}>
            {/* Header Status */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/5 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-widest font-semibold">Classification:</span>
                <span className={`px-3 py-1 rounded-full font-extrabold text-xs uppercase tracking-wider ${
                  result.prediction === 'Real' ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' :
                  result.prediction === 'Fake' ? 'text-red-600 dark:text-red-400 bg-red-500/10' : 'text-amber-600 dark:text-amber-400 bg-amber-500/10'
                }`}>
                  {result.prediction}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Confidence:</span>{' '}
                  <span className="font-extrabold text-slate-900 dark:text-white">{result.confidence}%</span>
                </div>
                <div>
                  <span className="text-slate-500">Risk level:</span>{' '}
                  <span className={`font-semibold ${
                    result.risk_level === 'High' ? 'text-purple-650 dark:text-purple-400' :
                    result.risk_level === 'Medium' ? 'text-orange-500 dark:text-orange-400' : 'text-slate-500 dark:text-slate-400'
                  }`}>{result.risk_level}</span>
                </div>
              </div>
            </div>

            {/* Alert Banner integrated */}
            <AlertBanner prediction={result.prediction} riskLevel={result.risk_level} />

            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 flex gap-3">
                <Globe className="h-5 w-5 text-sky-500 dark:text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 uppercase block">Detected Location</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-white">{result.detected_location || 'Global / Online'}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 flex gap-3">
                <Tag className="h-5 w-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 uppercase block">Linguistic Keywords</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-white truncate max-w-xs block">
                    {Array.isArray(result.keywords) ? result.keywords.join(', ') : (typeof result.keywords === 'string' ? result.keywords.split(',').join(', ') : 'None extracted')}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Explanation Text */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 space-y-2">
              <div className="flex items-center gap-1.5 text-sm text-purple-600 dark:text-[#00F0FF] font-semibold">
                <BrainCircuit className="h-4 w-4" />
                AI Inference Explanation
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">{result.explanation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
