import React from "react";
// Screen2 — Raw LSP Quotes (stub — will be built next)
const Screen2 = ({ onNext, onBack }) => (
  <div style={{ padding: "40px 24px", textAlign: "center", color: "#64748B" }}>
    <p>Screen 2 — Raw LSP Quotes (coming soon)</p>
    <button onClick={onBack} style={{ marginRight: 8 }}>← Back</button>
    <button onClick={onNext}>Run AI Analysis →</button>
  </div>
);
export default Screen2;
