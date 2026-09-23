import React, { useState } from "react";
import { 
  X, 
  Bot, 
  GraduationCap, 
  HeartPulse, 
  ShieldAlert, 
  FlameKindling, 
  Briefcase, 
  Trophy, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { AGENT_CATALOG } from "../server/agents.js";
import { AgentId, AgentInfo } from "../types.js";

interface AgentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAgent: (agentId: AgentId, samplePrompt?: string) => void;
}

export const AgentsModal: React.FC<AgentsModalProps> = ({
  isOpen,
  onClose,
  onSelectAgent
}) => {
  const [selectedAgent, setSelectedAgent] = useState<AgentInfo>(AGENT_CATALOG.general);

  if (!isOpen) return null;

  const getAgentIcon = (id: AgentId) => {
    switch (id) {
      case "student": return <GraduationCap className="w-5 h-5 text-purple-400" />;
      case "healthcare": return <HeartPulse className="w-5 h-5 text-emerald-400" />;
      case "cybersecurity": return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      case "emergency": return <FlameKindling className="w-5 h-5 text-amber-400" />;
      case "career": return <Briefcase className="w-5 h-5 text-cyan-400" />;
      case "hackathon": return <Trophy className="w-5 h-5 text-pink-400" />;
      default: return <Bot className="w-5 h-5 text-blue-400" />;
    }
  };

  const agentsList = Object.values(AGENT_CATALOG);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div 
        id="agents-directory-modal"
        className="w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-zinc-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/60">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Specialized Multi-Agent Catalog
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Explore 7 autonomous agents operating within your unified assistant layer.
            </p>
          </div>
          <button
            id="close-agents-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Split */}
        <div className="flex-1 flex overflow-hidden">
          {/* Agent Navigation List */}
          <div className="w-1/3 border-r border-zinc-800 overflow-y-auto p-3 space-y-1 bg-zinc-950/30">
            {agentsList.map((agent) => {
              const isSelected = selectedAgent.id === agent.id;
              return (
                <button
                  key={agent.id}
                  id={`agent-list-item-${agent.id}`}
                  onClick={() => setSelectedAgent(agent)}
                  className={`w-full text-left p-3 rounded-xl transition flex items-start gap-3 ${
                    isSelected
                      ? "bg-zinc-800/90 border border-zinc-700/80 shadow-sm"
                      : "hover:bg-zinc-800/40 border border-transparent"
                  }`}
                >
                  <div className="mt-0.5 shrink-0">{getAgentIcon(agent.id)}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-zinc-200 truncate">
                        {agent.shortName}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                      {agent.badge}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Agent Deep-Dive Details */}
          <div className="w-2/3 p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                  {getAgentIcon(selectedAgent.id)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{selectedAgent.name}</h3>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${selectedAgent.accentBg}`}>
                      {selectedAgent.badge}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">{selectedAgent.tagline}</p>
                </div>
              </div>

              <div className="bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-800/80 text-xs text-zinc-300 leading-relaxed">
                {selectedAgent.description}
              </div>

              {/* Capabilities */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Specialized Capabilities & Guardrails
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {selectedAgent.capabilities.map((cap, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-zinc-300 bg-zinc-950/40 p-2 rounded-lg border border-zinc-800/40">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Prompts */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Try Sample Prompts
                </h4>
                <div className="space-y-1.5">
                  {selectedAgent.suggestedPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      id={`launch-prompt-${selectedAgent.id}-${idx}`}
                      onClick={() => {
                        onSelectAgent(selectedAgent.id, prompt);
                        onClose();
                      }}
                      className="w-full text-left p-2.5 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 hover:border-zinc-700 border border-zinc-800 text-xs text-zinc-300 flex items-center justify-between group transition"
                    >
                      <span className="truncate pr-2">"{prompt}"</span>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-400 shrink-0 transition" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Launch Chat Button */}
            <div className="pt-6 border-t border-zinc-800/80 flex items-center justify-between mt-6">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Isolated Prompt Boundary & System Persona</span>
              </div>
              <button
                id="pin-agent-chat-btn"
                onClick={() => {
                  onSelectAgent(selectedAgent.id);
                  onClose();
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition shadow-md"
              >
                <span>Launch Chat with {selectedAgent.shortName}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
