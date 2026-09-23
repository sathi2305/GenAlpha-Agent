import React, { useState, useEffect, useRef } from "react";
import { 
  Sidebar 
} from "./components/Sidebar.js";
import { 
  AgentSelector 
} from "./components/AgentSelector.js";
import { 
  MessageItem 
} from "./components/MessageItem.js";
import { 
  ChatInput 
} from "./components/ChatInput.js";
import { 
  WelcomeView 
} from "./components/WelcomeView.js";
import { 
  FeedbackModal 
} from "./components/FeedbackModal.js";
import { 
  AgentsModal 
} from "./components/AgentsModal.js";
import { 
  DocumentsModal 
} from "./components/DocumentsModal.js";
import { 
  MemoryModal 
} from "./components/MemoryModal.js";
import { 
  AnalyticsModal 
} from "./components/AnalyticsModal.js";
import { 
  SettingsModal 
} from "./components/SettingsModal.js";
import { 
  AgentId, 
  ChatMessage, 
  Conversation, 
  DocumentRecord, 
  ModelEngine,
  UserMemory, 
  UserProfile 
} from "./types.js";
import { 
  Sparkles, 
  RotateCcw, 
  ShieldCheck, 
  Activity, 
  Menu
} from "lucide-react";

export default function App() {
  // User profile state
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: "usr_alex",
    name: "Alex Chen",
    email: "alex.chen@academic.edu",
    role: "student",
    title: "Computer Science Senior & Project Builder",
    settings: {
      defaultAgentId: "auto",
      voiceEnabled: true,
      autoVoicePlayback: false,
      streamResponses: true,
      safetyStrictness: "high",
      theme: "dark"
    }
  });

  // Conversations & Chat
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentAgentId, setCurrentAgentId] = useState<AgentId>("auto");
  const [currentModelEngine, setCurrentModelEngine] = useState<ModelEngine>("gemini");

  // Streaming & Orchestration
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<ChatMessage | null>(null);
  const [currentStatus, setCurrentStatus] = useState<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);

  // Modals
  const [agentsModalOpen, setAgentsModalOpen] = useState(false);
  const [docsModalOpen, setDocsModalOpen] = useState(false);
  const [memoryModalOpen, setMemoryModalOpen] = useState(false);
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Feedback Modal
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackTargetMessageId, setFeedbackTargetMessageId] = useState<string | null>(null);
  const [feedbackRating, setFeedbackRating] = useState<'positive' | 'negative' | null>(null);

  // RAG & Memory Stores
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [memories, setMemories] = useState<UserMemory[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingMessage]);

  // Initial Data Fetching
  useEffect(() => {
    const initApp = async () => {
      try {
        const [usersRes, convsRes, docsRes, memsRes] = await Promise.all([
          fetch("/api/v1/users"),
          fetch(`/api/v1/conversations?userId=${currentUser.id}`),
          fetch(`/api/v1/documents?userId=${currentUser.id}`),
          fetch(`/api/v1/memory?userId=${currentUser.id}`)
        ]);

        if (usersRes.ok) {
          const { users } = await usersRes.json();
          setAllUsers(users);
          const found = users.find((u: UserProfile) => u.id === currentUser.id);
          if (found) setCurrentUser(found);
        }

        if (convsRes.ok) {
          const { conversations: convList } = await convsRes.json();
          setConversations(convList);
          if (convList.length > 0) {
            setActiveConversationId(convList[0].id);
            setCurrentAgentId(convList[0].pinnedAgentId);
            loadConversationMessages(convList[0].id);
          } else {
            handleNewConversation();
          }
        }

        if (docsRes.ok) {
          const { documents: docList } = await docsRes.json();
          setDocuments(docList);
        }

        if (memsRes.ok) {
          const { memories: memList } = await memsRes.json();
          setMemories(memList);
        }
      } catch (err) {
        console.error("Initialization error:", err);
      }
    };

    initApp();
  }, [currentUser.id]);

  const loadConversationMessages = async (convId: string) => {
    try {
      const res = await fetch(`/api/v1/conversations/${convId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
        if (data.conversation?.pinnedAgentId) {
          setCurrentAgentId(data.conversation.pinnedAgentId);
        }
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    const conv = conversations.find(c => c.id === id);
    if (conv) {
      setCurrentAgentId(conv.pinnedAgentId);
    }
    loadConversationMessages(id);
  };

  const handleNewConversation = async (initialTitle?: any, pinnedAgent?: any) => {
    try {
      const safeTitle = typeof initialTitle === "string" && initialTitle.trim() 
        ? initialTitle.trim() 
        : "New Conversation";
      const safeAgent = typeof pinnedAgent === "string" ? (pinnedAgent as AgentId) : "auto";

      const res = await fetch("/api/v1/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          title: safeTitle,
          pinnedAgentId: safeAgent
        })
      });
      if (res.ok) {
        const { conversation } = await res.json();
        setConversations(prev => [conversation, ...prev]);
        setActiveConversationId(conversation.id);
        setCurrentAgentId(safeAgent);
        setMessages([]);
      }
    } catch (err) {
      console.error("Failed to create conversation:", err);
    }
  };

  const handleRenameConversation = async (id: string, newTitle: string) => {
    try {
      const res = await fetch(`/api/v1/conversations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle })
      });
      if (res.ok) {
        setConversations(prev =>
          prev.map(c => (c.id === id ? { ...c, title: newTitle } : c))
        );
      }
    } catch (err) {
      console.error("Failed to rename conversation:", err);
    }
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      await fetch(`/api/v1/conversations/${id}`, { method: "DELETE" });
      const updated = conversations.filter(c => c.id !== id);
      setConversations(updated);
      if (activeConversationId === id) {
        if (updated.length > 0) {
          handleSelectConversation(updated[0].id);
        } else {
          handleNewConversation();
        }
      }
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    }
  };

  // Streaming Multi-Agent Chat Invocation
  const handleSendMessage = async (
    text: string, 
    fileData?: { filename: string; content: string; mimeType: string }
  ) => {
    if (!text.trim() && !fileData) return;

    let targetConvId = activeConversationId;
    if (!targetConvId) {
      // Auto create new conversation
      const promptSnippet = text.slice(0, 30);
      const res = await fetch("/api/v1/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          title: promptSnippet || "New Chat",
          pinnedAgentId: currentAgentId
        })
      });
      const data = await res.json();
      targetConvId = data.conversation.id;
      setConversations(prev => [data.conversation, ...prev]);
      setActiveConversationId(targetConvId);
    }

    // If file was attached, store it in RAG first so it's indexed!
    if (fileData) {
      try {
        const docRes = await fetch("/api/v1/documents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUser.id,
            filename: fileData.filename,
            content: fileData.content,
            mimeType: fileData.mimeType
          })
        });
        if (docRes.ok) {
          const { document } = await docRes.json();
          setDocuments(prev => [document, ...prev]);
        }
      } catch (docErr) {
        console.warn("Could not auto-index attached file into RAG:", docErr);
      }
    }

    const userMessage: ChatMessage = {
      id: `msg_usr_${Date.now()}`,
      conversationId: targetConvId,
      role: "user",
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsGenerating(true);
    setCurrentStatus("AI Orchestrator analyzing intent & selecting agent...");

    const tempStreamingMsg: ChatMessage = {
      id: `msg_ast_stream_${Date.now()}`,
      conversationId: targetConvId,
      role: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
      agentId: currentAgentId === "auto" ? "general" : currentAgentId
    };
    setStreamingMessage(tempStreamingMsg);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch("/api/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: targetConvId,
          userId: currentUser.id,
          message: text,
          pinnedAgentId: currentAgentId,
          modelEngine: currentModelEngine
        }),
        signal: controller.signal
      });

      if (!response.ok || !response.body) {
        throw new Error(`Server returned ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let accumulatedText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const block of lines) {
          if (!block.trim()) continue;

          let eventName = "message";
          let dataStr = "";

          for (const line of block.split("\n")) {
            if (line.startsWith("event: ")) {
              eventName = line.replace("event: ", "").trim();
            } else if (line.startsWith("data: ")) {
              dataStr = line.replace("data: ", "").trim();
            }
          }

          if (!dataStr) continue;

          try {
            const data = JSON.parse(dataStr);

            if (eventName === "status") {
              setCurrentStatus(data.message || "");
            } else if (eventName === "route_selected") {
              setStreamingMessage(prev => prev ? ({
                ...prev,
                agentId: data.routing?.agentId,
                routing: data.routing,
                toolExecutions: data.toolExecutions,
                citations: data.citations
              }) : null);
            } else if (eventName === "token") {
              accumulatedText += data.token;
              setStreamingMessage(prev => prev ? ({
                ...prev,
                content: accumulatedText
              }) : null);
            } else if (eventName === "done") {
              const finalAssistantMsg: ChatMessage = {
                id: data.messageId || `msg_ast_${Date.now()}`,
                conversationId: targetConvId,
                role: "assistant",
                content: accumulatedText,
                timestamp: new Date().toISOString(),
                agentId: streamingMessage?.agentId || "general",
                modelEngine: data.modelEngine || currentModelEngine,
                routing: streamingMessage?.routing,
                toolExecutions: streamingMessage?.toolExecutions,
                citations: streamingMessage?.citations,
                metrics: {
                  latencyMs: data.latencyMs,
                  tokensEstimated: data.tokensEstimated
                }
              };

              setMessages(prev => [...prev, finalAssistantMsg]);
              setStreamingMessage(null);
              setIsGenerating(false);
              setCurrentStatus("");

              // Optional auto voice playback
              if (currentUser.settings.autoVoicePlayback && ('speechSynthesis' in window)) {
                const utterance = new SpeechSynthesisUtterance(accumulatedText.slice(0, 300));
                window.speechSynthesis.speak(utterance);
              }
            } else if (eventName === "error") {
              console.error("Stream error event:", data.message);
              setCurrentStatus(`Error: ${data.message}`);
              setIsGenerating(false);
            }
          } catch (jsonErr) {
            console.warn("Could not parse SSE JSON block:", jsonErr);
          }
        }
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Chat stream aborted by user.");
      } else {
        console.error("Fetch chat error:", err);
      }
      setIsGenerating(false);
      setStreamingMessage(null);
      setCurrentStatus("");
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
      if (streamingMessage && streamingMessage.content) {
        setMessages(prev => [...prev, streamingMessage]);
      }
      setStreamingMessage(null);
      setCurrentStatus("");
    }
  };

  // Feedback handling
  const handleOpenFeedback = (messageId: string, rating: 'positive' | 'negative') => {
    setFeedbackTargetMessageId(messageId);
    setFeedbackRating(rating);
    setFeedbackModalOpen(true);
  };

  const handleSubmitFeedback = async (messageId: string, rating: 'positive' | 'negative', comment: string) => {
    try {
      await fetch("/api/v1/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, rating, comment })
      });
      setMessages(prev =>
        prev.map(m =>
          m.id === messageId ? { ...m, feedback: { rating, comment, submittedAt: new Date().toISOString() } } : m
        )
      );
    } catch (err) {
      console.error("Failed to submit feedback:", err);
    }
  };

  const handleRegenerate = (messageId: string) => {
    const msgIndex = messages.findIndex(m => m.id === messageId);
    if (msgIndex > 0) {
      for (let i = msgIndex - 1; i >= 0; i--) {
        if (messages[i].role === "user") {
          handleSendMessage(messages[i].content);
          break;
        }
      }
    }
  };

  // Documents RAG Actions
  const handleUploadDocument = async (filename: string, content: string) => {
    const res = await fetch("/api/v1/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: currentUser.id,
        filename,
        content
      })
    });
    if (res.ok) {
      const { document } = await res.json();
      setDocuments(prev => [document, ...prev]);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    await fetch(`/api/v1/documents/${docId}`, { method: "DELETE" });
    setDocuments(prev => prev.filter(d => d.id !== docId));
  };

  // Memory Actions
  const handleAddMemory = async (category: UserMemory['category'], key: string, value: string) => {
    const res = await fetch("/api/v1/memory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: currentUser.id,
        category,
        key,
        value
      })
    });
    if (res.ok) {
      const { memory } = await res.json();
      setMemories(prev => [memory, ...prev]);
    }
  };

  const handleDeleteMemory = async (memoryId: string) => {
    await fetch(`/api/v1/memory/${memoryId}?userId=${currentUser.id}`, { method: "DELETE" });
    setMemories(prev => prev.filter(m => m.id !== memoryId));
  };

  // User Settings Update
  const handleUpdateSettings = async (settings: Partial<UserProfile['settings']>) => {
    const updated = { ...currentUser.settings, ...settings };
    setCurrentUser(prev => ({ ...prev, settings: updated }));
    await fetch(`/api/v1/users/${currentUser.id}/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    });
  };

  const handleSwitchUser = (userId: string) => {
    const target = allUsers.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      setCurrentAgentId(target.settings.defaultAgentId || "auto");
    }
  };

  return (
    <div id="unified-assistant-app" className="flex h-screen w-full bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={() => handleNewConversation("New Conversation", currentAgentId)}
        onRenameConversation={handleRenameConversation}
        onDeleteConversation={handleDeleteConversation}
        onOpenAgentsModal={() => setAgentsModalOpen(true)}
        onOpenDocsModal={() => setDocsModalOpen(true)}
        onOpenMemoryModal={() => setMemoryModalOpen(true)}
        onOpenAnalyticsModal={() => setAnalyticsModalOpen(true)}
        onOpenSettingsModal={() => setSettingsModalOpen(true)}
        currentUser={currentUser}
        allUsers={allUsers}
        onSwitchUser={handleSwitchUser}
        isOpen={sidebarOpen}
        onToggleOpen={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Chat Workspace */}
      <main className="flex-1 flex flex-col h-screen min-w-0 bg-zinc-950 relative overflow-hidden">
        {/* Mobile / Responsive Top Nav */}
        <div className="sm:hidden flex items-center justify-between p-3 border-b border-zinc-800 bg-zinc-900/80">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Genalpha AI
          </span>
          <button
            onClick={() => setAnalyticsModalOpen(true)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
          >
            <Activity className="w-4 h-4 text-emerald-400" />
          </button>
        </div>

        {/* Agent Selector Bar */}
        <AgentSelector
          currentAgentId={currentAgentId}
          onSelectAgent={(agentId) => setCurrentAgentId(agentId)}
          currentModelEngine={currentModelEngine}
          onSelectModelEngine={(engine) => setCurrentModelEngine(engine)}
          onOpenAgentsModal={() => setAgentsModalOpen(true)}
          onNewChat={() => handleNewConversation("New Conversation", currentAgentId)}
          onOpenAnalyticsModal={() => setAnalyticsModalOpen(true)}
        />

        {/* Message Thread Scroll Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 && !streamingMessage ? (
            <WelcomeView
              onQuickPrompt={(prompt, agentId) => {
                if (agentId) setCurrentAgentId(agentId);
                handleSendMessage(prompt);
              }}
              onOpenAgentsModal={() => setAgentsModalOpen(true)}
            />
          ) : (
            <div className="divide-y divide-zinc-850/30">
              {messages.map((msg) => (
                <MessageItem
                  key={msg.id}
                  message={msg}
                  onOpenFeedback={handleOpenFeedback}
                  onSelectDocumentSnippet={(docId) => {
                    setDocsModalOpen(true);
                  }}
                  onRegenerate={handleRegenerate}
                  onSelectAgent={(agentId) => setCurrentAgentId(agentId)}
                  currentAgentId={currentAgentId}
                />
              ))}

              {/* Live Streaming Message */}
              {streamingMessage && (
                <MessageItem
                  message={streamingMessage}
                  onOpenFeedback={() => {}}
                  onSelectAgent={(agentId) => setCurrentAgentId(agentId)}
                  currentAgentId={currentAgentId}
                />
              )}

              {/* Status Indicator */}
              {isGenerating && currentStatus && (
                <div className="py-3 px-6 max-w-4xl mx-auto flex items-center gap-2 text-xs text-blue-400 animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>{currentStatus}</span>
                </div>
              )}

              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>

        {/* Chat Input Bar */}
        <ChatInput
          onSendMessage={handleSendMessage}
          isGenerating={isGenerating}
          onStopGeneration={handleStopGeneration}
          currentAgentId={currentAgentId}
          onSelectAgent={(agentId) => setCurrentAgentId(agentId)}
          currentModelEngine={currentModelEngine}
          onSelectModelEngine={(engine) => setCurrentModelEngine(engine)}
        />
      </main>

      {/* Modals */}
      <AgentsModal
        isOpen={agentsModalOpen}
        onClose={() => setAgentsModalOpen(false)}
        onSelectAgent={(agentId, prompt) => {
          setCurrentAgentId(agentId);
          if (prompt) {
            handleSendMessage(prompt);
          }
        }}
      />

      <DocumentsModal
        isOpen={docsModalOpen}
        onClose={() => setDocsModalOpen(false)}
        documents={documents}
        onUploadDocument={handleUploadDocument}
        onDeleteDocument={handleDeleteDocument}
        onQueryDocument={(query) => handleSendMessage(query)}
      />

      <MemoryModal
        isOpen={memoryModalOpen}
        onClose={() => setMemoryModalOpen(false)}
        memories={memories}
        onAddMemory={handleAddMemory}
        onDeleteMemory={handleDeleteMemory}
      />

      <AnalyticsModal
        isOpen={analyticsModalOpen}
        onClose={() => setAnalyticsModalOpen(false)}
      />

      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        currentUser={currentUser}
        onUpdateSettings={handleUpdateSettings}
      />

      <FeedbackModal
        isOpen={feedbackModalOpen}
        messageId={feedbackTargetMessageId}
        initialRating={feedbackRating}
        onClose={() => setFeedbackModalOpen(false)}
        onSubmit={handleSubmitFeedback}
      />
    </div>
  );
}
