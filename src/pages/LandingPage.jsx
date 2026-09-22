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
  const { navigateTo, schemes, schemeReports, civicReports, civicClusters, t } = useRaven();

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
            {t('heroBadge')}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {t('heroTitlePart1')} <br />
            <span className="text-teal-400">{t('heroTitlePart2')}</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t('heroDescription')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={() => navigateTo('schemes')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition shadow-sm"
            >
              <Building2 className="w-4 h-4" />
              <span>{t('exploreSchemesBtn')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => navigateTo('civic-issues')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold text-xs transition"
            >
              <AlertCircle className="w-4 h-4 text-blue-400" />
              <span>{t('reportCivicBtn')}</span>
            </button>

            <button
              onClick={() => navigateTo('civic-map')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition"
            >
              <MapIcon className="w-4 h-4 text-amber-400" />
              <span>{t('viewCivicMapBtn')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Useful Compact Summary Metrics — Strictly Separated */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm text-center transition-colors">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t('metricTrackedSchemes')}
            </div>
            <div className="text-2xl font-bold text-teal-800 dark:text-teal-400 mt-1">{totalSchemesTracked}</div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{t('metricPolicyCommitments')}</div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm text-center transition-colors">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t('metricSchemeReports')}
            </div>
            <div className="text-2xl font-bold text-teal-800 dark:text-teal-400 mt-1">{totalSchemeReports}</div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{t('metricGroundCorroboration')}</div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm text-center transition-colors">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t('metricCivicReports')}
            </div>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-400 mt-1">{totalCivicReports}</div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{t('metricNeighborhoodSubmissions')}</div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm text-center transition-colors">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t('metricCivicClusters')}
            </div>
            <div className="text-2xl font-bold text-purple-800 dark:text-purple-400 mt-1">{totalCivicClusters}</div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{t('metricCorrelatedGroups')}</div>
          </div>
        </div>
      </section>

      {/* Two Distinct Modules Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t('platformArchitecture')}
          </h2>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {t('twoModulesTitle')}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5">
            {t('twoModulesDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Module A Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-between hover:border-teal-500/60 transition">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  {t('moduleA')}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('policyVerification')}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-950/80 flex items-center justify-center text-teal-800 dark:text-teal-300 shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {t('moduleATitle')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {t('moduleASubtitle')}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t('moduleADesc')}
              </p>

              {/* Workflow Breakdown */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                <div className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] mb-1">{t('coreWorkflow')}</div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
                  <span className="font-medium text-teal-700 dark:text-teal-400">Official Promise</span>
                  <span>&rarr;</span>
                  <span>Citizen Experience</span>
                  <span>&rarr;</span>
                  <span>Recurring Patterns</span>
                  <span>&rarr;</span>
                  <span className="font-semibold text-purple-700 dark:text-purple-400">Implementation Gap</span>
                </div>
              </div>

              <ul className="mt-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>Dual simple explanations in English and தமிழ் (Tamil)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>Scheme-specific citizen experience reports (Tamil, English, Tanglish)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>Dynamic average reported delay indicators</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => navigateTo('schemes')}
                className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm"
              >
                <span>{t('browseSchemesBtn')} ({schemes.length})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Module B Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-between hover:border-blue-500/60 transition">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {t('moduleB')}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('municipalClustering')}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/80 flex items-center justify-center text-blue-800 dark:text-blue-300 shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {t('moduleBTitle')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {t('moduleBSubtitle')}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t('moduleBDesc')}
              </p>

              {/* Workflow Breakdown */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                <div className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] mb-1">{t('coreWorkflow')}</div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
                  <span className="font-medium text-blue-700 dark:text-blue-400">Civic Report</span>
                  <span>&rarr;</span>
                  <span>AI Clustering</span>
                  <span>&rarr;</span>
                  <span>Public Support + Priority</span>
                  <span>&rarr;</span>
                  <span className="font-semibold text-amber-700 dark:text-amber-400">Collective Grievance</span>
                </div>
              </div>

              <ul className="mt-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>Public Support Score (upvotes) + Deterministic AI Priority Score</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>Confirmation Loop: "Is this still a problem?" (YES / NO)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>Interactive Leaflet Map with priority clusters</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <button
                onClick={() => navigateTo('civic-issues')}
                className="flex-1 py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm"
              >
                <span>{t('viewClusteredIssuesBtn')} ({civicClusters.length})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigateTo('civic-map')}
                className="py-2.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-semibold transition border border-transparent dark:border-slate-700"
              >
                {t('viewMapBtn')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Source Labeling Standard */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100/80 dark:bg-slate-900/60 rounded-xl p-6 border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="max-w-3xl mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {t('trustStandardTitle')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              {t('trustStandardDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
              <TrustBadge type="OFFICIAL" size="sm" />
              <div className="font-semibold text-slate-900 dark:text-slate-100 mt-2">{t('trustBadgeOfficial')}</div>
              <p className="text-slate-600 dark:text-slate-400 mt-1 text-[11px] leading-relaxed">
                {t('trustOfficialDesc')}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
              <TrustBadge type="CITIZEN" size="sm" />
              <div className="font-semibold text-slate-900 dark:text-slate-100 mt-2">{t('trustBadgeCitizen')}</div>
              <p className="text-slate-600 dark:text-slate-400 mt-1 text-[11px] leading-relaxed">
                {t('trustCitizenDesc')}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
              <TrustBadge type="ANALYSIS" size="sm" />
              <div className="font-semibold text-slate-900 dark:text-slate-100 mt-2">{t('trustBadgeAnalysis')}</div>
              <p className="text-slate-600 dark:text-slate-400 mt-1 text-[11px] leading-relaxed">
                {t('trustAnalysisDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
