"""
RL Feedback Service — stores decisions in a JSON file and derives reinforcement
learning signals from the decision history.

Storage: api/data/feedback.json  (simple flat list, capped at 500 entries)
This is intentionally a lightweight POC — for production you'd swap the file
store for a proper DB and train an actual model.
"""
import json, os, uuid, logging
from datetime import datetime
from typing import List, Dict, Any, Optional

log = logging.getLogger(__name__)

FEEDBACK_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "feedback.json")
MAX_RECORDS   = 500


# ─── Storage ──────────────────────────────────────────────────────────────────

def _load() -> List[Dict]:
    try:
        if os.path.exists(FEEDBACK_PATH):
            with open(FEEDBACK_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
    except Exception as e:
        log.warning(f"Could not load feedback: {e}")
    return []


def _save(records: List[Dict]) -> None:
    os.makedirs(os.path.dirname(FEEDBACK_PATH), exist_ok=True)
    with open(FEEDBACK_PATH, "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2, ensure_ascii=False)


def store_decision(decision: Dict) -> Dict:
    """Persist a new decision to the store. Returns the saved record."""
    records = _load()

    record = {
        **decision,
        "id":        decision.get("id") or f"D{uuid.uuid4().hex[:8].upper()}",
        "timestamp": decision.get("timestamp") or datetime.utcnow().isoformat() + "Z",
    }

    records.insert(0, record)
    if len(records) > MAX_RECORDS:
        records = records[:MAX_RECORDS]

    _save(records)
    log.info(f"Feedback saved: {record['id']} action={record.get('action')} lsp={record.get('lsp')}")
    return record


def get_all_decisions() -> List[Dict]:
    return _load()


def get_summary() -> Dict:
    records = _load()
    if not records:
        return {
            "total_decisions": 0,
            "accept_count": 0, "negotiate_count": 0, "reject_count": 0,
            "override_count": 0,
            "top_lsps": [],
            "recent_decisions": [],
            "avg_neg_gap_pct": None,
        }

    accept_count    = sum(1 for r in records if r.get("action") == "ACCEPT")
    negotiate_count = sum(1 for r in records if r.get("action") == "NEGOTIATE")
    reject_count    = sum(1 for r in records if r.get("action") == "REJECT")
    override_count  = sum(1 for r in records if r.get("overridden"))

    # Top LSPs by acceptance
    lsp_stats: Dict[str, Dict] = {}
    for r in records:
        lsp = r.get("lsp") or "—"
        if not lsp or lsp == "—":
            continue
        if lsp not in lsp_stats:
            lsp_stats[lsp] = {"lsp": lsp, "accept_count": 0, "negotiate_count": 0, "reject_count": 0, "total": 0}
        lsp_stats[lsp]["total"] += 1
        if r.get("action") == "ACCEPT":
            lsp_stats[lsp]["accept_count"] += 1
        elif r.get("action") == "NEGOTIATE":
            lsp_stats[lsp]["negotiate_count"] += 1
        elif r.get("action") == "REJECT":
            lsp_stats[lsp]["reject_count"] += 1

    top_lsps = sorted(lsp_stats.values(), key=lambda x: x["total"], reverse=True)[:5]

    # Avg negotiation gap
    neg_recs = [r for r in records if r.get("action") == "NEGOTIATE" and r.get("neg_gap_pct") is not None]
    avg_neg = round(sum(r["neg_gap_pct"] for r in neg_recs) / len(neg_recs), 2) if neg_recs else None

    # Recent 5 (lightweight)
    recent = []
    for r in records[:5]:
        recent.append({
            "id":        r.get("id"),
            "timestamp": r.get("timestamp"),
            "action":    r.get("action"),
            "lsp":       r.get("lsp"),
            "origin":    r.get("origin"),
            "destination": r.get("destination"),
            "truck_type":  r.get("truck_type"),
            "overridden":  r.get("overridden", False),
        })

    return {
        "total_decisions":   len(records),
        "accept_count":      accept_count,
        "negotiate_count":   negotiate_count,
        "reject_count":      reject_count,
        "override_count":    override_count,
        "top_lsps":          top_lsps,
        "recent_decisions":  recent,
        "avg_neg_gap_pct":   avg_neg,
    }


# ─── Signal derivation ────────────────────────────────────────────────────────

def derive_signals(
    origin: Optional[str],
    destination: Optional[str],
    truck_type: Optional[str],
    urgency: Optional[str],
    target_lsp: Optional[str],
    base_confidence: float = 0.75,
) -> Dict:
    """
    Analyse historical decisions and return RL learning signals + adjusted confidence.

    Signal types:
      lsp_track   — historical accept/reject/negotiate rate for target_lsp
      lane_track  — decisions on the same origin→destination lane
      market_adj  — rate trends for this truck type
      override_log — count of recorded manual overrides
    """
    records        = _load()
    signals        = []
    confidence_adj = 0.0

    # ── 1. LSP track record ──────────────────────────────────────────────────
    if target_lsp:
        lsp_hist = [r for r in records if r.get("lsp") == target_lsp]
        if lsp_hist:
            accepts  = sum(1 for r in lsp_hist if r.get("action") == "ACCEPT")
            rejects  = sum(1 for r in lsp_hist if r.get("action") == "REJECT")
            negs     = sum(1 for r in lsp_hist if r.get("action") == "NEGOTIATE")
            total    = len(lsp_hist)
            acc_rate = accepts / total

            if acc_rate >= 0.7:
                adj = round(min(0.08, 0.02 * total), 3)
                signals.append({
                    "type":   "lsp_track",
                    "icon":   "CheckCircle2",
                    "title":  f"{target_lsp} accepted {accepts}/{total} times historically",
                    "body":   f"Consistent acceptance track record validates the AI pick. Confidence boosted by {round(adj*100)}%.",
                    "impact": "positive",
                    "confidence_adj": adj,
                })
                confidence_adj += adj

            elif rejects > accepts:
                adj = round(min(0.10, 0.02 * rejects), 3)
                signals.append({
                    "type":   "lsp_track",
                    "icon":   "AlertTriangle",
                    "title":  f"{target_lsp} previously rejected {rejects}/{total} times",
                    "body":   f"Historical rejections suggest caution. Confidence reduced by {round(adj*100)}%.",
                    "impact": "negative",
                    "confidence_adj": -adj,
                })
                confidence_adj -= adj

            elif negs > 0:
                neg_gaps = [r["neg_gap_pct"] for r in lsp_hist if r.get("action") == "NEGOTIATE" and r.get("neg_gap_pct")]
                if neg_gaps:
                    avg_gap = round(sum(neg_gaps) / len(neg_gaps), 1)
                    adj     = 0.02
                    signals.append({
                        "type":   "lsp_track",
                        "icon":   "TrendingDown",
                        "title":  f"{target_lsp} accepted counters avg {avg_gap}% below quoted",
                        "body":   f"Past negotiations succeeded at similar gaps, reinforcing the target price.",
                        "impact": "neutral",
                        "confidence_adj": adj,
                    })
                    confidence_adj += adj

    # ── 2. Lane track record ─────────────────────────────────────────────────
    if origin and destination:
        lane_hist = [r for r in records if r.get("origin") == origin and r.get("destination") == destination]
        if lane_hist:
            awarded_rates = [r["awarded_rate"] for r in lane_hist if r.get("awarded_rate")]
            avg_rate      = round(sum(awarded_rates) / len(awarded_rates)) if awarded_rates else None
            reject_count  = sum(1 for r in lane_hist if r.get("action") == "REJECT")

            body_parts = [f"{len(lane_hist)} past decision(s) on this lane."]
            if avg_rate:
                body_parts.append(f"Avg awarded rate: Rs. {avg_rate:,}.")
            if reject_count:
                body_parts.append(f"{reject_count} rejection(s) — market was overpriced at the time.")

            adj    = 0.03 if len(lane_hist) >= 3 else 0.01
            impact = "negative" if reject_count > len(lane_hist) / 2 else "positive"
            if impact == "negative":
                adj = -adj

            signals.append({
                "type":   "lane_track",
                "icon":   "Route",
                "title":  f"{len(lane_hist)} past decision(s) on {origin.split(',')[0]} to {destination.split(',')[0]}",
                "body":   " ".join(body_parts),
                "impact": impact,
                "confidence_adj": adj,
            })
            confidence_adj += adj

    # ── 3. Truck type market trend ───────────────────────────────────────────
    if truck_type:
        truck_hist = [r for r in records if r.get("truck_type") == truck_type]
        if len(truck_hist) >= 3:
            recent_rates = [r["awarded_rate"] for r in truck_hist[:6] if r.get("awarded_rate")]
            if len(recent_rates) >= 2:
                rising = recent_rates[0] > recent_rates[-1]
                trend  = "rising" if rising else "stable or falling"
                formatted = [f"Rs. {int(r):,}" for r in recent_rates[:3]]
                signals.append({
                    "type":   "market_adj",
                    "icon":   "TrendingUp" if rising else "TrendingDown",
                    "title":  f"{truck_type} market rates {trend} ({len(truck_hist)} referrals)",
                    "body":   f"Recent awarded rates: {', '.join(formatted)}.",
                    "impact": "negative" if rising else "positive",
                    "confidence_adj": 0.0,
                })

    # ── 4. Override log ──────────────────────────────────────────────────────
    overrides = [r for r in records if r.get("overridden")]
    if overrides:
        adj = min(0.03, 0.005 * len(overrides))
        signals.append({
            "type":   "override_log",
            "icon":   "RotateCcw",
            "title":  f"{len(overrides)} manual override(s) logged in learning model",
            "body":   "Your overrides are teaching the model your preferences and will influence future scoring weight.",
            "impact": "neutral",
            "confidence_adj": adj,
        })
        confidence_adj += adj

    adjusted_confidence = min(0.99, max(0.10, base_confidence + confidence_adj))

    return {
        "signals":              signals,
        "adjusted_confidence":  round(adjusted_confidence, 3),
        "decision_count":       len(records),
    }
