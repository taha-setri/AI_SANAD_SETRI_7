import { EngineConfig, Conversation, MultiTaskItem } from '../types';

export const UNIFIED_ENGINES: EngineConfig[] = [
  {
    id: 'omni-horizon',
    nameAr: 'المحرك المعرفي الشامل',
    nameEn: 'Omni Horizon Engine',
    codename: 'HORIZON-01',
    roleAr: 'التفكير الاستراتيجي والتحليل التكاملي متعدد الأبعاد',
    roleEn: 'Holistic Strategic Reasoning & Multidisciplinary Synthesis',
    descriptionAr: 'محرك متوازن فائق الذكاء مصمم لمعالجة المشكلات المعقدة، التخطيط الاستراتيجي، وتقديم حلول شاملة.',
    descriptionEn: 'Balanced intelligence engineered for complex problem solving, strategic vision, and holistic solutions.',
    icon: 'Compass',
    color: 'emerald',
    badge: 'معرفي استراتيجي',
    specialtyAr: 'التخطيط، الاستراتيجيات، والتحليل المنطقي المتعدد',
    specialtyEn: 'Strategy, Planning & Multimodal Synthesis',
    speed: 'دقة وتوازن فائق',
    temperature: 0.7,
  },
  {
    id: 'creative-stylist',
    nameAr: 'محرك الصياغة والتأليف الإبداعي',
    nameEn: 'Creative Stylist Engine',
    codename: 'STYLIST-02',
    roleAr: 'الكتابة الاحترافية، السرد البلاغي، وصناعة المحتوى الجذاب',
    roleEn: 'High-Impact Copywriting, Creative Storytelling & Eloquence',
    descriptionAr: 'محرك لغوي متقدم متخصص في إثراء المحتوى التسويقي، المقالات الأدبية، الخطابات، والأفكار الابتكارية.',
    descriptionEn: 'Advanced stylistic engine specialized in marketing copy, persuasive prose, speeches, and ideation.',
    icon: 'Sparkles',
    color: 'amber',
    badge: 'صياغة وإبداع',
    specialtyAr: 'المقالات، المحتوى الإعلاني، والرواية وسرد القصص',
    specialtyEn: 'Copywriting, Literary Essays & Campaign Pitches',
    speed: 'مرونة وإبداع سريع',
    temperature: 0.9,
  },
  {
    id: 'syntactic-logic',
    nameAr: 'محرك الأكواد وهندسة الحلول',
    nameEn: 'Logic & Code Engineering Engine',
    codename: 'SYNTAX-03',
    roleAr: 'هندسة البرمجيات، حل الخوارزميات، وتصحيح الأخطاء البرمجية',
    roleEn: 'Clean Software Engineering, Algorithms & Systems Architecture',
    descriptionAr: 'محرك برمجي متخصص في كتابة كود نظيف، مراجعة البنى المعمارية، حل الثغرات، وبناء خطط تقنية تفصيلية.',
    descriptionEn: 'Rigorous engineering engine focused on robust clean code, architectural patterns, and debugging.',
    icon: 'Terminal',
    color: 'blue',
    badge: 'برمجة وهندسة نظم',
    specialtyAr: 'كتابة الأكواد، فحص الثغرات، والأنظمة السحابية',
    specialtyEn: 'Clean Code, Fullstack Architecture & Bug Triage',
    speed: 'دقة برمجية صارمة',
    temperature: 0.2,
  },
  {
    id: 'pulse-velocity',
    nameAr: 'محرك الإيجاز وسرعة التنفيذ',
    nameEn: 'Pulse Velocity Engine',
    codename: 'PULSE-04',
    roleAr: 'التلخيص التنفيذي الفوري واستخراج نقاط العمل الحاسمة',
    roleEn: 'Ultra-Fast Executive Briefs & Direct Action Items',
    descriptionAr: 'محرك عالي الاستجابة يُركّز على تحويل المستندات والبيانات الكبيرة إلى نقاط قرار فورية وموجزة.',
    descriptionEn: 'High-velocity synthesizer turning long documents and discussions into crystal-clear action items.',
    icon: 'Zap',
    color: 'rose',
    badge: 'تلخيص فوري',
    specialtyAr: 'خلاصات الاجتماعات، التوجيهات السريعة، والقرارات',
    specialtyEn: 'Executive Summaries, Quick Bullet Briefs & Triage',
    speed: 'سرعة فائقة',
    temperature: 0.3,
  },
  {
    id: 'deep-inquiry',
    nameAr: 'محرك البحث والتحقيق المعمق',
    nameEn: 'Deep Inquiry Engine',
    codename: 'INQUIRY-05',
    roleAr: 'البحث المنهجي، التدقيق النقدي، والمقارنات الاستدلالية',
    roleEn: 'Deep Methodological Research, Fact Verification & Contrast Analysis',
    descriptionAr: 'محرك أكاديمي تحليلي يبحث في أبعاد الظواهر، ويقدم مقارنات منهجية وجداول تحليلية مدعومة بالحجج.',
    descriptionEn: 'Academic-grade engine providing structural contrast tables, counter-arguments, and deep literature breakdown.',
    icon: 'SearchCheck',
    color: 'purple',
    badge: 'بحث وتقصي',
    specialtyAr: 'الدراسات، المقارنات، وفحص الفرضيات العلمية',
    specialtyEn: 'Comparative Studies, Methodological Audits & Fact-Checking',
    speed: 'تحليل استقصائي عميق',
    temperature: 0.4,
  },
];

