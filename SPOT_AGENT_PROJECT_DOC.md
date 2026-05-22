# Spot Decision Agent — Project Documentation

> This document is intended to help the team build a presentation for the LoRRI Hackathon.  
> It is split into two parts: **Non-Technical** (for business stakeholders and judges) and **Technical** (for engineering judges and developers).

---

# PART 1 — NON-TECHNICAL

---

## Executive Summary

The Spot Decision Agent is an AI-powered procurement assistant built for LoRRI's logistics operations team. When a spot freight request comes in and multiple Logistics Service Providers (LSPs) submit quotes, the agent analyzes every quote against historical data and market benchmarks, then recommends in seconds whether to **Accept**, **Negotiate**, or **Reject** — with a clear, human-readable explanation for each decision. Over time, the system learns from past procurement decisions and becomes sharper with every shipment.

---

## Problem Statement

### The Challenge of Spot Freight Procurement

In logistics, a **spot shipment** is an ad-hoc, one-time freight requirement — a manufacturer needs to move goods on short notice and reaches out to multiple Logistics Service Providers for quotes.

LoRRI's procurement team currently evaluates these quotes manually, which creates several challenges:

**1. It is time-consuming**  
Each evaluation requires the officer to mentally compare rates across multiple LSPs, factor in each carrier's track record, check whether the price is reasonable for that particular lane (origin → destination), and account for urgency. This can take 15–30 minutes per shipment, and there may be dozens of spot requests in a day.

**2. Decisions are subjective and inconsistent**  
Different team members weigh factors differently. One officer might prioritize the lowest price; another might favor a trusted carrier even at a premium. There is no standard scoring system, so two officers may reach different conclusions on the same set of quotes.

**3. Historical intelligence is lost**  
Has this LSP been unreliable on this lane before? Did a similar negotiation succeed last quarter? Did the market rate for this truck type spike recently? This institutional knowledge exists in scattered spreadsheets and individual memory, not in a system that can act on it.

**4. Risk of costly mistakes**  
Accepting an overpriced quote wastes money. Accepting an unreliable carrier causes shipment delays and damage claims. Rejecting a genuinely good quote means re-tendering and losing time. Without a structured system, these mistakes are common.

---

## Solution Overview

The Spot Decision Agent automates the intelligence layer of spot procurement — not to replace the procurement officer, but to give them a well-reasoned recommendation they can act on or override.

Here is what happens when a procurement officer uses the tool:

**Step 1 — Open a spot request**  
The officer sees the list of open spot enquiries. Each card shows the route, truck type, urgency level, and budget ceiling. They click on the one they want to evaluate.

**Step 2 — Review the raw quotes**  
The system displays all LSP quotes side by side: the price quoted, transit time, and availability. At this stage it is raw data — no analysis yet.

**Step 3 — Run the analysis**  
The officer clicks "Run Analysis." The system:
- Looks up the historical average rate for this specific lane and truck type
- Pulls the current market benchmark and demand index
- Retrieves each LSP's historical performance profile (how often they win, their on-time delivery rate, how much they typically negotiate)
- Scores every quote across five dimensions: price, reliability, urgency fit, market conditions, and budget compliance
- Feeds the scored data to a Google Gemini AI, which reasons over the data and produces a recommendation

**Step 4 — Review the recommendation**  
The officer sees:
- A clear verdict: **ACCEPT**, **NEGOTIATE**, or **REJECT**, with a confidence percentage
- The reasoning behind the recommendation in plain English
- A breakdown of how each LSP scored across the five dimensions
- If the recommendation is NEGOTIATE — the exact target price to counter-offer at, based on this LSP's historical negotiation behavior
- Signals from past decisions: how this LSP has performed before, what rates were accepted on this lane, recent market trends
- A key risk to watch out for

**Step 5 — Confirm or override**  
The officer can accept the AI's recommendation or override it with their own judgment. Either way, the final decision is recorded. Over time, these decisions feed a reinforcement learning loop that makes future recommendations smarter.

---

## User Journey (Screen by Screen)

