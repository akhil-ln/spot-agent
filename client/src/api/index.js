import axios from "axios";

const BASE_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// ─── Health Check ─────────────────────────────────────────────────────────────
export const checkHealth = () => api.get("/health");

// ─── Unified Analysis Endpoint ────────────────────────────────────────────────
// POST /api/analyse
// Payload:  { spot_request: SpotRequestInput, raw_quotes: RawQuoteInput[] }
// Response: { ranked_quotes, recommendation, lane_context, used_fallback }
export const analyseQuotes = (spotRequest, rawQuotes) =>
  api.post("/api/analyse", {
    spot_request: spotRequest,
    raw_quotes:   rawQuotes,
  });

// ─── Demo Scenario Loader ─────────────────────────────────────────────────────
// GET /api/scenarios → returns the 6 pre-built demo scenarios array
export const getScenarios = () => api.get("/api/scenarios");

export default api;