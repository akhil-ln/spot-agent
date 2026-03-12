import React from "react";

const COLORS = {
  navy: "#0D1B2A",
  navyLight: "#162032",
  accent: "#1E90FF",
  border: "#1E3A5F",
  textPrimary: "#FFFFFF",
  textSecondary: "#94A3B8",
  success: "#22C55E",
};

const STEPS = [
  { number: 1, label: "Spot Request" },
  { number: 2, label: "LSP Quotes" },
  { number: 3, label: "AI Analysis" },
  { number: 4, label: "Recommendation" },
];

const StepBar = ({ currentStep }) => {
  return (
    <div
      style={{
        background: COLORS.navyLight,
        borderBottom: `1px solid ${COLORS.border}`,
        padding: "0 32px",
        height: "44px",
        display: "flex",
        alignItems: "center",
        gap: 0,
      }}
    >
      {STEPS.map((step, idx) => {
        const isCompleted = currentStep > step.number;
        const isActive = currentStep === step.number;
        const isLast = idx === STEPS.length - 1;

        return (
          <React.Fragment key={step.number}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "0 16px 0 0",
              }}
            >
              {/* Circle */}
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 700,
                  background: isCompleted
                    ? COLORS.success
                    : isActive
                    ? COLORS.accent
                    : "transparent",
                  border: isCompleted
                    ? `2px solid ${COLORS.success}`
                    : isActive
                    ? `2px solid ${COLORS.accent}`
                    : `2px solid ${COLORS.border}`,
                  color: isCompleted || isActive ? "#fff" : COLORS.textSecondary,
                  transition: "all 0.3s ease",
                  flexShrink: 0,
                }}
              >
                {isCompleted ? "✓" : step.number}
              </div>

              {/* Label */}
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: isActive ? 600 : 400,
                  color: isCompleted
                    ? COLORS.success
                    : isActive
                    ? COLORS.textPrimary
                    : COLORS.textSecondary,
                  whiteSpace: "nowrap",
                  transition: "color 0.3s ease",
                }}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: isCompleted ? COLORS.success : COLORS.border,
                  margin: "0 12px",
                  transition: "background 0.3s ease",
                  minWidth: "32px",
                  maxWidth: "80px",
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepBar;
