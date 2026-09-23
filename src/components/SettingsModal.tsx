import React, { useState } from "react";
import { 
  X, 
  Settings as SettingsIcon, 
  ShieldCheck, 
  Volume2, 
  Cpu, 
  User, 
  Check,
  Lock
} from "lucide-react";
import { UserProfile } from "../types.js";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateSettings: (settings: Partial<UserProfile['settings']>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateSettings
}) => {
  const [safetyStrictness, setSafetyStrictness] = useState(currentUser.settings.safetyStrictness);
  const [voiceEnabled, setVoiceEnabled] = useState(currentUser.settings.voiceEnabled);
  const [autoVoicePlayback, setAutoVoicePlayback] = useState(currentUser.settings.autoVoicePlayback);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateSettings({
      safetyStrictness,
      voiceEnabled,
      autoVoicePlayback
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div 
        id="settings-preferences-modal"
        className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-zinc-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/60">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-blue-400" />
              Platform Settings & AI Governance
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Configure multi-agent safety thresholds, speech preferences, and active intelligence models.
            </p>
          </div>
          <button
            id="close-settings-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* User Profile Summary */}
          <div className="bg-zinc-950/70 border border-zinc-800 p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{currentUser.name}</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-zinc-400">{currentUser.email} • {currentUser.title}</p>
            </div>
          </div>

          {/* Model Information */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-amber-400" />
              Intelligence Core & Architecture
            </h3>
            <div className="bg-zinc-950/50 border border-zinc-800 p-3.5 rounded-xl text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-400">Primary Foundation Model:</span>
                <span className="font-mono text-zinc-200 font-semibold">gemini-3.8-flash</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Execution Mode:</span>
                <span className="font-mono text-emerald-400">Server-Side Multi-Agent Orchestration</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Security Boundary:</span>
                <span className="text-zinc-300">Zero Client-Side Secret Exposure</span>
              </div>
            </div>
          </div>

          {/* Safety Strictness */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Safety & Prompt-Injection Guardrails
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSafetyStrictness("high")}
                className={`p-3 rounded-xl border text-left transition ${
                  safetyStrictness === "high"
                    ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                    : "bg-zinc-950/40 border-zinc-800 text-zinc-400 hover:bg-zinc-800/40"
                }`}
              >
                <div className="font-semibold text-xs text-white mb-0.5">High Strictness (Recommended)</div>
                <div className="text-[11px] text-zinc-400">Aggressive prompt-injection defense and non-diagnostic medical quarantine.</div>
              </button>

              <button
                type="button"
                onClick={() => setSafetyStrictness("standard")}
                className={`p-3 rounded-xl border text-left transition ${
                  safetyStrictness === "standard"
                    ? "bg-blue-500/10 border-blue-500/40 text-blue-300"
                    : "bg-zinc-950/40 border-zinc-800 text-zinc-400 hover:bg-zinc-800/40"
                }`}
              >
                <div className="font-semibold text-xs text-white mb-0.5">Standard Strictness</div>
                <div className="text-[11px] text-zinc-400">Balanced content filtering suitable for general software programming tasks.</div>
              </button>
            </div>
          </div>

          {/* Voice Mode */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-purple-400" />
              Voice Mode & Speech Synthesis
            </h3>
            <div className="bg-zinc-950/50 border border-zinc-800 p-3.5 rounded-xl space-y-3 text-xs">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-zinc-200">Enable Web Speech Audio Voice</span>
                <input
                  type="checkbox"
                  checked={voiceEnabled}
                  onChange={(e) => setVoiceEnabled(e.target.checked)}
                  className="rounded bg-zinc-800 border-zinc-700 text-blue-600 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer border-t border-zinc-800/60 pt-2.5">
                <span className="text-zinc-200">Automatically Read Aloud Agent Responses</span>
                <input
                  type="checkbox"
                  checked={autoVoicePlayback}
                  onChange={(e) => setAutoVoicePlayback(e.target.checked)}
                  className="rounded bg-zinc-800 border-zinc-700 text-blue-600 focus:ring-0"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-zinc-800 bg-zinc-950/60 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Lock className="w-3.5 h-3.5 text-zinc-500" />
            <span>Encrypted local session state</span>
          </div>
          <button
            id="save-settings-btn"
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition shadow-md"
          >
            {saved ? <Check className="w-4 h-4" /> : null}
            <span>{saved ? "Saved!" : "Save Preferences"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
