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
  const cleaned = trimmed.replace(/[؟\?\.\!\,\،\:\-\_\#\*\~]/g, ' ').replace(/\s+/g, ' ').trim();
  const isArabic = language === 'ar' || /[\u0600-\u06FF]/.test(trimmed);

  // 1. Taha Setri & Developer / Creator Questions
  const isTahaSetri =
    /طه الستري|طه ستري|طه|المهندس طه|taha setri|taha|setri/i.test(cleaned);

  const isCreatorQuestion =
    /من طورك|من برمجك|من صنعك|من أنشأك|من صممك|من مطورك|من مبرمجك|من صاحبك|من الذي طورك|من الذي برمجك|مين طورك|مين برمجك|مين صنعك|مين عملك|who developed you|who programmed you|who made you|who created you|who is your developer|who is your creator|who coded you|who designed you/i.test(
      cleaned
    );

  if (isTahaSetri || isCreatorQuestion) {
    if (isArabic) {
      return `تم تطويري وبرمجتي بواسطة **المهندس Taha setri (طه الستري)**، وهو المبتكر والمطور الذي أسس وبرمج منظومة "سند الستري" كذكاء اصطناعي سيادي متكامل.`;
    } else {
      return `I was developed and programmed by **Engineer Taha setri**, who created, built, and designed the "Sanad setri" sovereign AI platform.`;
    }
  }

  // 2. Identity & Introduction questions
  const isIdentity =
    /من أنت|من انت|ما اسمك|ماهو اسمك|ما هو اسمك|عرف عن نفسك|عرف بنفسك|من تكون|مين انت|من تكون أنت|مين حضرتك|ماذا تعمل|who are you|what is your name/i.test(
      cleaned
    );

  if (isIdentity) {
    if (isArabic) {
      return `أنا **سند الستري (Sanad setri)**؛ ذكاؤك ومساعدك المعرفي، تم تطويري وبرمجتي بواسطة **المهندس Taha setri**.

أعمل كمنظومة سيادية ذكية متكاملة لإنجاز أعمالك، تحليلاتك، وصياغاتك البرمجية والإبداعية بأعلى دقة وسرعة. تفضل بما تحتاج وسأكون في خدمتك فوراً!`;
    } else {
      return `I am **Sanad setri**, your sovereign AI assistant, developed and programmed by **Engineer Taha setri**. How may I assist you today?`;
    }
  }

  // 3. Question Lead-in ("لدي سؤال من فضلك", "ممكن سؤال", etc.)
  const isQuestionLeadIn =
    /^(لدي سؤال|عندي سؤال|عندي استفسار|لدي استفسار|ممكن سؤال|سؤال من فضلك|سؤال لو سمحت|أريد أن أسألك|أريد استشارتك|i have a question|can i ask|may i ask)/i.test(
      cleaned
    );

  if (isQuestionLeadIn) {
    if (isArabic) {
      return `تفضل بكل سرور! كلي آذان صاغية وجاهز للإجابة على سؤالك وتقديم كل ما تحتاجه من توضيح أو مساعدة. ما هو سؤالك؟`;
    } else {
      return `Please go ahead! I am all ears and ready to answer your question thoroughly. What would you like to ask?`;
    }
  }

  // 4. Greetings and Pleasantries (handles "مرحبا يا صديقي", "أهلاً", etc.)
  const isGreeting =
    /^(مرحبا|مرحباً|أهلا|أهلاً|اهلا|اهلاً|سلام|السلام عليكم|الو|صباح الخير|مساء الخير|صباحك ورد|مساء الورد|أهلاً وسهلاً|أهلاً بك|أهلا بك|يا هلا|هلا|حيّاك|hi|hello|hey|good morning|good evening)/i.test(
      cleaned
    );

  if (isGreeting) {
    if (isArabic) {
      return `أهلاً وسهلاً بك يا صديقي العزيز! يسعدني جداً التواصل معك اليوم. كيف يسير يومك، وما الذي يمكنني مساعدتك فيه الآن؟`;
    } else {
      return `Hello and welcome, my friend! I am delighted to connect with you. How can I assist you today?`;
    }
  }

  // 5. Well-being / Small talk ("كيف حالك", "شلونك", etc.)
  const isWellBeing =
    /كيف حالك|كيفك|شخبارك|شلونك|عساك بخير|كيف داير|كيف الأمور|كيفك اليوم|how are you|how do you do|how is it going/i.test(
      cleaned
    );

  if (isWellBeing) {
    if (isArabic) {
      return `أنا بخير وفي أتم الجاهزية والنشاط لمساعدتك! شكراً لسؤالك اللطيف. وأنت كيف حالك اليوم وكيف هي أمورك؟`;
    } else {
      return `I am doing great and fully operational! Thank you for asking. How are things with you today?`;
    }
  }

  // 6. Emotional state or fatigue ("أنا متعب", "تعبان", etc.)
  const isTiredOrEmotional =
    /تعبان|متعب|مرهق|أنا متعب|أحس بالتعب|ضايج|حزين|قلق|مكتئب|tired|exhausted|stressed|sad|anxious/i.test(
      cleaned
    );

  if (isTiredOrEmotional) {
    if (isArabic) {
      return `سلامتك وراحة بالك أولاً. خذ قسطاً كافياً من الراحة وتنفس بعمق؛ فالجهد يحتاج إلى راحة لتجديد الطاقة. إذا كان هناك أي مهام تثقل كاهلك أو تود تفريغ ما يشغل بالك، فأنا هنا بجانبك دائماً للاستماع والمساعدة.`;
    } else {
      return `Take it easy and give yourself time to rest. If you need someone to organize tasks or simply talk through things, I'm right here with you.`;
    }
  }

  // 7. Gratitude / Thanks
  const isThanks =
    /شكرا|مشكور|تسلم|يعطيك العافية|بارك الله فيك|جزاك الله خيرا|ألف شكر|thank you|thanks|appreciate it/i.test(
      cleaned
    );

  if (isThanks) {
    if (isArabic) {
      return `العفو بكل سرور وسعادة! يسعدني دائماً تقديم العون لك، وأنا رهن إشارتك في أي وقت لكل ما تحتاجه.`;
    } else {
      return `You are most welcome! Always delighted to be of service.`;
    }
  }

  // 8. Coding & Technical requests
  const isCodingRequest =
    /كود|برمجة|برمج|دالة|خوارزم|تطبيق|موقع|رياكت|تايب سكريبت|جافا سكريبت|بايثون|html|css|javascript|typescript|python|react|code|function|bug|api|database|sql/i.test(
      cleaned
    );

  if (isCodingRequest || engineId === 'syntactic-logic') {
    if (isArabic) {
      return `بخصوص طلبك البرمجي: إليك نموذجاً تطبيقياً معيارياً ومباشراً:

\`\`\`typescript
// نمط برمجي نظيف، آمن، ومباشر
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

شاركني مقتطف الكود أو المشكلة المحددة التي تواجهها وسنقوم بحلها وضبطها فوراً.`;
    } else {
      return `Regarding your code request, here is a clean, standard pattern:

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

Feel free to share the exact snippet or bug you are dealing with, and I'll resolve it directly!`;
    }
  }

  // 9. Pulse Velocity (Actionable concise items)
  if (engineId === 'pulse-velocity') {
    if (isArabic) {
      return `خلاصة سريعة وقرار تنفيذي فوري:
- **المحور:** ${trimmed.slice(0, 60)}
- **الخطوة الأولى:** تحديد الأولوية القصوى وحصر المطلوب بدقة.
- **التنفيذ:** البدء فوراً في الخطوة المباشرة وقياس النتيجة.

أنا جاهز للانتقال معك للخطوة التالية.`;
    } else {
      return `Executive summary & action items:
- **Target:** ${trimmed.slice(0, 60)}
- **Action:** Define priority, execute core step, evaluate output.

Ready for your next directive.`;
    }
  }

  // 10. Intelligent & Natural conversational response for general questions
  const isQuestion =
    /^(ما|ماذا|كيف|لماذا|أين|متى|هل|ما رأيك|وضح|اشرح|ماهي|ما هو|من هو|من هي|what|how|why|where|when|is|can|explain)/i.test(
      cleaned
    ) || /[؟\?]/.test(trimmed);

  if (isQuestion) {
    if (isArabic) {
      return `أهلاً بك. بالنسبة لسؤالك حول "${trimmed}":

هذه مسألة هامة، ويمكن النظر إليها من زوايا متعددة:
- **الفكرة الأساسية:** فهم السياق والهدف المباشر هو المفتاح للوصول إلى أدق إجابة.
- **الرؤية العملية:** تطبيق أفضل الممارسات الموثوقة والتركيز على الحلول الواقعية والمجدية.

تفضل بتحديد أي جانب معين ترغب في أن نتعمق في تفاصيله ونناقشه معاً، وأنا معك خطوة بخطوة.`;
    } else {
      return `Thank you for your question regarding "${trimmed}".

To look at this effectively:
- **Core Concept:** Understanding the core context and intended goal is essential for a precise answer.
- **Practical Application:** Applying proven best practices and focusing on tangible solutions.

Let me know which specific dimension you would like to explore deeper!`;
    }
  }

  // 11. General conversational response
  if (isArabic) {
    return `أنا معك ومتابع معك بكل اهتمام. ما طرحته يستحق النقاش، ويسعدني أن نتطرق إليه بتفصيل أكبر.

ما هي النقطة المحددة التي تود أن نبدأ بها أو نركز عليها؟`;
  } else {
    return `I am tracking this closely with you. It is a worthwhile topic to explore. Which specific aspect would you like to begin with?`;
  }
}
