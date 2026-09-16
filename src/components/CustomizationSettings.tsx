import React from 'react';
import { 
  Settings, 
  Palette, 
  Globe, 
  ShieldCheck, 
  Sliders, 
  Trash2, 
  Check, 
  EyeOff, 
  Lock, 
  RefreshCw,
  Cpu,
  Layers
} from 'lucide-react';
import { PrivacyConfig, UserPreferences, EngineId, ThemeName } from '../types';
import { UNIFIED_ENGINES } from '../lib/constants';

interface CustomizationSettingsProps {
  userPreferences: UserPreferences;
  onUpdatePreferences: (prefs: Partial<UserPreferences>) => void;
  privacyConfig: PrivacyConfig;
  onUpdatePrivacy: (cfg: Partial<PrivacyConfig>) => void;
  onClearAllData: () => void;
  defaultEngineId: EngineId;
  onSetDefaultEngine: (id: EngineId) => void;
}

export const CustomizationSettings: React.FC<CustomizationSettingsProps> = ({
  userPreferences,
  onUpdatePreferences,
  privacyConfig,
  onUpdatePrivacy,
  onClearAllData,
  defaultEngineId,
  onSetDefaultEngine,
}) => {
  const isArabic = userPreferences.language === 'ar';

  const themes: { id: ThemeName; nameAr: string; nameEn: string; desc: string; preview: string }[] = [
    {
      id: 'midnight',
      nameAr: 'أسود فحمي (Onyx Midnight)',
      nameEn: 'Onyx Midnight',
      desc: isArabic ? 'واجهة ليلية فائقة الأناقة مع تباين أزرق سياني مريح للعين' : 'Ultra dark with deep cyan contrast',
      preview: 'bg-slate-950 border-cyan-500',
    },
    {
      id: 'navy',
      nameAr: 'أزرق تنفيذي (Executive Navy)',
      nameEn: 'Executive Navy',
      desc: isArabic ? 'طابع قيادي رصين بدرجات الكحلي والأزرق الملكي' : 'Deep navy blue for corporate focus',
      preview: 'bg-slate-900 border-blue-500',
    },
    {
      id: 'emerald',
      nameAr: 'زمردي سيبراني (Cyber Emerald)',
      nameEn: 'Cyber Emerald',
      desc: isArabic ? 'مظهر مالي وتقني مستوحى من درجات الزمرد النقي' : 'Sharp emerald accents with dark zinc canvas',
      preview: 'bg-zinc-950 border-emerald-500',
    },
    {
      id: 'paper',
      nameAr: 'رمادي مضيء (Clean Minimal)',
      nameEn: 'Clean Minimal',
      desc: isArabic ? 'مظهر نهاري فاتح ذو خلفية ناصعة وخطوط عالية التباين' : 'Light modern canvas with high-contrast typography',
      preview: 'bg-slate-100 border-slate-400',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
      {/* View Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-cyan-400" />
          <span>{isArabic ? 'تخصيص الواجهة والخصوصية التامة' : 'Customization & Sovereign Privacy'}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          {isArabic 
            ? 'تكييف تجربة Sanad setri بالكامل لتناسب متطلبات عملك، مع تحكم صارم في درع الخصوصية وتشفير البيانات.'
            : 'Tailor workspace aesthetics, layout density, multi-language, and zero-knowledge privacy guards.'}
        </p>
      </div>

      {/* Section 1: Themes and Visual Identity */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Palette className="w-4 h-4 text-cyan-400" />
          <span>{isArabic ? 'سمات المظهر والألوان (Theme Customizer)' : 'Interface Appearance'}</span>
        </div>
        <p className="text-xs text-slate-400">
          {isArabic ? 'اختر النمط البصري المتوافق مع راحة عينيك وطبيعة مهامك.' : 'Select visual theme archetype tuned for focus.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {themes.map((theme) => {
            const isSelected = userPreferences.theme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => onUpdatePreferences({ theme: theme.id })}
                className={`p-4 rounded-2xl border text-right transition-all flex items-start gap-3.5 cursor-pointer ${
                  isSelected 
                    ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-lg shadow-cyan-500/10' 
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl shrink-0 border-2 ${theme.preview} flex items-center justify-center`}>
                  {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-xs text-white">
                    {isArabic ? theme.nameAr : theme.nameEn}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    {theme.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 2: Language & Layout Density */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span>{isArabic ? 'اللغة والهيكلية (Language & Layout)' : 'Language & Density'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Language Switch */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <label className="text-xs font-semibold text-white block">
              {isArabic ? 'لغة الواجهة والاتجاه' : 'Primary Language'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onUpdatePreferences({ language: 'ar' });
                  document.documentElement.dir = 'rtl';
                  document.documentElement.lang = 'ar';
                }}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  userPreferences.language === 'ar'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-850'
                }`}
              >
                العربية (RTL)
              </button>
              <button
                onClick={() => {
                  onUpdatePreferences({ language: 'en' });
                  document.documentElement.dir = 'ltr';
                  document.documentElement.lang = 'en';
                }}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  userPreferences.language === 'en'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-850'
                }`}
              >
                English (LTR)
              </button>
            </div>
          </div>

          {/* Density Switch */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <label className="text-xs font-semibold text-white block">
              {isArabic ? 'كثافة العرض (Layout Density)' : 'Layout Density'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onUpdatePreferences({ layoutDensity: 'comfortable' })}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  userPreferences.layoutDensity === 'comfortable'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-850'
                }`}
              >
                {isArabic ? 'مريح (افتراضي)' : 'Comfortable'}
              </button>
              <button
                onClick={() => onUpdatePreferences({ layoutDensity: 'compact' })}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  userPreferences.layoutDensity === 'compact'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-850'
                }`}
              >
                {isArabic ? 'مكثف للمحترفين' : 'Compact'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Privacy & Zero-Knowledge Security Shield */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{isArabic ? 'درع الخصوصية والسيادة الرقمية (Zero-Knowledge)' : 'Zero-Knowledge Privacy Shield'}</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
            {isArabic ? 'حماية مشددة' : 'Strict Mode'}
          </span>
        </div>
        <p className="text-xs text-slate-400">
          {isArabic 
            ? 'تلتزم منصة Sanad setri بعدم مشاركة أو استغلال بيانات محادثاتك مع أي أطراف ثالثة أو تدريب النماذج عليها.' 
            : 'Zero telemetry, zero vendor lock-in, client-encrypted state.'}
        </p>

        <div className="space-y-3 pt-2">
          {/* Zero Telemetry Toggle */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-white">
                {isArabic ? 'حظر أي تتبع أو إحصائيات خارجية (Zero Telemetry)' : 'Zero Telemetry Enforcement'}
              </div>
              <div className="text-[11px] text-slate-400">
                {isArabic ? 'حظر ملفات التتبع والربط التحليلي مع خوادم خارجية.' : 'Block all external tracking beacons.'}
              </div>
            </div>
            <button
              onClick={() => onUpdatePrivacy({ zeroTelemetry: !privacyConfig.zeroTelemetry })}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                privacyConfig.zeroTelemetry ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                privacyConfig.zeroTelemetry ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>

          {/* Mask Sensitive Data */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-white">
                {isArabic ? 'إخفاء الأرقام والبيانات الحساسة أثناء العرض' : 'Mask Sensitive Entities in UI'}
              </div>
              <div className="text-[11px] text-slate-400">
                {isArabic ? 'حماية من التلصص البصري عند مشاركة الشاشة في الاجتماعات.' : 'Visual protection during screenshares.'}
              </div>
            </div>
            <button
              onClick={() => onUpdatePrivacy({ maskSensitiveData: !privacyConfig.maskSensitiveData })}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                privacyConfig.maskSensitiveData ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                privacyConfig.maskSensitiveData ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>

          {/* Default Engine Assignment */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between flex-wrap gap-2">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-white">
                {isArabic ? 'المحرك الافتراضي عند فتح جلسة جديدة' : 'Default Engine on Session Launch'}
              </div>
              <div className="text-[11px] text-slate-400">
                {isArabic ? 'المحرك المخصص الذي يتم اختياره تلقائياً.' : 'Pre-selected unified engine.'}
              </div>
            </div>
            <select
              value={defaultEngineId}
              onChange={(e) => onSetDefaultEngine(e.target.value as EngineId)}
              className="bg-slate-900 border border-slate-750 text-xs text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              {UNIFIED_ENGINES.map((eng) => (
                <option key={eng.id} value={eng.id}>
                  {isArabic ? eng.nameAr : eng.nameEn} ({eng.codename})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Danger Zone: Clear Cache */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-rose-400">
              {isArabic ? 'مسح الذاكرة المؤقتة وإعادة التعيين' : 'Emergency Session Wipe'}
            </div>
            <div className="text-[10px] text-slate-500">
              {isArabic ? 'حذف كافة المحادثات والمهام المخزنة على هذا المتصفح فوراً.' : 'Purge all locally cached data from browser memory.'}
            </div>
          </div>

          <button
            onClick={() => {
              if (confirm(isArabic ? 'هل أنت متأكد من رغبتك في مسح كافة المحادثات والمهام المحلية؟' : 'Purge all sessions and tasks?')) {
                onClearAllData();
              }
            }}
            className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 text-xs font-semibold border border-rose-800/50 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isArabic ? 'مسح شامل للبيانات' : 'Purge Local Cache'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
