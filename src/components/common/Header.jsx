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
  X,
  Sun,
  Moon
} from 'lucide-react';

export default function Header() {
  const { 
    currentPage, 
    navigateTo, 
    profile, 
    language, 
    setLanguage, 
    theme, 
    toggleTheme, 
    t,
    officialSession
  } = useRaven();
  const isAdmin = profile.role === 'Admin';
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleNav = (page, param = null) => {
    navigateTo(page, param);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-slate-100 border-b border-slate-800 shadow-sm transition-colors duration-200">
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
                {t('tagline')}
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
              {t('navHome')}
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
              <span>{t('navSchemes')}</span>
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
              <span>{t('navCivicIssues')}</span>
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
              <span>{t('navCivicMap')}</span>
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
              <span>{t('navMyReports')}</span>
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
                <span>{t('navAdmin')}</span>
              </button>
            )}

            {/* Gov Portal Link (Admin Only) */}
            {isAdmin && (
              <button
                onClick={() => handleNav('official-portal')}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md transition border ${
                  currentPage === 'official-portal'
                    ? 'bg-teal-950/80 text-teal-300 border-teal-500 font-semibold'
                    : officialSession
                      ? 'bg-teal-950/40 text-teal-300 border-teal-600/70 hover:bg-teal-900/60'
                      : 'text-slate-300 border-slate-700 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-teal-400" />
                <span>{officialSession ? 'Gov Portal (Active)' : 'Gov Portal'}</span>
                {officialSession && (
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                )}
              </button>
            )}

            {/* Profile Button */}
            <button
              onClick={() => handleNav('profile')}
              className={`ml-1.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-semibold transition ${
                currentPage === 'profile'
                  ? 'bg-teal-700 text-white border-teal-500'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700'
              }`}
            >
              <User className="w-3.5 h-3.5 text-teal-400" />
              <span>{profile.role === 'Admin' ? t('navProfileAdmin') : t('navProfile')}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                profile.role === 'Admin' ? 'bg-amber-900/60 text-amber-300' : 'bg-slate-700 text-slate-300'
              }`}>
                {profile.role}
              </span>
            </button>

            {/* Language Toggle: EN | தமிழ் */}
            <div 
              className="ml-2 flex items-center rounded-md border border-slate-700 bg-slate-800/90 p-0.5"
              role="group"
              aria-label="Language selection"
            >
              <button
                type="button"
                onClick={() => setLanguage('en')}
                aria-label={t('switchToEnglish')}
                aria-pressed={language === 'en'}
                className={`px-2 py-1 rounded text-xs font-medium transition ${
                  language === 'en'
                    ? 'bg-teal-600 text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('ta')}
                aria-label={t('switchToTamil')}
                aria-pressed={language === 'ta'}
                className={`px-2 py-1 rounded text-xs font-medium transition ${
                  language === 'ta'
                    ? 'bg-teal-600 text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                தமிழ்
              </button>
            </div>

            {/* Theme Toggle: ☀️ / 🌙 */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? t('switchToLight') : t('switchToDark')}
              title={theme === 'dark' ? t('switchToLight') : t('switchToDark')}
              className="ml-1.5 p-1.5 rounded-md border border-slate-700 bg-slate-800/90 text-slate-200 hover:bg-slate-800 hover:text-white transition flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-300" />
              )}
            </button>
          </nav>

          {/* Mobile top controls */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Language Toggle */}
            <div 
              className="flex items-center rounded-md border border-slate-700 bg-slate-800 p-0.5"
              role="group"
              aria-label="Language selection"
            >
              <button
                type="button"
                onClick={() => setLanguage('en')}
                aria-label={t('switchToEnglish')}
                aria-pressed={language === 'en'}
                className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition ${
                  language === 'en' ? 'bg-teal-600 text-white font-bold' : 'text-slate-300'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('ta')}
                aria-label={t('switchToTamil')}
                aria-pressed={language === 'ta'}
                className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition ${
                  language === 'ta' ? 'bg-teal-600 text-white font-bold' : 'text-slate-300'
                }`}
              >
                தமிழ்
              </button>
            </div>

            {/* Mobile Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? t('switchToLight') : t('switchToDark')}
              title={theme === 'dark' ? t('switchToLight') : t('switchToDark')}
              className="p-1.5 rounded bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-300" />
              )}
            </button>

            {/* Mobile Role badge */}
            <button
              onClick={() => handleNav('profile')}
              className="px-2 py-1 rounded bg-slate-800 text-xs font-medium text-slate-300 border border-slate-700"
            >
              {profile.role}
            </button>

            {/* Hamburger Button */}
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
              {t('navHome')}
            </button>
            <button
              onClick={() => handleNav('schemes')}
              className={`w-full text-left px-3 py-2 rounded ${currentPage === 'schemes' ? 'bg-slate-800 text-teal-300 font-semibold' : 'text-slate-300'}`}
            >
              {t('navSchemes')}
            </button>
            <button
              onClick={() => handleNav('civic-issues')}
              className={`w-full text-left px-3 py-2 rounded ${currentPage === 'civic-issues' ? 'bg-slate-800 text-blue-300 font-semibold' : 'text-slate-300'}`}
            >
              {t('navCivicIssues')}
            </button>
            <button
              onClick={() => handleNav('civic-map')}
              className={`w-full text-left px-3 py-2 rounded ${currentPage === 'civic-map' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-300'}`}
            >
              {t('navCivicMap')}
            </button>
            <button
              onClick={() => handleNav('my-reports')}
              className={`w-full text-left px-3 py-2 rounded ${currentPage === 'my-reports' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-300'}`}
            >
              {t('navMyReports')}
            </button>
            {isAdmin && (
              <button
                onClick={() => handleNav('admin')}
                className={`w-full text-left px-3 py-2 rounded text-amber-400 font-semibold ${currentPage === 'admin' ? 'bg-amber-950/80' : ''}`}
              >
                {t('navAdmin')}
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => handleNav('official-portal')}
                className={`w-full text-left px-3 py-2 rounded font-semibold flex items-center justify-between ${
                  currentPage === 'official-portal' ? 'bg-slate-800 text-teal-300' : 'text-slate-300'
                }`}
              >
                <span>Government Portal</span>
                {officialSession && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-900 text-teal-300">
                    {officialSession.username}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => handleNav('profile')}
              className={`w-full text-left px-3 py-2 rounded ${currentPage === 'profile' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-300'}`}
            >
              {t('navProfile')} ({profile.role})
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

