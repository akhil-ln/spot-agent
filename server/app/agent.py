import re
import json
import logging
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from app.config import settings
from app.models import RequestMeta, ScoredQuote, AIRecommendation

logger = logging.getLogger(__name__)

PROMPT = ChatPromptTemplate.from_template("""
You are an expert logistics procurement decision agent for an Indian manufacturer.
Analyse the scored freight quotations below and return a procurement recommendation.

SPOT REQUEST:
- Route: {origin} → {destination}
- Truck Type: {truck_type}
- Urgency: {urgency}
- Trucks Required: {trucks_required}
- Cost Threshold: Rs.{threshold}
- Predicted Market Rate: Rs.{predicted_rate}
- Historical Benchmark: Rs.{benchmark_rate}
- Market Condition: {market_note}

SCORED QUOTATIONS (ranked best to worst):
{quotes_text}

SCORING WEIGHTS: Price 30% | Reliability 25% | Urgency 20% | Market 15% | Threshold 10%
DECISION RULES:
- Composite >= 80 → lean ACCEPT
- Composite 55-79 → lean NEGOTIATE, provide target price using LSP's neg_gap
- Composite < 55  → lean REJECT
- If top LSP has PARTIAL availability flag and trucks_required > 1 → disqualify them
- New LSP with no history → flag risk, do not ACCEPT directly

Respond ONLY with valid JSON, no markdown, no text outside the object:
{{
  "recommendation": "ACCEPT or NEGOTIATE or REJECT",
  "target_lsp": "exact LSP name, or null if REJECT",
  "confidence": 0.00,
  "negotiate_target_price": null or number,
  "reasoning": "2-3 sentences referencing specific scores and percentages from the data",
  "key_risk": "one actionable sentence on the main risk"
}}
""")


def _build_quotes_text(quotes: list[ScoredQuote]) -> str:
    lines = []
    for i, q in enumerate(quotes):
        flags = []
        if q.availability_flag: flags.append(f"⚠️ {q.availability_flag}")
        if q.is_new_lsp:        flags.append("NEW LSP — no history")
        flag_str = f"  [{', '.join(flags)}]" if flags else ""

        lines.append(
            f"{i+1}. {q.lsp}{flag_str}\n"
            f"   Quote: Rs.{q.raw_quote:,.0f} | Composite: {q.composite}/100 | Confidence: {q.data_confidence}\n"
            f"   OTD: {q.on_time_delivery_pct}% | Damage: {q.damage_rate_pct}% | Win rate: {q.lsp_win_rate}% | Neg gap: {q.lsp_neg_gap_pct}%\n"
            f"   Price delta vs market: {q.price_delta_pct:+.1f}%\n"
            f"   Scores → Price:{q.scores.price} Reliability:{q.scores.reliability} "
            f"Urgency:{q.scores.urgency} Market:{q.scores.market} Threshold:{q.scores.threshold}"
        )
    return "\n\n".join(lines)


def _fallback(quotes: list[ScoredQuote], threshold: float) -> tuple[dict, bool]:
    top = quotes[0]
    if top.composite >= 80:
        return {
            "recommendation": "ACCEPT",
            "target_lsp": top.lsp,
            "confidence": round(top.composite / 100, 2),
            "negotiate_target_price": None,
            "reasoning": f"{top.lsp} scores {top.composite}/100 — recommended by scoring engine.",
            "key_risk": "Gemini unavailable. Verify this recommendation manually before acting."
        }, True
    if top.composite >= 55:
        target = round(top.raw_quote * (1 - top.lsp_neg_gap_pct / 100))
        return {
            "recommendation": "NEGOTIATE",
            "target_lsp": top.lsp,
            "confidence": round(top.composite / 100, 2),
            "negotiate_target_price": target,
            "reasoning": f"{top.lsp} scores {top.composite}/100. Target price from {top.lsp_neg_gap_pct}% historical gap.",
            "key_risk": "Gemini unavailable. Verify this recommendation manually before acting."
        }, True
    return {
        "recommendation": "REJECT",
        "target_lsp": None,
        "confidence": 0.5,
        "negotiate_target_price": None,
        "reasoning": "All quotes score below 55. Re-tendering recommended.",
        "key_risk": "Gemini unavailable. Verify this recommendation manually before acting."
    }, True


_chain = None

def _get_chain():
    global _chain
    if _chain is None:
        llm = ChatGoogleGenerativeAI(
            model=settings.GEMINI_MODEL,
            google_api_key=settings.GEMINI_API_KEY,
            temperature=0,
            max_output_tokens=2048,
        )
        _chain = PROMPT | llm | StrOutputParser()
    return _chain


def get_recommendation(
    meta: RequestMeta,
    ranked_quotes: list[ScoredQuote],
) -> tuple[AIRecommendation, bool]:

    quotes_text = _build_quotes_text(ranked_quotes)

    try:
        raw = _get_chain().invoke({
            "origin":         meta.origin,
            "destination":    meta.destination,
            "truck_type":     meta.truck_type,
            "urgency":        meta.urgency,
            "trucks_required":meta.trucks_required,
            "threshold":      f"{meta.cost_threshold:,.0f}",
            "predicted_rate": f"{meta.predicted_rate:,.0f}",
            "benchmark_rate": f"{meta.benchmark_rate:,.0f}",
            "market_note":    meta.market_note or "Normal market conditions",
            "quotes_text":    quotes_text,
        })

        cleaned = re.sub(r"```json|```", "", raw).strip()
        match   = re.search(r"\{.*\}", cleaned, re.DOTALL)
        if not match:
            raise ValueError("No JSON in Gemini response")

        parsed = json.loads(match.group())
        return AIRecommendation(**parsed), False

    except Exception as e:
        logger.error(f"Gemini failed: {e}")
        fallback_data, used = _fallback(ranked_quotes, meta.cost_threshold)
        return AIRecommendation(**fallback_data), used