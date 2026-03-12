import React, { useState } from "react";
import Topbar from "./components/Topbar";
import StepBar from "./components/StepBar";
import Screen1 from "./screens/Screen1";
import Screen2 from "./screens/Screen2";
import Screen3 from "./screens/Screen3";
import Screen4 from "./screens/Screen4";
import {
  MOCK_SPOT_REQUEST,
  MOCK_RAW_QUOTES,
  MOCK_ENRICHED_QUOTES,
  MOCK_RECOMMENDATION,
  MOCK_LANE_CONTEXT,
} from "./data/mockData";

const PAGE_BG = "#F0F4F8";

const App = () => {
  // ── Current step in the linear flow (1 → 4) ────────────────────────────────
  const [step, setStep] = useState(1);

  // ── Data passed down through screens ───────────────────────────────────────
  const [spotRequest] = useState(MOCK_SPOT_REQUEST);
  const [rawQuotes] = useState(MOCK_RAW_QUOTES);

  // Populated after Screen 3 (AI analysis) completes
  const [enrichedQuotes, setEnrichedQuotes] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [laneContext, setLaneContext] = useState(null);

  // ── Navigation helpers ──────────────────────────────────────────────────────
  const goToStep = (n) => setStep(n);

  // Called by Screen3 once analysis (real or mock) finishes
  const onAnalysisComplete = ({ ranked_quotes, recommendation: rec, lane_context }) => {
    setEnrichedQuotes(ranked_quotes ?? MOCK_ENRICHED_QUOTES);
    setRecommendation(rec ?? MOCK_RECOMMENDATION);
    setLaneContext(lane_context ?? MOCK_LANE_CONTEXT);
    setStep(4);
  };

  // ── Render the correct screen ───────────────────────────────────────────────
  const renderScreen = () => {
    switch (step) {
      case 1:
        return (
          <Screen1
            spotRequest={spotRequest}
            onNext={() => goToStep(2)}
          />
        );
      case 2:
        return (
          <Screen2
            spotRequest={spotRequest}
            rawQuotes={rawQuotes}
            onNext={() => goToStep(3)}
            onBack={() => goToStep(1)}
          />
        );
      case 3:
        return (
          <Screen3
            spotRequest={spotRequest}
            rawQuotes={rawQuotes}
            onComplete={onAnalysisComplete}
          />
        );
      case 4:
        return (
          <Screen4
            spotRequest={spotRequest}
            enrichedQuotes={enrichedQuotes ?? MOCK_ENRICHED_QUOTES}
            recommendation={recommendation ?? MOCK_RECOMMENDATION}
            laneContext={laneContext ?? MOCK_LANE_CONTEXT}
            onRerun={() => goToStep(3)}
            onBack={() => goToStep(2)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        background: PAGE_BG,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Topbar currentStep={step} />
      <StepBar currentStep={step} />

      {/* Main content area */}
      <div style={{ flex: 1 }}>
        {renderScreen()}
      </div>
    </div>
  );
};

export default App;