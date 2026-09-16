import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  Scale, 
  Cookie, 
  Crown,
  KeyRound
} from 'lucide-react';

interface VisionFooterProps {
  onOpenDisclaimer: () => void;
  onOpenCookies: () => void;
  isArabic: boolean;
  isCockpitUnlocked?: boolean;
  onOpenFounderCockpit?: () => void;
}

export const VisionFooter: React.FC<VisionFooterProps> = ({
  onOpenDisclaimer,
  onOpenCookies,
  isArabic,
  isCockpitUnlocked,
  onOpenFounderCockpit,
}) => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-xl py-3.5 px-4 sm:px-8 z-30 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Founder Signature Area & Cockpit Quick Access */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-indigo-500/10 border border-amber-500/30 shadow-sm group">
            <Crown className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400 font-medium">
                {isArabic ? 'المؤسس المبتكر:' : 'Founder & Architect:'}
              </span>
              <span className="font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 font-mono text-xs">
                TAHA SETRI
              </span>
            </div>
          </div>

          {onOpenFounderCockpit && (
            <button
              onClick={onOpenFounderCockpit}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border text-xs font-semibold cursor-pointer transition-all ${
                isCockpitUnlocked
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-slate-900/80 hover:bg-amber-950/40 text-slate-400 hover:text-amber-300 border-slate-800 hover:border-amber-500/40'
              }`}
              title={isArabic ? 'الدخول إلى قمرة قيادة المؤسس' : 'Access Founder Cockpit'}
            >
              {isCockpitUnlocked ? (
                <Crown className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-amber-500/70" />
              )}
              <span>{isArabic ? 'قمرة المؤسس' : 'Founder Cockpit'}</span>
              {isCockpitUnlocked && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>
          )}
        </div>

        {/* Legal, Disclaimer, and Cookies Links */}
        <div className="flex items-center gap-2 sm:gap-4 text-slate-400 text-[11px]">
          <button
            onClick={onOpenDisclaimer}
            className="flex items-center gap-1 hover:text-cyan-300 transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-slate-900"
          >
            <Scale className="w-3.5 h-3.5 text-slate-400" />
            <span>{isArabic ? 'إخلاء المسؤولية' : 'Disclaimer'}</span>
          </button>

          <span className="text-slate-700">•</span>

          <button
            onClick={onOpenCookies}
            className="flex items-center gap-1 hover:text-cyan-300 transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-slate-900"
          >
            <Cookie className="w-3.5 h-3.5 text-slate-400" />
            <span>{isArabic ? 'ملفات تعريف الارتباط (الكوكيز)' : 'Cookies Policy'}</span>
          </button>

          <span className="text-slate-700 hidden sm:inline">•</span>

          {/* Privacy Protocol Badge */}
          <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-800/40">
            <Lock className="w-3 h-3" />
            <span>AES-256 Vault</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
