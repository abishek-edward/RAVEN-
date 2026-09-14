import React from 'react';
import TrustBadge from '../common/TrustBadge';
import ScoresDisplay from './ScoresDisplay';
import { 
  Building2, 
  MapPin, 
  ArrowRight, 
  Camera
} from 'lucide-react';

export default function CivicIssueCard({ cluster, onSelect }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <div>
        {/* Top Header: Category, ID, Trust Badge */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
              {cluster.id}
            </span>
            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {cluster.category}
            </span>
          </div>
          <TrustBadge type={cluster.trustLabel || 'ANALYSIS'} size="xs" />
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 hover:text-blue-700 transition">
          {cluster.title}
        </h3>

        {/* Location & Department */}
        <div className="mt-2.5 space-y-1 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-700">{cluster.location}</span>
          </div>
          <div className="flex items-start gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
            <span className="line-clamp-1">{cluster.department}</span>
          </div>
        </div>

        {/* Platform AI Synthesis preview */}
        <p className="mt-3 text-xs text-slate-600 leading-relaxed line-clamp-2 bg-slate-50 p-2.5 rounded border border-slate-100">
          {cluster.aiSummary}
        </p>

        {/* Key Cluster Metrics Grid */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-slate-50 p-2 rounded">
            <div className="text-slate-400 text-[10px] uppercase font-semibold">Reports</div>
            <div className="font-bold text-slate-900 text-sm mt-0.5">{cluster.reportsCount}</div>
          </div>
          <div className="bg-slate-50 p-2 rounded">
            <div className="text-slate-400 text-[10px] uppercase font-semibold">Confirmations</div>
            <div className="font-bold text-slate-900 text-sm mt-0.5">{cluster.confirmationsCount}</div>
          </div>
          <div className="bg-slate-50 p-2 rounded">
            <div className="text-slate-400 text-[10px] uppercase font-semibold flex items-center justify-center gap-1">
              <Camera className="w-3 h-3 text-teal-700" />
              <span>Evidence</span>
            </div>
            <div className="font-bold text-slate-900 text-sm mt-0.5">{cluster.evidenceCount}</div>
          </div>
        </div>

        {/* Dual Scores preview */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <ScoresDisplay cluster={cluster} compact={true} />
        </div>
      </div>

      {/* Action button */}
      <div className="mt-5 pt-3 border-t border-slate-100">
        <button
          onClick={() => onSelect(cluster.id)}
          className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded bg-slate-900 hover:bg-slate-800 text-white transition"
        >
          <span>View Clustered Evidence & Confirm</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
