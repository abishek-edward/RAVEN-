/**
 * RAVEN Platform API Client
 * Proxied seamlessly through /api to Express Backend and Supabase PostgreSQL.
 */

const rawBase = import.meta.env.VITE_API_BASE_URL || '';
const API_BASE = rawBase
  ? (rawBase.endsWith('/api') ? rawBase : `${rawBase.replace(/\/$/, '')}/api`)
  : '/api';

async function fetchJson(url, options = {}) {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let errorDetail = res.statusText;
    try {
      const errorJson = await res.json();
      errorDetail = errorJson.error || errorJson.message || errorDetail;
    } catch (e) {
      // ignore
    }
    throw new Error(`API Error [${res.status}]: ${errorDetail}`);
  }

  return res.json();
}

export const api = {
  // Health
  checkHealth: () => fetchJson(`${API_BASE}/health`),

  // Schemes (Module A)
  getSchemes: () => fetchJson(`${API_BASE}/schemes`),
  getSchemeById: (id) => fetchJson(`${API_BASE}/schemes/${id}`),
  getAllSchemeReports: () => fetchJson(`${API_BASE}/schemes/reports/all`),
  getSchemeReports: (schemeId) => fetchJson(`${API_BASE}/schemes/${schemeId}/reports`),
  getAllSchemeAnalysis: () => fetchJson(`${API_BASE}/schemes/analysis/all`),
  getSchemeAnalysis: (schemeId) => fetchJson(`${API_BASE}/schemes/${schemeId}/analysis`),
  submitSchemeReport: (schemeId, data) =>
    fetchJson(`${API_BASE}/schemes/${schemeId}/reports`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  triggerSchemeAnalysis: (schemeId) =>
    fetchJson(`${API_BASE}/schemes/${schemeId}/analyze`, {
      method: 'POST',
    }),

  // Civic Issues (Module B)
  getCivicClusters: () => fetchJson(`${API_BASE}/civic/clusters`),
  getCivicReports: () => fetchJson(`${API_BASE}/civic/reports`),
  getCivicClusterById: (id) => fetchJson(`${API_BASE}/civic/clusters/${id}`),
  submitCivicReport: (data) =>
    fetchJson(`${API_BASE}/civic/reports`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  supportCivicCluster: (clusterId) =>
    fetchJson(`${API_BASE}/civic/clusters/${clusterId}/support`, {
      method: 'POST',
    }),
  triggerClusterAiAnalysis: (clusterId) =>
    fetchJson(`${API_BASE}/civic/clusters/${clusterId}/analyze`, {
      method: 'POST',
    }),

  // Confirmations
  getConfirmations: () => fetchJson(`${API_BASE}/confirmations`),
  submitConfirmation: (clusterId, isStillProblem, citizen = 'Anonymous Citizen') =>
    fetchJson(`${API_BASE}/confirmations`, {
      method: 'POST',
      body: JSON.stringify({ clusterId, isStillProblem, citizen }),
    }),

  // Profiles
  getProfiles: () => fetchJson(`${API_BASE}/profiles`),
};

export default api;