| Step | What the Officer Sees | What They Do |
|------|----------------------|--------------|
| Landing | Welcome screen with platform branding | Click "Get Started" |
| Screen 1 — Enquiry List | Cards showing open spot requests with route, truck type, urgency, and status | Select a request to evaluate |
| Screen 2 — Request Detail | Full details of the shipment + table of all LSP quotes (raw, unevaluated) | Review quotes, click "Run Analysis" |
| Screen 3 — Analysis in Progress | Animated loader showing four steps: Lane Context → Quote Enrichment → Scoring → AI Recommendation | Wait (~2–4 seconds) |
| Screen 4 — Recommendation | AI verdict with confidence meter, score breakdowns, historical signals, reasoning, and key risk | Accept the recommendation or override it; confirm via modal |

---

## Key Capabilities

- **Instant AI Recommendation** — Accept, Negotiate, or Reject, with a confidence score and full reasoning in plain English
- **Five-Dimension Scoring** — Every quote is evaluated on price fairness, carrier reliability, urgency fit, market conditions, and budget compliance — not just the lowest rate
- **LSP Intelligence** — The system knows each carrier's historical win rate, on-time delivery record, damage rate, and typical negotiation behavior
- **Market Benchmarking** — Rates are compared against LoRRI's historical lane data and live market benchmarks to flag overpriced or suspiciously low quotes
- **Negotiation Guidance** — When the AI recommends negotiating, it calculates the exact target price based on the LSP's historical negotiation gap
- **Reinforcement Learning** — Every confirmed decision is stored and used to adjust confidence in future recommendations. The system learns which LSPs and lanes have historically been accepted or rejected
- **Manual Override with Audit Trail** — Officers can always override the AI. Overrides are logged and feed back into the learning loop
- **Works Offline** — If the AI service is unavailable, the system falls back to deterministic rules. If the backend is down, the frontend operates from local storage. The tool never goes dark

---

## Business Impact

**Faster Procurement Decisions**  
What previously required 15–30 minutes of manual analysis can be completed in under a minute. The AI handles the data aggregation and reasoning; the officer validates and confirms.

**Consistent, Objective Evaluations**  
Every quote is evaluated using the same scoring framework with the same weights. The decision quality does not vary between team members or between a busy Monday morning and a quiet Friday afternoon.

**Institutional Knowledge at Scale**  
The system captures the outcome of every procurement decision. Patterns emerge automatically: which LSPs are reliable on which lanes, what rate ranges are acceptable for which truck types, when the market is volatile. This knowledge is accessible to every officer, not locked in any individual's head.

**Reduced Procurement Risk**  
The AI flags new LSPs with no track record, carriers with low on-time delivery, and quotes that fall far outside market norms — giving the officer a specific risk to evaluate before committing.

**Continuous Improvement**  
The reinforcement learning loop means the system improves with use. Each decision, override, and negotiation outcome becomes a training signal that sharpens future recommendations.

**Full Auditability**  
Every recommendation, every override, and every confirmed decision is logged with a timestamp. This creates a defensible audit trail for procurement governance.


---

# PART 2 — TECHNICAL

---

## Architecture Overview

The Spot Decision Agent is a full-stack monorepo with a React frontend, a Python FastAPI backend, and a data layer consisting of JSON-based historical datasets and a lightweight decision store.

