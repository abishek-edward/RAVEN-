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
  const { civicClusters, navigateTo, selectedClusterId, setSelectedClusterId } = useRaven();

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
      <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Module B
            </span>
            <span>•</span>
            <span className="text-xs font-semibold text-slate-500">
              Everyday Civic Intelligence & Clustering
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Civic Issues & Collective Clusters
          </h1>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Everyday neighborhood municipal problems (potholes, dark streetlights, waste overflow, water leaks). 
            RAVEN analyzes individual citizen submissions to form issue clusters and computes community priority scores.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('civic-map')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
          >
            <MapIcon className="w-3.5 h-3.5 text-slate-600" />
            <span>View Civic Map</span>
          </button>

          <button
            onClick={() => setShowReportForm(!showReportForm)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>{showReportForm ? 'Hide Report Form' : 'Report an Issue'}</span>
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
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by issue title, street, or cluster ID (e.g. CI-1024)..."
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-800 text-xs"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-medium">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border border-slate-300 rounded-md bg-white text-xs font-medium"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-medium">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-2 border border-slate-300 rounded-md bg-white text-xs font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="Ready">Ready</option>
            <option value="Escalation">Escalation</option>
            <option value="Monitoring">Monitoring</option>
          </select>
        </div>

        {/* Sort by Option */}
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-medium">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border border-slate-300 rounded-md bg-white text-xs font-medium"
          >
            <option value="priority">Highest AI-Assisted Priority</option>
            <option value="supported">Most Public Support</option>
            <option value="reported">Most Citizen Reports</option>
            <option value="latest">Latest Observed</option>
          </select>
        </div>
      </div>

      {/* Issue Clusters Grid */}
      {filteredClusters.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-xs text-slate-500">
          No civic issue clusters found matching your filter criteria.
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
