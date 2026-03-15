import React from "react";

const DARK = "#0E0C22";
const MID  = "#1C193A";

const S = {
  page: {
    minHeight: "100vh",
    background: DARK,
    color: "#FFFFFF",
    display: "flex",
    flexDirection: "column",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 48px",
    height: 60,
    borderBottom: "1px solid rgba(255,255,255,0.07)",
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
  },
  logoText: {
    fontSize: 15,
    fontWeight: 700,
    color: "#fff",
    letterSpacing: "-0.3px",
  },
  navCta: {
    background: "var(--primary)",
    color: "#fff",
    border: "none",
    padding: "8px 20px",
    borderRadius: "var(--radius)",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "background var(--transition)",
  },
  hero: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    padding: "80px 48px 60px",
    gap: 64,
    maxWidth: 1200,
    margin: "0 auto",
    width: "100%",
  },
  heroLeft: {
    flex: "0 0 520px",
  },
  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "rgba(57,49,133,0.25)",
    border: "1px solid rgba(57,49,133,0.5)",
    borderRadius: 4,
    padding: "4px 12px",
    fontSize: 11,
    fontWeight: 600,
    color: "#a8a3e8",
    letterSpacing: "0.8px",
    textTransform: "uppercase",
    marginBottom: 24,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#7B76D4",
    animation: "pulse 2s ease-in-out infinite",
  },
  h1: {
    fontSize: 44,
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: "-1.5px",
    marginBottom: 20,
    color: "#FFFFFF",
  },
  h1Accent: {
    color: "#7B76D4",
  },
  subline: {
    fontSize: 16,
    lineHeight: 1.7,
    color: "rgba(255,255,255,0.55)",
    marginBottom: 36,
    maxWidth: 440,
  },
  ctaRow: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  ctaPrimary: {
    background: "var(--primary)",
    color: "#fff",
    border: "none",
    padding: "12px 28px",
    borderRadius: "var(--radius)",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 8,
    transition: "background var(--transition)",
  },
  ctaArrow: {
    fontSize: 16,
    transition: "transform var(--transition)",
  },
  ctaSecondary: {
    background: "transparent",
    color: "rgba(255,255,255,0.5)",
    border: "none",
    padding: "12px 0",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
  },
  heroRight: {
    flex: 1,
    position: "relative",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 1,
    background: "rgba(255,255,255,0.06)",
    borderRadius: "var(--radius-md)",
    padding: 1,
    border: "1px solid rgba(255,255,255,0.08)",
    marginBottom: 48,
  },
  statCell: {
    background: MID,
    padding: "20px 24px",
    textAlign: "center",
  },
  statNum: {
    fontSize: 28,
    fontWeight: 800,
    color: "#fff",
    letterSpacing: "-1px",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
    lineHeight: 1.4,
  },
  howSection: {
    padding: "0 48px 80px",
    maxWidth: 1200,
    margin: "0 auto",
    width: "100%",
  },
  howLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "rgba(255,255,255,0.3)",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    marginBottom: 24,
  },
  steps: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 2,
  },
  step: {
    background: MID,
    padding: "24px 20px",
    borderRadius: "var(--radius)",
    border: "1px solid rgba(255,255,255,0.06)",
    position: "relative",
    overflow: "hidden",
  },
  stepNum: {
    fontSize: 36,
    fontWeight: 800,
    color: "rgba(57,49,133,0.4)",
    lineHeight: 1,
    marginBottom: 12,
    letterSpacing: "-2px",
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: "#fff",
    marginBottom: 6,
  },
  stepDesc: {
    fontSize: 12,
    color: "rgba(255,255,255,0.38)",
    lineHeight: 1.6,
  },
};

