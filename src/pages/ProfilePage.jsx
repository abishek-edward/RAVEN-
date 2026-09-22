import React, { useState } from 'react';
import { useRaven } from '../context/RavenContext';
import FeedbackBox from '../components/common/FeedbackBox';
import { 
  ShieldCheck, 
  ShieldAlert, 
  RotateCcw, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

export default function ProfilePage() {
  const { profile, switchRole, resetDemoData, navigateTo, t, officialSession } = useRaven();
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleRoleChange = (role) => {
    switchRole(role);
  };

  const handleReset = () => {
    if (window.confirm('Reset all platform records back to default initial state?')) {
      resetDemoData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  const isAdmin = profile.role === 'Admin';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <span>{t('authSettingsTitle')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
          {t('profilePageTitle')}
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
          {t('profilePageSubtitle')}
        </p>
      </div>

      {/* Role Selector Card */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              {t('activeRole')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t('roleSelectorDesc')}
            </p>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 font-semibold">
            {t('activeSession')}
          </span>
        </div>

        {/* Big Role Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Citizen Option */}
          <button
            type="button"
            onClick={() => handleRoleChange('Citizen')}
            className={`p-5 rounded-lg border-2 text-left transition flex flex-col justify-between space-y-3 ${
              !isAdmin
                ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/40 shadow-sm'
                : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  !isAdmin ? 'bg-teal-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                  DC
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">{t('citizenRoleTitle')}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{t('citizenRoleRoleDesc')}</div>
                </div>
              </div>
              {!isAdmin && <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('citizenRoleExplanation')}
            </p>

            <div className="text-[11px] font-semibold text-teal-800 dark:text-teal-400">
              Identity: Citizen (Chennai)
            </div>
          </button>

          {/* Admin Option */}
          <button
            type="button"
            onClick={() => handleRoleChange('Admin')}
            className={`p-5 rounded-lg border-2 text-left transition flex flex-col justify-between space-y-3 ${
              isAdmin
                ? 'border-amber-600 bg-amber-50/50 dark:bg-amber-950/40 shadow-sm'
                : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  isAdmin ? 'bg-amber-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                  RA
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">{t('adminRoleTitle')}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{t('adminRoleRoleDesc')}</div>
                </div>
              </div>
              {isAdmin && <CheckCircle2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('adminRoleExplanation')}
            </p>

            <div className="text-[11px] font-semibold text-amber-800 dark:text-amber-400">
              Identity: RAVEN Administrator
            </div>
          </button>
        </div>
      </div>

      {/* Privacy Notice Card */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-teal-700 dark:text-teal-400" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
            {t('sessionPrivacyGuarantee')}
          </h2>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {t('sessionPrivacyExplanation')}
        </p>
      </div>

      {/* Role Specific Actions */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-700">
          Available Tools for {profile.role}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {!isAdmin ? (
            <>
              <button
                onClick={() => navigateTo('my-reports')}
                className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-400 bg-slate-50 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-700/60 text-left transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">{t('navMyReports')}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">View your private submissions</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => navigateTo('schemes')}
                className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-400 bg-slate-50 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-700/60 text-left transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">{t('navSchemes')}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Report experience with public policies</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigateTo('admin')}
                className="p-3.5 rounded-lg border border-amber-300 dark:border-amber-700 hover:border-amber-500 bg-amber-50/50 dark:bg-amber-950/40 hover:bg-amber-50 dark:hover:bg-amber-900/40 text-left transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">{t('navAdmin')}</div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400">Review clusters & generate collective grievances</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => navigateTo('civic-issues')}
                className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 bg-slate-50 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-700/60 text-left transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">{t('navCivicIssues')}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Inspect municipal issue clusters</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Government Official Console Access (Admin Only) */}
      {isAdmin && (
        <div className="bg-white dark:bg-slate-800 border border-teal-200 dark:border-teal-800/60 rounded-xl p-6 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                GO
              </div>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Government Official Console
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Restricted console with server-side SQL-enforced ward filtering.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigateTo('official-portal')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition"
            >
              <span>{officialSession ? `Open Console (${officialSession.username})` : 'Access Official Portal'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Demo prototype accounts seeded for Perambur, Anna Nagar, Velachery, and T. Nagar. The dashboard enforces SQL jurisdiction filtering without removing existing Citizen or Admin roles.
          </p>
        </div>
      )}

      {/* Feedback & System Maintenance */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-700">
          Feedback & Maintenance
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowFeedbackModal(!showFeedbackModal)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-teal-700 dark:hover:bg-teal-600 text-white text-xs font-semibold transition"
          >
            <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
            <span>{showFeedbackModal ? 'Hide Feedback Form' : t('giveFeedbackBtn')}</span>
          </button>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-semibold transition border border-slate-300 dark:border-slate-600"
            title="Reset all data to default seeded state"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{t('resetPlatformData')}</span>
          </button>

          {resetSuccess && (
            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> {t('resetSuccessMsg')}
            </span>
          )}
        </div>

        {/* General Feedback Box */}
        {showFeedbackModal && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <FeedbackBox
              feedbackType="General Feedback"
              onComplete={() => {}}
            />
          </div>
        )}
      </div>
    </div>
  );
}
