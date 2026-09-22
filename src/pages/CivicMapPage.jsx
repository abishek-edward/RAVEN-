import React from 'react';
import { useRaven } from '../context/RavenContext';
import CivicLeafletMap from '../components/map/CivicLeafletMap';
import CivicDetailModal from '../components/civic/CivicDetailModal';
import TrustBadge from '../components/common/TrustBadge';
import { MapPin, AlertCircle, ArrowLeft } from 'lucide-react';

export default function CivicMapPage() {
  const { navigateTo, selectedClusterId, setSelectedClusterId, t } = useRaven();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
        <div>
          <button
            onClick={() => navigateTo('civic-issues')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('backToCivicIssues')}
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t('civicMapTitle')}
            </h1>
            <TrustBadge type="ANALYSIS" size="xs" />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            {t('civicMapDesc')}
          </p>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded border border-slate-200 dark:border-slate-700 font-medium">
          {t('districtChennai')} Metropolitan Region
        </div>
      </div>

      {/* Leaflet Map */}
      <div>
        <CivicLeafletMap onSelectCluster={(id) => setSelectedClusterId(id)} />
      </div>

      {/* Cluster Detail Modal */}
      {selectedClusterId && (
        <CivicDetailModal
          clusterId={selectedClusterId}
          onClose={() => setSelectedClusterId(null)}
        />
      )}
    </div>
  );
}
