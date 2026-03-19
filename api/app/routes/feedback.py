"""
RL Feedback Router — exposes learning loop endpoints.

POST   /feedback           — save a confirmed procurement decision
POST   /feedback/signals   — derive RL signals for the current scenario
GET    /feedback/summary   — aggregated stats across all past decisions
GET    /feedback           — list all raw decisions (last N)
DELETE /feedback           — clear all decisions (dev/demo use)
"""
from fastapi import APIRouter, Query, HTTPException
from app.rl_models import DecisionRecord, SignalRequest, SignalsResponse, SummaryResponse
from app import rl_service

router = APIRouter(tags=["feedback"])


@router.post("/feedback", response_model=dict, summary="Save a confirmed procurement decision")
def save_feedback(decision: DecisionRecord):
    """
    Persist a user-confirmed decision to the learning store.
    Called by the frontend whenever the user clicks Accept / Negotiate / Reject
    (including manual overrides). Each record feeds the signal-derivation model.
    """
    record = rl_service.store_decision(decision.dict())
    return {"status": "saved", "id": record["id"], "timestamp": record["timestamp"]}


@router.post("/feedback/signals", response_model=SignalsResponse, summary="Derive RL signals for a scenario")
def get_signals(req: SignalRequest):
    """
    Given the current scenario context (lane, LSP, urgency), return learning signals
    derived from past decisions, plus an RL-adjusted confidence score.

    The frontend can call this when Screen4 loads to surface 'Reinforcement Signals'.
    """
    result = rl_service.derive_signals(
        origin=req.origin,
        destination=req.destination,
        truck_type=req.truck_type,
        urgency=req.urgency,
        target_lsp=req.target_lsp,
        base_confidence=req.base_confidence or 0.75,
    )
    return SignalsResponse(**result)


@router.get("/feedback/summary", response_model=SummaryResponse, summary="Aggregated feedback stats")
def feedback_summary():
    """
    Returns aggregated learning statistics: action breakdown, top LSPs, recent decisions,
    average negotiation gap. Useful for dashboards or audit logs.
    """
    return SummaryResponse(**rl_service.get_summary())


@router.get("/feedback", summary="List all decision records")
def list_feedback(limit: int = Query(default=50, le=500)):
    """Return the most recent N decisions from the learning store."""
    all_records = rl_service.get_all_decisions()
    return {"decisions": all_records[:limit], "total": len(all_records)}


@router.delete("/feedback", summary="Clear all decisions (demo reset)")
def clear_feedback():
    """Wipe the decision store. Intended for hackathon demo resets only."""
    import os, json
    path = rl_service.FEEDBACK_PATH
    if os.path.exists(path):
        with open(path, "w") as f:
            json.dump([], f)
    return {"status": "cleared"}
