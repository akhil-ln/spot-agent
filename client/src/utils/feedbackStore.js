/**
 * feedbackStore.js — Hybrid RL feedback store
 * ─────────────────────────────────────────────
 * Write path:  POST /api/feedback  (falls back to localStorage on API error)
 * Read path:   POST /api/feedback/signals  (falls back to localStorage-derived signals)
 *
 * This means the RL system works offline (demo mode) AND persists to the server
 * when the backend is running, so signals survive page refreshes and are shared.
 */

import { saveFeedback as apiSaveFeedback, getSignals as apiGetSignals } from "../api/index";

const LS_KEY    = "lorri_feedback_v1";
const MAX_LOCAL = 200;

/* ─── Local store helpers ─────────────────────────────────── */

function lsLoad() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); }
  catch { return []; }
}

function lsSave(records) {
  if (records.length > MAX_LOCAL) records = records.slice(0, MAX_LOCAL);
  localStorage.setItem(LS_KEY, JSON.stringify(records));
}

function lsAppend(decision) {
  const all = lsLoad();
  const record = { ...decision, id: `D${Date.now()}`, timestamp: new Date().toISOString() };
  all.unshift(record);
  lsSave(all);
  return record;
}

/* ─── Public API ──────────────────────────────────────────── */

/**
 * Save a decision. Tries the backend first; falls back to localStorage.
 * Always saves locally so offline mode works seamlessly.
 */
export async function saveDecision(decision) {
  // Always persist locally (immediate, no await)
  const local = lsAppend(decision);

  // Also try to POST to the backend (non-blocking)
  try {
    await apiSaveFeedback(decision);
  } catch {
    // Backend unavailable — local record is the source of truth
  }

  return local;
}

/**
 * Derive RL signals. Tries the backend; falls back to local derivation.
 * Returns: { signals, adjusted_confidence, decision_count }
 */
export async function fetchSignals(scenario, rec) {
  const req = scenario?.spot_request || {};
  const ctx = {
    origin:           req.origin,
    destination:      req.destination,
    truck_type:       req.truck_type,
    urgency:          req.urgency,
    target_lsp:       rec?.target_lsp,
    base_confidence:  rec?.confidence || 0.75,
  };

  try {
    const res = await apiGetSignals(ctx);
    return res.data;  // { signals, adjusted_confidence, decision_count }
  } catch {
    // Backend unavailable — derive from localStorage
    return deriveSignalsLocal(ctx);
  }
}

/* ─── Local signal derivation (offline fallback) ──────────── */

export function loadDecisions() {
  return lsLoad();
}

export function deriveSignals(scenario, rec) {
  const req = scenario?.spot_request || {};
  return deriveSignalsLocal({
    origin:          req.origin,
    destination:     req.destination,
    truck_type:      req.truck_type,
    urgency:         req.urgency,
    target_lsp:      rec?.target_lsp,
    base_confidence: rec?.confidence || 0.75,
  });
}

