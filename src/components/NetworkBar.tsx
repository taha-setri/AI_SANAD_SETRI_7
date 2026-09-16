import React, { useState } from 'react';
import { 
  ExternalLink, 
  Sparkles, 
  Quote, 
  ArrowUpRight, 
  Radio, 
  X, 
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface NetworkBarProps {
  isArabic: boolean;
}

export const NetworkBar: React.FC<NetworkBarProps> = ({ isArabic }) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return null;
  }

  const previousSiteUrl = 'https://vault-of-daily-motivational-quotes.vercel.app/';

  return (
    <div 
      id="sanad-network-bar"
      className="relative z-40 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-cyan-900/40 text-xs text-slate-300 select-none shadow-sm transition-all"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-1.5 flex items-center justify-between gap-2 sm:gap-4 flex-wrap sm:flex-nowrap">
        
        {/* Left / Start: Network Identification */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-[11px] font-medium text-cyan-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="tracking-wide">
              {isArabic ? 'شبكة سند الستري' : 'SANAD SETRI NETWORK'}
            </span>
          </div>

          <span className="hidden md:inline-block text-slate-500">•</span>

          <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-slate-400">
            <Radio className="w-3 h-3 text-cyan-400" />
            <span>{isArabic ? 'منظومة التطبيقات المتصلة' : 'Connected Ecosystem'}</span>
          </span>
        </div>

        {/* Center / Highlight: Previous Site Direct Portal Link */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-center sm:justify-end md:justify-center overflow-hidden">
          <span className="text-[11px] text-slate-400 shrink-0 hidden sm:inline">
            {isArabic ? 'الانتقال إلى الموقع السابق:' : 'Navigate to Previous Site:'}
          </span>
          
          <a
            id="previous-site-link"
            href={previousSiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-lg bg-indigo-950/50 hover:bg-indigo-900/60 border border-indigo-500/30 hover:border-cyan-400/60 text-slate-200 hover:text-cyan-200 transition-all duration-200 text-[11px] sm:text-xs font-medium shadow-sm hover:shadow-cyan-950/40"
            title={isArabic ? 'فتح خزانة الاقتباسات التحفيزية اليومية' : 'Open Vault of Daily Motivational Quotes'}
          >
            <Quote className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
            <span className="truncate max-w-[200px] sm:max-w-none font-semibold">
              {isArabic ? 'خزانة الاقتباسات التحفيزية اليومية' : 'Vault of Daily Motivational Quotes'}
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-900/70 text-indigo-300 font-mono hidden lg:inline border border-indigo-700/50">
              vault-quotes.vercel.app
            </span>
            <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
          </a>
        </div>

        {/* Right / End: External Link status & Dismiss toggle */}
        <div className="flex items-center gap-1.5 shrink-0">
          <a
            href={previousSiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300 transition-colors p-1"
            title={isArabic ? 'فتح في نافذة جديدة' : 'Open in new tab'}
          >
            <ExternalLink className="w-3 h-3" />
            <span className="text-[10px]">{isArabic ? 'فتح الرابط' : 'Open'}</span>
          </a>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-colors cursor-pointer"
            title={isArabic ? 'إخفاء الشريط' : 'Dismiss bar'}
            aria-label={isArabic ? 'إخفاء شريط الشبكة' : 'Dismiss network bar'}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
