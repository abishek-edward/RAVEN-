import React from 'react';
import { OFFICIAL_CHANNELS } from '../../constants/officialChannels';
import { Building2, ExternalLink, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';
import TrustBadge from './TrustBadge';

export default function OfficialChannelBox({ channelKey = 'streetlights', customTitle = null }) {
  const channel = OFFICIAL_CHANNELS[channelKey] || OFFICIAL_CHANNELS['streetlights'];

  return (
    <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg p-5 my-4">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-700">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {customTitle || 'WHERE CAN YOU RAISE THIS?'}
          </span>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            {channel.department}
          </h4>
        </div>
        <TrustBadge type="OFFICIAL" size="xs" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-xs text-slate-700 dark:text-slate-300">
        <div>
          <div className="font-medium text-slate-500 dark:text-slate-400 mb-1">Official Websites & Portals</div>
          <div className="space-y-1.5">
            <a
              href={channel.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-teal-700 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-300 font-medium hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Official Government Department Portal
            </a>
            <div>
              <a
                href={channel.complaintPortal}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 font-medium hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Dedicated Scheme / Grievance Portal
              </a>
            </div>
          </div>
        </div>

        <div>
          <div className="font-medium text-slate-500 dark:text-slate-400 mb-1">Direct Official Contact</div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-mono">
              <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{channel.helpline}</span>
            </div>
            {channel.email && (
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono text-xs">{channel.email}</span>
              </div>
            )}
            {channel.hours && (
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{channel.hours}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
        <a
          href={channel.officialWebsite}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-xs font-medium rounded transition"
        >
          <ExternalLink className="w-3 h-3" />
          Visit Official Website
        </a>
        <a
          href={channel.complaintPortal}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium rounded transition"
        >
          <ExternalLink className="w-3 h-3" />
          Open Complaint Portal
        </a>
        <a
          href={`tel:${channel.helpline.split(' ')[0]}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-900 dark:text-emerald-300 text-xs font-medium rounded transition"
        >
          <Phone className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
          Call Helpline
        </a>
      </div>
    </div>
  );
}
