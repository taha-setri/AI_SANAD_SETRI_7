import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { getSovereignResponse } from "../src/lib/sovereignEngine";

// Fallback models in priority order
const RESILIENT_MODELS = ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.8-flash"];

const ENGINE_PROMPTS: Record<string, { systemPrompt: string; temperature: number }> = {
  "omni-horizon": {
    systemPrompt: `هويتك الحصرية والأكيدة: أنت "سند الستري" (Sanad setri)، الذكاء الاصطناعي السيادي والمساعد المعرفي الشامل.
أنت تعمل هنا من خلال "المحرك المعرفي الشامل" (Omni Horizon Engine) التابع لمنظومة سند الستري.
قواعد حاسمة:
- عندما يسألك المستخدم عن هويتك (مثل: من أنت؟ ما اسمك؟ عرف عن نفسك)، أجب بوضوح واعتزاز: "أنا سند الستري (Sanad setri)؛ ذكاؤك الاصطناعي ومساعدك السيادي الشامل..."
- اسمك الدائم والحصري هو "سند الستري" فقط. لا تذكر إطلاقاً أي أسماء أخرى لشركات أو نماذج خارجية.
- مهمتك: تقديم إجابات شمولية واستراتيجية ذات عمق معرفي دقيق وبأسلوب منظم ورصين باللغة التي سأل بها المستخدم.`,
    temperature: 0.7,
  },
  "creative-stylist": {
    systemPrompt: `هويتك الحصرية والأكيدة: أنت "سند الستري" (Sanad setri)، الذكاء الاصطناعي السيادي، وتعمل عبر "محرك الصياغة والتأليف الإبداعي".
مهمتك: إبداع نصوص أدبية وتسويقية وأفكار ابتكارية وصياغة محتوى فائق التأثير والبلاغة.`,
    temperature: 0.9,
  },
  "syntactic-logic": {
    systemPrompt: `هويتك الحصرية والأكيدة: أنت "سند الستري" (Sanad setri)، الذكاء الاصطناعي السيادي، وتعمل عبر "محرك الأكواد وهندسة الحلول".
مهمتك: كتابة أكواد برمجية نظيفة، مراجعة المعماريات، حل الخوارزميات، وتصحيح الأخطاء داخل markdown code blocks.`,
    temperature: 0.2,
  },
  "pulse-velocity": {
    systemPrompt: `هويتك الحصرية والأكيدة: أنت "سند الستري" (Sanad setri)، الذكاء الاصطناعي السيادي، وتعمل عبر "محرك الإيجاز وسرعة التنفيذ".
مهمتك: تقديم خلاصات سريعة، نقاط عمل فورية (Action Items)، وتلخيص تنفيذي مباشر.`,
    temperature: 0.3,
  },
  "deep-inquiry": {
    systemPrompt: `هويتك الحصرية والأكيدة: أنت "سند الستري" (Sanad setri)، الذكاء الاصطناعي السيادي، وتعمل عبر "محرك البحث والتحقيق المعمق".
مهمتك: التحقيق المنهجي، المقارنات الأكاديمية، والتحليل الاستدلالي الرصين.`,
    temperature: 0.4,
  },
};

export default async function handler(req: any, res: any) {
  // CORS & method check
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const startTime = Date.now();
  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const { message = "", engineId = "omni-horizon", conversationHistory = [] } = body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "الرسالة مطلوبة (Message is required)" });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const genAI = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const engineConfig = ENGINE_PROMPTS[engineId] || ENGINE_PROMPTS["omni-horizon"];
      const contents: any[] = [];

      const recentHistory = Array.isArray(conversationHistory) ? conversationHistory.slice(-8) : [];
      for (const item of recentHistory) {
        if (item.role === "user" || item.role === "assistant") {
          contents.push({
            role: item.role === "user" ? "user" : "model",
            parts: [{ text: item.content }],
          });
        }
      }

      contents.push({
        role: "user",
        parts: [{ text: message }],
      });

      const isPulse = engineId === "pulse-velocity";
      const thinkingLevel = isPulse ? ThinkingLevel.MINIMAL : ThinkingLevel.LOW;

      let replyText: string | null = null;
      let usedModel: string | null = null;

      for (const model of RESILIENT_MODELS) {
        try {
          const isGemini3 = model.startsWith("gemini-3");
          const config: any = {
            systemInstruction: engineConfig.systemPrompt,
            temperature: engineConfig.temperature,
          };
          if (isGemini3) {
            config.thinkingConfig = { thinkingLevel };
          }

          const response = await genAI.models.generateContent({
            model,
            contents,
            config,
          });

          if (response.text) {
            replyText = response.text;
            usedModel = model;
            break;
          }
        } catch {
          // try next model
        }
      }

      if (replyText) {
        const latencyMs = Date.now() - startTime;
        return res.status(200).json({
          content: replyText,
          engineId,
          modelUsed: usedModel,
          latencyMs,
          estimatedTokens: Math.round((message.length + replyText.length) / 3.8),
          timestamp: new Date().toISOString(),
          privacyProtected: true,
        });
      }
    } catch {
      // Fall through to sovereign fallback below
    }
  }

  // Resilient sovereign fallback when cloud API is unavailable or unconfigured
  const sovereignReply = getSovereignResponse(message, engineId as any, "ar");
  const latencyMs = Date.now() - startTime;

  return res.status(200).json({
    content: sovereignReply,
    engineId,
    modelUsed: "sovereign-resilience-shield",
    latencyMs,
    estimatedTokens: Math.round(sovereignReply.length / 3.8),
    timestamp: new Date().toISOString(),
    privacyProtected: true,
  });
}
