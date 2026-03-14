"""
benchmark.py
------------
Wraps the external Benchmarking Tool (ODT Historical) API call.
Falls back to lane_stats.json stats if the API is unavailable.
Results are in-memory cached per (origin, destination, truck_type).
"""

import logging
from app.data_loader import get_lane_context

logger = logging.getLogger(__name__)

_cache: dict = {}


def get_benchmark_rate(
    origin: str,
    destination: str,
    truck_type: str,
) -> dict:
    """
    Returns benchmark stats (INR) for this lane.
    Shape: { avg, min, max, std_dev, count }

    Priority:
      1. In-memory cache hit
      2. External Benchmarking Tool API (TODO: wire real endpoint when available)
      3. lane_stats.json fallback
      4. National default
    """
    key = f"{origin}|{destination}|{truck_type}"
    if key in _cache:
        return _cache[key]

    # ── External API call placeholder ───────────────────────────────────────
    # When the real Benchmarking Tool endpoint is available, replace this block:
    #
    # import httpx, os
    # try:
    #     resp = httpx.post(
    #         os.getenv("BENCHMARK_URL", ""),
    #         json={"origin": origin, "destination": destination,
    #               "truck_type": truck_type},
    #         timeout=3.0,
    #     )
    #     resp.raise_for_status()
    #     result = resp.json()   # { avg_rate, min_rate, max_rate, std_dev, sample_size }
    #     normalised = {
    #         "avg":     result["avg_rate"],
    #         "min":     result["min_rate"],
    #         "max":     result["max_rate"],
    #         "std_dev": result["std_dev"],
    #         "count":   result.get("sample_size", 0),
    #     }
    #     _cache[key] = normalised
    #     return normalised
    # except Exception as e:
    #     logger.warning(f"Benchmark API failed ({e}), falling back to lane stats")
    # ────────────────────────────────────────────────────────────────────────

    # ── Fallback: lane_stats.json ───────────────────────────────────────────
    result = get_lane_context(origin, destination, truck_type)
    _cache[key] = result
    logger.debug(f"Benchmark fallback for '{key}': avg=Rs.{result['avg']:,}")
    return result


def compute_demand_index(avg: float, std_dev: float) -> float:
    """
    Derive a [0, 1] market demand index from price volatility.
    High std_dev relative to avg → volatile market → higher demand index.
    """
    if avg == 0:
        return 0.65
    ratio = std_dev / avg
    # Map: ratio=0 → 0.40, ratio=0.20 → 0.85, ratio>=0.30 → 0.95
    if ratio >= 0.30:
        return 0.95
    if ratio >= 0.20:
        return 0.85
    if ratio >= 0.10:
        return 0.70
    return 0.55
