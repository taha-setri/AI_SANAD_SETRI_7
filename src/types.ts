export type EngineId = 
  | 'omni-horizon'
  | 'creative-stylist'
  | 'syntactic-logic'
  | 'pulse-velocity'
  | 'deep-inquiry';

export type ContentCategory = 
  | 'code'
  | 'creative'
  | 'analysis'
  | 'summary'
  | 'research'
  | 'general';

export interface EngineConfig {
  id: EngineId;
  nameAr: string;
  nameEn: string;
  codename: string;
  roleAr: string;
  roleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string;
  color: string;
  badge: string;
  specialtyAr: string;
  specialtyEn: string;
  speed: string;
  temperature: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  engineId?: EngineId;
  timestamp: string;
  latencyMs?: number;
  estimatedTokens?: number;
  category?: ContentCategory;
  tags?: string[];
  isEncrypted?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  engineId: EngineId;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  category: ContentCategory;
  isEncrypted: boolean;
  pinned?: boolean;
  tags: string[];
}

export interface MultiTaskItem {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignedEngineId: EngineId;
  category: ContentCategory;
  createdAt: string;
  dueDate?: string;
  linkedChatId?: string;
  tags: string[];
}

export interface SearchResultItem {
  chatId: string;
  chatTitle: string;
  messageId: string;
  role: 'user' | 'assistant';
  content: string;
  engineId?: EngineId;
  timestamp: string;
  category: ContentCategory;
  matchedSnippet: string;
}

export interface PrivacyConfig {
  encryptionEnabled: boolean;
  vaultPassphraseSet: boolean;
  zeroTelemetry: boolean;
  autoPurgeDays: number; // 0 = never
  maskSensitiveData: boolean;
  syncStatus: 'synced' | 'syncing' | 'local_only' | 'error';
  lastSyncTime?: string;
  syncDeviceId: string;
}

export type ThemeName = 'midnight' | 'navy' | 'emerald' | 'paper';

export interface UserPreferences {
  language: 'ar' | 'en';
  theme: ThemeName;
  fontSize: 'sm' | 'base' | 'lg';
  layoutDensity: 'compact' | 'comfortable';
  autoCategorize: boolean;
  soundEffects: boolean;
}

export type BiomeCreatureMode = 'harmony' | 'koi' | 'flowers' | 'particles' | 'none';
export type BiomePace = 'calm' | 'balanced' | 'dynamic';
export type PlatformLogoStyle = 'vector' | 'artwork' | 'dual';

export interface VisionDisplayConfig {
  showAmbientBiome: boolean;
  biomeMode: BiomeCreatureMode;
  biomePace: BiomePace;
  showChromaticLight: boolean;
  showHologramRings: boolean;
  showEngineLogos: boolean;
  showSuggestionPrompts: boolean;
  showStatusPills: boolean;
  showDirectionalWatermarks: boolean;
  logoStyle: PlatformLogoStyle;
  customVisionSubtitle: string;
}

export type ActiveView = 
  | 'vision_search'
  | 'dashboard'
  | 'chat'
  | 'search'
  | 'analytics'
  | 'integrations'
  | 'settings'
  | 'founder_cockpit';

export interface CookiePreferences {
  essential: boolean; // Always true for local state
  analytics: boolean; // Strictly disabled (zero-telemetry)
  personalization: boolean;
  cloudSyncCache: boolean;
}

export interface LearnedMemoryItem {
  id: string;
  category: 'preference' | 'fact' | 'instruction' | 'concept';
  content: string;
  source?: string;
  timestamp: string;
  confidence: number;
}

