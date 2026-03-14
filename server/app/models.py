from pydantic import BaseModel
from typing import Optional, List


class QuoteInput(BaseModel):
    id: str
    lsp: str
    raw_quote: float
    transit_days: int
    availability: str
    trucks_available: Optional[int] = None
    # LSP profile — caller provides this (from their mock or real source)
    win_rate_pct: float
    neg_gap_pct: float
    lane_familiarity_score: float
    on_time_delivery_pct: float
    damage_rate_pct: float
    is_new_lsp: bool = False


class RequestMeta(BaseModel):
    origin: str
    destination: str
    truck_type: str
    urgency: str                  # HIGH / MEDIUM / LOW
    cost_threshold: float
    trucks_required: int = 1
    predicted_rate: float         # caller provides from their rate prediction API
    benchmark_rate: float         # caller provides from their benchmark tool
    demand_index: float = 0.65    # caller provides or defaults to 0.65
    market_note: Optional[str] = None


class RankRequest(BaseModel):
    request_meta: RequestMeta
    quotes: List[QuoteInput]


class DimensionScores(BaseModel):
    price: float
    reliability: float
    urgency: float
    market: float
    threshold: float


class ScoredQuote(BaseModel):
    id: str
    lsp: str
    raw_quote: float
    predicted_rate: float
    benchmark_rate: float
    price_delta_pct: float
    lsp_win_rate: float
    lsp_neg_gap_pct: float
    lane_familiarity: float
    on_time_delivery_pct: float
    damage_rate_pct: float
    is_new_lsp: bool
    trucks_available: Optional[int]
    availability_flag: Optional[str]
    scores: DimensionScores
    composite: float
    data_confidence: str          # HIGH / MEDIUM / LOW


class RankResponse(BaseModel):
    ranked_quotes: List[ScoredQuote]
    lane_context: dict


class RecommendRequest(BaseModel):
    request_meta: RequestMeta
    ranked_quotes: List[ScoredQuote]


class AIRecommendation(BaseModel):
    recommendation: str           # ACCEPT / NEGOTIATE / REJECT
    target_lsp: Optional[str]
    confidence: float
    negotiate_target_price: Optional[float] = None
    reasoning: str
    key_risk: str


class RecommendResponse(BaseModel):
    recommendation: AIRecommendation
    used_fallback: bool = False


# ── Simplified input models for the unified /api/analyse endpoint ─────────────
# The caller only needs to supply bare minimum info — the server enriches everything.

class RawQuoteInput(BaseModel):
    """Bare quote as submitted by an LSP — no profile data needed from caller."""
    id: str
    lsp: str
    raw_quote: float
    transit_days: int
    availability: str                   # "Immediate" | "Next Day" | etc.
    trucks_available: Optional[int] = None


class SpotRequestInput(BaseModel):
    """Inbound spot freight request — no predicted/benchmark rates needed from caller."""
    id: str
    origin: str
    destination: str
    truck_type: str
    urgency: str                        # HIGH / MEDIUM / LOW
    cost_threshold: float
    trucks_required: int = 1
    placement_date: Optional[str] = None
    additional_details: Optional[str] = None


class AnalyseRequest(BaseModel):
    """Single payload the frontend posts to /api/analyse."""
    spot_request: SpotRequestInput
    raw_quotes: List[RawQuoteInput]


class AnalyseResponse(BaseModel):
    """Full result returned by /api/analyse."""
    ranked_quotes: List[ScoredQuote]
    recommendation: AIRecommendation
    lane_context: dict                  # predicted_rate, benchmark_rate, demand_index, etc.
    used_fallback: bool = False