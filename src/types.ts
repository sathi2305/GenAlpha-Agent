export type AgentId = 
  | 'auto'
  | 'general'
  | 'student'
  | 'healthcare'
  | 'cybersecurity'
  | 'emergency'
  | 'career'
  | 'hackathon';

export type ModelEngine = 'gemini' | 'chatgpt' | 'claude';

export interface AgentInfo {
  id: AgentId;
  name: string;
  shortName: string;
  icon: string;
  badge: string;
  tagline: string;
  description: string;
  color: string;
  accentBg: string;
  accentBorder: string;
  capabilities: string[];
  suggestedPrompts: string[];
  systemRole: string;
}

export interface RoutingDecision {
  agentId: AgentId;
  agentName: string;
  confidence: number;
  reasoning: string;
  toolsUsed: string[];
  isRagRequired: boolean;
  isWebSearchRequired: boolean;
  safetyCheckPassed: boolean;
  detectedIntent: string;
  modelEngine?: ModelEngine;
  classificationScores?: Record<string, number>;
  matchedSignals?: string[];
  diagnostics?: {
    rawScores: Record<string, number>;
    matchedKeywords: string[];
    topRunnerUp?: { agentId: string; score: number };
    processingTimeMs: number;
  };
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  filename: string;
  chunkIndex: number;
  totalChunks: number;
  content: string;
  metadata?: {
    page?: number;
    section?: string;
  };
}

export interface DocumentRecord {
  id: string;
  userId: string;
  filename: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  chunkCount: number;
  chunks: DocumentChunk[];
}

export interface Citation {
  documentId: string;
  filename: string;
  chunkIndex: number;
  snippet: string;
  score: number;
}

export interface ToolExecutionRecord {
  name: string;
  description: string;
  input: Record<string, any>;
  output: Record<string, any>;
  status: 'running' | 'success' | 'failed';
  executionTimeMs: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  agentId?: AgentId;
  modelEngine?: ModelEngine;
  routing?: RoutingDecision;
  toolExecutions?: ToolExecutionRecord[];
  citations?: Citation[];
  feedback?: {
    rating: 'positive' | 'negative';
    comment?: string;
    submittedAt?: string;
  };
  metrics?: {
    latencyMs: number;
    tokensEstimated?: number;
  };
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  pinnedAgentId: AgentId;
  messageCount: number;
  lastMessageSnippet?: string;
}

export interface UserMemory {
  id: string;
  userId: string;
  category: 'preference' | 'profile' | 'education' | 'security' | 'health' | 'career';
  key: string;
  value: string;
  createdAt: string;
  sourceMessageId?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'student';
  title?: string;
  avatar?: string;
  settings: {
    defaultAgentId?: AgentId;
    voiceEnabled: boolean;
    autoVoicePlayback: boolean;
    streamResponses: boolean;
    safetyStrictness: 'standard' | 'high';
    theme: 'light' | 'dark' | 'system';
  };
}

export interface SystemAnalytics {
  totalRequests: number;
  totalTokensEstimated: number;
  avgLatencyMs: number;
  activeAgentsCount: Record<string, number>;
  toolCallsCount: Record<string, number>;
  feedbackStats: {
    positive: number;
    negative: number;
  };
  recentAuditLogs: {
    id: string;
    timestamp: string;
    type: string;
    details: string;
    agentId?: string;
  }[];
}
