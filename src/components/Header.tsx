import React, { useState } from 'react';
import { 
  Sparkles, 
  Search,
  MessageSquare,
  Globe,
  Lock,
  LogOut,
  ShieldCheck,
  Crown
} from 'lucide-react';
import { ActiveView, UserPreferences } from '../types';
import { SanadSetriLogo } from './SanadSetriLogo';

interface HeaderProps {
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  userPreferences: UserPreferences;
  onUpdatePreferences: (prefs: Partial<UserPreferences>) => void;
  isCockpitUnlocked: boolean;
  onLockCockpit?: () => void;
  onTriggerFounderGate?: () => void;
  onStartCleanSlate?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onSelectView,
  userPreferences,
  onUpdatePreferences,
  isCockpitUnlocked,
  onLockCockpit,
  onTriggerFounderGate,
  onStartCleanSlate,
}) => {
  const isArabic = userPreferences.language === 'ar';
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  // Hidden discrete founder sovereign trigger: 5 rapid clicks on logo
  const handleLogoClick = () => {
    const now = Date.now();
    if (now - lastClickTime < 600) {
      const nextCount = clickCount + 1;
      if (nextCount >= 5) {
        setClickCount(0);
        if (onTriggerFounderGate) {
          onTriggerFounderGate();
        }
        return;
      }
      setClickCount(nextCount);
    } else {
      setClickCount(1);
    }
    setLastClickTime(now);
    onSelectView('vision_search');
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 select-none transition-colors">
      {/* Brand & Clean Platform Identity */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleLogoClick}
          className="cursor-pointer text-left rtl:text-right group transition-all p-1 rounded-xl hover:bg-slate-900/60"
          title={isArabic ? 'الواجهة الرئيسية - SANAD' : 'Main Portal - SANAD'}
        >
          <SanadSetriLogo size="md" showLabel={true} label="SANAD" />
        </button>
      </div>

      {/* Center: Dedicated Public Navigation Spaces (مكان البحث & مكان التحدث) */}
      <nav className="flex items-center gap-1.5 sm:gap-2 p-1 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-inner">
        {/* مكان البحث (Search Portal) */}
        <button
          onClick={() => onSelectView('vision_search')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeView === 'vision_search'
              ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isArabic ? 'مكان البحث' : 'Search Portal'}</span>
        </button>

        {/* مكان التحدث (Chat & Talk Studio) */}
        <button
          onClick={() => onSelectView('chat')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeView === 'chat'
              ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isArabic ? 'مكان التحدث' : 'Chat & Talk'}</span>
        </button>

        {/* قمرة المؤسس (Founder Cockpit) */}
        <button
          onClick={() => {
            if (isCockpitUnlocked) {
              onSelectView('founder_cockpit');
            } else if (onTriggerFounderGate) {
              onTriggerFounderGate();
            }
          }}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeView === 'founder_cockpit'
              ? 'bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-600/20 text-amber-300 border border-amber-500/50 shadow-sm shadow-amber-500/10'
              : isCockpitUnlocked
              ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 border border-amber-500/30'
              : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800/50'
          }`}
          title={isArabic ? 'قمرة قيادة المؤسس TAHA SETRI' : 'Founder Sovereign Cockpit TAHA SETRI'}
        >
          {isCockpitUnlocked ? (
            <Crown className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <Lock className="w-3.5 h-3.5 text-amber-500/70" />
          )}
          <span>{isArabic ? 'قمرة المؤسس' : 'Founder Cockpit'}</span>
          {isCockpitUnlocked && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse hidden sm:inline-block" />
          )}
        </button>
      </nav>

      {/* Clean Right Controls: Language Switcher, Clean Slate & Founder Exit */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Clean Slate Button: Clears temporary session to guaranteed clean page */}
        {onStartCleanSlate && (
          <button
            onClick={() => {
              if (window.confirm(isArabic ? 'هل تريد فتح صفحة نظيفة وبدء جلسة جديدة فارغة؟' : 'Start a clean, empty session?')) {
                onStartCleanSlate();
              }
            }}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 text-xs transition-all cursor-pointer"
            title={isArabic ? 'فتح صفحة جديدة نظيفة تماماً بدون أي بيانات سابقة' : 'Open a completely clean, isolated session'}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">{isArabic ? 'صفحة نظيفة' : 'Clean Slate'}</span>
          </button>
        )}

        {/* Language Switcher */}
        <button
          onClick={() => {
            const nextLang = userPreferences.language === 'ar' ? 'en' : 'ar';
            onUpdatePreferences({ language: nextLang });
            document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
            document.documentElement.lang = nextLang;
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-mono transition-all cursor-pointer"
          title={isArabic ? 'التحويل للإنجليزية' : 'Switch to Arabic'}
        >
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold">{userPreferences.language === 'ar' ? 'EN' : 'عربي'}</span>
        </button>

        {/* If Founder is unlocked and inside the Cockpit: Provide Lock & Return to Public button */}
        {activeView === 'founder_cockpit' && isCockpitUnlocked && (
          <button
            onClick={() => {
              if (onLockCockpit) onLockCockpit();
              else onSelectView('vision_search');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 hover:bg-red-900/80 text-xs font-semibold transition-all cursor-pointer shadow-sm"
            title={isArabic ? 'قفل قمرة المؤسس وتأمين الخروج للواجهة العامة' : 'Lock Cockpit & Return to Public'}
          >
            <Lock className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">{isArabic ? 'قفل القمرة والخروج للعامة' : 'Lock & Exit to Public'}</span>
          </button>
        )}
      </div>
    </header>
  );
};

