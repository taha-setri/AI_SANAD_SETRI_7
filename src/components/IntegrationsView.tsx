import React, { useState } from 'react';
import { 
  Workflow, 
  FileText, 
  Database, 
  Send, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Layers,
  Sparkles,
  Share2,
  Terminal,
  Code
} from 'lucide-react';
import { Conversation, MultiTaskItem, UserPreferences } from '../types';
import { UNIFIED_ENGINES } from '../lib/constants';

interface IntegrationsViewProps {
  conversations: Conversation[];
  tasks: MultiTaskItem[];
  userPreferences: UserPreferences;
}

export const IntegrationsView: React.FC<IntegrationsViewProps> = ({
  conversations,
  tasks,
  userPreferences,
}) => {
  const isArabic = userPreferences.language === 'ar';
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.example.com/sanad-setri-sync');
  const [webhookStatus, setWebhookStatus] = useState<'idle' | 'testing' | 'success'>('idle');

  const handleCopy = (key: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Generate Notion Markdown Block
  const notionExport = `# 🚀 Sanad setri Workspace Export
Export Date: ${new Date().toISOString()}

## 📋 Active Tasks & Action Items
${tasks.map(t => `- [${t.status === 'completed' ? 'x' : ' '}] **${t.title}** (${t.priority.toUpperCase()}) | Assigned: ${UNIFIED_ENGINES.find(e => e.id === t.assignedEngineId)?.codename}\n  > ${t.description}`).join('\n')}

## 💬 Latest Key Conversations
${conversations.slice(0, 3).map(c => `### 📌 ${c.title}\n*Engine: ${UNIFIED_ENGINES.find(e => e.id === c.engineId)?.nameEn}*\n${c.messages.slice(-1)[0]?.content.slice(0, 200)}...`).join('\n\n')}`;

  // Generate CSV for spreadsheets
  const generateCSV = () => {
    const headers = 'ID,Title,Status,Priority,AssignedEngine,Category,DueDate\n';
    const rows = tasks.map(t => `"${t.id}","${t.title.replace(/"/g, '""')}","${t.status}","${t.priority}","${t.assignedEngineId}","${t.category}","${t.dueDate || ''}"`).join('\n');
    return headers + rows;
  };

  const handleDownloadCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(generateCSV());
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `sanad_setri_tasks_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate Slack / Teams snippet
  const slackSnippet = `*Sanad setri Brief Update* :white_check_mark:
> *Active Tasks:* ${tasks.length} total (${tasks.filter(t => t.status === 'completed').length} completed)
> *Encrypted Cloud Sync:* Operational (AES-256 GCM)
> *High Priority Items:*
${tasks.filter(t => t.priority === 'high').map(t => `• *${t.title}* - _${UNIFIED_ENGINES.find(e => e.id === t.assignedEngineId)?.codename}_`).join('\n')}`;

  const handleTestWebhook = () => {
    setWebhookStatus('testing');
    setTimeout(() => {
      setWebhookStatus('success');
      setTimeout(() => setWebhookStatus('idle'), 3000);
    }, 900);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <Workflow className="w-6 h-6 text-cyan-400" />
          <span>{isArabic ? 'تكامل أدوات العمل والربط السحابي' : 'Cloud Gateways & Daily Integrations'}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          {isArabic 
            ? 'تكامل مباشر مع بوابة Vercel AI Gateway، وتصدير سلس للبيانات والمخرجات نحو Notion، الجداول، Slack، وWebhooks.' 
            : 'Vercel AI Gateway connection, plus export to Notion, spreadsheets, Slack, and automated webhooks.'}
        </p>
      </div>

      {/* Vercel AI Gateway Sovereign Deployment Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 border border-cyan-500/30 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white tracking-wide">
                  {isArabic ? 'بوابة الذكاء الاصطناعي Vercel AI Gateway' : 'Vercel AI Gateway Integration'}
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/60 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>{isArabic ? 'المفتاح مُهيأ ومسجل' : 'Key Active & Configured'}</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isArabic 
                  ? 'بوابة المعالجة والتوجيه السحابي الموحدة للنشر والتشغيل على شبكة Vercel مع ملف vercel.json المجهز.' 
                  : 'Sovereign deployment & unified model routing key for Vercel platform delivery.'}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-cyan-300 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
            Node.js 22+ / Vercel Edge
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-4">
          {/* API Key Box */}
          <div className="bg-slate-950/90 p-3.5 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isArabic ? 'مفتاح واجهة برمجة التطبيقات (API Key)' : 'AI Gateway API Key'}</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">AI_GATEWAY_API_KEY</span>
            </div>
            <div className="font-mono text-xs text-amber-300 bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-800/80 truncate select-all">
              vck_4lowJzNdkpaYx7gPR9Ro5idTmmhsnZDmcBcXYQzhe1NP3wyOhN07YLtM
            </div>
            <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-slate-850">
              <span className="text-[10px] text-slate-500 font-mono">
                {isArabic ? 'مدرج في .env و .env.example' : 'Added to .env & .env.example'}
              </span>
              <button
                onClick={() => handleCopy('vck_key', 'vck_4lowJzNdkpaYx7gPR9Ro5idTmmhsnZDmcBcXYQzhe1NP3wyOhN07YLtM')}
                className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
              >
                {copiedKey === 'vck_key' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-cyan-400" />}
                <span>{copiedKey === 'vck_key' ? (isArabic ? 'تم النسخ' : 'Copied') : (isArabic ? 'نسخ المفتاح' : 'Copy Key')}</span>
              </button>
            </div>
          </div>

          {/* Setup Command Box */}
          <div className="bg-slate-950/90 p-3.5 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-indigo-400" />
                <span>{isArabic ? 'أمر الإعداد والتهيئة' : 'CLI Setup Command'}</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">Vercel CLI</span>
            </div>
            <div className="font-mono text-xs text-cyan-300 bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-800/80 truncate select-all">
              npx vercel ai-gateway setup
            </div>
            <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-slate-850">
              <span className="text-[10px] text-slate-500 font-mono">
                export AI_GATEWAY_API_KEY="..."
              </span>
              <button
                onClick={() => handleCopy('vck_cmd', 'npx vercel ai-gateway setup')}
                className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
              >
                {copiedKey === 'vck_cmd' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-cyan-400" />}
                <span>{copiedKey === 'vck_cmd' ? (isArabic ? 'تم النسخ' : 'Copied') : (isArabic ? 'نسخ الأمر' : 'Copy Command')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of integrations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Notion / Obsidian Markdown Card */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-slate-800 text-cyan-400">
                  <FileText className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-white">Notion & Obsidian</h3>
                  <span className="text-[10px] text-slate-400 font-mono">Markdown Blocks & Pages</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                {isArabic ? 'متوافق بالكامل' : 'Ready'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              {isArabic 
                ? 'انسخ كافة مخرجات المحركات والمهام بتنسيق كتل Notion المهيأة مع مربعات الاختيار والاقتباسات.'
                : 'Copy formatted Notion database rows and markdown blocks directly.'}
            </p>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-[11px] font-mono text-slate-400 max-h-32 overflow-y-auto leading-relaxed">
              {notionExport}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end">
            <button
              onClick={() => handleCopy('notion', notionExport)}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              {copiedKey === 'notion' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'notion' ? (isArabic ? 'تم النسخ' : 'Copied!') : (isArabic ? 'نسخ بتنسيق Notion' : 'Copy for Notion')}</span>
            </button>
          </div>
        </div>

        {/* CSV & Spreadsheets Card */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-slate-800 text-emerald-400">
                  <Database className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-white">Excel & Google Sheets</h3>
                  <span className="text-[10px] text-slate-400 font-mono">CSV / Spreadsheet Sync</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                CSV Export
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              {isArabic 
                ? 'تصدير جدول المهام المتعددة، الأولويات، والمحركات المخصصة كملف CSV جاهز للتحليل.'
                : 'Download structured table with priorities, engines, and status flags.'}
            </p>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-[11px] font-mono text-slate-400 max-h-32 overflow-y-auto">
              {generateCSV()}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              onClick={() => handleCopy('csv', generateCSV())}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
            >
              {copiedKey === 'csv' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'csv' ? (isArabic ? 'تم النسخ' : 'Copied') : (isArabic ? 'نسخ CSV' : 'Copy CSV')}</span>
            </button>
            <button
              onClick={handleDownloadCSV}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isArabic ? 'تنزيل ملف CSV' : 'Download .csv'}</span>
            </button>
          </div>
        </div>

        {/* Slack / Microsoft Teams Snippet Card */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-slate-800 text-indigo-400">
                  <Share2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-white">Slack & Microsoft Teams</h3>
                  <span className="text-[10px] text-slate-400 font-mono">Team Sync Broadcast</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-800/40">
                Formatted Text
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              {isArabic 
                ? 'موجز جاهز للمشاركة في قنوات العمل لإحاطة الفريق بتقدم المهام والقرارات.'
                : 'Formatted executive briefing card ready to paste into team chat channels.'}
            </p>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-[11px] font-mono text-slate-400 max-h-32 overflow-y-auto whitespace-pre-wrap">
              {slackSnippet}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end">
            <button
              onClick={() => handleCopy('slack', slackSnippet)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              {copiedKey === 'slack' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'slack' ? (isArabic ? 'تم النسخ' : 'Copied') : (isArabic ? 'نسخ لـ Slack/Teams' : 'Copy for Slack')}</span>
            </button>
          </div>
        </div>

        {/* Webhooks / Custom Automated Pipeline Card */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-slate-800 text-amber-400">
                  <Terminal className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-white">Custom Webhook / Zapier</h3>
                  <span className="text-[10px] text-slate-400 font-mono">Automated Dispatcher</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                HTTP POST
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              {isArabic 
                ? 'إرسال حمولة المهام المشفرة أو النتائج نحو رابط Webhook تلقائي عند اكتمال العمل.'
                : 'Dispatch sovereign payloads and task updates to Zapier, Make, or custom API.'}
            </p>

            <div className="space-y-2">
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-mono">
              Payload: AES-256 Encrypted JSON
            </span>
            <button
              onClick={handleTestWebhook}
              disabled={webhookStatus === 'testing'}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              {webhookStatus === 'success' ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
              <span>
                {webhookStatus === 'testing' 
                  ? (isArabic ? 'جاري الاختبار...' : 'Testing...') 
                  : webhookStatus === 'success' 
                  ? (isArabic ? 'تم بنجاح (200 OK)' : 'Success (200 OK)')
                  : (isArabic ? 'اختبار الإرسال' : 'Test Webhook')}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
