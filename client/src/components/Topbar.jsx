import React from "react";

const S = {
  nav: {
    background: "#FFFFFF",
    borderBottom: "1px solid var(--border)",
    padding: "0 40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    cursor: "pointer",
  },
  logoMark: {
    width: 28,
    height: 28,
    background: "var(--primary)",
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "-0.5px",
  },
  logoText: {
    fontSize: 15,
    fontWeight: 700,
    color: "var(--text-primary)",
    letterSpacing: "-0.3px",
  },
  modulePill: {
    fontSize: 11,
    fontWeight: 600,
    color: "var(--primary)",
    background: "var(--primary-dim)",
    padding: "2px 8px",
    borderRadius: 4,
    letterSpacing: "0.3px",
    textTransform: "uppercase",
  },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    color: "var(--text-muted)",
  },
  breadcrumbActive: {
    color: "var(--text-secondary)",
    fontWeight: 500,
  },
  sep: { color: "var(--border-strong)" },
};

export default function Topbar({ page, selectedScenario, onLogoClick, onSpotListClick }) {
  const req = selectedScenario?.spot_request;

  return (
    <nav style={S.nav}>
      {/* Left: Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={S.logo} onClick={onLogoClick}>
          <div style={S.logoMark}>L</div>
          <span style={S.logoText}>LoRRI</span>
        </div>
        <div style={{ width: 1, height: 18, background: "var(--border)" }} />
        <span
          style={{ ...S.modulePill, cursor: page > 1 ? "pointer" : "default" }}
          onClick={page > 1 ? onSpotListClick : undefined}
        >
          Spot
        </span>
      </div>

      {/* Center: Breadcrumb (only on spot screens) */}
      {page >= 2 && req && (
        <div style={S.breadcrumb}>
          <span
            style={{ cursor: "pointer" }}
            onClick={onSpotListClick}
          >
            Spot Requests
          </span>
          <span style={S.sep}>/</span>
          <span style={S.breadcrumbActive}>
            {req.origin?.split(",")[0]} → {req.destination?.split(",")[0]}
          </span>
          {page === 3 && (
            <>
              <span style={S.sep}>/</span>
              <span style={S.breadcrumbActive}>Analysing</span>
            </>
          )}
          {page === 4 && (
            <>
              <span style={S.sep}>/</span>
              <span style={S.breadcrumbActive}>Recommendation</span>
            </>
          )}
        </div>
      )}

      {/* Right: Step indicator */}
      {page >= 1 && page <= 4 && (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {[1, 2, 3, 4].map(n => (
            <div
              key={n}
              style={{
                width: n === page - 0 ? 20 : 6,
                height: 6,
                borderRadius: 99,
                background: n <= page - 0 ? "var(--primary)" : "var(--border)",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      )}
    </nav>
  );
}
