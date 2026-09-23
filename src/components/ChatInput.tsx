import React, { useState, useRef, useEffect } from "react";
import { 
  ArrowUp, 
  Mic, 
  MicOff, 
  Plus, 
  Square, 
  Paperclip, 
  X, 
  UploadCloud,
  Sparkles,
  Bot,
  GraduationCap,
  HeartPulse,
  ShieldAlert,
  FlameKindling,
  Briefcase,
  Trophy,
  ChevronDown,
  Check,
  AtSign,
  HelpCircle
} from "lucide-react";
import { AgentId, ModelEngine } from "../types.js";

interface ChatInputProps {
  onSendMessage: (text: string, fileData?: { filename: string; content: string; mimeType: string }) => void;
  isGenerating: boolean;
  onStopGeneration: () => void;
  currentAgentId: AgentId;
  onSelectAgent?: (id: AgentId) => void;
  currentModelEngine?: ModelEngine;
  onSelectModelEngine?: (engine: ModelEngine) => void;
}

interface AgentOption {
  id: AgentId;
  name: string;
  shortName: string;
  mentionTag: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  specialTool?: string;
  hint: string;
}

const AGENT_OPTIONS: AgentOption[] = [
  {
    id: "auto",
    name: "Genalpha Auto (Orchestrator)",
    shortName: "Genalpha Auto",
    mentionTag: "@auto",
    icon: Sparkles,
    color: "text-amber-400",
    badgeBg: "bg-amber-500/10",
    badgeBorder: "border-amber-500/40 text-amber-300",
    hint: "Detects your query intent automatically and triggers specialized tools"
  },
  {
    id: "general",
    name: "Genalpha Core (General AI)",
    shortName: "Genalpha Core",
    mentionTag: "@genalpha",
    icon: Bot,
    color: "text-blue-400",
    badgeBg: "bg-blue-500/10",
    badgeBorder: "border-blue-500/40 text-blue-300",
    hint: "Multi-model reasoning, coding, writing & analysis across Gemini, ChatGPT, Claude"
  },
  {
    id: "student",
    name: "Student & Academic Assistant",
    shortName: "Study Assistant",
    mentionTag: "@student",
    icon: GraduationCap,
    color: "text-purple-400",
    badgeBg: "bg-purple-500/10",
    badgeBorder: "border-purple-500/40 text-purple-300",
    specialTool: "Study Roadmap Planner",
    hint: "30-day exam milestone schedules & active-recall flashcards"
  },
  {
    id: "cybersecurity",
    name: "Security & Fraud Guard",
    shortName: "Anti-Fraud Guard",
    mentionTag: "@security",
    icon: ShieldAlert,
    color: "text-rose-400",
    badgeBg: "bg-rose-500/10",
    badgeBorder: "border-rose-500/40 text-rose-300",
    specialTool: "Fraud Journey Analyzer",
    hint: "Phishing SMS/URL audit & scam journey reconstruction"
  },
  {
    id: "career",
    name: "Career & Interview Coach",
    shortName: "Career Coach",
    mentionTag: "@career",
    icon: Briefcase,
    color: "text-cyan-400",
    badgeBg: "bg-cyan-500/10",
    badgeBorder: "border-cyan-500/40 text-cyan-300",
    specialTool: "Skill-Gap Matrix",
    hint: "Resume impact audits, STAR mock interviews & role roadmaps"
  },
  {
    id: "hackathon",
    name: "Hackathon MVP Architect",
    shortName: "Hackathon Architect",
    mentionTag: "@hackathon",
    icon: Trophy,
    color: "text-pink-400",
    badgeBg: "bg-pink-500/10",
    badgeBorder: "border-pink-500/40 text-pink-300",
    specialTool: "MVP & Pitch Deck Architect",
    hint: "System design, 24-hr scope limits & winning 5-slide pitch decks"
  },
  {
    id: "emergency",
    name: "Emergency & Disaster Assistant",
    shortName: "Emergency Assistant",
    mentionTag: "@emergency",
    icon: FlameKindling,
    color: "text-amber-400",
    badgeBg: "bg-amber-500/10",
    badgeBorder: "border-amber-500/40 text-amber-300",
    specialTool: "Emergency Household Planner",
    hint: "72-hour survival go-bag inventory & hazard evacuation plans"
  },
  {
    id: "healthcare",
    name: "Healthcare Literacy Assistant",
    shortName: "Healthcare Info",
    mentionTag: "@health",
    icon: HeartPulse,
    color: "text-emerald-400",
    badgeBg: "bg-emerald-500/10",
    badgeBorder: "border-emerald-500/40 text-emerald-300",
    hint: "Medical terminology & doctor visit prep (strict non-diagnostic guardrails)"
  }
];

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isGenerating,
  onStopGeneration,
  currentAgentId,
  onSelectAgent,
  currentModelEngine,
  onSelectModelEngine
}) => {
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ filename: string; content: string; mimeType: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showAgentMenu, setShowAgentMenu] = useState(false);
  const [showAgentDock, setShowAgentDock] = useState(true);
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionIndex, setMentionIndex] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const agentMenuRef = useRef<HTMLDivElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [inputText]);

  // Close popups on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (agentMenuRef.current && !agentMenuRef.current.contains(e.target as Node)) {
        setShowAgentMenu(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Web Speech API
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInputText((prev) => (prev ? prev + " " + transcript : transcript));
        }
      };

      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognitionRef.current = recognition;
    }
  }, []);

  // Handle @ mention typing
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputText(val);

    // Check if user is typing an @ mention
    const cursorPos = e.target.selectionStart || 0;
    const textBeforeCursor = val.slice(0, cursorPos);
    const match = textBeforeCursor.match(/@(\w*)$/);

    if (match) {
      setMentionQuery(match[1].toLowerCase());
      setMentionIndex(0);
    } else {
      setMentionQuery(null);
    }
  };

  const filteredAgents = mentionQuery !== null
    ? AGENT_OPTIONS.filter(a => 
        a.id.toLowerCase().includes(mentionQuery) ||
        a.name.toLowerCase().includes(mentionQuery) ||
        a.mentionTag.toLowerCase().includes(mentionQuery)
      )
    : [];

  const handleSelectMentionAgent = (agent: AgentOption) => {
    if (onSelectAgent) {
      onSelectAgent(agent.id);
    }
    // Remove the @query from input text
    const textBefore = inputText.replace(/@\w*$/, "");
    setInputText(textBefore);
    setMentionQuery(null);
    textareaRef.current?.focus();
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not available in this browser. Please type your query.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Speech error:", err);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // If mention menu is active
    if (mentionQuery !== null && filteredAgents.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setMentionIndex(prev => (prev + 1) % filteredAgents.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setMentionIndex(prev => (prev - 1 + filteredAgents.length) % filteredAgents.length);
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        handleSelectMentionAgent(filteredAgents[mentionIndex]);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setMentionQuery(null);
        return;
      }
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if ((!inputText.trim() && !attachedFile) || isGenerating) return;
    onSendMessage(inputText.trim(), attachedFile || undefined);
    setInputText("");
    setAttachedFile(null);
    setMentionQuery(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachedFile({
        filename: file.name,
        content: (event.target?.result as string) || "",
        mimeType: file.type || "text/plain"
      });
    };
    reader.readAsText(file);
  };

  const hasContent = Boolean(inputText.trim() || attachedFile);
  const currentAgentMeta = AGENT_OPTIONS.find(a => a.id === currentAgentId) || AGENT_OPTIONS[0];
  const CurrentIcon = currentAgentMeta.icon;

  return (
    <footer 
      id="chatgpt-input-footer"
      className="p-3 sm:p-4 bg-transparent sticky bottom-0 z-20"
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            setAttachedFile({
              filename: file.name,
              content: (event.target?.result as string) || "",
              mimeType: file.type || "text/plain"
            });
          };
          reader.readAsText(file);
        }
      }}
    >
      <div className="max-w-3xl mx-auto relative">
        {/* Drag Drop Overlay */}
        {isDragging && (
          <div className="absolute inset-0 bg-zinc-800/90 border-2 border-dashed border-emerald-500 rounded-3xl flex items-center justify-center backdrop-blur-sm z-30 pointer-events-none">
            <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm">
              <UploadCloud className="w-5 h-5 animate-bounce" />
              Drop document to attach to message & RAG index
            </div>
          </div>
        )}

        {/* Quick Agent Selection Dock (User-friendly 1-click switching) */}
        {onSelectAgent && showAgentDock && (
          <div className="mb-2.5 flex items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
              <span className="text-[11px] font-medium text-zinc-400 shrink-0 flex items-center gap-1 pl-1">
                <span>Agent:</span>
              </span>

              {AGENT_OPTIONS.map((agent) => {
                const Icon = agent.icon;
                const isSelected = currentAgentId === agent.id;
                return (
                  <button
                    key={agent.id}
                    type="button"
                    id={`quick-dock-agent-${agent.id}`}
                    onClick={() => onSelectAgent(agent.id)}
                    className={`h-7 px-2.5 rounded-full text-xs font-medium transition shrink-0 flex items-center gap-1.5 ${
                      isSelected
                        ? `${agent.badgeBg} ${agent.badgeBorder} border shadow-sm scale-105 font-semibold`
                        : "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80"
                    }`}
                    title={agent.hint}
                  >
                    <Icon className={`w-3.5 h-3.5 ${agent.color}`} />
                    <span>{agent.shortName}</span>
                    {agent.specialTool && isSelected && (
                      <span className="hidden sm:inline text-[9px] bg-zinc-800 px-1 rounded text-zinc-300 font-mono">
                        Tool
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Toggle Dock Visibility Button */}
            <button
              type="button"
              onClick={() => setShowAgentDock(false)}
              className="text-[10px] text-zinc-400 hover:text-zinc-300 shrink-0 px-1 py-0.5 rounded transition"
              title="Minimize agent dock"
            >
              Hide
            </button>
          </div>
        )}

        {/* Restore Agent Dock Button if hidden */}
        {!showAgentDock && onSelectAgent && (
          <div className="mb-1 px-1 flex justify-end">
            <button
              type="button"
              onClick={() => setShowAgentDock(true)}
              className="text-[11px] text-zinc-400 hover:text-zinc-300 flex items-center gap-1 transition py-0.5"
            >
              <CurrentIcon className={`w-3 h-3 ${currentAgentMeta.color}`} />
              <span>{currentAgentMeta.shortName}</span>
              <span className="text-zinc-400">• Show quick agent dock</span>
            </button>
          </div>
        )}

        {/* Attached File Preview Tag */}
        {attachedFile && (
          <div className="mb-2 flex items-center gap-2 bg-[#2f2f2f] border border-zinc-700 px-3 py-1.5 rounded-full w-fit text-xs text-zinc-200 shadow-md">
            <Paperclip className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-medium max-w-[200px] truncate">{attachedFile.filename}</span>
            <button
              id="remove-file-pill-btn"
              onClick={() => setAttachedFile(null)}
              className="text-zinc-400 hover:text-white p-0.5 rounded-full hover:bg-zinc-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* @ Mention Autocomplete Popover */}
        {mentionQuery !== null && filteredAgents.length > 0 && (
          <div className="absolute bottom-full mb-3 left-4 right-4 sm:left-6 sm:right-auto sm:w-96 bg-[#212121] border border-zinc-700 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-1.5 border-b border-zinc-700/60 mb-1 flex items-center justify-between text-xs text-zinc-400">
              <span className="font-medium flex items-center gap-1">
                <AtSign className="w-3.5 h-3.5 text-blue-400" />
                Select Agent Persona
              </span>
              <span className="text-[10px] text-zinc-400">Use ↑↓ and Enter</span>
            </div>
            <div className="max-h-56 overflow-y-auto space-y-1">
              {filteredAgents.map((ag, idx) => {
                const Icon = ag.icon;
                const isHighlighted = idx === mentionIndex;
                return (
                  <button
                    key={ag.id}
                    type="button"
                    onClick={() => handleSelectMentionAgent(ag)}
                    className={`w-full text-left p-2 rounded-xl transition flex items-center gap-2.5 ${
                      isHighlighted ? "bg-zinc-800 text-white" : "hover:bg-zinc-800/60 text-zinc-300"
                    }`}
                  >
                    <div className="w-6 h-6 rounded-lg bg-zinc-900 border border-zinc-700/60 flex items-center justify-center shrink-0">
                      <Icon className={`w-3.5 h-3.5 ${ag.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-100">{ag.name}</span>
                        <span className="text-[10px] font-mono text-zinc-400">{ag.mentionTag}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 line-clamp-1">{ag.hint}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ChatGPT Iconic Rounded Input Container */}
        <div className="relative bg-[#2f2f2f] border border-zinc-700/60 rounded-3xl p-2.5 shadow-2xl focus-within:border-zinc-500 transition-all flex flex-col">
          {/* Text Area */}
          <textarea
            ref={textareaRef}
            id="chat-textarea-input"
            rows={1}
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={
              currentAgentId === "auto"
                ? "Message OmniAgent (Auto-routes across security, study, emergency, career...)"
                : currentAgentId === "general"
                ? "Message ChatGPT Mode (reasoning, coding, open chat)..."
                : `Message ${currentAgentMeta.shortName}...`
            }
            className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none resize-none px-3 py-1.5 max-h-[180px] leading-relaxed"
          />

          {/* Controls Bar */}
          <div className="flex items-center justify-between pt-1 px-1">
            {/* Left Actions: Plus Attachment + Dictation + Inline Agent Switcher */}
            <div className="flex items-center gap-1.5">
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,.json,.csv,.py,.ts,.js,.pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                id="chatgpt-attach-btn"
                onClick={() => fileInputRef.current?.click()}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700/60 transition"
                title="Attach files (TXT, MD, Code, JSON)"
              >
                <Plus className="w-5 h-5" />
              </button>

              {/* Dictation Mic */}
              <button
                type="button"
                id="chatgpt-voice-btn"
                onClick={toggleRecording}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                  isRecording
                    ? "bg-rose-500/20 text-rose-400 animate-pulse ring-1 ring-rose-500"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-700/60"
                }`}
                title={isRecording ? "Listening... click to stop" : "Voice dictation"}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Inline Agent Selector Button (Opens Popover right at the input) */}
              {onSelectAgent && (
                <div className="relative" ref={agentMenuRef}>
                  <button
                    type="button"
                    id="chat-inline-agent-btn"
                    onClick={() => setShowAgentMenu(!showAgentMenu)}
                    className={`h-7 px-2.5 rounded-full flex items-center gap-1.5 text-xs font-medium transition border ${
                      currentAgentId === 'auto'
                        ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700/60'
                    }`}
                    title="Click to change active agent persona or type @ in chat"
                  >
                    <CurrentIcon className={`w-3.5 h-3.5 ${currentAgentMeta.color}`} />
                    <span className="truncate max-w-[110px] sm:max-w-[140px]">{currentAgentMeta.shortName}</span>
                    <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform ${showAgentMenu ? "rotate-180" : ""}`} />
                  </button>

                  {/* Inline Agent Menu Popover */}
                  {showAgentMenu && (
                    <div className="absolute bottom-full mb-2 left-0 w-80 sm:w-88 bg-[#212121] border border-zinc-700 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-3 py-1.5 border-b border-zinc-750 mb-1 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
                          Active Persona
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          Tip: Type @ in chat
                        </span>
                      </div>

                      <div className="max-h-64 overflow-y-auto space-y-1">
                        {AGENT_OPTIONS.map((agent) => {
                          const Icon = agent.icon;
                          const isSelected = currentAgentId === agent.id;
                          return (
                            <button
                              key={agent.id}
                              type="button"
                              onClick={() => {
                                onSelectAgent(agent.id);
                                setShowAgentMenu(false);
                              }}
                              className={`w-full text-left p-2 rounded-xl transition flex items-center gap-2.5 ${
                                isSelected ? "bg-zinc-800 text-white" : "hover:bg-zinc-800/60 text-zinc-300"
                              }`}
                            >
                              <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-700/60 flex items-center justify-center shrink-0">
                                <Icon className={`w-4 h-4 ${agent.color}`} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-semibold text-zinc-100">{agent.name}</span>
                                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                                </div>
                                <p className="text-[11px] text-zinc-400 line-clamp-1">{agent.hint}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {currentAgentId !== "auto" && (
                        <div className="mt-2 pt-2 border-t border-zinc-750 px-2 flex justify-between items-center">
                          <button
                            type="button"
                            onClick={() => {
                              onSelectAgent("auto");
                              setShowAgentMenu(false);
                            }}
                            className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Reset to Auto Router</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {isRecording && (
                <span className="text-[11px] text-rose-400 font-medium animate-pulse pl-1">
                  Listening...
                </span>
              )}

              {/* Quick Engine Indicator & Cycling */}
              {currentModelEngine && onSelectModelEngine && (
                <div className="hidden sm:flex items-center gap-1.5 bg-zinc-850 px-2.5 py-0.5 rounded-full border border-zinc-700/60 text-[11px] text-zinc-300">
                  <span className="text-zinc-500 font-mono text-[10px]">Engine:</span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = currentModelEngine === "gemini" ? "chatgpt" : currentModelEngine === "chatgpt" ? "claude" : "gemini";
                      onSelectModelEngine(next);
                    }}
                    className="font-medium hover:text-white flex items-center gap-1 transition"
                    title="Click to cycle between Gemini, ChatGPT, and Claude"
                  >
                    <span className={
                      currentModelEngine === "gemini" ? "text-blue-400" :
                      currentModelEngine === "chatgpt" ? "text-emerald-400" : "text-amber-400"
                    }>
                      {currentModelEngine === "gemini" ? "Gemini" : currentModelEngine === "chatgpt" ? "ChatGPT" : "Claude"}
                    </span>
                    <span className="text-[9px] text-zinc-500">⇄</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right Action: Upward Arrow Send Button (ChatGPT Signature) */}
            <div className="flex items-center gap-2">
              {isGenerating ? (
                <button
                  type="button"
                  id="chatgpt-stop-btn"
                  onClick={onStopGeneration}
                  className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-zinc-200 transition shadow"
                  title="Stop generating"
                >
                  <Square className="w-3.5 h-3.5 fill-black" />
                </button>
              ) : (
                <button
                  type="button"
                  id="chatgpt-send-btn"
                  disabled={!hasContent}
                  onClick={handleSubmit}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    hasContent
                      ? "bg-white text-black hover:bg-zinc-200 shadow-md cursor-pointer scale-100"
                      : "bg-[#424242] text-zinc-500 cursor-not-allowed scale-95"
                  }`}
                  title="Send prompt"
                >
                  <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Persona Guidance & Capability Hint */}
        <div className="mt-1.5 flex items-center justify-between px-2 text-[11px] text-zinc-400">
          <span className="truncate max-w-[80%] flex items-center gap-1.5">
            <CurrentIcon className={`w-3 h-3 ${currentAgentMeta.color} shrink-0`} />
            <span className="truncate">{currentAgentMeta.hint}</span>
          </span>

          {currentAgentId !== "auto" && onSelectAgent && (
            <button
              type="button"
              onClick={() => onSelectAgent("auto")}
              className="text-amber-400 hover:text-amber-300 transition shrink-0 underline decoration-amber-500/30"
              title="Return to automatic intent classification"
            >
              Reset to Auto
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};

