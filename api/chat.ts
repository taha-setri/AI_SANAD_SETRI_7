import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { getSovereignResponse } from "../src/lib/sovereignEngine";
import { ENGINE_SYSTEM_PROMPTS, buildGeminiContents } from "../src/lib/geminiHistory";

// Fallback models in priority order
const RESILIENT_MODELS = ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.8-flash"];

const ENGINE_PROMPTS = ENGINE_SYSTEM_PROMPTS;

async function getRequestBody(req: any): Promise<any> {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string" && req.body.trim()) {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return new Promise<any>((resolve) => {
    let raw = "";
    req.on("data", (chunk: any) => {
      raw += chunk;
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
    req.on("error", () => resolve({}));
  });
}

export default async function handler(req: any, res: any) {
  // CORS & method check
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const startTime = Date.now();
  const body = await getRequestBody(req);
  const { message = "", engineId = "omni-horizon", conversationHistory = [], learnedMemories = [] } = body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "الرسالة مطلوبة (Message is required)" });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.AI_GATEWAY_API_KEY;

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
      const contents = buildGeminiContents(message, conversationHistory);

      let systemInstruction = engineConfig.systemPrompt;
      if (Array.isArray(learnedMemories) && learnedMemories.length > 0) {
        systemInstruction += `\n\n[بنك المعرفة والذاكرة التراكمية المستمرة المستفادة من المستخدم]:\n` + learnedMemories.map((m: any) => `- ${typeof m === 'string' ? m : m.content}`).join('\n');
      }

      const isPulse = engineId === "pulse-velocity";
      const thinkingLevel = isPulse ? ThinkingLevel.MINIMAL : ThinkingLevel.LOW;

      let replyText: string | null = null;
      let usedModel: string | null = null;

      for (const model of RESILIENT_MODELS) {
        try {
          const isGemini3 = model.startsWith("gemini-3");
          const config: any = {
            systemInstruction,
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
