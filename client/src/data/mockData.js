// ─── Mock Spot Request ────────────────────────────────────────────────────────
export const MOCK_SPOT_REQUEST = {
  id: "SR-2024-0315-001",
  origin: "Fazilka, Punjab",
  destination: "Alwar, Rajasthan",
  truck_type: "OPENBODY",
  weight: 15,                     // MT
  placement_date: "2024-03-15",
  urgency: "HIGH",
  cost_threshold: 45000,          // INR
  trucks_required: 1,
};

// ─── Raw LSP Quotes ───────────────────────────────────────────────────────────
export const MOCK_RAW_QUOTES = [
  {
    id: "Q001",
    lsp: "Atharv Logistics",
    raw_quote: 42000,
    transit_days: 2,
    availability: "Immediate",
  },
  {
    id: "Q002",
    lsp: "Shree Ram Transport",
    raw_quote: 38500,
    transit_days: 3,
    availability: "Next Day",
  },
  {
    id: "Q003",
    lsp: "FastMove Carriers",
    raw_quote: 51000,
    transit_days: 1,
    availability: "Immediate",
  },
  {
    id: "Q004",
    lsp: "GreenLine Logistics",
    raw_quote: 46200,
    transit_days: 2,
    availability: "Immediate",
  },
];

// ─── Enriched Quotes (post-scoring) ───────────────────────────────────────────
export const MOCK_ENRICHED_QUOTES = [
  {
    id: "Q002",
    lsp: "Shree Ram Transport",
    raw_quote: 38500,
    predicted_rate: 39800,
    benchmark_rate: 40200,
    price_delta_pct: -3.3,
    lsp_win_rate: 61,
    lsp_neg_gap_pct: 4.2,
    lane_familiarity: "High",
    on_time_delivery_pct: 74,
    scores: { price: 88, reliability: 62, urgency: 55, market: 78, threshold: 95 },
    composite: 79,
  },
  {
    id: "Q001",
    lsp: "Atharv Logistics",
    raw_quote: 42000,
    predicted_rate: 39800,
    benchmark_rate: 40200,
    price_delta_pct: 5.5,
    lsp_win_rate: 78,
    lsp_neg_gap_pct: 3.1,
    lane_familiarity: "High",
    on_time_delivery_pct: 91,
    scores: { price: 72, reliability: 88, urgency: 85, market: 74, threshold: 82 },
    composite: 78,
  },
  {
    id: "Q004",
    lsp: "GreenLine Logistics",
    raw_quote: 46200,
    predicted_rate: 39800,
    benchmark_rate: 40200,
    price_delta_pct: 16.1,
    lsp_win_rate: 55,
    lsp_neg_gap_pct: 6.8,
    lane_familiarity: "Medium",
    on_time_delivery_pct: 82,
    scores: { price: 44, reliability: 78, urgency: 70, market: 62, threshold: 52 },
    composite: 61,
  },
  {
    id: "Q003",
    lsp: "FastMove Carriers",
    raw_quote: 51000,
    predicted_rate: 39800,
    benchmark_rate: 40200,
    price_delta_pct: 28.1,
    lsp_win_rate: 45,
    lsp_neg_gap_pct: 9.5,
    lane_familiarity: "Low",
    on_time_delivery_pct: 88,
    scores: { price: 18, reliability: 80, urgency: 90, market: 38, threshold: 20 },
    composite: 52,
  },
];

// ─── AI Recommendation ────────────────────────────────────────────────────────
export const MOCK_RECOMMENDATION = {
  recommendation: "NEGOTIATE",
  target_lsp: "Atharv Logistics",
  confidence: 82,
  negotiate_target_price: 40200,
  reasoning:
    "Atharv Logistics presents the strongest overall profile with 91% on-time delivery and proven lane familiarity on the Fazilka–Alwar corridor. Their quoted rate of ₹42,000 is 4.8% above the predicted market rate of ₹39,800, leaving a negotiation gap of ₹1,800. A counter at ₹40,200 is within their historical acceptance band and keeps the shipment within cost threshold.",
  key_risk:
    "Shree Ram Transport is cheaper but their 74% OTD rate on HIGH-urgency lanes poses delivery risk — not recommended for this shipment.",
};

// ─── Lane Context (supporting data from backend) ─────────────────────────────
export const MOCK_LANE_CONTEXT = {
  lane: "Fazilka → Alwar",
  historical_avg: 40200,
  predicted_rate: 39800,
  market_trend: "Stable",
  quotes_analyzed: 4,
};