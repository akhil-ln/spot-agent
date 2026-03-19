import React, { useEffect, useState, useRef } from "react";
import "./Screen3.css";
import { analyseQuotes } from "../api/index";
import {
  BarChart2, SlidersHorizontal, Route, Sparkles,
  CheckCheck, ArrowLeft, RefreshCw, ArrowRight, Clock,
} from "lucide-react";

import { BarChart3, Search, Scale, Target } from "lucide-react";

const STEPS = [
  {
    Icon: BarChart2,
    label: "Enriching with market intelligence",
    sub: "Lane history · demand index · benchmark rates",
    detail: "Fetching 6-month lane data and real-time market demand signals across comparable FTL routes.",
  },
  {
    Icon: SlidersHorizontal,
    label: "Scoring transporters (5 dimensions)",
    sub: "Price · reliability · urgency · market · threshold",
    detail: "Evaluating each quote against reliability history, on-time delivery rates, and win-rate patterns.",
  },
  {
    Icon: Route,
    label: "Running lane benchmark analysis",
    sub: "Historical avg · std dev · sample size",
    detail: "Comparing quoted rates against 20,000+ historical FTL shipments on this lane.",
  },
  {
    Icon: Sparkles,
    label: "Generating recommendation",
    sub: "Composite scoring · risk flags · confidence",
    detail: "Building final ranked output with Accept / Negotiate / Reject verdict and negotiation targets.",
  },
];

function ElapsedTimer({ startTime }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(iv);
  }, [startTime]);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  return (
    <span>{mins > 0 ? `${mins}m ` : ""}{String(secs).padStart(2, "0")}s elapsed</span>
  );
}

export default function Screen3({ scenario, onComplete, onBack }) {
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError]           = useState(null);
  const [startTime]                 = useState(Date.now);
  const called = useRef(false);

  // Cycle through steps every ~14s (mapped to ~60s total)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 14000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (called.current) return;
    called.current = true;
    analyseQuotes(scenario.spot_request, scenario.quotes)
      .then((res) => { setTimeout(() => onComplete(res.data), 600); })
      .catch((err) => {
        setError(
          err?.response?.data?.detail || err.message || "Analysis failed. Please try again."
        );
      });
  }, [scenario, onComplete]);

  function handleRetry() {
    setError(null);
    setActiveStep(0);
    called.current = false;
  }

  const req        = scenario.spot_request;
  const quoteCount = scenario.quotes?.length || 0;
  const pct        = Math.round(((activeStep + 1) / STEPS.length) * 100);

  return (
    <div className="s3-page">
      <div className="s3-dot-grid" />

      <div className="s3-wrap">
        {/* ── Route header ── */}
        <div className="s3-header s3-fade-up-1">
          <div className="s3-eyebrow">
            <span className="s3-eyebrow__id">{req.id}</span>
            <span className="s3-eyebrow__sep" />
            <span className="s3-eyebrow__tag">AI Analysis Running</span>
          </div>
          <h2 className="s3-route-title">
            {req.origin}
            <ArrowRight size={16} className="s3-route-arrow" />
            {req.destination}
          </h2>
          <p className="s3-subtitle">
            Scoring <strong>{quoteCount}</strong> quote{quoteCount !== 1 ? "s" : ""} against market benchmarks
          </p>
        </div>

        {/* ── Core engine block ── */}
        <div className="s3-engine s3-fade-up-2">
          {/* Orbital spinner */}
          <div className="s3-spinner-wrap">
            <div className="s3-spinner-ring s3-spinner-ring--outer" />
            <div className="s3-spinner-ring s3-spinner-ring--inner" />
            <div className="s3-spinner-core">
              <Sparkles size={22} className="s3-spinner-icon" />
            </div>
          </div>

          {/* Progress bar */}
          <div className="s3-progress-track">
            <div className="s3-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="s3-progress-meta">
            <span>Step {activeStep + 1} of {STEPS.length}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--text-muted)", fontSize: 11 }}>
              <Clock size={11} />
              <ElapsedTimer startTime={startTime} />
            </span>
          </div>
        </div>

        {/* ── Step list ── */}
        <div className="s3-steps s3-fade-up-3">
          {STEPS.map((step, i) => {
            const { Icon, label, sub, detail } = step;
            const done    = i < activeStep;
            const current = i === activeStep;
            const pending = i > activeStep;
            return (
              <div
                key={i}
                className={[
                  "s3-step",
                  done ? "s3-step--done" : "",
                  current ? "s3-step--current" : "",
                  pending ? "s3-step--pending" : "",
                ].filter(Boolean).join(" ")}
              >
                <div className="s3-step__icon-cell">
                  {done ? <CheckCheck size={14} className="s3-step__check" /> : <Icon size={14} className="s3-step__icon" />}
                </div>
                <div className="s3-step__body">
                  <span className="s3-step__label">{label}</span>
                  <span className="s3-step__sub">{sub}</span>
                  {current && (
                    <span className="s3-step__detail">{detail}</span>
                  )}
                </div>
                <div className="s3-step__right">
                  {done    && <span className="s3-step__done-tag">Done</span>}
                  {current && <span className="s3-step__pulse" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── What this means box ── */}
        <div className="s3-context-box s3-fade-up-3">
          <div className="s3-context-box__label">While you wait…</div>
          <div className="s3-context-box__grid">
           {[
            {
              icon: <BarChart3 size={18} />,
              title: "Market Benchmarking",
              desc: "Comparing against real freight data from similar lanes over 6 months",
            },
            {
              icon: <Search size={18} />,
              title: "LSP Reliability",
              desc: "Pulling on-time delivery, cancellation, and negotiation history per transporter",
            },
            {
              icon: <Scale size={18} />,
              title: "5-Dimension Scoring",
              desc: "Price · Reliability · Urgency impact · Market demand · Budget fit",
            },
            {
              icon: <Target size={18} />,
              title: "Negotiation Targets",
              desc: "If a counter makes sense, the AI will calculate the exact target price",
            },
          ].map((item) => (
              <div key={item.title} className="s3-context-item">
                <span className="s3-context-item__icon">{item.icon}</span>
                <div>
                  <div className="s3-context-item__title">{item.title}</div>
                  <div className="s3-context-item__desc">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Error state ── */}
        {error && (
          <div className="s3-error s3-fade-up-1">
            <div className="s3-error__header">
              <span className="s3-error__title">Analysis failed</span>
            </div>
            <p className="s3-error__msg">{error}</p>
            <div className="s3-error__actions">
              <button className="btn btn-primary btn-sm" onClick={handleRetry}>
                <RefreshCw size={13} /> Retry
              </button>
              <button className="btn btn-secondary btn-sm" onClick={onBack}>
                <ArrowLeft size={13} /> Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}