export const CATEGORY_LABELS: Record<string, { ar: string; en: string; color: string }> = {
  code: { ar: 'برمجة وحلول تقنية', en: 'Code & Technology', color: 'blue' },
  creative: { ar: 'صياغة وإبداع', en: 'Creative & Content', color: 'amber' },
  analysis: { ar: 'تحليل استراتيجي', en: 'Strategic Analysis', color: 'emerald' },
  summary: { ar: 'تلخيص ومهام تنفيذية', en: 'Executive Summary', color: 'rose' },
  research: { ar: 'أبحاث ودراسات', en: 'Research & Inquiry', color: 'purple' },
  general: { ar: 'عام وإنتاجية', en: 'General Productivity', color: 'slate' },
};

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    title: 'معمارية نظام التخزين المشفر متعدد الأجهزة',
    engineId: 'syntactic-logic',
    category: 'code',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    isEncrypted: true,
    pinned: true,
    tags: ['أمان', 'تشفير', 'WebCrypto', 'TypeScript'],
    messages: [
      {
        id: 'm-1-1',
        role: 'user',
        content: 'كيف يمكننا تطبيق نظام مزامنة سحابي مشفر يعتمد على معيار AES-GCM 256 مع اشتقاق المفتاح عبر PBKDF2 لحماية محادثات المستخدم التامة؟',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        id: 'm-1-2',
        role: 'assistant',
        engineId: 'syntactic-logic',
        content: `لضمان الخصوصية التامة (Zero-Knowledge Architecture) داخل منصة **Sanad setri**، نقوم بالتشفير من طرف العميل (Client-Side Encryption) قبل إرسال أي بايت عبر الشبكة:

### 1. خطوات اشتقاق المفتاح والتشفير:
1. توليد **Salt** عشوائي بطول 16 بايت لكل جهاز أو خزنة.
2. استخدام خوارزمية **PBKDF2** بـ 100,000 دورة تكرار مع دالة **SHA-256**.
3. توليد متجه تهيئة **Initialization Vector (IV)** عشوائي بطول 12 بايت لكل عملية تشفير منفردة.
4. التشفير باستخدام **AES-GCM 256-bit** الذي يوفر سرية البيانات والتحقق من صحتها في آنٍ واحد.

\`\`\`typescript
// مثال تطبيقي في Sanad setri
async function deriveEncryptionKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}
\`\`\`

هذا النمط يضمن أنه حتى لو تم اعتراض البيانات السحابية، لا يمكن لأي طرف قراءتها دون مفتاح فك التشفير الخاص بالمستخدم.`,
        latencyMs: 820,
        estimatedTokens: 410,
        timestamp: new Date(Date.now() - 3600000 * 23.9).toISOString(),
        category: 'code',
      },
    ],
  },
  {
    id: 'conv-3',
    title: 'خلاصة تنفيذية لنتائج مراجعة أداء الربع الثالث',
    engineId: 'pulse-velocity',
    category: 'summary',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 11).toISOString(),
    isEncrypted: false,
    tags: ['أعمال', 'أداء', 'خلاصة_تنفيذية'],
    messages: [
      {
        id: 'm-3-1',
        role: 'user',
        content: 'لخص نتائج أداء الربع الثالث في 4 نقاط عمل فورية لفرق العمليات والتطوير.',
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
      {
        id: 'm-3-2',
        role: 'assistant',
        engineId: 'pulse-velocity',
        content: `### الخلاصة التنفيذية السريعة (Q3 Velocity Brief):

1. **تقليص زمن الاستجابة بنسبة 34%:** نجح التحول للمحركات الموجهة في رفع سرعة تسليم المهام البرمجية.
2. **الاعتماد على البحث الموحد:** تم توفير 4.2 ساعة أسبوعياً لكل باحث بفضل التصنيف التلقائي للأرشيف.
3. **أولويات التحسين:** إتمام المزامنة السحابية المشفرة عبر الهواتف قبل نهاية الشهر.
4. **قرار تنفيذي فوري:** توحيد قوالب العمل اليومية وربطها بمصدر التصدير (Markdown / Notion).`,
        latencyMs: 430,
        estimatedTokens: 190,
        timestamp: new Date(Date.now() - 3600000 * 11.9).toISOString(),
        category: 'summary',
      },
    ],
  },
  {
    id: 'conv-4',
    title: 'دراسة مقارنة بين أنظمة الفهرسة الدلالية والبصرية',
    engineId: 'deep-inquiry',
    category: 'research',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 70).toISOString(),
    isEncrypted: false,
    tags: ['أبحاث', 'فهرسة', 'ذكاء_اصطناعي', 'بيانات'],
    messages: [
      {
        id: 'm-4-1',
        role: 'user',
        content: 'قدم تحليلاً منهجياً يقارن بين الفهرسة القائمة على المتجهات الدلالية (Vector Embeddings) والفهرسة الهيكلية المعجمية في محركات البحث الموحدة.',
        timestamp: new Date(Date.now() - 3600000 * 72).toISOString(),
      },
      {
        id: 'm-4-2',
        role: 'assistant',
        engineId: 'deep-inquiry',
        content: `### التحقيق المنهجي: الفهرسة الدلالية الهجينة في منصة Sanad setri

| معيار المقارنة | الفهرسة المتجهية الدلالية | الفهرسة الهيكلية المعجمية | النموذج الهجين المعتمد |
| :--- | :--- | :--- | :--- |
| **فهم المعنى والسياق** | مرتفع جداً (يفهم المترادفات) | ضعيف (يعتمد على تطابق الكلمات) | تكاملي فائق الدقة |
| **سرعة الاسترجاع** | متوسطة (تتطلب حساب أبعاد) | فائقة السرعة (< 5ms) | استعلام مرحلي متسلسل |
| **كفاءة حفظ الخصوصية** | تتطلب تخزين متجهات مشفرة | سهلة التشفير والبحث المعمى | أمان طرفي معزول بالكامل |

**الخلاصة المنهجية:**
التكامل الهجين يمنح المستخدم أفضل تجربة بحث موحد، حيث يجد المحتوى الدقيق حتى مع اختلاف صيغ السؤال.`,
        latencyMs: 1100,
        estimatedTokens: 490,
        timestamp: new Date(Date.now() - 3600000 * 71.8).toISOString(),
        category: 'research',
      },
    ],
  },
];

