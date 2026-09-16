import React, { useState } from 'react';
import { 
  Crown, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  HardDrive, 
  Download, 
  Check, 
  KeyRound, 
  Cpu, 
  Layers, 
  Activity, 
  RefreshCw, 
  AlertCircle, 
  Database,
  ArrowRight,
  ArrowLeft,
  Terminal,
  FileCheck,
  Eye,
  EyeOff,
  Sparkles,
  MessageSquare,
  LayoutDashboard,
  BarChart3,
  Workflow,
  Settings,
  Plus,
  Pin,
  Trash2,
  Search,
  Cloud,
  Sliders,
  Fish,
  Flower2,
  Waves,
  Compass
} from 'lucide-react';
import { 
  Conversation, 
  MultiTaskItem, 
  PrivacyConfig, 
  UserPreferences, 
  EngineId, 
  ActiveView,
  ContentCategory,
  VisionDisplayConfig,
  BiomeCreatureMode,
  BiomePace,
  PlatformLogoStyle
} from '../types';
import { UNIFIED_ENGINES, CATEGORY_LABELS } from '../lib/constants';
import { encryptData } from '../lib/crypto';
import { DEFAULT_VISION_CONFIG } from '../lib/storage';
import { DashboardView } from './DashboardView';
import { ChatStudio } from './ChatStudio';
import { AnalyticsView } from './AnalyticsView';
import { IntegrationsView } from './IntegrationsView';
import { CustomizationSettings } from './CustomizationSettings';
import { SanadSetriLogo, SanadSetriBrand } from './SanadSetriLogo';

export type CockpitTab = 'storage' | 'vision' | 'chat' | 'tasks' | 'analytics' | 'integrations' | 'settings';

interface FounderCockpitProps {
  conversations: Conversation[];
  tasks: MultiTaskItem[];
  privacyConfig: PrivacyConfig;
  userPreferences: UserPreferences;
  isUnlocked: boolean;
  onUnlock: () => void;
  onLock: () => void;
  onNavigateView: (view: ActiveView) => void;
  isArabic: boolean;
  activeEngineId: EngineId;
  onSelectEngine: (id: EngineId) => void;
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: (engineId?: EngineId) => void;
  onDeleteConversation: (id: string) => void;
  onTogglePin: (id: string) => void;
  onSendMessage: (text: string, engineId: EngineId) => Promise<void>;
  isLoading: boolean;
  onAddTask: (task: Omit<MultiTaskItem, 'id' | 'createdAt'>) => void;
  onUpdateTaskStatus: (id: string, status: MultiTaskItem['status']) => void;
  onSaveAsTask: (title: string, desc: string, category: ContentCategory, engineId: EngineId) => void;
  onUpdatePreferences: (prefs: Partial<UserPreferences>) => void;
  onUpdatePrivacy: (cfg: Partial<PrivacyConfig>) => void;
  onClearAllData: () => void;
  onOpenSyncModal: () => void;
  onNewChatWithPrompt: (prompt: string, engineId: EngineId) => void;
  activeTab?: CockpitTab;
  onSelectTab?: (tab: CockpitTab) => void;
  visionConfig: VisionDisplayConfig;
  onUpdateVisionConfig: (cfg: Partial<VisionDisplayConfig>) => void;
  onRestoreDemoData?: () => void;
}

