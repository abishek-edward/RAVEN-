import React from 'react';
import { RavenProvider, useRaven } from './context/RavenContext';
import Header from './components/common/Header';
import LandingPage from './pages/LandingPage';
import SchemesPage from './pages/SchemesPage';
import SchemeDetailPage from './pages/SchemeDetailPage';
import CivicIssuesPage from './pages/CivicIssuesPage';
import CivicMapPage from './pages/CivicMapPage';
import MyReportsPage from './pages/MyReportsPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import GovernmentPortalPage from './pages/GovernmentPortalPage';
import TrustBadge from './components/common/TrustBadge';

function MainContent() {
  const { currentPage, profile, navigateTo, resetDemoData, t } = useRaven();

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage />;
      case 'schemes':
        return <SchemesPage />;
      case 'scheme-detail':
        return <SchemeDetailPage />;
      case 'civic-issues':
        return <CivicIssuesPage />;
      case 'civic-map':
        return <CivicMapPage />;
      case 'my-reports':
        return <MyReportsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'admin':
        if (profile.role !== 'Admin') return <ProfilePage />;
        return <AdminPage />;
      case 'official-portal':
        if (profile.role !== 'Admin') return <LandingPage />;
        return <GovernmentPortalPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans transition-colors duration-200">
      <Header />
      <main className="flex-1">
        {renderPage()}
      </main>

      {/* Clean Professional Civic Tech Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-16 py-8 text-xs text-slate-500 dark:text-slate-400 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-sm">
                <span className="w-5 h-5 rounded bg-teal-600 text-white flex items-center justify-center text-xs">R</span>
                RAVEN
                <span className="text-slate-400 dark:text-slate-500 font-normal">| {t('tagline')}</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
                {t('subtitle')}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <TrustBadge type="OFFICIAL" size="xs" />
              <TrustBadge type="CITIZEN" size="xs" />
              <TrustBadge type="ANALYSIS" size="xs" />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[11px]">
            <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
              <button
                onClick={() => navigateTo('landing')}
                className="hover:text-slate-900 dark:hover:text-slate-100 transition"
              >
                {t('navHome')}
              </button>
              <button
                onClick={() => navigateTo('schemes')}
                className="hover:text-slate-900 dark:hover:text-slate-100 transition"
              >
                {t('navSchemes')}
              </button>
              <button
                onClick={() => navigateTo('civic-issues')}
                className="hover:text-slate-900 dark:hover:text-slate-100 transition"
              >
                {t('navCivicIssues')}
              </button>
              <button
                onClick={() => navigateTo('civic-map')}
                className="hover:text-slate-900 dark:hover:text-slate-100 transition"
              >
                {t('navCivicMap')}
              </button>
              <button
                onClick={() => navigateTo('profile')}
                className="hover:text-slate-900 dark:hover:text-slate-100 transition font-medium"
              >
                {t('navProfile')}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-slate-400 dark:text-slate-500">{t('privacyNote')}</span>
              <button
                onClick={resetDemoData}
                className="text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 font-semibold transition"
                title={t('resetPlatformData')}
              >
                {t('resetPlatformData')}
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <RavenProvider>
      <MainContent />
    </RavenProvider>
  );
}
