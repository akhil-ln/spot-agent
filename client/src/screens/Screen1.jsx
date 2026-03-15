import React, { useState } from "react";

const URGENCY_COLOR = { HIGH: "#DC2626", MEDIUM: "#D97706", LOW: "#16A34A" };
const URGENCY_BG = { HIGH: "#FEF2F2", MEDIUM: "#FFFBEB", LOW: "#F0FDF4" };

function formatDate(str) {
  if (!str) return "—";
  try {
    return new Date(str).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return str;
  }
}

function UrgencyBadge({ urgency }) {
  return (
    <span
      style={{
        background: URGENCY_BG[urgency] || "#F5F5FA",
        color: URGENCY_COLOR[urgency] || "#555",
        border: `1px solid ${URGENCY_COLOR[urgency]}30`,
        fontSize: 10,
        fontWeight: 700,
        padding: "5px 8px",
        borderRadius: 4,
        letterSpacing: "0.6px",
        height: "max-content",
      }}
    >
      {urgency}
    </span>
  );
}

function Chip({ label }) {
  return (
    <span
      style={{
        fontSize: 11,
        color: "#555",
        background: "#F7F7FA",
        border: "1px solid #ECECF3",
        padding: "4px 10px",
        borderRadius: 6,
        fontWeight: 500,
      }}
    >
      {label}
    </span>
  );
}

function RequestCard({ scenario, onClick }) {
  const [hover, setHover] = useState(false);

  const req = scenario.spot_request;
  const qCount = scenario.quotes?.length || 0;

  const origin = req.origin?.split(",")[0];
  const dest = req.destination?.split(",")[0];

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "#FFFFFF",
        border: hover ? "1px solid #E0E0F5" : "1px solid #ECECF3",
        borderRadius: 10,
        padding: 20,
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: hover
          ? "0 6px 18px rgba(0,0,0,0.06)"
          : "0 2px 6px rgba(0,0,0,0.03)",
      }}
    >
      {/* Top Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              color: "#8A8AA3",
              marginBottom: 4,
            }}
          >
            {req.id} • {formatDate(req.raised_at)}
          </div>

          {/* Lane */}
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#1A1A2E",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {origin}
            <span style={{ color: "#6366F1" }}>→</span>
            {dest}
          </div>
        </div>

        <UrgencyBadge urgency={req.urgency} />
      </div>

      {/* Chips */}
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 16,
        }}
      >
        <Chip label={req.truck_type} />
        <Chip
          label={
            req.trucks_required > 1
              ? `${req.trucks_required} trucks`
              : "1 truck"
          }
        />
        <Chip
          label={`Threshold ₹${(req.cost_threshold || 0).toLocaleString(
            "en-IN"
          )}`}
        />
      </div>

      {/* Bottom Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: 13,
            color: "#555",
          }}
        >
          <span style={{ fontWeight: 700, color: "#111" }}>{qCount}</span>{" "}
          quotes received
        </div>

        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: hover ? "#6366F1" : "#8A8AA3",
            transition: "color 0.2s",
          }}
        >
          View Quotes →
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div
      style={{
        border: "1px solid #ECECF3",
        borderRadius: 10,
        padding: 20,
        background: "#FFF",
      }}
    >
      <div
        style={{
          height: 14,
          width: 120,
          background: "#F1F1F6",
          borderRadius: 4,
          marginBottom: 10,
        }}
      />
      <div
        style={{
          height: 18,
          width: 200,
          background: "#F1F1F6",
          borderRadius: 4,
          marginBottom: 16,
        }}
      />
      <div
        style={{
          height: 12,
          width: 100,
          background: "#F1F1F6",
          borderRadius: 4,
        }}
      />
    </div>
  );
}

export default function Screen1({ scenarios, loading, onSelect }) {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
      {/* Header */}

      <div style={{ marginBottom: 30 }}>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            marginBottom: 6,
          }}
        >
          Active Spot Requests
        </h1>

        <p
          style={{
            fontSize: 13,
            color: "#6B6B80",
          }}
        >
          Select a shipment to view transporter quotes and run AI analysis.
        </p>
      </div>

      {/* Cards */}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          : scenarios.map((s) => (
              <RequestCard
                key={s.scenario_id}
                scenario={s}
                onClick={() => onSelect(s)}
              />
            ))}
      </div>
    </div>
  );
}