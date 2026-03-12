import React from "react";

const COLORS = {
  navy: "#0D1B2A",
  navyLight: "#162032",
  accent: "#1E90FF",
  accentDim: "#1565C0",
  textPrimary: "#FFFFFF",
  textSecondary: "#94A3B8",
  border: "#1E3A5F",
};

const Topbar = ({ currentStep }) => {
  return (
    <div
      style={{
        background: COLORS.navy,
        borderBottom: `1px solid ${COLORS.border}`,
        padding: "0 32px",
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Left: Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            width: "32px",
            height: "32px",
            background: "linear-gradient(135deg, #1E90FF 0%, #0052CC 100%)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-0.5px",
          }}
        >
          L
        </div>
        <div>
          <span
            style={{
              color: COLORS.textPrimary,
              fontSize: "15px",
              fontWeight: 700,
              letterSpacing: "0.3px",
            }}
          >
            LoRRI
          </span>
          <span
            style={{
              color: COLORS.textSecondary,
              fontSize: "13px",
              marginLeft: "8px",
              fontWeight: 400,
            }}
          >
            Spot Procurement Agent
          </span>
        </div>
      </div>

      {/* Right: Step indicator + meta */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <span
          style={{
            color: COLORS.textSecondary,
            fontSize: "12px",
            fontFamily: "monospace",
          }}
        >
          SR-2024-0315-001
        </span>
        <div
          style={{
            background: COLORS.navyLight,
            border: `1px solid ${COLORS.border}`,
            borderRadius: "20px",
            padding: "3px 12px",
            fontSize: "12px",
            color: COLORS.textSecondary,
          }}
        >
          Step {currentStep} / 4
        </div>
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: "#1E3A5F",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            color: COLORS.textSecondary,
            cursor: "pointer",
          }}
        >
          ⚙
        </div>
      </div>
    </div>
  );
};

export default Topbar;
