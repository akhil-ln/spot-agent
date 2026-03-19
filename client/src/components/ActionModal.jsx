import React, { useState } from "react";
import { X, CheckCircle2, Send, XCircle, RefreshCw } from "lucide-react";
import { saveDecision } from "../utils/feedbackStore";

/**
 * ActionModal — renders the appropriate action flow based on AI recommendation type.
 * Also persists every confirmed decision to localStorage (RL feedback loop).
 * Props:
 *   recommendation: { recommendation, target_lsp, negotiate_target_price, reasoning, overridden? }
 *   scenario: the full scenario object
 *   onClose: () => void
 *   onConfirm: (actionPayload) => void
 */
export default function ActionModal({ recommendation, scenario, onClose, onConfirm }) {
  const [note, setNote]           = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const req = scenario?.spot_request || {};

  const rec    = recommendation?.recommendation || "ACCEPT";
  const lsp    = recommendation?.target_lsp || "—";
  const target = recommendation?.negotiate_target_price;

  const getQuotedRate = () => {
    const awardedQuote = scenario?.quotes?.find(q => q.lsp === lsp)
      || scenario?.ranked_quotes?.find(q => q.lsp === lsp);
    return awardedQuote?.raw_quote || null;
  };

  function handleConfirm() {
    setConfirmed(true);

    // ── Persist to RL feedback store ──
    const awardedQuote = scenario?.quotes?.find(q => q.lsp === lsp)
      || scenario?.ranked_quotes?.find(q => q.lsp === lsp);
    const awardedRate  = awardedQuote?.raw_quote || null;
    const quotedRate   = awardedRate;
    const negGapPct    = (target && awardedRate)
      ? ((awardedRate - target) / awardedRate) * 100
      : null;

    saveDecision({
      action:           rec,
      lsp,
      awarded_rate:     rec === "ACCEPT" ? awardedRate : null,
      target_price:     rec === "NEGOTIATE" ? target : null,
      neg_gap_pct:      negGapPct,
      quoted_rate:      quotedRate,
      origin:           req.origin,
      destination:      req.destination,
      truck_type:       req.truck_type,
      urgency:          req.urgency,
      spot_id:          req.id,
      ai_recommendation: recommendation?.recommendation,
      overridden:       recommendation?.overridden || false,
      note,
    });

    setTimeout(() => {
      onConfirm?.({ type: rec, lsp, target_price: target, note });
    }, 1200);
  }

  if (confirmed) {
    return (
      <div className="modal-overlay">
        <div className="modal-box" style={{ textAlign: "center", padding: "40px 36px" }}>
          <CheckCircle2 size={48} color="var(--green)" style={{ marginBottom: 16 }} />
          <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>
            {rec === "ACCEPT" ? "Award Confirmed" : rec === "NEGOTIATE" ? "Counter Sent" : "Request Rejected"}
          </div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            {rec === "ACCEPT" && `${lsp} has been awarded the shipment.`}
            {rec === "NEGOTIATE" && `Counter offer of ₹${Number(target).toLocaleString("en-IN")} sent to ${lsp}.`}
            {rec === "REJECT" && "Quote rejected. The request can be re-tendered."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        {/* ── ACCEPT flow ── */}
        {rec === "ACCEPT" && (
          <>
            <div className="modal-header">
              <div>
                <div className="modal-title">Confirm Award to {lsp}</div>
                <div className="modal-subtitle">{req.origin} → {req.destination}</div>
              </div>
              <button className="modal-close" onClick={onClose}><X size={16} /></button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
              {[
                { label: "Transporter",   value: lsp },
                { label: "Quoted Rate",   value: `₹${(getQuotedRate() || "—")}` },
                { label: "Route",         value: `${req.origin?.split(",")[0]} → ${req.destination?.split(",")[0]}` },
                { label: "Truck Type",    value: req.truck_type || "—" },
              ].map((item) => (
                <div key={item.label} className="tile" style={{ padding: "10px 14px" }}>
                  <div className="tile-label">{item.label}</div>
                  <div className="tile-value" style={{ fontSize: 13 }}>{item.value}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>
                Note (optional)
              </label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="e.g. Confirm pickup by 10 AM, fragile goods handling required…"
                rows={3}
                style={{
                  width: "100%", border: "1px solid var(--border)", borderRadius: "var(--radius)",
                  padding: "10px 12px", fontSize: 13, fontFamily: "inherit", color: "var(--text-primary)",
                  background: "var(--bg)", outline: "none", resize: "vertical",
                }}
              />
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary btn-md" onClick={onClose}>Cancel</button>
              <button className="btn btn-success btn-md" onClick={handleConfirm}>
                <CheckCircle2 size={14} /> Confirm Award
              </button>
            </div>
          </>
        )}

        {/* ── NEGOTIATE flow ── */}
        {rec === "NEGOTIATE" && (
          <>
            <div className="modal-header">
              <div>
                <div className="modal-title">Send Counter to {lsp}</div>
                <div className="modal-subtitle">AI-suggested target: ₹{Number(target).toLocaleString("en-IN")}</div>
              </div>
              <button className="modal-close" onClick={onClose}><X size={16} /></button>
            </div>

            <div style={{ padding: "14px 18px", background: "var(--primary-dim)", border: "1px solid var(--primary-border)", borderRadius: "var(--radius)", marginBottom: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--primary)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                AI Reasoning
              </div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {recommendation?.reasoning || "The quoted rate is above market benchmark. A counter at the target price is likely to be accepted based on historical negotiation patterns for this transporter."}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>
                Counter-offer message
              </label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={4}
                style={{
                  width: "100%", border: "1px solid var(--border)", borderRadius: "var(--radius)",
                  padding: "10px 12px", fontSize: 13, fontFamily: "inherit", color: "var(--text-primary)",
                  background: "var(--bg)", outline: "none", resize: "vertical",
                }}
                defaultValue={`Hi, we appreciate your quote for the ${req.origin?.split(",")[0]} → ${req.destination?.split(",")[0]} lane. We'd like to counter at ₹${Number(target).toLocaleString("en-IN")} based on current market rates. Please confirm availability.`}
              />
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary btn-md" onClick={onClose}>Cancel</button>
              <button className="btn btn-warn btn-md" onClick={handleConfirm}>
                <Send size={14} /> Send Counter
              </button>
            </div>
          </>
        )}

        {/* ── REJECT flow ── */}
        {rec === "REJECT" && (
          <>
            <div className="modal-header">
              <div>
                <div className="modal-title">Reject All Quotes</div>
                <div className="modal-subtitle">{req.origin} → {req.destination}</div>
              </div>
              <button className="modal-close" onClick={onClose}><X size={16} /></button>
            </div>

            <div style={{ padding: "14px 18px", background: "var(--red-bg)", border: "1px solid var(--red-border)", borderRadius: "var(--radius)", marginBottom: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--red)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>Why reject?</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {recommendation?.key_risk || "All quotes are above market threshold and transporter reliability is insufficient for this urgency level. Re-tendering is recommended."}
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <div className="section-title">Next action</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { id: "retender", icon: <RefreshCw size={14} />, label: "Post back to market", desc: "Re-open the spot request for new quotes from all LSPs" },
                  { id: "next", icon: <CheckCircle2 size={14} />, label: "Award next-best quote", desc: "Skip the rejected quotes and award to the next-ranked transporter" },
                ].map((opt) => (
                  <label key={opt.id} style={{
                    display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px",
                    border: "1px solid var(--border)", borderRadius: "var(--radius)", cursor: "pointer",
                    background: "var(--bg)",
                  }}>
                    <input type="radio" name="reject_action" value={opt.id} style={{ marginTop: 2 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 6 }}>
                        {opt.icon} {opt.label}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary btn-md" onClick={onClose}>Cancel</button>
              <button className="btn btn-danger btn-md" onClick={handleConfirm}>
                <XCircle size={14} /> Confirm Rejection
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
