import os
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from typing import Optional

class Recommendation(BaseModel):
    recommendation: str = Field(description="ACCEPT, NEGOTIATE, or REJECT")
    target_lsp: str = Field(description="Name of the recommended LSP")
    confidence: float = Field(description="0.0 to 1.0")
    negotiate_target_price: Optional[float] = Field(default=None)
    reasoning: str = Field(description="2-3 sentences with specific data")
    key_risk: str = Field(description="One sentence on the main risk")

def build_agent():
    llm = ChatAnthropic(
        model="claude-sonnet-4-20250514",
        anthropic_api_key=os.getenv("ANTHROPIC_API_KEY"),
        max_tokens=1000,
    )

    prompt = ChatPromptTemplate.from_template("""
You are a logistics procurement decision agent for an Indian manufacturer.

Spot Request:
- Route: {origin} to {destination}
- Truck: {truck_type}, Urgency: {urgency}
- Cost Threshold: Rs.{threshold}
- Predicted Market Rate: Rs.{predicted_rate}
- Historical Benchmark: Rs.{benchmark_rate}

Scored LSP Quotations (ranked by composite score):
{quotes_text}

Return ONLY valid JSON, no markdown, no extra text:
{{
  "recommendation": "ACCEPT or NEGOTIATE or REJECT",
  "target_lsp": "LSP name",
  "confidence": 0.00,
  "negotiate_target_price": null,
  "reasoning": "2-3 sentences with specific data points",
  "key_risk": "one sentence"
}}
""")

    parser = JsonOutputParser(pydantic_object=Recommendation)
    return prompt | llm | parser

agent_chain = build_agent()

def get_recommendation(ranked_quotes: list, request_meta: dict) -> dict:
    quotes_text = "\n".join([
        f"{i+1}. {q['lsp']} | Quote: Rs.{q['raw_quote']:,} | "
        f"Score: {q['composite']}/100 | OTD: {q['on_time_delivery_pct']}% | "
        f"Price delta: {q['price_delta_pct']}% | Win rate: {q['lsp_win_rate']}% | "
        f"Neg gap: {q['lsp_neg_gap_pct']}%"
        for i, q in enumerate(ranked_quotes)
    ])

    return agent_chain.invoke({
        "origin": request_meta["origin"],
        "destination": request_meta["destination"],
        "truck_type": request_meta["truck_type"],
        "urgency": request_meta["urgency"],
        "threshold": request_meta["cost_threshold"],
        "predicted_rate": request_meta.get("predicted_rate", "N/A"),
        "benchmark_rate": request_meta.get("benchmark_rate", "N/A"),
        "quotes_text": quotes_text,
    })