import React from 'react';
import { useRaven } from '../../context/RavenContext';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function ConfirmationLoop({ clusterId }) {
  const { confirmations, submitConfirmation, answeredConfirmationIds, t } = useRaven();

  const clusterConfirmations = confirmations[clusterId] || [];
  const last10 = clusterConfirmations.slice(0, 10);
  const stillProblemCount = last10.filter(c => c.isStillProblem).length;
  const totalCount = last10.length || 10;

  const userAnswer = answeredConfirmationIds[clusterId];

  return (
    <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          {t('confirmationLoopTitle')}
        </span>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{t('communityRealityCheck')}</span>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900 dark:text-white">
            {t('isThisStillAProblem')}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
            <strong className="text-slate-900 dark:text-white">{stillProblemCount}</strong> {t('confirmationStats').replace('{stillCount}', stillProblemCount).replace('{totalCount}', totalCount)}
          </div>
        </div>

        {userAnswer !== undefined ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-xs font-semibold text-slate-800 dark:text-slate-200">
            {userAnswer ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>{t('youConfirmedProblem')}</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{t('youConfirmedResolved')}</span>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => submitConfirmation(clusterId, true)}
              className="px-4 py-1.5 rounded bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition"
            >
              {t('btnYes')}
            </button>
            <button
              onClick={() => submitConfirmation(clusterId, false)}
              className="px-4 py-1.5 rounded bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition"
            >
              {t('btnNo')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
