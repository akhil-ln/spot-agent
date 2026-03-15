import React, { useState } from "react";

const REC_CONFIG = {
  ACCEPT:    { color: "#15803D", bg: "#F0FDF4", border: "#86EFAC", label: "Accept Quote" },
  NEGOTIATE: { color: "#B45309", bg: "#FFFBEB", border: "#FCD34D", label: "Send Counter" },
  REJECT:    { color: "#DC2626", bg: "#FEF2F2", border: "#FCA5A5", label: "Reject All"   },
};

function ConfidenceMeter({ value }) {
  const pct    = Math.round((value || 0) * 100);
  const radius = 42;
  const circ   = 2 * Math.PI * radius;
  const dash   = (pct / 100) * circ * 0.75;
  const cfg    = pct >= 75 ? REC_CONFIG.ACCEPT : pct >= 50 ? REC_CONFIG.NEGOTIATE : REC_CONFIG.REJECT;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <svg width={100} height={100} viewBox="0 0 100 100">
        <circle cx={50} cy={50} r={radius} fill="none" stroke="var(--border)" strokeWidth={8}
          strokeDasharray={`${circ * 0.75} ${circ * 0.25}`}
          strokeDashoffset={circ * 0.125}
          strokeLinecap="round"
        />
        <circle cx={50} cy={50} r={radius} fill="none" stroke={cfg.color} strokeWidth={8}
          strokeDasharray={`${dash} ${circ}`}
          strokeDashoffset={circ * 0.125}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
        <text x={50} y={56} textAnchor="middle" fontSize={18} fontWeight={700} fill="var(--text-primary)" fontFamily="Inter">{pct}%</text>
      </svg>
      <span style={{ fontSize: 10, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.5px" }}>CONFIDENCE</span>
    </div>
  );
}

function ScoreBar({ label, value, color }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 11, color: "var(--text-primary)", fontWeight: 600 }}>{Math.round(value)}</span>
      </div>
      <div style={{ height: 5, background: "var(--bg)", borderRadius: 99, overflow: "hidden", border: "1px solid var(--border)" }}>
        <div style={{
          height: "100%",
          width: `${value}%`,
          background: color || "var(--primary)",
          borderRadius: 99,
          transition: "width 0.6s ease",
        }} />
      </div>
    </div>
  );
}

