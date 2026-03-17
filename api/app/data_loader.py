"""
data_loader.py
--------------
Loads lane_stats.json and lsp_profiles.json once at module import time.
Provides two pure-lookup functions used by the analyse orchestrator.
"""

import os
import json
import logging

logger = logging.getLogger(__name__)

# ── Paths ───────────────────────────────────────────────────────────────────
_BASE = os.path.join(os.path.dirname(__file__), "..", "..", "data")
_LANE_PATH = os.path.join(_BASE, "lane_stats.json")
_LSP_PATH  = os.path.join(_BASE, "lsp_profiles.json")

# BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
# _LANE_PATH = os.path.join(BASE_DIR, "data", "lane_stats.json")
# _LSP_PATH  = os.path.join(BASE_DIR, "data", "lsp_profiles.json")

# ── Load JSON files at startup ───────────────────────────────────────────────
def _load(path: str, label: str) -> dict:
    try:
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
        logger.info(f"Loaded {label}: {len(data)} records from {path}")
        return data
    except Exception as e:
        logger.error(f"Failed to load {label}: {e}")
        return {}

_lane_stats:   dict = _load(_LANE_PATH, "lane_stats")
_lsp_profiles: dict = _load(_LSP_PATH,  "lsp_profiles")

# ── National fallback constants ──────────────────────────────────────────────
_NATIONAL_DEFAULT = {
    "avg":     38000,
    "min":     30000,
    "max":     48000,
    "std_dev": 4000,
    "count":   0,
}

_NEW_LSP_DEFAULT = {
    "win_rate":             0.50,
    "neg_gap_pct":          8.0,
    "lane_count":           0,
    "odt_lane_count":       0,
    "total_appearances":    0,
    "is_new_lsp":           True,
}

# ── LSP Profile lookup ───────────────────────────────────────────────────────
def _normalise_key(name: str) -> str:
    return name.strip().lower()

# Build a lowercase index once so every lookup is O(1)
_lsp_index: dict = {_normalise_key(k): k for k in _lsp_profiles}


def _clamp_neg_gap(value: float) -> float:
    """Guard against data-quality outliers (e.g. -7183) in lsp_profiles."""
    return round(max(0.0, min(value, 30.0)), 2)


def get_lsp_profile(lsp_name: str) -> dict:
    """
    Return the cleaned, enriched profile dict for a transporter.
    Falls back to neutral new-LSP defaults if not found.

    Derived fields added here (not in raw JSON):
      - on_time_delivery_pct  → win_rate * 100  (reasonable proxy)
      - damage_rate_pct       → 2.0             (safe neutral default)
      - lane_familiarity_score → min(100, lane_count * 2)
      - is_new_lsp            → True/False
    """
    norm = _normalise_key(lsp_name)
    raw_key = _lsp_index.get(norm)

    if raw_key is None:
        logger.debug(f"LSP not found: '{lsp_name}' — applying new-LSP defaults")
        base = dict(_NEW_LSP_DEFAULT)
    else:
        raw = _lsp_profiles[raw_key]
        base = {
            "win_rate":           raw.get("win_rate", 0.5),
            "neg_gap_pct":        _clamp_neg_gap(raw.get("neg_gap_pct", 8.0)),
            "lane_count":         raw.get("lane_count", 0),
            "odt_lane_count":     raw.get("odt_lane_count", 0),
            "total_appearances":  raw.get("total_appearances", 0),
            "is_new_lsp":         False,
        }

    # Derived fields
    base["win_rate_pct"]           = round(base["win_rate"] * 100, 1)
    base["on_time_delivery_pct"]   = round(base["win_rate"] * 100, 1)  # proxy
    base["damage_rate_pct"]        = 2.0                                # neutral default
    base["lane_familiarity_score"] = min(100, base["lane_count"] * 2)

    return base


# ── Lane Stats lookup ────────────────────────────────────────────────────────
def _lane_key(origin: str, destination: str, truck_type: str) -> str:
    return f"{origin.strip()}|{destination.strip()}|{truck_type.strip()}"


def get_lane_context(origin: str, destination: str, truck_type: str) -> dict:
    """
    Return historical lane stats for the given O/D/truck_type combination.
    Falls back to national defaults if the lane is not in the dataset.
    """
    key = _lane_key(origin, destination, truck_type)
    raw = _lane_stats.get(key)

    if raw is None:
        logger.debug(f"Lane not in stats: '{key}' — using national defaults")
        return dict(_NATIONAL_DEFAULT)

    return {
        "avg":     raw.get("avg_quote", _NATIONAL_DEFAULT["avg"]),
        "min":     raw.get("min_quote", _NATIONAL_DEFAULT["min"]),
        "max":     raw.get("max_quote", _NATIONAL_DEFAULT["max"]),
        "std_dev": raw.get("std_dev",   _NATIONAL_DEFAULT["std_dev"]),
        "count":   raw.get("count",     0),
    }
