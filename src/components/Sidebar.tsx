import React, { useState } from "react";
import { 
  MessageSquarePlus, 
  Bot, 
  Database, 
  Brain, 
  Activity, 
  Settings as SettingsIcon, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Sparkles, 
  ChevronRight,
  User,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import { Conversation, UserProfile } from "../types.js";

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onDeleteConversation: (id: string) => void;
  onOpenAgentsModal: () => void;
  onOpenDocsModal: () => void;
  onOpenMemoryModal: () => void;
  onOpenAnalyticsModal: () => void;
  onOpenSettingsModal: () => void;
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onSwitchUser: (userId: string) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onRenameConversation,
  onDeleteConversation,
  onOpenAgentsModal,
  onOpenDocsModal,
  onOpenMemoryModal,
  onOpenAnalyticsModal,
  onOpenSettingsModal,
  currentUser,
  allUsers,
  onSwitchUser,
  isOpen,
  onToggleOpen
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const startRename = (conv: Conversation) => {
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const saveRename = (id: string) => {
    if (editTitle.trim()) {
      onRenameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  if (!isOpen) {
    return (
      <div className="hidden sm:flex flex-col items-center py-4 px-2 bg-zinc-950 border-r border-zinc-800/80 w-16 h-screen justify-between shrink-0">
        <div className="flex flex-col items-center gap-4">
          <button
            id="expand-sidebar-btn"
            onClick={onToggleOpen}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-850 hover:bg-zinc-900 transition"
            title="Expand Sidebar"
          >
            <PanelLeftOpen className="w-5 h-5 text-blue-400" />
          </button>

          <button
            id="quick-new-chat-btn"
            onClick={() => onNewConversation()}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md transition"
            title="New Conversation"
          >
            <MessageSquarePlus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-2">
          <button
            onClick={onOpenAgentsModal}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
            title="Specialized Agents"
          >
            <Bot className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenDocsModal}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
            title="Knowledge Base & RAG"
          >
            <Database className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenMemoryModal}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
            title="Persistent Memory"
          >
            <Brain className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenAnalyticsModal}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
            title="Observability Telemetry"
          >
            <Activity className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenSettingsModal}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
            title="Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <aside 
      id="main-sidebar"
      className="w-72 bg-zinc-950 border-r border-zinc-800/80 flex flex-col h-screen shrink-0 text-zinc-200 select-none z-30"
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              Genalpha AI
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                PRO
              </span>
            </h1>
            <p className="text-[10px] text-zinc-400 leading-none mt-0.5">Gemini • ChatGPT • Claude</p>
          </div>
        </div>

        <button
          id="collapse-sidebar-btn"
          onClick={onToggleOpen}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
          title="Collapse Sidebar"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          id="new-chat-btn"
          onClick={() => onNewConversation()}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-900/20 transition active:scale-[0.99]"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>New Conversation</span>
        </button>
      </div>

      {/* Navigation Links */}
      <div className="px-3 py-1 space-y-0.5 border-b border-zinc-800/60 pb-3">
        <button
          id="nav-agents-btn"
          onClick={onOpenAgentsModal}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-900 transition group"
        >
          <div className="flex items-center gap-2.5">
            <Bot className="w-4 h-4 text-blue-400" />
            <span>7 Specialized Agents</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300 transition" />
        </button>

        <button
          id="nav-docs-btn"
          onClick={onOpenDocsModal}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-900 transition group"
        >
          <div className="flex items-center gap-2.5">
            <Database className="w-4 h-4 text-purple-400" />
            <span>Knowledge Base & RAG</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300 transition" />
        </button>

        <button
          id="nav-memory-btn"
          onClick={onOpenMemoryModal}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-900 transition group"
        >
          <div className="flex items-center gap-2.5">
            <Brain className="w-4 h-4 text-indigo-400" />
            <span>Persistent Memory</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300 transition" />
        </button>

        <button
          id="nav-analytics-btn"
          onClick={onOpenAnalyticsModal}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-900 transition group"
        >
          <div className="flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Observability Telemetry</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300 transition" />
        </button>

        <button
          id="nav-settings-btn"
          onClick={onOpenSettingsModal}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-900 transition group"
        >
          <div className="flex items-center gap-2.5">
            <SettingsIcon className="w-4 h-4 text-zinc-400" />
            <span>Platform Settings</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300 transition" />
        </button>
      </div>

      {/* Conversations History List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        <div className="flex items-center justify-between px-2 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
          <span>Recent Chats</span>
          <span>{conversations.length}</span>
        </div>

        {conversations.map((conv) => {
          const isActive = activeConversationId === conv.id;
          const isEditing = editingId === conv.id;

          return (
            <div
              key={conv.id}
              id={`conv-item-${conv.id}`}
              onClick={() => !isEditing && onSelectConversation(conv.id)}
              className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition ${
                isActive
                  ? "bg-zinc-800/90 text-white font-medium shadow-sm border border-zinc-700/60"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
              }`}
            >
              {isEditing ? (
                <div className="flex items-center gap-1.5 w-full" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-0.5 text-xs text-white focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => saveRename(conv.id)}
                    className="p-1 rounded text-emerald-400 hover:bg-zinc-700"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-1 rounded text-zinc-400 hover:bg-zinc-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="truncate flex-1 pr-2">
                    <p className="truncate">{conv.title}</p>
                    <span className="text-[10px] text-zinc-400 capitalize">{conv.pinnedAgentId}</span>
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 shrink-0 transition">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startRename(conv);
                      }}
                      className="p-1 rounded hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200"
                      title="Rename"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    {conversations.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteConversation(conv.id);
                        }}
                        className="p-1 rounded hover:bg-zinc-700 text-zinc-400 hover:text-rose-400"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* User Account Switcher in Footer */}
      <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Active Profile</span>
        </div>
        <select
          value={currentUser.id}
          onChange={(e) => onSwitchUser(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {allUsers.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.role.toUpperCase()})
            </option>
          ))}
        </select>
        <div className="mt-2 flex items-center gap-2 text-[11px] text-zinc-400 truncate">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="truncate">{currentUser.title}</span>
        </div>
      </div>
    </aside>
  );
};
