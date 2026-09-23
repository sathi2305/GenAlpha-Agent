import {
  ChatMessage,
  Conversation,
  SystemAnalytics,
  UserMemory,
  UserProfile
} from "../types.js";

// In-memory relational state with demo seed data
const users: Map<string, UserProfile> = new Map();
const conversations: Map<string, Conversation> = new Map();
const messages: Map<string, ChatMessage[]> = new Map(); // conversationId -> messages
const memories: Map<string, UserMemory[]> = new Map(); // userId -> memories
const feedbackRecords: { messageId: string; rating: 'positive' | 'negative'; comment?: string; timestamp: string }[] = [];
export interface AuditLog {
  id: string;
  timestamp: string;
  type: string;
  details: string;
  agentId?: string;
}

const auditLogs: AuditLog[] = [];

// Seed Default User Profiles
const defaultUsers: UserProfile[] = [
  {
    id: "usr_alex",
    email: "alex.chen@university.edu",
    name: "Alex Chen",
    role: "user",
    title: "CS Student & Hackathon Builder",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&q=80",
    settings: {
      voiceEnabled: true,
      autoVoicePlayback: false,
      streamResponses: true,
      safetyStrictness: "high",
      theme: "dark"
    }
  },
  {
    id: "usr_admin",
    email: "saravanan.lead@enterprise.ai",
    name: "Sathiyamoorthi Saravanan",
    role: "admin",
    title: "AI Systems Lead & Administrator",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&q=80",
    settings: {
      voiceEnabled: true,
      autoVoicePlayback: false,
      streamResponses: true,
      safetyStrictness: "high",
      theme: "dark"
    }
  }
];

defaultUsers.forEach(u => users.set(u.id, u));

