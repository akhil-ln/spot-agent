import React from "react";
// Screen4 — Recommendation + Results (stub — will be built next)
const Screen4 = ({ recommendation, onRerun, onBack }) => (
  <div style={{ padding: "40px 24px", textAlign: "center", color: "#64748B" }}>
    <p>Screen 4 — Recommendation ({recommendation?.recommendation}) (coming soon)</p>
    <button onClick={onBack} style={{ marginRight: 8 }}>← Back</button>
    <button onClick={onRerun}>Re-run</button>
  </div>
);
export default Screen4;
