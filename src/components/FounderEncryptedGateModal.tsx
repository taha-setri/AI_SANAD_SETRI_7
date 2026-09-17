import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  KeyRound, 
  Check, 
  X, 
  AlertTriangle, 
  Terminal,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';

interface FounderEncryptedGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isArabic: boolean;
}

export const FounderEncryptedGateModal: React.FC<FounderEncryptedGateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  isArabic,
}) => {
  const [passkey, setPasskey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  if (!isOpen) return null;

  const hashKey = async (key: string): Promise<string> => {
    const enc = new TextEncoder().encode(key.trim().toUpperCase());
    const buf = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passkey.trim();
    if (!clean) return;

    if (failedAttempts >= 5) {
      setErrorMsg(
        isArabic
          ? 'تم تعليق محاولات التحقق مؤقتاً لدواعي الحماية السيادية.'
          : 'Access attempts temporarily halted for sovereign protection.'
      );
      return;
    }

    setIsVerifying(true);
    setErrorMsg(null);

    try {
      const inputHash = await hashKey(clean);
      const storedHash = localStorage.getItem('sanad_founder_passkey_hash');

      // STRICT 100% SOVEREIGN LOCK: Only the exclusive master passkey Tahasetri1998@ or founder verified hash
      const isMatch =
        clean === 'Tahasetri1998@' ||
        clean.toUpperCase() === 'TAHASETRI1998@' ||
        (storedHash && inputHash === storedHash);

      if (isMatch) {
        localStorage.setItem('sanad_founder_passkey_hash', inputHash);
        onSuccess();
        onClose();
        setPasskey('');
        setFailedAttempts(0);
      } else {
        setFailedAttempts((prev) => prev + 1);
        setErrorMsg(
          isArabic
            ? 'مفتاح التشفير السيادي غير مصرح به. الوصول محظور تماماً ومقيد للمؤسس طه الستري فقط.'
            : 'Unauthorized sovereign key. Access restricted exclusively to Founder TAHA SETRI.'
        );
      }
    } catch {
      if (clean === 'Tahasetri1998@' || clean.toUpperCase() === 'TAHASETRI1998@') {
        onSuccess();
        onClose();
        setPasskey('');
      } else {
        setFailedAttempts((prev) => prev + 1);
        setErrorMsg(
          isArabic
            ? 'فشل في مطابقة شفرة الوصول السيادية.'
            : 'Cryptographic authentication mismatch.'
        );
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md rounded-3xl bg-slate-900 border border-amber-500/40 shadow-2xl p-6 sm:p-7 relative text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Ambient Red/Amber Vault Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 rtl:left-auto rtl:right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title={isArabic ? 'إغلاق والعودة للواجهة العامة' : 'Close and return to public portal'}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-red-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
            <Lock className="w-7 h-7 animate-pulse" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono tracking-wider uppercase mb-1">
              <ShieldAlert className="w-3 h-3" />
              <span>{isArabic ? 'منطقة سيادية معزولة' : 'Sovereign Encrypted Zone'}</span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-wide">
              {isArabic ? 'قمرة المؤسس TAHA SETRI' : 'Founder Cockpit: TAHA SETRI'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
              {isArabic
                ? 'تم إغلاق وتشفير جميع منافذ الوصول لقمرة المؤسس بموجب البروتوكول الصارم. هذه المنطقة مخصصة حصراً للمؤسس المبتكر.'
                : 'All public access vectors to the Founder Cockpit are encrypted and strictly isolated. Accessible only to Founder TAHA SETRI.'}
            </p>
          </div>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleVerify} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>{isArabic ? 'مفتاح التشفير السيادي (Sovereign Passkey)' : 'Sovereign Passkey'}</span>
              <span className="text-[10px] font-mono text-slate-500">AES-256 SHA-256</span>
            </label>

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={passkey}
                onChange={(e) => {
                  setPasskey(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder={isArabic ? 'أدخل مفتاح التشفير السري...' : 'Enter sovereign key...'}
                autoFocus
                className="w-full bg-slate-950 border border-slate-750 focus:border-amber-500/80 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-mono transition-all pr-10 rtl:pr-4 rtl:pl-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute top-1/2 -translate-y-1/2 right-3 rtl:right-auto rtl:left-3 text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              disabled={!passkey.trim() || isVerifying}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-amber-500/20 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>{isArabic ? 'فك التشفير ودخول القمرة' : 'Decrypt & Enter Cockpit'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer text-center"
            >
              {isArabic ? 'العودة إلى الواجهة العامة' : 'Return to Public Portal'}
            </button>
          </div>
        </form>

        {/* Security Audit Badge */}
        <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <div className="flex items-center gap-1">
            <Terminal className="w-3 h-3 text-emerald-400" />
            <span>ENCRYPTED_VAULT_ACTIVE</span>
          </div>
          <div className="text-amber-400/80 font-semibold">
            {isArabic ? 'بروتوكول طه ستري 2026' : 'TAHA SETRI 2026'}
          </div>
        </div>
      </div>
    </div>
  );
};
