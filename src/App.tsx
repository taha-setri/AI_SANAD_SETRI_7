import React, { useState, useEffect, useCallback } from 'react';
import { 
  ActiveView, 
  Conversation, 
  EngineId, 
  MultiTaskItem, 
  PrivacyConfig, 
  UserPreferences,
  ChatMessage,
  ContentCategory,
  VisionDisplayConfig
} from './types';
import { 
  loadConversations, 
  saveConversations, 
  loadTasks, 
  saveTasks, 
  loadPreferences, 
  savePreferences, 
  loadPrivacyConfig, 
  savePrivacyConfig,
  loadVisionConfig,
  saveVisionConfig,
  resetToCleanSlate,
  loadFounderDemoData
} from './lib/storage';
import { UNIFIED_ENGINES, INITIAL_CONVERSATIONS, INITIAL_TASKS } from './lib/constants';
import { getSovereignResponse } from './lib/sovereignEngine';
import { NetworkBar } from './components/NetworkBar';
import { Header } from './components/Header';
import { CloudSyncModal } from './components/CloudSyncModal';
import { VisionSearchPortal } from './components/VisionSearchPortal';
import { PublicChatView } from './components/PublicChatView';
import { UnifiedSearchView } from './components/UnifiedSearchView';
import { FounderCockpit, CockpitTab } from './components/FounderCockpit';
import { FounderEncryptedGateModal } from './components/FounderEncryptedGateModal';
import { VisionFooter } from './components/VisionFooter';
import { DisclaimerModal, CookiesModal } from './components/LegalModals';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('vision_search');
  const [activeEngineId, setActiveEngineId] = useState<EngineId>('omni-horizon');
  const [conversations, setConversations] = useState<Conversation[]>(loadConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(() => {
    const convs = loadConversations();
    return convs.length > 0 ? convs[0].id : null;
  });
  const [tasks, setTasks] = useState<MultiTaskItem[]>(loadTasks);
  const [privacyConfig, setPrivacyConfig] = useState<PrivacyConfig>(loadPrivacyConfig);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(loadPreferences);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Founder Cockpit & Legal Modals State
  const [isCockpitUnlocked, setIsCockpitUnlocked] = useState(() => {
    return sessionStorage.getItem('sanad_cockpit_unlocked') === 'true';
  });
  const [isFounderGateOpen, setIsFounderGateOpen] = useState(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [isCookiesOpen, setIsCookiesOpen] = useState(false);

  const [cockpitTab, setCockpitTab] = useState<CockpitTab>('storage');
  const [visionConfig, setVisionConfig] = useState<VisionDisplayConfig>(loadVisionConfig);

  // Hidden Sovereign Keyboard Shortcut (Ctrl+Shift+F or Alt+Shift+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'F' || e.key === 'f')) {
        e.preventDefault();
        setIsFounderGateOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleUpdateVisionConfig = (updated: Partial<VisionDisplayConfig>) => {
    setVisionConfig((prev) => {
      const next = { ...prev, ...updated };
      saveVisionConfig(next);
      return next;
    });
  };

  const handleNavigateView = (view: ActiveView) => {
    if (view === 'vision_search') {
      setActiveView('vision_search');
    } else if (view === 'chat') {
      setActiveView('chat');
    } else if (view === 'search') {
      setActiveView('search');
    } else if (view === 'founder_cockpit') {
      if (isCockpitUnlocked) {
        setActiveView('founder_cockpit');
      } else {
        // Intercept: Sovereign Encrypted Gate
        setIsFounderGateOpen(true);
      }
    } else {
      setActiveView('vision_search');
    }
  };

  const handleUnlockCockpit = () => {
    setIsCockpitUnlocked(true);
    sessionStorage.setItem('sanad_cockpit_unlocked', 'true');
    setActiveView('founder_cockpit');
  };

  const handleLockCockpit = () => {
    setIsCockpitUnlocked(false);
    sessionStorage.removeItem('sanad_cockpit_unlocked');
    setActiveView('vision_search');
  };

  // Sync state to local storage
  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    savePreferences(userPreferences);
    document.documentElement.dir = userPreferences.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = userPreferences.language;
  }, [userPreferences]);

  useEffect(() => {
    savePrivacyConfig(privacyConfig);
  }, [privacyConfig]);

  // Global Keyboard Shortcuts (e.g., Ctrl+K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setActiveView('search');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Active Conversation Helper
  const currentConversation = conversations.find((c) => c.id === activeConversationId) || {
    id: 'empty-temp',
    title: userPreferences.language === 'ar' ? 'جلسة جديدة' : 'New Session',
    engineId: activeEngineId,
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: 'general' as ContentCategory,
    isEncrypted: true,
    tags: ['Sanad_setri'],
  };

  // Switch or Create Conversation
  const handleNewConversation = useCallback((engineId?: EngineId) => {
    const selectedEngine = engineId || activeEngineId;
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      title: userPreferences.language === 'ar' ? 'جلسة جديدة غير معنونة' : 'New Unified Session',
      engineId: selectedEngine,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: 'general',
      isEncrypted: true,
      tags: ['Sanad_setri'],
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setActiveEngineId(selectedEngine);
    setActiveView('chat');
  }, [activeEngineId, userPreferences.language]);

  const handleDeleteConversation = useCallback((id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId((prev) => {
        const remaining = conversations.filter((c) => c.id !== id);
        return remaining.length > 0 ? remaining[0].id : null;
      });
    }
  }, [activeConversationId, conversations]);

  const handleTogglePin = useCallback((id: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c))
    );
  }, []);

  // Send message through unified server-side backend
  const handleSendMessage = async (text: string, engineId: EngineId) => {
    if (!text.trim()) return;

    let targetConvId = activeConversationId;
    let targetConv = conversations.find((c) => c.id === targetConvId);

    // If current is empty or doesn't exist, create it
    if (!targetConv || targetConv.id === 'empty-temp') {
      const newConv: Conversation = {
        id: `conv-${Date.now()}`,
        title: text.slice(0, 36) + (text.length > 36 ? '...' : ''),
        engineId,
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category: 'general',
        isEncrypted: true,
        tags: ['Sanad_setri'],
      };
      targetConvId = newConv.id;
      targetConv = newConv;
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(newConv.id);
    }

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    // Update state immediately with user message
    setConversations((prev) =>
      prev.map((c) =>
        c.id === targetConvId
          ? {
              ...c,
              messages: [...c.messages, userMessage],
              updatedAt: new Date().toISOString(),
              title: c.messages.length === 0 ? text.slice(0, 36) + (text.length > 36 ? '...' : '') : c.title,
            }
          : c
      )
    );

    const assistantMsgId = `msg-${Date.now()}-a`;
    const assistantPlaceholder: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      engineId,
      timestamp: new Date().toISOString(),
      category: targetConv?.category || 'general',
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === targetConvId
          ? {
              ...c,
              engineId,
              messages: [...c.messages, assistantPlaceholder],
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );

    setIsLoading(true);
    const startTime = Date.now();

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          engineId,
          conversationHistory: (targetConv?.messages || []).filter(
            (m) => m.content && m.content.trim() && m.id !== assistantMsgId
          ),
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      if (!response.ok || !response.body || !contentType.includes('text/event-stream')) {
        throw new Error('Streaming endpoint unavailable or not SSE');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6);
            if (dataStr === '[DONE]') continue;
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                accumulatedText += parsed.text;
                const currentText = accumulatedText;
                setConversations((prev) =>
                  prev.map((c) =>
                    c.id === targetConvId
                      ? {
                          ...c,
                          messages: c.messages.map((m) =>
                            m.id === assistantMsgId ? { ...m, content: currentText } : m
                          ),
                        }
                      : c
                  )
                );
              }
            } catch {
              // Ignore non-json SSE lines
            }
          }
        }
      }

      if (!accumulatedText.trim()) {
        throw new Error('Empty stream response');
      }

      const latencyMs = Date.now() - startTime;
      const estimatedTokens = Math.round((text.length + accumulatedText.length) / 3.8);

      setConversations((prev) =>
        prev.map((c) =>
          c.id === targetConvId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === assistantMsgId
                    ? {
                        ...m,
                        content: accumulatedText,
                        latencyMs,
                        estimatedTokens,
                      }
                    : m
                ),
              }
            : c
        )
      );

      // Auto-categorize if the session is new and autoCategorize is enabled
      if (userPreferences.autoCategorize && (targetConv?.messages.length || 0) <= 2) {
        fetch('/api/categorize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        })
          .then((res) => (res.ok && res.headers.get('content-type')?.includes('application/json') ? res.json() : null))
          .then((catData) => {
            if (catData?.category) {
              const catMap: Record<string, ContentCategory> = {
                'برمجة وحلول تقنية': 'code',
                'صياغة ومحتوى إبداعي': 'creative',
                'تحليل استراتيجي': 'analysis',
                'تلخيص ومهام تنفيذية': 'summary',
                'أبحاث ودراسات': 'research',
              };
              const mappedCategory = catMap[catData.category] || 'general';

              setConversations((prev) =>
                prev.map((c) =>
                  c.id === targetConvId
                    ? {
                        ...c,
                        category: mappedCategory,
                        title: catData.suggestedTitle || c.title,
                        tags: Array.from(new Set([...c.tags, ...(catData.tags || [])])),
                      }
                    : c
                )
              );
            }
          })
          .catch(() => {});
      }
    } catch (error) {
      console.warn('Chat stream not available, engaging sovereign fallback engine:', error);
      try {
        const fallbackRes = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            engineId,
            conversationHistory: targetConv?.messages || [],
          }),
        });
        const fbContentType = fallbackRes.headers.get('content-type') || '';
        if (!fallbackRes.ok || !fbContentType.includes('application/json')) {
          throw new Error('Standard API route unavailable or returned non-JSON');
        }
        const fallbackData = await fallbackRes.json();
        if (!fallbackData.content) {
          throw new Error('No content returned from API');
        }
        setConversations((prev) =>
          prev.map((c) =>
            c.id === targetConvId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === assistantMsgId
                      ? {
                          ...m,
                          content: fallbackData.content,
                          latencyMs: fallbackData.latencyMs,
                          estimatedTokens: fallbackData.estimatedTokens,
                        }
                      : m
                  ),
                }
              : c
          )
        );
      } catch (fallbackErr) {
        // High-Intelligence Client-Side Sovereign Response
        const sovereignReply = getSovereignResponse(
          text,
          engineId,
          userPreferences.language,
          { isOfflineOrFallback: true }
        );
        const latencyMs = Date.now() - startTime;
        setConversations((prev) =>
          prev.map((c) =>
            c.id === targetConvId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === assistantMsgId
                      ? {
                          ...m,
                          content: sovereignReply,
                          latencyMs,
                          estimatedTokens: Math.round(sovereignReply.length / 3.8),
                        }
                      : m
                  ),
                }
              : c
          )
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Launch chat from prompt
  const handleNewChatWithPrompt = (prompt: string, engineId: EngineId) => {
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      title: prompt.slice(0, 36) + (prompt.length > 36 ? '...' : ''),
      engineId,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: 'general',
      isEncrypted: true,
      tags: ['Sanad_setri'],
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setActiveEngineId(engineId);
    setActiveView('chat');

    handleSendMessage(prompt, engineId);
  };

  // Task Handlers
  const handleAddTask = (taskData: Omit<MultiTaskItem, 'id' | 'createdAt'>) => {
    const newTask: MultiTaskItem = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleUpdateTaskStatus = (id: string, status: MultiTaskItem['status']) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
  };

  const handleSaveAsTask = (title: string, desc: string, category: ContentCategory, engineId: EngineId) => {
    handleAddTask({
      title,
      description: desc,
      status: 'in_progress',
      priority: 'medium',
      assignedEngineId: engineId,
      category,
      tags: [category, 'Sanad_setri'],
      linkedChatId: activeConversationId || undefined,
    });
    alert(userPreferences.language === 'ar' ? 'تمت إضافة المهمة إلى لوحة التحكم بنجاح!' : 'Task added to dashboard!');
  };

  // Import decrypted backup
  const handleImportDecryptedData = (importedConvs: Conversation[], importedTasks: MultiTaskItem[]) => {
    setConversations(importedConvs);
    setTasks(importedTasks);
    if (importedConvs.length > 0) {
      setActiveConversationId(importedConvs[0].id);
    }
  };

  // Clean Slate: Clear all local data to a fresh state with no interference
  const handleClearAllData = () => {
    resetToCleanSlate();
    setConversations([]);
    setTasks([]);
    setActiveConversationId(null);
  };

  // Restore Founder Demo Data (for testing in Founder Cockpit only)
  const handleRestoreDemoData = () => {
    const demo = loadFounderDemoData();
    setConversations(demo.conversations);
    setTasks(demo.tasks);
    if (demo.conversations.length > 0) {
      setActiveConversationId(demo.conversations[0].id);
    }
  };

  // One-click quick Clean Slate for public visitors
  const handleStartCleanSlate = () => {
    resetToCleanSlate();
    setConversations([]);
    setActiveConversationId(null);
    setActiveView('vision_search');
  };

  // Theme styling mapping
  const getThemeClass = () => {
    switch (userPreferences.theme) {
      case 'navy':
        return 'bg-slate-900 text-slate-100';
      case 'emerald':
        return 'bg-zinc-950 text-zinc-100';
      case 'paper':
        return 'bg-slate-50 text-slate-900';
      case 'midnight':
      default:
        return 'bg-slate-950 text-slate-100';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${getThemeClass()}`}>
      {/* Top Network Ecosystem Bar */}
      <NetworkBar isArabic={userPreferences.language === 'ar'} />

      {/* Top Universal Platform Header */}
      <Header
        activeView={activeView}
        onSelectView={handleNavigateView}
        userPreferences={userPreferences}
        onUpdatePreferences={(prefs) => setUserPreferences((prev) => ({ ...prev, ...prefs }))}
        isCockpitUnlocked={isCockpitUnlocked}
        onLockCockpit={handleLockCockpit}
        onTriggerFounderGate={() => setIsFounderGateOpen(true)}
        onStartCleanSlate={handleStartCleanSlate}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden">
        {/* Dynamic Viewport */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {activeView === 'vision_search' && (
            <VisionSearchPortal
              conversations={conversations}
              activeEngineId={activeEngineId}
              onSelectEngine={setActiveEngineId}
              onOpenConversation={(id) => {
                setActiveConversationId(id);
                setActiveView('chat');
              }}
              onNewConversationWithMessage={(msg, eng) => {
                handleNewConversation(eng);
                handleSendMessage(msg, eng);
                setActiveView('chat');
              }}
              onNavigateView={handleNavigateView}
              isArabic={userPreferences.language === 'ar'}
              visionConfig={visionConfig}
            />
          )}

          {activeView === 'chat' && (
            <PublicChatView
              conversations={conversations}
              activeConversationId={activeConversationId}
              activeEngineId={activeEngineId}
              onSelectConversation={(id) => {
                setActiveConversationId(id);
                const conv = conversations.find((c) => c.id === id);
                if (conv) setActiveEngineId(conv.engineId);
              }}
              onNewConversation={handleNewConversation}
              onDeleteConversation={handleDeleteConversation}
              onTogglePin={handleTogglePin}
              onSelectEngine={setActiveEngineId}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              userPreferences={userPreferences}
              onNavigateToSearch={() => setActiveView('vision_search')}
              isArabic={userPreferences.language === 'ar'}
              onClearSession={handleClearAllData}
            />
          )}

          {activeView === 'search' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-950 p-4 sm:p-6">
              <UnifiedSearchView
                conversations={conversations}
                onSelectConversation={(id) => {
                  setActiveConversationId(id);
                  setActiveView('chat');
                }}
                userPreferences={userPreferences}
              />
            </div>
          )}

          {activeView === 'founder_cockpit' && isCockpitUnlocked && (
            <FounderCockpit
              conversations={conversations}
              tasks={tasks}
              privacyConfig={privacyConfig}
              userPreferences={userPreferences}
              isUnlocked={isCockpitUnlocked}
              onUnlock={handleUnlockCockpit}
              onLock={handleLockCockpit}
              onNavigateView={handleNavigateView}
              isArabic={userPreferences.language === 'ar'}
              activeEngineId={activeEngineId}
              onSelectEngine={setActiveEngineId}
              activeConversationId={activeConversationId}
              onSelectConversation={(id) => {
                setActiveConversationId(id);
                const conv = conversations.find((c) => c.id === id);
                if (conv) setActiveEngineId(conv.engineId);
              }}
              onNewConversation={handleNewConversation}
              onDeleteConversation={handleDeleteConversation}
              onTogglePin={handleTogglePin}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              onAddTask={handleAddTask}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onSaveAsTask={handleSaveAsTask}
              onUpdatePreferences={(prefs) => setUserPreferences((prev) => ({ ...prev, ...prefs }))}
              onUpdatePrivacy={(cfg) => setPrivacyConfig((prev) => ({ ...prev, ...cfg }))}
              onClearAllData={handleClearAllData}
              onOpenSyncModal={() => setIsSyncModalOpen(true)}
              onNewChatWithPrompt={handleNewChatWithPrompt}
              activeTab={cockpitTab}
              onSelectTab={setCockpitTab}
              visionConfig={visionConfig}
              onUpdateVisionConfig={handleUpdateVisionConfig}
              onRestoreDemoData={handleRestoreDemoData}
            />
          )}
        </main>
      </div>

      {/* Prominent Bottom Sovereign Footer with TAHA SETRI, Disclaimer, and Cookies */}
      <VisionFooter
        onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
        onOpenCookies={() => setIsCookiesOpen(true)}
        isArabic={userPreferences.language === 'ar'}
        isCockpitUnlocked={isCockpitUnlocked}
        onOpenFounderCockpit={() => handleNavigateView('founder_cockpit')}
      />

      {/* Sovereign Founder Encrypted Gate Modal */}
      <FounderEncryptedGateModal
        isOpen={isFounderGateOpen}
        onClose={() => setIsFounderGateOpen(false)}
        onSuccess={handleUnlockCockpit}
        isArabic={userPreferences.language === 'ar'}
      />

      {/* Disclaimer Modal */}
      <DisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
        isArabic={userPreferences.language === 'ar'}
      />

      {/* Cookies & Storage Privacy Modal */}
      <CookiesModal
        isOpen={isCookiesOpen}
        onClose={() => setIsCookiesOpen(false)}
        isArabic={userPreferences.language === 'ar'}
      />

      {/* Zero-Knowledge Encrypted Cloud Sync Modal */}
      <CloudSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        privacyConfig={privacyConfig}
        onUpdatePrivacy={(cfg) => setPrivacyConfig((prev) => ({ ...prev, ...cfg }))}
        conversations={conversations}
        tasks={tasks}
        onImportDecryptedData={handleImportDecryptedData}
        userPreferences={userPreferences}
      />
    </div>
  );
}
