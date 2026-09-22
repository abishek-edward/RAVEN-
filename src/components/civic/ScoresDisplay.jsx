import React from 'react';
import { useRaven } from '../../context/RavenContext';
import { ThumbsUp, Activity, HelpCircle, Check } from 'lucide-react';

export default function ScoresDisplay({ cluster, compact = false }) {
  const { supportCivicIssue, supportedClusterIds, t } = useRaven();

  const isSupported = supportedClusterIds.includes(cluster.id);
  const aiScore = cluster.aiPriorityData?.score || 75;
  const breakdown = cluster.aiPriorityData?.breakdown || {};
  const explanation = cluster.aiPriorityData?.explanation || '';

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        {/* Public Support Score */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-slate-400 dark:text-slate-400 font-medium">{t('publicSupportLabel')}</span>
          <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">
            {cluster.publicSupportScore}/100
          </span>
        </div>

        {/* AI-Assisted Priority Score */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-slate-400 dark:text-slate-400 font-medium">{t('aiAssistedPriorityLabel')}</span>
          <span className={`font-bold px-1.5 py-0.5 rounded border ${
            aiScore >= 80 
              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-300 border-rose-200 dark:border-rose-800' 
              : aiScore >= 70 
              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800' 
              : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-600'
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
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t('citizenCommunitySignal')}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-400 font-medium">{t('citizenUpvotes')}</span>
        </div>

        <div className="mt-2 flex items-baseline justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t('publicSupportScore')}</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {cluster.publicSupportScore}<span className="text-sm font-normal text-slate-500 dark:text-slate-400">/100</span>
            </div>
          </div>

          <button
            onClick={() => supportCivicIssue(cluster.id)}
            disabled={isSupported}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded transition ${
              isSupported
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 cursor-default border border-emerald-300 dark:border-emerald-700'
                : 'bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white shadow-sm'
            }`}
          >
            {isSupported ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                <span>{t('supportedBtn')}</span>
              </>
            ) : (
              <>
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{t('iAmExperiencingThisToo')}</span>
              </>
            )}
          </button>
        </div>

        <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
          {t('supportExplanation')}
        </p>
      </div>

      {/* 2. AI-Assisted Priority Score Box */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" />
            {t('platformPriorityAssessment')}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-400 font-mono">{t('deterministicFormula')}</span>
        </div>

        <div className="mt-2 flex items-baseline justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t('aiPriorityScore')}</div>
            <div className="text-2xl font-extrabold text-purple-950 dark:text-purple-200 mt-0.5">
              {aiScore}<span className="text-sm font-normal text-slate-500 dark:text-slate-400">/100</span>
            </div>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-900 dark:text-purple-300 font-medium border border-purple-200 dark:border-purple-800">
            {cluster.status}
          </span>
        </div>

        {/* Deterministic Factor Weights */}
        <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700 grid grid-cols-5 gap-1 text-[10px] text-center">
          <div className="bg-white dark:bg-slate-800 p-1 rounded border border-slate-200 dark:border-slate-700">
            <div className="text-slate-400">Vol (30%)</div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">{breakdown.volumeScore || 70}</div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-1 rounded border border-slate-200 dark:border-slate-700">
            <div className="text-slate-400">Sev (25%)</div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">{breakdown.severityScore || 80}</div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-1 rounded border border-slate-200 dark:border-slate-700">
            <div className="text-slate-400">Dur (20%)</div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">{breakdown.durationScore || 65}</div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-1 rounded border border-slate-200 dark:border-slate-700">
            <div className="text-slate-400">Spr (15%)</div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">{breakdown.spreadScore || 75}</div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-1 rounded border border-slate-200 dark:border-slate-700">
            <div className="text-slate-400">Evd (10%)</div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">{breakdown.evidenceScore || 85}</div>
          </div>
        </div>

        <p className="mt-2 text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed italic">
          {explanation}
        </p>
      </div>
    </div>
  );
}
