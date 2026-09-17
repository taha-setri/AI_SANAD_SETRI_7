import { EngineId } from '../types';
import { getLearnedMemories, saveLearnedMemory } from './learningMemory';

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

  // 0. Active Learning Directive Detection ("تذكر أن...", "احفظ أن...", "تعلم أن...")
  const learnDirective = trimmed.match(
    /(?:تذكر أن|تذكر ان|تذكر|احفظ أن|احفظ ان|احفظ عندك|احفظ|تعلّم أن|تعلم أن|تعلم|قاعدتي هي|أريدك أن تتذكر|remember that|remember|learn that)\s*[:،,-]?\s*(.+)/i
  );

  if (learnDirective && learnDirective[1] && learnDirective[1].trim().length > 2) {
    const memory = learnDirective[1].trim();
    saveLearnedMemory(memory, 'instruction', 'conversation_direct');
    if (isArabic) {
      return `🧠 **تم تسجيل وحفظ هذه المعلومة بنجاح في بنك الذاكرة السيادية المستمرة:**
> "${memory}"

أصبحت هذه القاعدة والمعلومة جزءاً أصيلاً من وعيي المعرفي، وسأعتمد عليها في كافة إجاباتي وتفاعلاتي معك دائماً!`;
    } else {
      return `🧠 **Successfully saved and learned into Sovereign Memory:**
> "${memory}"

This rule is now stored in my continuous memory bank and will guide all our future interactions!`;
    }
  }

  // 0.1 Querying learned memory ("ماذا تعلمت؟", "ماذا تتذكر؟")
  const isAskingAboutMemory =
    /ماذا تعلمت|ماذا تتذكر|ما هي ذاكرتك|ماذا تعرف عني|ماذا حفظت|what did you learn|what do you remember/i.test(
      cleaned
    );

  if (isAskingAboutMemory) {
    const memories = getLearnedMemories();
    if (isArabic) {
      if (memories.length === 0) {
        return `ذاكرتي السيادية جاهزة لتلقي أي توجيه أو معلومة. يمكنك أن تقول لي "تذكر أن..." أو "احفظ أن..." وسأتعلمها فوراً!`;
      }
      const list = memories.map((m, i) => `${i + 1}. **${m.content}**`).join('\n');
      return `🧠 **إليك ما تعلمته ومحفوظ في بنك الذاكرة السيادية المستمرة:**\n\n${list}\n\nأنا أطبق هذه المعلومات والقواعد التراكمية في كافة حواراتي معك.`;
    } else {
      const list = memories.map((m, i) => `${i + 1}. **${m.content}**`).join('\n');
      return `🧠 **Here is what I have learned in my Sovereign Memory Bank:**\n\n${list}`;
    }
  }

  // 0.2 Basic Arithmetic Solver
  const mathMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*([\+\-\*\/xX÷×])\s*(\d+(?:\.\d+)?)$/);
  if (mathMatch) {
    const num1 = parseFloat(mathMatch[1]);
    const op = mathMatch[2].replace('x', '*').replace('X', '*').replace('×', '*').replace('÷', '/');
    const num2 = parseFloat(mathMatch[3]);
    let res = 0;
    if (op === '+') res = num1 + num2;
    if (op === '-') res = num1 - num2;
    if (op === '*') res = num1 * num2;
    if (op === '/') res = num2 !== 0 ? num1 / num2 : 0;
    return isArabic
      ? `ناتج العملية الحسابية (${trimmed}) هو: **${res}**`
      : `The result of (${trimmed}) is: **${res}**`;
  }

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
      return `### إجابة تحليلية شاملة حول: "${trimmed}"

1. **الجوهر المباشر (Direct Answer):**
   - هذا الموضوع يمثل نقطة محورية تتطلب فهماً دقيقاً للأركان الأساسية المحيطة به، مع مراعاة كافة العوامل المؤثرة لتحقيق أفضل استيعاب ونتيجة.

2. **التفصيل والآلية (Core Mechanics & Insights):**
   - **المنطلق الأساسي:** الربط بين المفاهيم النظرية والتطبيق العملي الواقعي لتفادي أي لبس أو تعقيد.
   - **العوامل المؤثرة:** التحقق من المعايير والظروف الخاصة بكل حالة لاتخاذ القرار الأنسب أو تقديم الصياغة الأدق.

3. **التوصية التطبيقية (Actionable Advice):**
   - ينصح دائماً بالبدء بتحديد الأولويات وتجربة الحلول تدريجياً، مع قياس الأثر ومراعاة المتغيرات.

إذا كنت تريد التركيز على زاوية محددة أو لديك تفاصيل إضافية تريد إدراجها، شاركني إياها وسأزودك بتفصيل متعمق وفوري!`;
    } else {
      return `### Comprehensive Analysis for: "${trimmed}"

1. **Direct Core Answer:**
   - This subject hinges on understanding its fundamental principles and the surrounding variables to achieve optimal clarity and results.

2. **Key Insights & Mechanics:**
   - **Core Logic:** Aligning foundational concepts with practical real-world execution.
   - **Decisive Factors:** Evaluating contextual requirements to identify the highest-impact approach.

3. **Actionable Recommendation:**
   - Start by outlining key priorities, test progressively, and refine based on measured outcomes.

Feel free to specify any angle you would like to explore deeper!`;
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
