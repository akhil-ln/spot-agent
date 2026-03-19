import React from "react";
import "./Landing.css";
import { Box, Truck } from "lucide-react";

function PreviewCard() {
  return (
    <div className="lorri-card lorri-fade-up-3">
      <div className="lorri-card-topline" />

      <div className="lorri-card-header">
        <div>
          <div className="lorri-card-eyebrow">
            <Box size={14} />
            Spot Request · SR-2847
          </div>
          <div className="lorri-card-route">
            <span className="lorri-route-icon"><Truck size={14} /></span>
            Fazilka, Punjab → Alwar, Rajasthan
          </div>
        </div>
        <span className="lorri-badge-high">HIGH PRI</span>
      </div>

      <div className="lorri-card-meta">
        <span>15 MT · Full Truck</span>
        <span className="lorri-meta-sep" />
        <span>Open Body</span>
        <span className="lorri-meta-sep" />
        <span>Threshold ₹45,000</span>
        <span className="lorri-meta-sep" />
        <span>4 quotes</span>
      </div>

      <div className="lorri-quote-thead">
        <span className="lorri-quote-th">Transporter</span>
        <span className="lorri-quote-th">Rate · vs Threshold</span>
      </div>

      <div className="lorri-quotes">
        {[
          { name: "Atharv Logistics",    tag: "FTL · Rajasthan coverage", rate: "₹38,500", delta: "−14%", ok: true,  best: true  },
          { name: "Shree Ram Transport", tag: "FTL · North India",         rate: "₹41,000", delta: "−8%",  ok: true,  best: false },
          { name: "FastMove Carriers",   tag: "FTL · Pan India",           rate: "₹51,000", delta: "+13%", ok: false, best: false },
        ].map((q, i) => (
          <div key={i} className={`lorri-quote-row${q.best ? " best" : ""}`}>
            <div>
              <span className="lorri-lsp-name">{q.name}</span>
              <span className="lorri-lsp-tag">{q.tag}</span>
            </div>
            <div className="lorri-quote-right">
              <span className="lorri-rate">{q.rate}</span>
              <span className={`lorri-delta ${q.ok ? "ok" : "bad"}`}>{q.delta}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="lorri-ai-rec">
        <div>
          <span className="lorri-ai-label">AI Recommendation</span>
          <div className="lorri-ai-verdict">ACCEPT · Atharv Logistics</div>
        </div>
        <div className="lorri-ai-right">
          <div className="lorri-confidence">91% conf.</div>
          <div className="lorri-conf-bar">
            <div className="lorri-conf-fill" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Landing({ onEnter }) {
  return (
    <div className="lorri-page">
      <div className="lorri-bg-splash" />

      {/* ─────────────────────────────────────────
          NAV — split two-tone bar
          [ PURPLE BRAND ] [ live crumbs ··· ] [ CTA ]
      ───────────────────────────────────────── */}
      <nav className="lorri-nav">

        {/* Vivid purple brand slab with diagonal notch */}
        <div className="lorri-nav-brand">
          <div className="lorri-logo-mark">L</div>
          <div>
            <span className="lorri-logo-text">LoRRI</span>
            <span className="lorri-logo-product">Spot · Decision Agent</span>
          </div>
        </div>

        {/* Live context crumbs */}
        <div className="lorri-nav-context">
          <div className="lorri-nav-crumb">
            <div className="lorri-status-dot green" />
            <span className="value">14 open spot requests</span>
          </div>
          <div className="lorri-nav-crumb">
            <Truck size={11} style={{ color: "var(--text-muted)" }} />
            <span className="label">Mode</span>
            <span className="value">Road Freight · FTL / LTL</span>
          </div>
          <div className="lorri-nav-crumb">
            <span className="label">Coverage</span>
            <span className="value">North India · Pan India</span>
          </div>
          <div className="lorri-nav-crumb">
            <div className="lorri-status-dot amber" />
            <span className="label">Avg threshold</span>
            <span className="value">₹42,400</span>
          </div>
        </div>

        {/* CTA */}
        <div className="lorri-nav-actions">
          <button className="lorri-btn-nav" onClick={onEnter}>
            Open Dashboard →
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="lorri-hero">
        <div>
          <div className="lorri-domain-strip lorri-fade-up">
            <span className="lorri-chip primary-domain">
              <Truck size={11} /> Road Freight
            </span>
            <span className="lorri-chip secondary">FTL / LTL</span>
            <span className="lorri-chip secondary">Spot Procurement</span>
            <span className="lorri-chip secondary">LSP Evaluation</span>
          </div>

          <h1 className="lorri-h1 lorri-fade-up-1">Stop guessing.</h1>
          <span className="lorri-h1-accent lorri-fade-up-1">Start deciding.</span>

          {/* <p className="lorri-subline lorri-fade-up-2">
            Every day your team manually compares truck quotes — calling transporters,
            cross-checking spot rates, guessing on reliability.{" "}
            <strong>LoRRI Spot evaluates every FTL quote in 5 seconds</strong> and tells
            you exactly what to do: accept, negotiate, or reject.
          </p> */}

          <div className="lorri-proof-bar lorri-fade-up-2">
            <div className="lorri-proof-item">
              <div className="lorri-proof-num">2–3 hrs</div>
              <div className="lorri-proof-label">Manual eval per request</div>
            </div>
            <div className="lorri-proof-item">
              <div className="lorri-proof-num">₹80K+</div>
              <div className="lorri-proof-label">Cost of a bad spot call</div>
            </div>
            <div className="lorri-proof-item">
              <div className="lorri-proof-num">5 sec</div>
              <div className="lorri-proof-label">With LoRRI Spot</div>
            </div>
          </div>

          <div className="lorri-cta-row lorri-fade-up-4">
            <button className="lorri-btn-hero" onClick={onEnter}>
              View Open Spot Requests
              <span className="arr">→</span>
            </button>
            <button className="lorri-btn-ghost">How it works ↓</button>
          </div>
        </div>

        <PreviewCard />
      </section>

      {/* ── Stats ── */}
      {/* <div className="lorri-stats">
        <div className="lorri-stats-grid">
          {[
            { num: "2–3 hrs",   label: "Average time to manually evaluate a spot freight request" },
            { num: "0 context", label: "Reliability data visible when comparing transporter rates" },
            { num: "₹80K+",    label: "Estimated cost of awarding a spot to the wrong transporter" },
          ].map((s, i) => (
            <div key={i} className="lorri-stat-cell">
              <div className="lorri-stat-num">{s.num}</div>
              <div className="lorri-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div> */}

      {/* ── How It Works ── */}
      <div className="lorri-how">
        {/* <div className="lorri-section-label">How it works</div> */}
        <div className="lorri-steps">
          {[
            {
              n: "01",
              title: "Transporters Quote",
              desc: "LSPs submit freight rates for your open spot request. Your team sees raw prices - no reliability context.",
            },
            {
              n: "02",
              title: "AI Enriches Each Quote",
              desc: "Agent pulls live market benchmarks and scores each transporter across 20,000 historical FTL shipments.",
            },
            {
              n: "03",
              title: "5-Dimension Scoring",
              desc: "Every quote is scored on Rate, Transporter Reliability, Urgency, Market Demand, and Budget Threshold.",
            },
            {
              n: "04",
              title: "Accept or Negotiate",
              desc: "LoRRI outputs a clear recommendation: Accept, Negotiate to a target price, or Reject and re-tender.",
            },
          ].map((step, i) => (
            <div key={i} className="lorri-step">
              <div className="lorri-step-num">{step.n}</div>
              <div className="lorri-step-title">{step.title}</div>
              <div className="lorri-step-desc">{step.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}