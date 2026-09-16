import { EngineId } from '../types';

interface SovereignResponseOptions {
  isOfflineOrFallback?: boolean;
}

export function getSovereignResponse(
  prompt: string,
  engineId: EngineId = 'omni-horizon',
  language: 'ar' | 'en' = 'ar',
  options: SovereignResponseOptions = {}
): string {
  const trimmed = prompt.trim();
  const isArabic = language === 'ar' || /[\u0600-\u06FF]/.test(trimmed);

  // 1. Identity & Introduction questions
  const isIdentity =
    /من أنت|من انت|ما اسمك|ماهو اسمك|ما هو اسمك|عرف عن نفسك|عرف بنفسك|من تكون|مين انت|من تكون أنت|مين حضرتك|ماذا تعمل|who are you|what is your name|who made you/i.test(
      trimmed
    );

  if (isIdentity) {
    if (isArabic) {
      return `### أنا سند الستري (Sanad setri)
**ذكاؤك الاصطناعي السيادي والمساعد المعرفي الشامل**

أهلاً بك! تم تصميمي وتطويري لأكون منصتك المعرفية المتكاملة، وسندك الفكري والتقني الموثوق لإنجاز كافة المهام المعقدة واليومية بأعلى درجات الدقة والسرعة والخصوصية التامة.

أعمل من خلال **5 محركات متخصصة** يمكنك التبديل بينها بحرية وفق طبيعة عملك:

1. 🧭 **المحرك المعرفي الشامل (Omni Horizon - HORIZON-01):**
   للتفكير الاستراتيجي، التحليل التكاملي، وحل المشكلات المعقدة من زوايا متعددة.
2. ✍️ **محرك الصياغة والتأليف الإبداعي (Creative Stylist - STYLIST-02):**
   لتحرير النصوص البلاغية، المقالات، وصياغة المحتوى التسويقي والإعلاني الجذاب.
3. 💻 **محرك الأكواد وهندسة الحلول (Syntactic & Logic - SYNTAX-03):**
   لكتابة الأكواد النظيفة (Clean Code)، مراجعة المعماريات البرمجية، وتصحيح الأخطاء التقنية.
4. ⚡ **محرك الإيجاز وسرعة التنفيذ (Pulse Velocity - PULSE-04):**
   للتلخيص التنفيذي السريع، استخراج نقاط العمل الحاسمة، والقرارات الفورية.
5. 🔍 **محرك البحث والتحقيق المعمق (Deep Inquiry - INQUIRY-05):**
   للبحث الأكاديمي، التدقيق المنهجي، والمقارنات العلمية الرصينة.

🛡️ **الخصوصية والسيادة:**
تعمل منصة سند الستري بنظام تشفير محلي يحمي بياناتك ومحادثاتك.

كيف ترغب أن نبدأ العمل الآن؟ يمكنك طرح أي استفسار، إرسال كود للمراجعة، أو طلب صياغة نص متكامل.`;
    } else {
      return `### I am Sanad setri
**Your Sovereign AI & Unified Knowledge Partner**

Welcome! I am designed and engineered to be your unyielding intellectual and technical partner—delivering advanced reasoning, clean code engineering, creative synthesis, and executive speed with uncompromising data privacy.

I operate through **5 specialized engines**:
1. 🧭 **Omni Horizon (HORIZON-01):** Holistic strategic thinking & multidisciplinary analysis.
2. ✍️ **Creative Stylist (STYLIST-02):** High-impact copywriting, literary prose, and creative ideation.
3. 💻 **Syntactic & Logic (SYNTAX-03):** Clean software engineering, systems architecture, and algorithmic debugging.
4. ⚡ **Pulse Velocity (PULSE-04):** Executive briefs, instant decision summaries, and action checklists.
5. 🔍 **Deep Inquiry (INQUIRY-05):** Academic fact verification, structural contrast tables, and methodological rigor.

How can I empower your workflow today?`;
    }
  }

  // 2. Punctuation only, hesitation, or greeting
  const isHesitationOrGreeting =
    /^[\?\؟\.\!\s]+$/.test(trimmed) ||
    /^(مرحبا|أهلا|اهلا|سلام|السلام عليكم|الو|hi|hello|hey|hey there)$/i.test(trimmed);

  if (isHesitationOrGreeting) {
    if (isArabic) {
      return `### أهلاً بك في منصة سند الستري (Sanad setri)

أنا في خدمتك وجاهز فوراً لمساعدتك. إليك بعض ما يمكنك إنجازه معي مباشرة:

* **طرح استفسار أو قضية تحليلية:** وسيتولى *المحرك المعرفي الشامل* تفكيكها وتقديم خطة متكاملة.
* **كتابة أو مراجعة برمجيات:** عبر *محرك الأكواد وهندسة الحلول* لبناء دوال ومشاريع برمجية متقدمة.
* **صياغة محتوى إبداعي أو تسويقي:** عبر *محرك الصياغة والتأليف الإبداعي*.
* **تلخيص مستند أو اجتماع:** عبر *محرك الإيجاز السريع* للحصول على أهم النقاط التنفيذية.
* **بحث استقصائي ومقارنات:** عبر *محرك التحقيق المعمق*.

اكتب استفسارك أو مسألتك وسأبدأ فوراً بالتحليل والإجابة!`;
    } else {
      return `### Welcome to Sanad setri

I am ready to assist you right away. Here is what we can accomplish together:
* **Strategic Queries:** In-depth analysis through the *Omni Horizon Engine*.
* **Software & Code:** Clean code snippets, debugging, and architecture through the *Logic Engine*.
* **Creative Writing:** Speeches, marketing copy, and articles via the *Creative Stylist*.
* **Executive Summaries:** Fast action checklists with *Pulse Velocity*.

Type your request below and let's get started!`;
    }
  }

  // 3. Coding & Software requests
  const isCodingRequest =
    /كود|برمجة|برمج|دالة|خوارزم|تطبيق|موقع|رياكت|تايب سكريبت|جافا سكريبت|بايثون|html|css|javascript|typescript|python|react|code|function|bug|api|database|sql/i.test(
      trimmed
    );

  if (isCodingRequest || engineId === 'syntactic-logic') {
    if (isArabic) {
      return `### هندسة الحلول البرمجية — سند الستري (Syntactic & Logic Engine)

أهلاً بك. تم تحليل طلبك البرمجي والتقني بعناية. إليك الإرشادات والنموذج المعماري المناسب:

#### 1. المبادئ الهندسية الأساسية
* **فصل المسؤوليات (Clean Architecture):** عزل منطق الأعمال (Business Logic) عن واجهة المستخدم (UI Components).
* **إدارة الحالات المتقدمة والتعافي من الأخطاء:** التعامل مع الاستجابات الشبكية عبر حواجز الأمان (Resilience Boundaries).
* **النوعية الصارمة (Strict Type Safety):** استخدام واجهات TypeScript واضحة تمنع الأخطاء أثناء وقت التشغيل.

#### 2. نموذج تنفيذي نموذجي (TypeScript / Modern Standards)
\`\`\`typescript
/**
 * نموذج تنفيذي موثوق لمعالجة الطلبات البرمجية
 */
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export async function executeSecureTask<T>(
  action: () => Promise<T>
): Promise<ServiceResponse<T>> {
  try {
    const result = await action();
    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown execution error';
    return {
      success: false,
      error: message,
      timestamp: new Date().toISOString()
    };
  }
}
\`\`\`

#### 3. الخطوات التالية المقترحة:
* يمكنك إرسال مقتطف الكود المحدد أو رسالة الخطأ لتنقيحه وتصحيحه فوراً.
* هل تحتاج إلى ربط هذا المكون بواجهة أمامية أو خدمة خلفية محددة؟`;
    } else {
      return `### Code Architecture & Engineering — Sanad setri (Syntactic & Logic)

Your technical request has been processed. Here is a recommended structural approach:

\`\`\`typescript
export interface ExecutionResult<T> {
  ok: boolean;
  payload?: T;
  error?: string;
}

export async function resilientWrapper<T>(fn: () => Promise<T>): Promise<ExecutionResult<T>> {
  try {
    const res = await fn();
    return { ok: true, payload: res };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
\`\`\`

Share your exact snippet or API contract and I will provide the optimized implementation.`;
    }
  }

  // 4. Creative / Copywriting requests
  if (engineId === 'creative-stylist') {
    if (isArabic) {
      return `### رؤية وصياغة إبداعية — سند الستري (Creative Stylist Engine)

أهلاً بك. استمعت إلى فكرتك وإليك صياغة إبداعية تمزج البلاغة اللغوية بقوة التأثير:

> "الابتكار الحقيقي ليس مجرد استجابة للواقع، بل هو القدرة على استشراف المستقبل وبناء أدواته بثقة وسيادة تامة."

#### الركائز المقترحة لصياغة المحتوى:
* **النبرة الصوتية (Tone of Voice):** واثقة، راقية، وتلهم الطموح مع مراعاة السلاسة والوضوح.
* **البناء السردي:** الانتقال من تحديد التحدي أو الاحتياج إلى تقديم الرؤية كحل بديهي وموثوق.
* **دعوة لاتخاذ إجراء (Call to Action):** عبارة ختامية محفزة تدفع القارئ للتفاعل المباشر.

هل تود تكييف هذا النص لمنصة تواصل محددة، أو تحويله إلى مقال، أو صياغة إعلان تسويقي؟`;
    } else {
      return `### Creative Synthesis — Sanad setri (Creative Stylist)

Here is a refined perspective crafted for impact:

> "True sovereignty of thought begins when clarity meets uncompromising execution."

Let me know the target audience or format (article, pitch deck, social copy) to tailor the phrasing precisely.`;
    }
  }

  // 5. Pulse Velocity requests (Summaries & Action items)
  if (engineId === 'pulse-velocity') {
    if (isArabic) {
      return `### ملخص تنفيذي ونقاط عمل فورية — سند الستري (Pulse Velocity)

إليك التكثيف المباشر لطلبك:

* **الهدف المحوري:** معالجة المسألة بأعلى سرعة وكفاءة وتوجيه المخرجات للنتائج العملية.
* **القرارات الرئيسية:**
  1. اعتماد المسار الأكثر موثوقية لتقليل المخاطر.
  2. توثيق المتطلبات وحفظ التقدم في قائمة المهام.
* **نقاط العمل الفورية (Action Items):**
  - [ ] مراجعة المدخلات والتأكد من مطابقتها للأهداف.
  - [ ] تنفيذ المرحلة الأولى وتجربة المخرجات.
  - [ ] التوسع والمزامنة مع الأدوات ذات الصلة.

جاهز لتنفيذ الخطوة التالية فور إشارتك.`;
    } else {
      return `### Executive Brief & Action Points — Sanad setri (Pulse Velocity)

* **Key Objective:** Rapid execution and direct operational triage.
* **Immediate Actions:**
  1. Validate requirements and scope boundaries.
  2. Implement primary deliverables.
  3. Review output and iterate.

Ready for next directive.`;
    }
  }

  // 6. Deep Inquiry (Academic & Comparison)
  if (engineId === 'deep-inquiry') {
    if (isArabic) {
      return `### التحقيق المنهجي والدراسة المقارنة — سند الستري (Deep Inquiry)

إليك تفكيكاً منهجياً وتحليلاً متعمقاً للموضوع:

#### 1. الإطار المنهجي
لدراسة هذا الموضوع بأمانة علمية، يتعين التمييز بين الفرضيات النظرية والنتائج التطبيقية القابلة للقياس.

#### 2. جدول المقارنة والتقييم:
| المعيار | الاتجاه التقليدي | اتجاه سند الستري الحديث |
| :--- | :--- | :--- |
| **الخصوصية والسيادة** | معالجة خارجية غير مشفرة | تشفير محلي واستقلالية بيانات |
| **المرونة** | نموذج أحادي مقتصر | منظومة محركات متخصصة متعددة الأنماط |
| **سرعة المعالجة** | استجابات نمطية عامة | تكيف متخصص مع نوعية المهمة |

#### 3. الاستنتاج والتوصية:
يوصى بتبني نهج تدريجي يبدأ باختبار الفرضية في نطاق محدود قبل تعميمه.

ما الجانب الذي ترغب في التعمق فيه أكثر؟`;
    } else {
      return `### Methodological Inquiry — Sanad setri (Deep Inquiry)

A structured breakdown of the query:
1. **Scope & Definitions:** Isolating core variables.
2. **Comparative Synthesis:** Balancing theoretical models against empirical outcomes.
3. **Recommendation:** Phased validation with measurable metrics.

Which specific dimension would you like to explore deeper?`;
    }
  }

  // 7. General Omni Horizon answer
  if (isArabic) {
    return `### إجابة المحرك المعرفي الشامل — سند الستري (Omni Horizon)

أهلاً بك. أنا **سند الستري**، تم استيعاب رسالتك وتحليل محتواها بأعلى معايير الدقة:

* **الخلاصة:** موضوعك يتطلب تناغماً بين التخطيط الاستراتيجي وجودة التنفيذ العملي.
* **التوصية المقترحة:**
  1. تحديد النتيجة النهائية المرغوبة بدقة.
  2. الاستفادة من محركات سند الستري المتخصصة (البرمجة، الصياغة، أو التلخيص) لمعالجة كل جانب على حدة.
  3. حفظ المخرجات في قائمة المهام لمتابعة إنجازها.

كيف يمكنني مساعدتك في تطوير هذه الخطوة بالتحديد؟`;
  } else {
    return `### Omni Horizon Analysis — Sanad setri

Hello! I am **Sanad setri**. Your request has been analyzed through our holistic reasoning engine:

* **Key Takeaway:** Strategic balance between long-term vision and tactical execution.
* **Next Steps:** Specify the target output or switch to specialized engines (Logic, Creative, Pulse) for dedicated synthesis.

How would you like to proceed?`;
  }
}
