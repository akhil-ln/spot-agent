import React, { useState, useMemo, useEffect } from "react";
import {
  CheckCircle2, Truck, MapPin, Package, AlertTriangle,
  ChevronDown, ChevronUp, ArrowRight, RotateCcw,
  TrendingUp, TrendingDown, Route, Brain,
} from "lucide-react";
import ActionModal from "../components/ActionModal";
import { fetchSignals, loadDecisions, adjustedConfidence } from "../utils/feedbackStore";

/* ─── Rec config ──────────────────────────────────────────── */
const REC = {
  ACCEPT:    { color: "var(--green)",  bg: "var(--green-bg)",  border: "var(--green-border)",  label: "Accept Quote",  btnClass: "btn-success" },
  NEGOTIATE: { color: "var(--amber)",  bg: "var(--amber-bg)",  border: "var(--amber-border)",  label: "Send Counter",  btnClass: "btn-warn"    },
  REJECT:    { color: "var(--red)",    bg: "var(--red-bg)",    border: "var(--red-border)",    label: "Reject All",    btnClass: "btn-danger"  },
};

const URGENCY_COLOR = { HIGH: "var(--red)", MEDIUM: "var(--amber)", LOW: "var(--green)" };
const URGENCY_BG    = { HIGH: "var(--red-bg)", MEDIUM: "var(--amber-bg)", LOW: "var(--green-bg)" };
const URGENCY_BDR   = { HIGH: "var(--red-border)", MEDIUM: "var(--amber-border)", LOW: "var(--green-border)" };

const SIGNAL_ICON = {
  CheckCircle2: <CheckCircle2 size={13} />,
  AlertTriangle: <AlertTriangle size={13} />,
  TrendingUp: <TrendingUp size={13} />,
  TrendingDown: <TrendingDown size={13} />,
  Route: <Route size={13} />,
  RotateCcw: <RotateCcw size={13} />,
};

const SIGNAL_COLOR = { positive: "var(--green)", negative: "var(--red)", neutral: "var(--primary)" };
const SIGNAL_BG    = { positive: "var(--green-bg)", negative: "var(--red-bg)", neutral: "var(--primary-dim)" };
const SIGNAL_BDR   = { positive: "var(--green-border)", negative: "var(--red-border)", neutral: "var(--primary-border)" };

/* ─── Helpers ─────────────────────────────────────────────── */
const fINR = (n) => n != null ? `₹${Number(n).toLocaleString("en-IN")}` : "—";
const fPct = (n, dec = 0) => n != null ? `${Number(n).toFixed(dec)}%` : "—";

/* ─── Confidence arc ──────────────────────────────────────── */
function ConfidenceMeter({ value, adjusted }) {
  const base = Math.round((value || 0) * 100);
  const adj  = Math.round((adjusted || value || 0) * 100);
  const hasAdj = adjusted && Math.abs(adj - base) >= 1;
  const radius = 40;
  const circ   = 2 * Math.PI * radius;
  const fill   = (adj / 100) * circ * 0.75;
  const color  = adj >= 75 ? "var(--green)" : adj >= 50 ? "var(--amber)" : "var(--red)";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0 }}>
      <svg width={90} height={90} viewBox="0 0 100 100">
        <circle cx={50} cy={50} r={radius} fill="none" stroke="var(--border)" strokeWidth={7}
          strokeDasharray={`${circ * 0.75} ${circ * 0.25}`} strokeDashoffset={circ * 0.125} strokeLinecap="round" />
        <circle cx={50} cy={50} r={radius} fill="none" stroke={color} strokeWidth={7}
          strokeDasharray={`${fill} ${circ}`} strokeDashoffset={circ * 0.125} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.8s ease" }} />
        <text x={50} y={54} textAnchor="middle" fontSize={17} fontWeight={700} fill="var(--text-primary)" fontFamily="Inter">{adj}%</text>
      </svg>
      <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.5px", textTransform: "uppercase" }}>
        {hasAdj ? "Adj. Confidence" : "Confidence"}
      </span>
      {hasAdj && (
        <span style={{ fontSize: 10, color: adj > base ? "var(--green)" : "var(--red)", fontWeight: 600 }}>
          {adj > base ? "+" : ""}{adj - base}% from history
        </span>
      )}
    </div>
  );
}

