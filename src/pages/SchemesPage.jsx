import React, { useState } from 'react';
import { useRaven } from '../context/RavenContext';
import SchemeCard from '../components/schemes/SchemeCard';
import TrustBadge from '../components/common/TrustBadge';
import { Building2, Search, Filter, Layers } from 'lucide-react';

export default function SchemesPage() {
  const { schemes } = useRaven();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterTrust, setFilterTrust] = useState('All');

  const categories = ['All', 'Higher Education & Social Welfare', 'Child Nutrition & School Education', 'Social Security & Gender Equality', 'Street Infrastructure', 'Water Supply'];

  const filteredSchemes = schemes.filter((scheme) => {
    const matchesSearch = 
      scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === 'All' || scheme.category === filterCategory;
    const matchesTrust = filterTrust === 'All' || scheme.trustLabel === filterTrust;

    return matchesSearch && matchesCategory && matchesTrust;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Module A
            </span>
            <span>•</span>
            <span className="text-xs font-semibold text-slate-500">
              Government Scheme / Policy Promise Tracker
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Government Commitments & Schemes
          </h1>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Monitor state-announced welfare schemes, civic infrastructure projects, and policy commitments. Review what was officially promised against citizen ground experience.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <TrustBadge type="OFFICIAL" size="xs" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search schemes by title, department, or location..."
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-800 text-xs"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Category:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-2 border border-slate-300 rounded-md bg-white text-xs font-medium"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Source Label Filter */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Source:</span>
          <select
            value={filterTrust}
            onChange={(e) => setFilterTrust(e.target.value)}
            className="p-2 border border-slate-300 rounded-md bg-white text-xs font-medium"
          >
            <option value="All">All Sources</option>
            <option value="OFFICIAL">Officially Verified (Real Schemes)</option>
          </select>
        </div>
      </div>

      {/* Schemes Grid */}
      {filteredSchemes.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-xs text-slate-500">
          No government commitments found matching your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      )}
    </div>
  );
}
