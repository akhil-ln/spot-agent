import React, { useState, useEffect, useCallback } from "react";
import { CheckCircle2, TrendingDown, XCircle, RotateCcw, Trash2, RefreshCw } from "lucide-react";
import { getFeedbackSummary, getFeedbackHistory, clearFeedback } from "../api/index";

const fINR  = (n) => n != null ? `₹${Number(n).toLocaleString("en-IN")}` : "—";
const fDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
};

const ACTION_COLOR  = { ACCEPT: "var(--green)",  NEGOTIATE: "var(--amber)",  REJECT: "var(--red)"  };
const ACTION_BG     = { ACCEPT: "var(--green-bg)", NEGOTIATE: "var(--amber-bg)", REJECT: "var(--red-bg)" };
const ACTION_BORDER = { ACCEPT: "var(--green-border)", NEGOTIATE: "var(--amber-border)", REJECT: "var(--red-border)" };

function StatCard({ label, value, color, Icon }) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: "var(--radius-md)", padding: "18px 22px",
      display: "flex", alignItems: "center", gap: 14,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: "var(--radius)",
        background: color ? `color-mix(in srgb, ${color} 12%, transparent)` : "var(--primary-dim)",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Icon size={18} color={color || "var(--primary)"} />
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.1 }}>{value ?? "—"}</div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

function ActionBadge({ action }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: "0.5px",
      padding: "3px 8px", borderRadius: "var(--radius-sm)",
      color: ACTION_COLOR[action] || "var(--text-muted)",
      background: ACTION_BG[action] || "var(--bg)",
      border: `1px solid ${ACTION_BORDER[action] || "var(--border)"}`,
    }}>{action}</span>
  );
}

export default function HistoryScreen({ onBack }) {
  const [summary,  setSummary]  = useState(null);
  const [history,  setHistory]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [clearing, setClearing] = useState(false);
  const [error,    setError]    = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [sumRes, histRes] = await Promise.all([
        getFeedbackSummary(),
        getFeedbackHistory(50),
      ]);
      setSummary(sumRes.data);
      setHistory(Array.isArray(histRes.data?.decisions) ? histRes.data.decisions : []);
    } catch {
      setError("Failed to load decision history. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleClear() {
    if (!window.confirm("Clear all decision history? This cannot be undone.")) return;
    setClearing(true);
    try {
      await clearFeedback();
      setSummary(null);
      setHistory([]);
    } catch {
      setError("Clear failed. Please try again.");
    } finally {
      setClearing(false);
    }
  }

  const total = summary?.total_decisions ?? 0;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "28px 32px 60px" }}>
      <button className="back-btn" onClick={onBack}>← Spot Requests</button>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>Decision History</h2>
          <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            All confirmed procurement decisions from the RL feedback loop.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-secondary btn-sm" onClick={load} disabled={loading}>
            <RefreshCw size={13} /> Refresh
          </button>
          {total > 0 && (
            <button className="btn btn-danger btn-sm" onClick={handleClear} disabled={clearing}>
              <Trash2 size={13} /> Clear all
            </button>
          )}
        </div>
      </div>

      {error && (
        <div style={{ padding: "12px 16px", background: "var(--red-bg)", border: "1px solid var(--red-border)", borderRadius: "var(--radius)", color: "var(--red)", fontSize: 13, marginBottom: 20 }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)", fontSize: 13 }}>Loading…</div>
      ) : total === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)", fontSize: 13 }}>
          No decisions yet. Confirm a recommendation in the analysis screen to start building history.
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
            <StatCard label="Total Decisions"   value={summary?.total_decisions}   Icon={CheckCircle2}  />
            <StatCard label="Accepted"          value={summary?.accept_count}    color="var(--green)"  Icon={CheckCircle2}  />
            <StatCard label="Negotiated"        value={summary?.negotiate_count} color="var(--amber)"  Icon={TrendingDown}  />
            <StatCard label="Rejected"          value={summary?.reject_count}    color="var(--red)"    Icon={XCircle}       />
          </div>

          {/* Top LSPs */}
          {summary?.top_lsps?.length > 0 && (
            <div className="card-elevated" style={{ padding: "18px 20px", marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>
                Top Transporters by Volume
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {summary.top_lsps.map((lsp) => (
                  <div key={lsp.lsp} style={{
                    padding: "8px 14px", background: "var(--bg)", border: "1px solid var(--border)",
                    borderRadius: "var(--radius)", fontSize: 12,
                  }}>
                    <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>{lsp.lsp}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: 11 }}>
                      {lsp.accept_count}A · {lsp.negotiate_count}N · {lsp.reject_count}R
                      <span style={{ marginLeft: 6, color: "var(--text-secondary)" }}>({lsp.total} total)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Decision table */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>
              Recent Decisions (last {history.length})
            </div>

            {/* Table header */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 2fr 1.5fr 1fr 1fr 1fr",
              padding: "8px 16px", gap: 12, fontSize: 10, fontWeight: 700,
              color: "var(--text-muted)", letterSpacing: "0.5px", textTransform: "uppercase",
              background: "var(--surface-2)", border: "1px solid var(--border)",
              borderRadius: "var(--radius) var(--radius) 0 0", borderBottom: "none",
            }}>
              <span>Action</span>
              <span>Transporter</span>
              <span>Lane</span>
              <span>Rate</span>
              <span>Truck Type</span>
              <span>Date</span>
            </div>

            <div style={{ border: "1px solid var(--border)", borderRadius: "0 0 var(--radius) var(--radius)", overflow: "hidden" }}>
              {Array.isArray(history) && history.map((rec, i) => (
                <div
                  key={rec.id || i}
                  style={{
                    display: "grid", gridTemplateColumns: "1fr 2fr 1.5fr 1fr 1fr 1fr",
                    padding: "11px 16px", gap: 12, alignItems: "center",
                    borderBottom: i < history.length - 1 ? "1px solid var(--border)" : "none",
                    background: "var(--surface)",
                    fontSize: 12,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <ActionBadge action={rec.action} />
                    {rec.overridden && (
                      <span title="Manual override">
                        <RotateCcw size={11} color="var(--amber)" />
                      </span>
                    )}
                  </div>
                  <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{rec.lsp || "—"}</span>
                  <span style={{ color: "var(--text-secondary)", fontSize: 11 }}>
                    {rec.origin?.split(",")[0]} → {rec.destination?.split(",")[0]}
                  </span>
                  <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{fINR(rec.awarded_rate)}</span>
                  <span style={{ color: "var(--text-secondary)", fontSize: 11 }}>{rec.truck_type || "—"}</span>
                  <span style={{ color: "var(--text-muted)", fontSize: 11 }}>{fDate(rec.timestamp)}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
