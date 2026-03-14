"""
rate_prediction.py
------------------
Wraps an external Rate Prediction API call.
Falls back to lane_stats.json average * 0.98 if the API is unavailable.
Results are in-memory cached per (origin, destination, truck_type, date).
"""

import logging
from app.data_loader import get_lane_context

logger = logging.getLogger(__name__)

_cache: dict = {}


def get_predicted_rate(
    origin: str,
    destination: str,
    truck_type: str,
    date: str,
) -> float:
    """
    Returns a predicted fair-market rate (INR) for this lane on this date.

    Priority:
      1. In-memory cache hit
      2. External Rate Prediction API (TODO: wire real endpoint when available)
      3. lane_stats.json avg * 0.98 fallback
      4. National default (Rs. 38,000 * 0.98)
    """
    key = f"{origin}|{destination}|{truck_type}|{date}"
    if key in _cache:
        return _cache[key]

    # ── External API call placeholder ───────────────────────────────────────
    # When the real Rate Prediction endpoint is available, replace this block:
    #
    # import httpx, os
    # try:
    #     resp = httpx.post(
    #         os.getenv("RATE_PREDICTION_URL", ""),
    #         json={"origin": origin, "destination": destination,
    #               "truck_type": truck_type, "date": date},
    #         timeout=3.0,
    #     )
    #     resp.raise_for_status()
    #     result = float(resp.json()["predicted_rate"])
    #     _cache[key] = result
    #     return result
    # except Exception as e:
    #     logger.warning(f"Rate Prediction API failed ({e}), falling back to lane stats")
    # ────────────────────────────────────────────────────────────────────────

    # ── Fallback: lane_stats.json ───────────────────────────────────────────
    lane = get_lane_context(origin, destination, truck_type)
    result = round(lane["avg"] * 0.98)       # predicted slightly below historical avg
    _cache[key] = result
    logger.debug(f"Rate prediction fallback for '{key}': Rs.{result:,}")
    return result
