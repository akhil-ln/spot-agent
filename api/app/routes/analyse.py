import os
import json
import logging
from fastapi import APIRouter
from app.models import (
    RankRequest, RankResponse,
    RecommendRequest, RecommendResponse,
    AnalyseRequest, AnalyseResponse,
    QuoteInput, RequestMeta,
)
from app.scoring import score_and_rank
from app.agent import get_recommendation
from app.data_loader import get_lsp_profile, get_lane_context
from app.services.rate_prediction import get_predicted_rate
from app.services.benchmark import get_benchmark_rate, compute_demand_index

router = APIRouter()
logger = logging.getLogger(__name__)

# ── Path to demo scenarios JSON ───────────────────────────────────────────────
_SCENARIOS_PATH = os.path.join(
    os.path.dirname(__file__), "..", "..", "..", "data", "demo_scenarios.json"
)


# ── Existing endpoints (keep for direct use / testing) ───────────────────────
@router.post("/rank", response_model=RankResponse)
def rank(payload: RankRequest):
    """Score and rank raw quotes. Returns enriched scored quotes sorted best→worst."""
    ranked = score_and_rank(payload.request_meta, payload.quotes)
    return RankResponse(
        ranked_quotes=ranked,
        lane_context={
            "predicted_rate": payload.request_meta.predicted_rate,
            "benchmark_rate": payload.request_meta.benchmark_rate,
            "demand_index":   payload.request_meta.demand_index,
            "market_note":    payload.request_meta.market_note,
        },
    )


@router.post("/recommend", response_model=RecommendResponse)
def recommend(payload: RecommendRequest):
    """Feed ranked quotes to Gemini. Returns ACCEPT/NEGOTIATE/REJECT + reasoning."""
    rec, used_fallback = get_recommendation(payload.request_meta, payload.ranked_quotes)
    return RecommendResponse(recommendation=rec, used_fallback=used_fallback)


# ── Unified orchestrator endpoint ─────────────────────────────────────────────
@router.post("/analyse", response_model=AnalyseResponse)
def analyse(payload: AnalyseRequest):
    """
    Full pipeline in one call:
      1. Look up lane stats → derive predicted_rate, benchmark_rate, demand_index
      2. Enrich each raw quote with LSP profile from lsp_profiles.json
      3. score_and_rank()
      4. get_recommendation() via Gemini (falls back deterministically if unavailable)
    """
    req = payload.spot_request
    raw_quotes = payload.raw_quotes

    # ── Step 1: Lane context ──────────────────────────────────────────────────
    lane = get_lane_context(req.origin, req.destination, req.truck_type)
    predicted_rate = get_predicted_rate(
        req.origin, req.destination, req.truck_type,
        req.placement_date or "2024-03-15",
    )
    benchmark_stats = get_benchmark_rate(req.origin, req.destination, req.truck_type)
    benchmark_rate  = float(benchmark_stats["avg"])
    demand_index    = compute_demand_index(
        float(benchmark_stats["avg"]),
        float(benchmark_stats["std_dev"]),
    )

    market_note = (
        "High demand volatility — consider accepting sooner."
        if demand_index >= 0.85
        else "Normal market conditions."
    )

    meta = RequestMeta(
        origin=req.origin,
        destination=req.destination,
        truck_type=req.truck_type,
        urgency=req.urgency,
        cost_threshold=req.cost_threshold,
        trucks_required=req.trucks_required,
        predicted_rate=predicted_rate,
        benchmark_rate=benchmark_rate,
        demand_index=demand_index,
        market_note=market_note,
    )

    # ── Step 2: Enrich quotes with LSP profile data ───────────────────────────
    enriched_inputs: list[QuoteInput] = []
    for rq in raw_quotes:
        profile = get_lsp_profile(rq.lsp)
        enriched_inputs.append(QuoteInput(
            id=rq.id,
            lsp=rq.lsp,
            raw_quote=rq.raw_quote,
            transit_days=rq.transit_days,
            availability=rq.availability,
            trucks_available=rq.trucks_available,
            win_rate_pct=profile["win_rate_pct"],
            neg_gap_pct=profile["neg_gap_pct"],
            lane_familiarity_score=profile["lane_familiarity_score"],
            on_time_delivery_pct=profile["on_time_delivery_pct"],
            damage_rate_pct=profile["damage_rate_pct"],
            is_new_lsp=profile["is_new_lsp"],
        ))
        if profile["is_new_lsp"]:
            logger.info(f"New LSP detected: '{rq.lsp}' — neutral defaults applied")

    # ── Step 3: Score and rank ────────────────────────────────────────────────
    ranked = score_and_rank(meta, enriched_inputs)

    # ── Step 4: AI recommendation ─────────────────────────────────────────────
    rec, used_fallback = get_recommendation(meta, ranked)

    return AnalyseResponse(
        ranked_quotes=ranked,
        recommendation=rec,
        lane_context={
            "predicted_rate":       predicted_rate,
            "benchmark_rate":       benchmark_rate,
            "demand_index":         demand_index,
            "market_note":          market_note,
            "lane_avg_historical":  lane["avg"],
            "lane_min_historical":  lane["min"],
            "lane_max_historical":  lane["max"],
            "lane_std_dev":         lane["std_dev"],
            "lane_sample_size":     lane["count"],
        },
        used_fallback=used_fallback,
    )


# ── Demo scenarios endpoint ───────────────────────────────────────────────────
@router.get("/scenarios")
def get_scenarios():
    """Return the pre-built demo scenarios JSON for frontend demo switcher."""
    try:
        path = os.path.normpath(_SCENARIOS_PATH)
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        logger.error(f"demo_scenarios.json not found at: {_SCENARIOS_PATH}")
        return []

