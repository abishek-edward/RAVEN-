import React from 'react';
import { useRaven } from '../../context/RavenContext';
import { ThumbsUp, Activity, HelpCircle, Check } from 'lucide-react';

export default function ScoresDisplay({ cluster, compact = false }) {
  const { supportCivicIssue, supportedClusterIds } = useRaven();

  const isSupported = supportedClusterIds.includes(cluster.id);
  const aiScore = cluster.aiPriorityData?.score || 75;
  const breakdown = cluster.aiPriorityData?.breakdown || {};
  const explanation = cluster.aiPriorityData?.explanation || '';

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        {/* Public Support Score */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-slate-400 font-medium">Public Support:</span>
          <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
            {cluster.publicSupportScore}/100
          </span>
        </div>

        {/* AI-Assisted Priority Score */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-slate-400 font-medium">AI-Assisted Priority:</span>
          <span className={`font-bold px-1.5 py-0.5 rounded border ${
            aiScore >= 80 
              ? 'bg-rose-50 text-rose-900 border-rose-200' 
              : aiScore >= 70 
              ? 'bg-amber-50 text-amber-900 border-amber-200' 
              : 'bg-slate-100 text-slate-800 border-slate-200'
          }`}>
            {aiScore}/100
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 1. Public Support Score Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Citizen Community Signal
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Citizen Upvotes</span>
        </div>

        <div className="mt-2 flex items-baseline justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-700">Public Support Score</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {cluster.publicSupportScore}<span className="text-sm font-normal text-slate-500">/100</span>
            </div>
          </div>

          <button
            onClick={() => supportCivicIssue(cluster.id)}
            disabled={isSupported}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded transition ${
              isSupported
                ? 'bg-emerald-100 text-emerald-900 cursor-default border border-emerald-300'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
            }`}
          >
            {isSupported ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span>Supported</span>
              </>
            ) : (
              <>
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>I am experiencing this too</span>
              </>
            )}
          </button>
        </div>

        <p className="mt-2 text-[11px] text-slate-500 leading-relaxed">
          Represents direct citizen corroboration from residents living or traveling through this area.
        </p>
      </div>

      {/* 2. AI-Assisted Priority Score Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" />
            Platform Priority Assessment
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Deterministic Formula</span>
        </div>

        <div className="mt-2 flex items-baseline justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-700">AI-Assisted Priority Score</div>
            <div className="text-2xl font-extrabold text-purple-950 mt-0.5">
              {aiScore}<span className="text-sm font-normal text-slate-500">/100</span>
            </div>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-medium border border-purple-200">
            {cluster.status}
          </span>
        </div>

        {/* Deterministic Factor Weights */}
        <div className="mt-3 pt-2 border-t border-slate-200 grid grid-cols-5 gap-1 text-[10px] text-center">
          <div className="bg-white p-1 rounded border border-slate-200">
            <div className="text-slate-400">Vol (30%)</div>
            <div className="font-semibold text-slate-800">{breakdown.volumeScore || 70}</div>
          </div>
          <div className="bg-white p-1 rounded border border-slate-200">
            <div className="text-slate-400">Sev (25%)</div>
            <div className="font-semibold text-slate-800">{breakdown.severityScore || 80}</div>
          </div>
          <div className="bg-white p-1 rounded border border-slate-200">
            <div className="text-slate-400">Dur (20%)</div>
            <div className="font-semibold text-slate-800">{breakdown.durationScore || 65}</div>
          </div>
          <div className="bg-white p-1 rounded border border-slate-200">
            <div className="text-slate-400">Spr (15%)</div>
            <div className="font-semibold text-slate-800">{breakdown.spreadScore || 75}</div>
          </div>
          <div className="bg-white p-1 rounded border border-slate-200">
            <div className="text-slate-400">Evd (10%)</div>
            <div className="font-semibold text-slate-800">{breakdown.evidenceScore || 85}</div>
          </div>
        </div>

        <p className="mt-2 text-[10px] text-slate-600 leading-relaxed italic">
          {explanation}
        </p>
      </div>
    </div>
  );
}
