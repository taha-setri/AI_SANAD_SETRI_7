import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Tag, 
  ExternalLink, 
  Copy, 
  Check, 
  Calendar, 
  Layers, 
  FileText,
  Sparkles,
  SlidersHorizontal,
  Bot
} from 'lucide-react';
import { Conversation, ContentCategory, EngineId, UserPreferences } from '../types';
import { UNIFIED_ENGINES, CATEGORY_LABELS } from '../lib/constants';

interface UnifiedSearchViewProps {
  conversations: Conversation[];
  onSelectConversation: (id: string) => void;
  userPreferences: UserPreferences;
}

export const UnifiedSearchView: React.FC<UnifiedSearchViewProps> = ({
  conversations,
  onSelectConversation,
  userPreferences,
}) => {
  const isArabic = userPreferences.language === 'ar';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory | 'all'>('all');
  const [selectedEngine, setSelectedEngine] = useState<EngineId | 'all'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Flatten messages into searchable index linked with session metadata
  const indexedResults = useMemo(() => {
    const results: Array<{
      chatId: string;
      chatTitle: string;
      messageId: string;
      role: 'user' | 'assistant';
      content: string;
      engineId: EngineId;
      timestamp: string;
      category: ContentCategory;
      tags: string[];
    }> = [];

    conversations.forEach((conv) => {
      conv.messages.forEach((msg) => {
        results.push({
          chatId: conv.id,
          chatTitle: conv.title,
          messageId: msg.id,
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content,
          engineId: msg.engineId || conv.engineId,
          timestamp: msg.timestamp,
          category: msg.category || conv.category || 'general',
          tags: conv.tags || [],
        });
      });
    });

    return results;
  }, [conversations]);

  // Filter based on search term, category and engine
  const filteredResults = useMemo(() => {
    return indexedResults.filter((item) => {
      const matchesSearch = searchTerm.trim() === '' || 
        item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.chatTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesEngine = selectedEngine === 'all' || item.engineId === selectedEngine;

      return matchesSearch && matchesCategory && matchesEngine;
    });
  }, [indexedResults, searchTerm, selectedCategory, selectedEngine]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to highlight matching keywords safely
  const renderHighlightedSnippet = (text: string, query: string) => {
    if (!query.trim()) {
      return <span>{text.slice(0, 320)}{text.length > 320 ? '...' : ''}</span>;
    }

    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) {
      return <span>{text.slice(0, 320)}{text.length > 320 ? '...' : ''}</span>;
    }

    const start = Math.max(0, index - 60);
    const end = Math.min(text.length, index + query.length + 120);
    const prefix = start > 0 ? '...' : '';
    const suffix = end < text.length ? '...' : '';

    const snippet = text.slice(start, end);
    const parts = snippet.split(new RegExp(`(${query})`, 'gi'));

    return (
      <span>
        {prefix}
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-cyan-400/30 text-cyan-200 px-1 py-0.5 rounded font-semibold">
              {part}
            </mark>
          ) : (
            part
          )
        )}
        {suffix}
      </span>
    );
  };

  // Category counting
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: indexedResults.length };
    indexedResults.forEach((r) => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });
    return counts;
  }, [indexedResults]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <Search className="w-6 h-6 text-cyan-400" />
          <span>{isArabic ? 'البحث الموحد والتصنيف التلقائي' : 'Unified Search & Auto-Categorization'}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          {isArabic 
            ? 'يربط نتائج كافة المحادثات الموزعة عبر جميع المحركات، ويصنفها تلقائياً ليسهل استرجاع أي معلومة أو كود.'
            : 'Cross-engine unified indexing with automated taxonomy and rapid discovery.'}
        </p>
      </div>

      {/* Main Search Input Bar */}
      <div className="relative">
        <div className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-xl focus-within:border-cyan-500 transition-all">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              isArabic 
                ? 'ابحث في محتوى جميع المحادثات، الأكواد، الخلاصات التنفيذية، أو الأبحاث...' 
                : 'Search across all conversations, code snippets, summaries, and research...'
            }
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-md bg-slate-800"
            >
              {isArabic ? 'مسح' : 'Clear'}
            </button>
          )}
        </div>
      </div>

      {/* Auto-Categorization Filter Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-medium">
            <Tag className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isArabic ? 'التصنيف التلقائي للمحتوى:' : 'Automated Taxonomy:'}</span>
          </span>
          <span className="font-mono text-slate-500">
            {filteredResults.length} {isArabic ? 'نتيجة مطابقة' : 'matches found'}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            {isArabic ? 'كافة التصنيفات' : 'All Categories'} ({categoryCounts.all || 0})
          </button>

          {Object.entries(CATEGORY_LABELS).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key as ContentCategory)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === key
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              {isArabic ? cat.ar : cat.en} ({categoryCounts[key] || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Engine Filter Pills */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="text-slate-500 text-[11px] font-medium">
          {isArabic ? 'المحرك المسؤول:' : 'By Engine:'}
        </span>
        <button
          onClick={() => setSelectedEngine('all')}
          className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
            selectedEngine === 'all' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {isArabic ? 'جميع المحركات' : 'All Engines'}
        </button>
        {UNIFIED_ENGINES.map((eng) => (
          <button
            key={eng.id}
            onClick={() => setSelectedEngine(eng.id)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
              selectedEngine === eng.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {eng.codename}
          </button>
        ))}
      </div>

      {/* Search Results List */}
      <div className="space-y-3">
        {filteredResults.length === 0 ? (
          <div className="py-16 text-center rounded-2xl bg-slate-900/60 border border-slate-800 p-8">
            <Search className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-300 mb-1">
              {isArabic ? 'لم يتم العثور على نتائج مطابقة' : 'No matching results'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {isArabic 
                ? 'جرب البحث بكلمات مفتاحية أخرى، أو قم بإلغاء تحديد فلاتر التصنيف أو المحرك.'
                : 'Try different search keywords or clear current filters.'}
            </p>
          </div>
        ) : (
          filteredResults.map((item) => {
            const engine = UNIFIED_ENGINES.find((e) => e.id === item.engineId) || UNIFIED_ENGINES[0];
            const cat = CATEGORY_LABELS[item.category] || CATEGORY_LABELS.general;

            return (
              <div
                key={item.messageId}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all shadow-sm space-y-2 group"
              >
                {/* Result Top Metadata */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => onSelectConversation(item.chatId)}
                      className="font-bold text-xs sm:text-sm text-white hover:text-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer text-right"
                    >
                      <span>{item.chatTitle}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </button>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                      {engine.codename}
                    </span>

                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {isArabic ? cat.ar : cat.en}
                    </span>

                    <span className="text-[10px] text-slate-500">
                      {item.role === 'user' ? (isArabic ? 'سؤال المستخدم' : 'User Query') : (isArabic ? 'استجابة المحرك' : 'Engine Response')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(item.messageId, item.content)}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1 p-1 rounded hover:bg-slate-800 cursor-pointer"
                      title={isArabic ? 'نسخ المقتطف' : 'Copy'}
                    >
                      {copiedId === item.messageId ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span className="text-[11px]">{copiedId === item.messageId ? (isArabic ? 'تم' : 'Done') : (isArabic ? 'نسخ' : 'Copy')}</span>
                    </button>

                    <button
                      onClick={() => onSelectConversation(item.chatId)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 p-1 rounded hover:bg-slate-800 cursor-pointer"
                    >
                      <span>{isArabic ? 'الانتقال للمحادثة' : 'Jump to thread'}</span>
                    </button>
                  </div>
                </div>

                {/* Content Snippet */}
                <div className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950/70 p-3 rounded-xl border border-slate-850">
                  {renderHighlightedSnippet(item.content, searchTerm)}
                </div>

                {/* Tags and timestamp footer */}
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <div className="flex items-center gap-1 flex-wrap">
                    {item.tags.map((tag, idx) => (
                      <span key={idx} className="bg-slate-850 text-slate-400 px-1.5 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <span>{new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
