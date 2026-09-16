import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  Plus, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  TrendingUp, 
  Check, 
  ExternalLink,
  Code2,
  FileText,
  Compass,
  Zap,
  SearchCheck,
  Send
} from 'lucide-react';
import { EngineId, MultiTaskItem, UserPreferences, Conversation, ContentCategory } from '../types';
import { UNIFIED_ENGINES, CATEGORY_LABELS } from '../lib/constants';

interface DashboardViewProps {
  tasks: MultiTaskItem[];
  conversations: Conversation[];
  onAddTask: (task: Omit<MultiTaskItem, 'id' | 'createdAt'>) => void;
  onUpdateTaskStatus: (id: string, status: MultiTaskItem['status']) => void;
  onSelectConversation: (id: string) => void;
  onNewChatWithPrompt: (prompt: string, engineId: EngineId) => void;
  userPreferences: UserPreferences;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  conversations,
  onAddTask,
  onUpdateTaskStatus,
  onSelectConversation,
  onNewChatWithPrompt,
  userPreferences,
}) => {
  const isArabic = userPreferences.language === 'ar';
  const [taskFilter, setTaskFilter] = useState<'all' | 'in_progress' | 'pending' | 'completed'>('all');
  const [quickPrompt, setQuickPrompt] = useState('');
  const [selectedEngine, setSelectedEngine] = useState<EngineId>('omni-horizon');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newCategory, setNewCategory] = useState<ContentCategory>('analysis');

  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const pendingTasks = tasks.filter((t) => t.status === 'pending').length;

  const totalTokens = conversations.reduce((acc, conv) => {
    return acc + conv.messages.reduce((mAcc, m) => mAcc + (m.estimatedTokens || 120), 0);
  }, 0);

  // Estimated saved minutes: 1 prompt saves approx 12-18 minutes of manual drafting
  const estimatedHoursSaved = ((conversations.length * 15 + completedTasks * 25) / 60).toFixed(1);

  const filteredTasks = tasks.filter((t) => {
    if (taskFilter === 'all') return true;
    return t.status === taskFilter;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle,
      description: newDesc,
      status: 'pending',
      priority: newPriority,
      assignedEngineId: selectedEngine,
      category: newCategory,
      tags: [newCategory, 'Sanad_setri'],
    });

    setNewTitle('');
    setNewDesc('');
    setShowNewTaskModal(false);
  };

  const quickActionTemplates = [
    {
      titleAr: 'مراجعة معمارية برمجية وكود نظيف',
      titleEn: 'Code & Architecture Review',
      prompt: 'قم بمراجعة أفضل الممارسات لبناء معمارية برمجية آمنة وموزعة مع فحص الثغرات المحتملة.',
      engineId: 'syntactic-logic' as EngineId,
      icon: Code2,
      category: 'code' as ContentCategory,
      color: 'blue',
    },
    {
      titleAr: 'صياغة مقترح مشروع تسويقي جذاب',
      titleEn: 'Draft Pitch Proposal',
      prompt: 'صغ خطة إطلاق تسويقية جذابة لمنتج رقمي جديد مع إبراز نقاط القوة التنافسية وعرض القيمة.',
      engineId: 'creative-stylist' as EngineId,
      icon: FileText,
      category: 'creative' as ContentCategory,
      color: 'amber',
    },
    {
      titleAr: 'تلخيص فوري لاجتماع مع قرارات عمل',
      titleEn: 'Meeting Action Brief',
      prompt: 'لخص نتائج نقاش استراتيجي إلى 5 نقاط عمل محددة مع تحديد المسؤوليات والجدول الزمني.',
      engineId: 'pulse-velocity' as EngineId,
      icon: Zap,
      category: 'summary' as ContentCategory,
      color: 'rose',
    },
    {
      titleAr: 'تحقيق مقارن بين حلول البيانات السحابية',
      titleEn: 'Comparative Cloud Study',
      prompt: 'أجرِ دراسة مقارنة منهجية بين خيارات قواعد البيانات الموزعة مع جدول معايير وتكلفة الأداء.',
      engineId: 'deep-inquiry' as EngineId,
      icon: SearchCheck,
      category: 'research' as ContentCategory,
      color: 'purple',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-cyan-400" />
            <span>{isArabic ? 'لوحة التحكم الذكية لتلخيص المهام' : 'Smart Task & Multi-Engine Dashboard'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {isArabic 
              ? 'إدارة مركزية لجميع المهام والمحادثات الموزعة على محركات Sanad setri المتخصصة دون تشتت.' 
              : 'Unified orchestration across specialized engines with sovereign privacy.'}
          </p>
        </div>

        <button
          onClick={() => setShowNewTaskModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isArabic ? 'إضافة مهمة ذكية' : 'New Multi-Task'}</span>
        </button>
      </div>

      {/* KPI Overview Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Tasks Progress */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">
              {isArabic ? 'إنجاز المهام' : 'Tasks Progress'}
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-mono">
              {completedTasks}/{tasks.length}
            </span>
            <span className="text-xs text-emerald-400 font-medium font-mono">
              {tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}%
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Estimated Time Saved */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">
              {isArabic ? 'الوقت الموفر المقدر' : 'Time Saved'}
            </span>
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-mono">
              ~{estimatedHoursSaved}
            </span>
            <span className="text-xs text-slate-400">
              {isArabic ? 'ساعة عمل' : 'hrs saved'}
            </span>
          </div>
          <p className="mt-2 text-[10px] text-slate-500 truncate">
            {isArabic ? 'وفقاً لسرعة الإنجاز بالمحركات الموحدة' : 'Based on engine velocity'}
          </p>
        </div>

        {/* Metric 3: Processed Sessions */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">
              {isArabic ? 'الجلسات المؤرشفة' : 'Archived Sessions'}
            </span>
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-mono">
              {conversations.length}
            </span>
            <span className="text-xs text-indigo-400 font-mono">
              {totalTokens.toLocaleString()} tokens
            </span>
          </div>
          <p className="mt-2 text-[10px] text-slate-500 truncate">
            {isArabic ? 'مفهرسة بالكامل في البحث الموحد' : 'Indexed in unified search'}
          </p>
        </div>

        {/* Metric 4: Privacy & Zero-Knowledge Status */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">
              {isArabic ? 'حالة التشفير والسيادة' : 'Zero-Knowledge Vault'}
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg font-bold text-emerald-400">
              AES-256 GCM
            </span>
          </div>
          <p className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{isArabic ? 'مزامنة مشفرة ونقاء تام' : 'Encrypted Cloud Sync Active'}</span>
          </p>
        </div>
      </div>

      {/* Unified Fast Dispatcher: Prompt Any Engine from Dashboard */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-xl relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white">
              {isArabic ? 'الموجه السريع للمحركات الموحدة' : 'Unified Fast Dispatcher'}
            </h2>
          </div>

          {/* Engine Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {UNIFIED_ENGINES.map((e) => (
              <button
                key={e.id}
                onClick={() => setSelectedEngine(e.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedEngine === e.id
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                {isArabic ? e.nameAr.split(' ')[1] || e.nameAr : e.nameEn.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (!quickPrompt.trim()) return;
            onNewChatWithPrompt(quickPrompt, selectedEngine);
            setQuickPrompt('');
          }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <input
            type="text"
            value={quickPrompt}
            onChange={(e) => setQuickPrompt(e.target.value)}
            placeholder={
              isArabic 
                ? `اكتب طلبك وسيقوم "${UNIFIED_ENGINES.find(e => e.id === selectedEngine)?.nameAr}" بإنجازه فوراً...`
                : `Enter your instruction for ${UNIFIED_ENGINES.find(e => e.id === selectedEngine)?.nameEn}...`
            }
            className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={!quickPrompt.trim()}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
          >
            <span>{isArabic ? 'تنفيذ فوري' : 'Dispatch'}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Quick Launch Action Templates */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>{isArabic ? 'قوالب تسريع الإنتاجية اليومية' : 'Daily Productivity Accelerators'}</span>
          </h2>
          <span className="text-xs text-slate-400">
            {isArabic ? 'نقرة واحدة لبدء العمل' : '1-Click Launch'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActionTemplates.map((item, idx) => {
            const Icon = item.icon;
            const engine = UNIFIED_ENGINES.find(e => e.id === item.engineId);
            return (
              <button
                key={idx}
                onClick={() => onNewChatWithPrompt(item.prompt, item.engineId)}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-right transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-2 rounded-lg bg-slate-800 text-cyan-400 group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {engine?.codename}
                    </span>
                  </div>
                  <h3 className="font-semibold text-xs text-white group-hover:text-cyan-300 transition-colors">
                    {isArabic ? item.titleAr : item.titleEn}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.prompt}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-cyan-400 font-medium">
                  <span>{isArabic ? 'تشغيل بالمحرك المخصص' : 'Run on Engine'}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Multi-Task Summarizer Board */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isArabic ? 'جدول المهام المتعددة وملخص الأداء' : 'Multi-Task Orchestration Board'}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isArabic ? 'تتبع التقدم، ربط الجلسات، وتحديث حالة العمل التنفيذي.' : 'Track multi-engine task progression and linked threads.'}
            </p>
          </div>

          {/* Task Status Filters */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setTaskFilter('all')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                taskFilter === 'all' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isArabic ? 'الكل' : 'All'} ({tasks.length})
            </button>
            <button
              onClick={() => setTaskFilter('in_progress')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                taskFilter === 'in_progress' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isArabic ? 'قيد الإنجاز' : 'In Progress'} ({inProgressTasks})
            </button>
            <button
              onClick={() => setTaskFilter('pending')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                taskFilter === 'pending' ? 'bg-amber-500/20 text-amber-300 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isArabic ? 'معلقة' : 'Pending'} ({pendingTasks})
            </button>
            <button
              onClick={() => setTaskFilter('completed')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                taskFilter === 'completed' ? 'bg-emerald-500/20 text-emerald-300 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isArabic ? 'مكتملة' : 'Done'} ({completedTasks})
            </button>
          </div>
        </div>

        {/* Task Items List */}
        <div className="mt-4 space-y-2.5">
          {filteredTasks.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              {isArabic ? 'لا توجد مهام مطابقة في هذه الفئة.' : 'No tasks found matching this criteria.'}
            </div>
          ) : (
            filteredTasks.map((task) => {
              const engine = UNIFIED_ENGINES.find((e) => e.id === task.assignedEngineId) || UNIFIED_ENGINES[0];
              const cat = CATEGORY_LABELS[task.category] || CATEGORY_LABELS.general;
              const isDone = task.status === 'completed';

              return (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isDone 
                      ? 'bg-slate-950/60 border-slate-850 opacity-70' 
                      : 'bg-slate-950/90 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => onUpdateTaskStatus(task.id, isDone ? 'in_progress' : 'completed')}
                      className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                        isDone 
                          ? 'bg-emerald-500 border-emerald-500 text-slate-950' 
                          : 'border-slate-700 hover:border-cyan-400 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`font-semibold text-xs sm:text-sm ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                          {task.title}
                        </h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${
                          task.priority === 'high' 
                            ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30' 
                            : task.priority === 'medium'
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {task.priority === 'high' ? (isArabic ? 'أولوية قصوى' : 'High') : (isArabic ? 'أولوية عادية' : 'Normal')}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          {isArabic ? cat.ar : cat.en}
                        </span>
                      </div>

                      {task.description && (
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-1">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Engine attribution & Action link */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-850">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                        {engine.codename}
                      </span>
                    </div>

                    {task.linkedChatId && (
                      <button
                        onClick={() => onSelectConversation(task.linkedChatId!)}
                        className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
                        title={isArabic ? 'فتح المحادثة المرتبطة' : 'Open Linked Chat'}
                      >
                        <span>{isArabic ? 'عرض الجلسة' : 'Open Session'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-white mb-1">
              {isArabic ? 'إضافة مهمة جديدة لمنصة Sanad setri' : 'Create New Multi-Task'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {isArabic ? 'حدد المهمة والمحرك المتخصص المسؤول عنها وتصنيفها التلقائي.' : 'Define task, assigned engine and auto-category.'}
            </p>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">
                  {isArabic ? 'عنوان المهمة' : 'Task Title'}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={isArabic ? 'مثال: إعداد استراتيجية التخزين السحابي...' : 'e.g., Architect secure sync protocol'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">
                  {isArabic ? 'التفاصيل ونقاط التنفيذ' : 'Description'}
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder={isArabic ? 'وصف موجز للمخرجات المطلوبة...' : 'Deliverables description...'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 font-medium mb-1">
                    {isArabic ? 'المحرك المتخصص' : 'Assigned Engine'}
                  </label>
                  <select
                    value={selectedEngine}
                    onChange={(e) => setSelectedEngine(e.target.value as EngineId)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    {UNIFIED_ENGINES.map((e) => (
                      <option key={e.id} value={e.id}>
                        {isArabic ? e.nameAr : e.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 font-medium mb-1">
                    {isArabic ? 'الأولوية' : 'Priority'}
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="high">{isArabic ? 'عالية (High)' : 'High'}</option>
                    <option value="medium">{isArabic ? 'متوسطة (Medium)' : 'Medium'}</option>
                    <option value="low">{isArabic ? 'منخفضة (Low)' : 'Low'}</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md cursor-pointer"
                >
                  {isArabic ? 'حفظ المهمة' : 'Save Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
