import { Conversation, MultiTaskItem, PrivacyConfig, UserPreferences, VisionDisplayConfig } from '../types';
import { INITIAL_CONVERSATIONS, INITIAL_TASKS } from './constants';

const STORAGE_KEYS = {
  CONVERSATIONS: 'sanad_setri_conversations',
  TASKS: 'sanad_setri_tasks',
  PRIVACY: 'sanad_setri_privacy_config',
  PREFERENCES: 'sanad_setri_preferences',
  VAULT_KEY: 'sanad_setri_vault_key_hash',
  VISION_CONFIG: 'sanad_setri_vision_config',
};

export const DEFAULT_VISION_CONFIG: VisionDisplayConfig = {
  showAmbientBiome: true,
  biomeMode: 'harmony',
  biomePace: 'balanced',
  showChromaticLight: true,
  showHologramRings: true,
  showEngineLogos: true,
  showSuggestionPrompts: false, // Clean distraction-free interface
  showStatusPills: true,
  showDirectionalWatermarks: true,
  logoStyle: 'vector',
  customVisionSubtitle: '',
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  language: 'ar',
  theme: 'midnight',
  fontSize: 'base',
  layoutDensity: 'comfortable',
  autoCategorize: true,
  soundEffects: false,
};

export const DEFAULT_PRIVACY: PrivacyConfig = {
  encryptionEnabled: true,
  vaultPassphraseSet: true,
  zeroTelemetry: true,
  autoPurgeDays: 0,
  maskSensitiveData: true,
  syncStatus: 'synced',
  lastSyncTime: new Date().toISOString(),
  syncDeviceId: 'DEVICE-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
};

/**
 * Isolated Client Session Management
 * Guarantees that each browser / person operates in a partitioned sandbox.
 */
export function getOrCreateClientSessionId(): string {
  try {
    let sid = sessionStorage.getItem('sanad_client_session_id');
    if (!sid) {
      sid = 'client_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8);
      sessionStorage.setItem('sanad_client_session_id', sid);
    }
    return sid;
  } catch {
    return 'client_isolated';
  }
}

/**
 * Loads conversations with a guaranteed clean slate for public visitors.
 * If legacy template data was present, it cleans it up so the user gets an empty, fresh start.
 */
export function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    if (!raw) {
      // New visitor: start with pristine clean state
      saveConversations([]);
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Check if the stored data is only the old hardcoded sample dataset
    const isLegacyDemoOnly = parsed.length > 0 && parsed.every((c: any) => 
      ['conv-1', 'conv-2', 'conv-3', 'conv-4'].includes(c.id)
    );
    const hasExplicitDemoFlag = localStorage.getItem('sanad_founder_demo_active') === 'true';

    if (isLegacyDemoOnly && !hasExplicitDemoFlag) {
      // Automatically clean up legacy demo data for public users
      saveConversations([]);
      return [];
    }

    return parsed;
  } catch (err) {
    console.error('Failed to load conversations:', err);
    return [];
  }
}

export function saveConversations(conversations: Conversation[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  } catch (err) {
    console.error('Failed to save conversations:', err);
  }
}

/**
 * Loads tasks with a guaranteed clean slate for public visitors.
 */
export function loadTasks(): MultiTaskItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) {
      saveTasks([]);
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const isLegacyTasksOnly = parsed.length > 0 && parsed.every((t: any) =>
      ['task-1', 'task-2', 'task-3', 'task-4'].includes(t.id)
    );
    const hasExplicitDemoFlag = localStorage.getItem('sanad_founder_demo_active') === 'true';

    if (isLegacyTasksOnly && !hasExplicitDemoFlag) {
      saveTasks([]);
      return [];
    }

    return parsed;
  } catch (err) {
    console.error('Failed to load tasks:', err);
    return [];
  }
}

export function saveTasks(tasks: MultiTaskItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks:', err);
  }
}

/**
 * Loads Founder demo dataset explicitly (upon founder request in Cockpit)
 */
export function loadFounderDemoData(): { conversations: Conversation[]; tasks: MultiTaskItem[] } {
  try {
    localStorage.setItem('sanad_founder_demo_active', 'true');
    saveConversations(INITIAL_CONVERSATIONS);
    saveTasks(INITIAL_TASKS);
    return {
      conversations: INITIAL_CONVERSATIONS,
      tasks: INITIAL_TASKS,
    };
  } catch (err) {
    console.error('Failed to load founder demo data:', err);
    return { conversations: [], tasks: [] };
  }
}

/**
 * Wipes local session to a clean slate (empty conversations & tasks)
 */
export function resetToCleanSlate(): void {
  try {
    localStorage.removeItem('sanad_founder_demo_active');
    saveConversations([]);
    saveTasks([]);
    sessionStorage.removeItem('sanad_active_conv');
  } catch (err) {
    console.error('Failed to reset to clean slate:', err);
  }
}

export function loadPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (!raw) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(prefs: UserPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
  } catch (err) {
    console.error('Failed to save preferences:', err);
  }
}

export function loadPrivacyConfig(): PrivacyConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRIVACY);
    if (!raw) return DEFAULT_PRIVACY;
    return { ...DEFAULT_PRIVACY, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PRIVACY;
  }
}

export function savePrivacyConfig(cfg: PrivacyConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PRIVACY, JSON.stringify(cfg));
  } catch (err) {
    console.error('Failed to save privacy config:', err);
  }
}

export function loadVisionConfig(): VisionDisplayConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VISION_CONFIG);
    if (!raw) return DEFAULT_VISION_CONFIG;
    return { ...DEFAULT_VISION_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_VISION_CONFIG;
  }
}

export function saveVisionConfig(cfg: VisionDisplayConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.VISION_CONFIG, JSON.stringify(cfg));
  } catch (err) {
    console.error('Failed to save vision config:', err);
  }
}
