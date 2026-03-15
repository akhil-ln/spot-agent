import React from "react";

const URGENCY_COLOR = { HIGH: "#DC2626", MEDIUM: "#D97706", LOW: "#16A34A" };
const URGENCY_BG    = { HIGH: "#FEF2F2", MEDIUM: "#FFFBEB", LOW: "#F0FDF4" };

function InfoTile({ label, value, accent }) {
  return (
    <div style={{
      padding: "14px 16px",
      background: "var(--bg)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
    }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: accent || "var(--text-primary)" }}>{value}</div>
    </div>
  );
}

export default function Screen2({ scenario, onRunAnalysis, onBack }) {
  const req    = scenario.spot_request;
  const quotes = scenario.quotes || [];
  const laneCtx = scenario.lane_context;

  const formatINR = (n) => n != null ? `₹${Number(n).toLocaleString("en-IN")}` : "—";

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px", animation: "fadeUp 0.35s ease both" }}>
      {/* Back */}
      <button
        onClick={onBack}
        style={{ background: "none", border: "none", color: "var(--text-secondary)", fontSize: 13, marginBottom: 20, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, padding: 0 }}
      >
        ← Back to Requests
      </button>

      {/* ── Request Header ── */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        padding: "24px 28px",
        marginBottom: 20,
        boxShadow: "var(--shadow-sm)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <span style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
              {req.id} · Raised by {req.raised_by}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>
                {req.origin}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <div style={{ width: 60, height: 1, background: "var(--primary)", opacity: 0.4 }} />
                <span style={{ fontSize: 11, color: "var(--primary)", fontWeight: 600 }}>→</span>
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>
                {req.destination}
              </h2>
            </div>
          </div>
          <span style={{
            background: URGENCY_BG[req.urgency] || "#F5F5FA",
            color: URGENCY_COLOR[req.urgency] || "var(--text-secondary)",
            fontSize: 11,
            fontWeight: 700,
            padding: "4px 12px",
            borderRadius: "var(--radius-sm)",
            letterSpacing: "0.5px",
          }}>
            {req.urgency} URGENCY
          </span>
        </div>

        {/* Info tiles */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          <InfoTile label="Truck Type"      value={req.truck_type} />
          <InfoTile label="Trucks Required" value={req.trucks_required} />
          <InfoTile label="Placement Date"  value={req.placement_date || "—"} />
          <InfoTile label="Cost Threshold"  value={formatINR(req.cost_threshold)} accent="var(--primary)" />
          {laneCtx && <InfoTile label="Market Rate" value={formatINR(laneCtx.predicted_rate)} />}
        </div>
      </div>

      {/* ── Quotes Table ── */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-sm)",
        overflow: "hidden",
        marginBottom: 20,
      }}>
        {/* Table header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
          padding: "10px 24px",
          background: "var(--bg)",
          borderBottom: "1px solid var(--border)",
          fontSize: 10,
          fontWeight: 700,
          color: "var(--text-muted)",
          letterSpacing: "0.6px",
          textTransform: "uppercase",
        }}>
          <span>Transporter</span>
          <span>Quoted Rate</span>
          <span>Transit</span>
          <span>Availability</span>
          <span>vs Threshold</span>
        </div>

        {/* Rows */}
        {quotes.map((q, i) => {
          const delta = q.raw_quote - req.cost_threshold;
          const over  = delta > 0;
          return (
            <div
              key={q.quote_id || i}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
                padding: "14px 24px",
                borderBottom: i < quotes.length - 1 ? "1px solid var(--border)" : "none",
                alignItems: "center",
                transition: "background var(--transition)",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--bg)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{q.lsp}</span>
                {q.lsp_profile?.is_new_lsp && (
                  <span style={{ marginLeft: 8, fontSize: 9, fontWeight: 700, color: "#6B6B8D", background: "var(--bg)", border: "1px solid var(--border)", padding: "1px 6px", borderRadius: "var(--radius-sm)", letterSpacing: "0.3px" }}>NEW</span>
                )}
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
                {formatINR(q.raw_quote)}
              </span>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{q.transit_days}d</span>
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                color: q.availability === "Immediate" ? "var(--green)" : "var(--amber)",
              }}>
                {q.availability}
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: over ? "var(--red)" : "var(--green)" }}>
                {over ? "+" : "−"}₹{Math.abs(delta).toLocaleString("en-IN")}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Warning strip ── */}
      <div style={{
        background: "var(--amber-bg)",
        border: "1px solid var(--amber-border)",
        borderRadius: "var(--radius)",
        padding: "12px 18px",
        fontSize: 12,
        color: "var(--amber)",
        fontWeight: 500,
        marginBottom: 24,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}>
        <span>⚠</span>
        <span>You're seeing price only — no reliability data, no benchmark intelligence, no negotiation history. Run analysis to get the full picture.</span>
      </div>

      {/* ── CTA ── */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={onRunAnalysis}
          style={{
            background: "var(--primary)",
            color: "#fff",
            border: "none",
            padding: "12px 32px",
            borderRadius: "var(--radius)",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 10,
            transition: "background var(--transition)",
            boxShadow: "0 2px 12px rgba(57,49,133,0.25)",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--primary-hover)"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--primary)"}
        >
          Run AI Analysis
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
