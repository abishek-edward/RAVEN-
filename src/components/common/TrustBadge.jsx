import React from 'react';
import { TRUST_LABELS } from '../../constants/trustLabels';
import { useRaven } from '../../context/RavenContext';
import { ShieldCheck, Users, Cpu, Sparkles } from 'lucide-react';

export default function TrustBadge({ type = 'OFFICIAL', size = 'sm', showTooltip = true }) {
  const { t, language } = useRaven();
  const badgeConfig = TRUST_LABELS[type] || TRUST_LABELS.DEMO;

  const translatedLabels = {
    OFFICIAL: t('trustBadgeOfficial'),
    CITIZEN: t('trustBadgeCitizen'),
    ANALYSIS: t('trustBadgeAnalysis'),
    DEMO: t('trustBadgeReference'),
  };

  const darkClasses = {
    OFFICIAL: 'dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80',
    CITIZEN: 'dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/80',
    ANALYSIS: 'dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/80',
    DEMO: 'dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/80',
  };

  const icons = {
    ShieldCheck: <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600 dark:text-emerald-400 shrink-0" />,
    Users: <Users className="w-3.5 h-3.5 mr-1 text-blue-600 dark:text-blue-400 shrink-0" />,
    Cpu: <Cpu className="w-3.5 h-3.5 mr-1 text-purple-600 dark:text-purple-400 shrink-0" />,
    Sparkles: <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-600 dark:text-amber-400 shrink-0" />,
  };

  const sizeClasses = size === 'xs' 
    ? 'text-xs px-2 py-0.5' 
    : size === 'md'
    ? 'text-sm px-3 py-1 font-medium'
    : 'text-xs px-2.5 py-1 font-medium';

  const labelText = translatedLabels[type] || badgeConfig.label;

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-sm ${badgeConfig.badgeClass} ${darkClasses[type] || ''} ${sizeClasses}`}
      title={showTooltip ? (language === 'ta' ? labelText : badgeConfig.description) : undefined}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${badgeConfig.dotColor}`} />
      {icons[badgeConfig.icon]}
      <span>{labelText}</span>
    </span>
  );
}
