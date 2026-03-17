import React, { useEffect, useState, useRef } from "react";
import { analyseQuotes } from "../api/index";

const STEPS = [
  { label: "Enriching quotes with market intelligence…", icon: "📊" },
  { label: "Scoring transporters across 5 dimensions…", icon: "⚙️" },
  { label: "Running lane benchmark analysis…",           icon: "🛣️" },
  { label: "Generating recommendation…",                 icon: "🤖" },
];

export default function Screen3({ scenario, onComplete, onBack }) {
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError]           = useState(null);
  const called = useRef(false);

  /* Animate through the visual steps while API runs */
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  /* Fire the analysis API once */
  useEffect(() => {
    if (called.current) return;
    called.current = true;

    analyseQuotes(scenario.spot_request, scenario.quotes)
      .then((res) => {
        /* small delay so the last animation step is visible */
        setTimeout(() => onComplete(res.data), 600);
      })
      .catch((err) => {
        console.error("Analysis failed:", err);
        setError(err?.response?.data?.detail || err.message || "Analysis failed. Please try again.");
      });
  }, [scenario, onComplete]);

  const req = scenario.spot_request;

  return (
    <div style={{
      maxWidth: 700,
      margin: "0 auto",
      padding: "80px 32px 60px",
      textAlign: "center",
      animation: "fadeUp 0.35s ease both",
    }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 8, fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.5px", textTransform: "uppercase" }}>
        {req.id}
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.5px", marginBottom: 6 }}>
        {req.origin} → {req.destination}
      </h2>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 48 }}>
        Evaluating {scenario.quotes?.length || 0} quotes against market benchmarks
      </p>

      {/* ── Spinner ── */}
      <div style={{
        width: 72,
        height: 72,
        margin: "0 auto 48px",
        borderRadius: "50%",
        border: "3px solid var(--border)",
        borderTopColor: "var(--primary)",
        animation: "spin 0.8s linear infinite",
      }} />

      {/* ── Step list ── */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        maxWidth: 400,
        margin: "0 auto 48px",
        textAlign: "left",
      }}>
        {STEPS.map((step, i) => {
          const done    = i < activeStep;
          const current = i === activeStep;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                borderRadius: "var(--radius)",
                background: current ? "var(--primary-dim, rgba(57,49,133,0.08))" : "var(--surface)",
                border: `1px solid ${current ? "var(--primary)" : "var(--border)"}`,
                opacity: done ? 0.45 : 1,
                transition: "all 0.35s ease",
              }}
            >
              <span style={{ fontSize: 16 }}>{done ? "✓" : step.icon}</span>
              <span style={{
                fontSize: 13,
                fontWeight: current ? 600 : 400,
                color: current ? "var(--text-primary)" : "var(--text-secondary)",
              }}>
                {step.label}
              </span>
              {current && (
                <span style={{
                  marginLeft: "auto",
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--primary)",
                  animation: "pulse 1.5s ease-in-out infinite",
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Error state ── */}
      {error && (
        <div style={{
          background: "var(--red-bg, #FEF2F2)",
          border: "1px solid var(--red-border, #FCA5A5)",
          borderRadius: "var(--radius)",
          padding: "16px 20px",
          marginBottom: 24,
          textAlign: "left",
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--red, #DC2626)", marginBottom: 4 }}>
            Analysis failed
          </div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{error}</div>
          <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
            <button
              onClick={() => {
                setError(null);
                setActiveStep(0);
                called.current = false;
              }}
              style={{
                background: "var(--primary)",
                color: "#fff",
                border: "none",
                padding: "8px 20px",
                borderRadius: "var(--radius)",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Retry
            </button>
            <button
              onClick={onBack}
              style={{
                background: "none",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
                padding: "8px 20px",
                borderRadius: "var(--radius)",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              ← Back
            </button>
          </div>
        </div>
      )}

      {/* ── CSS Keyframes (inline) ── */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}