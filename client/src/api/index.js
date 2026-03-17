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

export default api;