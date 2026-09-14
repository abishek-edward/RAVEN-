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
  const { profile, switchRole, resetDemoData, navigateTo } = useRaven();
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
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <span>Authentication & Session Settings</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
          RAVEN Profile & Role Selector
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Civic Intelligence Platform — Role-Based Access Control
        </p>
      </div>

      {/* Role Selector Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Active Role
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Switch between Citizen and Administrator roles to test interface access control.
            </p>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
            Active Session
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
                ? 'border-teal-600 bg-teal-50/50 shadow-sm'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  !isAdmin ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  DC
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">Citizen</div>
                  <div className="text-[11px] text-slate-500">Role: Citizen Participant</div>
                </div>
              </div>
              {!isAdmin && <CheckCircle2 className="w-5 h-5 text-teal-600" />}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Explore schemes, report ground experiences anonymously, upload real evidence, submit civic complaints, and track your submissions.
            </p>

            <div className="text-[11px] font-semibold text-teal-800">
              Identity: Citizen (Chennai)
            </div>
          </button>

          {/* Admin Option */}
          <button
            type="button"
            onClick={() => handleRoleChange('Admin')}
            className={`p-5 rounded-lg border-2 text-left transition flex flex-col justify-between space-y-3 ${
              isAdmin
                ? 'border-amber-600 bg-amber-50/50 shadow-sm'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  isAdmin ? 'bg-amber-700 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  RA
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">Admin</div>
                  <div className="text-[11px] text-slate-500">Role: Platform Administrator</div>
                </div>
              </div>
              {isAdmin && <CheckCircle2 className="w-5 h-5 text-amber-600" />}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              View escalation queue, monitor civic clusters, review aggregated citizen evidence, generate collective grievances, and add official responses.
            </p>

            <div className="text-[11px] font-semibold text-amber-800">
              Identity: RAVEN Administrator
            </div>
          </button>
        </div>
      </div>

      {/* Privacy Notice Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-teal-700" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Privacy: Your reports are anonymous to the public
          </h2>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          In all public views across RAVEN (such as scheme experience feeds, civic issue cards, collective cluster summaries, and grievance petitions), all citizen submissions are explicitly rendered as <strong>"Anonymous Citizen"</strong> with district and date only. No names, phone numbers, email addresses, or personal identifiers are ever exposed.
        </p>
      </div>

      {/* Role Specific Actions */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
          Available Tools for {profile.role}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {!isAdmin ? (
            <>
              <button
                onClick={() => navigateTo('my-reports')}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-teal-500 bg-slate-50 hover:bg-white text-left transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="font-semibold text-slate-900">My Reports</div>
                    <div className="text-[11px] text-slate-500">View your private submissions</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => navigateTo('schemes')}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-teal-500 bg-slate-50 hover:bg-white text-left transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <div>
                    <div className="font-semibold text-slate-900">Commitments & Schemes</div>
                    <div className="text-[11px] text-slate-500">Report experience with public policies</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigateTo('admin')}
                className="p-3.5 rounded-lg border border-amber-300 hover:border-amber-500 bg-amber-50/50 hover:bg-amber-50 text-left transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <div>
                    <div className="font-semibold text-slate-900">Admin / Escalation Console</div>
                    <div className="text-[11px] text-slate-600">Review clusters & generate collective grievances</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => navigateTo('civic-issues')}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-white text-left transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-semibold text-slate-900">Civic Issues</div>
                    <div className="text-[11px] text-slate-500">Inspect municipal issue clusters</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Feedback & System Maintenance */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
          Feedback & Maintenance
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowFeedbackModal(!showFeedbackModal)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition"
          >
            <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
            <span>{showFeedbackModal ? 'Hide Feedback Form' : 'Give Platform Feedback'}</span>
          </button>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition border border-slate-300"
            title="Reset all data to default seeded state"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
            <span>Reset Platform Data</span>
          </button>

          {resetSuccess && (
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Platform data reset successfully
            </span>
          )}
        </div>

        {/* General Feedback Box */}
        {showFeedbackModal && (
          <div className="mt-4 pt-4 border-t border-slate-100">
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
