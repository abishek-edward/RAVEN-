import React from 'react';
import { useRaven } from '../../context/RavenContext';
import { 
  Building2, 
  AlertCircle, 
  Map as MapIcon, 
  FileText, 
  User, 
  ShieldAlert,
  Menu,
  X
} from 'lucide-react';

export default function Header() {
  const { currentPage, navigateTo, profile } = useRaven();
  const isAdmin = profile.role === 'Admin';
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleNav = (page, param = null) => {
    navigateTo(page, param);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-slate-100 border-b border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LEFT: RAVEN Logo + Small Tagline */}
          <button
            onClick={() => handleNav('landing')}
            className="flex items-center gap-3 text-left focus:outline-none group shrink-0"
          >
            <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center font-bold text-white text-lg tracking-wider shadow-inner group-hover:bg-teal-500 transition">
              R
            </div>
            <div>
              <div className="font-bold text-base tracking-tight text-white flex items-center gap-2">
                RAVEN
              </div>
              <div className="text-[11px] text-slate-400 font-normal">
                Government Promises. Citizen Reality.
              </div>
            </div>
          </button>

          {/* CENTER/RIGHT: Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-medium">
            <button
              onClick={() => handleNav('landing')}
              className={`px-3 py-2 rounded-md transition ${
                currentPage === 'landing'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNav('schemes')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md transition ${
                currentPage === 'schemes' || currentPage === 'scheme-detail'
                  ? 'bg-slate-800 text-teal-300 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-teal-400" />
              <span>Commitments & Schemes</span>
            </button>

            <button
              onClick={() => handleNav('civic-issues')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md transition ${
                currentPage === 'civic-issues'
                  ? 'bg-slate-800 text-blue-300 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5 text-blue-400" />
              <span>Civic Issues</span>
            </button>

            <button
              onClick={() => handleNav('civic-map')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md transition ${
                currentPage === 'civic-map'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>Civic Map</span>
            </button>

            <button
              onClick={() => handleNav('my-reports')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md transition ${
                currentPage === 'my-reports'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span>My Reports</span>
            </button>

            {/* Admin link (conditional) */}
            {isAdmin && (
              <button
                onClick={() => handleNav('admin')}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md transition border ${
                  currentPage === 'admin'
                    ? 'bg-amber-950/80 text-amber-300 border-amber-500 font-semibold'
                    : 'text-amber-400 border-amber-600/40 hover:bg-amber-950/40'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin / Escalation</span>
              </button>
            )}

            {/* RIGHT: Profile / Login */}
            <button
              onClick={() => handleNav('profile')}
              className={`ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-semibold transition ${
                currentPage === 'profile'
                  ? 'bg-teal-700 text-white border-teal-500'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700'
              }`}
            >
              <User className="w-3.5 h-3.5 text-teal-400" />
              <span>{profile.role === 'Admin' ? 'Admin Profile' : 'Profile / Login'}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                profile.role === 'Admin' ? 'bg-amber-900/60 text-amber-300' : 'bg-slate-700 text-slate-300'
              }`}>
                {profile.role}
              </span>
            </button>
          </nav>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => handleNav('profile')}
              className="px-2 py-1 rounded bg-slate-800 text-xs font-medium text-slate-300 border border-slate-700"
            >
              {profile.role}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-slate-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-800 space-y-1 text-xs">
            <button
              onClick={() => handleNav('landing')}
              className={`w-full text-left px-3 py-2 rounded ${currentPage === 'landing' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-300'}`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('schemes')}
              className={`w-full text-left px-3 py-2 rounded ${currentPage === 'schemes' ? 'bg-slate-800 text-teal-300 font-semibold' : 'text-slate-300'}`}
            >
              Commitments & Schemes
            </button>
            <button
              onClick={() => handleNav('civic-issues')}
              className={`w-full text-left px-3 py-2 rounded ${currentPage === 'civic-issues' ? 'bg-slate-800 text-blue-300 font-semibold' : 'text-slate-300'}`}
            >
              Civic Issues
            </button>
            <button
              onClick={() => handleNav('civic-map')}
              className={`w-full text-left px-3 py-2 rounded ${currentPage === 'civic-map' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-300'}`}
            >
              Civic Map
            </button>
            <button
              onClick={() => handleNav('my-reports')}
              className={`w-full text-left px-3 py-2 rounded ${currentPage === 'my-reports' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-300'}`}
            >
              My Reports
            </button>
            {isAdmin && (
              <button
                onClick={() => handleNav('admin')}
                className={`w-full text-left px-3 py-2 rounded text-amber-400 font-semibold ${currentPage === 'admin' ? 'bg-amber-950/80' : ''}`}
              >
                Admin / Escalation
              </button>
            )}
            <button
              onClick={() => handleNav('profile')}
              className={`w-full text-left px-3 py-2 rounded ${currentPage === 'profile' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-300'}`}
            >
              Profile / Role Switcher ({profile.role})
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
