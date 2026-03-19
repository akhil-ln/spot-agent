"""
RL Feedback Models — Pydantic schemas for the feedback/learning endpoints.
"""
from pydantic import BaseModel
from typing import Optional, List


class DecisionRecord(BaseModel):
    """A single user-confirmed procurement decision."""
    id: Optional[str] = None
    timestamp: Optional[str] = None

    # Decision
    action: str                         # ACCEPT | NEGOTIATE | REJECT
    lsp: Optional[str] = None
    awarded_rate: Optional[float] = None
    target_price: Optional[float] = None
    neg_gap_pct: Optional[float] = None
    quoted_rate: Optional[float] = None

    # Lane context
    origin: Optional[str] = None
    destination: Optional[str] = None
    truck_type: Optional[str] = None
    urgency: Optional[str] = None
    spot_id: Optional[str] = None

    # Meta
    ai_recommendation: Optional[str] = None  # what the AI originally said
    overridden: bool = False
    note: Optional[str] = None


class SignalRecord(BaseModel):
    """An RL learning signal derived from past decisions."""
    type: str            # lsp_track | lane_track | market_adj | override_log
    icon: str
    title: str
    body: str
    impact: str          # positive | negative | neutral
    confidence_adj: float = 0.0


class SignalRequest(BaseModel):
    """Request body for POST /feedback/signals — current scenario context."""
    origin: Optional[str] = None
    destination: Optional[str] = None
    truck_type: Optional[str] = None
    urgency: Optional[str] = None
    target_lsp: Optional[str] = None
    base_confidence: Optional[float] = 0.75


class SignalsResponse(BaseModel):
    signals: List[SignalRecord]
    adjusted_confidence: float
    decision_count: int


class SummaryResponse(BaseModel):
    total_decisions: int
    accept_count: int
    negotiate_count: int
    reject_count: int
    override_count: int
    top_lsps: List[dict]             # [{lsp, accept_count, total}]
    recent_decisions: List[dict]     # last 5, lightweight
    avg_neg_gap_pct: Optional[float] = None
