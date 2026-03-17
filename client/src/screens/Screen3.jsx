import React, { useEffect, useState, useRef } from "react";
import "./Screen3.css";
import { analyseQuotes } from "../api/index";
import {
  BarChart2,
  SlidersHorizontal,
  Route,
  Sparkles,
  CheckCheck,
  ArrowLeft,
  RefreshCw,
  MapPin,
  ArrowRight,
} from "lucide-react";

const STEPS = [
  {
    Icon: BarChart2,
    label: "Enriching quotes with market intelligence",
    sub: "Lane history · demand index · benchmark rates",
  },
  {
    Icon: SlidersHorizontal,
    label: "Scoring transporters across 5 dimensions",
    sub: "Price · reliability · urgency · market · threshold",
  },
  {
    Icon: Route,
    label: "Running lane benchmark analysis",
    sub: "Historical avg · std dev · sample size",
  },
  {
    Icon: Sparkles,
    label: "Generating recommendation",
    sub: "Composite scoring · risk flags · confidence",
  },
];

export default function Screen3({ scenario, onComplete, onBack }) {
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState(null);
  const called = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    analyseQuotes(scenario.spot_request, scenario.quotes)
      .then((res) => {
        setTimeout(() => onComplete(res.data), 600);
      })
      .catch((err) => {
        console.error("Analysis failed:", err);
        setError(
          err?.response?.data?.detail ||
            err.message ||
            "Analysis failed. Please try again."
        );
      });
  }, [scenario, onComplete]);

  function handleRetry() {
    setError(null);
    setActiveStep(0);
    called.current = false;
  }

  const req = scenario.spot_request;
  const quoteCount = scenario.quotes?.length || 0;

  return (
    <div className="s3-page">
      {/* Dot grid (same as lorri-page::before but scoped) */}
      <div className="s3-dot-grid" />

      <div className="s3-wrap">

        {/* ── Header block ── */}
        <div className="s3-header s3-fade-up-1">
          <div className="s3-eyebrow">
            <span className="s3-eyebrow__id">{req.id}</span>
            <span className="s3-eyebrow__sep" />
            <span className="s3-eyebrow__tag">AI Analysis</span>
          </div>

          <h2 className="s3-route-title">
            {/* <MapPin size={18} className="s3-route-icon" /> */}
            {req.origin}
            <ArrowRight size={16} className="s3-route-arrow" />
            {req.destination}
          </h2>

          <p className="s3-subtitle">
            Evaluating <strong>{quoteCount}</strong> quote{quoteCount !== 1 ? "s" : ""} against market benchmarks
          </p>
        </div>

        {/* ── Central spinner + progress ── */}
        <div className="s3-engine s3-fade-up-2">

          {/* Orbital spinner */}
          <div className="s3-spinner-wrap">
            <div className="s3-spinner-ring s3-spinner-ring--outer" />
            <div className="s3-spinner-ring s3-spinner-ring--inner" />
            <div className="s3-spinner-core">
              <Sparkles size={20} className="s3-spinner-icon" />
            </div>
          </div>

          {/* Progress bar */}
          <div className="s3-progress-track">
            <div
              className="s3-progress-fill"
              style={{ width: `${((activeStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>
          <div className="s3-progress-label">
            Step {activeStep + 1} of {STEPS.length}
          </div>
        </div>

        {/* ── Step list ── */}
        <div className="s3-steps s3-fade-up-3">
          {STEPS.map(({ Icon, label, sub }, i) => {
            const done = i < activeStep;
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
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {/* Left icon cell */}
                <div className="s3-step__icon-cell">
                  {done ? (
                    <CheckCheck size={14} className="s3-step__check" />
                  ) : (
                    <Icon size={14} className="s3-step__icon" />
                  )}
                </div>

                {/* Text */}
                <div className="s3-step__body">
                  <span className="s3-step__label">{label}</span>
                  <span className="s3-step__sub">{sub}</span>
                </div>

                {/* Right state indicator */}
                <div className="s3-step__right">
                  {done && <span className="s3-step__done-tag">Done</span>}
                  {current && <span className="s3-step__pulse" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Error state ── */}
        {error && (
          <div className="s3-error s3-fade-up-1">
            <div className="s3-error__header">
              <span className="s3-error__title">Analysis failed</span>
            </div>
            <p className="s3-error__msg">{error}</p>
            <div className="s3-error__actions">
              <button className="s3-btn s3-btn--primary" onClick={handleRetry}>
                <RefreshCw size={13} />
                Retry
              </button>
              <button className="s3-btn s3-btn--ghost" onClick={onBack}>
                <ArrowLeft size={13} />
                Back
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}