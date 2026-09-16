export default async function handler(req: any, res: any) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const text = (body.text || "").toLowerCase();

  let category = "تحليل استراتيجي";
  const tags = ["Sanad_setri", "إنتاجية"];

  if (/كود|برمج|دالة|function|react|typescript|python|api|bug/i.test(text)) {
    category = "برمجة وحلول تقنية";
    tags.push("برمجة", "تقنية");
  } else if (/مقال|إعلان|صياغة|شعر|قصة|أدب|تسويق/i.test(text)) {
    category = "صياغة ومحتوى إبداعي";
    tags.push("إبداع", "محتوى");
  } else if (/ملخص|سريع|موجز|نقاط|اجتماع|مهام/i.test(text)) {
    category = "تلخيص ومهام تنفيذية";
    tags.push("تنفيذي", "مهام");
  } else if (/بحث|مقارنة|دراسة|تحقيق|أكاديمي/i.test(text)) {
    category = "أبحاث ودراسات";
    tags.push("بحث", "دراسة");
  }

  return res.status(200).json({
    category,
    suggestedTitle: text.slice(0, 30) || "جلسة عمل جديدة",
    tags,
    priority: "normal",
  });
}
