import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// ─── Health Check ─────────────────────────────────────────
export const checkHealth = () => api.get("/health");

// ─── Unified Analysis Endpoint ────────────────────────────
export const analyseQuotes = (spotRequest, rawQuotes) =>
  api.post("/analyse", {
    spot_request: spotRequest,
    raw_quotes: rawQuotes,
  });

// ─── Demo Scenario Loader ─────────────────────────────────
export const getScenarios = () => api.get("/scenarios");

// ─── RL Feedback Endpoints ────────────────────────────────

/** Save a confirmed procurement decision to the server-side learning store. */
export const saveFeedback = (decision) =>
  api.post("/feedback", decision, { timeout: 5000 });

/**
 * Derive RL signals server-side for the current scenario.
 * @param {object} ctx - { origin, destination, truck_type, urgency, target_lsp, base_confidence }
 */
export const getSignals = (ctx) =>
  api.post("/feedback/signals", ctx, { timeout: 5000 });

/** Get aggregated feedback stats (action counts, top LSPs, trends). */
export const getFeedbackSummary = () =>
  api.get("/feedback/summary", { timeout: 5000 });

/** Clear all decisions — for demo resets. */
export const clearFeedback = () =>
  api.delete("/feedback", { timeout: 5000 });

export default api;