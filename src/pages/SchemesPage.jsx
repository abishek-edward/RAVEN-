import React, { useState } from 'react';
import { useRaven } from '../context/RavenContext';
import SchemeCard from '../components/schemes/SchemeCard';
import TrustBadge from '../components/common/TrustBadge';
import { Building2, Search, Filter, Layers } from 'lucide-react';

export default function SchemesPage() {
  const { schemes, t } = useRaven();

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
      <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              Module A
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t('schemesPageHeader')}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {t('schemesPageTitle')}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            {t('schemesPageDesc')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <TrustBadge type="OFFICIAL" size="xs" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs transition-colors">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchSchemesPlaceholder')}
            className="w-full pl-9 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-teal-500 text-xs"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 dark:text-slate-400 font-medium">{t('categoryFilter')}</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c === 'All' ? t('allFilter') : c}</option>
            ))}
          </select>
        </div>

        {/* Source Label Filter */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 dark:text-slate-400 font-medium">{t('sourceFilter')}</span>
          <select
            value={filterTrust}
            onChange={(e) => setFilterTrust(e.target.value)}
            className="p-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium"
          >
            <option value="All">{t('allSources')}</option>
            <option value="OFFICIAL">{t('onlyOfficialSources')}</option>
          </select>
        </div>
      </div>

      {/* Schemes Grid */}
      {filteredSchemes.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-12 text-center text-xs text-slate-500 dark:text-slate-400">
          {t('noSchemesFound')}
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
