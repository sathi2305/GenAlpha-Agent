import React from "react";
import { 
  Bot, 
  GraduationCap, 
  HeartPulse, 
  ShieldAlert, 
  FlameKindling, 
  Briefcase, 
  Trophy, 
  Sparkles, 
  ArrowRight,
  Code2,
  FileSearch,
  MessageSquare
} from "lucide-react";
import { AgentId } from "../types.js";

interface WelcomeViewProps {
  onQuickPrompt: (prompt: string, agentId?: AgentId) => void;
  onOpenAgentsModal: () => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({
  onQuickPrompt,
  onOpenAgentsModal
}) => {
  const suggestions = [
    {
      agentId: "general" as AgentId,
      title: "Say Hi to Genalpha",
      desc: "Instant greeting & engine capabilities overview",
      prompt: "Hi",
      icon: MessageSquare,
      color: "text-blue-400"
    },
    {
      agentId: "general" as AgentId,
      title: "Write, explain or debug code",
      desc: "Syntax, algorithms, architecture & clean TypeScript",
      prompt: "Explain how React 19 Server Actions work compared to API routes with code examples.",
      icon: Code2,
      color: "text-emerald-400"
    },
    {
      agentId: "cybersecurity" as AgentId,
      title: "Analyze suspicious SMS or link",
      desc: "Threat triage & fraud journey reconstruction",
      prompt: "Analyze this SMS: 'URGENT: Your bank card has been locked. Verify immediately at bit.ly/bank-sec or call 800-555-0199.'",
      icon: ShieldAlert,
      color: "text-rose-400"
    },
    {
      agentId: "student" as AgentId,
      title: "Create an exam study blueprint",
      desc: "30-day milestone roadmap & active recall flashcards",
      prompt: "Create a 30-day exam roadmap for Object-Oriented Programming and Data Structures.",
      icon: GraduationCap,
      color: "text-purple-400"
    },
    {
      agentId: "hackathon" as AgentId,
      title: "Architect an AI hackathon MVP",
      desc: "System design, 24-hr scope & 5-slide pitch deck",
      prompt: "Design a winning AI hackathon concept for climate resilience with system architecture and pitch deck.",
      icon: Trophy,
      color: "text-pink-400"
    },
    {
      agentId: "career" as AgentId,
      title: "Analyze resume & interview prep",
      desc: "Skill-gap matrix & STAR-method mock practice",
      prompt: "Analyze the skill gap between a Senior Frontend Developer and a Full-Stack AI Engineer.",
      icon: Briefcase,
      color: "text-cyan-400"
    }
  ];

  return (
    <div id="genalpha-welcome-container" className="max-w-3xl mx-auto px-4 py-10 flex flex-col items-center justify-center min-h-[70vh] text-center animate-in fade-in duration-300">
      {/* Genalpha Multi-Model Icon */}
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-emerald-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/10 mb-5">
        <Sparkles className="w-7 h-7 text-white" />
      </div>

      {/* Headline */}
      <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-2">
        Genalpha AI Assistant
      </h1>
      <p className="text-sm text-zinc-400 max-w-lg mx-auto mb-6">
        Ready across <span className="text-blue-400 font-medium">Google Gemini</span>, <span className="text-emerald-400 font-medium">OpenAI ChatGPT</span>, and <span className="text-amber-400 font-medium">Anthropic Claude</span> engines with automatic domain intent routing.
      </p>

      {/* ChatGPT-style Suggestion Cards Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {suggestions.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              id={`chatgpt-suggestion-${idx}`}
              onClick={() => onQuickPrompt(item.prompt, item.agentId)}
              className="p-3.5 rounded-2xl bg-[#212121]/90 hover:bg-[#2a2a2a] border border-zinc-700/50 hover:border-zinc-600 text-left transition group flex items-start gap-3.5 shadow-sm"
            >
              <div className="w-8 h-8 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-semibold text-zinc-200 group-hover:text-white transition">
                  {item.title}
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">
                  {item.desc}
                </p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300 transition shrink-0 mt-1" />
            </button>
          );
        })}
      </div>

      {/* Footer hint */}
      <button
        onClick={onOpenAgentsModal}
        className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 transition py-1"
      >
        <span>Looking for specific agents? Browse all 7 specialized capabilities</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
