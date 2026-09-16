import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Cookie, 
  Check, 
  X, 
  Lock, 
  FileText, 
  Sparkles,
  Sliders
} from 'lucide-react';
import { CookiePreferences } from '../types';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isArabic: boolean;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({
  isOpen,
  onClose,
  isArabic,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 relative text-slate-100 max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 left-5 text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span>{isArabic ? 'إخلاء المسؤولية القانونية والتنظيمية' : 'Legal & Regulatory Disclaimer'}</span>
            </h2>
            <p className="text-xs text-slate-400">
              {isArabic ? 'منصة Sanad setri - بيئة العمل الذكية والسيادية' : 'Sanad setri Sovereign Platform'}
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800 pt-4">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h4 className="font-semibold text-white flex items-center gap-1.5 text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{isArabic ? '1. طبيعة المخرجات والذكاء الاصطناعي' : '1. Nature of AI Outputs'}</span>
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              {isArabic 
                ? 'تُقدَّم مخرجات المحركات الذكية الموحدة في منصة Sanad setri كأدوات مساعدة استشارية ومعرفية وتوليدية. لا تُعد المخرجات استشارات قانونية، مالية، أو طبية حاسمة، ويقع عبء التحقق النهائي وتطبيق المخرجات على عاتق المستخدم أو المؤسسة المشغلة.'
                : 'Outputs from the unified engines are generated for augmented productivity and cognitive assistance. They do not constitute formal legal, financial, or medical counsel.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h4 className="font-semibold text-white flex items-center gap-1.5 text-xs sm:text-sm">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>{isArabic ? '2. ملكية البيانات والخصوصية التامة' : '2. Data Sovereignty & Zero Telemetry'}</span>
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              {isArabic 
                ? 'تعمل المنصة بموجب بروتوكول التشفير الصفري للبيانات (Zero-Knowledge Architecture). يملك المستخدم كامل الحقوق الفكرية والتنفيذية لكافة النصوص، الأكواد، والوثائق المُعالجة. المنصة لا تقوم ببيع البيانات، أو تتبع سلوك المستخدمين، أو مشاركة المدخلات لأغراض تدريب نماذج خارجية.'
                : 'Full zero-knowledge data architecture is strictly enforced. The user retains 100% intellectual ownership of all generated content, documents, and code.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h4 className="font-semibold text-white flex items-center gap-1.5 text-xs sm:text-sm">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>{isArabic ? '3. مسؤولية تشغيل المفاتيح والنسخ الاحتياطي' : '3. Key Custody & Backup Responsibilities'}</span>
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              {isArabic 
                ? 'بما أن التشفير يتم محلياً بواسطة مفاتيح سرية يشتقها المستخدم، فإن حفظ كلمات السر ومفاتيح الخزنة يقع على عاتق المستخدم ومؤسس المنصة. تتيح قمرة المؤسس زر "خزن كل شيء" لتنزيل وأرشفة الخزنة المشفرة محلياً وسحابياً بأمان.'
                : 'Because client-side AES-256 encryption is derived locally, the user holds final custody of their vault passkeys. Use the Founder Cockpit "Store Everything" function to archive encrypted snapshots.'}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            {isArabic ? 'إصدار الوثيقة: 2026.1 - إشراف TAHA SETRI' : 'Document v2026.1 • Supervised by TAHA SETRI'}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
          >
            {isArabic ? 'فهمت وأوافق' : 'Acknowledge'}
          </button>
        </div>
      </div>
    </div>
  );
};

interface CookiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  isArabic: boolean;
}

export const CookiesModal: React.FC<CookiesModalProps> = ({
  isOpen,
  onClose,
  isArabic,
}) => {
  const [prefs, setPrefs] = useState<CookiePreferences>(() => {
    const saved = localStorage.getItem('sanad_cookie_prefs');
    return saved ? JSON.parse(saved) : {
      essential: true,
      analytics: false,
      personalization: true,
      cloudSyncCache: true,
    };
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem('sanad_cookie_prefs', JSON.stringify(prefs));
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 relative text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 left-5 text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Cookie className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span>{isArabic ? 'سياسة ملفات تعريف الارتباط والخصوصية' : 'Cookies & Storage Privacy Policy'}</span>
            </h2>
            <p className="text-xs text-slate-400">
              {isArabic ? 'تحكم كامل في التخزين المحلي والسيادة الرقمية' : 'Zero-tracking, strictly sovereign local storage policy'}
            </p>
          </div>
        </div>

        <div className="space-y-3.5 border-t border-slate-800 pt-4 text-xs">
          {/* Essential */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-semibold text-white flex items-center gap-2">
                <span>{isArabic ? 'ملفات التخزين الأساسية (جلسات العمل)' : 'Essential Local Storage'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                  {isArabic ? 'إلزامي' : 'Required'}
                </span>
              </div>
              <p className="text-slate-400 text-[11px]">
                {isArabic ? 'ضرورية لحفظ محادثاتك، مهامك، والسمة البصرية داخل جهازك فقط.' : 'Maintains active workspace, conversations, and UI preferences in browser memory.'}
              </p>
            </div>
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Check className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Zero Telemetry / Analytics */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-semibold text-white flex items-center gap-2">
                <span>{isArabic ? 'ملفات التتبع والإعلانات (Third-party Trackers)' : 'Analytics & Third-Party Trackers'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800/50">
                  {isArabic ? 'محظور تماماً' : 'Permanently Blocked'}
                </span>
              </div>
              <p className="text-slate-400 text-[11px]">
                {isArabic ? 'تلتزم المنصة بعدم استخدام أي ملفات كوكيز إعلانية أو أدوات تتبع خارجية نهائياً.' : 'Sanad setri employs zero marketing cookies, no telemetry beacons, and no tracking scripts.'}
              </p>
            </div>
            <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-mono text-[10px]">
              ✕
            </div>
          </div>

          {/* Cloud Sync Cache */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-semibold text-white">
                {isArabic ? 'ذاكرة المزامنة السحابية المشفرة' : 'Encrypted Sync Memory Cache'}
              </div>
              <p className="text-slate-400 text-[11px]">
                {isArabic ? 'تخزين الرموز المؤقتة لفك تشفير الخزنة بين أجهزتك الخاصة.' : 'Cache encrypted salt & ephemeral session keys for cross-device sync.'}
              </p>
            </div>
            <button
              onClick={() => setPrefs(p => ({ ...p, cloudSyncCache: !p.cloudSyncCache }))}
              className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                prefs.cloudSyncCache ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${
                prefs.cloudSyncCache ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            {isArabic ? 'حماية سيادية بإشراف TAHA SETRI' : 'Guaranteed by TAHA SETRI'}
          </span>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            {savedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Sliders className="w-3.5 h-3.5" />}
            <span>{savedSuccess ? (isArabic ? 'تم حفظ التفضيلات' : 'Saved!') : (isArabic ? 'حفظ التفضيلات' : 'Save Preferences')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