function QuoteRow({ quote, rank, isTarget, index }) {
  const [expanded, setExpanded] = useState(false);
  const scores = quote.scores || {};
  const cfg = isTarget ? REC_CONFIG.ACCEPT : {};

  return (
    <div style={{
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      overflow: "hidden",
      animation: `fadeUp 0.3s ease ${index * 60}ms both`,
    }}>
      {/* Collapsed row */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: "grid",
          gridTemplateColumns: "36px 2fr 1fr 1fr 100px 28px",
          alignItems: "center",
          padding: "14px 16px",
          cursor: "pointer",
          gap: 12,
          background: expanded ? "var(--primary-dim)" : "var(--surface)",
          transition: "background var(--transition)",
        }}
        onMouseEnter={e => !expanded && (e.currentTarget.style.background = "var(--bg)")}
        onMouseLeave={e => !expanded && (e.currentTarget.style.background = "var(--surface)")}
      >
        {/* Rank */}
        <span style={{
          width: 26, height: 26, borderRadius: 4,
          background: rank === 1 ? "var(--primary)" : "var(--bg)",
          color: rank === 1 ? "#fff" : "var(--text-muted)",
          border: rank === 1 ? "none" : "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 700, flexShrink: 0,
        }}>
          {rank}
        </span>

        {/* LSP + badges */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{quote.lsp}</span>
          {isTarget && (
            <span style={{ fontSize: 9, fontWeight: 700, color: "#15803D", background: "#F0FDF4", border: "1px solid #86EFAC", padding: "1px 6px", borderRadius: 3, letterSpacing: "0.4px" }}>RECOMMENDED</span>
          )}
          {quote.is_new_lsp && (
            <span style={{ fontSize: 9, fontWeight: 700, color: "#6B6B8D", background: "var(--bg)", border: "1px solid var(--border)", padding: "1px 6px", borderRadius: 3 }}>NEW</span>
          )}
          {quote.availability_flag && (
            <span style={{ fontSize: 9, fontWeight: 700, color: "var(--amber)", background: "var(--amber-bg)", border: "1px solid var(--amber-border)", padding: "1px 6px", borderRadius: 3 }}>PARTIAL</span>
          )}
        </div>

        {/* Price */}
        <div>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
            ₹{(quote.raw_quote || 0).toLocaleString("en-IN")}
          </span>
          <span style={{ fontSize: 10, color: (quote.price_delta_pct || 0) > 0 ? "var(--red)" : "var(--green)", fontWeight: 600, marginLeft: 6 }}>
            {quote.price_delta_pct > 0 ? "+" : ""}{(quote.price_delta_pct || 0).toFixed(1)}%
          </span>
        </div>

        {/* Composite */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1, height: 5, background: "var(--bg)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${quote.composite || 0}%`, background: "var(--primary)", borderRadius: 99 }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-primary)", flexShrink: 0 }}>{Math.round(quote.composite || 0)}</span>
        </div>

        {/* OTD */}
        <span style={{ fontSize: 11, color: "var(--text-secondary)", textAlign: "right" }}>
          {(quote.on_time_delivery_pct || 0).toFixed(0)}% OTD
        </span>

        {/* Chevron */}
        <span style={{ color: "var(--text-muted)", fontSize: 12, transform: expanded ? "rotate(90deg)" : "none", transition: "transform var(--transition)" }}>›</span>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          padding: "16px 20px",
          borderTop: "1px solid var(--border)",
          background: "#FAFAFE",
          animation: "fadeUp 0.2s ease both",
        }}>
          {/* Score bars */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.5px", marginBottom: 12, textTransform: "uppercase" }}>Dimension Scores</div>
            <ScoreBar label="Price"       value={scores.price       || 0} color="#3B82F6" />
            <ScoreBar label="Reliability" value={scores.reliability || 0} color="#8B5CF6" />
            <ScoreBar label="Urgency"     value={scores.urgency     || 0} color="#F59E0B" />
            <ScoreBar label="Market"      value={scores.market      || 0} color="#10B981" />
            <ScoreBar label="Threshold"   value={scores.threshold   || 0} color="var(--primary)" />
          </div>

          {/* Price intel table */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.5px", marginBottom: 12, textTransform: "uppercase" }}>Price Intelligence</div>
            {[
              { label: "Quoted Rate",    value: `₹${(quote.raw_quote || 0).toLocaleString("en-IN")}` },
              { label: "Predicted Rate", value: `₹${(quote.predicted_rate || 0).toLocaleString("en-IN")}` },
              { label: "Benchmark",      value: `₹${(quote.benchmark_rate || 0).toLocaleString("en-IN")}` },
              { label: "Price Delta",    value: `${(quote.price_delta_pct || 0).toFixed(1)}%` },
              { label: "Win Rate",       value: `${(quote.lsp_win_rate || 0).toFixed(0)}%` },
              { label: "Neg Gap",        value: `${(quote.lsp_neg_gap_pct || 0).toFixed(1)}%` },
            ].map(row => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border)", fontSize: 12 }}>
                <span style={{ color: "var(--text-secondary)" }}>{row.label}</span>
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Screen4({ scenario, result, onRerun, onBack }) {
  const { ranked_quotes = [], recommendation, lane_context = {}, used_fallback } = result;
  const rec = recommendation || scenario?.ai_recommendation || {};
  const cfg = REC_CONFIG[rec.recommendation] || REC_CONFIG.ACCEPT;
  const req = scenario?.spot_request || {};

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 32px 80px" }}>
      {/* Back */}
      <button
        onClick={onBack}
        style={{ background: "none", border: "none", color: "var(--text-secondary)", fontSize: 13, marginBottom: 24, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, padding: 0 }}
      >
        ← New Analysis
      </button>

      {/* ── Recommendation Card ── */}
      <div style={{
        background: "var(--surface)",
        border: `1px solid ${cfg.border}`,
        borderRadius: "var(--radius-md)",
        padding: "28px 32px",
        marginBottom: 20,
        boxShadow: "var(--shadow-sm)",
        animation: "fadeUp 0.35s ease both",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24 }}>
          <div style={{ flex: 1 }}>
            {/* Decision badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <span style={{
                background: cfg.bg,
                color: cfg.color,
                border: `1px solid ${cfg.border}`,
                fontSize: 13,
                fontWeight: 800,
                padding: "5px 14px",
                borderRadius: "var(--radius-sm)",
                letterSpacing: "0.8px",
              }}>
                {rec.recommendation}
              </span>
              {rec.target_lsp && (
                <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>
                  {rec.target_lsp}
                  {rec.negotiate_target_price && (
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginLeft: 8 }}>
                      · Target ₹{Number(rec.negotiate_target_price).toLocaleString("en-IN")}
                    </span>
                  )}
                </span>
              )}
              {used_fallback && (
                <span style={{ fontSize: 10, color: "var(--text-muted)", background: "var(--bg)", border: "1px solid var(--border)", padding: "2px 8px", borderRadius: "var(--radius-sm)" }}>
                  offline mode
                </span>
              )}
            </div>

            {/* Reasoning */}
            {rec.reasoning && (
              <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--text-secondary)", marginBottom: 14, maxWidth: 560 }}>
                {rec.reasoning}
              </p>
            )}

            {/* Risk */}
            {rec.key_risk && (
              <div style={{
                borderLeft: "3px solid var(--amber)",
                paddingLeft: 12,
                fontSize: 12,
                color: "var(--amber)",
                fontWeight: 500,
              }}>
                ⚑ {rec.key_risk}
              </div>
            )}
          </div>

          <ConfidenceMeter value={rec.confidence} />
        </div>
      </div>

      {/* ── Lane Context Strip ── */}
      {lane_context?.predicted_rate && (
        <div style={{
          display: "flex",
          gap: 1,
          background: "var(--border)",
          borderRadius: "var(--radius)",
          overflow: "hidden",
          marginBottom: 20,
          animation: "fadeUp 0.35s ease 0.1s both",
        }}>
          {[
            { label: "Predicted Rate",  value: `₹${Number(lane_context.predicted_rate).toLocaleString("en-IN")}` },
            { label: "Benchmark",       value: `₹${Number(lane_context.benchmark_rate || 0).toLocaleString("en-IN")}` },
            { label: "Demand Index",    value: `${((lane_context.demand_index || 0) * 100).toFixed(0)}%` },
            { label: "Lane Sample",     value: `${lane_context.lane_sample_size || "—"} shipments` },
          ].map(c => (
            <div key={c.label} style={{ flex: 1, background: "var(--surface)", padding: "12px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.4px", textTransform: "uppercase", marginBottom: 4 }}>{c.label}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{c.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Ranked Quotes ── */}
      <div style={{ marginBottom: 80 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 12, letterSpacing: "-0.2px" }}>
          Ranked Quotations
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ranked_quotes.map((q, i) => (
            <QuoteRow
              key={q.id || i}
              quote={q}
              rank={i + 1}
              index={i}
              isTarget={q.lsp === rec.target_lsp}
            />
          ))}
        </div>
      </div>

      {/* ── Sticky Action Bar ── */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
        padding: "14px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 50,
        boxShadow: "0 -4px 16px rgba(0,0,0,0.06)",
      }}>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onRerun}
            style={{ background: "none", border: "1px solid var(--border)", color: "var(--text-secondary)", padding: "8px 16px", borderRadius: "var(--radius)", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all var(--transition)" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.color = "var(--primary)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
          >
            ↺ Re-run Analysis
          </button>
          <button
            onClick={onBack}
            style={{ background: "none", border: "1px solid var(--border)", color: "var(--text-secondary)", padding: "8px 16px", borderRadius: "var(--radius)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
          >
            All Requests
          </button>
        </div>

        <button
          style={{
            background: cfg.color,
            color: "#fff",
            border: "none",
            padding: "10px 28px",
            borderRadius: "var(--radius)",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: "0.2px",
            boxShadow: `0 2px 12px ${cfg.color}40`,
            transition: "opacity var(--transition)",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          {cfg.label} →
        </button>
      </div>
    </div>
  );
}
