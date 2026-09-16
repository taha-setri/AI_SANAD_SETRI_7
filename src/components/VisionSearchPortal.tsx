import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Bot, 
  Cpu, 
  Send, 
  Copy, 
  Check, 
  ExternalLink, 
  Filter, 
  Layers, 
  Zap, 
  Compass, 
  FileText, 
  Sliders,
  Maximize2
} from 'lucide-react';
import { 
  EngineId, 
  Conversation, 
  ChatMessage, 
  ContentCategory, 
  ActiveView,
  VisionDisplayConfig
} from '../types';
import { UNIFIED_ENGINES } from '../lib/constants';
import { VisionAmbientBiome } from './VisionAmbientBiome';
import { SanadSetriLogo, SanadSetriBrand } from './SanadSetriLogo';

interface VisionSearchPortalProps {
  conversations: Conversation[];
  activeEngineId: EngineId;
  onSelectEngine: (engineId: EngineId) => void;
  onOpenConversation: (id: string) => void;
  onNewConversationWithMessage: (text: string, engineId: EngineId) => void;
  onNavigateView: (view: ActiveView) => void;
  isArabic: boolean;
  visionConfig?: VisionDisplayConfig;
}

export const VisionSearchPortal: React.FC<VisionSearchPortalProps> = ({
  conversations,
  activeEngineId,
  onSelectEngine,
  onOpenConversation,
  onNewConversationWithMessage,
  onNavigateView,
  isArabic,
  visionConfig,
}) => {
  const [query, setQuery] = useState('');
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [aiEngineUsed, setAiEngineUsed] = useState<EngineId>(activeEngineId);
  const [hasCopied, setHasCopied] = useState(false);
  const [searchMode, setSearchMode] = useState<'ai' | 'vault'>('ai');

  // Filter Vault Conversations
  const vaultMatches = query.trim()
    ? conversations
        .filter((c) => {
          const q = query.toLowerCase();
          return (
            c.title.toLowerCase().includes(q) ||
            c.messages.some((m) => m.content.toLowerCase().includes(q))
          );
        })
        .slice(0, 4)
    : [];

  // Instant AI Search / Ask execution with SSE Streaming
  const handleExecuteSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || isSearchingAI) return;

    if (searchMode === 'vault' && vaultMatches.length > 0) {
      onOpenConversation(vaultMatches[0].id);
      return;
    }

    setIsSearchingAI(true);
    setAiAnswer('');
    setAiEngineUsed(activeEngineId);

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query.trim(),
          engineId: activeEngineId,
          conversationHistory: [],
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Stream failed');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
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
                accumulated += parsed.text;
                setAiAnswer(accumulated);
              }
            } catch {
              // ignore json line parse errors
            }
          }
        }
      }

      if (!accumulated) {
        setAiAnswer(isArabic ? 'تمت معالجة البحث بنجاح.' : 'Search processed.');
      }
    } catch (err: any) {
      console.error('Vision search AI error:', err);
      try {
        const fallbackRes = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: query.trim(),
            engineId: activeEngineId,
          }),
        });
        const fallbackData = await fallbackRes.json();
        setAiAnswer(fallbackData.content || (isArabic ? 'تم استلام الاستعلام بنجاح.' : 'Query received.'));
      } catch {
        setAiAnswer(isArabic ? 'عذراً، تعذر إتمام البحث اللحظي. يرجى إعادة المحاولة.' : 'Search could not complete. Please retry.');
      }
    } finally {
      setIsSearchingAI(false);
    }
  };

  const handleCopy = () => {
    if (aiAnswer) {
      navigator.clipboard.writeText(aiAnswer);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    }
  };

  const handleExpandToStudio = () => {
    if (query) {
      onNewConversationWithMessage(query, activeEngineId);
      onNavigateView('chat');
    } else {
      onNavigateView('chat');
    }
  };

  const suggestions = isArabic
    ? [
        { label: 'من أنت يا سند الستري؟', engine: 'omni-horizon' as EngineId },
        { label: 'استراتيجيات الحوسبة السحابية', engine: 'omni-horizon' as EngineId },
        { label: 'تحسين بنية الأكواد البرمجية', engine: 'syntactic-logic' as EngineId },
        { label: 'خطة عمل سريعة للتنفيذ', engine: 'pulse-velocity' as EngineId },
        { label: 'صياغة مقال إبداعي مميز', engine: 'creative-stylist' as EngineId },
      ]
    : [
        { label: 'Who are you, Sanad setri?', engine: 'omni-horizon' as EngineId },
        { label: 'Cloud computing strategies', engine: 'omni-horizon' as EngineId },
        { label: 'Code structure optimization', engine: 'syntactic-logic' as EngineId },
        { label: 'High-speed executive plan', engine: 'pulse-velocity' as EngineId },
        { label: 'Refined creative narrative', engine: 'creative-stylist' as EngineId },
      ];

  const currentEngineObj = UNIFIED_ENGINES.find((e) => e.id === activeEngineId) || UNIFIED_ENGINES[0];

  return (
    <div className="flex-1 relative flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto bg-slate-950">
      {/* Living Ambient Biome: Swimming Koi Fish & Floating Lotus Petals */}
      <VisionAmbientBiome isArabic={isArabic} config={visionConfig} />

      {/* Futuristic Vision Hologram Center Glow Rings with Dynamic Multi-Color Cycle */}
      {(visionConfig?.showHologramRings ?? true) && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 animate-spectral">
          <div className="w-[520px] h-[520px] rounded-full border border-cyan-400/20 animate-[spin_60s_linear_infinite]" />
          <div className="absolute inset-8 rounded-full border border-indigo-400/20 animate-[spin_40s_linear_infinite_reverse]" />
          <div className="absolute inset-20 rounded-full border border-amber-400/20 animate-[spin_25s_linear_infinite]" />
          <div className="absolute inset-0 bg-cyan-500/10 blur-3xl rounded-full" />
        </div>
      )}

      {/* Main Vision Container */}
      <div className="w-full max-w-3xl z-10 flex flex-col items-center space-y-7 my-auto py-8">
        {/* Animated Brand Emblem & Custom Platform Logo */}
        <div className="flex flex-col items-center text-center space-y-3">
          {/* Platform Custom Emblem (Supporting Vector Shield, Artwork Asset, or Dual) */}
          <div className="relative group cursor-pointer flex flex-col items-center justify-center">
            {/* Dynamic Multi-Color Shifting Aura */}
            <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500 via-indigo-500 to-amber-500 rounded-3xl blur-lg opacity-40 group-hover:opacity-75 transition duration-700 animate-spectral" />
            
            {visionConfig?.logoStyle === 'artwork' ? (
              <SanadSetriLogo size="hero" useGeneratedAsset={true} animated={true} />
            ) : visionConfig?.logoStyle === 'dual' ? (
              <div className="flex items-center gap-3 p-1.5 rounded-3xl bg-slate-900/90 border-2 border-cyan-500/40 backdrop-blur-xl shadow-2xl">
                <SanadSetriLogo size="xl" useGeneratedAsset={false} animated={true} />
                <SanadSetriLogo size="xl" useGeneratedAsset={true} animated={false} />
              </div>
            ) : (
              <div className="p-2 rounded-3xl bg-slate-900/90 border-2 border-cyan-400/50 shadow-2xl backdrop-blur-xl group-hover:border-cyan-400 transition-colors">
                <SanadSetriLogo size="hero" animated={true} withGlow={true} />
              </div>
            )}

            {/* Inscription SANAD under the logo emblem */}
            <div className="relative mt-2.5 z-10 px-4 py-0.5 rounded-full bg-slate-900/80 border border-cyan-500/30 backdrop-blur-md shadow-md">
              <span className="text-xs sm:text-sm font-mono font-black tracking-[0.35em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-amber-300 uppercase drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]">
                SANAD
              </span>
            </div>
          </div>

          {/* Exquisite Typography (English & Arabic) */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-amber-200 tracking-tight font-sans drop-shadow-sm">
                Sanad setri
              </h1>
            </div>

            {/* Arabic Calligraphy & Subtitle */}
            <div className="flex items-center justify-center gap-2">
              <span className="text-base sm:text-lg font-black text-amber-300 tracking-wider font-sans">
                سَنَد سِتْرِي
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="text-xs font-semibold text-slate-400">
                الحصن السيادي للذكاء الاصطناعي
              </span>
            </div>

            <p className="text-xs text-slate-400 max-w-md mx-auto font-medium">
              {visionConfig?.customVisionSubtitle && visionConfig.customVisionSubtitle.trim()
                ? visionConfig.customVisionSubtitle
                : isArabic 
                ? 'محرك البحث والاستقصاء السيادي الموحد • استجابة فورية فائقة الذكاء' 
                : 'Sovereign Unified Intelligence Search Engine • Real-time Instant Cognition'}
            </p>
          </div>

          {/* Engine Logos Floating Strip (Icon-Only Pure Logos without text) */}
          {(visionConfig?.showEngineLogos ?? true) && (
            <div className="flex items-center justify-center gap-2 sm:gap-2.5 pt-1 flex-wrap">
              {UNIFIED_ENGINES.map((eng) => {
                const isSelected = eng.id === activeEngineId;
                return (
                  <button
                    key={eng.id}
                    onClick={() => onSelectEngine(eng.id)}
                    title={`${isArabic ? eng.nameAr : eng.nameEn} (${eng.codename})`}
                    className={`relative p-2.5 sm:p-3 rounded-2xl transition-all duration-300 cursor-pointer border group ${
                      isSelected
                        ? 'bg-cyan-950/90 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/25 scale-110'
                        : 'bg-slate-900/70 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:scale-105'
                    }`}
                  >
                    <span className="text-lg sm:text-xl block transition-transform group-hover:scale-115">
                      {eng.icon}
                    </span>
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 border-2 border-slate-950 animate-pulse" />
                    )}
                    {/* Floating tooltip on hover only */}
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-[10px] text-slate-300 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-30 shadow-md">
                      {isArabic ? eng.nameAr : eng.nameEn}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Central Search Engine Bar */}
        <div className="w-full">
          <form
            onSubmit={handleExecuteSearch}
            className="relative w-full rounded-3xl bg-slate-900/95 border-2 border-cyan-500/50 hover:border-cyan-400 focus-within:border-cyan-400 shadow-2xl shadow-cyan-500/10 backdrop-blur-2xl transition-all duration-300 p-2 sm:p-2.5 flex items-center gap-2"
          >
            <div className="p-2 sm:p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 shrink-0">
              <Search className="w-5 h-5 sm:w-6 h-6 animate-pulse" />
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                isArabic
                  ? `اسأل ${currentEngineObj.nameAr} أو ابحث في كل شيء...`
                  : `Ask ${currentEngineObj.nameEn} or search everything...`
              }
              className="flex-1 bg-transparent text-white text-sm sm:text-base placeholder-slate-500 focus:outline-none px-2 font-sans"
              autoFocus
            />

            {/* Execute Button */}
            <button
              type="submit"
              disabled={!query.trim() || isSearchingAI}
              className="p-3 sm:px-5 sm:py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-90 disabled:opacity-40 text-white font-bold text-xs tracking-wider transition-all shadow-md shadow-cyan-500/20 cursor-pointer flex items-center gap-2 shrink-0"
            >
              {isSearchingAI ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="hidden sm:inline">{isArabic ? 'بحث لحظي' : 'Execute'}</span>
                  {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </>
              )}
            </button>
          </form>

          {/* Search Mode Toggle (AI Cognition vs Vault Match) */}
          <div className="flex items-center justify-between mt-3 px-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSearchMode('ai')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  searchMode === 'ai'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {isArabic ? 'استجابة الذكاء الموحد' : 'AI Direct Generation'}
              </button>
              <button
                type="button"
                onClick={() => setSearchMode('vault')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  searchMode === 'vault'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {isArabic ? 'فهرس الخزنة السابقة' : 'Search Vault History'}
              </button>
            </div>

            <span className="text-[11px] text-slate-500 hidden sm:inline font-mono">
              Engine: {currentEngineObj.codename}
            </span>
          </div>
        </div>

        {/* Vault Match Cards (If query matches previous conversations) */}
        {query.trim() && vaultMatches.length > 0 && searchMode === 'vault' && (
          <div className="w-full space-y-2 animate-in fade-in slide-in-from-top-2">
            <div className="text-[11px] font-semibold text-slate-400 px-1">
              {isArabic ? 'جلسات مطابقة في الخزنة:' : 'Matching Vault Sessions:'}
            </div>
            {vaultMatches.map((item) => (
              <div
                key={item.id}
                onClick={() => onOpenConversation(item.id)}
                className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {item.messages[item.messages.length - 1]?.content || ''}
                  </p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0" />
              </div>
            ))}
          </div>
        )}

        {/* Real-time AI Stream Output Card */}
        {(isSearchingAI || aiAnswer) && (
          <div className="w-full rounded-3xl bg-slate-900/95 border border-cyan-500/40 shadow-2xl p-5 sm:p-6 space-y-4 animate-in fade-in slide-in-from-bottom-3 backdrop-blur-xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-xs font-bold text-white font-mono">
                  {currentEngineObj.nameAr}
                </span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                  Live Vision Stream
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1"
                >
                  {hasCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{hasCopied ? (isArabic ? 'تم النسخ' : 'Copied') : (isArabic ? 'نسخ' : 'Copy')}</span>
                </button>

                <button
                  onClick={handleExpandToStudio}
                  className="p-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900 transition-colors cursor-pointer text-xs flex items-center gap-1 px-2.5"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isArabic ? 'فتح في مكان التحدث' : 'Open in Chat Studio'}</span>
                </button>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap max-h-96 overflow-y-auto">
              {aiAnswer}
              {isSearchingAI && (
                <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse" />
              )}
            </div>
          </div>
        )}

        {/* Suggestion Chips */}
        {(visionConfig?.showSuggestionPrompts ?? true) && !aiAnswer && !isSearchingAI && (
          <div className="w-full flex flex-col items-center space-y-2 pt-2">
            <span className="text-[11px] text-slate-500 font-medium">
              {isArabic ? 'أو ابدأ بموضوع مقترح:' : 'Or trigger an immediate focus:'}
            </span>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(s.label);
                    onSelectEngine(s.engine);
                  }}
                  className="px-3.5 py-1.5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
