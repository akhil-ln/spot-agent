from app.models import QuoteInput, RequestMeta, ScoredQuote, DimensionScores

WEIGHTS = {
    "price":       0.30,
    "reliability": 0.25,
    "urgency":     0.20,
    "market":      0.15,
    "threshold":   0.10,
}


def _score_price(raw: float, predicted: float, benchmark: float) -> float:
    fair = 0.6 * predicted + 0.4 * benchmark
    delta = ((raw - fair) / fair) * 100
    if delta <= -10: return 100
    if delta <= 0:   return 90
    if delta <= 5:   return 75
    if delta <= 10:  return 60
    if delta <= 20:  return 40
    return 20


def _score_reliability(win_rate: float, otd: float, damage: float) -> float:
    score = (win_rate * 0.5) + (otd * 0.4) + (max(0, 10 - damage) * 10 * 0.1)
    return round(min(100, max(0, score)), 1)


def _score_urgency(urgency: str, transit_days: int, min_transit: int) -> float:
    gap = transit_days - min_transit
    if urgency == "HIGH":   return max(20, 100 - gap * 25)
    if urgency == "MEDIUM": return max(40, 85  - gap * 15)
    return 70


def _score_market(raw: float, benchmark: float, demand_index: float) -> float:
    if demand_index >= 0.85: return 65
    delta = (raw - benchmark) / benchmark
    if delta < -0.10: return 90
    if delta < 0:     return 80
    if delta < 0.05:  return 70
    return 55


def _score_threshold(raw: float, threshold: float) -> float:
    r = raw / threshold
    if r <= 0.90: return 100
    if r <= 1.00: return 80
    if r <= 1.10: return 50
    return 20


def score_and_rank(meta: RequestMeta, quotes: list[QuoteInput]) -> list[ScoredQuote]:
    min_transit = min(q.transit_days for q in quotes)

    scored = []
    for q in quotes:
        p = _score_price(q.raw_quote, meta.predicted_rate, meta.benchmark_rate)
        r = _score_reliability(q.win_rate_pct, q.on_time_delivery_pct, q.damage_rate_pct)
        u = _score_urgency(meta.urgency, q.transit_days, min_transit)
        m = _score_market(q.raw_quote, meta.benchmark_rate, meta.demand_index)
        t = _score_threshold(q.raw_quote, meta.cost_threshold)

        composite = round(
            p * WEIGHTS["price"] +
            r * WEIGHTS["reliability"] +
            u * WEIGHTS["urgency"] +
            m * WEIGHTS["market"] +
            t * WEIGHTS["threshold"],
            1
        )

        price_delta = round(
            ((q.raw_quote - meta.predicted_rate) / meta.predicted_rate) * 100, 1
        )

        availability_flag = None
        if q.trucks_available is not None and q.trucks_available < meta.trucks_required:
            availability_flag = (
                f"PARTIAL — only {q.trucks_available}/{meta.trucks_required} trucks available"
            )

        confidence = (
            "LOW"    if q.is_new_lsp else
            "MEDIUM" if q.lane_familiarity_score < 30 else
            "HIGH"
        )

        scored.append(ScoredQuote(
            id=q.id,
            lsp=q.lsp,
            raw_quote=q.raw_quote,
            predicted_rate=meta.predicted_rate,
            benchmark_rate=meta.benchmark_rate,
            price_delta_pct=price_delta,
            lsp_win_rate=q.win_rate_pct,
            lsp_neg_gap_pct=q.neg_gap_pct,
            lane_familiarity=q.lane_familiarity_score,
            on_time_delivery_pct=q.on_time_delivery_pct,
            damage_rate_pct=q.damage_rate_pct,
            is_new_lsp=q.is_new_lsp,
            trucks_available=q.trucks_available,
            availability_flag=availability_flag,
            scores=DimensionScores(price=p, reliability=r, urgency=u, market=m, threshold=t),
            composite=composite,
            data_confidence=confidence,
        ))

    return sorted(scored, key=lambda x: x.composite, reverse=True)