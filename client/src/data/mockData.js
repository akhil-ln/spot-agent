export const MOCK_REQUEST = {
  id: "SPOT-2024-0892",
  origin: "Fazilka, Punjab",
  destination: "Alwar, Rajasthan",
  truck_type: "15 MT OPENBODY",
  weight: "15 MT",
  placement_date: "15 Mar 2024",
  urgency: "HIGH",
  cost_threshold: 45000,
  trucks_required: 1,
}

export const MOCK_QUOTES = [
  { id: "Q1", lsp: "Atharv Logistics",     raw_quote: 42000, transit_days: 2, availability: "Immediate" },
  { id: "Q2", lsp: "Shree Ram Transport",  raw_quote: 38500, transit_days: 3, availability: "Next Day"  },
  { id: "Q3", lsp: "FastMove Carriers",    raw_quote: 51000, transit_days: 1, availability: "Immediate" },
  { id: "Q4", lsp: "GreenLine Logistics",  raw_quote: 46200, transit_days: 2, availability: "Immediate" },
]

export const MOCK_ENRICHED = [
  { id: "Q1", lsp: "Atharv Logistics",    raw_quote: 42000, predicted_rate: 39800, benchmark_rate: 40500, price_delta_pct: 5.5,  lsp_win_rate: 78, lsp_neg_gap_pct: 5.2, lane_familiarity: 84, on_time_delivery_pct: 91, scores: { price: 68, reliability: 82, urgency: 85, market: 72, threshold: 95 }, composite: 78 },
  { id: "Q2", lsp: "Shree Ram Transport", raw_quote: 38500, predicted_rate: 39800, benchmark_rate: 40500, price_delta_pct: -3.3, lsp_win_rate: 61, lsp_neg_gap_pct: 2.1, lane_familiarity: 52, on_time_delivery_pct: 74, scores: { price: 91, reliability: 58, urgency: 85, market: 72, threshold: 100 }, composite: 79 },
  { id: "Q3", lsp: "FastMove Carriers",   raw_quote: 51000, predicted_rate: 39800, benchmark_rate: 40500, price_delta_pct: 28.1, lsp_win_rate: 45, lsp_neg_gap_pct: 11.0, lane_familiarity: 31, on_time_delivery_pct: 88, scores: { price: 22, reliability: 65, urgency: 85, market: 72, threshold: 40  }, composite: 52 },
  { id: "Q4", lsp: "GreenLine Logistics", raw_quote: 46200, predicted_rate: 39800, benchmark_rate: 40500, price_delta_pct: 16.1, lsp_win_rate: 55, lsp_neg_gap_pct: 8.4,  lane_familiarity: 44, on_time_delivery_pct: 82, scores: { price: 41, reliability: 62, urgency: 85, market: 72, threshold: 72  }, composite: 61 },
]

export const MOCK_RECOMMENDATION = {
  recommendation: "NEGOTIATE",
  target_lsp: "Atharv Logistics",
  confidence: 0.82,
  negotiate_target_price: 40200,
  reasoning: "Atharv Logistics scores highest at 78/100 with a strong 91% on-time delivery on this lane. Their quote of Rs.42,000 is 5.5% above the predicted market rate of Rs.39,800, but their historical negotiation gap of 5.2% suggests they will accept Rs.40,200.",
  key_risk: "Confirm truck availability slot before negotiating to avoid losing the booking window."
}