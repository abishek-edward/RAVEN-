import React, { useState, useEffect } from 'react';
import { useRaven } from '../context/RavenContext';
import api from '../api/client';
import TrustBadge from '../components/common/TrustBadge';
import { 
  Building2, 
  ShieldCheck, 
  Lock, 
  LogOut, 
  MapPin, 
  AlertCircle, 
  Filter, 
  Database,
  ArrowRight,
  UserCheck,
  RefreshCw
} from 'lucide-react';

export default function GovernmentPortalPage() {
  const { profile, officialSession, loginOfficial, logoutOfficial, navigateTo, t } = useRaven();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Clusters loaded strictly from server filtered by assigned ward
  const [wardClusters, setWardClusters] = useState([]);
  const [isLoadingClusters, setIsLoadingClusters] = useState(false);
  const [clusterFetchError, setClusterFetchError] = useState('');

  // Role Guard: Only Admin profiles can view/access Government Portal
  if (profile.role !== 'Admin') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Admin Access Restricted</h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
          The Government Official Portal is restricted to authorized Administrator accounts. Please switch to or sign in with an Admin role to access this console.
        </p>
        <div className="pt-2">
          <button
            onClick={() => navigateTo('profile')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-teal-700 text-white rounded text-xs font-semibold transition"
          >
            Switch to Admin Role in Profile
          </button>
        </div>
      </div>
    );
  }

  // Available demo official accounts for easy prototype testing
  const [demoAccounts, setDemoAccounts] = useState([
    {
      username: 'perambur.officer',
      name: 'Demo Officer (Perambur)',
      assignedWard: 'GCC Ward 70 / Zone 6 (Thiru-Vi-Ka Nagar)',
      assignedConstituency: 'Thiru-Vi-Ka Nagar Assembly',
      passHint: 'perambur123'
    },
    {
      username: 'anna.officer',
      name: 'Demo Officer (Anna Nagar)',
      assignedWard: 'GCC Ward 104 / Zone 8 (Anna Nagar)',
      assignedConstituency: 'Anna Nagar Assembly',
      passHint: 'annanagar123'
    },
    {
      username: 'velachery.officer',
      name: 'Demo Officer (Velachery)',
      assignedWard: 'GCC Ward 172 / Zone 13 (Adyar)',
      assignedConstituency: 'Velachery Assembly',
      passHint: 'velachery123'
    },
    {
      username: 'tnagar.officer',
      name: 'Demo Officer (T. Nagar)',
      assignedWard: 'GCC Ward 117 / Zone 9 (T. Nagar)',
      assignedConstituency: 'T. Nagar Assembly',
      passHint: 'tnagar123'
    }
  ]);

  // Fetch demo accounts from backend on mount
  useEffect(() => {
    api.getDemoOfficials()
      .then(accounts => {
        if (accounts && accounts.length > 0) {
          const hints = {
            'perambur.officer': 'perambur123',
            'anna.officer': 'annanagar123',
            'velachery.officer': 'velachery123',
            'tnagar.officer': 'tnagar123'
          };
          setDemoAccounts(accounts.map(a => ({
            ...a,
            passHint: hints[a.username] || 'demo123'
          })));
        }
      })
      .catch(() => {
        // Fallback to presets
      });
  }, []);

  // Fetch clusters strictly filtered by ward from server
  const fetchWardClusters = async (ward) => {
    if (!ward) return;
    setIsLoadingClusters(true);
    setClusterFetchError('');
    try {
      // Server response itself is filtered via SQL WHERE clause
      const data = await api.getCivicClustersByWard(ward);
      setWardClusters(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch ward-filtered clusters:', err);
      setClusterFetchError('Failed to load clusters for your assigned jurisdiction.');
    } finally {
      setIsLoadingClusters(false);
    }
  };

  useEffect(() => {
    if (officialSession?.assignedWard) {
      fetchWardClusters(officialSession.assignedWard);
    }
  }, [officialSession?.assignedWard]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) return;

    setIsLoggingIn(true);
    setLoginError('');

    try {
      await loginOfficial(username.trim(), password);
      setUsername('');
      setPassword('');
    } catch (err) {
      setLoginError(err.message || 'Invalid demo official credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleQuickFill = (acc) => {
    setUsername(acc.username);
    setPassword(acc.passHint);
    setLoginError('');
  };

  // State A: Logged Out — Render Government Official Login
  if (!officialSession) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 dark:bg-slate-700 text-teal-400 mb-2 shadow-sm">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Government Official Portal
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            Restricted jurisdiction console for municipal corporation ward engineers and zonal officers.
          </p>
        </div>

        {/* Prototype Disclaimer Banner */}
        <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-900 dark:text-amber-200 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold">
            <Lock className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
            <span>Hackathon Prototype Notice</span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
            Demo authentication only — plain credentials, no hashing, no session tokens, no production security. Real deployment would require a proper auth system.
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm space-y-5">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-700">
            Official Account Login
          </h2>

          {loginError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-md text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">
                Demo Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. perambur.officer"
                className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">
                Demo Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2.5 px-4 rounded bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-semibold text-xs transition shadow-sm disabled:opacity-50"
            >
              {isLoggingIn ? 'Verifying Account...' : 'Sign In as Government Official'}
            </button>
          </form>

          {/* Quick-Fill Presets for Demo Reviewers */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Quick Select Seeded Demo Accounts:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {demoAccounts.map((acc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickFill(acc)}
                  className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-400 bg-slate-50 dark:bg-slate-900/40 text-left transition flex items-center justify-between group"
                >
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white text-xs group-hover:text-teal-600 dark:group-hover:text-teal-400">
                      {acc.name}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      {acc.username}
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-500 transition shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // State B: Logged In — Render Jurisdiction Dashboard with SQL-Filtered Clusters
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Official Identity & Jurisdiction Card */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-inner">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold">{officialSession.name}</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-900 text-teal-300 border border-teal-700">
                  Official Prototype Session
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Username: @{officialSession.username}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchWardClusters(officialSession.assignedWard)}
              disabled={isLoadingClusters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
              title="Refresh ward clusters from SQL"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingClusters ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={logoutOfficial}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-rose-950/80 hover:bg-rose-900 text-rose-300 text-xs font-semibold border border-rose-800 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Assigned Jurisdiction Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800">
          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
              Assigned Ward Jurisdiction
            </div>
            <div className="font-bold text-sm text-teal-300 mt-0.5">
              {officialSession.assignedWard}
            </div>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
              Assembly Constituency
            </div>
            <div className="font-bold text-sm text-amber-300 mt-0.5">
              {officialSession.assignedConstituency}
            </div>
          </div>
        </div>
      </div>

      {/* SQL Enforcement Inspection Bar */}
      <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg text-xs space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-blue-200">
            <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Server-Side SQL Jurisdiction Query Enforced</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-100 font-semibold">
            {wardClusters.length} Clusters Returned
          </span>
        </div>
        <p className="text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed font-mono bg-white dark:bg-slate-900 p-2 rounded border border-blue-200 dark:border-blue-900">
          SELECT * FROM issue_clusters WHERE ward = '{officialSession.assignedWard}' ORDER BY reports_count DESC
        </p>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">
          Filtering is enforced server-side via SQL WHERE clause on ward/constituency — this is real, but there is no session-token verification, so a technically sophisticated user could still forge a request. Production deployment would need JWT/session-based auth to close this gap.
        </p>
      </div>

      {/* Ward Clusters List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Civic Issue Clusters in Your Jurisdiction
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Filtered strictly to {officialSession.assignedWard}
          </span>
        </div>

        {isLoadingClusters ? (
          <div className="p-12 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-teal-600" />
            <p>Querying PostgreSQL for ward clusters...</p>
          </div>
        ) : clusterFetchError ? (
          <div className="p-6 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-700 dark:text-red-300">
            {clusterFetchError}
          </div>
        ) : wardClusters.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
            <ShieldCheck className="w-8 h-8 text-slate-400 mx-auto" />
            <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">
              No Issues Active in this Ward
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              There are currently no active civic clusters assigned to {officialSession.assignedWard}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {wardClusters.map((cluster) => (
              <div
                key={cluster.id}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                        {cluster.id}
                      </span>
                      <span className="text-xs font-semibold text-teal-700 dark:text-teal-400">
                        {cluster.category}
                      </span>
                      <TrustBadge type={cluster.trustLabel || 'ANALYSIS'} size="xs" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                      {cluster.title}
                    </h3>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Priority Score
                    </div>
                    <div className="text-lg font-black text-rose-600 dark:text-rose-400">
                      {cluster.aiPriorityData?.score || 50}/100
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {cluster.aiSummary}
                </p>

                {/* Location, Ward, Coordinates metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-700 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Location:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {cluster.location}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block">Verified Ward:</span>
                    <span className="font-medium text-teal-700 dark:text-teal-300">
                      {cluster.ward || 'Unassigned'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block">Coordinates:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">
                      {cluster.coordinates ? `${cluster.coordinates[0].toFixed(4)}, ${cluster.coordinates[1].toFixed(4)}` : 'Not recorded'}
                    </span>
                  </div>
                </div>

                {/* Metrics bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-700 text-xs">
                  <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                    <span><strong>{cluster.reportsCount}</strong> Reports</span>
                    <span><strong>{cluster.confirmationsCount}</strong> Confirmations</span>
                    <span><strong>{cluster.durationDays}</strong> Days Active</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      Status: {cluster.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
