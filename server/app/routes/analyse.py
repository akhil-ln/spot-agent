from fastapi import APIRouter
from app.models import RankRequest, RankResponse, RecommendRequest, RecommendResponse
from app.scoring import score_and_rank
from app.agent import get_recommendation

router = APIRouter(prefix="/api")


@router.post("/rank", response_model=RankResponse)
def rank(payload: RankRequest):
    """Score and rank raw quotes. Returns enriched scored quotes sorted best→worst."""
    ranked = score_and_rank(payload.request_meta, payload.quotes)
    return RankResponse(
        ranked_quotes=ranked,
        lane_context={
            "predicted_rate": payload.request_meta.predicted_rate,
            "benchmark_rate": payload.request_meta.benchmark_rate,
            "demand_index": payload.request_meta.demand_index,
            "market_note": payload.request_meta.market_note,
        },
    )


@router.post("/recommend", response_model=RecommendResponse)
def recommend(payload: RecommendRequest):
    """Feed ranked quotes to Gemini. Returns ACCEPT/NEGOTIATE/REJECT + reasoning."""
    rec, used_fallback = get_recommendation(payload.request_meta, payload.ranked_quotes)
    return RecommendResponse(recommendation=rec, used_fallback=used_fallback)
