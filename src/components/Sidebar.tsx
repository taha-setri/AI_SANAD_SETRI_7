import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Search, 
  BarChart3, 
  Workflow, 
  Settings, 
  Plus, 
  Pin, 
  Trash2, 
  Lock, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers
} from 'lucide-react';
import { ActiveView, Conversation, EngineId, UserPreferences } from '../types';
import { UNIFIED_ENGINES, CATEGORY_LABELS } from '../lib/constants';

interface SidebarProps {
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: (engineId?: EngineId) => void;
  onDeleteConversation: (id: string) => void;
  onTogglePin: (id: string) => void;
  userPreferences: UserPreferences;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onTogglePin,
  userPreferences,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const isArabic = userPreferences.language === 'ar';

  const navItems = [
    { id: 'vision_search' as ActiveView, labelAr: 'مكان البحث (محرك Vision)', labelEn: 'Search Portal', icon: Search },
    { id: 'chat' as ActiveView, labelAr: 'مكان التحدث (استوديو المحادثة)', labelEn: 'Chat & Talk Studio', icon: MessageSquare },
    { id: 'search' as ActiveView, labelAr: 'أرشيف البحث المصنف', labelEn: 'Vault Search', icon: Sparkles },
  ];

  const filteredConversations = conversations.filter((c) => 
    c.title.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const pinnedConversations = filteredConversations.filter((c) => c.pinned);
  const recentConversations = filteredConversations.filter((c) => !c.pinned);

  return (
    <aside 
      className={`h-[calc(100vh-4rem)] border-l border-slate-800/80 bg-slate-950 flex flex-col transition-all duration-300 relative z-20 shrink-0 select-none ${
        isCollapsed ? 'w-16' : 'w-72'
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -left-3 top-4 w-6 h-6 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center shadow-md z-30 cursor-pointer"
        title={isCollapsed ? (isArabic ? 'توسيع القائمة' : 'Expand') : (isArabic ? 'طي القائمة' : 'Collapse')}
      >
        {isArabic ? (
          isCollapsed ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Main Navigation Views */}
      <div className="p-3 space-y-1 border-b border-slate-800/80">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                isActive 
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
              title={isArabic ? item.labelAr : item.labelEn}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              {!isCollapsed && (
                <span className="truncate">
                  {isArabic ? item.labelAr : item.labelEn}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* New Conversation Button */}
      <div className="p-3">
        <button
          onClick={() => {
            onNewConversation();
            onSelectView('chat');
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 transition-all cursor-pointer"
          title={isArabic ? 'بدء محادثة جديدة بمحرك ذكي' : 'New Unified Session'}
        >
          <Plus className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>{isArabic ? 'جلسة ذكية جديدة' : 'New Session'}</span>}
        </button>
      </div>

      {/* Recent Sessions & Pinned History */}
      {!isCollapsed ? (
        <div className="flex-1 overflow-y-auto px-3 py-1 space-y-3">
          {/* Quick Search inside Sidebar */}
          <div className="relative">
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder={isArabic ? 'تصفية المحادثات...' : 'Filter sessions...'}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          {/* Pinned Conversations */}
          {pinnedConversations.length > 0 && (
            <div>
              <div className="flex items-center gap-1 text-[10px] uppercase font-mono tracking-wider text-slate-500 px-1 mb-1">
                <Pin className="w-3 h-3 text-cyan-400 rotate-45" />
                <span>{isArabic ? 'المثبتة' : 'Pinned'}</span>
              </div>
              <div className="space-y-0.5">
                {pinnedConversations.map((conv) => (
                  <SessionItem
                    key={conv.id}
                    conversation={conv}
                    isActive={activeConversationId === conv.id && activeView === 'chat'}
                    onSelect={() => {
                      onSelectConversation(conv.id);
                      onSelectView('chat');
                    }}
                    onDelete={() => onDeleteConversation(conv.id)}
                    onTogglePin={() => onTogglePin(conv.id)}
                    isArabic={isArabic}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Recent Conversations */}
          <div>
            <div className="flex items-center justify-between text-[10px] uppercase font-mono tracking-wider text-slate-500 px-1 mb-1">
              <span>{isArabic ? 'المحادثات السابقة' : 'Recent History'}</span>
              <span>{recentConversations.length}</span>
            </div>
            {recentConversations.length === 0 ? (
              <p className="text-[11px] text-slate-600 px-2 py-3 text-center">
                {isArabic ? 'لا توجد محادثات مطابقة' : 'No matching sessions'}
              </p>
            ) : (
              <div className="space-y-0.5">
                {recentConversations.map((conv) => (
                  <SessionItem
                    key={conv.id}
                    conversation={conv}
                    isActive={activeConversationId === conv.id && activeView === 'chat'}
                    onSelect={() => {
                      onSelectConversation(conv.id);
                      onSelectView('chat');
                    }}
                    onDelete={() => onDeleteConversation(conv.id)}
                    onTogglePin={() => onTogglePin(conv.id)}
                    isArabic={isArabic}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto py-2 flex flex-col items-center gap-2">
          {conversations.slice(0, 8).map((conv) => (
            <button
              key={conv.id}
              onClick={() => {
                onSelectConversation(conv.id);
                onSelectView('chat');
              }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                activeConversationId === conv.id && activeView === 'chat'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title={conv.title}
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          ))}
        </div>
      )}

      {/* Sidebar Footer: Privacy & Architecture Guarantee */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/90 text-[11px] text-slate-400">
        {!isCollapsed ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <Shield className="w-3.5 h-3.5" />
                <span>{isArabic ? 'خصوصية تامة ومشفرة' : 'Zero-Knowledge Privacy'}</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              {isArabic 
                ? 'لا يتم تتبع البيانات، المحركات تعمل بهوية موحدة ومستقلة.' 
                : 'No telemetry. Unbranded sovereign architecture.'}
            </p>
          </div>
        ) : (
          <div className="flex justify-center" title={isArabic ? 'حماية خصوصية مشفرة' : 'Protected'}>
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
        )}
      </div>
    </aside>
  );
};

interface SessionItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
  isArabic: boolean;
}

const SessionItem: React.FC<SessionItemProps> = ({
  conversation,
  isActive,
  onSelect,
  onDelete,
  onTogglePin,
  isArabic,
}) => {
  const engine = UNIFIED_ENGINES.find((e) => e.id === conversation.engineId) || UNIFIED_ENGINES[0];
  const cat = CATEGORY_LABELS[conversation.category] || CATEGORY_LABELS.general;

  return (
    <div
      onClick={onSelect}
      className={`group relative rounded-xl px-2.5 py-2 flex items-center justify-between text-xs transition-all cursor-pointer ${
        isActive 
          ? 'bg-slate-800 text-white font-medium shadow-sm' 
          : 'text-slate-300 hover:bg-slate-900/90 hover:text-white'
      }`}
    >
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate">{conversation.title}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-500">
          <span className="font-mono text-cyan-400/80">{engine.codename}</span>
          <span>•</span>
          <span className="truncate">{isArabic ? cat.ar : cat.en}</span>
        </div>
      </div>

      {/* Actions (Pin, Delete) */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin();
          }}
          className={`p-1 rounded hover:bg-slate-700 ${conversation.pinned ? 'text-cyan-400' : 'text-slate-400'}`}
          title={conversation.pinned ? (isArabic ? 'إلغاء التثبيت' : 'Unpin') : (isArabic ? 'تثبيت في الأعلى' : 'Pin')}
        >
          <Pin className="w-3 h-3" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 rounded hover:bg-rose-950/60 text-slate-400 hover:text-rose-400"
          title={isArabic ? 'حذف المحادثة' : 'Delete'}
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
