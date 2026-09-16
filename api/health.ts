export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json({
    status: "ok",
    platform: "Sanad setri",
    version: "2.5.0",
    privacyShield: "active",
    encryptedSync: "enabled",
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
}
