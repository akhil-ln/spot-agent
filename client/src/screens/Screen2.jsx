import React from "react";

export default function Screen2({ scenario, onRunAnalysis, onBack }) {
  const req     = scenario.spot_request;
  const quotes  = scenario.quotes || [];
  const laneCtx = scenario.lane_context;

  const formatINR = (n) => n != null ? `₹${Number(n).toLocaleString("en-IN")}` : "—";

  const urgencyColor = { HIGH: "var(--red)", MEDIUM: "var(--amber)", LOW: "var(--green)" };
  const urgencyBg    = { HIGH: "var(--red-bg)", MEDIUM: "var(--amber-bg)", LOW: "var(--green-bg)" };
  const urgencyBdr   = { HIGH: "var(--red-border)", MEDIUM: "var(--amber-border)", LOW: "var(--green-border)" };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 32px 120px", animation: "fadeUp 0.35s ease both" }}>
      <button className="back-btn" onClick={onBack}>← Back to Requests</button>

      {/* ── Request Header ── */}
      <div className="card-elevated" style={{ padding: "24px 28px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>
              {req.id} · Raised by {req.raised_by}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>{req.origin}</h2>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <div style={{ width: 52, height: 1, background: "var(--primary)", opacity: 0.35 }} />
                <span style={{ fontSize: 11, color: "var(--primary)", fontWeight: 700 }}>→</span>
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>{req.destination}</h2>
            </div>
          </div>
          <span style={{
            background: urgencyBg[req.urgency] || "var(--surface-2)",
            color: urgencyColor[req.urgency] || "var(--text-secondary)",
            border: `1px solid ${urgencyBdr[req.urgency] || "var(--border)"}`,
            fontSize: 11, fontWeight: 700, padding: "4px 12px",
            borderRadius: "var(--radius-sm)", letterSpacing: "0.5px",
          }}>
            {req.urgency} URGENCY
          </span>
        </div>

        {/* Info tiles */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          {[
            { label: "Truck Type",      value: req.truck_type },
            { label: "Trucks Required", value: req.trucks_required },
            { label: "Placement Date",  value: req.placement_date || "—" },
            { label: "Cost Threshold",  value: formatINR(req.cost_threshold), accent: true },
            laneCtx && { label: "Market Rate", value: formatINR(laneCtx.predicted_rate) },
          ].filter(Boolean).map((t) => (
            <div key={t.label} className="tile">
              <div className="tile-label">{t.label}</div>
              <div className={`tile-value${t.accent ? " tile-value--accent" : ""}`}>{t.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quotes Table ── */}
      <div className="data-table" style={{ marginBottom: 20 }}>
        <div className="data-table-head" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr" }}>
          <span>Transporter</span>
          <span>Quoted Rate</span>
          <span>Transit</span>
          <span>Availability</span>
          <span>vs Threshold</span>
        </div>
        {quotes.map((q, i) => {
          const delta = q.raw_quote - req.cost_threshold;
          const over  = delta > 0;
          return (
            <div
              key={q.quote_id || i}
              className="data-table-row"
              style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", borderBottom: i < quotes.length - 1 ? "1px solid var(--border)" : "none" }}
            >
              <div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{q.lsp}</span>
                {q.lsp_profile?.is_new_lsp && (
                  <span className="badge badge-neutral" style={{ marginLeft: 8 }}>NEW</span>
                )}
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{formatINR(q.raw_quote)}</span>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{q.transit_days}d</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: q.availability === "Immediate" ? "var(--green)" : "var(--amber)" }}>
                {q.availability}
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: over ? "var(--red)" : "var(--green)" }}>
                {over ? "+" : "−"}₹{Math.abs(delta).toLocaleString("en-IN")}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Warning banner ── */}
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "14px 20px",
        background: "var(--amber-bg)",
        border: "1px solid var(--amber-border)",
        borderRadius: "var(--radius)",
        marginBottom: 28,
        borderLeft: "3px solid var(--amber)",
      }}>
        <span style={{ fontSize: 16, flexShrink: 0 }}>⚠</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--amber)", marginBottom: 3 }}>Price only — incomplete picture</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>
            You're seeing raw rates with no reliability context, no market benchmark, and no negotiation history.
            Run AI analysis to get a scored, ranked recommendation — takes ~60 seconds.
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="btn btn-primary btn-lg" onClick={onRunAnalysis}>
          <span>⚡</span>
          Run AI Analysis
          <span style={{ opacity: 0.7, fontSize: 12 }}>~60s</span>
        </button>
      </div>
    </div>
  );
}
