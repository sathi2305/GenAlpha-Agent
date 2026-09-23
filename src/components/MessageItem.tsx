import React, { useState } from "react";
import { 
  Bot, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  ThumbsUp, 
  ThumbsDown, 
  ChevronDown, 
  ChevronRight, 
  RotateCw,
  Sparkles,
  FileText,
  Wrench,
  GraduationCap,
  HeartPulse,
  ShieldAlert,
  FlameKindling,
  Briefcase,
  Trophy
} from "lucide-react";
import { ChatMessage, AgentId } from "../types.js";

interface MessageItemProps {
  message: ChatMessage;
  onOpenFeedback: (messageId: string, rating: 'positive' | 'negative') => void;
  onSelectDocumentSnippet?: (docId: string, chunkIndex: number) => void;
  onRegenerate?: (messageId: string) => void;
  onSelectAgent?: (agentId: AgentId) => void;
  currentAgentId?: AgentId;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  onOpenFeedback,
  onSelectDocumentSnippet,
  onRegenerate,
  onSelectAgent,
  currentAgentId
}) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showThoughtProcess, setShowThoughtProcess] = useState(false);
  const [showTools, setShowTools] = useState(false);

  const isUser = message.role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = message.content.replace(/[#*`_~>\-]/g, " ").replace(/\s+/g, " ");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const getAgentIcon = (agentId?: AgentId) => {
    switch (agentId) {
      case "student": return <GraduationCap className="w-4 h-4 text-purple-400" />;
      case "healthcare": return <HeartPulse className="w-4 h-4 text-emerald-400" />;
      case "cybersecurity": return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case "emergency": return <FlameKindling className="w-4 h-4 text-amber-400" />;
      case "career": return <Briefcase className="w-4 h-4 text-cyan-400" />;
      case "hackathon": return <Trophy className="w-4 h-4 text-pink-400" />;
      default: return <Sparkles className="w-4 h-4 text-emerald-400" />;
    }
  };

  // Safe markdown renderer with ChatGPT code-block styling
  const renderContent = (content: string) => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLanguage = "";
    let codeLines: string[] = [];

    lines.forEach((line, idx) => {
      if (line.startsWith("```")) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.replace("```", "").trim() || "code";
          codeLines = [];
        } else {
          inCodeBlock = false;
          const codeString = codeLines.join("\n");
          elements.push(
            <div key={`code-${idx}`} className="my-3 rounded-xl overflow-hidden border border-zinc-800 bg-[#1e1e1e]">
              <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] text-xs text-zinc-400 border-b border-zinc-700/60 font-mono">
                <span>{codeLanguage}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(codeString);
                  }}
                  className="flex items-center gap-1.5 hover:text-white transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy code</span>
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-zinc-200 overflow-x-auto leading-relaxed">
                <code>{codeString}</code>
              </pre>
            </div>
          );
        }
        return;
      }

      if (inCodeBlock) {
        codeLines.push(line);
        return;
      }

      // Headers
      if (line.startsWith("### ")) {
        elements.push(<h3 key={idx} className="text-base font-semibold text-zinc-100 mt-4 mb-2">{line.replace("### ", "")}</h3>);
        return;
      }
      if (line.startsWith("#### ")) {
        elements.push(<h4 key={idx} className="text-sm font-semibold text-zinc-200 mt-3 mb-1.5">{line.replace("#### ", "")}</h4>);
        return;
      }
      if (line.startsWith("##### ")) {
        elements.push(<h5 key={idx} className="text-xs font-semibold text-zinc-300 mt-2 mb-1 uppercase tracking-wider">{line.replace("##### ", "")}</h5>);
        return;
      }

      // Blockquote
      if (line.startsWith("> ")) {
        elements.push(
          <blockquote key={idx} className="border-l-2 border-emerald-500/80 bg-zinc-900/60 px-3.5 py-2 my-2 text-xs text-zinc-300 rounded-r">
            {line.replace("> ", "")}
          </blockquote>
        );
        return;
      }

      // Checkbox
      if (line.startsWith("- [ ] ") || line.startsWith("- [x] ")) {
        const checked = line.startsWith("- [x] ");
        elements.push(
          <div key={idx} className="flex items-center gap-2 text-sm text-zinc-300 my-1">
            <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] border ${checked ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "border-zinc-600 bg-zinc-800"}`}>
              {checked ? "✓" : ""}
            </span>
            <span>{line.replace(/- \[[ x]\] /, "")}</span>
          </div>
        );
        return;
      }

      // Bullets
      if (line.startsWith("- ") || line.startsWith("* ")) {
        elements.push(
          <li key={idx} className="text-sm text-zinc-300 ml-4 list-disc my-1">
            {renderInline(line.substring(2))}
          </li>
        );
        return;
      }

      // Empty line
      if (!line.trim()) {
        elements.push(<div key={idx} className="h-2" />);
        return;
      }

      // Regular paragraph
      elements.push(
        <p key={idx} className="text-sm text-zinc-300 leading-relaxed my-1">
          {renderInline(line)}
        </p>
      );
    });

    return elements;
  };

  const renderInline = (text: string) => {
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-semibold text-zinc-100">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return <code key={i} className="bg-zinc-800 text-emerald-300 text-xs px-1.5 py-0.5 rounded font-mono border border-zinc-700/60">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  return (
    <div 
      id={`message-${message.id}`}
      className="py-4 px-4 sm:px-6 transition-colors group"
    >
      <div className="max-w-3xl mx-auto">
        {isUser ? (
          /* ChatGPT User Bubble (Right-Aligned Pill Container) */
          <div className="flex justify-end">
            <div className="max-w-[85%] sm:max-w-[75%] bg-[#2f2f2f] text-zinc-100 rounded-3xl px-4 py-2.5 text-sm leading-relaxed shadow-sm">
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ) : (
          /* ChatGPT Assistant Message (Clean Full Width with avatar & action bar) */
          <div className="flex gap-3.5">
            {/* Assistant Avatar */}
            <div className="shrink-0 mt-0.5">
              <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700/60 flex items-center justify-center shadow-sm">
                {getAgentIcon(message.agentId)}
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 min-w-0">
              {/* Genalpha Thought & Multi-Model Routing Accordion */}
              {message.routing && (
                <div className="mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => setShowThoughtProcess(!showThoughtProcess)}
                      className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition bg-zinc-900/60 hover:bg-zinc-800/60 px-2.5 py-1 rounded-full border border-zinc-800"
                    >
                      <Sparkles className="w-3 h-3 text-blue-400" />
                      <span className="font-semibold text-zinc-300">Genalpha</span>
                      <span className="text-zinc-600">•</span>
                      <span className={
                        message.modelEngine === "chatgpt" ? "text-emerald-400 font-medium" :
                        message.modelEngine === "claude" ? "text-amber-400 font-medium" :
                        "text-blue-400 font-medium"
                      }>
                        {message.modelEngine === "chatgpt" ? "ChatGPT" : message.modelEngine === "claude" ? "Claude" : "Gemini"}
                      </span>
                      <span className="text-zinc-600">•</span>
                      <span>{message.routing.agentName}</span>
                      {showThoughtProcess ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </button>

                    {onSelectAgent && message.agentId && currentAgentId !== message.agentId && (
                      <button
                        onClick={() => onSelectAgent(message.agentId!)}
                        className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 px-2 py-0.5 rounded-full border border-zinc-800 transition"
                        title={`Pin ${message.routing.agentName} for subsequent prompts`}
                      >
                        <span>Pin persona</span>
                      </button>
                    )}
                  </div>

                  {showThoughtProcess && (
                    <div className="mt-2 p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 space-y-1.5 animate-in fade-in duration-150">
                      <p><span className="text-zinc-300 font-medium">Intent Identified:</span> {message.routing.detectedIntent}</p>
                      <p><span className="text-zinc-300 font-medium">Routing Rationale:</span> {message.routing.reasoning}</p>
                      {message.routing.matchedSignals && message.routing.matchedSignals.length > 0 && (
                        <p>
                          <span className="text-zinc-300 font-medium">Classification Signals:</span>{" "}
                          <span className="text-emerald-400 font-mono text-[11px]">{message.routing.matchedSignals.join(", ")}</span>
                        </p>
                      )}
                      {message.routing.diagnostics?.topRunnerUp && (
                        <p className="text-[11px] text-zinc-400">
                          <span className="text-zinc-400">Candidate Runner-up:</span>{" "}
                          <span className="text-zinc-300 capitalize">{message.routing.diagnostics.topRunnerUp.agentId}</span> (score: {message.routing.diagnostics.topRunnerUp.score})
                        </p>
                      )}
                      {message.routing.toolsUsed.length > 0 && (
                        <p className="text-blue-400 flex items-center gap-1.5 pt-1">
                          <Wrench className="w-3 h-3" />
                          <span>Specialized Tools Executed: {message.routing.toolsUsed.join(", ")}</span>
                        </p>
                      )}

                      {/* User-friendly quick switch controls */}
                      {onSelectAgent && message.agentId && (
                        <div className="pt-2 mt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
                          <span className="text-zinc-400">Agent Handling:</span>
                          <div className="flex items-center gap-2">
                            {currentAgentId !== message.agentId ? (
                              <button
                                onClick={() => onSelectAgent(message.agentId!)}
                                className="text-blue-400 hover:text-blue-300 font-medium transition"
                              >
                                Lock to {message.routing.agentName}
                              </button>
                            ) : (
                              <span className="text-emerald-400 font-medium">Currently Locked</span>
                            )}
                            <span className="text-zinc-650">•</span>
                            <button
                              onClick={() => onSelectAgent("auto")}
                              className="text-amber-400 hover:text-amber-300 font-medium transition"
                            >
                              Reset to Auto Router
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Tool Execution Box (if tools returned structured records) */}
              {message.toolExecutions && message.toolExecutions.length > 0 && (
                <div className="mb-3">
                  <button
                    onClick={() => setShowTools(!showTools)}
                    className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 mb-1.5"
                  >
                    <Wrench className="w-3 h-3" />
                    <span>{showTools ? "Hide tool artifacts" : `View tool artifacts (${message.toolExecutions.length})`}</span>
                  </button>

                  {showTools && (
                    <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 space-y-2 text-xs">
                      {message.toolExecutions.map((t, idx) => (
                        <div key={idx} className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/80">
                          <div className="flex justify-between text-zinc-300 font-medium mb-1 font-mono text-xs">
                            <span className="text-blue-400">{t.name}</span>
                            <span className="text-zinc-400">{t.executionTimeMs}ms</span>
                          </div>
                          <p className="text-zinc-400 text-[11px] mb-1">{t.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Formatted Markdown Content */}
              <div className="text-zinc-100">
                {renderContent(message.content)}
              </div>

              {/* RAG Knowledge Citations */}
              {message.citations && message.citations.length > 0 && (
                <div className="mt-3 pt-2 flex flex-wrap gap-1.5">
                  {message.citations.map((c, cIdx) => (
                    <button
                      key={cIdx}
                      onClick={() => onSelectDocumentSnippet?.(c.documentId, c.chunkIndex)}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition"
                      title={c.snippet}
                    >
                      <FileText className="w-3 h-3 text-purple-400" />
                      <span className="truncate max-w-[140px]">{c.filename}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* ChatGPT Signature Action Row */}
              <div className="flex items-center gap-1.5 mt-3 text-zinc-400">
                <button
                  id={`copy-btn-${message.id}`}
                  onClick={handleCopy}
                  className="p-1.5 rounded-md hover:bg-zinc-800 hover:text-zinc-200 transition"
                  title="Copy response"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                <button
                  id={`speak-btn-${message.id}`}
                  onClick={handleSpeak}
                  className="p-1.5 rounded-md hover:bg-zinc-800 hover:text-zinc-200 transition"
                  title={isSpeaking ? "Stop voice" : "Read aloud"}
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>

                <button
                  id={`thumbs-up-btn-${message.id}`}
                  onClick={() => onOpenFeedback(message.id, 'positive')}
                  className={`p-1.5 rounded-md hover:bg-zinc-800 transition ${
                    message.feedback?.rating === 'positive' ? 'text-emerald-400' : 'hover:text-zinc-200'
                  }`}
                  title="Good response"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>

                <button
                  id={`thumbs-down-btn-${message.id}`}
                  onClick={() => onOpenFeedback(message.id, 'negative')}
                  className={`p-1.5 rounded-md hover:bg-zinc-800 transition ${
                    message.feedback?.rating === 'negative' ? 'text-rose-400' : 'hover:text-zinc-200'
                  }`}
                  title="Bad response"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>

                {onRegenerate && (
                  <button
                    id={`regenerate-btn-${message.id}`}
                    onClick={() => onRegenerate(message.id)}
                    className="p-1.5 rounded-md hover:bg-zinc-800 hover:text-zinc-200 transition ml-1"
                    title="Regenerate response"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
