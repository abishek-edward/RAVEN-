export const TRUST_LABELS = {
  OFFICIAL: {
    id: 'official',
    label: 'Officially Verified',
    dotColor: 'bg-emerald-500',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200 ring-emerald-500/20',
    description: 'Information sourced directly from real official government portals or official gazettes/documents.',
    icon: 'ShieldCheck',
  },
  CITIZEN: {
    id: 'citizen',
    label: 'Citizen-Reported',
    dotColor: 'bg-blue-500',
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-200 ring-blue-500/20',
    description: 'Information submitted directly by citizens. It is not automatically factually verified.',
    icon: 'Users',
  },
  ANALYSIS: {
    id: 'analysis',
    label: 'Platform Analysis',
    dotColor: 'bg-purple-500',
    badgeClass: 'bg-purple-50 text-purple-800 border-purple-200 ring-purple-500/20',
    description: 'AI-generated analysis, clustering, or statistical insight. This is non-official platform analysis.',
    icon: 'Cpu',
  },
  DEMO: {
    id: 'demo',
    label: 'Reference',
    dotColor: 'bg-amber-400',
    badgeClass: 'bg-amber-50 text-amber-900 border-amber-300 ring-amber-400/30',
    description: 'Synthetic data created exclusively for demonstration purposes in demo mode.',
    icon: 'Sparkles',
  }
};
