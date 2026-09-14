import React from 'react';
import { useRaven } from '../../context/RavenContext';
import TrustBadge from '../common/TrustBadge';
import { Building2, MapPin, Users, ArrowRight, FileCheck, MessageSquarePlus } from 'lucide-react';

export default function SchemeCard({ scheme }) {
  const { navigateTo, schemeAnalysis, schemeReports } = useRaven();

  const analysis = schemeAnalysis[scheme.id];
  const reportsForScheme = schemeReports.filter(r => r.schemeId === scheme.id);
  const totalReports = analysis?.totalCitizenReports || reportsForScheme.length;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <div>
        {/* Card Header: Trust Badge & Status */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <TrustBadge type={scheme.trustLabel} size="xs" />
          <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
            {scheme.officialStatus}
          </span>
        </div>

        {/* Scheme Name */}
        <h3 className="text-base font-semibold text-slate-900 leading-snug hover:text-teal-700 transition">
          {scheme.shortName || scheme.name}
        </h3>

        {/* Department & Location */}
        <div className="mt-3 space-y-1 text-xs text-slate-500">
          <div className="flex items-start gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
            <span className="line-clamp-1">{scheme.department}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{scheme.location}</span>
          </div>
        </div>

        {/* Simple Explanation Preview */}
        <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-100">
          {scheme.simpleEnglishExplanation}
        </p>

        {/* Metrics Banner */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="text-slate-400 text-[11px]">Citizen Reports</div>
            <div className="font-semibold text-slate-900 flex items-center gap-1 mt-0.5">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>{totalReports} reported</span>
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Gap Assessment</div>
            <div className="font-semibold text-purple-900 flex items-center gap-1 mt-0.5">
              <FileCheck className="w-3.5 h-3.5 text-purple-600" />
              <span className="text-[11px]">{analysis?.implementationGapStatus || 'Under Review'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
        <button
          onClick={() => navigateTo('scheme-detail', scheme.id)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded bg-slate-900 hover:bg-slate-800 text-white transition"
        >
          <span>Examine Reality</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => navigateTo('scheme-detail', { schemeId: scheme.id, openReport: true })}
          className="inline-flex items-center justify-center gap-1 text-xs font-semibold py-2 px-3 rounded bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 transition"
          title="Report an Issue with this Scheme"
        >
          <MessageSquarePlus className="w-3.5 h-3.5 text-teal-700" />
          <span>Report</span>
        </button>
      </div>
    </div>
  );
}
