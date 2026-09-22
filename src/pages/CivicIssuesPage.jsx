import React, { useState } from 'react';
import { useRaven } from '../context/RavenContext';
import CivicIssueCard from '../components/civic/CivicIssueCard';
import CivicReportForm from '../components/civic/CivicReportForm';
import CivicDetailModal from '../components/civic/CivicDetailModal';
import TrustBadge from '../components/common/TrustBadge';
import { 
  AlertCircle, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Plus, 
  Map as MapIcon,
  Layers,
  Sparkles
} from 'lucide-react';

export default function CivicIssuesPage() {
  const { civicClusters, navigateTo, selectedClusterId, setSelectedClusterId, t } = useRaven();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('priority'); // 'priority', 'reported', 'supported', 'latest'
  const [showReportForm, setShowReportForm] = useState(false);

  const categories = ['All', 'Street Infrastructure', 'Roads', 'Waste', 'Drainage', 'Water', 'Public Facilities'];

  // Sorting & filtering logic
  const filteredClusters = civicClusters.filter((cluster) => {
    const matchesSearch = 
      cluster.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cluster.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cluster.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || cluster.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || cluster.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'priority') {
      return (b.aiPriorityData?.score || 0) - (a.aiPriorityData?.score || 0);
    }
    if (sortBy === 'reported') {
      return b.reportsCount - a.reportsCount;
    }
    if (sortBy === 'supported') {
      return b.publicSupportScore - a.publicSupportScore;
    }
    if (sortBy === 'latest') {
      return new Date(b.lastReportedDate) - new Date(a.lastReportedDate);
    }
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
              Module B
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t('civicModuleHeader')}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t('civicPageTitle')}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
            {t('civicPageDesc')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('civic-map')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition"
          >
            <MapIcon className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
            <span>{t('viewCivicMapBtn')}</span>
          </button>

          <button
            onClick={() => setShowReportForm(!showReportForm)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>{showReportForm ? t('hideReportFormBtn') : t('reportAnIssueBtn')}</span>
          </button>
        </div>
      </div>

      {/* Inline Report Form Drawer */}
      {showReportForm && (
        <div className="max-w-2xl mx-auto">
          <CivicReportForm onReportSubmitted={() => setShowReportForm(false)} />
        </div>
      )}

      {/* Filter and Sorting Controls */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchCivicPlaceholder')}
            className="w-full pl-9 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:ring-2 focus:ring-slate-800 dark:focus:ring-blue-500 text-xs"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 dark:text-slate-400 font-medium">{t('categoryFilter')}</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c === 'All' ? t('allFilter') : c}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 dark:text-slate-400 font-medium">{t('statusFilter')}</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium"
          >
            <option value="All">{t('allFilter')}</option>
            <option value="Ready">Ready</option>
            <option value="Escalation">Escalation</option>
            <option value="Monitoring">Monitoring</option>
          </select>
        </div>

        {/* Sort by Option */}
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 dark:text-slate-400 font-medium">{t('sortByLabel')}</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium"
          >
            <option value="priority">{t('sortPriority')}</option>
            <option value="supported">{t('sortSupported')}</option>
            <option value="reported">{t('sortReported')}</option>
            <option value="latest">{t('sortLatest')}</option>
          </select>
        </div>
      </div>

      {/* Issue Clusters Grid */}
      {filteredClusters.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-12 text-center text-xs text-slate-500 dark:text-slate-400">
          {t('noCivicIssuesFound')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClusters.map((cluster) => (
            <CivicIssueCard
              key={cluster.id}
              cluster={cluster}
              onSelect={(id) => setSelectedClusterId(id)}
            />
          ))}
        </div>
      )}

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
