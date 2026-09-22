import React from 'react';
import { useRaven } from '../../context/RavenContext';
import TrustBadge from '../common/TrustBadge';
import ScoresDisplay from './ScoresDisplay';
import { 
  Building2, 
  MapPin, 
  ArrowRight, 
  Camera
} from 'lucide-react';

import { resolveFastTriggerAuthority } from '../../utils/authorityResolver';

export default function CivicIssueCard({ cluster, onSelect }) {
  const { t } = useRaven();

  const fastTrigger = cluster.fastTrigger || resolveFastTriggerAuthority({
    category: cluster.category,
    location: cluster.location,
    district: cluster.district,
    cluster
  });

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <div>
        {/* Top Header: Category, ID, Trust Badge */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 dark:bg-slate-700 text-white">
              {cluster.id}
            </span>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/80 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-600">
              {cluster.category}
            </span>
            {cluster.status && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                cluster.status === 'Resolved' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800' :
                cluster.status === 'Escalation' ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-800' :
                cluster.status === 'Monitoring' ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-800' :
                'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800'
              }`}>
                {cluster.status}
              </span>
            )}
          </div>
          <TrustBadge type={cluster.trustLabel || 'ANALYSIS'} size="xs" />
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-400 transition">
          {cluster.title}
        </h3>

        {/* Location, Department & Ward Fast Trigger */}
        <div className="mt-2.5 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-700 dark:text-slate-300">{cluster.location}</span>
          </div>
          <div className="flex items-start gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
            <span className="line-clamp-1">{cluster.department}</span>
          </div>
          <div className="pt-0.5">
            <span className="font-mono text-[10px] bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800 inline-block">
              Target Authority: {fastTrigger.ward}
            </span>
          </div>
        </div>

        {/* Platform AI Synthesis preview */}
        <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded border border-slate-100 dark:border-slate-700">
          {cluster.aiSummary}
        </p>

        {/* Key Cluster Metrics Grid */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-slate-50 dark:bg-slate-900/60 p-2 rounded border border-slate-100 dark:border-slate-700">
            <div className="text-slate-400 text-[10px] uppercase font-semibold">{t('citizenReportsLabel')}</div>
            <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{cluster.reportsCount}</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/60 p-2 rounded border border-slate-100 dark:border-slate-700">
            <div className="text-slate-400 text-[10px] uppercase font-semibold">{t('confirmationsCountLabel')}</div>
            <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{cluster.confirmationsCount}</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/60 p-2 rounded border border-slate-100 dark:border-slate-700">
            <div className="text-slate-400 text-[10px] uppercase font-semibold flex items-center justify-center gap-1">
              <Camera className="w-3 h-3 text-teal-700 dark:text-teal-400" />
              <span>{t('evidenceCountLabel')}</span>
            </div>
            <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{cluster.evidenceCount}</div>
          </div>
        </div>

        {/* Dual Scores preview */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
          <ScoresDisplay cluster={cluster} compact={true} />
        </div>
      </div>

      {/* Action button */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700">
        <button
          onClick={() => onSelect(cluster.id)}
          className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white transition"
        >
          <span>{t('viewClusteredEvidenceBtn')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