```
┌─────────────────────────────────────────────────────────────────┐
│                        REACT FRONTEND                           │
│  Screen1 (Enquiry List) → Screen2 (Quotes) → Screen3 (Loader)   │
│  → Screen4 (Recommendation + RL Signals + Action Modal)         │      
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP (JSON)
┌────────────────────────────▼────────────────────────────────────┐
│                      FASTAPI BACKEND                            │
│                                                                 │
│  POST /api/analyse   ←── Main Orchestration Pipeline            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  1. Lane Context     → Rate Prediction API               │   │
│  │                       + Benchmark API                    │   │
│  │  2. LSP Enrichment   → lsp_profiles.json lookup          │   │
│  │  3. Scoring Engine   → 5-dimension composite score       │   │
│  │  4. AI Recommendation → Google Gemini 2.5 Pro            │   │
│  │                         (LangChain chain, temp=0)        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  POST /api/feedback  <-- RL Decision Store                      │
│  POST /api/feedback/signals <-- Derive RL Signals               │
└─────────────┬──────────────────────────┬────────────────────────┘
              │                          │
┌─────────────▼──────────┐   ┌───────────▼──────────────────────┐
│    DATA LAYER          │   │   EXTERNAL INTEGRATIONS          │
│  Lane Statistics       │   │  Rate Prediction API (LoRRI)     │
│  LSP Profiles          │   │  Benchmark API (LoRRI)           │
│  demo_scenarios        │   │  Google Gemini 2.5 Pro           │
│  feedbacks (RL)        │   └──────────────────────────────────┘
└────────────────────────┘  
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend Framework | React + Vite | Component-based UI, fast dev build |
| HTTP Client | Axios | API calls from frontend to backend |
| UI Icons | Lucide React | Icon library |
| Backend Framework | FastAPI (Python 3.10+) | REST API, async-ready, OpenAPI auto-docs |
| AI Orchestration | LangChain 1.2 | Chain management for Gemini prompts |
| LLM | Google Gemini 2.5 Pro | AI reasoning and recommendation generation |
| Data Validation | Pydantic v2 | Request/response schema enforcement |
| Deployment Target | Vercel | Frontend + serverless backend |
| Historical Data | JSON DB | Lane stats, LSP profiles |
| RL Store | JSON DB (feedback) | Lightweight decision history (max 500 records) |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Service health check |
| POST | `/api/analyse` | Full analysis pipeline — main endpoint |
| POST | `/api/rank` | Score and rank quotes only (legacy/testing) |
| POST | `/api/recommend` | AI recommendation only (legacy/testing) |
| GET | `/api/scenarios` | Load pre-built demo scenarios |
| POST | `/feedback` | Save a confirmed procurement decision |
| POST | `/feedback/signals` | Derive RL signals for a given context |
| GET | `/feedback` | List all stored decisions (with limit param) |
| GET | `/feedback/summary` | Aggregated feedback statistics |
| DELETE | `/feedback` | Clear all decisions (demo reset) |

---

## Data Pipeline — POST /api/analyse

The single `/api/analyse` endpoint orchestrates the full 4-step pipeline:

```
INPUT
{
  "spot_request": {
    "id": "SPOT-001",
    "origin": "Fazilka, Punjab",
    "destination": "Alwar, Rajasthan",
    "truck_type": "15 MT OPENBODY",
    "urgency": "HIGH",
    "cost_threshold": 45000,
    "trucks_required": 1
  },
  "raw_quotes": [
    { "id": "Q1", "lsp": "Atharv Logistics", "raw_quote": 38500,
      "transit_days": 2, "availability": "Immediate" },
    { "id": "Q2", "lsp": "Blue Dart Express", "raw_quote": 42000,
      "transit_days": 1, "availability": "Immediate" }
  ]
}

STEP 1 — LANE CONTEXT
  get_lane_context(origin, destination, truck_type)
    → predicted_rate  (from Rate Prediction API)
    → benchmark_rate  (from Benchmark API)
    → demand_index    (std_dev / avg → volatility score 0.55–0.95)
    → market_note     (human-readable market condition string)

STEP 2 — LSP ENRICHMENT
  For each raw_quote:
    get_lsp_profile(lsp_name)
      → win_rate, neg_gap_pct, on_time_delivery_pct,
         damage_rate_pct, lane_familiarity_score, is_new_lsp

STEP 3 — SCORING
  score_and_rank(enriched_quotes, lane_context)
    → For each quote: price_score, reliability_score, urgency_score,
                      market_score, threshold_score, composite_score
    → Sort descending by composite_score

STEP 4 — AI RECOMMENDATION
  get_recommendation(ranked_quotes, lane_context, spot_request)
    → Gemini 2.5 Pro (or deterministic fallback)
    → recommendation, target_lsp, confidence, negotiate_target_price,
       reasoning, key_risk

