import React from "react";

// ── Design tokens ──────────────────────────────────────────────────────────────
const C = {
  navy: "#0D1B2A",
  navyLight: "#162032",
  accent: "#1E90FF",
  accentGlow: "rgba(30,144,255,0.12)",
  border: "#E2E8F0",
  borderDark: "#1E3A5F",
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",
  white: "#FFFFFF",
  pageBlue: "#F0F4F8",
  urgencyHigh: "#EF4444",
  urgencyHighBg: "#FEF2F2",
  urgencyMed: "#F59E0B",
  urgencyLow: "#22C55E",
  cardShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
  cardShadowHover: "0 4px 12px rgba(0,0,0,0.12)",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatCurrency = (n) =>
  `₹${Number(n).toLocaleString("en-IN")}`;

const formatDate = (d) => {
  const date = new Date(d);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const URGENCY_CONFIG = {
  HIGH:   { label: "HIGH",   color: C.urgencyHigh, bg: C.urgencyHighBg, dot: C.urgencyHigh },
  MEDIUM: { label: "MEDIUM", color: "#B45309",      bg: "#FFFBEB",       dot: C.urgencyMed  },
  LOW:    { label: "LOW",    color: "#166534",      bg: "#F0FDF4",       dot: C.urgencyLow  },
};

// ── Sub-components ─────────────────────────────────────────────────────────────

const SectionHeader = ({ title, subtitle }) => (
  <div style={{ marginBottom: "16px" }}>
    <h3
      style={{
        margin: 0,
        fontSize: "11px",
        fontWeight: 700,
        color: C.textMuted,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
      }}
    >
      {title}
    </h3>
    {subtitle && (
      <p style={{ margin: "2px 0 0", fontSize: "12px", color: C.textSecondary }}>
        {subtitle}
      </p>
    )}
  </div>
);

const DataCell = ({ label, value, large, mono, accent }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
    <span
      style={{
        fontSize: "11px",
        fontWeight: 600,
        color: C.textMuted,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontSize: large ? "22px" : "15px",
        fontWeight: large ? 700 : 600,
        color: accent ? C.accent : C.textPrimary,
        fontFamily: mono ? "monospace" : "inherit",
        lineHeight: 1.2,
      }}
    >
      {value}
    </span>
  </div>
);

const Divider = ({ vertical }) =>
  vertical ? (
    <div style={{ width: "1px", background: C.border, alignSelf: "stretch", margin: "0 8px" }} />
  ) : (
    <div style={{ height: "1px", background: C.border, margin: "20px 0" }} />
  );

// ── Route Visual Component ─────────────────────────────────────────────────────
const RouteCard = ({ origin, destination }) => (
  <div
    style={{
      background: C.white,
      border: `1px solid ${C.border}`,
      borderRadius: "12px",
      padding: "24px 28px",
      boxShadow: C.cardShadow,
    }}
  >
    <SectionHeader title="Freight Route" />
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0",
        marginTop: "8px",
      }}
    >
      {/* Origin */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          minWidth: "160px",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            color: C.textMuted,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "6px",
          }}
        >
          Origin
        </div>
        <div
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: C.accent,
            marginBottom: "6px",
            boxShadow: `0 0 0 3px ${C.accentGlow}`,
          }}
        />
        <div style={{ fontSize: "17px", fontWeight: 700, color: C.textPrimary, lineHeight: 1.2 }}>
          {origin.split(",")[0]}
        </div>
        <div style={{ fontSize: "12px", color: C.textSecondary, marginTop: "2px" }}>
          {origin.split(",")[1]?.trim()}
        </div>
      </div>

      {/* Arrow/Line */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          marginTop: "24px",
        }}
      >
        <div
          style={{
            flex: 1,
            height: "2px",
            background: `linear-gradient(90deg, ${C.accent} 0%, #64748B 100%)`,
            borderRadius: "2px",
            position: "relative",
          }}
        >
          {/* Truck icon */}
          <div
            style={{
              position: "absolute",
              top: "-10px",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "18px",
            }}
          >
            🚛
          </div>
          {/* Arrow head */}
          <div
            style={{
              position: "absolute",
              right: "-6px",
              top: "-4px",
              width: 0,
              height: 0,
              borderTop: "5px solid transparent",
              borderBottom: "5px solid transparent",
              borderLeft: "8px solid #64748B",
            }}
          />
        </div>
      </div>

      {/* Destination */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          minWidth: "160px",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            color: C.textMuted,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "6px",
          }}
        >
          Destination
        </div>
        <div
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: "#22C55E",
            marginBottom: "6px",
            boxShadow: "0 0 0 3px rgba(34,197,94,0.15)",
          }}
        />
        <div style={{ fontSize: "17px", fontWeight: 700, color: C.textPrimary, lineHeight: 1.2 }}>
          {destination.split(",")[0]}
        </div>
        <div style={{ fontSize: "12px", color: C.textSecondary, marginTop: "2px" }}>
          {destination.split(",")[1]?.trim()}
        </div>
      </div>
    </div>
  </div>
);