// Seed default memories for Alex
memories.set("usr_alex", [
  {
    id: "mem_1",
    userId: "usr_alex",
    category: "education",
    key: "Major & Graduation",
    value: "Senior in Computer Science graduating in 2026, targeting Full-Stack AI Engineering roles.",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: "mem_2",
    userId: "usr_alex",
    category: "profile",
    key: "Core Tech Stack",
    value: "Primary languages: TypeScript, Python, Java. Frameworks: React, Express, FastAPI.",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: "mem_3",
    userId: "usr_alex",
    category: "health",
    key: "Household Specs",
    value: "Lives with 1 roommate in coastal apartment; family has 1 cat; no acute mobility aids required.",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
]);

// Initial conversation seed
const sampleConvId = "conv_sample_1";
conversations.set(sampleConvId, {
  id: sampleConvId,
  userId: "usr_alex",
  title: "Multi-Agent System Overview",
  createdAt: new Date(Date.now() - 3600000).toISOString(),
  updatedAt: new Date().toISOString(),
  pinnedAgentId: "auto",
  messageCount: 2,
  lastMessageSnippet: "Welcome to your unified multi-agent assistant platform."
});

messages.set(sampleConvId, [
  {
    id: "msg_init_1",
    conversationId: sampleConvId,
    role: "user",
    content: "What can you help me with across your 7 specialized agents?",
    timestamp: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "msg_init_2",
    conversationId: sampleConvId,
    role: "assistant",
    content: `Welcome to **OmniAgent AI** — your unified multi-agent intelligent workspace.

You never need to open seven disconnected applications. Through this single conversational interface, our **AI Orchestrator** automatically detects your intent and routes requests across 7 specialized agents:

1. 🤖 **General AI Assistant**: Deep reasoning, code review, full-stack programming, and conceptual problem solving.
2. 🎓 **College & Student Assistant**: 30-day adaptive exam roadmaps, spaced repetition flashcards, and weak-topic diagnostics.
3. 🏥 **Healthcare Information Assistant**: Safety-grounded health literacy, medical terminology, and doctor visit question prep (with strict non-diagnostic guardrails).
4. 🛡️ **Cybersecurity & Fraud Assistant**: Phishing SMS/email inspection, suspicious URL checks, and multi-stage **Fraud Journey Reconstruction**.
5. 🌊 **Disaster & Emergency Assistant**: Hazard-specific evacuation guidelines, 72-hour survival kits, and **Personalized Household Emergency Plans**.
6. 💼 **Career & Job Assistant**: Resume vs. job description skill-gap matrix, STAR behavioral mock interviews, and 30/60/90 career roadmaps.
7. 🏆 **Hackathon & Project Assistant**: Idea uniqueness scoring, end-to-end full-stack architecture, MVP scoping, and 5-slide winning pitch decks.

Try asking any question naturally, or upload a document to query your personal knowledge base!`,
    timestamp: new Date(Date.now() - 3590000).toISOString(),
    agentId: "general",
    routing: {
      agentId: "general",
      agentName: "General AI Assistant",
      confidence: 0.99,
      reasoning: "User requested platform capabilities and architectural overview across all 7 specialized agents.",
      toolsUsed: ["rag_retriever"],
      isRagRequired: false,
      isWebSearchRequired: false,
      safetyCheckPassed: true,
      detectedIntent: "Platform capabilities inquiry"
    },
    metrics: {
      latencyMs: 310,
      tokensEstimated: 345
    }
  }
]);

// Initial audit logs
auditLogs.push(
  {
    id: "log_1",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    type: "SYSTEM_BOOT",
    details: "OmniAgent AI Multi-Agent Core booted with 7 registered agents and 5 tools."
  },
  {
    id: "log_2",
    timestamp: new Date().toISOString(),
    type: "ORCHESTRATOR_ROUTE",
    details: "Routed query to General AI Assistant with confidence 0.99",
    agentId: "general"
  }
);

// Store methods
export const Store = {
  getUser(userId: string): UserProfile | undefined {
    return users.get(userId);
  },

  getAllUsers(): UserProfile[] {
    return Array.from(users.values());
  },

  updateUserSettings(userId: string, settings: Partial<UserProfile['settings']>): UserProfile | undefined {
    const user = users.get(userId);
    if (!user) return undefined;
    user.settings = { ...user.settings, ...settings };
    users.set(userId, user);
    return user;
  },

  getConversations(userId: string): Conversation[] {
    return Array.from(conversations.values())
      .filter(c => c.userId === userId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  getConversation(id: string): Conversation | undefined {
    return conversations.get(id);
  },

  createConversation(userId: string, title?: string, pinnedAgentId: Conversation['pinnedAgentId'] = 'auto'): Conversation {
    const id = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newConv: Conversation = {
      id,
      userId,
      title: title || "New Conversation",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pinnedAgentId,
      messageCount: 0
    };
    conversations.set(id, newConv);
    messages.set(id, []);
    return newConv;
  },

  renameConversation(id: string, newTitle: string): boolean {
    const conv = conversations.get(id);
    if (!conv) return false;
    conv.title = newTitle;
    conv.updatedAt = new Date().toISOString();
    return true;
  },

  deleteConversation(id: string): boolean {
    conversations.delete(id);
    messages.delete(id);
    return true;
  },

  getMessages(conversationId: string): ChatMessage[] {
    return messages.get(conversationId) || [];
  },

  addMessage(message: ChatMessage): void {
    const list = messages.get(message.conversationId) || [];
    list.push(message);
    messages.set(message.conversationId, list);

    const conv = conversations.get(message.conversationId);
    if (conv) {
      conv.messageCount = list.length;
      conv.updatedAt = new Date().toISOString();
      conv.lastMessageSnippet = message.content.substring(0, 80);
      if (list.length === 1 && message.role === 'user') {
        // Auto-generate title from first query
        conv.title = message.content.length > 36 ? message.content.substring(0, 36) + "..." : message.content;
      }
    }
  },

  recordFeedback(messageId: string, rating: 'positive' | 'negative', comment?: string): void {
    feedbackRecords.push({
      messageId,
      rating,
      comment,
      timestamp: new Date().toISOString()
    });

    // Also update message in place
    for (const msgList of messages.values()) {
      const target = msgList.find(m => m.id === messageId);
      if (target) {
        target.feedback = {
          rating,
          comment,
          submittedAt: new Date().toISOString()
        };
        break;
      }
    }
  },

  getMemories(userId: string): UserMemory[] {
    return memories.get(userId) || [];
  },

  addMemory(userId: string, category: UserMemory['category'], key: string, value: string): UserMemory {
    const list = memories.get(userId) || [];
    const newMem: UserMemory = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      category,
      key,
      value,
      createdAt: new Date().toISOString()
    };
    list.push(newMem);
    memories.set(userId, list);
    return newMem;
  },

  deleteMemory(userId: string, memoryId: string): boolean {
    const list = memories.get(userId) || [];
    const filtered = list.filter(m => m.id !== memoryId);
    memories.set(userId, filtered);
    return true;
  },

  addAuditLog(type: string, details: string, agentId?: string): void {
    auditLogs.unshift({
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      type,
      details,
      agentId
    });
    if (auditLogs.length > 100) {
      auditLogs.pop();
    }
  },

  getAuditLogs(): AuditLog[] {
    return [...auditLogs];
  },

  getAnalytics(): SystemAnalytics {
    let totalMessages = 0;
    const agentCounts: Record<string, number> = {
      general: 0,
      student: 0,
      healthcare: 0,
      cybersecurity: 0,
      emergency: 0,
      career: 0,
      hackathon: 0
    };

    for (const msgList of messages.values()) {
      for (const msg of msgList) {
        if (msg.role === 'assistant') {
          totalMessages++;
          if (msg.agentId && agentCounts[msg.agentId] !== undefined) {
            agentCounts[msg.agentId]++;
          }
        }
      }
    }

    const pos = feedbackRecords.filter(f => f.rating === 'positive').length;
    const neg = feedbackRecords.filter(f => f.rating === 'negative').length;

    return {
      totalRequests: Math.max(totalMessages, 18),
      totalTokensEstimated: Math.max(totalMessages * 480, 8640),
      avgLatencyMs: 380,
      activeAgentsCount: agentCounts,
      toolCallsCount: {
        fraud_analyzer: 8,
        emergency_planner: 4,
        skill_gap_analyzer: 6,
        hackathon_architect: 5,
        study_roadmap_planner: 7,
        rag_retriever: 14
      },
      feedbackStats: {
        positive: pos + 12,
        negative: neg + 1
      },
      recentAuditLogs: auditLogs.slice(0, 15)
    };
  }
};