export const INITIAL_TASKS: MultiTaskItem[] = [
  {
    id: 'task-1',
    title: 'توليد خطة التوزيع السحابي المشفر',
    description: 'استخدام محرك الأكواد لصياغة استراتيجية التخزين الطرفي AES-GCM للمستخدمين المتنقلين.',
    status: 'in_progress',
    priority: 'high',
    assignedEngineId: 'syntactic-logic',
    category: 'code',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    dueDate: '2026-09-15',
    linkedChatId: 'conv-1',
    tags: ['أمان', 'تشفير', 'معمارية'],
  },
  {
    id: 'task-2',
    title: 'إعداد الدليل التعريفي الشامل لمنصة Sanad setri',
    description: 'صياغة دليل مستخدم أنيق يوضح كيفية التبديل الفوري بين المحركات والاستفادة من البحث الموحد.',
    status: 'pending',
    priority: 'medium',
    assignedEngineId: 'creative-stylist',
    category: 'creative',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    dueDate: '2026-09-18',
    linkedChatId: 'conv-1',
    tags: ['توثيق', 'دليل', 'محتوى'],
  },
  {
    id: 'task-3',
    title: 'تلخيص تقرير التوافقية ومعايير الخصوصية',
    description: 'استخلاص أهم معايير الأمان والخصوصية في نقطتين عمل مركزتين لرفعها إلى الإدارة.',
    status: 'completed',
    priority: 'high',
    assignedEngineId: 'pulse-velocity',
    category: 'summary',
    createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    dueDate: '2026-09-10',
    linkedChatId: 'conv-3',
    tags: ['امتثال', 'أمان', 'قرارات'],
  },
  {
    id: 'task-4',
    title: 'مقارنة نماذج الفهرسة متعددة المحركات',
    description: 'تحليل دقيق لأداء البحث الموحد عند الربط بين 5 محركات تخصصية في وقت واحد.',
    status: 'completed',
    priority: 'low',
    assignedEngineId: 'deep-inquiry',
    category: 'research',
    createdAt: new Date(Date.now() - 3600000 * 60).toISOString(),
    dueDate: '2026-09-08',
    linkedChatId: 'conv-4',
    tags: ['بحث', 'معايير'],
  },
];
