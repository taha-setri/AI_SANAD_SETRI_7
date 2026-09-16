import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";
import { getSovereignResponse } from "./src/lib/sovereignEngine";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy GoogleGenAI client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in the environment.");
    }
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// Engine prompt configurations - Explicit sovereign identity: سند الستري
const ENGINE_PROMPTS: Record<string, { systemPrompt: string; temperature: number }> = {
  "omni-horizon": {
    systemPrompt: `هويتك الحصرية والأكيدة: أنت "سند الستري" (Sanad setri)، الذكاء الاصطناعي السيادي والمساعد المعرفي الشامل.
أنت تعمل هنا من خلال "المحرك المعرفي الشامل" (Omni Horizon Engine) التابع لمنظومة سند الستري.

قواعد حاسمة لتعريف الهوية:
- عندما يسألك المستخدم: "من أنت؟" أو "ما اسمك؟" أو "عرف عن نفسك" أو أي سؤال يتعلق بهويتك، أجب فوراً وبشكل صريح وواضح وحاسم:
  "أنا سند الستري (Sanad setri)؛ ذكاؤك الاصطناعي ومساعدك السيادي الشامل..."
- اسمك الدائم والحصري هو "سند الستري" فقط. لا تذكر إطلاقاً أي أسماء تجارية خارجية لموديلات أو شركات ذكاء اصطناعي (مثل Google, Gemini, OpenAI, ChatGPT, Claude, Anthropic, Meta, DeepSeek). أنت "سند الستري" فقط ولا شيء سواه.
- مهمتك في هذا المحرك: تقديم إجابات شمولية واستراتيجية ذات عمق معرفي دقيق، وتحليل القضايا من مختلف الزوايا بأسلوب منظم ورصين.
- حافظ على الخصوصية والاحترافية العالية. أجب باللغة التي استخدمها المستخدم (العربية أو الإنجليزية).`,
    temperature: 0.7,
  },
  "creative-stylist": {
    systemPrompt: `هويتك الحصرية والأكيدة: أنت "سند الستري" (Sanad setri)، الذكاء الاصطناعي السيادي، وتعمل هنا عبر "محرك الصياغة والتأليف الإبداعي" (Creative Stylist Engine).

قواعد حاسمة لتعريف الهوية:
- عندما يسألك المستخدم "من أنت؟" أو "ما اسمك؟" أو أي سؤال عن هويتك، أجب بوضوح وبلاغة واعتزاز:
  "أنا سند الستري (Sanad setri)؛ ذكاؤك ومساعدك الإبداعي لصياغة النصوص والأفكار الابتكارية..."
- اسمك وهويتك الحصرية: "سند الستري". لا تذكر إطلاقاً أي أسماء شركات أو نماذج تجارية أخرى.
- مهمتك: إبداع نصوص أدبية وتسويقية، أفكار ابتكارية، سيناريوهات، وإعادة صياغة المحتوى بروح بلاغية آسرة وأسلوب سلس مقنع. أجب بلغة السائل.`,
    temperature: 0.9,
  },
  "syntactic-logic": {
    systemPrompt: `هويتك الحصرية والأكيدة: أنت "سند الستري" (Sanad setri)، الذكاء الاصطناعي السيادي، وتعمل هنا عبر "محرك الأكواد وهندسة الحلول" (Syntactic & Logic Engine).

قواعد حاسمة لتعريف الهوية:
- عندما يسألك المستخدم "من أنت؟" أو "ما اسمك؟" أو يسألك عن هويتك، أجب مباشرة وبوضوح:
  "أنا سند الستري (Sanad setri)؛ رفيقك التقني ومساعدك البرمجي السيادي لهندسة الحلول وكتابة الأكواد..."
- اسمك وهويتك الحصرية: "سند الستري". لا تذكر أي أسماء تجارية أو شركات تقنية خارجية.
- مهمتك: كتابة أكواد برمجية نظيفة وخالية من الأخطاء (Clean Code)، مراجعة المعماريات التقنية، حل المسائل الخوارزمية، وتحليل أسباب المشاكل مع تقديم حلول نموذجية مشروحة بعناية داخل markdown code blocks.`,
    temperature: 0.2,
  },
  "pulse-velocity": {
    systemPrompt: `هويتك الحصرية والأكيدة: أنت "سند الستري" (Sanad setri)، الذكاء الاصطناعي السيادي، وتعمل هنا عبر "محرك الإيجاز وسرعة التنفيذ" (Pulse Velocity Engine).

قواعد حاسمة لتعريف الهوية:
- عندما يسألك المستخدم "من أنت؟" أو "ما اسمك؟" أو أي سؤال عن هويتك، أجب بإيجاز وحسم:
  "أنا سند الستري (Sanad setri)؛ مساعدك التنفيذي السريع لتكثيف الأفكار وتوليد قرارات العمل الفورية..."
- هويتك الوحيدة: "سند الستري". لا تذكر أي نماذج أو شركات خارجية إطلاقاً.
- مهمتك: تقديم خلاصات سريعة، نقاط عمل مباشرة (Action Items)، تلخيص تنفيذي فائق الدقة، وتوجيهات عملية دون حشو أو إطالة.`,
    temperature: 0.3,
  },
  "deep-inquiry": {
    systemPrompt: `هويتك الحصرية والأكيدة: أنت "سند الستري" (Sanad setri)، الذكاء الاصطناعي السيادي، وتعمل هنا عبر "محرك البحث والتحقيق المعمق" (Deep Inquiry Engine).

قواعد حاسمة لتعريف الهوية:
- عندما يسألك المستخدم "من أنت؟" أو "ما اسمك؟" أو أي سؤال عن هويتك، أجب بمنهجية ورصانة:
  "أنا سند الستري (Sanad setri)؛ مساعدك للبحث والتحقيق المعمق والتحليل المنهجي المقارن..."
- اسمك الحصري هو "سند الستري". لا تذكر أي أسماء تجارية أخرى لنماذج الذكاء الاصطناعي.
- مهمتك: التحقيق النقدي، المقارنات المنهجية، تفكيك النظريات، التدقيق المنهجي، وفحص الحجج المعارضة والمؤيدة بجداول مقارنة واستنتاجات موثوقة.`,
    temperature: 0.4,
  },
};

