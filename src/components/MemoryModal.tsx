import React, { useState } from "react";
import { 
  X, 
  Brain, 
  Trash2, 
  Plus, 
  ShieldCheck, 
  GraduationCap, 
  HeartPulse, 
  Briefcase, 
  SlidersHorizontal,
  UserCheck
} from "lucide-react";
import { UserMemory } from "../types.js";

interface MemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  memories: UserMemory[];
  onAddMemory: (category: UserMemory['category'], key: string, value: string) => Promise<void>;
  onDeleteMemory: (memoryId: string) => Promise<void>;
}

export const MemoryModal: React.FC<MemoryModalProps> = ({
  isOpen,
  onClose,
  memories,
  onAddMemory,
  onDeleteMemory
}) => {
  const [newCategory, setNewCategory] = useState<UserMemory['category']>("profile");
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;

    setIsAdding(true);
    await onAddMemory(newCategory, newKey.trim(), newValue.trim());
    setIsAdding(false);
    setNewKey("");
    setNewValue("");
  };

  const getCategoryIcon = (category: UserMemory['category']) => {
    switch (category) {
      case "education": return <GraduationCap className="w-3.5 h-3.5 text-purple-400" />;
      case "health": return <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />;
      case "career": return <Briefcase className="w-3.5 h-3.5 text-cyan-400" />;
      case "preference": return <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />;
      default: return <UserCheck className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div 
        id="memory-manager-modal"
        className="w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-zinc-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/60">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-400" />
              Long-Term & Session Memory Store
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              User-scoped persistent facts enabling personalized learning, career alignment, and household emergency plans.
            </p>
          </div>
          <button
            id="close-memory-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Privacy Guarantee */}
          <div className="bg-indigo-950/30 border border-indigo-900/40 p-3.5 rounded-xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs text-zinc-300">
              <span className="font-semibold text-indigo-300">Auditable & User-Controlled:</span>
              <p className="mt-0.5 text-zinc-400">
                Memories are strictly bounded to your user profile. The orchestrator references these facts to ground recommendations without leaking data across sessions.
              </p>
            </div>
          </div>

          {/* Active Memories List */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
              Stored Facts & Context ({memories.length})
            </h3>

            {memories.length === 0 ? (
              <div className="text-center py-8 bg-zinc-950/40 rounded-xl border border-zinc-800">
                <Brain className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                <p className="text-xs text-zinc-400">No persistent memories saved yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {memories.map((mem) => (
                  <div
                    key={mem.id}
                    id={`mem-card-${mem.id}`}
                    className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 hover:border-zinc-700 transition flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          {getCategoryIcon(mem.category)}
                          <span className="text-xs font-semibold text-zinc-200">{mem.key}</span>
                        </div>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                          {mem.category}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed">{mem.value}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-900 text-[10px] text-zinc-400">
                      <span>Saved {new Date(mem.createdAt).toLocaleDateString()}</span>
                      <button
                        onClick={() => onDeleteMemory(mem.id)}
                        className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-rose-400 transition p-1"
                        title="Delete memory"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Memory Form */}
          <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800">
            <h4 className="text-xs font-semibold text-zinc-200 mb-2 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-blue-400" />
              Add Custom Profile Fact or Goal
            </h4>
            <form onSubmit={handleAdd} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="profile">Profile & Bio</option>
                  <option value="education">Education & Academics</option>
                  <option value="career">Career & Skills</option>
                  <option value="health">Health & Household</option>
                  <option value="preference">Personal Preference</option>
                </select>

                <input
                  type="text"
                  placeholder="Key (e.g. Target Exam Date)"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="sm:col-span-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <textarea
                rows={2}
                placeholder="Value (e.g. Java Certification exam scheduled on Nov 15; focus on concurrency and streams)"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isAdding || !newKey || !newValue}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white text-xs font-medium transition"
                >
                  {isAdding ? "Saving..." : "Save Memory"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
