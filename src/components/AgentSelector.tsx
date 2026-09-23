import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  GraduationCap, 
  HeartPulse, 
  ShieldAlert, 
  FlameKindling, 
  Briefcase, 
  Trophy, 
  Sparkles,
  ChevronDown,
  Check,
  Plus,
  Activity,
  Layers,
  Cpu,
  Zap
} from "lucide-react";
import { AgentId, ModelEngine } from "../types.js";

interface AgentSelectorProps {
  currentAgentId: AgentId;
  onSelectAgent: (id: AgentId) => void;
  currentModelEngine: ModelEngine;
  onSelectModelEngine: (engine: ModelEngine) => void;
  onOpenAgentsModal: () => void;
  onNewChat?: () => void;
  onOpenAnalyticsModal?: () => void;
}

export const AgentSelector: React.FC<AgentSelectorProps> = ({
  currentAgentId,
  onSelectAgent,
  currentModelEngine,
  onSelectModelEngine,
  onOpenAgentsModal,
  onNewChat,
  onOpenAnalyticsModal
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [engineDropdownOpen, setEngineDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const engineDropdownRef = useRef<HTMLDivElement>(null);

  const engines: { id: ModelEngine; name: string; tag: string; provider: string; color: string; bg: string }[] = [
    { id: "gemini", name: "Gemini", tag: "3.1 Flash / 3.8", provider: "Google DeepMind", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" },
    { id: "chatgpt", name: "ChatGPT", tag: "GPT-4o Engine", provider: "OpenAI", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" },
    { id: "claude", name: "Claude", tag: "Claude 3.5 Sonnet", provider: "Anthropic", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" },
  ];

  const agents = [
    { 
      id: "auto", 
      name: "OmniAgent Auto (Intent Router)", 
      shortName: "Auto Router", 
      icon: Sparkles, 
      color: "text-amber-400",
      desc: "Smart intent classifier: automatically detects domain and calls specialized tools" 
    },
    { 
      id: "general", 
      name: "ChatGPT Mode (General AI)", 
      shortName: "ChatGPT Mode", 
      icon: Bot, 
      color: "text-emerald-400",
      desc: "Conversational, coding, brainstorming, summarizing & open-ended reasoning" 
    },
    { 
      id: "student", 
      name: "Student & Academic Assistant", 
      shortName: "Student Assistant", 
      icon: GraduationCap, 
      color: "text-purple-400",
      desc: "Course mastery, 30-day exam plans, flashcards, active recall" 
    },
    { 
      id: "cybersecurity", 
      name: "Security & Fraud Guard", 
      shortName: "Anti-Fraud Guard", 
      icon: ShieldAlert, 
      color: "text-rose-400",
      desc: "Phishing SMS/link audit, Fraud Journey Reconstruction, threat triage" 
    },
    { 
      id: "career", 
      name: "Career & Interview Coach", 
      shortName: "Career Coach", 
      icon: Briefcase, 
      color: "text-cyan-400",
      desc: "Skill-gap matrix, resume impact optimization, STAR behavioral mock" 
    },
    { 
      id: "hackathon", 
      name: "Hackathon MVP Architect", 
      shortName: "Hackathon Architect", 
      icon: Trophy, 
      color: "text-pink-400",
      desc: "Idea uniqueness, system architecture, 24-hr scope, 5-slide pitch decks" 
    },
    { 
      id: "emergency", 
      name: "Emergency & Disaster Assistant", 
      shortName: "Emergency Assistant", 
      icon: FlameKindling, 
      color: "text-amber-400",
      desc: "Personalized household safety plans, 72-hour survival go-bag inventory" 
    },
    { 
      id: "healthcare", 
      name: "Healthcare Literacy Assistant", 
      shortName: "Healthcare Info", 
      icon: HeartPulse, 
      color: "text-emerald-400",
      desc: "Medical terminology, symptom inquiry prep, doctor visit questionnaires" 
    },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (engineDropdownRef.current && !engineDropdownRef.current.contains(e.target as Node)) {
        setEngineDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeAgent = agents.find(a => a.id === currentAgentId) || agents[0];
  const ActiveIcon = activeAgent.icon;
  const activeEngine = engines.find(e => e.id === currentModelEngine) || engines[0];

  return (
    <header id="agent-selector-bar" className="w-full bg-[#18181b]/95 sm:bg-[#212121]/90 border-b border-zinc-800/80 px-4 py-2.5 backdrop-blur-md sticky top-0 z-20">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Persona Selector & Multi-Model Engine Selector */}
        <div className="flex items-center gap-2">
          {/* Genalpha Model Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              id="genalpha-persona-dropdown-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-zinc-800/80 transition text-zinc-100 font-semibold text-sm group border border-zinc-700/50"
            >
              <div className="w-5 h-5 rounded-md bg-zinc-800 flex items-center justify-center">
                <ActiveIcon className={`w-3.5 h-3.5 ${activeAgent.color}`} />
              </div>
              <span className="truncate max-w-[120px] sm:max-w-none">{activeAgent.shortName}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-80 sm:w-96 bg-[#212121] border border-zinc-700/80 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-zinc-700/60 mb-1 flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    Genalpha Intelligence Personas
                  </span>
                  <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-blue-400 font-mono">
                    Multi-Model AI
                  </span>
                </div>

                <div className="max-h-[380px] overflow-y-auto space-y-1">
                  {agents.map((ag) => {
                    const Icon = ag.icon;
                    const isSelected = currentAgentId === ag.id;
                    return (
                      <button
                        key={ag.id}
                        id={`dropdown-agent-${ag.id}`}
                        onClick={() => {
                          onSelectAgent(ag.id as AgentId);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl transition flex items-start gap-3 ${
                          isSelected 
                            ? "bg-zinc-800/90 text-white" 
                            : "hover:bg-zinc-800/50 text-zinc-300"
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-700/60 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon className={`w-4 h-4 ${ag.color}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-zinc-100">{ag.name}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                          </div>
                          <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">{ag.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2 pt-2 border-t border-zinc-700/60 px-2 flex justify-between items-center">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenAgentsModal();
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium py-1"
                  >
                    View full agent specifications & tools →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* AI Engine Switcher (Gemini, ChatGPT, Claude) */}
          <div className="relative" ref={engineDropdownRef}>
            <button
              id="model-engine-selector-btn"
              onClick={() => setEngineDropdownOpen(!engineDropdownOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition border ${activeEngine.bg} text-zinc-100`}
              title="Switch between Gemini, ChatGPT, and Claude engines"
            >
              <Cpu className={`w-3.5 h-3.5 ${activeEngine.color}`} />
              <span className="font-semibold">{activeEngine.name}</span>
              <span className="hidden sm:inline text-[10px] text-zinc-400">({activeEngine.tag})</span>
              <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform ${engineDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {engineDropdownOpen && (
              <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-72 bg-[#212121] border border-zinc-700/80 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 border-b border-zinc-700/60 mb-1 flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    Genalpha AI Engine
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">Live Routing</span>
                </div>

                <div className="space-y-1">
                  {engines.map((eng) => {
                    const isSelected = currentModelEngine === eng.id;
                    return (
                      <button
                        key={eng.id}
                        id={`engine-select-${eng.id}`}
                        onClick={() => {
                          onSelectModelEngine(eng.id);
                          setEngineDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl transition flex items-center justify-between gap-3 ${
                          isSelected
                            ? "bg-zinc-800 text-white border border-zinc-600/80 shadow-sm"
                            : "hover:bg-zinc-800/60 text-zinc-300 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center ${eng.color}`}>
                            <Zap className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                              {eng.name}
                              <span className="text-[10px] font-normal text-zinc-400">({eng.tag})</span>
                            </div>
                            <div className="text-[10px] text-zinc-400">{eng.provider}</div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Mode Pills (Responsive & Full Scope) */}
        <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          {agents.map((ag) => {
            const Icon = ag.icon;
            const isSelected = currentAgentId === ag.id;
            return (
              <button
                key={ag.id}
                onClick={() => onSelectAgent(ag.id as AgentId)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-zinc-800 text-white border border-zinc-600 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
                }`}
                title={ag.desc}
              >
                <Icon className={`w-3 h-3 ${ag.color}`} />
                <span>{ag.shortName}</span>
              </button>
            );
          })}
        </div>

        {/* Reset to Auto button on medium screens if pinned */}
        {currentAgentId !== "auto" && (
          <button
            onClick={() => onSelectAgent("auto")}
            className="hidden sm:flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 rounded-full transition"
            title="Reset to Orchestrator Auto-Router"
          >
            <Sparkles className="w-3 h-3" />
            <span>Reset Auto</span>
          </button>
        )}

        {/* Right Action Icons */}
        <div className="flex items-center gap-2">
          {onNewChat && (
            <button
              id="new-chat-header-btn"
              onClick={() => onNewChat()}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              title="New Chat"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}

          {onOpenAnalyticsModal && (
            <button
              onClick={onOpenAnalyticsModal}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              title="System Telemetry & Status"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