/* ─── Score bar ───────────────────────────────────────────── */
function ScoreBar({ label, value, color }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-primary)" }}>{Math.round(value ?? 0)}</span>
      </div>
      <div style={{ height: 4, background: "var(--border)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${value ?? 0}%`, background: color || "var(--primary)", borderRadius: 99, transition: "width 0.7s ease" }} />
      </div>
    </div>
  );
}

/* ─── RL Signals Panel ─────────────────────────────────────── */
function RLSignalsPanel({ signals, decisionCount }) {
  const [open, setOpen] = useState(true);
  if (!signals.length && decisionCount === 0) return null;

  return (
    <div style={{ border: "1px solid var(--primary-border)", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: 16 }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "11px 16px", background: "var(--primary-dim)", cursor: "pointer",
          borderBottom: open ? "1px solid var(--primary-border)" : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Brain size={14} color="var(--primary)" />
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)" }}>
            Reinforcement Signals
          </span>
          <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>
            — {decisionCount} past decision{decisionCount !== 1 ? "s" : ""} informing this recommendation
          </span>
        </div>
        {open ? <ChevronUp size={14} color="var(--text-muted)" /> : <ChevronDown size={14} color="var(--text-muted)" />}
      </div>

      {open && (
        <div style={{ padding: "14px 16px", background: "var(--surface)", display: "flex", flexDirection: "column", gap: 10 }}>
          {signals.length === 0 && (
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>
              No matching historical signals yet. Confidence is based on market data only. Decisions you confirm will train this model.
            </div>
          )}
          {signals.map((sig, i) => (
            <div key={i} style={{
              display: "flex", gap: 10, padding: "10px 14px",
              background: SIGNAL_BG[sig.impact], border: `1px solid ${SIGNAL_BDR[sig.impact]}`,
              borderRadius: "var(--radius)", alignItems: "flex-start",
            }}>
              <span style={{ color: SIGNAL_COLOR[sig.impact], marginTop: 1, flexShrink: 0 }}>
                {SIGNAL_ICON[sig.icon] || <Brain size={13} />}
              </span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: SIGNAL_COLOR[sig.impact], marginBottom: 2 }}>{sig.title}</div>
                <div style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.5 }}>{sig.body}</div>
              </div>
              {sig.confidence_adj ? (
                <span style={{ fontSize: 11, fontWeight: 700, marginLeft: "auto", flexShrink: 0, color: sig.confidence_adj > 0 ? "var(--green)" : "var(--red)" }}>
                  {sig.confidence_adj > 0 ? "+" : ""}{Math.round(sig.confidence_adj * 100)}% conf
                </span>
              ) : null}
            </div>
          ))}

          {signals.length > 0 && (
            <div style={{ fontSize: 11, color: "var(--text-muted)", padding: "6px 0 0", borderTop: "1px solid var(--border)", marginTop: 2 }}>
              Signals are derived from past confirmed decisions. Override or confirm this recommendation to contribute to the learning loop.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Full Override Panel ─────────────────────────────────── */
function OverridePanel({ ranked_quotes, baseRec, onApply, onCancel }) {
  const [action,      setAction]      = useState(baseRec.recommendation || "ACCEPT");
  const [selectedLsp, setSelectedLsp] = useState(baseRec.target_lsp || ranked_quotes[0]?.lsp || "");
  const [targetPrice, setTargetPrice] = useState(baseRec.negotiate_target_price || "");
  const [reason,      setReason]      = useState("");

  const needsLsp   = action !== "REJECT";
  const needsPrice = action === "NEGOTIATE";

  function handleApply() {
    onApply({ action, lsp: needsLsp ? selectedLsp : null, target_price: needsPrice ? Number(targetPrice) : null, reason });
  }

  const canApply = action === "REJECT" || (selectedLsp && (action !== "NEGOTIATE" || targetPrice));

  return (
    <div style={{
      background: "var(--surface-purple)", border: "1px solid var(--primary-border)",
      borderRadius: "var(--radius-md)", padding: "18px 20px", marginTop: 12,
    }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>
        Override AI Recommendation
      </div>
      <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 16 }}>
        Your override is logged and trains the recommendation model to better match your preferences.
      </div>

      {/* Action selector */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Decision</div>
        <div style={{ display: "flex", gap: 8 }}>
          {["ACCEPT", "NEGOTIATE", "REJECT"].map(a => {
            const cfg = REC[a];
            return (
              <button
                key={a}
                onClick={() => setAction(a)}
                style={{
                  flex: 1, padding: "8px 12px", border: `1px solid ${action === a ? cfg.color : "var(--border)"}`,
                  borderRadius: "var(--radius)", background: action === a ? cfg.bg : "var(--surface)",
                  color: action === a ? cfg.color : "var(--text-secondary)",
                  fontWeight: 700, fontSize: 12, cursor: "pointer", transition: "all var(--transition)",
                }}
              >{a}</button>
            );
          })}
        </div>
      </div>

      {/* LSP selector (if not REJECT) */}
      {needsLsp && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>
            {action === "NEGOTIATE" ? "Negotiate with" : "Award to"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {ranked_quotes.map((q, i) => (
              <label key={q.lsp} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "9px 14px",
                border: `1px solid ${selectedLsp === q.lsp ? "var(--primary)" : "var(--border)"}`,
                background: selectedLsp === q.lsp ? "var(--primary-dim)" : "var(--surface)",
                borderRadius: "var(--radius)", cursor: "pointer", transition: "all var(--transition)",
              }}>
                <input type="radio" name="override_lsp" value={q.lsp} checked={selectedLsp === q.lsp} onChange={() => setSelectedLsp(q.lsp)} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", flex: 1 }}>
                  #{i + 1} · {q.lsp}
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>{fINR(q.raw_quote)}</span>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Score {Math.round(q.composite ?? (q.scoring?.composite) ?? 0)}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Target price (if NEGOTIATE) */}
      {needsPrice && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>
            Counter-offer Price
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 0, border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", background: "var(--surface)" }}>
            <span style={{ padding: "8px 12px", background: "var(--bg)", borderRight: "1px solid var(--border)", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>₹</span>
            <input
              type="number"
              value={targetPrice}
              onChange={e => setTargetPrice(e.target.value)}
              placeholder="e.g. 42000"
              style={{ flex: 1, border: "none", outline: "none", padding: "8px 12px", fontSize: 13, fontFamily: "inherit", color: "var(--text-primary)", background: "var(--surface)" }}
            />
          </div>
        </div>
      )}

      {/* Reason (optional) */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>
          Reason for Override (optional — trains model)
        </div>
        <input
          type="text"
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="e.g. Better relationship with this transporter, urgent deadline..."
          style={{
            width: "100%", border: "1px solid var(--border)", borderRadius: "var(--radius)",
            padding: "8px 12px", fontSize: 12, fontFamily: "inherit", color: "var(--text-primary)",
            background: "var(--surface)", outline: "none",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn btn-primary btn-sm" onClick={handleApply} disabled={!canApply}>Apply Override</button>
        <button className="btn btn-secondary btn-sm" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

/* ─── Expanded quote row ──────────────────────────────────── */
function QuoteRow({ quote, rank, isTarget, index, threshold }) {
  const [expanded, setExpanded] = useState(false);
  const profile = quote.lsp_profile || {};
  const scoring = quote.scoring || quote.scores || {};
  const delta   = quote.raw_quote - threshold;

  return (
    <div style={{ borderBottom: index >= 0 ? "1px solid var(--border)" : "none", background: isTarget ? "var(--green-bg)" : "var(--surface)" }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: "grid", gridTemplateColumns: "34px 2.2fr 1fr 1fr 1fr 1fr 28px",
          alignItems: "center", padding: "12px 16px", cursor: "pointer", gap: 12,
          borderLeft: isTarget ? "3px solid var(--green)" : "3px solid transparent",
          transition: "background var(--transition)",
        }}
        onMouseEnter={e => { if (!isTarget) e.currentTarget.style.background = "var(--bg)"; }}
        onMouseLeave={e => { if (!isTarget) e.currentTarget.style.background = "transparent"; }}
      >
        <span style={{
          width: 26, height: 26, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 700, flexShrink: 0,
          background: rank === 1 ? "var(--primary)" : "var(--bg)",
          color: rank === 1 ? "#fff" : "var(--text-muted)",
          border: rank === 1 ? "none" : "1px solid var(--border)",
        }}>{rank}</span>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{quote.lsp}</span>
          {isTarget && <span className="badge badge-success">AI Pick</span>}
          {(profile.is_new_lsp || quote.is_new_lsp) && <span className="badge badge-neutral">New LSP</span>}
          {(quote.availability?.includes("Partial") || quote.availability_flag) && <span className="badge badge-warn">Partial</span>}
          {scoring.data_confidence === "LOW" && <span className="badge badge-warn">Low data</span>}
        </div>

        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{fINR(quote.raw_quote)}</div>
          <div style={{ fontSize: 10, fontWeight: 600, color: delta > 0 ? "var(--red)" : "var(--green)" }}>
            {delta > 0 ? "+" : "-"}{fINR(Math.abs(delta))} vs budget
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ flex: 1, height: 4, background: "var(--bg)", borderRadius: 99, overflow: "hidden", border: "1px solid var(--border)" }}>
            <div style={{ height: "100%", width: `${scoring.composite ?? quote.composite ?? 0}%`, background: "var(--primary)", borderRadius: 99 }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-primary)", width: 24, textAlign: "right" }}>
            {Math.round(scoring.composite ?? quote.composite ?? 0)}
          </span>
        </div>

        <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
          <div>{fPct(profile.on_time_delivery_pct)} OTD</div>
          <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{quote.transit_days}d transit</div>
        </div>

        <span style={{
          fontSize: 11, fontWeight: 600,
          color: (quote.availability === "Immediate" || quote.availability?.startsWith("Immediate")) ? "var(--green)" : "var(--amber)",
        }}>{quote.availability}</span>

        {expanded ? <ChevronUp size={14} color="var(--text-muted)" /> : <ChevronDown size={14} color="var(--text-muted)" />}
      </div>

      {expanded && (
        <div style={{ borderTop: "1px solid var(--border)", background: "var(--bg)", animation: "fadeUp 0.2s ease both" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0 }}>
            <div style={{ padding: "16px 18px", borderRight: "1px solid var(--border)" }}>
              <div className="section-title">Dimension Scores</div>
              <ScoreBar label="Price"          value={scoring.price_score       ?? scoring.price       ?? 0} color="#3B82F6" />
              <ScoreBar label="Reliability"    value={scoring.reliability_score ?? scoring.reliability ?? 0} color="var(--primary)" />
              <ScoreBar label="Urgency fit"    value={scoring.urgency_score     ?? scoring.urgency     ?? 0} color="var(--amber)" />
              <ScoreBar label="Market timing"  value={scoring.market_score      ?? scoring.market      ?? 0} color="var(--green)" />
              <ScoreBar label="Within budget"  value={scoring.threshold_score   ?? scoring.threshold   ?? 0} color="var(--primary-light)" />
            </div>

            <div style={{ padding: "16px 18px", borderRight: "1px solid var(--border)" }}>
              <div className="section-title">Transporter Profile</div>
              {[
                { label: "Win Rate",            value: fPct(profile.win_rate_pct)                          },
                { label: "On-Time Delivery",    value: fPct(profile.on_time_delivery_pct)                  },
                { label: "Damage Rate",         value: fPct(profile.damage_rate_pct, 1)                    },
                { label: "Lane Familiarity",    value: `${profile.lane_familiarity_score ?? "—"} / 100`    },
                { label: "Historical Trips",    value: profile.total_appearances ?? "—"                    },
                { label: "Neg. Gap",            value: fPct(profile.neg_gap_pct, 1)                        },
              ].map(r => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid var(--border)", fontSize: 12 }}>
                  <span style={{ color: "var(--text-secondary)" }}>{r.label}</span>
                  <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{r.value}</span>
                </div>
              ))}
              {profile.new_lsp_note && (
                <div style={{ marginTop: 8, fontSize: 11, color: "var(--amber)", background: "var(--amber-bg)", border: "1px solid var(--amber-border)", padding: "6px 10px", borderRadius: "var(--radius-sm)", lineHeight: 1.5 }}>
                  {profile.new_lsp_note}
                </div>
              )}
            </div>

            <div style={{ padding: "16px 18px" }}>
              <div className="section-title">Price Intel</div>
              {[
                { label: "Quoted Rate",    value: fINR(quote.raw_quote)                                            },
                { label: "Predicted Rate", value: fINR(quote.predicted_rate)                                       },
                { label: "Benchmark",      value: fINR(quote.benchmark_rate)                                       },
                { label: "vs Budget",      value: `${delta > 0 ? "+" : "-"}${fINR(Math.abs(delta))}`              },
                { label: "Price Delta %",  value: fPct(quote.price_delta_pct, 1)                                   },
              ].map(r => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid var(--border)", fontSize: 12 }}>
                  <span style={{ color: "var(--text-secondary)" }}>{r.label}</span>
                  <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Toast ───────────────────────────────────────────────── */
function Toast({ message, type = "success", onDone }) {
  React.useEffect(() => { const t = setTimeout(onDone, 3800); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className={`toast toast-${type}`}>
      <CheckCircle2 size={15} />
      {message}
    </div>
  );
}

/* ─── Main Screen ─────────────────────────────────────────── */
export default function Screen4({ scenario, result, onRerun, onBack }) {
  const [modalOpen,      setModalOpen]     = useState(false);
  const [showOverride,   setShowOverride]  = useState(false);
  const [overrideData,   setOverrideData]  = useState(null);  // { action, lsp, target_price, reason }
  const [toast,          setToast]         = useState(null);
  const [, forceUpdate] = useState(0);   // re-render after decisions saved

  const { ranked_quotes = [], recommendation, lane_context = {}, used_fallback } = result;
  const baseRec = useMemo(
    () => recommendation || scenario?.ai_recommendation || {},
    [recommendation, scenario]
  );
  const req = scenario?.spot_request || {};

  /* ── Fetch RL signals (async, backend-first) ── */
  const [rlData, setRlData] = useState({ signals: [], adjusted_confidence: null, decision_count: 0 });

  useEffect(() => {
    fetchSignals(scenario, baseRec).then(setRlData).catch(() => {});
  }, [scenario, baseRec]);

  const signals     = rlData.signals;
  const adjConf     = rlData.adjusted_confidence ?? baseRec.confidence;
  const decisionCount = rlData.decision_count;


  /* ── Build effective recommendation (base or override) ── */
  const rec = overrideData
    ? {
        ...baseRec,
        recommendation: overrideData.action,
        target_lsp: overrideData.lsp,
        negotiate_target_price: overrideData.target_price,
        reasoning: `Manual override: ${overrideData.action}${overrideData.lsp ? ` — ${overrideData.lsp}` : ""}. Original AI: ${baseRec.recommendation}${baseRec.target_lsp ? ` (${baseRec.target_lsp})` : ""}. ${overrideData.reason ? `Reason: ${overrideData.reason}` : ""}`.trim(),
        key_risk: null,
        overridden: true,
      }
    : baseRec;

  const cfg = REC[rec.recommendation] || REC.ACCEPT;

  function handleConfirm(payload) {
    setModalOpen(false);
    forceUpdate(n => n + 1); // re-derive signals after save
    const msgs = {
      ACCEPT:    `Award confirmed: ${payload.lsp}${rec.overridden ? " (Override)" : ""}`,
      NEGOTIATE: `Counter sent to ${payload.lsp} at ${fINR(payload.target_price)}`,
      REJECT:    "All quotes rejected. Re-tender recommended.",
    };
    setToast({ message: msgs[payload.type] || "Action completed", type: payload.type === "REJECT" ? "warn" : "success" });
  }

  function handleOverrideApply(data) {
    setOverrideData(data);
    setShowOverride(false);
  }

  function clearOverride() {
    setOverrideData(null);
    setShowOverride(false);
  }

  const lane = `${req.origin} → ${req.destination} · ${req.truck_type}`;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 32px 110px" }}>
      <button className="back-btn" onClick={onBack}>← All Requests</button>

      {/* ── 1. Spot Request Header ─────────────────────────── */}
      <div className="card-elevated" style={{ padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 5 }}>
              {req.id} · {req.raised_by}
              {req.raised_at && ` · ${new Date(req.raised_at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}`}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <MapPin size={15} color="var(--text-muted)" />
              <span style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.4px" }}>{req.origin}</span>
              <ArrowRight size={14} color="var(--primary)" />
              <span style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.4px" }}>{req.destination}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 7 }}>
              <Truck size={13} color="var(--text-muted)" />
              <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600 }}>{req.truck_type}</span>
              {req.dispatch_type && <span style={{ fontSize: 11, color: "var(--text-muted)" }}>· {req.dispatch_type}</span>}
              {req.contract_tenure && <span style={{ fontSize: 11, color: "var(--text-muted)" }}>· {req.contract_tenure}</span>}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
            <span style={{
              background: URGENCY_BG[req.urgency], color: URGENCY_COLOR[req.urgency],
              border: `1px solid ${URGENCY_BDR[req.urgency]}`,
              fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: "var(--radius-sm)", letterSpacing: "0.5px",
            }}>{req.urgency} URGENCY</span>
            {used_fallback && <span className="badge badge-neutral">Offline Mode</span>}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8, marginTop: 16 }}>
          {[
            { label: "Trucks Needed",   value: req.trucks_required ?? 1 },
            { label: "Weight",          value: req.weight_mt ? `${req.weight_mt} MT` : "—" },
            { label: "Cost Threshold",  value: fINR(req.cost_threshold), accent: true },
            { label: "Placement Date",  value: req.placement_date || "—" },
            { label: "Quotes Received", value: (scenario.quotes || ranked_quotes).length },
            { label: "Load Notes",      value: req.additional_details || "—" },
          ].map(t => (
            <div key={t.label} className="tile">
              <div className="tile-label">{t.label}</div>
              <div className={`tile-value${t.accent ? " tile-value--accent" : ""}`} style={{ fontSize: 12 }}>{t.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. Lane Market Context ────────────────────────── */}
      {lane_context?.predicted_rate && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 1, background: "var(--border)", borderRadius: "var(--radius)", overflow: "hidden", marginBottom: lane_context.market_note ? 8 : 16 }}>
            {[
              { label: "Predicted Rate",  value: fINR(lane_context.predicted_rate), accent: true },
              { label: "Benchmark Rate",  value: fINR(lane_context.benchmark_rate) },
              { label: "Historical Avg",  value: fINR(lane_context.lane_avg_historical) },
              { label: "Lane Range",      value: `${fINR(lane_context.lane_min_historical)} – ${fINR(lane_context.lane_max_historical)}` },
              { label: "Demand Index",    value: fPct((lane_context.demand_index ?? lane_context.market_demand_index ?? 0) * 100) },
              { label: "Sample Size",     value: `${lane_context.lane_sample_size ?? "—"} trips` },
            ].map(c => (
              <div key={c.label} style={{ background: "var(--surface)", padding: "10px 14px", textAlign: "center" }}>
                <div style={{ fontSize: 9, color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 4 }}>{c.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: c.accent ? "var(--primary)" : "var(--text-primary)" }}>{c.value}</div>
              </div>
            ))}
          </div>
          {lane_context.market_note && (
            <div style={{ fontSize: 12, color: "var(--text-secondary)", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "9px 14px", marginBottom: 16, display: "flex", gap: 8, alignItems: "center" }}>
              <Package size={13} color="var(--text-muted)" style={{ flexShrink: 0 }} />
              {lane_context.market_note}
            </div>
          )}
        </>
      )}

      {/* ── 3. RL Signals ────────────────────────────────── */}
      <RLSignalsPanel signals={signals} decisionCount={decisionCount} />

      {/* ── 4. AI Recommendation ─────────────────────────── */}
      <div style={{
        background: "var(--surface)", border: `1px solid ${cfg.border}`,
        borderLeft: `4px solid ${cfg.color}`, borderRadius: "var(--radius-md)",
        padding: "22px 26px", marginBottom: 16, boxShadow: "var(--shadow-sm)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
              <span style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, fontSize: 13, fontWeight: 800, padding: "4px 14px", borderRadius: "var(--radius-sm)", letterSpacing: "0.8px" }}>
                {rec.recommendation}
              </span>
              {rec.target_lsp && (
                <span style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>
                  {rec.target_lsp}
                  {rec.negotiate_target_price && (
                    <span style={{ fontSize: 13, fontWeight: 400, color: "var(--text-secondary)", marginLeft: 8 }}>
                      — Target {fINR(rec.negotiate_target_price)}
                    </span>
                  )}
                </span>
              )}
              {rec.overridden && <span className="badge badge-warn">Manual Override</span>}
            </div>

            {rec.reasoning && (
              <p style={{ fontSize: 13, lineHeight: 1.8, color: "var(--text-secondary)", marginBottom: 12, maxWidth: 640 }}>
                {rec.reasoning}
              </p>
            )}

            {rec.key_risk && (
              <div style={{ display: "flex", gap: 10, padding: "10px 14px", background: "var(--amber-bg)", border: "1px solid var(--amber-border)", borderRadius: "var(--radius)", fontSize: 12, color: "var(--amber)", fontWeight: 500, lineHeight: 1.5 }}>
                <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                {rec.key_risk}
              </div>
            )}

            {/* Override controls */}
            <div style={{ marginTop: 14 }}>
              {!overrideData ? (
                <button className="btn btn-secondary btn-sm" style={{ gap: 6 }} onClick={() => setShowOverride(!showOverride)}>
                  <RotateCcw size={12} />
                  {showOverride ? "Cancel" : "Override AI Decision"}
                </button>
              ) : (
                <button className="btn btn-secondary btn-sm" style={{ gap: 6 }} onClick={clearOverride}>
                  <RotateCcw size={12} /> Restore AI Recommendation
                </button>
              )}
              {showOverride && !overrideData && (
                <OverridePanel
                  ranked_quotes={ranked_quotes}
                  baseRec={baseRec}
                  onApply={handleOverrideApply}
                  onCancel={() => setShowOverride(false)}
                />
              )}
            </div>
          </div>

          <ConfidenceMeter value={baseRec.confidence} adjusted={signals.length ? adjConf : null} />
        </div>
      </div>

      {/* ── 5. Ranked Quotations ──────────────────────────── */}
      <div style={{ marginBottom: 90 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 10 }}>
          Ranked Quotations — {lane}
        </h3>

        {/* Table header */}
        <div style={{
          display: "grid", gridTemplateColumns: "34px 2.2fr 1fr 1fr 1fr 1fr 28px",
          padding: "7px 16px", gap: 12, fontSize: 10, fontWeight: 700,
          color: "var(--text-muted)", letterSpacing: "0.5px", textTransform: "uppercase",
          background: "var(--surface-2)", border: "1px solid var(--border)",
          borderRadius: "var(--radius) var(--radius) 0 0", borderBottom: "none",
        }}>
          <span>#</span><span>Transporter</span><span>Rate</span>
          <span>Score</span><span>OTD / Transit</span><span>Availability</span><span />
        </div>

        <div style={{ border: "1px solid var(--border)", borderRadius: "0 0 var(--radius) var(--radius)", overflow: "hidden" }}>
          {ranked_quotes.map((q, i) => (
            <QuoteRow
              key={q.id || q.quote_id || i}
              quote={q} rank={i + 1} index={i}
              threshold={req.cost_threshold}
              isTarget={q.lsp === rec.target_lsp}
            />
          ))}
        </div>
      </div>

      {/* ── Sticky Action Bar ──────────────────────────────── */}
      <div className="sticky-bar">
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-secondary btn-sm" onClick={onRerun}>Rerun Analysis</button>
          <button className="btn btn-secondary btn-sm" onClick={onBack}>All Requests</button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {rec.overridden && (
            <span style={{ fontSize: 12, color: "var(--amber)", fontWeight: 600 }}>Override active</span>
          )}
          <button className={`btn btn-lg ${cfg.btnClass}`} onClick={() => setModalOpen(true)}>
            {cfg.label} →
          </button>
        </div>
      </div>

      {/* ── Modal + Toast ─────────────────────────────────── */}
      {modalOpen && (
        <ActionModal
          recommendation={rec}
          scenario={scenario}
          onClose={() => setModalOpen(false)}
          onConfirm={handleConfirm}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}