// Live mock preview card shown in hero
function PreviewCard() {
  return (
    <div style={{
      background: "#1C193A",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "var(--radius-md)",
      padding: 20,
      fontSize: 12,
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", display: "block", marginBottom: 2 }}>SPOT REQUEST · SR-001</span>
          <span style={{ fontWeight: 600, color: "#fff", fontSize: 13 }}>Fazilka, Punjab → Alwar, Rajasthan</span>
        </div>
        <span style={{ background: "#DC2626", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 3, letterSpacing: "0.5px" }}>HIGH</span>
      </div>
      {/* Info row */}
      <div style={{ display: "flex", gap: 16, marginBottom: 16, color: "rgba(255,255,255,0.4)", fontSize: 11 }}>
        <span>15 MT OPENBODY</span>
        <span>·</span>
        <span>Threshold: ₹45,000</span>
        <span>·</span>
        <span>4 quotes received</span>
      </div>
      {/* Quotes */}
      {[
        { lsp: "Atharv Logistics", rate: "38,500", delta: "−14%", ok: true },
        { lsp: "Shree Ram Transport", rate: "41,000", delta: "−8%", ok: true },
        { lsp: "FastMove Carriers", rate: "51,000", delta: "+13%", ok: false },
      ].map((q, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "8px 0",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}>
          <span style={{ color: "rgba(255,255,255,0.6)" }}>{q.lsp}</span>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ color: "#fff", fontWeight: 600 }}>₹{q.rate}</span>
            <span style={{ fontSize: 10, color: q.ok ? "#4ADE80" : "#F87171", fontWeight: 600 }}>{q.delta}</span>
          </div>
        </div>
      ))}
      {/* AI Badge */}
      <div style={{
        marginTop: 16,
        background: "rgba(57,49,133,0.3)",
        border: "1px solid rgba(57,49,133,0.5)",
        borderRadius: "var(--radius-sm)",
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <span style={{ color: "#a8a3e8", fontSize: 11, fontWeight: 600 }}>AI RECOMMENDATION</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", animation: "pulse 1.5s ease-in-out infinite" }} />
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>ACCEPT · 91% confidence</span>
        </div>
      </div>
    </div>
  );
}

export default function Landing({ onEnter }) {

  return (
    <div style={S.page}>
      {/* Nav */}
      <nav style={S.nav}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={S.logoMark}>L</div>
          <span style={S.logoText}>LoRRI</span>
        </div>
        <button
          style={S.navCta}
          onClick={onEnter}
          onMouseEnter={e => e.target.style.background = "var(--primary-hover)"}
          onMouseLeave={e => e.target.style.background = "var(--primary)"}
        >
          Open LoRRI Spot →
        </button>
      </nav>

      {/* Hero */}
      <section style={S.hero}>
        <div style={S.heroLeft} className="anim-fade-up">
          <div style={S.eyebrow}>
            <div style={S.dot} />
            LoRRI Spot · Decision Agent
          </div>
          <h1 style={S.h1}>
            Stop guessing.<br />
            <span style={S.h1Accent}>Start deciding.</span>
          </h1>
          <p style={S.subline}>
            Your procurement team evaluates 5 freight quotes manually — cross-referencing rates,
            calling LSPs, and guessing on reliability. LoRRI Spot replaces hours of judgment with
            a 5-second AI recommendation.
          </p>
          <div style={S.ctaRow}>
            <button
              style={S.ctaPrimary}
              onClick={onEnter}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--primary-hover)"; e.currentTarget.querySelector(".arr").style.transform = "translateX(4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--primary)"; e.currentTarget.querySelector(".arr").style.transform = "translateX(0)"; }}
            >
              View Open Spot Requests
              <span className="arr" style={S.ctaArrow}>→</span>
            </button>
            <button style={S.ctaSecondary}>How it works ↓</button>
          </div>
        </div>

        <div style={S.heroRight} className="anim-fade-up">
          <PreviewCard />
        </div>
      </section>

      {/* Stats */}
      <div style={{ padding: "0 48px 48px", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <div style={S.statsRow}>
          {[
            { num: "2-3 hrs", label: "Manual evaluation time per spot request" },
            { num: "0 data", label: "Reliability context from price alone" },
            { num: "₹80K+", label: "Avg cost of a poor spot decision" },
          ].map((s, i) => (
            <div key={i} style={{ ...S.statCell, borderRadius: i === 0 ? "var(--radius-md) 0 0 var(--radius-md)" : i === 2 ? "0 var(--radius-md) var(--radius-md) 0" : 0 }}>
              <div style={S.statNum}>{s.num}</div>
              <div style={S.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={S.howSection}>
        <div style={S.howLabel}>How it works</div>
        <div style={S.steps}>
          {[
            { n: "01", title: "Receive Quotes", desc: "LSPs submit rates for your open spot request. You see raw prices — nothing more." },
            { n: "02", title: "AI Enrichment", desc: "Agent fetches market benchmarks and profiles each LSP from 20,000 historical shipments." },
            { n: "03", title: "5-D Scoring", desc: "Every quote is scored on Price, Reliability, Urgency, Market Demand, and Threshold." },
            { n: "04", title: "Accept or Negotiate", desc: "AI outputs a ranked recommendation: Accept, Negotiate with a target price, or Reject all." },
          ].map((step, i) => (
            <div key={i} style={S.step}>
              <div style={S.stepNum}>{step.n}</div>
              <div style={S.stepTitle}>{step.title}</div>
              <div style={S.stepDesc}>{step.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