// ── Urgency Badge ──────────────────────────────────────────────────────────────
const UrgencyBadge = ({ level }) => {
  const cfg = URGENCY_CONFIG[level] || URGENCY_CONFIG.MEDIUM;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        background: cfg.bg,
        border: `1px solid ${cfg.color}30`,
        borderRadius: "6px",
        padding: "4px 10px",
      }}
    >
      <div
        style={{
          width: "7px",
          height: "7px",
          borderRadius: "50%",
          background: cfg.dot,
          animation: level === "HIGH" ? "pulse 1.5s infinite" : "none",
        }}
      />
      <span style={{ fontSize: "12px", fontWeight: 700, color: cfg.color, letterSpacing: "0.05em" }}>
        {cfg.label}
      </span>
    </div>
  );
};

// ── Main Screen ────────────────────────────────────────────────────────────────
const Screen1 = ({ spotRequest, onNext }) => {
  const {
    id, origin, destination, truck_type, weight,
    placement_date, urgency, cost_threshold, trucks_required,
  } = spotRequest;

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "32px 24px 64px",
      }}
    >
      {/* ── Page header ─────────────────────────────────────────────── */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: 700,
              color: C.textPrimary,
            }}
          >
            Spot Request Details
          </h1>
          <UrgencyBadge level={urgency} />
        </div>
        <p style={{ margin: 0, fontSize: "13px", color: C.textSecondary }}>
          Request ID:{" "}
          <span style={{ fontFamily: "monospace", color: C.accent, fontWeight: 600 }}>{id}</span>
          {" "}· Opened{" "}
          <span style={{ color: C.textPrimary }}>{formatDate(placement_date)}</span>
        </p>
      </div>

      {/* ── Route card ─────────────────────────────────────────────── */}
      <RouteCard origin={origin} destination={destination} />

      {/* ── Shipment specs grid ─────────────────────────────────────── */}
      <div
        style={{
          background: C.white,
          border: `1px solid ${C.border}`,
          borderRadius: "12px",
          padding: "24px 28px",
          boxShadow: C.cardShadow,
          marginTop: "16px",
        }}
      >
        <SectionHeader title="Shipment Specifications" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "24px",
          }}
        >
          <DataCell label="Truck Type" value={truck_type} />
          <DataCell label="Payload" value={`${weight} MT`} />
          <DataCell label="Trucks Required" value={trucks_required} />
          <DataCell label="Placement Date" value={formatDate(placement_date)} />
        </div>
      </div>

      {/* ── Cost intelligence card ──────────────────────────────────── */}
      <div
        style={{
          background: `linear-gradient(135deg, ${C.navy} 0%, #162032 100%)`,
          border: `1px solid ${C.borderDark}`,
          borderRadius: "12px",
          padding: "24px 28px",
          boxShadow: C.cardShadow,
          marginTop: "16px",
          display: "flex",
          alignItems: "center",
          gap: "32px",
        }}
      >
        {/* Threshold */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#94A3B8",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "8px",
            }}
          >
            Cost Threshold
          </div>
          <div style={{ fontSize: "32px", fontWeight: 800, color: "#FFFFFF", lineHeight: 1 }}>
            {formatCurrency(cost_threshold)}
          </div>
          <div style={{ fontSize: "12px", color: "#64748B", marginTop: "6px" }}>
            Maximum accepted rate per truck
          </div>
        </div>

        <div style={{ width: "1px", background: "#1E3A5F", alignSelf: "stretch" }} />

        {/* Urgency detail */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#94A3B8",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "8px",
            }}
          >
            Urgency Level
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                fontSize: "28px",
                fontWeight: 800,
                color: URGENCY_CONFIG[urgency]?.color || "#F59E0B",
                lineHeight: 1,
              }}
            >
              {urgency}
            </div>
          </div>
          <div style={{ fontSize: "12px", color: "#64748B", marginTop: "6px" }}>
            Requires same-day quote evaluation
          </div>
        </div>

        <div style={{ width: "1px", background: "#1E3A5F", alignSelf: "stretch" }} />

        {/* Active quote count placeholder */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#94A3B8",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "8px",
            }}
          >
            Quotes Received
          </div>
          <div style={{ fontSize: "32px", fontWeight: 800, color: "#FFFFFF", lineHeight: 1 }}>
            4
          </div>
          <div style={{ fontSize: "12px", color: "#64748B", marginTop: "6px" }}>
            From registered LSPs on this lane
          </div>
        </div>
      </div>

      {/* ── Action bar ─────────────────────────────────────────────── */}
      <div
        style={{
          marginTop: "32px",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <span style={{ fontSize: "13px", color: C.textSecondary }}>
          Ready to evaluate incoming bids
        </span>
        <button
          id="btn-view-quotes"
          onClick={onNext}
          style={{
            background: "linear-gradient(135deg, #1E90FF 0%, #0052CC 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "12px 28px",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 4px 14px rgba(30,144,255,0.35)",
            transition: "transform 0.15s, box-shadow 0.15s",
            letterSpacing: "0.02em",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 6px 18px rgba(30,144,255,0.45)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 14px rgba(30,144,255,0.35)";
          }}
        >
          View Incoming Quotes
          <span style={{ fontSize: "16px" }}>→</span>
        </button>
      </div>

      {/* Pulse animation for urgency dot */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
};

export default Screen1;