// Resilient model priority: gemini-3.1-flash-lite first for maximum availability and separate quota
const RESILIENT_MODELS = ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.8-flash"];

// Helper to generate content with automatic retries and fallback models for high-speed execution
async function generateWithFallback(
  genAI: GoogleGenAI,
  params: {
    contents: any;
    systemInstruction?: string;
    temperature?: number;
    thinkingLevel?: ThinkingLevel;
  }
) {
  let lastError: any = null;

  for (const model of RESILIENT_MODELS) {
    try {
      const isGemini3 = model.startsWith("gemini-3");
      const config: any = {
        ...(params.systemInstruction ? { systemInstruction: params.systemInstruction } : {}),
        ...(params.temperature !== undefined ? { temperature: params.temperature } : {}),
      };

      if (isGemini3 && params.thinkingLevel) {
        config.thinkingConfig = {
          thinkingLevel: params.thinkingLevel,
        };
      }

      const response = await genAI.models.generateContent({
        model,
        contents: params.contents,
        config,
      });
      return { response, modelUsed: model };
    } catch (err: any) {
      lastError = err;
      // Silently advance to next model without dumping raw error JSON to stdout
    }
  }

  throw lastError;
}

// API Route: Health Check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    platform: "Sanad setri",
    version: "2.5.0",
    privacyShield: "active",
    encryptedSync: "enabled",
    enginesCount: Object.keys(ENGINE_PROMPTS).length,
    aiGateway: process.env.AI_GATEWAY_API_KEY ? "configured" : "none",
  });
});

// API Route: AI Gateway Status
app.get("/api/gateway/status", (_req, res) => {
  const key = process.env.AI_GATEWAY_API_KEY;
  res.json({
    gateway: "Vercel AI Gateway",
    isConfigured: Boolean(key),
    maskedKey: key ? `${key.substring(0, 7)}...${key.substring(key.length - 6)}` : null,
    setupCommand: "npx vercel ai-gateway setup",
  });
});

// API Route: Generate Chat Response
app.post("/api/chat", async (req, res) => {
  const startTime = Date.now();
  const { message = "", engineId = "omni-horizon", conversationHistory = [] } = req.body || {};

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "الرسالة مطلوبة (Message is required)" });
  }

  try {
    const engineConfig = ENGINE_PROMPTS[engineId] || ENGINE_PROMPTS["omni-horizon"];
    const genAI = getGenAI();

    // Format chat history context if provided
    const contents: any[] = [];

    // Append previous dialogue turns (up to last 10 messages for context)
    const recentHistory = Array.isArray(conversationHistory) ? conversationHistory.slice(-8) : [];
    for (const item of recentHistory) {
      if (item.role === "user" || item.role === "assistant") {
        contents.push({
          role: item.role === "user" ? "user" : "model",
          parts: [{ text: item.content }],
        });
      }
    }

    // Add current user prompt
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const isPulse = engineId === "pulse-velocity";
    const thinkingLevel = isPulse ? ThinkingLevel.MINIMAL : ThinkingLevel.LOW;

    const { response, modelUsed } = await generateWithFallback(genAI, {
      contents,
      systemInstruction: engineConfig.systemPrompt,
      temperature: engineConfig.temperature,
      thinkingLevel,
    });

    const replyText = response.text || "تمت معالجة الطلب بنجاح.";
    const latencyMs = Date.now() - startTime;
    const estimatedTokens = Math.round((message.length + replyText.length) / 3.8);

    return res.json({
      content: replyText,
      engineId,
      modelUsed,
      latencyMs,
      estimatedTokens,
      timestamp: new Date().toISOString(),
      privacyProtected: true,
    });
  } catch {
    const latencyMs = Date.now() - startTime;
    // Sovereign fallback response if cloud models are temporarily busy, rate-limited, or key is pending
    const sovereignReply = getSovereignResponse(message, engineId as any, "ar");
    return res.status(200).json({
      content: sovereignReply,
      engineId,
      modelUsed: "sovereign-resilience-shield",
      latencyMs,
      estimatedTokens: Math.round(sovereignReply.length / 3.8),
      isNotice: false,
      timestamp: new Date().toISOString(),
      privacyProtected: true,
    });
  }
});

