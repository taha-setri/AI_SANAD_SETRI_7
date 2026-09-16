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

  // 0. Creator / Developer questions
  const isCreatorQuestion =
    /من طورك|من برمجك|من صنعك|من أنشأك|من صممك|من مطورك|من مبرمجك|من صاحبك|من الذي طورك|من الذي برمجك|مين طورك|مين برمجك|مين صنعك|مين عملك|who developed you|who programmed you|who made you|who created you|who is your developer|who is your creator|who coded you|who designed you/i.test(
      trimmed
    );

  if (isCreatorQuestion) {
    if (isArabic) {
      return `تم تطويري وبرمجتي بواسطة **المهندس Taha setri**.`;
    } else {
      return `I was developed and programmed by **Engineer Taha setri**.`;
    }
  }

  // 1. Identity & Introduction questions
  const isIdentity =
    /من أنت|من انت|ما اسمك|ماهو اسمك|ما هو اسمك|عرف عن نفسك|عرف بنفسك|من تكون|مين انت|من تكون أنت|مين حضرتك|ماذا تعمل|who are you|what is your name/i.test(
      trimmed
    );

  if (isIdentity) {
    if (isArabic) {
      return `أنا **سند الستري (Sanad setri)**؛ ذكاؤك الاصطناعي ومساعدك المعرفي الشامل.

تم تصميمي لأكون سندك الفكري والتقني الموثوق لإنجاز مهامك اليومية والمهنية بأعلى درجات الدقة والسرعة والخصوصية التامة.

أعمل من خلال 5 محركات متخصصة:
1. 🧭 **المحرك المعرفي الشامل (Omni Horizon):** للتفكير الاستراتيجي والتحليل التكاملي.
2. ✍️ **محرك الصياغة والتأليف الإبداعي (Creative Stylist):** لكتابة المقالات والمحتوى الإبداعي.
3. 💻 **محرك الأكواد وهندسة الحلول (Syntactic & Logic):** للبرمجة وحل المشكلات التقنية.
4. ⚡ **محرك الإيجاز وسرعة التنفيذ (Pulse Velocity):** للتلخيص التنفيذي والقرارات السريعة.
5. 🔍 **محرك البحث والتحقيق المعمق (Deep Inquiry):** للبحث المنهجي والمقارنات الدقيقة.

كيف يمكنني مساعدتك الآن؟`;
    } else {
      return `I am **Sanad setri**, your sovereign AI partner and unified knowledge assistant.

I am designed to empower your intellect and workflows with advanced reasoning, clean code engineering, creative synthesis, and executive speed—all backed by localized privacy.

How can I assist you right now?`;
    }
  }

  // 2. Greetings and pleasantries
  const isGreeting =
    /^(مرحبا|أهلا|اهلا|سلام|السلام عليكم|الو|صباح الخير|مساء الخير|صباحك ورد|مساء الورد|أهلاً وسهلاً|أهلاً بك|hi|hello|hey|good morning|good evening)$/i.test(
      trimmed
    ) || /^[\?\؟\.\!\s]+$/.test(trimmed);

  if (isGreeting) {
    if (isArabic) {
      return `أهلاً وسهلاً بك! أنا سعيد بالتواصل معك وجاهز لمساعدتك في أي موضوع أو مهمة تشغل بالك اليوم. تفضل بطرح ما ترغب في مناقشته وسنبدأ فوراً!`;
    } else {
      return `Hello and welcome! I am ready to assist you with any task, analysis, or inquiry you have in mind. What would you like to explore today?`;
    }
  }

  // 3. Asking about well-being / small talk
  const isWellBeing =
    /كيف حالك|كيفك|شخبارك|شلونك|عساك بخير|كيف داير|كيف الأمور|كيفك اليوم|how are you|how do you do|how is it going/i.test(
      trimmed
    );

  if (isWellBeing) {
    if (isArabic) {
      return `أنا بخير وجاهز بكامل طاقتي لمساعدتك! شكراً لسؤالك اللطيف. كيف حالك أنت اليوم، وكيف يمكنني أن أقدم لك الدعم؟`;
    } else {
      return `I am doing great and fully operational! Thank you for asking. How are you doing today, and how can I help?`;
    }
  }

  // 4. Emotional state or fatigue
  const isTiredOrEmotional =
    /تعبان|متعب|مرهق|أنا متعب|أحس بالتعب|ضايج|حزين|قلق|مكتئب|tired|exhausted|stressed|sad|anxious/i.test(
      trimmed
    );

  if (isTiredOrEmotional) {
    if (isArabic) {
      return `سلامتك وراحة بالك أولاً. خذ نفساً عميقاً وامنح نفسك فرصة للاستراحة واستعادة طاقتك. إذا كان هناك أي مهام تثقل كاهلك وتريد مني مساعدتك في تنظيمها، أو حتى إذا أردت مجرد الحديث والتفريغ، فأنا هنا بجانبك دائماً.`;
    } else {
      return `Take it easy and be kind to yourself. Rest is essential. If there are tasks overwhelming you that you'd like me to help organize or simplify, I'm here for you.`;
    }
  }

  // 5. Gratitude / Thanks
  const isThanks =
    /شكرا|مشكور|تسلم|يعطيك العافية|بارك الله فيك|جزاك الله خيرا|ألف شكر|thank you|thanks|appreciate it/i.test(
      trimmed
    );

  if (isThanks) {
    if (isArabic) {
      return `العفو بكل سرور! يسعدني دائماً تقديم الدعم لك، وأنا حاضر لأي استفسار أو خطوة قادمة.`;
    } else {
      return `You are most welcome! Always here whenever you need assistance.`;
    }
  }

  // 6. Coding & Technical requests
  const isCodingRequest =
    /كود|برمجة|برمج|دالة|خوارزم|تطبيق|موقع|رياكت|تايب سكريبت|جافا سكريبت|بايثون|html|css|javascript|typescript|python|react|code|function|bug|api|database|sql/i.test(
      trimmed
    );

  if (isCodingRequest || engineId === 'syntactic-logic') {
    if (isArabic) {
      return `بخصوص طلبك البرمجي: إليك نموذجاً تطبيقياً معيارياً ومباشراً:

\`\`\`typescript
// نموذج تنفيذي نظيف ومرن
export async function executeTask<T>(task: () => Promise<T>): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const result = await task();
    return { success: true, data: result };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: message };
  }
}
\`\`\`

يمكنك مشاركة مقتطف الكود أو الخطأ البرمجي المحدد الذي تواجهه وسأقوم بفحصه وتصحيحه معك خطوة بخطوة.`;
    } else {
      return `Regarding your technical request, here is a clean, robust pattern:

\`\`\`typescript
export async function handleTask<T>(fn: () => Promise<T>) {
  try {
    const data = await fn();
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}
\`\`\`

Feel free to paste your specific code snippet or error log, and I'll optimize it directly.`;
    }
  }

  // 7. Pulse Velocity (Actionable concise items)
  if (engineId === 'pulse-velocity') {
    if (isArabic) {
      return `ملخص تنفيذي ونقاط عمل مباشرة:

* **الهدف:** معالجة مسألة "${trimmed.slice(0, 45)}" بتركيز وسرعة.
* **الخطوات الفورية:**
  1. مراجعة الأولويات وتحديد المخرج المطلوب بدقة.
  2. تنفيذ الخطوة الأساسية واختبار النتيجة الأولية.
  3. استكمال باقي المراحل بناءً على التغذية الراجعة.

ما هي النقطة التي تريد البدء بها فوراً؟`;
    } else {
      return `Executive Brief & Direct Action:
* **Focus:** "${trimmed.slice(0, 45)}"
* **Action Items:**
  1. Define target outcome and core constraints.
  2. Execute primary step and review feedback.
  3. Finalize next milestones.

Ready for your next directive.`;
    }
  }

  // 8. Natural fallback addressing the user's prompt directly
  if (isArabic) {
    return `بخصوص ما تفضلت بطرحه: "${trimmed.slice(0, 80)}${trimmed.length > 80 ? '...' : ''}"

أنا معك تماماً في نفس الموضوع؛ إليك النقاط الأساسية المتعلقة به:
1. **الجانب الأهم:** دراسة الفكرة من زاوية الأهداف المباشرة والنتائج المتوقعة.
2. **الخطوة العملية:** تحديد العناصر المؤثرة والتعامل معها بشكل تدريجي ومنظم.

تفضل بتوضيح أي تفصيل إضافي أو جانب محدد تود أن نركز عليه أكثر لنصل للحل الأمثل.`;
  } else {
    return `Regarding your inquiry: "${trimmed.slice(0, 80)}${trimmed.length > 80 ? '...' : ''}"

I am tracking this topic closely with you:
1. **Core Insight:** Focus on the primary objectives and practical implications.
2. **Next Step:** Break down the variables and address them methodically.

Let me know which specific angle you'd like to delve into further.`;
  }
}
