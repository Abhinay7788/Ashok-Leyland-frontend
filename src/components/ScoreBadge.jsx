// src/components/ScoreBadge.jsx
import React from "react";

export default function ScoreBadge({ score }) {
  const color =
    score >= 75 ? "green" : score >= 50 ? "orange" : "red";

  return (
    <span style={{
      padding: "4px 10px",
      borderRadius: "8px",
      color: "white",
      backgroundColor: color,
    }}>
      {score || 0}
    </span>
  );
}