import React from 'react';
import { useRaven } from '../context/RavenContext';
import TrustBadge from '../components/common/TrustBadge';
import { 
  Building2, 
  AlertCircle, 
  ArrowRight, 
  CheckCircle, 
  Map as MapIcon
} from 'lucide-react';

export default function LandingPage() {
  const { navigateTo, schemes, schemeReports, civicReports, civicClusters } = useRaven();

  // Distinct metrics - NEVER merged
  const totalSchemesTracked = schemes.length;
  const totalSchemeReports = schemeReports.length;
  const totalCivicReports = civicReports.length;
  const totalCivicClusters = civicClusters.length;

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-14 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-medium text-teal-400">
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            Civic Intelligence & Ground Corroboration
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Government Promises. <br />
            <span className="text-teal-400">Citizen Reality.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            RAVEN helps citizens understand government schemes and commitments, report their real-world experiences, and identify recurring civic issues through structured citizen evidence.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={() => navigateTo('schemes')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition shadow-sm"
            >
              <Building2 className="w-4 h-4" />
              <span>Explore Government Schemes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => navigateTo('civic-issues')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold text-xs transition"
            >
              <AlertCircle className="w-4 h-4 text-blue-400" />
              <span>Report a Civic Issue</span>
            </button>

            <button
              onClick={() => navigateTo('civic-map')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition"
            >
              <MapIcon className="w-4 h-4 text-amber-400" />
              <span>View Civic Map</span>
            </button>
          </div>
        </div>
      </section>

      {/* Useful Compact Summary Metrics — Strictly Separated */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm text-center">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Tracked Schemes
            </div>
            <div className="text-2xl font-bold text-teal-800 mt-1">{totalSchemesTracked}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Policy Commitments</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm text-center">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Scheme Citizen Reports
            </div>
            <div className="text-2xl font-bold text-teal-800 mt-1">{totalSchemeReports}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Ground Corroboration</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm text-center">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Everyday Civic Reports
            </div>
            <div className="text-2xl font-bold text-blue-800 mt-1">{totalCivicReports}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Neighborhood Submissions</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm text-center">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Monitored Civic Clusters
            </div>
            <div className="text-2xl font-bold text-purple-800 mt-1">{totalCivicClusters}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Correlated Issue Groups</div>
          </div>
        </div>
      </section>

      {/* Two Distinct Modules Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Platform Architecture
          </h2>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            Two Distinct Modules for Civic Accountability
          </p>
          <p className="text-xs text-slate-600 mt-1.5">
            RAVEN maintains strict operational separation between state policy commitments and everyday neighborhood civic infrastructure issues.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Module A Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between hover:border-teal-500/60 transition">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                  MODULE A
                </span>
                <span className="text-xs text-slate-500 font-medium">Policy Verification</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center text-teal-800 shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Government Commitments & Schemes
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    What was announced vs what citizens experience
                  </p>
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                Monitor announced schemes and projects (e.g. Pudhumai Penn, Breakfast Scheme, Magalir Urimai). Compare official gazettes against citizen reports to identify potential implementation gaps.
              </p>

              {/* Workflow Breakdown */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <div className="font-semibold text-slate-800 text-[11px] mb-1">Core Workflow:</div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 flex-wrap">
                  <span className="font-medium text-teal-700">Official Promise</span>
                  <span>&rarr;</span>
                  <span>Citizen Experience</span>
                  <span>&rarr;</span>
                  <span>Recurring Patterns</span>
                  <span>&rarr;</span>
                  <span className="font-semibold text-purple-700">Implementation Gap</span>
                </div>
              </div>

              <ul className="mt-4 space-y-1.5 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Dual simple explanations in English and தமிழ் (Tamil)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Scheme-specific citizen experience reports (Tamil, English, Tanglish)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Dynamic average reported delay indicators</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => navigateTo('schemes')}
                className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <span>Browse Tracked Schemes ({schemes.length})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Module B Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between hover:border-blue-500/60 transition">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                  MODULE B
                </span>
                <span className="text-xs text-slate-500 font-medium">Municipal Clustering</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-800 shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Everyday Civic Issues
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Neighborhood public infrastructure & clustering
                  </p>
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                Report streetlights, potholes, waste, and drainage problems. RAVEN correlates independent reports into collective issues to assess community priority without merging with policy schemes.
              </p>

              {/* Workflow Breakdown */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <div className="font-semibold text-slate-800 text-[11px] mb-1">Core Workflow:</div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 flex-wrap">
                  <span className="font-medium text-blue-700">Civic Report</span>
                  <span>&rarr;</span>
                  <span>AI Clustering</span>
                  <span>&rarr;</span>
                  <span>Public Support + Priority</span>
                  <span>&rarr;</span>
                  <span className="font-semibold text-amber-700">Collective Grievance</span>
                </div>
              </div>

              <ul className="mt-4 space-y-1.5 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Public Support Score (upvotes) + Deterministic AI Priority Score</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Confirmation Loop: "Is this still a problem?" (YES / NO)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Interactive Leaflet Map with priority clusters</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => navigateTo('civic-issues')}
                className="flex-1 py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <span>View Clustered Issues ({civicClusters.length})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigateTo('civic-map')}
                className="py-2.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
              >
                View Map
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Source Labeling Standard */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100/80 rounded-xl p-6 border border-slate-200">
          <div className="max-w-3xl mb-4">
            <h3 className="text-sm font-bold text-slate-900">
              Trust & Source Labeling Standard
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Every data point in RAVEN carries an explicit source classification to prevent misinformation and maintain public trust.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <TrustBadge type="OFFICIAL" size="sm" />
              <div className="font-semibold text-slate-900 mt-2">Officially Verified</div>
              <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                Directly from official government gazettes, department portals, and government orders.
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <TrustBadge type="CITIZEN" size="sm" />
              <div className="font-semibold text-slate-900 mt-2">Citizen-Reported</div>
              <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                Direct citizen submissions and ground experiences. Not automatically factually verified.
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <TrustBadge type="ANALYSIS" size="sm" />
              <div className="font-semibold text-slate-900 mt-2">Platform Analysis</div>
              <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                Derived statistical clustering, pattern synthesis, and priority scoring. Non-official.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
