import React from "react";

export default function Topbar({ page, selectedScenario, onLogoClick, onSpotListClick }) {
  const req = selectedScenario?.spot_request;

  return (
    <nav style={{
      background: "#FFFFFF",
      borderBottom: "1px solid var(--border)",
      display: "flex",
      alignItems: "stretch",
      height: 56,
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 1px 0 var(--border)",
    }}>
      {/* Purple brand slab */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 11,
          padding: "0 22px",
          background: "var(--primary)",
          cursor: "pointer",
          flexShrink: 0,
          position: "relative",
        }}
        onClick={onLogoClick}
      >
        {/* diagonal notch on right */}
        <div style={{
          position: "absolute",
          right: -14,
          top: 0,
          bottom: 0,
          width: 28,
          background: "var(--primary)",
          clipPath: "polygon(0 0, 60% 0, 100% 50%, 60% 100%, 0 100%)",
          zIndex: 1,
        }} />
        <div style={{
          width: 28, height: 28,
          background: "rgba(255,255,255,0.18)",
          border: "1.5px solid rgba(255,255,255,0.3)",
          borderRadius: 7,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 700, color: "#fff",
          position: "relative", zIndex: 2,
        }}>L</div>
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: "-0.3px", lineHeight: 1.2 }}>LoRRI</div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", letterSpacing: "0.8px", textTransform: "uppercase" }}>Spot · Agent</div>
        </div>
      </div>

      {/* Main nav area */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px 0 42px",
      }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
          <span
            style={{
              color: page === 1 ? "var(--text-primary)" : "var(--text-muted)",
              fontWeight: page === 1 ? 600 : 400,
              cursor: page > 1 ? "pointer" : "default",
            }}
            onClick={page > 1 ? onSpotListClick : undefined}
          >
            Spot Requests
          </span>
          {page >= 2 && req && (
            <>
              <span style={{ color: "var(--border-strong)", fontSize: 16 }}>›</span>
              <span
                style={{ color: page === 2 ? "var(--text-primary)" : "var(--text-muted)", fontWeight: page === 2 ? 600 : 400 }}
              >
                {req.origin?.split(",")[0]} → {req.destination?.split(",")[0]}
              </span>
            </>
          )}
          {page === 3 && (
            <>
              <span style={{ color: "var(--border-strong)", fontSize: 16 }}>›</span>
              <span style={{ color: "var(--primary)", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%", background: "var(--primary)",
                  display: "inline-block",
                  animation: "pulse 1.5s ease-in-out infinite",
                }} />
                Analysing
              </span>
            </>
          )}
          {page === 4 && (
            <>
              <span style={{ color: "var(--border-strong)", fontSize: 16 }}>›</span>
              <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>AI Recommendation</span>
            </>
          )}
        </div>

        {/* Right: live context pill */}
        {page >= 1 && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 12,
            color: "var(--text-muted)",
          }}>
            {page === 2 && (
              <span style={{
                background: "var(--amber-bg)",
                color: "var(--amber)",
                border: "1px solid var(--amber-border)",
                fontSize: 11,
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: "var(--radius-sm)",
              }}>
                Raw quotes only - run AI to score
              </span>
            )}
            {page === 3 && (
              <span style={{
                background: "var(--primary-dim)",
                color: "var(--primary)",
                border: "1px solid var(--primary-border)",
                fontSize: 11,
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: "var(--radius-sm)",
              }}>
                AI engine running…
              </span>
            )}
            {page === 4 && (
              <span style={{
                background: "var(--green-bg)",
                color: "var(--green)",
                border: "1px solid var(--green-border)",
                fontSize: 11,
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: "var(--radius-sm)",
              }}>
                Analysis complete
              </span>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
