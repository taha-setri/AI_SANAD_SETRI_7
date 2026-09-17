import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { getSovereignResponse } from "../src/lib/sovereignEngine";
import { ENGINE_SYSTEM_PROMPTS, buildGeminiContents } from "../src/lib/geminiHistory";

const RESILIENT_MODELS = ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.8-flash"];
const ENGINE_PROMPTS = ENGINE_SYSTEM_PROMPTS;

export default async function handler(req: any, res: any) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const { message = "", engineId = "omni-horizon", conversationHistory = [] } = body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "الرسالة مطلوبة (Message is required)" });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");

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
      const contents = buildGeminiContents(message, conversationHistory);
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
          if (anyChunkSent) break;
        }
      }

      if (streamSuccess || anyChunkSent) {
        res.write("data: [DONE]\n\n");
        return res.end();
      }
    } catch {
      // Fall through to fallback
    }
  }

  const fallbackText = getSovereignResponse(message, engineId as any, "ar");
  const words = fallbackText.split(" ");
  for (let i = 0; i < words.length; i += 3) {
    const slice = words.slice(i, i + 3).join(" ") + (i + 3 < words.length ? " " : "");
    res.write(`data: ${JSON.stringify({ text: slice, engineId, modelUsed: "sovereign-resilience-shield" })}\n\n`);
  }
  res.write("data: [DONE]\n\n");
  res.end();
}