function deriveSignalsLocal({ origin, destination, truck_type, target_lsp, base_confidence = 0.75 }) {
  const records = lsLoad();
  const signals = [];
  let   confAdj = 0;

  // ── LSP track record ──────────────────────────────────────
  if (target_lsp) {
    const hist = records.filter(r => r.lsp === target_lsp);
    if (hist.length) {
      const accepts = hist.filter(r => r.action === "ACCEPT").length;
      const rejects = hist.filter(r => r.action === "REJECT").length;
      const negs    = hist.filter(r => r.action === "NEGOTIATE").length;
      const total   = hist.length;
      const accRate = accepts / total;

      if (accRate >= 0.7) {
        const adj = Math.min(0.08, 0.02 * total);
        signals.push({ type: "lsp_track", icon: "CheckCircle2", impact: "positive", confidence_adj: adj,
          title: `${target_lsp} accepted ${accepts}/${total} times historically`,
          body: `Consistent acceptance validates the AI pick. Confidence boosted by ${Math.round(adj * 100)}%.` });
        confAdj += adj;
      } else if (rejects > accepts) {
        const adj = Math.min(0.10, 0.02 * rejects);
        signals.push({ type: "lsp_track", icon: "AlertTriangle", impact: "negative", confidence_adj: -adj,
          title: `${target_lsp} previously rejected ${rejects}/${total} times`,
          body: `Historical rejections suggest caution. Confidence reduced by ${Math.round(adj * 100)}%.` });
        confAdj -= adj;
      } else if (negs > 0) {
        const gaps = hist.filter(r => r.action === "NEGOTIATE" && r.neg_gap_pct).map(r => r.neg_gap_pct);
        if (gaps.length) {
          const avg = (gaps.reduce((a, b) => a + b, 0) / gaps.length).toFixed(1);
          signals.push({ type: "lsp_track", icon: "TrendingDown", impact: "neutral", confidence_adj: 0.02,
            title: `${target_lsp} accepted counters ~${avg}% below quoted`,
            body: "Past negotiations succeeded at similar gaps, reinforcing the target price." });
          confAdj += 0.02;
        }
      }
    }
  }

  // ── Lane track record ─────────────────────────────────────
  if (origin && destination) {
    const lane = records.filter(r => r.origin === origin && r.destination === destination);
    if (lane.length) {
      const rates       = lane.filter(r => r.awarded_rate).map(r => r.awarded_rate);
      const avgRate     = rates.length ? Math.round(rates.reduce((a, b) => a + b, 0) / rates.length) : null;
      const rejectCount = lane.filter(r => r.action === "REJECT").length;
      const adj         = rejectCount > lane.length / 2 ? -0.03 : 0.03;
      const body = [
        `${lane.length} past decision(s) on this lane.`,
        avgRate ? `Avg awarded rate: ₹${avgRate.toLocaleString("en-IN")}.` : "",
        rejectCount ? `${rejectCount} rejection(s) — market was overpriced.` : "",
      ].filter(Boolean).join(" ");
      signals.push({ type: "lane_track", icon: "Route", impact: adj > 0 ? "positive" : "negative", confidence_adj: adj,
        title: `${lane.length} past decision(s) on this lane`,
        body });
      confAdj += adj;
    }
  }

  // ── Truck type trend ──────────────────────────────────────
  if (truck_type) {
    const truckHist = records.filter(r => r.truck_type === truck_type);
    if (truckHist.length >= 3) {
      const rates = truckHist.slice(0, 6).filter(r => r.awarded_rate).map(r => r.awarded_rate);
      if (rates.length >= 2) {
        const rising = rates[0] > rates[rates.length - 1];
        signals.push({ type: "market_adj", icon: rising ? "TrendingUp" : "TrendingDown",
          impact: rising ? "negative" : "positive", confidence_adj: 0,
          title: `${truck_type} rates ${rising ? "rising" : "stable/falling"} (${truckHist.length} referrals)`,
          body: `Recent awarded rates: ${rates.slice(0, 3).map(r => "₹" + r.toLocaleString("en-IN")).join(", ")}.` });
      }
    }
  }

  // ── Overrides ─────────────────────────────────────────────
  const overrides = records.filter(r => r.overridden);
  if (overrides.length) {
    const adj = Math.min(0.03, 0.005 * overrides.length);
    signals.push({ type: "override_log", icon: "RotateCcw", impact: "neutral", confidence_adj: adj,
      title: `${overrides.length} manual override(s) logged in learning model`,
      body: "Your overrides are teaching the model your preferences and will influence future scoring." });
    confAdj += adj;
  }

  const adjusted_confidence = Math.min(0.99, Math.max(0.10, base_confidence + confAdj));

  return { signals, adjusted_confidence: parseFloat(adjusted_confidence.toFixed(3)), decision_count: records.length };
}

export function adjustedConfidence(baseConf, signals) {
  const adj = signals.reduce((s, sig) => s + (sig.confidence_adj || 0), 0);
  return Math.min(0.99, Math.max(0.10, (baseConf || 0.5) + adj));
}

export function clearDecisions() {
  localStorage.removeItem(LS_KEY);
}