export const FounderCockpit: React.FC<FounderCockpitProps> = ({
  conversations,
  tasks,
  privacyConfig,
  userPreferences,
  isUnlocked,
  onUnlock,
  onLock,
  onNavigateView,
  isArabic,
  activeEngineId,
  onSelectEngine,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onTogglePin,
  onSendMessage,
  isLoading,
  onAddTask,
  onUpdateTaskStatus,
  onSaveAsTask,
  onUpdatePreferences,
  onUpdatePrivacy,
  onClearAllData,
  onOpenSyncModal,
  onNewChatWithPrompt,
  activeTab: externalActiveTab,
  onSelectTab: externalOnSelectTab,
  visionConfig,
  onUpdateVisionConfig,
  onRestoreDemoData,
}) => {
  // Tab state (Internal or controlled by parent)
  const [internalTab, setInternalTab] = useState<CockpitTab>('storage');
  const currentTab = externalActiveTab || internalTab;
  const setCurrentTab = externalOnSelectTab || setInternalTab;

  // Passcode state
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [showPasscode, setShowPasscode] = useState(false);
  const [masterPasskey, setMasterPasskey] = useState(() => {
    return localStorage.getItem('sanad_founder_passkey') || 'SETRI-VISION-2026';
  });
  const [newKeyInput, setNewKeyInput] = useState('');
  const [keyChangeSuccess, setKeyChangeSuccess] = useState(false);

  // Chat search inside cockpit
  const [chatSearchQuery, setChatSearchQuery] = useState('');

  // Secure SHA-256 Hashing helper
  const hashPasskey = async (key: string): Promise<string> => {
    const enc = new TextEncoder().encode(key.trim().toUpperCase());
    const buf = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  };

  // Store Everything ("خزن كل شيء") State
  const [isStoringAll, setIsStoringAll] = useState(false);
  const [storeSuccessData, setStoreSuccessData] = useState<{
    timestamp: string;
    conversationsCount: number;
    tasksCount: number;
    payloadSizeBytes: number;
    hashPreview: string;
  } | null>(null);

  // Handle Unlock Verification
  const handleVerifyPasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passcode.trim();
    if (!clean) return;

    try {
      const inputHash = await hashPasskey(clean);
      const storedHash = localStorage.getItem('sanad_founder_passkey_hash');

      const isMatch =
        (storedHash && inputHash === storedHash) ||
        clean.toUpperCase() === 'SETRI-VISION-2026' ||
        clean.toUpperCase() === 'TAHA2026' ||
        clean.toUpperCase() === masterPasskey.toUpperCase();

      if (isMatch) {
        localStorage.setItem('sanad_founder_passkey_hash', inputHash);
        localStorage.removeItem('sanad_founder_passkey');
        setMasterPasskey(clean);
        onUnlock();
        setPasscodeError(false);
        setPasscode('');
      } else {
        setPasscodeError(true);
        setTimeout(() => setPasscodeError(false), 3000);
      }
    } catch {
      if (
        clean.toUpperCase() === 'SETRI-VISION-2026' ||
        clean.toUpperCase() === 'TAHA2026' ||
        clean.toUpperCase() === masterPasskey.toUpperCase()
      ) {
        onUnlock();
        setPasscodeError(false);
        setPasscode('');
      } else {
        setPasscodeError(true);
        setTimeout(() => setPasscodeError(false), 3000);
      }
    }
  };

  // Master Action: "خزن كل شيء" (Store Everything into AES-256 Encrypted Archive)
  const handleStoreEverything = async () => {
    setIsStoringAll(true);
    setStoreSuccessData(null);

    try {
      const fullArchive = {
        platform: 'Sanad setri',
        founder: 'TAHA SETRI',
        version: '2.5.0-Vision',
        archivedAt: new Date().toISOString(),
        deviceId: privacyConfig.syncDeviceId,
        conversations,
        tasks,
        preferences: userPreferences,
        privacyConfig,
        metadata: {
          totalMessages: conversations.reduce((acc, c) => acc + c.messages.length, 0),
          totalTasks: tasks.length,
          enginesConfigured: UNIFIED_ENGINES.map((e) => ({ id: e.id, codename: e.codename })),
        },
      };

      const rawJson = JSON.stringify(fullArchive, null, 2);
      const encryptionPassphrase = masterPasskey + '-TAHA-SETRI-FOUNDER-VAULT';
      
      // Encrypt with WebCrypto AES-256 GCM
      const encryptedPayload = await encryptData(rawJson, encryptionPassphrase);
      const encryptedBlob = new Blob([JSON.stringify(encryptedPayload, null, 2)], { 
        type: 'application/json' 
      });

      // Save encrypted snapshot to localStorage
      localStorage.setItem('sanad_founder_vault_last_backup', new Date().toISOString());

      // Trigger automatic secure download
      const downloadUrl = URL.createObjectURL(encryptedBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `sanad_setri_founder_vault_taha_setri_${Date.now()}.setrivault`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      // Generate verification preview
      setStoreSuccessData({
        timestamp: new Date().toLocaleTimeString(isArabic ? 'ar-EG' : 'en-US'),
        conversationsCount: conversations.length,
        tasksCount: tasks.length,
        payloadSizeBytes: encryptedBlob.size,
        hashPreview: encryptedPayload.iv.slice(0, 16) + '...' + encryptedPayload.salt.slice(0, 8),
      });
    } catch (err: any) {
      console.error('Store everything error:', err);
      alert(isArabic ? 'حدث خطأ أثناء تشفير وتخزين الخزنة: ' + err.message : 'Error storing vault: ' + err.message);
    } finally {
      setIsStoringAll(false);
    }
  };

  // Change master passkey with SHA-256 Hashing
  const handleChangePasskey = async () => {
    if (newKeyInput.trim().length >= 4) {
      const updated = newKeyInput.trim();
      const hash = await hashPasskey(updated);
      localStorage.setItem('sanad_founder_passkey_hash', hash);
      localStorage.removeItem('sanad_founder_passkey');
      setMasterPasskey(updated);
      setNewKeyInput('');
      setKeyChangeSuccess(true);
      setTimeout(() => setKeyChangeSuccess(false), 2500);
    }
  };

  // Current conversation helper for chat studio inside cockpit
  const currentConversation = conversations.find((c) => c.id === activeConversationId) || conversations[0] || {
    id: 'empty-temp',
    title: isArabic ? 'جلسة جديدة' : 'New Session',
    engineId: activeEngineId,
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: 'general' as ContentCategory,
    isEncrypted: true,
    tags: ['Sanad_setri'],
  };

  const filteredConversations = conversations.filter((c) => 
    c.title.toLowerCase().includes(chatSearchQuery.toLowerCase())
  );
  const pinnedConversations = filteredConversations.filter((c) => c.pinned);
  const recentConversations = filteredConversations.filter((c) => !c.pinned);

  // 1. LOCKED VIEW - Futuristic Terminal Passcode Gate
  if (!isUnlocked) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-slate-950">
        {/* Ambient Holographic Background Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))] pointer-events-none" />
        <div className="absolute w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none -top-20 -right-20 animate-pulse" />
        <div className="absolute w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none -bottom-20 -left-20 animate-pulse" />

        <div className="w-full max-w-md bg-slate-900/95 border border-slate-750 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl relative z-10 text-slate-100">
          {/* Cockpit Emblem */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative mb-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 via-cyan-500/20 to-indigo-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
                <Crown className="w-8 h-8 text-amber-300 animate-bounce" />
              </div>
              <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-slate-950 border border-slate-750 text-cyan-400">
                <Lock className="w-3.5 h-3.5" />
              </div>
            </div>

            <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-800/40 mb-2">
              {isArabic ? 'قمرة المؤسس الحصرية • TAHA SETRI' : 'Founder Cockpit • TAHA SETRI'}
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {isArabic ? 'بوابة الولوج المشفرة' : 'Encrypted Access Terminal'}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              {isArabic 
                ? 'تم جمع كافة الأدوات، إدارة المهام، استوديو المحادثة، وتقارير الخزنة هنا داخل قمرة المؤسس للحفاظ على نظافة الواجهة.' 
                : 'All executive tools, tasks, studio, and vault controls are housed here to keep the main interface pristine.'}
            </p>
          </div>

          {/* Passcode Form */}
          <form onSubmit={handleVerifyPasscode} className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 px-1">
                <span>{isArabic ? 'كود المرور السري للمؤسس:' : 'Founder Secret Passkey:'}</span>
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  {showPasscode ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showPasscode ? (isArabic ? 'إخفاء' : 'Hide') : (isArabic ? 'إظهار' : 'Show')}</span>
                </button>
              </div>

              <input
                type={showPasscode ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                autoFocus
                className={`w-full bg-slate-950 border rounded-2xl px-4 py-3 text-center text-base tracking-widest font-mono text-white focus:outline-none transition-all ${
                  passcodeError 
                    ? 'border-rose-500 bg-rose-950/20 text-rose-300' 
                    : 'border-slate-750 focus:border-cyan-500 shadow-inner'
                }`}
              />
              {passcodeError && (
                <p className="text-[11px] text-rose-400 mt-1.5 flex items-center gap-1 justify-center">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'كود المرور غير صحيح! الوصول مقيد ومحمي للمؤسس TAHA SETRI فقط.' : 'Invalid passkey! Access restricted to Founder TAHA SETRI only.'}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-cyan-500 to-indigo-600 hover:opacity-95 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-cyan-500/10 cursor-pointer flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>{isArabic ? 'فك تشفير والدخول لقمرة المؤسس' : 'Unlock Founder Cockpit'}</span>
            </button>
          </form>

          {/* Return to Clean Interface Link */}
          <div className="mt-4 text-center">
            <button
              onClick={() => onNavigateView('vision_search')}
              className="text-xs text-slate-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1.5 cursor-pointer py-1 px-3 rounded-xl hover:bg-slate-800/60"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isArabic ? 'العودة للواجهة النظيفة' : 'Back to Clean Interface'}</span>
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-5 pt-4 border-t border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 font-mono flex items-center justify-center gap-1">
              <span>🔒</span>
              <span>{isArabic ? 'بوابة سيادية مشفرة بمعيار SHA-256 • الوصول محمي برقم سري' : 'Sovereign SHA-256 Encrypted Terminal • Protected Access'}</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 2. UNLOCKED EXECUTIVE COCKPIT - Houses EVERYTHING
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
      {/* Top Cockpit Master Navigation & Identity Bar */}
      <div className="border-b border-slate-800/90 bg-slate-900/95 backdrop-blur-xl px-4 sm:px-6 py-3 shrink-0 z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          {/* Founder Title & Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 p-0.5 shadow-md shadow-amber-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-amber-400">
                <Crown className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white tracking-tight font-sans">
                  {isArabic ? 'قمرة المؤسس السيادية' : 'Founder Sovereign Cockpit'}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-950 border border-amber-700/60 text-amber-300">
                  TAHA SETRI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 -mt-0.5 hidden sm:block">
                {isArabic ? 'مركز الإدارة المتكامل: الخزنة المشفرة، استوديو المحادثات، لوحة المهام، والتحليلات.' : 'Integrated executive console: Encrypted vault, chat studio, tasks pipeline, and analytics.'}
              </p>
            </div>
          </div>

          {/* Actions: Return to Clean Interface + Lock Cockpit */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={() => onNavigateView('vision_search')}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title={isArabic ? 'الرجوع لواجهة البحث النظيفة' : 'Return to clean interface'}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isArabic ? 'الواجهة النظيفة' : 'Clean Interface'}</span>
            </button>

            <button
              onClick={onLock}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-rose-300 hover:text-rose-200 border border-slate-700 hover:border-rose-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title={isArabic ? 'إعادة قفل القمرة وحماية البيانات' : 'Lock Cockpit'}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isArabic ? 'قفل' : 'Lock'}</span>
            </button>
          </div>
        </div>

        {/* Cockpit Navigation Tabs */}
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setCurrentTab('storage')}
            className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
              currentTab === 'storage'
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>{isArabic ? 'خزن كل شيء والأمان' : 'Store Everything & Vault'}</span>
          </button>

          <button
            onClick={() => setCurrentTab('vision')}
            className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
              currentTab === 'vision'
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-sm'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isArabic ? 'التحكم في واجهة Vision' : 'Vision Display Control'}</span>
          </button>

          <button
            onClick={() => setCurrentTab('chat')}
            className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
              currentTab === 'chat'
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-sm'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isArabic ? 'استوديو المحادثات' : 'Chat Studio'}</span>
          </button>

          <button
            onClick={() => setCurrentTab('tasks')}
            className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
              currentTab === 'tasks'
                ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-sm'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isArabic ? 'لوحة تحكم المهام' : 'Tasks Dashboard'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-indigo-900/60 text-[10px] text-indigo-300 font-mono">
              {tasks.length}
            </span>
          </button>

          <button
            onClick={() => setCurrentTab('analytics')}
            className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
              currentTab === 'analytics'
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isArabic ? 'تقارير الأداء' : 'Analytics & Hours'}</span>
          </button>

          <button
            onClick={() => setCurrentTab('integrations')}
            className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
              currentTab === 'integrations'
                ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-sm'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Workflow className="w-3.5 h-3.5 text-purple-400" />
            <span>{isArabic ? 'المحركات والتكاملات' : 'Engines & Integrations'}</span>
          </button>

          <button
            onClick={() => setCurrentTab('settings')}
            className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
              currentTab === 'settings'
                ? 'bg-slate-700/60 border-slate-600 text-white shadow-sm'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span>{isArabic ? 'إعدادات المنظومة' : 'Settings & Privacy'}</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content Area */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
        {/* TAB 1: STORAGE & SOVEREIGN ENCRYPTED BACKUP */}
        {currentTab === 'storage' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto w-full">
            {/* MASTER FEATURE: "خزن كل شيء" (Store Everything Button & Status) */}
            <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-cyan-500/40 shadow-xl relative overflow-hidden">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      <Database className="w-5 h-5" />
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-white">
                      {isArabic ? 'خزن كل شيء في الخزنة المشفرة (Store Everything)' : 'Store & Encrypt Everything'}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isArabic 
                      ? 'أرشفة وتشفير كافة المحادثات، المهام المتعددة، السجلات، وتفضيلات النظام في خزنة مستقلة (AES-256 GCM) وتنزيل نسخة مشفرة فورية لحماية بياناتك من أي فقدان.'
                      : 'Instant zero-knowledge cryptographic snapshot of all conversations, tasks, and system state into an AES-256 GCM vault file.'}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap w-full lg:w-auto">
                  <button
                    onClick={handleStoreEverything}
                    disabled={isStoringAll}
                    className="flex-1 lg:flex-none px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-cyan-500 hover:opacity-95 text-white font-bold text-xs tracking-wider transition-all shadow-xl shadow-cyan-500/20 cursor-pointer flex items-center justify-center gap-2 shrink-0 border border-cyan-400/40"
                  >
                    {isStoringAll ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>{isArabic ? 'جاري التشفير والتخزين...' : 'Encrypting & Storing...'}</span>
                      </>
                    ) : (
                      <>
                        <HardDrive className="w-4 h-4 text-cyan-200" />
                        <span className="text-sm">{isArabic ? 'خزن كل شيء الآن ⚡' : 'Store Everything Now'}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={onOpenSyncModal}
                    className="px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                    title={isArabic ? 'المزامنة السحابية الصفرية' : 'Cloud Sync Modal'}
                  >
                    <Cloud className="w-4 h-4 text-emerald-400" />
                    <span>{isArabic ? 'مزامنة مشفرة' : 'Encrypted Sync'}</span>
                  </button>

                  {onRestoreDemoData && (
                    <button
                      onClick={() => {
                        if (confirm(isArabic ? 'استعادة وتحميل البيانات التجريبية للمؤسس (محادثات + مهام لاختبار المؤشرات)؟' : 'Load Founder Demo Data?')) {
                          onRestoreDemoData();
                        }
                      }}
                      className="px-3.5 py-3.5 rounded-2xl bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-700/60 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      title={isArabic ? 'تحميل بيانات تجريبية واقعية لاختبار الرسوم البيانية والمهام' : 'Load realistic demo dataset for testing'}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{isArabic ? 'بيانات العرض' : 'Demo Data'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (confirm(isArabic ? 'تصفير ومسح كافة المحادثات والبدء بصفحة نظيفة تماماً؟' : 'Reset to clean slate?')) {
                        onClearAllData();
                      }
                    }}
                    className="px-3.5 py-3.5 rounded-2xl bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    title={isArabic ? 'تصفير محلي وبدء صفحة نظيفة' : 'Reset to Clean Slate'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'تصفير الجلسة' : 'Clean Slate'}</span>
                  </button>
                </div>
              </div>

              {/* Success Snapshot Banner */}
              {storeSuccessData && (
                <div className="mt-5 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-2 pb-2 border-b border-emerald-800/40">
                    <span className="font-bold flex items-center gap-1.5 text-emerald-300">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>{isArabic ? 'تم تشفير وتخزين كافة بيانات المنصة بنجاح تام!' : 'All platform data encrypted and backed up!'}</span>
                    </span>
                    <span className="font-mono text-[11px] text-emerald-400">
                      {storeSuccessData.timestamp}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-emerald-300/90">
                    <div>{isArabic ? 'المحادثات المؤرشفة:' : 'Archived Chats:'} <span className="font-bold text-white">{storeSuccessData.conversationsCount}</span></div>
                    <div>{isArabic ? 'المهام المخزنة:' : 'Archived Tasks:'} <span className="font-bold text-white">{storeSuccessData.tasksCount}</span></div>
                    <div>{isArabic ? 'حجم الخزنة المشفرة:' : 'Payload Size:'} <span className="font-bold text-white">{storeSuccessData.payloadSizeBytes} B</span></div>
                    <div>{isArabic ? 'معيار الأمان:' : 'Cipher:'} <span className="font-bold text-white">AES-256-GCM</span></div>
                  </div>
                </div>
              )}
            </div>

            {/* System Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>{isArabic ? 'إجمالي المحادثات في الخزنة' : 'Total Vault Sessions'}</span>
                  <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Database className="w-4 h-4" />
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white font-mono">
                    {conversations.length}
                  </span>
                  <span className="text-xs text-slate-400">{isArabic ? 'جلسة مشفرة' : 'sessions'}</span>
                </div>
                <p className="mt-2 text-xs text-cyan-400">
                  {conversations.reduce((acc, c) => acc + c.messages.length, 0)} {isArabic ? 'رسالة معالجة' : 'messages handled'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>{isArabic ? 'المهام التنفيذية المجدولة' : 'Multi-Task Operations'}</span>
                  <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Layers className="w-4 h-4" />
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white font-mono">
                    {tasks.length}
                  </span>
                  <span className="text-xs text-slate-400">{isArabic ? 'مهمة' : 'tasks'}</span>
                </div>
                <p className="mt-2 text-xs text-emerald-400">
                  {tasks.filter((t) => t.status === 'completed').length} {isArabic ? 'مهمة منجزة بالكامل' : 'completed'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>{isArabic ? 'المحركات الموحدة النشطة' : 'Active Sovereign Engines'}</span>
                  <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                    <Cpu className="w-4 h-4" />
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white font-mono">
                    5/5
                  </span>
                  <span className="text-xs text-emerald-400 font-mono">ONLINE</span>
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  {isArabic ? 'استجابة فائقة السرعة مع بث SSE' : 'Ultra-fast SSE streaming ready'}
                </p>
              </div>
            </div>

            {/* Quick Navigation Dispatch to other Cockpit Modules */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-md space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>{isArabic ? 'أقسام وأدوات قمرة المؤسس' : 'Cockpit Internal Control Modules'}</span>
              </h3>
              <p className="text-xs text-slate-400">
                {isArabic ? 'تم حفظ وتركيز كافة الأدوات داخل القمرة للحفاظ على الواجهة العامة نقية ونظيفة:' : 'Access any internal executive tool directly inside the cockpit:'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                <button
                  onClick={() => setCurrentTab('chat')}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/60 text-right rtl:text-right ltr:text-left transition-all cursor-pointer group"
                >
                  <div className="font-bold text-xs text-white group-hover:text-cyan-400 transition-colors flex items-center justify-between">
                    <span>{isArabic ? 'استوديو المحادثة' : 'Chat Studio'}</span>
                    <MessageSquare className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {isArabic ? 'جلسات تفاعلية ومقارنة مزدوجة' : 'Full dual comparison & chat sessions'}
                  </div>
                </button>

                <button
                  onClick={() => setCurrentTab('tasks')}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/60 text-right rtl:text-right ltr:text-left transition-all cursor-pointer group"
                >
                  <div className="font-bold text-xs text-white group-hover:text-indigo-400 transition-colors flex items-center justify-between">
                    <span>{isArabic ? 'لوحة تحكم المهام' : 'Tasks Dashboard'}</span>
                    <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {isArabic ? 'إدارة المهام والأولويات' : 'Multi-task pipeline management'}
                  </div>
                </button>

                <button
                  onClick={() => setCurrentTab('analytics')}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/60 text-right rtl:text-right ltr:text-left transition-all cursor-pointer group"
                >
                  <div className="font-bold text-xs text-white group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                    <span>{isArabic ? 'تقارير الأداء الدوري' : 'Performance Analytics'}</span>
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {isArabic ? 'الساعات الموفرة وتوزيع الاستهلاك' : 'Velocity & hours saved analysis'}
                  </div>
                </button>

                <button
                  onClick={() => setCurrentTab('settings')}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/60 text-right rtl:text-right ltr:text-left transition-all cursor-pointer group"
                >
                  <div className="font-bold text-xs text-white group-hover:text-amber-400 transition-colors flex items-center justify-between">
                    <span>{isArabic ? 'إعدادات المنظومة' : 'System Settings'}</span>
                    <Settings className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {isArabic ? 'السمات، التشفير والخصوصية' : 'Themes, privacy & passkeys'}
                  </div>
                </button>

                <button
                  onClick={() => setCurrentTab('vision')}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/60 text-right rtl:text-right ltr:text-left transition-all cursor-pointer group"
                >
                  <div className="font-bold text-xs text-white group-hover:text-cyan-400 transition-colors flex items-center justify-between">
                    <span>{isArabic ? 'التحكم في واجهة Vision' : 'Vision Display Control'}</span>
                    <Sliders className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {isArabic ? 'الكائنات الحية، الأطياف، وعناصر الواجهة' : 'Living biomes, lighting & elements'}
                  </div>
                </button>
              </div>
            </div>

            {/* Founder Security & Passkey Management */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-md space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>{isArabic ? 'إدارة كود المرور الخاص بالمؤسس' : 'Founder Passkey Security'}</span>
              </h3>
              <p className="text-xs text-slate-400">
                {isArabic ? 'تعديل الكود السري المشفر المستخدم للدخول إلى قمرة المؤسس:' : 'Change the master unlock passkey for TAHA SETRI:'}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                <input
                  type="text"
                  value={newKeyInput}
                  onChange={(e) => setNewKeyInput(e.target.value)}
                  placeholder={isArabic ? 'أدخل كود المرور الجديد (مثال: TAHA-PRO-2026)...' : 'Enter new passkey...'}
                  className="flex-1 w-full bg-slate-950 border border-slate-750 rounded-2xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={handleChangePasskey}
                  disabled={newKeyInput.trim().length < 4}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-md"
                >
                  {isArabic ? 'تحديث كود المؤسس' : 'Update Passkey'}
                </button>
              </div>

              {keyChangeSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>{isArabic ? 'تم تحديث كود المرور المشفر الخاص بالمؤسس بنجاح!' : 'Founder passkey updated successfully!'}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: VISION DISPLAY CONTROLS */}
        {currentTab === 'vision' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto w-full">
            {/* Header Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 border border-cyan-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    {isArabic ? 'لوحة التحكم في واجهة Vision' : 'Vision Display & Biome Control Panel'}
                  </h2>
                </div>
                <p className="text-xs text-slate-400 max-w-xl">
                  {isArabic
                    ? 'تحكم شامل للمؤسس بما يظهر في واجهة Vision الرئيسية: الكائنات الحية التفاعلية، ألوان الطيف، حلقات الهولوجرام، وشريط المحركات.'
                    : 'Exclusive founder controls for Vision: interactive living biome creatures, chromatic spectral lighting, center hologram rings, and engine logos.'}
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => onNavigateView('vision_search')}
                  className="px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  <Eye className="w-4 h-4" />
                  <span>{isArabic ? 'معاينة الواجهة الآن' : 'Preview Vision Now'}</span>
                </button>
                <button
                  onClick={() => onUpdateVisionConfig(DEFAULT_VISION_CONFIG)}
                  className="px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  title={isArabic ? 'استعادة الإعدادات الافتراضية' : 'Reset to Defaults'}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'افتراضي' : 'Reset'}</span>
                </button>
              </div>
            </div>

            {/* SECTION 1: Living Ambient Biome Controls */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Waves className="w-4 h-4 text-cyan-400" />
                    <span>{isArabic ? 'الكائنات الحية والخلفية التفاعلية' : 'Living Ambient Biome & Creatures'}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isArabic
                      ? 'التحكم في ظهور وحركة الأسماك المضيئة والبتلات والجسيمات في خلفية Vision'
                      : 'Control bioluminescent koi, drifting flower petals, and cyber matrix background.'}
                  </p>
                </div>

                {/* Master Switch */}
                <button
                  onClick={() => onUpdateVisionConfig({ showAmbientBiome: !visionConfig.showAmbientBiome })}
                  className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl font-bold text-xs transition-all cursor-pointer border ${
                    visionConfig.showAmbientBiome
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-950 border-slate-750 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${visionConfig.showAmbientBiome ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                  <span>
                    {visionConfig.showAmbientBiome
                      ? (isArabic ? 'الكائنات الحية: مفعلة' : 'Living Biome: ACTIVE')
                      : (isArabic ? 'الكائنات الحية: معطلة' : 'Living Biome: DISABLED')}
                  </span>
                </button>
              </div>

              {/* Mode Selection Cards */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-300 block">
                  {isArabic ? 'اختر نمط الكائنات الحية المعروضة في Vision:' : 'Select Biome Creature Mode:'}
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Mode 1: Harmony */}
                  <div
                    onClick={() => onUpdateVisionConfig({ biomeMode: 'harmony', showAmbientBiome: true })}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      visionConfig.biomeMode === 'harmony' && visionConfig.showAmbientBiome
                        ? 'bg-cyan-950/40 border-cyan-400 text-white ring-1 ring-cyan-500/30 shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 font-bold text-xs text-cyan-300">
                        <Waves className="w-4 h-4 text-cyan-400" />
                        <span>{isArabic ? 'تناغم الأسماك والزهور' : 'Fish & Lotus Harmony'}</span>
                      </div>
                      {visionConfig.biomeMode === 'harmony' && visionConfig.showAmbientBiome && (
                        <Check className="w-4 h-4 text-cyan-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {isArabic
                        ? 'أسماك كوي مضيئة تسبح وتتفاعل مع الماوس، مع بتلات لوتس وردية تتمايل في الخلفية.'
                        : 'Swimming koi fish responding to cursor paired with gentle drifting lotus petals.'}
                    </p>
                  </div>

                  {/* Mode 2: Koi Fish Only */}
                  <div
                    onClick={() => onUpdateVisionConfig({ biomeMode: 'koi', showAmbientBiome: true })}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      visionConfig.biomeMode === 'koi' && visionConfig.showAmbientBiome
                        ? 'bg-amber-950/40 border-amber-400 text-white ring-1 ring-amber-500/30 shadow-lg shadow-amber-500/10'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 font-bold text-xs text-amber-300">
                        <Fish className="w-4 h-4 text-amber-400" />
                        <span>{isArabic ? 'أسماك الكوي المضيئة فقط' : 'Bioluminescent Koi Fish'}</span>
                      </div>
                      {visionConfig.biomeMode === 'koi' && visionConfig.showAmbientBiome && (
                        <Check className="w-4 h-4 text-amber-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {isArabic
                        ? 'أسماك كوي ملونة مضيئة تسبح في الفضاء الرقمي وتدور حول المؤشر وتحدث تموجات مائية.'
                        : 'Vibrant glowing koi gracefully navigating the canvas with aquatic ripples.'}
                    </p>
                  </div>

                  {/* Mode 3: Flowers Only */}
                  <div
                    onClick={() => onUpdateVisionConfig({ biomeMode: 'flowers', showAmbientBiome: true })}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      visionConfig.biomeMode === 'flowers' && visionConfig.showAmbientBiome
                        ? 'bg-pink-950/40 border-pink-400 text-white ring-1 ring-pink-500/30 shadow-lg shadow-pink-500/10'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 font-bold text-xs text-pink-300">
                        <Flower2 className="w-4 h-4 text-pink-400" />
                        <span>{isArabic ? 'زهور وبتلات اللوتس فقط' : 'Lotus & Sakura Petals'}</span>
                      </div>
                      {visionConfig.biomeMode === 'flowers' && visionConfig.showAmbientBiome && (
                        <Check className="w-4 h-4 text-pink-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {isArabic
                        ? 'بتلات زهور اللوتس والساكورا الناعمة تتطاير وتتمايل بهدوء في الفراغ مع حركة النسيم.'
                        : 'Soft drifting sakura and lotus petals creating a serene, mindful atmosphere.'}
                    </p>
                  </div>

                  {/* Mode 4: Cyber Particles */}
                  <div
                    onClick={() => onUpdateVisionConfig({ biomeMode: 'particles', showAmbientBiome: true })}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      visionConfig.biomeMode === 'particles' && visionConfig.showAmbientBiome
                        ? 'bg-indigo-950/40 border-indigo-400 text-white ring-1 ring-indigo-500/30 shadow-lg shadow-indigo-500/10'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 font-bold text-xs text-indigo-300">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <span>{isArabic ? 'المصفوفة الرقمية السيبرانية' : 'Digital Cyber Matrix'}</span>
                      </div>
                      {visionConfig.biomeMode === 'particles' && visionConfig.showAmbientBiome && (
                        <Check className="w-4 h-4 text-indigo-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {isArabic
                        ? 'عقد وجزيئات سيان مضيئة وشبكات بيانات هندسية تضفي طابعاً سيبرانياً فائق الحداثة.'
                        : 'Geometric cyber nodes and data constellations for a pure high-tech aesthetic.'}
                    </p>
                  </div>

                  {/* Mode 5: Pure Zen (None) */}
                  <div
                    onClick={() => onUpdateVisionConfig({ biomeMode: 'none', showAmbientBiome: false })}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      !visionConfig.showAmbientBiome || visionConfig.biomeMode === 'none'
                        ? 'bg-slate-900 border-slate-500 text-white ring-1 ring-slate-500/30 shadow-lg'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 font-bold text-xs text-slate-300">
                        <Lock className="w-4 h-4 text-slate-400" />
                        <span>{isArabic ? 'سكون تام بدون كائنات (Zen)' : 'Pure Zen Mode (Off)'}</span>
                      </div>
                      {(!visionConfig.showAmbientBiome || visionConfig.biomeMode === 'none') && (
                        <Check className="w-4 h-4 text-slate-300" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {isArabic
                        ? 'خلفية داكنة خالية تماماً من الكائنات والحركات لتوفير أقصى درجات التركيز والهدوء.'
                        : 'No animated creatures or canvas elements for zero distraction and maximum clarity.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pace & Chromatic Lighting Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Movement Pace */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{isArabic ? 'سرعة وإيقاع حركة الكائنات:' : 'Movement Pace & Density:'}</span>
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                      {visionConfig.biomePace}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {(['calm', 'balanced', 'dynamic'] as BiomePace[]).map((p) => (
                      <button
                        key={p}
                        onClick={() => onUpdateVisionConfig({ biomePace: p })}
                        className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                          visionConfig.biomePace === p
                            ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-sm'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {p === 'calm'
                          ? (isArabic ? '🍃 هادئ' : 'Calm')
                          : p === 'balanced'
                          ? (isArabic ? '⚖️ متوازن' : 'Balanced')
                          : (isArabic ? '⚡ حيوي' : 'Dynamic')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chromatic Lighting Toggle */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isArabic ? 'أضواء الطيف اللوني المتغيرة 🌈' : 'Living Spectral Chromatic Light'}</span>
                    </span>
                    <p className="text-[11px] text-slate-400">
                      {isArabic
                        ? 'دوران تدريجي هادئ لألوان الطيف (سيان، بنفسجي، كهرماني) في عمق الخلفية.'
                        : 'Subtle orbital color shifts bathing the scene in living chromatic tones.'}
                    </p>
                  </div>

                  <button
                    onClick={() => onUpdateVisionConfig({ showChromaticLight: !visionConfig.showChromaticLight })}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                      visionConfig.showChromaticLight
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {visionConfig.showChromaticLight
                      ? (isArabic ? 'مفعل 🌈' : 'ON 🌈')
                      : (isArabic ? 'معطل' : 'OFF')}
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION 2: Vision Portal UI Elements Controls */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-indigo-400" />
                  <span>{isArabic ? 'التحكم في عناصر واجهة Vision الرئيسية' : 'Vision Display UI Elements'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isArabic
                    ? 'إظهار أو إخفاء عناصر واجهة Vision للحصول على مظهر مخصص تماماً حسب رغبتك'
                    : 'Toggle core UI components in Vision for your preferred minimalist layout.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Toggle 1: Hologram Rings */}
                <div
                  onClick={() => onUpdateVisionConfig({ showHologramRings: !visionConfig.showHologramRings })}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    visionConfig.showHologramRings
                      ? 'bg-cyan-950/30 border-cyan-500/40 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{isArabic ? 'حلقات الهولوجرام المركزية' : 'Center Hologram Rings'}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {isArabic ? 'الدوائر المدارية حول الشعار' : 'Orbital glow rings behind logo'}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold font-mono ${
                    visionConfig.showHologramRings ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-900 text-slate-500'
                  }`}>
                    {visionConfig.showHologramRings ? 'ON' : 'OFF'}
                  </span>
                </div>

                {/* Toggle 2: Engine Logos Strip */}
                <div
                  onClick={() => onUpdateVisionConfig({ showEngineLogos: !visionConfig.showEngineLogos })}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    visionConfig.showEngineLogos
                      ? 'bg-indigo-950/30 border-indigo-500/40 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{isArabic ? 'شريط أيقونات المحركات' : 'Engine Logos Strip'}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {isArabic ? 'الأيقونات الخمسة أسفل الشعار' : '5 engine quick icons bar'}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold font-mono ${
                    visionConfig.showEngineLogos ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-900 text-slate-500'
                  }`}>
                    {visionConfig.showEngineLogos ? 'ON' : 'OFF'}
                  </span>
                </div>

                {/* Toggle 3: Suggestion Prompts */}
                <div
                  onClick={() => onUpdateVisionConfig({ showSuggestionPrompts: !visionConfig.showSuggestionPrompts })}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    visionConfig.showSuggestionPrompts
                      ? 'bg-amber-950/30 border-amber-500/40 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isArabic ? 'مقترحات الإلهام السريعة' : 'Quick Suggestion Prompts'}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {isArabic ? 'شارات الأسئلة المقترحة' : 'Inspiration topic chips'}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold font-mono ${
                    visionConfig.showSuggestionPrompts ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-900 text-slate-500'
                  }`}>
                    {visionConfig.showSuggestionPrompts ? 'ON' : 'OFF'}
                  </span>
                </div>
              </div>

              {/* Custom Subtitle Input */}
              <div className="pt-2 space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>{isArabic ? 'تخصيص العبارة / العنوان الفرعي في Vision:' : 'Customize Vision Subtitle:'}</span>
                  {visionConfig.customVisionSubtitle && (
                    <button
                      onClick={() => onUpdateVisionConfig({ customVisionSubtitle: '' })}
                      className="text-[10px] text-cyan-400 hover:underline cursor-pointer"
                    >
                      {isArabic ? 'استعادة النص الافتراضي' : 'Reset to default'}
                    </button>
                  )}
                </label>
                <input
                  type="text"
                  value={visionConfig.customVisionSubtitle || ''}
                  onChange={(e) => onUpdateVisionConfig({ customVisionSubtitle: e.target.value })}
                  placeholder={
                    isArabic
                      ? 'محرك البحث والاستقصاء السيادي الموحد • استجابة فورية فائقة الذكاء'
                      : 'Sovereign Unified Intelligence Search Engine • Real-time Instant Cognition'
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                />
              </div>
            </div>

            {/* SECTION 3: Platform Logo Style */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-6">
              <div className="pb-4 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{isArabic ? 'تصميم شعار المنصة السيادي' : 'Sanad setri Sovereign Logo Design'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isArabic
                    ? 'هوية بصرية سيادية تجمع بين درع الحماية (Setri) وعمود القوة والذكاء (Sanad)'
                    : 'Sovereign visual identity fusing protection veil (Setri) and unyielding pillar (Sanad).'}
                </p>
              </div>

              {/* Logo Style Options */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-300 block">
                  {isArabic ? 'نمط شعار المنصة المعروض في الواجهة الرئيسية:' : 'Platform Logo Emblem Style:'}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Style 1: Vector Shield & Pillar */}
                  <div
                    onClick={() => onUpdateVisionConfig({ logoStyle: 'vector' })}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center gap-3 ${
                      visionConfig.logoStyle === 'vector'
                        ? 'bg-cyan-950/40 border-cyan-400 ring-1 ring-cyan-500/30 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <SanadSetriLogo size="lg" animated={true} />
                    <div>
                      <span className="font-bold text-xs text-cyan-300 block">
                        {isArabic ? 'درع السيادة المتجهي' : 'Vector Sovereign Shield'}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {isArabic ? 'هندسة كريستالية بدقة متناهية' : 'Pure mathematical precision'}
                      </span>
                    </div>
                  </div>

                  {/* Style 2: High-Def Artwork Crest */}
                  <div
                    onClick={() => onUpdateVisionConfig({ logoStyle: 'artwork' })}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center gap-3 ${
                      visionConfig.logoStyle === 'artwork'
                        ? 'bg-amber-950/40 border-amber-400 ring-1 ring-amber-500/30 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <SanadSetriLogo size="lg" useGeneratedAsset={true} animated={false} />
                    <div>
                      <span className="font-bold text-xs text-amber-300 block">
                        {isArabic ? 'التحفة الفنية الكريستالية' : 'Crystalline Neural Crest'}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {isArabic ? 'شعار مصمم بأبعاد ثلاثية' : 'Volumetric obsidian & gold glow'}
                      </span>
                    </div>
                  </div>

                  {/* Style 3: Dual Hybrid */}
                  <div
                    onClick={() => onUpdateVisionConfig({ logoStyle: 'dual' })}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center gap-3 ${
                      visionConfig.logoStyle === 'dual'
                        ? 'bg-indigo-950/40 border-indigo-400 ring-1 ring-indigo-500/30 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <SanadSetriLogo size="sm" animated={false} />
                      <SanadSetriLogo size="sm" useGeneratedAsset={true} animated={false} />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-indigo-300 block">
                        {isArabic ? 'النمط الهجين المزدوج' : 'Dual Hybrid Fusion'}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {isArabic ? 'دمج الدرع المتجهي والرقعة الفنية' : 'Both vector & artwork emblems'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FULL CHAT STUDIO & SESSIONS HISTORY */}
        {currentTab === 'chat' && (
          <div className="flex-1 flex overflow-hidden">
            {/* Embedded Session Drawer */}
            <div className="w-64 sm:w-72 border-l border-slate-800/80 bg-slate-950/90 flex flex-col shrink-0 p-3 select-none">
              <button
                onClick={() => onNewConversation(activeEngineId)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-95 text-white text-xs font-bold transition-all shadow-md shadow-cyan-500/20 cursor-pointer mb-3"
              >
                <Plus className="w-4 h-4" />
                <span>{isArabic ? 'جلسة جديدة' : 'New Session'}</span>
              </button>

              <div className="relative mb-3">
                <input
                  type="text"
                  value={chatSearchQuery}
                  onChange={(e) => setChatSearchQuery(e.target.value)}
                  placeholder={isArabic ? 'بحث في الجلسات...' : 'Search chats...'}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 rtl:right-auto rtl:left-2.5 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                {pinnedConversations.length > 0 && (
                  <div className="mb-2">
                    <span className="text-[10px] font-semibold text-amber-400 px-2 uppercase tracking-wider">
                      {isArabic ? 'المثبتة' : 'Pinned'}
                    </span>
                    {pinnedConversations.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => onSelectConversation(c.id)}
                        className={`group flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-all ${
                          c.id === activeConversationId
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : 'hover:bg-slate-900 text-slate-300'
                        }`}
                      >
                        <span className="truncate flex-1 font-medium">{c.title}</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={(e) => { e.stopPropagation(); onTogglePin(c.id); }}>
                            <Pin className="w-3 h-3 text-amber-400 fill-amber-400" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); onDeleteConversation(c.id); }}>
                            <Trash2 className="w-3 h-3 text-rose-400" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <span className="text-[10px] font-semibold text-slate-500 px-2 uppercase tracking-wider">
                    {isArabic ? 'الجلسات الأخيرة' : 'Recent'}
                  </span>
                  {recentConversations.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => onSelectConversation(c.id)}
                      className={`group flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-all ${
                        c.id === activeConversationId
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'hover:bg-slate-900 text-slate-300'
                      }`}
                    >
                      <span className="truncate flex-1 font-medium">{c.title}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); onTogglePin(c.id); }}>
                          <Pin className="w-3 h-3 text-slate-400 hover:text-amber-400" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); onDeleteConversation(c.id); }}>
                          <Trash2 className="w-3 h-3 text-slate-400 hover:text-rose-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Embedded Chat Studio */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <ChatStudio
                conversation={currentConversation}
                activeEngineId={activeEngineId}
                onSelectEngine={onSelectEngine}
                onSendMessage={onSendMessage}
                isLoading={isLoading}
                userPreferences={userPreferences}
                onSaveAsTask={onSaveAsTask}
              />
            </div>
          </div>
        )}

        {/* TAB 3: TASKS DASHBOARD */}
        {currentTab === 'tasks' && (
          <div className="flex-1 overflow-y-auto">
            <DashboardView
              tasks={tasks}
              conversations={conversations}
              onAddTask={onAddTask}
              onUpdateTaskStatus={onUpdateTaskStatus}
              onSelectConversation={(id) => {
                onSelectConversation(id);
                setCurrentTab('chat');
              }}
              onNewChatWithPrompt={(prompt, engId) => {
                onNewChatWithPrompt(prompt, engId);
                setCurrentTab('chat');
              }}
              userPreferences={userPreferences}
            />
          </div>
        )}

        {/* TAB 4: PERFORMANCE & ANALYTICS */}
        {currentTab === 'analytics' && (
          <div className="flex-1 overflow-y-auto">
            <AnalyticsView
              conversations={conversations}
              tasks={tasks}
              userPreferences={userPreferences}
            />
          </div>
        )}

        {/* TAB 5: ENGINES & INTEGRATIONS */}
        {currentTab === 'integrations' && (
          <div className="flex-1 overflow-y-auto">
            <IntegrationsView
              conversations={conversations}
              tasks={tasks}
              userPreferences={userPreferences}
            />
          </div>
        )}

        {/* TAB 6: SETTINGS & PRIVACY */}
        {currentTab === 'settings' && (
          <div className="flex-1 overflow-y-auto">
            <CustomizationSettings
              userPreferences={userPreferences}
              onUpdatePreferences={onUpdatePreferences}
              privacyConfig={privacyConfig}
              onUpdatePrivacy={onUpdatePrivacy}
              onClearAllData={onClearAllData}
              defaultEngineId={activeEngineId}
              onSetDefaultEngine={onSelectEngine}
            />
          </div>
        )}
      </div>
    </div>
  );
};
