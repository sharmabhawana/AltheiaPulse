import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, AlertTriangle, ShieldCheck, HelpCircle, FileDown } from 'lucide-react';
import { useAuth, API_URL } from '../components/AuthContext';
import Sidebar from '../components/Sidebar';

export default function History({ setActivePage }) {
  const { token, user } = useAuth();
  const [predictions, setPredictions] = useState([]);
  const [search, setSearch] = useState('');
  const [filterPred, setFilterPred] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (filterPred) queryParams.append('prediction', filterPred);
      
      const response = await fetch(`${API_URL}/api/history?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setPredictions(data);
      }
    } catch (e) {
      // Mock local fallback
      const mockHistory = [
        {
          id: 1,
          input_text: "Severe wildfire reported in Northern California. Air quality warning issued.",
          prediction: "Real",
          confidence: 94.2,
          risk_level: "High",
          detected_location: "California",
          keywords: ["wildfire", "california", "warning"],
          explanation: "Inference matched verified disaster report templates.",
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 2,
          input_text: "Conspiracy: Alien spaceship crashed near Sydney, local authorities covering it up.",
          prediction: "Fake",
          confidence: 98.1,
          risk_level: "Low",
          detected_location: "Sydney",
          keywords: ["alien", "conspiracy", "authorities"],
          explanation: "Linguistic patterns matched conspiracy rumor datasets.",
          created_at: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: 3,
          input_text: "Suspicious explosion sound reported near Tokyo train station. Under investigation.",
          prediction: "Suspicious",
          confidence: 58.4,
          risk_level: "High",
          detected_location: "Tokyo",
          keywords: ["explosion", "tokyo", "suspicious"],
          explanation: "Linguistic content exhibits warning signs but lacks source validation.",
          created_at: new Date(Date.now() - 14400000).toISOString()
        }
      ];
      // Filter locally
      let filtered = mockHistory;
      if (search) {
        filtered = filtered.filter(p => p.input_text.toLowerCase().includes(search.toLowerCase()) || p.detected_location.toLowerCase().includes(search.toLowerCase()));
      }
      if (filterPred) {
        filtered = filtered.filter(p => p.prediction === filterPred);
      }
      setPredictions(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchHistory();
    }
  }, [search, filterPred, token]);

  const downloadReport = (pred) => {
    // Generate ASCII report simulating a PDF
    const textReport = `
============================================================
           ALTHEIAPULSE VERIFICATION INTELLIGENCE REPORT
============================================================
Report Generated: ${new Date().toLocaleString()}
Document ID: AP-REP-${pred.id}
User Account: ${user?.full_name} (${user?.email})
------------------------------------------------------------
VERIFICATION ITEM:
"${pred.input_text}"

INFERENCE VERDICT:
Status:             [ ${pred.prediction.toUpperCase()} ]
Confidence Score:   ${pred.confidence}%
Risk Assessment:    ${pred.risk_level} Risk
Location:           ${pred.detected_location || 'Global / Online'}
Keywords Extracted: ${pred.keywords ? pred.keywords.join(', ') : 'None'}
Timestamp Logged:   ${new Date(pred.created_at).toLocaleString()}
------------------------------------------------------------
AI CLASSIFIER ANALYSIS:
${pred.explanation}
------------------------------------------------------------
This report is generated automatically by AltheiaPulse's
TF-IDF & Logistic Regression NLP evaluation engine.
============================================================
`;
    const element = document.createElement("a");
    const file = new Blob([textReport], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `AltheiaPulse_Report_${pred.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 py-8">
      <Sidebar activePage="history" setActivePage={setActivePage} />

      <div className="flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">Prediction History</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Search and manage previous rumor checks and download verification reports.</p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="sm:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reports by text keyword or location..."
              className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm font-sans"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <select
              value={filterPred}
              onChange={(e) => setFilterPred(e.target.value)}
              className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm no-appearance cursor-pointer font-sans"
            >
              <option value="">All Classification Verdicts</option>
              <option value="Real">Real Only</option>
              <option value="Fake">Fake Only</option>
              <option value="Suspicious">Suspicious Only</option>
            </select>
          </div>
        </div>

        {/* Table content */}
        <div className="glass-panel border-slate-200 dark:border-white/10 rounded-2xl p-5 bg-white/80 dark:bg-slate-900/30 shadow-xl">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-6 w-6 border-2 border-[#00F0FF] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : predictions.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <p className="text-sm text-slate-550 dark:text-slate-400 font-sans">No predictions found.</p>
              <button
                onClick={() => setActivePage('analyzer')}
                className="text-xs text-purple-600 dark:text-[#00F0FF] font-semibold hover:underline font-sans"
              >
                Analyze your first rumor now &rarr;
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-white/5 text-slate-500 dark:text-slate-400 font-semibold font-sans">
                    <th className="pb-3 pl-2">Input Statement</th>
                    <th className="pb-3">Verdict</th>
                    <th className="pb-3">Confidence</th>
                    <th className="pb-3">Risk</th>
                    <th className="pb-3">Location</th>
                    <th className="pb-3">Date & Time</th>
                    <th className="pb-3 pr-2 text-right">Report</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300">
                  {predictions.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-4 pl-2 font-mono max-w-sm truncate pr-4 text-xs" title={p.input_text}>
                        {p.input_text}
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                          p.prediction === 'Real' ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' :
                          p.prediction === 'Fake' ? 'text-red-650 dark:text-red-400 bg-red-500/10' : 'text-amber-600 dark:text-amber-400 bg-amber-500/10'
                        }`}>
                          {p.prediction}
                        </span>
                      </td>
                      <td className="py-4 font-semibold text-slate-900 dark:text-white text-xs">{p.confidence}%</td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          p.risk_level === 'High' ? 'text-purple-600 dark:text-purple-400 bg-[#AD00FF]/15' :
                          p.risk_level === 'Medium' ? 'text-amber-700 dark:text-orange-400 bg-orange-500/10' : 'text-slate-500 dark:text-slate-400 bg-slate-500/10'
                        }`}>
                          {p.risk_level}
                        </span>
                      </td>
                      <td className="py-4 font-sans text-xs">{p.detected_location || 'Global'}</td>
                      <td className="py-4 text-slate-500 dark:text-slate-400 font-sans text-xs">
                        {new Date(p.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="py-4 pr-2 text-right">
                        <button
                          onClick={() => downloadReport(p)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 hover:border-purple-500/30 dark:hover:border-[#00F0FF]/30 hover:bg-purple-50 dark:hover:bg-[#00F0FF]/5 text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-[#00F0FF] transition-all"
                          title="Download Text Report"
                        >
                          <FileDown className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