OUTPUT
{
  "ranked_quotes": [ ...ScoredQuote[] ],
  "recommendation": {
    "recommendation": "ACCEPT",
    "target_lsp": "Atharv Logistics",
    "confidence": 0.89,
    "negotiate_target_price": null,
    "reasoning": "Atharv scores 89/100 — well below benchmark with 94% OTD. Urgency met.",
    "key_risk": "Verify load handling SLA before final acceptance."
  },
  "lane_context": { "predicted_rate": 36000, "benchmark_rate": 37000,
                    "demand_index": 0.70, "market_note": "Normal market conditions." },
  "used_fallback": false
}
```

---

## 5-Dimension Scoring Engine

**File:** [api/app/scoring.py](api/app/scoring.py)

Each quote receives a score from 0–100 on five independent dimensions. These are combined into a composite score using fixed weights.

| Dimension | Weight | What It Measures | Scoring Logic |
|-----------|--------|-----------------|---------------|
| **Price** | 30% | How the quoted rate compares to fair market value | Fair value = 60% predicted_rate + 40% benchmark_rate. Score declines as quote rises above fair value. ≤fair → 90; ≤fair+10% → 60; >fair+20% → 20 |
| **Reliability** | 25% | LSP's historical track record | 50% win_rate + 40% on_time_delivery + 10% damage quality. All normalized to 0–100 |
| **Urgency** | 20% | Whether transit time matches request urgency | Gap = quote_transit_days − min_transit_days. HIGH urgency: max(20, 100 − gap×25); MEDIUM: max(40, 85 − gap×15); LOW: baseline 70 |
| **Market** | 15% | Market conditions and quote vs. benchmark | Based on demand_index and price_delta vs. benchmark. Under benchmark → 80–90; above benchmark → 55–70; volatile market → 65 cap |
| **Threshold** | 10% | Compliance with procurement budget ceiling | quote/threshold ≤ 0.90 → 100; ≤ 1.00 → 80; ≤ 1.10 → 50; > 1.10 → 20 |

**Composite Formula:**
```
composite = (price × 0.30) + (reliability × 0.25) + (urgency × 0.20)
           + (market × 0.15) + (threshold × 0.10)
```

**Confidence Tier (for display):**
- HIGH: Known LSP with lane_familiarity ≥ 30 shipments
- MEDIUM: lane_familiarity < 30
- LOW: New LSP (not found in profiles database)

---

## AI Recommendation Agent

**File:** [api/app/agent.py](api/app/agent.py)

### Model
- **LLM:** Google Gemini 2.5 Pro via LangChain (`ChatGoogleGenerativeAI`)
- **Temperature:** 0 — deterministic output for reproducible procurement decisions
- **Max tokens:** 2048

### Prompt Design
The prompt is a structured template that gives Gemini:
1. The spot request context (origin, destination, truck type, urgency, cost threshold, trucks required)
2. The market context (predicted rate, benchmark rate, demand index, market note)
3. The ranked scored quotes with all five dimension scores and flags (new LSP, partial availability)

Decision rules embedded in the prompt:
- Composite ≥ 80 → lean ACCEPT
- Composite 55–79 → lean NEGOTIATE (target price = quote × (1 − neg_gap_pct/100))
- Composite < 55 → lean REJECT
- Partial availability when multiple trucks required → disqualify that LSP
- New LSP with no history → flag the risk, do not directly ACCEPT

### Output Schema (strict JSON)
```json
{
  "recommendation": "ACCEPT | NEGOTIATE | REJECT",
  "target_lsp": "LSP name or null",
  "confidence": 0.0–1.0,
  "negotiate_target_price": number or null,
  "reasoning": "2–3 sentences referencing specific scores",
  "key_risk": "one actionable risk sentence"
}
```

---

## Reinforcement Learning Signals

**File:** [api/app/rl_service.py](api/app/rl_service.py)

Every confirmed procurement decision is stored in `feedback.json` (capped at 500 records, FIFO). When a new recommendation is displayed on Screen 4, the system derives four signal types from this history to adjust the AI's base confidence.

### Decision Record Schema
```json
{
  "id": "D12345ABC",
  "timestamp": "2025-05-10T10:30:00Z",
  "action": "ACCEPT | NEGOTIATE | REJECT",
  "lsp": "Atharv Logistics",
  "awarded_rate": 38500,
  "quoted_rate": 38500,
  "target_price": null,
  "neg_gap_pct": 0,
  "origin": "Fazilka, Punjab",
  "destination": "Alwar, Rajasthan",
  "truck_type": "15 MT OPENBODY",
  "urgency": "HIGH",
  "ai_recommendation": "ACCEPT",
  "overridden": false,
  "note": ""
}
```

### Signal Types

| Signal | Logic | Confidence Adjustment |
|--------|-------|----------------------|
| **LSP Track** | Acceptance rate for this specific LSP across all past decisions | ≥70% accept rate → +2–8%. Mostly rejected → −2–10%. Past negotiations → +2% |
| **Lane Track** | Past decisions on the same origin→destination route | >50% rejection on lane → −1–3% (market historically overpriced). Acceptable → +1–3% |
| **Market Trend** | Rate trend for this truck type from last 6 decisions | Rising rates → −0% (informational warning). Stable/falling → positive signal |
| **Override Log** | Count of manual overrides by procurement officers | Each override → +0.5% (officers correct the AI — signal noted) |

### Adjusted Confidence
```
adjusted_confidence = base_confidence + sum(all signal adjustments)
                      clamped to [0.10, 0.99]
