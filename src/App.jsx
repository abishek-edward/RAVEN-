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
import TrustBadge from './components/common/TrustBadge';

function MainContent() {
  const { currentPage, navigateTo, resetDemoData } = useRaven();

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
        return <AdminPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header />
      <main className="flex-1">
        {renderPage()}
      </main>

      {/* Clean Professional Civic Tech Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <span className="w-5 h-5 rounded bg-teal-600 text-white flex items-center justify-center text-xs">R</span>
                RAVEN
                <span className="text-slate-400 font-normal">| Government Promises. Citizen Reality.</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500 max-w-xl leading-relaxed">
                An independent civic intelligence initiative designed to verify public policy commitments through citizen ground corroboration and correlate everyday municipal issues.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <TrustBadge type="OFFICIAL" size="xs" />
              <TrustBadge type="CITIZEN" size="xs" />
              <TrustBadge type="ANALYSIS" size="xs" />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-[11px]">
            <div className="flex items-center gap-4 text-slate-600">
              <button
                onClick={() => navigateTo('landing')}
                className="hover:text-slate-900 transition"
              >
                Home
              </button>
              <button
                onClick={() => navigateTo('schemes')}
                className="hover:text-slate-900 transition"
              >
                Commitments & Schemes
              </button>
              <button
                onClick={() => navigateTo('civic-issues')}
                className="hover:text-slate-900 transition"
              >
                Civic Issues
              </button>
              <button
                onClick={() => navigateTo('civic-map')}
                className="hover:text-slate-900 transition"
              >
                Civic Map
              </button>
              <button
                onClick={() => navigateTo('profile')}
                className="hover:text-slate-900 transition font-medium"
              >
                Profile / Feedback
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-slate-400">Privacy: All public citizen reports are strictly anonymous</span>
              <button
                onClick={resetDemoData}
                className="text-amber-700 hover:text-amber-900 font-semibold"
                title="Reset all datasets to initial state"
              >
                Reset Platform Data
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
