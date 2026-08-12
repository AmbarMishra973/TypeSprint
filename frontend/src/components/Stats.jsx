import React from "react";

function Stats({ wpm, rawWpm, accuracy, characters, errors }) {
  return (
    <div
      className="live-stats-container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "40px",
        width: "100%",
        marginBottom: "20px",
      }}
    >
      <div className="live-stat-item">
        <span className="live-label">wpm</span>
        <span className="live-value">{wpm}</span>
      </div>

      <div className="live-stat-item">
        <span className="live-label">acc</span>
        <span className="live-value">{accuracy}%</span>
      </div>

      <div className="live-stat-item">
        <span className="live-label">raw</span>
        <span className="live-value">{rawWpm}</span>
      </div>

      <div className="live-stat-item">
        <span className="live-label">err</span>
        <span className="live-value">{errors}</span>
      </div>
    </div>
  );
}

export default Stats;