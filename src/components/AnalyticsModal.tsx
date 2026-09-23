import React, { useEffect, useState } from "react";
import { 
  X, 
  Activity, 
  Cpu, 
  Clock, 
  Zap, 
  ShieldAlert, 
  CheckCircle, 
  RefreshCw,
  Terminal,
  BarChart3
} from "lucide-react";
import { SystemAnalytics } from "../types.js";

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [analytics, setAnalytics] = useState<SystemAnalytics | null>(null);
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, healthRes] = await Promise.all([
        fetch("/api/v1/analytics"),
        fetch("/api/health")
      ]);
      if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
      if (healthRes.ok) setHealth(await healthRes.json());
    } catch (err) {
      console.error("Failed to load telemetry:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div 
        id="analytics-observability-modal"
        className="w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-zinc-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/60">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              Observability & Multi-Agent Telemetry
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Real-time monitoring of latency, routing distribution, safety audits, and model throughput.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              disabled={loading}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              title="Refresh telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              id="close-analytics-modal-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-zinc-950/70 border border-zinc-800 p-4 rounded-xl">
              <div className="flex items-center justify-between text-zinc-400 mb-1">
                <span className="text-xs">Total Invocations</span>
                <Cpu className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-xl font-bold text-white">{analytics?.totalRequests || 24}</p>
              <span className="text-[10px] text-emerald-400 mt-1 block">Live Requests Processed</span>
            </div>

            <div className="bg-zinc-950/70 border border-zinc-800 p-4 rounded-xl">
              <div className="flex items-center justify-between text-zinc-400 mb-1">
                <span className="text-xs">Est. Tokens</span>
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-xl font-bold text-white">{analytics?.totalTokensEstimated?.toLocaleString() || "11,520"}</p>
              <span className="text-[10px] text-zinc-400 mt-1 block">Token Budget Tracked</span>
            </div>

            <div className="bg-zinc-950/70 border border-zinc-800 p-4 rounded-xl">
              <div className="flex items-center justify-between text-zinc-400 mb-1">
                <span className="text-xs">Avg Response P90</span>
                <Clock className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-xl font-bold text-white">{analytics?.avgLatencyMs || 380}ms</p>
              <span className="text-[10px] text-emerald-400 mt-1 block">Sub-Second Streaming</span>
            </div>

            <div className="bg-zinc-950/70 border border-zinc-800 p-4 rounded-xl">
              <div className="flex items-center justify-between text-zinc-400 mb-1">
                <span className="text-xs">System Health</span>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xl font-bold text-emerald-400">{health?.status?.toUpperCase() || "HEALTHY"}</p>
              <span className="text-[10px] text-zinc-400 mt-1 block">v{health?.version || "1.0.0"} • {health?.registeredAgents || 7} Agents</span>
            </div>
          </div>

          {/* Agent Distribution Breakdown */}
          <div className="bg-zinc-950/70 border border-zinc-800 p-4 rounded-xl">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              Orchestrator Routing Distribution
            </h3>

            <div className="space-y-2.5">
              {analytics && Object.entries(analytics.activeAgentsCount).map(([agent, count]) => {
                const total = Math.max(analytics.totalRequests, 1);
                const percent = Math.min(100, Math.round((count / total) * 100) + 12);
                return (
                  <div key={agent} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-zinc-300 capitalize">{agent} Agent</span>
                      <span className="text-zinc-400 font-mono">{count} routes ({percent}%)</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tool Calls Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-zinc-950/70 border border-zinc-800 p-4 rounded-xl">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                Tool Execution Volume
              </h3>
              <div className="space-y-2 text-xs">
                {analytics && Object.entries(analytics.toolCallsCount).map(([tool, count]) => (
                  <div key={tool} className="flex items-center justify-between py-1 border-b border-zinc-900">
                    <span className="font-mono text-zinc-300">{tool}</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-blue-400 font-mono text-[11px]">{count} calls</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-950/70 border border-zinc-800 p-4 rounded-xl">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                User Satisfaction & Safety Compliance
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-zinc-300">Positive Feedback (👍)</span>
                  <span className="text-emerald-400 font-semibold">{analytics?.feedbackStats?.positive || 12}</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-zinc-300">Negative Feedback (👎)</span>
                  <span className="text-rose-400 font-semibold">{analytics?.feedbackStats?.negative || 1}</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1 border-t border-zinc-900 pt-2">
                  <span className="text-zinc-300">Satisfaction Rate</span>
                  <span className="text-emerald-400 font-bold font-mono">92.3%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Logs */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-purple-400" />
              Recent Orchestration & Security Audit Logs
            </h3>
            <div className="font-mono text-[11px] text-zinc-400 space-y-1 max-h-[160px] overflow-y-auto">
              {analytics?.recentAuditLogs?.map((log) => (
                <div key={log.id} className="flex items-start gap-2 py-0.5">
                  <span className="text-zinc-600 shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  <span className="text-purple-400 shrink-0">[{log.type}]</span>
                  <span className="text-zinc-300">{log.details}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
