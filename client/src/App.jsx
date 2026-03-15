import React, { useState, useEffect } from "react";
import Topbar from "./components/Topbar";
import Landing from "./screens/Landing";
import Screen1 from "./screens/Screen1";
import Screen2 from "./screens/Screen2";
import Screen3 from "./screens/Screen3";
import Screen4 from "./screens/Screen4";
import { getScenarios } from "./api/index";
import "./index.css";

/*
  Page flow:
    0 – Landing
    1 – Spot Enquiries List  (Screen1)
    2 – Spot Detail + Quotes (Screen2)
    3 – AI Analysis Loader   (Screen3)
    4 – Recommendation       (Screen4)
*/

export default function App() {
  const [page, setPage]                   = useState(0);
  const [scenarios, setScenarios]         = useState([]);
  const [loadingScenarios, setLoading]    = useState(true);
  const [selectedScenario, setSelected]   = useState(null);  // scenario object from /api/scenarios
  const [analysisResult, setResult]       = useState(null);  // { ranked_quotes, recommendation, lane_context }

  // Load demo scenarios from backend on mount
  useEffect(() => {
    getScenarios()
      .then(res => {
        setScenarios(res.data);
      })
      .catch(() => {
        // Fallback: load from bundled JS file if backend is unreachable
        import("./data/demo_scenarios.js").then(m => {
          const list = Array.isArray(m.default) ? m.default : Object.values(m.default);
          setScenarios(list);
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const goTo = (n) => {
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectScenario = (scenario) => {
    setSelected(scenario);
    setResult(null);
    goTo(2);
  };

  const handleAnalysisComplete = (result) => {
    setResult(result);
    goTo(4);
  };

  const handleRerun = () => {
    setResult(null);
    goTo(3);
  };

  if (page === 0) {
    return <Landing onEnter={() => goTo(1)} />;
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <Topbar
        page={page}
        selectedScenario={selectedScenario}
        onLogoClick={() => goTo(0)}
        onSpotListClick={() => goTo(1)}
      />

      <main style={{ flex: 1 }}>
        {page === 1 && (
          <Screen1
            scenarios={scenarios}
            loading={loadingScenarios}
            onSelect={handleSelectScenario}
          />
        )}
        {page === 2 && selectedScenario && (
          <Screen2
            scenario={selectedScenario}
            onRunAnalysis={() => goTo(3)}
            onBack={() => goTo(1)}
          />
        )}
        {page === 3 && selectedScenario && (
          <Screen3
            scenario={selectedScenario}
            onComplete={handleAnalysisComplete}
            onBack={() => goTo(2)}
          />
        )}
        {page === 4 && analysisResult && (
          <Screen4
            scenario={selectedScenario}
            result={analysisResult}
            onRerun={handleRerun}
            onBack={() => goTo(1)}
          />
        )}
      </main>
    </div>
  );
}
