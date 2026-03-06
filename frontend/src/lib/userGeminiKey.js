const KEY = "excelsmart.gemini.userKey";
const MODEL_KEY = "excelsmart.gemini.model";

export const GEMINI_MODEL_OPTIONS = [
  { id: "gemini-2.5-flash-lite", label: "2.5 Flash Lite" },
  { id: "gemini-2.5-flash", label: "2.5 Flash" },
  { id: "gemini-3.1-pro", label: "3.1 Pro" },
];

const DEFAULT_MODEL = GEMINI_MODEL_OPTIONS[0].id;

export function getUserGeminiKey() {
  return sessionStorage.getItem(KEY) || "";
}

export function saveUserGeminiKey(apiKey) {
  const normalized = (apiKey || "").trim();
  if (!normalized) {
    sessionStorage.removeItem(KEY);
    return "";
  }

  sessionStorage.setItem(KEY, normalized);
  return normalized;
}

export function clearUserGeminiKey() {
  sessionStorage.removeItem(KEY);
}

export function getUserGeminiModel() {
  const saved = sessionStorage.getItem(MODEL_KEY);
  return GEMINI_MODEL_OPTIONS.some((m) => m.id === saved) ? saved : DEFAULT_MODEL;
}

export function saveUserGeminiModel(modelId) {
  const normalized = (modelId || "").trim();
  const valid = GEMINI_MODEL_OPTIONS.some((m) => m.id === normalized)
    ? normalized
    : DEFAULT_MODEL;
  sessionStorage.setItem(MODEL_KEY, valid);
  return valid;
}
