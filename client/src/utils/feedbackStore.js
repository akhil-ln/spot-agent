/**
 * feedbackStore.js
 * ─────────────────────────────────────────────────────────────
 * Mock Reinforcement Learning feedback loop for LoRRI Spot Agent.
 *
 * Every confirmed user decision (Accept / Negotiate / Reject — including
 * overrides) is persisted to localStorage. Screen4 reads this store to
 * surface "learning signals" that explain how past decisions on similar
 * lanes and LSPs are shaping the current recommendation.
 *
 * Signal types produced:
 *   lsp_track    – historical accept/negotiate/reject for this LSP
 *   lane_track   – past decisions on the same origin→dest lane
 *   market_adj   – rate adjustments inferred from past negotiations
 *   override_log – manual overrides (teaches the model "human preference")
 */

const KEY = "lorri_feedback_v1";

/** Load all stored decisions */
export function loadDecisions() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

/** Persist a new decision */
export function saveDecision(decision) {
  const all = loadDecisions();
  all.unshift({ ...decision, id: `D${Date.now()}`, timestamp: new Date().toISOString() });
  // cap at 200 entries
  if (all.length > 200) all.length = 200;
  localStorage.setItem(KEY, JSON.stringify(all));
  return all;
}

/** Clear all decisions (for testing) */
export function clearDecisions() {
  localStorage.removeItem(KEY);
}

/**
 * Derive RL signals from past decisions, relative to the current scenario.
 *
 * Returns an array of signal objects:
 *   { type, icon, title, body, impact }
 *   impact: "positive" | "negative" | "neutral"
 */
export function deriveSignals(scenario, rec) {
  const decisions = loadDecisions();
  if (!decisions.length) return [];

  const req     = scenario?.spot_request || {};
  const signals = [];

  /* ── RSP-level track record ── */
  const lspTarget = rec?.target_lsp;
  if (lspTarget) {
    const lspHistory = decisions.filter(d => d.lsp === lspTarget);
    if (lspHistory.length > 0) {
      const accepts = lspHistory.filter(d => d.action === "ACCEPT").length;
      const rejects = lspHistory.filter(d => d.action === "REJECT").length;
      const negs    = lspHistory.filter(d => d.action === "NEGOTIATE").length;
      const ratio   = accepts / lspHistory.length;

      if (ratio >= 0.7) {
        signals.push({
          type: "lsp_track",
          icon: "CheckCircle2",
          title: `${lspTarget} accepted ${accepts}/${lspHistory.length} times`,
          body: `You have consistently awarded this LSP. Their on-ground performance validates the AI pick.`,
          impact: "positive",
          confidence_adj: +0.04,
        });
      } else if (rejects > accepts) {
        signals.push({
          type: "lsp_track",
          icon: "AlertTriangle",
          title: `${lspTarget} previously rejected ${rejects}/${lspHistory.length} times`,
          body: `Historical rejections suggest caution. AI recommendation adjusted to reflect this preference.`,
          impact: "negative",
          confidence_adj: -0.06,
        });
      } else if (negs > 0) {
        const negDecisions = lspHistory.filter(d => d.action === "NEGOTIATE" && d.target_price);
        const avgNegGap    = negDecisions.reduce((sum, d) => sum + (d.neg_gap_pct || 0), 0) / (negDecisions.length || 1);
        if (avgNegGap > 0) {
          signals.push({
            type: "lsp_track",
            icon: "TrendingDown",
            title: `${lspTarget} accepted counters (avg ${avgNegGap.toFixed(1)}% below quoted)`,
            body: `Past negotiations succeeded, reinforcing the negotiate target price.`,
            impact: "neutral",
            confidence_adj: +0.02,
          });
        }
      }
    }
  }

  /* ── Lane-level track record ── */
  const laneDecs = decisions.filter(d =>
    d.origin === req.origin && d.destination === req.destination
  );
  if (laneDecs.length > 0) {
    const laneMsgs = [];
    const avgRate  = laneDecs.reduce((s, d) => s + (d.awarded_rate || 0), 0) / laneDecs.length;
    if (avgRate > 0) {
      laneMsgs.push(`Avg awarded rate on this lane: ₹${Math.round(avgRate).toLocaleString("en-IN")}.`);
    }
    const rejectCount = laneDecs.filter(d => d.action === "REJECT").length;
    if (rejectCount > 0) {
      laneMsgs.push(`${rejectCount} rejection(s) on this lane — market was overpriced.`);
    }
    signals.push({
      type: "lane_track",
      icon: "Route",
      title: `${laneDecs.length} past decision(s) on this lane`,
      body: laneMsgs.join(" "),
      impact: rejectCount > laneDecs.length / 2 ? "negative" : "positive",
      confidence_adj: laneDecs.length > 3 ? +0.03 : 0,
    });
  }

  /* ── Truck type market trend ── */
  const truckDecs = decisions.filter(d => d.truck_type === req.truck_type);
  if (truckDecs.length >= 3) {
    const recentRates = truckDecs.slice(0, 5).map(d => d.awarded_rate).filter(Boolean);
    if (recentRates.length > 1) {
      const trend = recentRates[0] > recentRates[recentRates.length - 1] ? "rising" : "stable/falling";
      signals.push({
        type: "market_adj",
        icon: "TrendingUp",
        title: `${req.truck_type} rates trending ${trend} (${truckDecs.length} referrals)`,
        body: `Recent awarded rates for this truck type: ₹${recentRates.slice(0, 3).map(r => r.toLocaleString("en-IN")).join(", ")}.`,
        impact: trend === "rising" ? "negative" : "positive",
        confidence_adj: 0,
      });
    }
  }

  /* ── Manual overrides ── */
  const overrides = decisions.filter(d => d.overridden);
  if (overrides.length > 0) {
    signals.push({
      type: "override_log",
      icon: "RotateCcw",
      title: `${overrides.length} manual override(s) logged`,
      body: `Your overrides are teaching the model your preference patterns and will influence future scoring.`,
      impact: "neutral",
      confidence_adj: 0,
    });
  }

  return signals;
}

/**
 * Compute an adjusted confidence score after applying all signal adjustments.
 */
export function adjustedConfidence(baseConfidence, signals) {
  const adj = signals.reduce((sum, s) => sum + (s.confidence_adj || 0), 0);
  return Math.min(0.99, Math.max(0.10, (baseConfidence || 0.5) + adj));
}
