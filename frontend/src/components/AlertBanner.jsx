import React from 'react';
import { AlertOctagon, CheckCircle2, ShieldAlert, Info } from 'lucide-react';

export default function AlertBanner({ prediction, riskLevel }) {
  if (!prediction) return null;

  const isFake = prediction.toLowerCase() === 'fake';
  const isReal = prediction.toLowerCase() === 'real';
  const isSuspicious = prediction.toLowerCase() === 'suspicious';
  const isHighRisk = riskLevel?.toLowerCase() === 'high';

  return (
    <div className="space-y-3 w-full">
      {/* 1. Fake Prediction Banner */}
      {isFake && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 shadow-glow-red animate-pulse">
          <AlertOctagon className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-red-400">CRITICAL HOAX FLAGGED</h4>
            <p className="text-sm text-red-300/90 mt-1">
              The AI classifier has determined with high probability that this emergency claim is fake/misinformation. Please do not spread this claim!
            </p>
          </div>
        </div>
      )}

      {/* 2. High Risk Alert Banner */}
      {isHighRisk && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-[#AD00FF]/30 bg-[#AD00FF]/10 text-purple-200 shadow-glow-purple">
          <ShieldAlert className="h-5 w-5 text-[#AD00FF] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-[#AD00FF] text-glow-purple">EMERGENCY RISK WARNING</h4>
            <p className="text-sm text-purple-300/90 mt-1">
              This post contains references to severe disasters (earthquake, explosion, wildfire). High structural danger or physical security threat is detected.
            </p>
          </div>
        </div>
      )}

      {/* 3. Real Verified Banner */}
      {isReal && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 shadow-glow-green">
          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-emerald-400">VERIFIED EMERGENCY SIGNAL</h4>
            <p className="text-sm text-emerald-300/90 mt-1">
              AI classified: VERIFIED. This text pattern corresponds to legitimate disaster updates and official crisis notifications.
            </p>
          </div>
        </div>
      )}

      {/* 4. Suspicious/Uncertain Banner */}
      {isSuspicious && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200">
          <Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-400">SUSPICIOUS - UNVERIFIED PATH</h4>
            <p className="text-sm text-amber-300/90 mt-1">
              The neural classifier detected conflicting signals. This rumor is unverified. Consult local emergency channels.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
