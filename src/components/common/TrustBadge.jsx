import React from 'react';
import { TRUST_LABELS } from '../../constants/trustLabels';
import { ShieldCheck, Users, Cpu, Sparkles } from 'lucide-react';

export default function TrustBadge({ type = 'OFFICIAL', size = 'sm', showTooltip = true }) {
  const badgeConfig = TRUST_LABELS[type] || TRUST_LABELS.DEMO;

  const icons = {
    ShieldCheck: <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0" />,
    Users: <Users className="w-3.5 h-3.5 mr-1 text-blue-600 shrink-0" />,
    Cpu: <Cpu className="w-3.5 h-3.5 mr-1 text-purple-600 shrink-0" />,
    Sparkles: <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-600 shrink-0" />,
  };

  const sizeClasses = size === 'xs' 
    ? 'text-xs px-2 py-0.5' 
    : size === 'md'
    ? 'text-sm px-3 py-1 font-medium'
    : 'text-xs px-2.5 py-1 font-medium';

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-sm ${badgeConfig.badgeClass} ${sizeClasses}`}
      title={showTooltip ? badgeConfig.description : undefined}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${badgeConfig.dotColor}`} />
      {icons[badgeConfig.icon]}
      <span>{badgeConfig.label}</span>
    </span>
  );
}