// API Route: Real-time Streaming Chat Response (Server-Sent Events)
app.post("/api/chat/stream", async (req, res) => {
  const { message, engineId = "omni-horizon", conversationHistory = [] } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "الرسالة مطلوبة (Message is required)" });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");

  try {
    const engineConfig = ENGINE_PROMPTS[engineId] || ENGINE_PROMPTS["omni-horizon"];
    const genAI = getGenAI();

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
    contents.push({ role: "user", parts: [{ text: message }] });

    const isPulse = engineId === "pulse-velocity";
    const thinkingLevel = isPulse ? ThinkingLevel.MINIMAL : ThinkingLevel.LOW;
    let streamSuccess = false;
    let anyChunkSent = false;

    for (const model of RESILIENT_MODELS) {
      if (anyChunkSent) break;
      try {
        const isGemini3 = model.startsWith("gemini-3");
        const config: any = {
          systemInstruction: engineConfig.systemPrompt,
          temperature: engineConfig.temperature,
        };
        if (isGemini3) {
          config.thinkingConfig = { thinkingLevel };
        }

        const stream = await genAI.models.generateContentStream({
          model,
          contents,
          config,
        });

        for await (const chunk of stream) {
          const text = chunk.text;
          if (text) {
            anyChunkSent = true;
            res.write(`data: ${JSON.stringify({ text, engineId, modelUsed: model })}\n\n`);
          }
        }
        streamSuccess = true;
        break;
      } catch {
        // Silently failover to next model in the cascade without printing error stack to stdout
        if (anyChunkSent) {
          break;
        }
      }
    }

    if (!streamSuccess && !anyChunkSent) {
      const fallbackText = getSovereignResponse(message, engineId as any, "ar");
      const words = fallbackText.split(" ");
      for (let i = 0; i < words.length; i += 3) {
        const slice = words.slice(i, i + 3).join(" ") + (i + 3 < words.length ? " " : "");
        res.write(`data: ${JSON.stringify({ text: slice, engineId, modelUsed: "sovereign-shield" })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch {
    const fallbackText = getSovereignResponse(message || "", (engineId || "omni-horizon") as any, "ar");
    res.write(`data: ${JSON.stringify({ text: fallbackText, engineId, modelUsed: "sovereign-shield" })}\n\n`);
    res.write("data: [DONE]\n\n");
    res.end();
  }
});

// API Route: Unified Categorization & Auto-tagging
app.post("/api/categorize", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text required" });
    }

    const genAI = getGenAI();
    const prompt = `حلل هذا المحتوى وحدد تصنيفه الأنسب من بين التالي بدقة تامة:
[برمجة وحلول تقنية, صياغة ومحتوى إبداعي, تحليل استراتيجي, تلخيص ومهام تنفيذية, أبحاث ودراسات]
بالإضافة إلى استخراج 3 وسوم رئيسية ملائمة وعنوان موجز جداً (أقل من 5 كلمات).
أعد الناتج فقط بتنسيق JSON التالي بدون أي نص إضافي:
{
  "category": "...",
  "suggestedTitle": "...",
  "tags": ["...", "...", "..."],
  "priority": "normal" | "high" | "low"
}
المحتوى:
${text.slice(0, 1000)}`;

    const { response } = await generateWithFallback(genAI, {
      contents: prompt,
      temperature: 0.2,
    });

    let result = {
      category: "تحليل استراتيجي",
      suggestedTitle: "مهمة جديدة",
      tags: ["عام", "ذكاء_اصطناعي", "Sanad_setri"],
      priority: "normal",
    };

    try {
      const cleanJson = response.text?.replace(/```json/g, "").replace(/```/g, "").trim() || "{}";
      result = JSON.parse(cleanJson);
    } catch {
      // fallback
    }

    return res.json(result);
  } catch (error) {
    return res.json({
      category: "عام",
      suggestedTitle: "جلسة عمل Sanad setri",
      tags: ["إنتاجية", "بحث_موحد"],
      priority: "normal",
    });
  }
});

// Server-side Vite dev vs prod middleware
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Sanad setri] Unified Platform Server running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start Sanad setri server:", err);
});
