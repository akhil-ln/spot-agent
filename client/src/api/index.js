import axios from "axios";

const BASE_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// ─── Health Check ─────────────────────────────────────────────────────────────
export const checkHealth = () => api.get("/health");

// ─── Main Analysis Endpoint ───────────────────────────────────────────────────
// POST /api/analyse  → { ranked_quotes, recommendation, lane_context }
export const analyseQuotes = (spotRequest, rawQuotes) =>
  api.post("/api/analyse", {
    spot_request: spotRequest,
    raw_quotes: rawQuotes,
  });

export default api;