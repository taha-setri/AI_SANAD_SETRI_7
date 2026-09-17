import { LearnedMemoryItem } from '../types';

const STORAGE_KEY = 'sanad_learned_memory_v1';

// Initial base sovereign knowledge facts
const DEFAULT_MEMORIES: LearnedMemoryItem[] = [
  {
    id: 'mem-core-developer',
    category: 'fact',
    content: 'المطور والمبرمج والمبتكر الحصري هو المهندس Taha setri (طه الستري).',
    source: 'system_core',
    timestamp: '2026-09-17T00:00:00.000Z',
    confidence: 1.0,
  },
  {
    id: 'mem-core-identity',
    category: 'concept',
    content: 'الاسم الحصري هو سند الستري (Sanad setri)، الذكاء الاصطناعي السيادي الشامل ذو الخصوصية المطلقة.',
    source: 'system_core',
    timestamp: '2026-09-17T00:00:00.000Z',
    confidence: 1.0,
  },
  {
    id: 'mem-core-capability',
    category: 'instruction',
    content: 'الإجابة على أي سؤال يطرحه المستخدم مهما كان مجاله (علمي، تقني، تاريخي، ديني، فلسفي، لغوي، إبداعي) بدقة وشمولية.',
    source: 'system_core',
    timestamp: '2026-09-17T00:00:00.000Z',
    confidence: 1.0,
  },
];

export function getLearnedMemories(): LearnedMemoryItem[] {
  if (typeof window === 'undefined') return DEFAULT_MEMORIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MEMORIES));
      return DEFAULT_MEMORIES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_MEMORIES;
  } catch {
    return DEFAULT_MEMORIES;
  }
}

export function saveLearnedMemory(
  content: string,
  category: 'preference' | 'fact' | 'instruction' | 'concept' = 'fact',
  source = 'user_conversation'
): LearnedMemoryItem {
  const clean = content.trim();
  const memories = getLearnedMemories();

  // Avoid duplicates
  const existing = memories.find(
    (m) => m.content.toLowerCase().trim() === clean.toLowerCase()
  );
  if (existing) {
    return existing;
  }

  const newItem: LearnedMemoryItem = {
    id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    category,
    content: clean,
    source,
    timestamp: new Date().toISOString(),
    confidence: 0.95,
  };

  const updated = [newItem, ...memories];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save learned memory:', e);
  }

  return newItem;
}

export function deleteLearnedMemory(id: string): void {
  const memories = getLearnedMemories();
  const filtered = memories.filter((m) => m.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to delete learned memory:', e);
  }
}

export function clearAllLearnedMemories(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MEMORIES));
  } catch (e) {
    console.error('Failed to clear learned memories:', e);
  }
}

/**
 * Intelligent detector: extracts explicit and implicit learning directives from user text
 */
export function extractLearningsFromMessage(userText: string): LearnedMemoryItem | null {
  const clean = userText.trim();
  if (clean.length < 5) return null;

  // Patterns for learning directives in Arabic and English
  const rememberPattern =
    /(?:تذكر أن|تذكر ان|تذكر|احفظ أن|احفظ ان|احفظ عندك|احفظ|تعلّم أن|تعلم أن|تعلّم|تعلم|قاعدتي هي|أنا أفضّل|أنا أفضل|أحب أن|أريدك أن تتذكر|اعلم أن|اعلم ان|قاعدتنا|remember that|remember|learn that|please remember|always remember|keep in mind that)\s*[:،,-]?\s*(.+)/i;

  const match = clean.match(rememberPattern);
  if (match && match[1] && match[1].trim().length > 3) {
    const memoryContent = match[1].trim();
    return saveLearnedMemory(memoryContent, 'instruction', 'user_explicit_command');
  }

  // Identity / personal fact teaching
  const userFactPattern =
    /(?:اسمي هو|اسمي|أنا أعمل كـ|أنا أعمل في|أنا مطور|أنا مهندس|مشروعي هو|تخصصي هو|بلدي هو|مدينتي هي|my name is|i work as|my project is)\s*[:،,-]?\s*(.+)/i;

  const factMatch = clean.match(userFactPattern);
  if (factMatch && factMatch[1] && factMatch[1].trim().length > 2) {
    return saveLearnedMemory(clean, 'preference', 'user_personal_fact');
  }

  return null;
}

/**
 * Format memories for injection into Gemini prompt or system instructions
 */
export function formatMemoriesForPrompt(): string {
  const memories = getLearnedMemories();
  if (!memories || memories.length === 0) return '';

  const list = memories
    .slice(0, 15) // Top 15 memories for prompt efficiency
    .map((m) => `- ${m.content}`)
    .join('\n');

  return `[بنك المعرفة والذاكرة التراكمية المستمرة المستفادة من المستخدم]:\n${list}`;
}