```

### Hybrid Storage
- **Server-side:** `api/data/feedback.json` — primary, persists across sessions
- **Client-side:** Browser localStorage — immediate write on confirmation; used as fallback if backend is unavailable

---

## External Integrations

### Rate Prediction API (LoRRI)
**File:** [api/app/services/rate_prediction.py](api/app/services/rate_prediction.py)

Provides the predicted fair market rate for a given lane and truck type. The system calls LoRRI's Rate Prediction API with origin, destination, and truck_type, and receives a predicted rate. Results are cached in-memory per (lane, date) key to avoid redundant calls. For the hackathon submission, values were retrieved from the API and stored in the project's lane data for performance.

**Fallback:** If the API is unreachable, uses `lane_avg × 0.98` from `lane_stats.json`.

### Benchmark API (LoRRI)
**File:** [api/app/services/benchmark.py](api/app/services/benchmark.py)

Provides historical benchmark statistics (avg, min, max, std_dev) for a lane. The demand index — a measure of market volatility — is derived from the benchmark data:

```
ratio = std_dev / avg_price

ratio ≥ 0.30  →  demand_index = 0.95  (very volatile)
ratio ≥ 0.20  →  demand_index = 0.85  (high volatility)
ratio ≥ 0.10  →  demand_index = 0.70  (moderate)
ratio < 0.10  →  demand_index = 0.55  (stable)
```

Higher demand_index means the market is volatile and the AI leans toward accepting a reasonable quote rather than waiting.

---

## Data Sources (JSON DB)

| Dataset | Records | Key Fields | Purpose |
|---------|---------|-----------|---------|
| `Lane Stats` | 7,000+ lane combinations | avg_price, min_price, max_price, std_dev, sample_size | Benchmark rates and demand index calculation |
| `LSP Profiles` | ~280 LSPs | win_rate, win_count, neg_gap_pct, lane_count, total_appearances | LSP reliability and negotiation profiling |
| `Scenarios` | 4+ scenarios | Full spot_request + quotes | Pre-configured test cases for demo |
| `Feedback Store` | 0–500 decisions | Decision records (generated at runtime) | Reinforcement learning signal source |

**Lane Key Format:** `"origin|destination|truck_type"` (case-insensitive lookup)

**New LSP Default Profile** (when LSP not found in database):
```
win_rate: 0.50, neg_gap_pct: 8.0, lane_familiarity: 0, is_new_lsp: true
```

---

## Key Design Decisions

**Graceful degradation at every layer**  
The system is built to never fully fail. Gemini unavailable → deterministic fallback. Backend down → localStorage. Lane data missing → national default rates. This was a deliberate architectural choice to ensure demos and production use are never blocked by a single point of failure.

**Temperature = 0 for AI decisions**  
Procurement recommendations must be reproducible. The same input should produce the same recommendation. Gemini is configured with temperature=0 to eliminate randomness from the AI's output.

**Confidence adjusted post-hoc, not in the prompt**  
Gemini produces a base confidence score. RL signals adjust this externally after the AI responds. This separation keeps the prompt clean and allows the RL layer to be updated without touching the AI prompt template.

**Scoring weights are fixed and explainable**  
Rather than using a black-box ML model to score quotes, the scoring engine uses explicit, auditable weights (Price 30%, Reliability 25%, etc.). Every score can be traced back to a formula. This makes the system explainable to procurement managers and defensible in audits.

**Modular route design**  
The `/api/analyse` endpoint is the full pipeline. The `/api/rank` and `/api/recommend` endpoints expose individual pipeline stages for testing and debugging, without requiring the full chain.

---

*Document prepared for LoRRI Hackathon — Spot Decision Agent submission.*
