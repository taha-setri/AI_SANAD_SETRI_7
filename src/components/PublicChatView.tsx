import React, { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  Plus, 
  Sparkles, 
  Trash2, 
  Pin, 
  ExternalLink,
  Bot,
  Zap,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Flame,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { Conversation, EngineId, UserPreferences, ContentCategory } from '../types';
import { UNIFIED_ENGINES } from '../lib/constants';
import { ChatStudio } from './ChatStudio';

interface PublicChatViewProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  activeEngineId: EngineId;
  onSelectConversation: (id: string) => void;
  onNewConversation: (engineId?: EngineId) => void;
  onDeleteConversation: (id: string) => void;
  onTogglePin: (id: string) => void;
  onSelectEngine: (id: EngineId) => void;
  onSendMessage: (text: string, engineId: EngineId) => Promise<void>;
  isLoading: boolean;
  userPreferences: UserPreferences;
  onNavigateToSearch: () => void;
  isArabic: boolean;
  onClearSession?: () => void;
}

export const PublicChatView: React.FC<PublicChatViewProps> = ({
  conversations,
  activeConversationId,
  activeEngineId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onTogglePin,
  onSelectEngine,
  onSendMessage,
  isLoading,
  userPreferences,
  onNavigateToSearch,
  isArabic,
  onClearSession,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [filterQuery, setFilterQuery] = useState('');

  // Clean instant session fallback ensures user always opens directly into an active, clean chat box
  const fallbackCleanConv: Conversation = {
    id: 'clean-instant-session',
    title: isArabic ? 'محادثة جديدة' : 'New Chat',
    engineId: activeEngineId,
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: 'general',
    isEncrypted: true,
    tags: ['Sanad_setri'],
  };

  const activeConv = conversations.find((c) => c.id === activeConversationId) || (conversations.length > 0 ? conversations[0] : fallbackCleanConv);
  const currentEngine = UNIFIED_ENGINES.find((e) => e.id === activeEngineId) || UNIFIED_ENGINES[0];

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const pinnedConvs = filteredConversations.filter((c) => c.pinned);
  const recentConvs = filteredConversations.filter((c) => !c.pinned);

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-950 text-slate-100 relative">
      {/* Public Conversation History Drawer / Sidebar */}
      <aside 
        className={`h-full border-r rtl:border-r-0 rtl:border-l border-slate-800/80 bg-slate-900/60 backdrop-blur-md flex flex-col transition-all duration-300 relative z-20 shrink-0 select-none ${
          isSidebarOpen ? 'w-64 sm:w-72' : 'w-0 overflow-hidden border-none'
        }`}
      >
        {/* Header inside drawer */}
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">
                {isArabic ? 'جلسات التحدث' : 'Chat Sessions'}
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">
                {conversations.length} {isArabic ? 'جلسة محفوظة' : 'saved'}
              </span>
            </div>
          </div>

          <button
            onClick={() => onNewConversation(activeEngineId)}
            className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-90 text-white transition-all cursor-pointer shadow-sm shadow-cyan-500/20"
            title={isArabic ? 'محادثة جديدة' : 'New Chat'}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Filter input */}
        <div className="p-2.5 border-b border-slate-800/60">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3 text-slate-500" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder={isArabic ? 'البحث في الجلسات...' : 'Filter chats...'}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-8 pr-3 rtl:pl-3 rtl:pr-8 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
            />
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-3">
          {pinnedConvs.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider px-2">
                {isArabic ? 'المثبتة' : 'Pinned'}
              </span>
              {pinnedConvs.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className={`group flex items-center justify-between p-2 rounded-xl text-xs transition-all cursor-pointer border ${
                    activeConversationId === conv.id
                      ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 font-semibold'
                      : 'border-transparent hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <span className="truncate flex-1 pr-2 rtl:pr-0 rtl:pl-2">{conv.title}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePin(conv.id);
                      }}
                      className="p-1 hover:text-amber-400 text-slate-400"
                    >
                      <Pin className="w-3 h-3 fill-current" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conv.id);
                      }}
                      className="p-1 hover:text-red-400 text-slate-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-1">
            {pinnedConvs.length > 0 && (
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2">
                {isArabic ? 'الأخيرة' : 'Recent'}
              </span>
            )}
            {recentConvs.map((conv) => (
              <div
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`group flex items-center justify-between p-2 rounded-xl text-xs transition-all cursor-pointer border ${
                  activeConversationId === conv.id
                    ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 font-semibold'
                    : 'border-transparent hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <span className="truncate flex-1 pr-2 rtl:pr-0 rtl:pl-2">{conv.title}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePin(conv.id);
                    }}
                    className="p-1 hover:text-amber-400 text-slate-400"
                  >
                    <Pin className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv.id);
                    }}
                    className="p-1 hover:text-red-400 text-slate-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}

            {conversations.length === 0 && (
              <div className="p-4 text-center space-y-2 mt-4 border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
                <p className="text-xs text-slate-400 font-medium">
                  {isArabic ? 'صفحة نظيفة ومستقلة' : 'Clean Slate Environment'}
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {isArabic ? 'لا توجد محادثات سابقة. محركك جاهز للبدء فوراً.' : 'No saved sessions. Ready for your input.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Bottom Shortcut to Search Portal */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60">
          <button
            onClick={onNavigateToSearch}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-750 text-xs text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isArabic ? 'الذهاب إلى مكان البحث' : 'Go to Search Portal'}</span>
          </button>
        </div>
      </aside>

      {/* Main Chat Studio Canvas */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Chat Bar with Drawer Toggle, Engine Selector & Quick Search Switch */}
        <div className="h-14 border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md px-4 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={isSidebarOpen ? (isArabic ? 'إخفاء الجلسات' : 'Hide sidebar') : (isArabic ? 'عرض الجلسات' : 'Show sidebar')}
            >
              {isArabic ? (
                isSidebarOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
              ) : (
                isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={() => onNewConversation(activeEngineId)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 text-xs font-semibold transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isArabic ? 'محادثة جديدة' : 'New Chat'}</span>
            </button>

            {onClearSession && conversations.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm(isArabic ? 'هل تريد مسح جلسات هذا المتصفح والبدء بصفحة نظيفة؟' : 'Wipe local chats and start clean?')) {
                    onClearSession();
                  }
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/60 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-700/60 hover:border-rose-700/60 text-xs transition-all cursor-pointer"
                title={isArabic ? 'مسح الجلسات المحفوظة وبدء صفحة نظيفة تماماً' : 'Clear saved sessions and start completely clean'}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">{isArabic ? 'تصفير الجلسات' : 'Wipe'}</span>
              </button>
            )}
          </div>

          {/* Engine Selector Horizontal Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-md py-1 no-scrollbar">
            {UNIFIED_ENGINES.map((eng) => {
              const isSelected = eng.id === activeEngineId;
              return (
                <button
                  key={eng.id}
                  onClick={() => onSelectEngine(eng.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/50 text-cyan-300 shadow-sm'
                      : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                  title={isArabic ? eng.descriptionAr : eng.descriptionEn}
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>{isArabic ? eng.nameAr : eng.nameEn}</span>
                </button>
              );
            })}
          </div>

          {/* Switch to Search Button */}
          <button
            onClick={onNavigateToSearch}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40 text-xs font-medium transition-all cursor-pointer shrink-0"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">{isArabic ? 'مكان البحث' : 'Search Portal'}</span>
          </button>
        </div>

        {/* Embedded Standalone Chat Studio */}
        {activeConv ? (
          <ChatStudio
            conversation={activeConv}
            activeEngineId={activeEngineId}
            onSelectEngine={onSelectEngine}
            onSendMessage={onSendMessage}
            isLoading={isLoading}
            userPreferences={userPreferences}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <button
              onClick={() => onNewConversation(activeEngineId)}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20 cursor-pointer transition-all"
            >
              {isArabic ? 'بدء محادثة جديدة' : 'Start New Conversation'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
