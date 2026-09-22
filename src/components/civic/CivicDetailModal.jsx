import React, { useState } from 'react';
import { useRaven } from '../../context/RavenContext';
import TrustBadge from '../common/TrustBadge';
import ScoresDisplay from './ScoresDisplay';
import ConfirmationLoop from './ConfirmationLoop';
import OfficialChannelBox from '../common/OfficialChannelBox';
import { 
  X, 
  MapPin, 
  Building2, 
  Camera, 
  Users, 
  Layers, 
  FileText,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert
} from 'lucide-react';
import { resolveFastTriggerAuthority } from '../../utils/authorityResolver';
import { assessReportEvidence } from '../../utils/evidenceAssessor';

export default function CivicDetailModal({ clusterId, onClose }) {
  const { civicClusters, civicReports, profile, updateClusterStatus, t } = useRaven();

  const cluster = civicClusters.find(c => c.id === clusterId);
  const [selectedStatus, setSelectedStatus] = useState(cluster?.status || 'Ready');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusSuccess, setStatusSuccess] = useState(false);

  if (!cluster) return null;

  const handleUpdateStatus = async () => {
    if (profile.role !== 'Admin') return;
    setIsUpdatingStatus(true);
    setStatusSuccess(false);
    try {
      await updateClusterStatus(cluster.id, selectedStatus);
      setStatusSuccess(true);
      setTimeout(() => setStatusSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const clusteredReports = civicReports.filter(r => r.clusterId === cluster.id);

  // Collect all real uploaded attachments from clustered reports
  const allAttachments = clusteredReports.flatMap(r => r.attachments || []);
  const allImageAttachments = allAttachments.filter(a => a.type?.startsWith('image/') || a.previewUrl);

  // Fast Trigger Authority & Evidence Assessment resolution
  const fastTrigger = cluster.fastTrigger || resolveFastTriggerAuthority({
    category: cluster.category,
    location: cluster.location,
    district: cluster.district,
    cluster
  });

  const clusterEvidenceAssessment = assessReportEvidence({
    attachments: allImageAttachments,
    category: cluster.category,
    reportText: cluster.aiSummary
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 max-w-4xl w-full my-8 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-start justify-between bg-slate-50/70 dark:bg-slate-900/70">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 dark:bg-slate-700 text-white">
                {cluster.id}
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-200/80 dark:bg-slate-700 px-2 py-0.5 rounded">
                {cluster.category}
              </span>
              {cluster.status && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  cluster.status === 'Resolved' ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700' :
                  cluster.status === 'Escalation' ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-700' :
                  cluster.status === 'Monitoring' ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700' :
                  'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700'
                }`}>
                  Status: {cluster.status}
                </span>
              )}
              <TrustBadge type={cluster.trustLabel || 'ANALYSIS'} size="xs" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {cluster.title}
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{cluster.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{cluster.department}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 dark:text-slate-300">
          {/* Admin Issue Status Management Panel (Visible ONLY to Admin users) */}
          {profile.role === 'Admin' && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
                    Admin Issue Status Management
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 font-semibold">
                  Authorized Admin: {profile.name}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label htmlFor="adminStatusSelect" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Update Official Status:
                </label>
                <select
                  id="adminStatusSelect"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="text-xs font-semibold p-2 rounded border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Ready">Ready</option>
                  <option value="Escalation">Escalation</option>
                  <option value="Monitoring">Monitoring</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Active">Active</option>
                </select>
                <button
                  type="button"
                  onClick={handleUpdateStatus}
                  disabled={isUpdatingStatus || selectedStatus === cluster.status}
                  className="px-3.5 py-2 rounded bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                >
                  <span>{isUpdatingStatus ? 'Saving Status...' : 'Save Status Update'}</span>
                </button>
                {statusSuccess && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Status updated & saved to database!</span>
                  </span>
                )}
              </div>
            </div>
          )}
          {/* Government Fast Trigger Summary Card */}
          <div className="bg-blue-50/80 dark:bg-blue-950/40 p-4 rounded-lg border border-blue-200 dark:border-blue-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Government Fast Trigger Target</span>
              </div>
              <span className="font-mono text-[10px] bg-blue-200/80 dark:bg-blue-800 text-blue-900 dark:text-blue-100 px-2 py-0.5 rounded font-bold">
                {fastTrigger.ward}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-semibold">Identified Authority</span>
                <span className="font-bold text-slate-900 dark:text-white">{fastTrigger.department}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-semibold">Service Sector / Division</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{fastTrigger.sector}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-blue-200/60 dark:border-blue-800/60 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Reports Count</span>
                <span className="font-bold text-slate-900 dark:text-white">{fastTrigger.factualMetrics.reportsCount}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Confirmations</span>
                <span className="font-bold text-slate-900 dark:text-white">{fastTrigger.factualMetrics.confirmationsCount}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Evidence Submissions</span>
                <span className="font-bold text-slate-900 dark:text-white">{fastTrigger.factualMetrics.evidenceCount}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Persisted Duration</span>
                <span className="font-bold text-slate-900 dark:text-white">{fastTrigger.factualMetrics.durationDays} days</span>
              </div>
            </div>

            <div className="pt-2 border-t border-blue-200/60 dark:border-blue-800/60 text-[11px] flex flex-wrap items-center justify-between gap-2">
              <div className="text-slate-600 dark:text-slate-400">
                Official Status: <strong className="text-slate-900 dark:text-white">{fastTrigger.officialResponseStatus.text}</strong>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 italic">
                Trigger generated from factual cluster metrics
              </div>
            </div>
          </div>

          {/* AI Cluster Synthesis */}
          <div className="bg-purple-50/70 dark:bg-purple-950/40 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300 mb-1 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              Platform Clustered Synthesis
            </div>
            <p className="text-xs text-purple-950 dark:text-purple-200 leading-relaxed">
              "{cluster.aiSummary}"
            </p>
            {cluster.affectedLocations && (
              <div className="mt-2 pt-2 border-t border-purple-200/60 dark:border-purple-800 flex flex-wrap items-center gap-1">
                <span className="text-[11px] font-semibold text-purple-900 dark:text-purple-300">Correlated Streets:</span>
                {cluster.affectedLocations.map((loc, idx) => (
                  <span key={idx} className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded text-[11px] text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-700 font-medium">
                    {loc}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Dual Scores Display */}
          <div>
            <ScoresDisplay cluster={cluster} compact={false} />
          </div>

          {/* Citizen Evidence Gallery (Real Uploaded Images) */}
          {allImageAttachments.length > 0 && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
                  Evidence ({allImageAttachments.length} items)
                </h3>
                <div className="flex items-center gap-1.5">
                  <TrustBadge type="ANALYSIS" size="xs" />
                  <span className="text-[11px] font-medium text-purple-900 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-700">
                    {clusterEvidenceAssessment.label}
                  </span>
                </div>
              </div>

              {/* Factual Evidence Notice */}
              <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Evidence Assessment (Platform Analysis):</span> {clusterEvidenceAssessment.explanation}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {allImageAttachments.map((img, idx) => (
                  <div key={idx} className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-900/60">
                    <img
                      src={img.previewUrl}
                      alt={img.name}
                      className="w-full h-28 object-cover hover:scale-105 transition duration-200"
                    />
                    <div className="p-2 text-[11px]">
                      <div className="font-medium text-slate-800 dark:text-slate-200 truncate">{img.name}</div>
                      <div className="text-[10px] text-purple-700 dark:text-purple-300 mt-0.5 font-semibold">Platform Analysis 🟣</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirmation Loop ("Is this still a problem?") */}
          <div>
            <ConfirmationLoop clusterId={cluster.id} />
          </div>

          {/* Clustered Citizen Reports Section - STRICT ANONYMITY */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Correlated Ground Reports ({clusteredReports.length} visible in cluster)
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
                  All contributors anonymous
                </span>
                {clusteredReports.some(r => !r.isSeeded) && (
                  <TrustBadge type="CITIZEN" size="xs" />
                )}
              </div>
            </div>

            <div className="space-y-2.5">
              {clusteredReports.map((report) => (
                <div key={report.id} className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-800 transition space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                    <div className="flex items-center gap-2">
                      {/* STRICT ANONYMOUS DISPLAY */}
                      <span className="font-semibold text-slate-900 dark:text-white">Anonymous Contributor</span>
                      <span className="text-slate-400">• {report.location}</span>
                      {!report.isSeeded && (
                        <TrustBadge type="CITIZEN" size="xs" />
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[10px]">
                        {report.language}
                      </span>
                      <span className="text-slate-400">{report.date}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-800 dark:text-slate-200 font-sans leading-relaxed">
                    "{report.text}"
                  </p>

                  {/* Attachment previews */}
                  {report.attachments && report.attachments.length > 0 && (
                    <div className="pt-1.5 flex flex-wrap gap-2">
                      {report.attachments.map((att, aIdx) => (
                        <div key={aIdx} className="flex items-center gap-1.5 p-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px]">
                          {att.previewUrl ? (
                            <img src={att.previewUrl} alt={att.name} className="w-6 h-6 object-cover rounded border" />
                          ) : (
                            <FileText className="w-4 h-4 text-slate-400" />
                          )}
                          <span className="truncate max-w-[120px] font-medium text-slate-700 dark:text-slate-300">{att.name}</span>
                          {!report.isSeeded ? (
                            <span className="text-[10px] text-teal-700 dark:text-teal-400 font-semibold">• Evidence</span>
                          ) : (
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">• Photo Record</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Official Channel Recommendation */}
          <div>
            <OfficialChannelBox channelKey={cluster.officialChannelKey} />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded text-xs font-semibold transition"
          >
            {t('closeModal')}
          </button>
        </div>
      </div>
    </div>
  );
}
