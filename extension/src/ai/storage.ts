export interface AiSettings {
  apiKey: string;
  model: string;
}

const DEFAULTS: AiSettings = {
  apiKey: "",
  model: "google/gemini-3-flash-preview",
};

const STORAGE_KEY = "scrbd_ai_settings";

export async function loadSettings(): Promise<AiSettings> {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  return { ...DEFAULTS, ...result[STORAGE_KEY] };
}

export async function saveSettings(settings: Partial<AiSettings>): Promise<AiSettings> {
  const current = await loadSettings();
  const merged = { ...current, ...settings };
  await chrome.storage.local.set({ [STORAGE_KEY]: merged });
  return merged;
}

export function hasApiKey(settings: AiSettings): boolean {
  return settings.apiKey.trim().length > 0;
}
