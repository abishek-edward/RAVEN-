import React from 'react';
import TrustBadge from '../common/TrustBadge';
import { 
  Building2, 
  Users, 
  Clock, 
  FileCheck2, 
  MapPin, 
  AlertCircle,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export default function ImplementationGap({ scheme, analysis, reports }) {
  if (!analysis) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-6 text-center text-xs text-slate-500">
        Platform analysis data is currently compiling for this scheme.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 text-white p-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-medium text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4" />
            Platform Analysis
          </div>
          <h3 className="text-base font-bold text-white mt-0.5">
            Implementation Gap Analysis
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Factual comparison between announced government promises and ground citizen experiences.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TrustBadge type="ANALYSIS" size="sm" />
        </div>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {/* Left Column: Official Promise */}
        <div className="p-6 bg-slate-50/50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-600" />
              Official Government Promise
            </h4>
            <TrustBadge type={scheme.trustLabel} size="xs" />
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Policy Commitment</div>
              <div className="mt-0.5 font-medium text-slate-900 leading-relaxed">
                {scheme.objective}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Sanctioned Benefit</div>
              <div className="mt-0.5 text-slate-700 leading-relaxed bg-white p-2.5 rounded border border-slate-200 font-medium">
                {scheme.benefit}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Official Status Claim</div>
              <div className="mt-0.5 inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
                {scheme.officialStatus}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Eligibility & Required Documents</div>
              <p className="mt-0.5 text-slate-700 leading-relaxed">
                {scheme.eligibility}
              </p>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Official Source Record</div>
              <div className="mt-1 flex items-center gap-1.5 text-slate-700 font-medium">
                <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                <a
                  href={scheme.officialSource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-teal-800"
                >
                  {scheme.officialSource.name}
                </a>
                <span className="text-slate-400 text-[11px]">({scheme.officialSource.reference})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Citizen Reality */}
        <div className="p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-600" />
              Ground Reality & Feedback
            </h4>
            {reports && reports.some(r => !r.isSeeded) && (
              <TrustBadge type="CITIZEN" size="xs" />
            )}
          </div>

          <div className="space-y-4 text-xs">
            {/* Volume Stats */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
              <div>
                <div className="text-[10px] uppercase font-semibold text-slate-400">Reports</div>
                <div className="text-lg font-bold text-slate-900 mt-0.5">{analysis.totalCitizenReports}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold text-slate-400">Evidence Items</div>
                <div className="text-lg font-bold text-slate-900 mt-0.5">{analysis.evidenceCount}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold text-slate-400">Avg Delay</div>
                <div className="text-lg font-bold text-amber-700 mt-0.5">{analysis.averageDelayDays}d</div>
              </div>
            </div>

            {/* Clustered Problems Breakdown */}
            <div>
              <div className="text-[11px] font-semibold text-slate-600 uppercase mb-2">
                Clustered Citizen Problems
              </div>
              <div className="space-y-2">
                {analysis.breakdown.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 p-2 rounded border border-slate-100">
                    <div className="flex justify-between text-xs font-medium text-slate-800 mb-1">
                      <span>{item.category}</span>
                      <span className="font-semibold text-slate-900">
                        {item.count} reports {item.percentage ? `(${item.percentage}%)` : ''}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-purple-600 h-1.5 rounded-full"
                        style={{ width: `${item.percentage || Math.min(100, (item.count / analysis.totalCitizenReports) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Geographic Distribution */}
            {analysis.reportedDistricts && (
              <div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase flex items-center gap-1 mb-1">
                  <MapPin className="w-3 h-3" />
                  Reported Districts / Localities
                </div>
                <div className="flex flex-wrap gap-1">
                  {analysis.reportedDistricts.map((dist, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded text-[11px]"
                    >
                      {dist}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Platform Derived Assessment */}
            <div className="p-3 bg-purple-50 rounded border border-purple-200 text-purple-950">
              <div className="font-semibold text-xs flex items-center gap-1.5 mb-1 text-purple-900">
                <AlertCircle className="w-3.5 h-3.5 text-purple-600" />
                Platform Pattern Synthesis:
              </div>
              <p className="text-xs text-purple-900 leading-relaxed">
                "{analysis.platformSummary}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Official Response Status Section */}
      <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0" />
          <span className="font-semibold text-slate-700">Official Government Response Status:</span>
          {scheme.officialResponse ? (
            <span className="text-slate-900 font-medium">{scheme.officialResponse}</span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-bold border border-amber-300">
              No official response found yet.
            </span>
          )}
        </div>
        <div className="text-[11px] text-slate-500 italic">
          RAVEN platform reports non-official citizen observations and does not alter official government gazettes.
        </div>
      </div>
    </div>
  );
}
