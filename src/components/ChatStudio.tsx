import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Lock, 
  Copy, 
  Check, 
  Download, 
  FileText, 
  Share2, 
  RotateCcw, 
  Layers, 
  SlidersHorizontal, 
  Bot, 
  User, 
  ChevronDown,
  Columns,
  Code2,
  ListPlus,
  AlertCircle
} from 'lucide-react';
import { Conversation, EngineId, ChatMessage, UserPreferences, ContentCategory } from '../types';
import { UNIFIED_ENGINES, CATEGORY_LABELS } from '../lib/constants';

interface ChatStudioProps {
  conversation: Conversation;
  activeEngineId: EngineId;
  onSelectEngine: (id: EngineId) => void;
  onSendMessage: (text: string, engineId: EngineId) => Promise<void>;
  isLoading: boolean;
  userPreferences: UserPreferences;
  onSaveAsTask?: (title: string, desc: string, category: ContentCategory, engineId: EngineId) => void;
}

export const ChatStudio: React.FC<ChatStudioProps> = ({
  conversation,
  activeEngineId,
  onSelectEngine,
  onSendMessage,
  isLoading,
  userPreferences,
  onSaveAsTask,
}) => {
  const isArabic = userPreferences.language === 'ar';
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [engineDropdownOpen, setEngineDropdownOpen] = useState(false);
  const [comparativeMode, setComparativeMode] = useState(false);
  const [secondaryEngineId, setSecondaryEngineId] = useState<EngineId>('pulse-velocity');
  const [comparativeResponse, setComparativeResponse] = useState<string | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const primaryEngine = UNIFIED_ENGINES.find((e) => e.id === activeEngineId) || UNIFIED_ENGINES[0];
  const secondaryEngine = UNIFIED_ENGINES.find((e) => e.id === secondaryEngineId) || UNIFIED_ENGINES[3];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages, isLoading, comparativeResponse]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading || isComparing) return;

    const query = inputText.trim();
    setInputText('');

    if (comparativeMode) {
      setIsComparing(true);
      setComparativeResponse(null);
      
      // Execute primary
      const primaryPromise = onSendMessage(query, activeEngineId);
      
      // Execute secondary in parallel via direct API call
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: query, engineId: secondaryEngineId }),
        });
        const data = await res.json();
        setComparativeResponse(data.content || 'تمت المعالجة.');
      } catch (err) {
        setComparativeResponse('فشل محرك المقارنة في الاستجابة.');
      } finally {
        setIsComparing(false);
      }

      await primaryPromise;
    } else {
      await onSendMessage(query, activeEngineId);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-slate-950 overflow-hidden relative">
      {/* Studio Header: Active Engine info, Comparative mode toggle, and details */}
      <div className="h-14 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          {/* Active Engine Picker */}
          <div className="relative">
            <button
              onClick={() => setEngineDropdownOpen(!engineDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-cyan-500/40 text-xs font-semibold text-white transition-all cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>{isArabic ? primaryEngine.nameAr : primaryEngine.nameEn}</span>
              <span className="font-mono text-[10px] text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded">
                {primaryEngine.codename}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {engineDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setEngineDropdownOpen(false)} />
                <div className="absolute top-full mt-2 right-0 w-72 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in">
                  <div className="text-[10px] text-slate-400 px-2 py-1 mb-1 font-medium border-b border-slate-800">
                    {isArabic ? 'تبديل المحرك الذكي في هذه الجلسة:' : 'Switch Engine for this session:'}
                  </div>
                  {UNIFIED_ENGINES.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => {
                        onSelectEngine(e.id);
                        setEngineDropdownOpen(false);
                      }}
                      className={`w-full text-right p-2 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-colors ${
                        activeEngineId === e.id ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-slate-400 bg-slate-800 px-1 rounded">
                          {e.codename}
                        </span>
                        <span>{isArabic ? e.nameAr : e.nameEn}</span>
                      </div>
                      {activeEngineId === e.id && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <span className="text-xs text-slate-400 hidden md:inline truncate max-w-md">
            {isArabic ? primaryEngine.specialtyAr : primaryEngine.specialtyEn}
          </span>
        </div>

        {/* Comparative Dual-Engine Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setComparativeMode(!comparativeMode)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
              comparativeMode 
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' 
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title={isArabic ? 'مقارنة إجابة محركين جنباً إلى جنب' : 'Compare 2 engines simultaneously'}
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isArabic ? 'المقارنة المتزامنة' : 'Compare Mode'}
            </span>
          </button>

          {comparativeMode && (
            <select
              value={secondaryEngineId}
              onChange={(e) => setSecondaryEngineId(e.target.value as EngineId)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1 focus:outline-none"
            >
              {UNIFIED_ENGINES.filter(e => e.id !== activeEngineId).map(e => (
                <option key={e.id} value={e.id}>
                  {isArabic ? e.nameAr : e.nameEn}
                </option>
              ))}
            </select>
          )}

          <div className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/40 px-2 py-1 rounded-md border border-emerald-800/40">
            <Lock className="w-3 h-3" />
            <span className="hidden lg:inline">{isArabic ? 'جلسة مشفرة' : 'Encrypted'}</span>
          </div>
        </div>
      </div>

      {/* Message Stream Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {conversation.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto py-12 select-none">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 mb-3 shadow-inner">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">
              {isArabic ? 'سند الستري - ذكاؤك ومساعدك السيادي' : 'Sanad setri - Sovereign AI Assistant'}
            </h3>
            <p className="text-xs text-slate-400 font-medium mb-4 max-w-xs">
              {isArabic ? 'اطرح سؤالك أو اختر أحد النماذج السريعة للبدء فوراً:' : 'Ask anything or choose a quick starter below:'}
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-sm">
              <button
                type="button"
                onClick={() => onSendMessage(isArabic ? 'من أنت؟' : 'Who are you?', activeEngineId)}
                className="text-xs px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-cyan-950/40 text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer shadow-sm"
              >
                {isArabic ? '👋 من أنت يا سند الستري؟' : '👋 Who are you, Sanad setri?'}
              </button>
              <button
                type="button"
                onClick={() => onSendMessage(isArabic ? 'ما هي المحركات والقدرات الذكية المتوفرة لديك؟' : 'What engines and capabilities are available?', activeEngineId)}
                className="text-xs px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
              >
                {isArabic ? '⚡ ما هي قدراتك ومحركاتك؟' : '⚡ Engines & abilities?'}
              </button>
            </div>
          </div>
        ) : (
          conversation.messages.map((msg) => {
            const isUser = msg.role === 'user';
            const msgEngine = UNIFIED_ENGINES.find(e => e.id === msg.engineId) || primaryEngine;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'mr-auto flex-row-reverse' : 'ml-auto'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs shadow-md ${
                  isUser 
                    ? 'bg-slate-800 border border-slate-700 text-slate-200' 
                    : 'bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Content Box */}
                <div className="flex-1 min-w-0">
                  {/* Top Message Details */}
                  {!isUser && (
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-bold text-white">
                        {isArabic ? msgEngine.nameAr : msgEngine.nameEn}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                        {msgEngine.codename}
                      </span>
                      {msg.latencyMs && (
                        <span className="text-[10px] font-mono text-slate-500">
                          {msg.latencyMs}ms
                        </span>
                      )}
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-cyan-600/20 border border-cyan-500/30 text-white'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200 shadow-md'
                  }`}>
                    <div className="whitespace-pre-wrap font-sans break-words selection:bg-cyan-500/30">
                      {msg.content}
                    </div>

                    {/* Bottom message toolbar for assistant */}
                    {!isUser && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopy(msg.id, msg.content)}
                            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                            title={isArabic ? 'نسخ النص' : 'Copy'}
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span className="text-[11px]">{copiedId === msg.id ? (isArabic ? 'تم النسخ' : 'Copied') : (isArabic ? 'نسخ' : 'Copy')}</span>
                          </button>

                          {onSaveAsTask && (
                            <button
                              onClick={() => {
                                onSaveAsTask(
                                  conversation.title || 'مهمة مستخرجة من المحادثة',
                                  msg.content.slice(0, 180),
                                  conversation.category,
                                  msgEngine.id
                                );
                              }}
                              className="flex items-center gap-1 hover:text-cyan-300 transition-colors cursor-pointer"
                              title={isArabic ? 'تحويل لمهمة في لوحة التحكم' : 'Save as task'}
                            >
                              <ListPlus className="w-3.5 h-3.5" />
                              <span className="text-[11px]">{isArabic ? 'حفظ كمهمة' : 'To Task'}</span>
                            </button>
                          )}
                        </div>

                        <span className="text-[10px] font-mono text-slate-500">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex gap-3 max-w-3xl ml-auto animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></span>
              <span>{isArabic ? `يقوم ${primaryEngine.nameAr} بالتوليد والتحليل...` : `${primaryEngine.nameEn} processing...`}</span>
            </div>
          </div>
        )}

        {/* Comparative Dual Response Display if available */}
        {comparativeResponse && (
          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 max-w-3xl ml-auto mt-4">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-indigo-900/60">
              <div className="flex items-center gap-2">
                <Columns className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-indigo-300">
                  {isArabic ? `استجابة المقارنة الموازية: ${secondaryEngine.nameAr}` : `Comparative Output: ${secondaryEngine.nameEn}`}
                </span>
                <span className="text-[10px] font-mono px-1 rounded bg-indigo-900/60 text-indigo-300">
                  {secondaryEngine.codename}
                </span>
              </div>
              <button
                onClick={() => handleCopy('comp-resp', comparativeResponse)}
                className="text-xs text-indigo-400 hover:text-indigo-200 flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>{isArabic ? 'نسخ' : 'Copy'}</span>
              </button>
            </div>
            <div className="text-xs leading-relaxed text-slate-200 whitespace-pre-wrap">
              {comparativeResponse}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer Box */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-md shrink-0">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleFormSubmit} className="relative">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 focus-within:border-cyan-500/60 focus-within:ring-1 focus-within:ring-cyan-500/20 transition-all p-2 sm:p-3">
              <textarea
                ref={textareaRef}
                rows={2}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleFormSubmit(e);
                  }
                }}
                placeholder={
                  isArabic 
                    ? `اكتب رسالتك إلى ${primaryEngine.nameAr} (اضغط Enter للإرسال، Shift+Enter لسطر جديد)...` 
                    : `Message ${primaryEngine.nameEn} (Press Enter to send)...`
                }
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-slate-500 resize-none focus:outline-none leading-relaxed"
              />

              {/* Bottom bar inside composer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                <div className="flex items-center gap-2">
                  {/* Active Engine Indicator Badge */}
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                    {primaryEngine.codename}
                  </span>
                  <span className="text-[10px] text-slate-500 hidden sm:inline">
                    {isArabic ? 'حماية خصوصية تامة' : 'Zero Telemetry'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isLoading}
                    className="p-2 sm:px-4 sm:py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
                  >
                    <span className="hidden sm:inline">{isArabic ? 'إرسال' : 'Send'}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
