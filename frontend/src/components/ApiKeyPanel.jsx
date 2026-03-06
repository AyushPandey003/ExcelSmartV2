import { useMemo, useState } from "react";
import {
  GEMINI_MODEL_OPTIONS,
  clearUserGeminiKey,
  getUserGeminiKey,
  getUserGeminiModel,
  saveUserGeminiKey,
  saveUserGeminiModel,
} from "../lib/userGeminiKey";

export default function ApiKeyPanel({ onKeyChange, onModelChange }) {
  const initialKey = useMemo(() => getUserGeminiKey(), []);
  const initialModel = useMemo(() => getUserGeminiModel(), []);
  const [draft, setDraft] = useState(initialKey);
  const [savedKey, setSavedKey] = useState(initialKey);
  const [model, setModel] = useState(initialModel);
  const [status, setStatus] = useState("");

  function saveKey() {
    const normalized = saveUserGeminiKey(draft);
    setSavedKey(normalized);
    setDraft(normalized);
    setStatus(normalized
      ? "API key saved for this browser tab."
      : "API key removed.");
    onKeyChange?.(normalized);
  }

  function clearKey() {
    clearUserGeminiKey();
    setDraft("");
    setSavedKey("");
    setStatus("API key removed.");
    onKeyChange?.("");
  }

  function changeModel(nextModel) {
    const savedModel = saveUserGeminiModel(nextModel);
    setModel(savedModel);
    setStatus(`Model set to ${GEMINI_MODEL_OPTIONS.find((m) => m.id === savedModel)?.label}.`);
    onModelChange?.(savedModel);
  }

  return (
    <div className="card card-b" style={{ marginBottom: 14 }}>
      <div style={{ fontWeight: 800, marginBottom: 6, fontSize: 14 }}>
        Bring Your Own Gemini API Key
      </div>
      <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6, marginBottom: 10 }}>
        Your key is used only from this browser tab to call Google Gemini directly.
        It is never sent to or stored on ExcelSmart servers.
      </p>

      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <input
          className="input"
          type="password"
          placeholder="Paste your Gemini API key"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          style={{ flex: 1, minWidth: 240 }}
        />
        <button className="btn btn-blue btn-sm" onClick={saveKey}>
          Save Key
        </button>
        <button className="btn btn-ghost btn-sm" onClick={clearKey}>
          Clear
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 10, flexWrap: "wrap" }}>
        <label htmlFor="gemini-model" style={{ fontSize: 12, color: "var(--text2)", fontWeight: 700 }}>
          Model
        </label>
        <select
          id="gemini-model"
          className="input"
          value={model}
          onChange={(e) => changeModel(e.target.value)}
          style={{ maxWidth: 220, paddingRight: 28 }}
        >
          {GEMINI_MODEL_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: 8, fontSize: 12, color: "var(--text3)" }}>
        {savedKey
          ? "Status: Key loaded for this tab."
          : "Status: No key set. AI features are disabled until you add one."}
      </div>
      {status && <div style={{ marginTop: 4, fontSize: 12, color: "var(--blue)" }}>{status}</div>}
    </div>
  );
}
