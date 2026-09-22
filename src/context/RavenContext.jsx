import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { INITIAL_SCHEMES } from '../data/initialSchemes';
import { INITIAL_SCHEME_REPORTS, SCHEME_AGGREGATED_ANALYSIS } from '../data/initialSchemeReports';
import { INITIAL_CIVIC_REPORTS, INITIAL_CIVIC_CLUSTERS } from '../data/initialCivicIssues';
import { INITIAL_CONFIRMATIONS } from '../data/initialConfirmations';
import { calculateAIAssistedPriorityScore } from '../utils/priorityCalculator';
import { detectLanguage } from '../utils/languageDetector';
import { TRANSLATIONS } from '../constants/translations';

const RavenContext = createContext(null);

export const DEMO_PROFILES = {
  Citizen: {
    id: 'demo-citizen-01',
    name: 'Demo Citizen',
    district: 'Chennai',
    role: 'Citizen',
    avatar: 'DC'
  },
  Admin: {
    id: 'demo-admin-01',
    name: 'RAVEN Demo Administrator',
    district: 'Statewide / TN',
    role: 'Admin',
    avatar: 'RA'
  }
};

export function RavenProvider({ children }) {
  // 1. Profile / Role-based auth
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('raven_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure legacy names are migrated to anonymous demo roles
        if (parsed.name === 'Karthik N.' || !['Citizen', 'Admin'].includes(parsed.role)) {
          return DEMO_PROFILES.Citizen;
        }
        return parsed;
      } catch (e) {
        return DEMO_PROFILES.Citizen;
      }
    }
    return DEMO_PROFILES.Citizen;
  });

  const switchRole = (roleName) => {
    const newProfile = roleName === 'Admin' ? DEMO_PROFILES.Admin : DEMO_PROFILES.Citizen;
    setProfile(newProfile);
    localStorage.setItem('raven_profile', JSON.stringify(newProfile));
  };

  // 2. Schemes
  const [schemes, setSchemes] = useState(() => {
    const saved = localStorage.getItem('raven_schemes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && (parsed.length < 10 || parsed.some(s => s.id?.includes('area-x')))) {
          localStorage.setItem('raven_schemes', JSON.stringify(INITIAL_SCHEMES));
          return INITIAL_SCHEMES;
        }
        return parsed;
      } catch (e) {
        return INITIAL_SCHEMES;
      }
    }
    return INITIAL_SCHEMES;
  });

  // 3. Scheme citizen experience reports
  const [schemeReports, setSchemeReports] = useState(() => {
    const saved = localStorage.getItem('raven_scheme_reports');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some(r => r.schemeId?.includes('area-x'))) {
          localStorage.setItem('raven_scheme_reports', JSON.stringify(INITIAL_SCHEME_REPORTS));
          return INITIAL_SCHEME_REPORTS;
        }
        return parsed;
      } catch (e) {
        return INITIAL_SCHEME_REPORTS;
      }
    }
    return INITIAL_SCHEME_REPORTS;
  });

  // 4. Scheme aggregated analysis
  const [schemeAnalysis, setSchemeAnalysis] = useState(() => {
    const saved = localStorage.getItem('raven_scheme_analysis');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed['area-x-streetlights']) {
          localStorage.setItem('raven_scheme_analysis', JSON.stringify(SCHEME_AGGREGATED_ANALYSIS));
          return SCHEME_AGGREGATED_ANALYSIS;
        }
        return parsed;
      } catch (e) {
        return SCHEME_AGGREGATED_ANALYSIS;
      }
    }
    return SCHEME_AGGREGATED_ANALYSIS;
  });

  // 5. Civic reports
  const [civicReports, setCivicReports] = useState(() => {
    const saved = localStorage.getItem('raven_civic_reports');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some(r => r.location?.includes('Area X') || r.location?.includes('Area Y'))) {
          localStorage.setItem('raven_civic_reports', JSON.stringify(INITIAL_CIVIC_REPORTS));
          return INITIAL_CIVIC_REPORTS;
        }
        return parsed;
      } catch (e) {
        return INITIAL_CIVIC_REPORTS;
      }
    }
    return INITIAL_CIVIC_REPORTS;
  });

  // 6. Civic clusters
  const [civicClusters, setCivicClusters] = useState(() => {
    const saved = localStorage.getItem('raven_civic_clusters');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some(c => c.location?.includes('Area X') || c.location?.includes('Area Y') || c.title?.includes('Area X'))) {
          localStorage.setItem('raven_civic_clusters', JSON.stringify(INITIAL_CIVIC_CLUSTERS));
          return INITIAL_CIVIC_CLUSTERS;
        }
        return parsed;
      } catch (e) {
        return INITIAL_CIVIC_CLUSTERS;
      }
    }
    return INITIAL_CIVIC_CLUSTERS;
  });

  // 7. Confirmations
  const [confirmations, setConfirmations] = useState(() => {
    const saved = localStorage.getItem('raven_confirmations');
    return saved ? JSON.parse(saved) : INITIAL_CONFIRMATIONS;
  });

  // 8. Supported cluster IDs
  const [supportedClusterIds, setSupportedClusterIds] = useState(() => {
    const saved = localStorage.getItem('raven_supported_clusters');
    return saved ? JSON.parse(saved) : [];
  });

  // 9. Answered confirmations
  const [answeredConfirmationIds, setAnsweredConfirmationIds] = useState(() => {
    const saved = localStorage.getItem('raven_answered_confirmations');
    return saved ? JSON.parse(saved) : {};
  });

  // 10. Lightweight feedback storage
  const [feedbacks, setFeedbacks] = useState(() => {
    const saved = localStorage.getItem('raven_feedbacks');
    return saved ? JSON.parse(saved) : [];
  });

  // 11. Multilingual language preference ('en' | 'ta')
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('raven-language');
    return saved === 'ta' ? 'ta' : 'en';
  });

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ta' : 'en'));
  };

  // 12. Theme preference ('light' | 'dark')
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('raven-theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Translation lookup helper
  const t = (key, replacements = {}) => {
    let text = TRANSLATIONS[language]?.[key] ?? TRANSLATIONS.en?.[key] ?? key;
    if (typeof text === 'string' && replacements) {
      Object.entries(replacements).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
      });
    }
    return text;
  };

  // Auto-open complaint form state for direct triggers
  const [autoOpenSchemeForm, setAutoOpenSchemeForm] = useState(false);

  // Navigation state
  const getInitialPage = () => {
    const path = window.location.pathname.replace(/^\//, '');
    if (path.startsWith('scheme/')) {
      return 'scheme-detail';
    }
    // Remove dashboard if URL hits /dashboard
    if (path === 'dashboard') {
      return 'landing';
    }
    if (['schemes', 'civic-issues', 'civic-map', 'my-reports', 'profile', 'admin'].includes(path)) {
      return path;
    }
    return 'landing';
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage);
  const [selectedSchemeId, setSelectedSchemeId] = useState(() => {
    const path = window.location.pathname.replace(/^\//, '');
    if (path.startsWith('scheme/')) {
      return path.split('/')[1] || 'pudhumai-penn';
    }
    return null;
  });
  const [selectedClusterId, setSelectedClusterId] = useState(null);

  // Sync with persistent Supabase backend on mount
  useEffect(() => {
    let isMounted = true;
    async function syncBackendData() {
      try {
        const [
          liveSchemes,
          liveReports,
          liveAnalysis,
          liveCivicClusters,
          liveCivicReports,
          liveConfirmations
        ] = await Promise.all([
          api.getSchemes().catch(() => null),
          api.getAllSchemeReports().catch(() => null),
          api.getAllSchemeAnalysis().catch(() => null),
          api.getCivicClusters().catch(() => null),
          api.getCivicReports().catch(() => null),
          api.getConfirmations().catch(() => null),
        ]);

        if (!isMounted) return;

        if (Array.isArray(liveSchemes) && liveSchemes.length > 0) {
          setSchemes(liveSchemes);
        }
        if (Array.isArray(liveReports) && liveReports.length > 0) {
          setSchemeReports(liveReports);
        }
        if (liveAnalysis && Object.keys(liveAnalysis).length > 0) {
          setSchemeAnalysis(liveAnalysis);
        }
        if (Array.isArray(liveCivicClusters) && liveCivicClusters.length > 0) {
          setCivicClusters(liveCivicClusters);
        }
        if (Array.isArray(liveCivicReports) && liveCivicReports.length > 0) {
          setCivicReports(liveCivicReports);
        }
        if (liveConfirmations && Object.keys(liveConfirmations).length > 0) {
          setConfirmations(liveConfirmations);
        }
      } catch (err) {
        console.warn('Backend sync notice (using cached/fallback state):', err.message);
      }
    }

    syncBackendData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const page = getInitialPage();
      setCurrentPage(page);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('raven_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('raven_scheme_reports', JSON.stringify(schemeReports));
  }, [schemeReports]);

  useEffect(() => {
    localStorage.setItem('raven_scheme_analysis', JSON.stringify(schemeAnalysis));
  }, [schemeAnalysis]);

  useEffect(() => {
    localStorage.setItem('raven_civic_reports', JSON.stringify(civicReports));
  }, [civicReports]);

  useEffect(() => {
    localStorage.setItem('raven_civic_clusters', JSON.stringify(civicClusters));
  }, [civicClusters]);

  useEffect(() => {
    localStorage.setItem('raven_confirmations', JSON.stringify(confirmations));
  }, [confirmations]);

  useEffect(() => {
    localStorage.setItem('raven_supported_clusters', JSON.stringify(supportedClusterIds));
  }, [supportedClusterIds]);

  useEffect(() => {
    localStorage.setItem('raven_answered_confirmations', JSON.stringify(answeredConfirmationIds));
  }, [answeredConfirmationIds]);

  useEffect(() => {
    localStorage.setItem('raven_feedbacks', JSON.stringify(feedbacks));
  }, [feedbacks]);

  useEffect(() => {
    localStorage.setItem('raven-language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('raven-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Navigate helper
  const navigateTo = (page, param = null) => {
    // If someone requests dashboard, redirect to landing
    if (page === 'dashboard') {
      page = 'landing';
    }

    // Role protection: block Citizen from Admin page
    if (page === 'admin' && profile.role !== 'Admin') {
      page = 'profile';
    }

    let urlPath = '/';
    if (page === 'scheme-detail') {
      let schemeIdToSelect = param;
      if (typeof param === 'object' && param !== null) {
        schemeIdToSelect = param.schemeId;
        if (param.openReport) {
          setAutoOpenSchemeForm(true);
        } else {
          setAutoOpenSchemeForm(false);
        }
      } else {
        setAutoOpenSchemeForm(false);
      }
      setSelectedSchemeId(schemeIdToSelect);
      urlPath = `/scheme/${schemeIdToSelect || ''}`;
    } else if (page === 'civic-issues') {
      if (param) setSelectedClusterId(param);
      urlPath = '/civic-issues';
    } else if (page === 'landing') {
      urlPath = '/';
    } else {
      urlPath = `/${page}`;
    }

    try {
      window.history.pushState({}, '', urlPath);
    } catch (e) {
      // ignore in test or iframe environment
    }

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit Scheme Report
  const addSchemeReport = async ({ schemeId, reportText, category, college, delayDays, attachments, evidenceType }) => {
    const detectedLang = detectLanguage(reportText);
    const parsedDelay = delayDays ? parseInt(delayDays, 10) : undefined;
    const attachmentList = Array.isArray(attachments) ? attachments : [];

    const localReport = {
      id: `SR-${Date.now().toString().slice(-4)}`,
      schemeId,
      citizenName: 'Anonymous Citizen',
      userId: profile.id,
      isAnonymous: true,
      isSeeded: false,
      district: profile.district,
      college: college || 'Constituent Institution',
      locationDetail: profile.district,
      category: category || 'General Implementation Observation',
      language: detectedLang,
      reportText,
      delayDays: parsedDelay,
      attachments: attachmentList,
      evidenceCount: attachmentList.length > 0 ? attachmentList.length : (evidenceType ? 1 : 0),
      evidenceType: evidenceType || (attachmentList.length > 0 ? 'Citizen-Provided Evidence' : 'Citizen testimony'),
      status: 'Citizen-Reported',
      dateReported: new Date().toISOString().split('T')[0],
      upvotes: 1,
    };

    // Optimistic local state update
    setSchemeReports(prev => [localReport, ...prev]);

    // Update aggregated analysis locally
    setSchemeAnalysis(prev => {
      const existing = prev[schemeId] || {
        totalCitizenReports: 0,
        evidenceCount: 0,
        reportedDistricts: [profile.district],
        breakdown: [],
        platformSummary: 'Citizen feedback continues to be compiled.',
        averageDelayDays: 30,
        implementationGapStatus: 'Under observation',
        officialResponse: null
      };

      const updatedTotal = (existing.totalCitizenReports || 0) + 1;
      const updatedEvidence = (existing.evidenceCount || 0) + (localReport.evidenceCount || 1);
      const categoryFound = existing.breakdown?.find(b => b.category === category);
      
      let updatedBreakdown = [];
      if (categoryFound) {
        updatedBreakdown = existing.breakdown.map(b => 
          b.category === category ? { ...b, count: b.count + 1 } : b
        );
      } else {
        updatedBreakdown = [...(existing.breakdown || []), { category, count: 1 }];
      }

      const reportsForScheme = [localReport, ...schemeReports.filter(r => r.schemeId === schemeId)];
      const reportsWithDelay = reportsForScheme.filter(r => typeof r.delayDays === 'number' && !isNaN(r.delayDays));
      const dynamicAverageDelay = reportsWithDelay.length > 0
        ? Math.round(reportsWithDelay.reduce((acc, r) => acc + r.delayDays, 0) / reportsWithDelay.length)
        : existing.averageDelayDays;

      return {
        ...prev,
        [schemeId]: {
          ...existing,
          totalCitizenReports: updatedTotal,
          evidenceCount: updatedEvidence,
          breakdown: updatedBreakdown,
          averageDelayDays: dynamicAverageDelay
        }
      };
    });

    // Persist to Supabase through backend API
    try {
      const res = await api.submitSchemeReport(schemeId, {
        reportText,
        category: category || 'General Implementation Observation',
        college: college || 'Constituent Institution',
        delayDays: parsedDelay,
        attachments: attachmentList,
        evidenceType: localReport.evidenceType,
        userId: profile.id,
        citizenName: 'Anonymous Citizen',
        district: profile.district,
        language: detectedLang
      });

      if (res && res.report) {
        setSchemeReports(prev => [res.report, ...prev.filter(r => r.id !== localReport.id)]);
        if (res.analysis) {
          setSchemeAnalysis(prev => ({
            ...prev,
            [schemeId]: res.analysis
          }));
        }
        return res.report;
      }
    } catch (err) {
      console.warn('Backend scheme report persistence notice:', err.message);
    }

    return localReport;
  };

  // Submit Everyday Civic Issue Report
  const addCivicReport = async ({ text, category, location, district, durationDays, attachments }) => {
    const detectedLang = detectLanguage(text);
    const reportId = `CR-${Date.now().toString().slice(-4)}`;
    const attachmentList = Array.isArray(attachments) ? attachments : [];
    const imageAttachment = attachmentList.find(a => a.type?.startsWith('image/') || a.previewUrl);
    const userLocation = location || `${profile.district} Local Area`;
    const userDistrict = district || profile.district;
    const parsedDuration = parseInt(durationDays, 10) || 7;

    // Send to Supabase through backend API
    try {
      const res = await api.submitCivicReport({
        text,
        category,
        location: userLocation,
        district: userDistrict,
        durationDays: parsedDuration,
        attachments: attachmentList,
        userId: profile.id,
        language: detectedLang
      });

      if (res && res.report && res.cluster) {
        setCivicReports(prev => [res.report, ...prev.filter(r => r.id !== res.report.id)]);
        setCivicClusters(prev => {
          const exists = prev.some(c => c.id === res.cluster.id);
          if (exists) {
            return prev.map(c => c.id === res.cluster.id ? res.cluster : c);
          }
          return [res.cluster, ...prev];
        });
        return res.report;
      }
    } catch (err) {
      console.warn('Backend civic issue report persistence notice:', err.message);
    }

    // Local deterministic fallback
    const matchedCluster = civicClusters.find(c => 
      c.category.toLowerCase() === category.toLowerCase() &&
      c.district.toLowerCase() === userDistrict.toLowerCase()
    );

    const clusterId = matchedCluster ? matchedCluster.id : `CI-${Date.now().toString().slice(-4)}`;

    const newReport = {
      id: reportId,
      clusterId,
      text,
      language: detectedLang,
      location: userLocation,
      district: userDistrict,
      category,
      subIssue: category,
      reportedBy: 'Anonymous Citizen',
      userId: profile.id,
      isAnonymous: true,
      isSeeded: false,
      date: new Date().toISOString().split('T')[0],
      attachments: attachmentList,
      hasPhoto: Boolean(imageAttachment),
      photoUrl: imageAttachment?.previewUrl || null,
      durationDays: parsedDuration,
      status: 'Citizen-Reported'
    };

    setCivicReports(prev => [newReport, ...prev]);

    if (matchedCluster) {
      setCivicClusters(prev => prev.map(c => {
        if (c.id === clusterId) {
          const newReportCount = c.reportsCount + 1;
          const newEvidenceCount = c.evidenceCount + attachmentList.length;
          const newAiScore = calculateAIAssistedPriorityScore({
            reportCount: newReportCount,
            severityLevel: c.severity,
            durationDays: Math.max(c.durationDays, parsedDuration),
            affectedLocationsCount: c.affectedLocations?.length || 2,
            evidenceCount: newEvidenceCount
          });

          return {
            ...c,
            reportsCount: newReportCount,
            evidenceCount: newEvidenceCount,
            aiPriorityData: newAiScore,
            lastReportedDate: new Date().toISOString().split('T')[0]
          };
        }
        return c;
      }));
    } else {
      const initialAiScore = calculateAIAssistedPriorityScore({
        reportCount: 1,
        severityLevel: 'Medium',
        durationDays: parsedDuration,
        affectedLocationsCount: 1,
        evidenceCount: attachmentList.length
      });

      const newCluster = {
        id: clusterId,
        title: `${category} Issue — ${userLocation}`,
        category,
        department: 'Local Municipal Corporation',
        officialChannelKey: 'roads',
        location: userLocation,
        district: userDistrict,
        coordinates: [13.0827, 80.2707],
        reportsCount: 1,
        confirmationsCount: 1,
        evidenceCount: attachmentList.length,
        affectedLocations: [userLocation],
        severity: 'Medium',
        durationDays: parsedDuration,
        publicSupportScore: 10,
        aiPriorityData: initialAiScore,
        status: 'Monitoring',
        firstReportedDate: new Date().toISOString().split('T')[0],
        lastReportedDate: new Date().toISOString().split('T')[0],
        trustLabel: 'ANALYSIS',
        aiSummary: `Citizen report regarding ${category.toLowerCase()} in ${userLocation}. Platform is monitoring for additional confirmations.`,
        commonKeywords: [category.toLowerCase(), 'citizen report'],
        relevantOfficialChannels: {
          portal: 'https://gccservices.chennaicorporation.gov.in/pgr',
          helpline: '1913',
          email: 'grievances@chennaicorporation.gov.in'
        },
        grievanceStatus: 'Under Monitoring',
        officialResponse: null
      };

      setCivicClusters(prev => [newCluster, ...prev]);
    }

    return newReport;
  };

  // Upvote cluster
  const supportCivicIssue = async (clusterId) => {
    if (supportedClusterIds.includes(clusterId)) return;
    setSupportedClusterIds(prev => [...prev, clusterId]);

    setCivicClusters(prev => prev.map(c => {
      if (c.id === clusterId) {
        const newSupport = Math.min(100, c.publicSupportScore + 1);
        return { ...c, publicSupportScore: newSupport };
      }
      return c;
    }));

    try {
      const updated = await api.supportCivicCluster(clusterId);
      if (updated) {
        setCivicClusters(prev => prev.map(c => c.id === clusterId ? updated : c));
      }
    } catch (err) {
      console.warn('Backend support note:', err.message);
    }
  };

  // Confirmation loop
  const submitConfirmation = async (clusterId, isStillProblem) => {
    if (answeredConfirmationIds[clusterId] !== undefined) return;

    setAnsweredConfirmationIds(prev => ({
      ...prev,
      [clusterId]: isStillProblem
    }));

    const newConfirmation = {
      isStillProblem,
      timestamp: new Date().toISOString(),
      citizen: 'Anonymous Citizen'
    };

    setConfirmations(prev => ({
      ...prev,
      [clusterId]: [newConfirmation, ...(prev[clusterId] || [])]
    }));

    if (isStillProblem) {
      setCivicClusters(prev => prev.map(c => 
        c.id === clusterId ? { ...c, confirmationsCount: c.confirmationsCount + 1 } : c
      ));
    }

    try {
      await api.submitConfirmation(clusterId, isStillProblem, 'Anonymous Citizen');
    } catch (err) {
      console.warn('Backend confirmation note:', err.message);
    }
  };

  // Admin features
  const updateClusterStatus = (clusterId, newStatus) => {
    setCivicClusters(prev => prev.map(c => 
      c.id === clusterId ? { ...c, status: newStatus } : c
    ));
  };

  const addOfficialResponse = (clusterId, responseText) => {
    setCivicClusters(prev => prev.map(c => 
      c.id === clusterId ? { ...c, officialResponse: responseText } : c
    ));
  };

  const markGrievanceSubmitted = (clusterId) => {
    setCivicClusters(prev => prev.map(c => 
      c.id === clusterId ? { 
        ...c, 
        grievanceStatus: 'Manually Submitted by RAVEN Admin',
        lastReportedDate: new Date().toISOString().split('T')[0]
      } : c
    ));
  };

  // Feedback recording
  const addFeedback = ({ rating, category, comment, referenceId, feedbackType }) => {
    const feedbackItem = {
      id: `FB-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      rating: rating || null, // 'useful' | 'not-useful' | null
      category: category || 'Reporting experience',
      comment: comment || '',
      referenceId: referenceId || null,
      feedbackType: feedbackType || 'General Feedback',
      userId: profile.id
    };

    setFeedbacks(prev => [feedbackItem, ...prev]);
    return feedbackItem;
  };

  // Reset demo data
  const resetDemoData = () => {
    localStorage.removeItem('raven_profile');
    localStorage.removeItem('raven_schemes');
    localStorage.removeItem('raven_scheme_reports');
    localStorage.removeItem('raven_scheme_analysis');
    localStorage.removeItem('raven_civic_reports');
    localStorage.removeItem('raven_civic_clusters');
    localStorage.removeItem('raven_confirmations');
    localStorage.removeItem('raven_supported_clusters');
    localStorage.removeItem('raven_answered_confirmations');
    localStorage.removeItem('raven_feedbacks');

    setProfile(DEMO_PROFILES.Citizen);
    setSchemes(INITIAL_SCHEMES);
    setSchemeReports(INITIAL_SCHEME_REPORTS);
    setSchemeAnalysis(SCHEME_AGGREGATED_ANALYSIS);
    setCivicReports(INITIAL_CIVIC_REPORTS);
    setCivicClusters(INITIAL_CIVIC_CLUSTERS);
    setConfirmations(INITIAL_CONFIRMATIONS);
    setSupportedClusterIds([]);
    setAnsweredConfirmationIds({});
    setFeedbacks([]);
    setAutoOpenSchemeForm(false);
    navigateTo('landing');
  };

  return (
    <RavenContext.Provider
      value={{
        profile,
        setProfile,
        switchRole,
        schemes,
        schemeReports,
        schemeAnalysis,
        civicReports,
        civicClusters,
        confirmations,
        supportedClusterIds,
        answeredConfirmationIds,
        feedbacks,
        addFeedback,
        currentPage,
        selectedSchemeId,
        setSelectedSchemeId,
        autoOpenSchemeForm,
        setAutoOpenSchemeForm,
        selectedClusterId,
        setSelectedClusterId,
        navigateTo,
        addSchemeReport,
        addCivicReport,
        supportCivicIssue,
        submitConfirmation,
        updateClusterStatus,
        addOfficialResponse,
        markGrievanceSubmitted,
        resetDemoData,
        language,
        setLanguage,
        toggleLanguage,
        theme,
        setTheme,
        toggleTheme,
        t,
      }}
    >
      {children}
    </RavenContext.Provider>
  );
}

export function useRaven() {
  const context = useContext(RavenContext);
  if (!context) {
    throw new Error('useRaven must be used within a RavenProvider');
  }
  return context;
}
