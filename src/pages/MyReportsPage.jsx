import React, { useState } from 'react';
import { useRaven } from '../context/RavenContext';
import TrustBadge from '../components/common/TrustBadge';
import { 
  FileText, 
  Building2, 
  AlertCircle, 
  MapPin, 
  Calendar,
  ArrowRight,
  ShieldCheck,
  Lock
} from 'lucide-react';

export default function MyReportsPage() {
  const { profile, schemeReports, civicReports, schemes, navigateTo, t } = useRaven();

  const [activeTab, setActiveTab] = useState('schemes'); // 'schemes', 'civic'

  // Filter reports submitted by the active account
  const userSchemeReports = schemeReports.filter(r => 
    r.userId === profile.id || r.userId === 'demo-citizen-01' || r.citizenName === profile.name
  );
  
  const userCivicReports = civicReports.filter(r => 
    r.userId === profile.id || r.userId === 'demo-citizen-01' || r.reportedBy === profile.name
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Private Profile Header Box */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-900 dark:bg-slate-700 text-white font-bold text-lg flex items-center justify-center border-2 border-teal-500 shrink-0">
            {profile.avatar || 'DC'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{profile.name}</h1>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                {profile.role}
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {profile.district} District
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-teal-700 dark:text-teal-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Anonymous to the public
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-center text-xs">
          <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 min-w-[110px]">
            <div className="text-slate-400 text-[10px] uppercase font-semibold">{t('tabMySchemeReports')}</div>
            <div className="text-base font-bold text-teal-800 dark:text-teal-400 mt-0.5">{userSchemeReports.length}</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 min-w-[110px]">
            <div className="text-slate-400 text-[10px] uppercase font-semibold">{t('tabMyCivicReports')}</div>
            <div className="text-base font-bold text-blue-800 dark:text-blue-400 mt-0.5">{userCivicReports.length}</div>
          </div>
        </div>
      </div>

      {/* Privacy Guarantee Callout */}
      <div className="bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg p-4 text-xs flex items-center justify-between gap-3 text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-teal-700 dark:text-teal-400 shrink-0" />
          <div>
            <strong className="text-slate-900 dark:text-white">{t('privateSubmissionsView')}</strong> {t('privateSubmissionsDesc')}
          </div>
        </div>
        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
          {t('zeroPublicIdentifiers')}
        </span>
      </div>

      {/* Module Separation Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700 flex items-center gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('schemes')}
          className={`pb-3 border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'schemes'
              ? 'border-teal-600 text-teal-900 dark:text-teal-300 font-bold'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>{t('tabMySchemeReports')} ({userSchemeReports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('civic')}
          className={`pb-3 border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'civic'
              ? 'border-blue-600 text-blue-900 dark:text-blue-300 font-bold'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>{t('tabMyCivicReports')} ({userCivicReports.length})</span>
        </button>
      </div>

      {/* Tab 1: Module A Scheme Reports */}
      {activeTab === 'schemes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Your Contributions to Government Scheme Reality Tracking
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-teal-700 dark:text-teal-400 font-medium">
                Public display: Anonymous Citizen
              </span>
              <TrustBadge type="CITIZEN" size="xs" />
            </div>
          </div>

          {userSchemeReports.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-10 text-center text-xs text-slate-500 dark:text-slate-400 space-y-3">
              <p>{t('noUserSchemeReports')}</p>
              <button
                onClick={() => navigateTo('schemes')}
                className="px-4 py-2 bg-teal-800 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600 text-white rounded text-xs font-semibold"
              >
                Browse Schemes to Report Experience
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {userSchemeReports.map((report) => {
                const scheme = schemes.find(s => s.id === report.schemeId);
                return (
                  <div key={report.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-5 shadow-sm space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {scheme ? scheme.shortName : report.schemeId}
                        </span>
                        <span className="text-slate-400 text-xs ml-2">ID: {report.id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-medium">
                          {report.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Lang: {report.language}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-800 dark:text-slate-200 font-sans leading-relaxed">
                      "{report.reportText}"
                    </p>

                    {/* Attachments preview */}
                    {report.attachments && report.attachments.length > 0 && (
                      <div className="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-2 rounded border border-slate-100 dark:border-slate-700 flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
                        <span>Attached evidence: {report.attachments.map(a => a.name).join(', ')}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          Reported: {report.dateReported}
                        </span>
                        {report.delayDays && (
                          <span className="text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800 font-medium">
                            Delay: {report.delayDays} days
                          </span>
                        )}
                        <span className="text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800 font-medium">
                          Public: Anonymous Citizen
                        </span>
                      </div>

                      {scheme && (
                        <button
                          onClick={() => navigateTo('scheme-detail', scheme.id)}
                          className="text-teal-800 dark:text-teal-400 hover:text-teal-950 dark:hover:text-teal-200 font-semibold inline-flex items-center gap-1"
                        >
                          <span>View Scheme Reality Gap</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Module B Civic Reports */}
      {activeTab === 'civic' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Your Everyday Civic Issue Reports & Clustered Cases
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-teal-700 dark:text-teal-400 font-medium">
                Public display: Anonymous Citizen
              </span>
              <TrustBadge type="CITIZEN" size="xs" />
            </div>
          </div>

          {userCivicReports.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-10 text-center text-xs text-slate-500 dark:text-slate-400 space-y-3">
              <p>{t('noUserCivicReports')}</p>
              <button
                onClick={() => navigateTo('civic-issues')}
                className="px-4 py-2 bg-blue-800 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded text-xs font-semibold"
              >
                Report an Everyday Civic Issue
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {userCivicReports.map((report) => (
                <div key={report.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-5 shadow-sm space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-900 dark:bg-slate-700 text-white rounded">
                        {report.clusterId}
                      </span>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {report.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 font-medium">
                        {report.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {report.language}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-800 dark:text-slate-200 font-sans leading-relaxed">
                    "{report.text}"
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-3">
                      <span>Report ID: {report.id}</span>
                      <span>Date: {report.date}</span>
                      {report.durationDays && (
                        <span>Observed: {report.durationDays} days</span>
                      )}
                      <span className="text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800 font-medium">
                        Public: Anonymous Citizen
                      </span>
                    </div>

                    <button
                      onClick={() => navigateTo('civic-issues', report.clusterId)}
                      className="text-blue-800 dark:text-blue-400 hover:text-blue-950 dark:hover:text-blue-300 font-semibold inline-flex items-center gap-1"
                    >
                      <span>View Correlated Cluster</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
