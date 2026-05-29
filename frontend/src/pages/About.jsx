import React from 'react';
import { Cpu, ShieldAlert, AlertTriangle, CheckSquare, Settings } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      {/* Title */}
      <div className="text-center space-y-3">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">NLP Engine Architecture</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          How AltheiaPulse leverages machine learning models to detect disaster rumors and alert public services.
        </p>
      </div>

      {/* Grid: Preprocessing steps */}
      <div className="glass-panel border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 bg-white/80 dark:bg-slate-900/30">
        <h2 className="font-display font-bold text-lg text-purple-600 dark:text-[#00F0FF] flex items-center gap-2">
          <Cpu className="h-5 w-5" />
          Text Preprocessing Steps
        </h2>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
          Text preprocessing is crucial for reducing dimensionality and noise in unstructured text. Before fitting features, our pipeline executes the following routines:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {[
            { step: '1. Lowercasing', desc: 'Standardizes all characters to avoid casing mismatches.' },
            { step: '2. Tokenization', desc: 'Splits raw statements into isolated term components.' },
            { step: '3. Stop-Word Removal', desc: 'Excludes high-frequency functional words that do not carry semantic weight (e.g., and, the).' },
            { step: '4. Punctuation Strip', desc: 'Filters structural symbols, brackets, and emoji clutter.' },
            { step: '5. Lemmatization Suffixes', desc: 'Applies basic morphological rule parsing to collapse variants into base stems.' }
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/40">
              <span className="font-semibold text-slate-900 dark:text-white block mb-1">{item.step}</span>
              <span className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Feature extraction & classification */}
      <div className="glass-panel border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 bg-white/80 dark:bg-slate-900/30">
        <h2 className="font-display font-bold text-lg text-indigo-600 dark:text-[#AD00FF] flex items-center gap-2">
          <Settings className="h-5 w-5 text-indigo-650 dark:text-[#AD00FF]" />
          Feature Engineering & Model Weights
        </h2>
        <div className="space-y-4 text-sm text-slate-755 dark:text-slate-300 leading-relaxed font-sans">
          <p>
            <strong>TF-IDF Vectorizer:</strong> Calculates terms using Term Frequency-Inverse Document Frequency. TF measures count weights, and IDF penalizes terms that appear frequently across all training corpus articles, highlighting unique crisis cues.
          </p>
          <p>
            <strong>Logistic Regression:</strong> Learns weight coefficients for vocabulary tokens. For a given input vector x, it outputs probability P(Real | x) = 1 / (1 + e^(-(w^T * x + b))).
          </p>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-slate-900/60 font-mono text-xs text-slate-700 dark:text-[#F8FAFC]">
            Probability Boundary Map:<br />
            - P(Real) &gt; 0.60 &rArr; Classified as VERIFIED [REAL]<br />
            - P(Real) &lt; 0.40 &rArr; Classified as HOAX [FAKE]<br />
            - 0.40 &le; P(Real) &le; 0.60 &rArr; Classified as UNVERIFIED [SUSPICIOUS]
          </div>
        </div>
      </div>

      {/* Risk levels explanation */}
      <div className="glass-panel border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 bg-white/80 dark:bg-slate-900/30">
        <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-amber-500" />
          Risk Levels Classification Model
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          {[
            { level: 'High Risk', class: 'text-purple-650 border-purple-500/20 bg-purple-50 dark:text-purple-400 dark:border-[#AD00FF]/30 dark:bg-[#AD00FF]/10', triggers: 'earthquake, explosion, terror, wildfire, shooter, bomb, attack, casualty' },
            { level: 'Medium Risk', class: 'text-amber-700 border-amber-500/20 bg-amber-50 dark:text-orange-400 dark:border-orange-500/20 dark:bg-orange-500/5', triggers: 'flood, cyclone, storm, hurricane, rain, power, warning' },
            { level: 'Low Risk', class: 'text-slate-600 border-slate-200 bg-slate-50 dark:text-slate-400 dark:border-white/10 dark:bg-slate-900/40', triggers: 'Normal warnings, general communications, non-critical rumors' }
          ].map((r, idx) => (
            <div key={idx} className={`p-4 rounded-xl border ${r.class} space-y-2`}>
              <span className="font-bold text-sm block">{r.level}</span>
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase block font-semibold mb-1">Keywords Triggers</span>
                <span className="font-mono leading-relaxed text-xs">{r.triggers}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
