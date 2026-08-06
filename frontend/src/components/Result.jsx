import { useState } from "react";
import KeyboardHeatmap from "./KeyboardHeatmap";
import TestReplay from "./TestReplay";

function Result({
  wpm,
  rawWpm,
  accuracy,
  characters,
  errors,
  history,
  repeatTest,
  newTest,
  elapsedTime,
  missedKeys = {},
  wordTimes = [],
  keystrokeLog = [], 
  words = []
}) {
  const [showReplay, setShowReplay] = useState(false);
  const safeHistory = history?.length ? history : [];

  const maxWpm = Math.max(
    ...safeHistory.map((item) => Number(item.wpm)),
    50
  );

  const width = 500;
  const height = 200;

  const points = safeHistory
    .map((point, index) => {
      const x = (index / Math.max(safeHistory.length - 1, 1)) * width;
      const y = height - (Number(point.wpm) / maxWpm) * height;
      return `${x},${y}`;
    })
    .join(" ");

  const slowestWords = [...wordTimes]
    .sort((a, b) => b.time - a.time)
    .slice(0, 3);

  return (
    <div className="result-card">
      <h2>Test Complete 🎉</h2>

      {/* 🚀 ONLY SINGLE-RUN METRICS DISPLAYED HERE */}
      <div className="result-stats">
        <div>
          <h3>WPM</h3>
          <p>{wpm}</p>
        </div>

        <div>
          <h3>Raw WPM</h3>
          <p>{rawWpm}</p>
        </div>

        <div>
          <h3>Accuracy</h3>
          <p>{accuracy}%</p>
        </div>

        <div>
          <h3>Characters</h3>
          <p>{characters}</p>
        </div>

        <div>
          <h3>Errors</h3>
          <p>{errors}</p>
        </div>

        <div>
          <h3>Time Taken</h3>
          <p>{elapsedTime}s</p>
        </div>
      </div>

      <div className="graph-container">
        <h3>WPM Progress (This Test)</h3>

        <svg width={width} height={height} className="wpm-graph">
          <line x1="0" y1={height} x2={width} y2={height} stroke="white" />
          <line x1="0" y1="0" x2="0" y2={height} stroke="white" />

          {safeHistory.length > 1 && (
            <polyline
              points={points}
              fill="none"
              stroke="#39d353"
              strokeWidth="4"
            />
          )}

          {safeHistory.map((point, index) => {
            const x = (index / Math.max(safeHistory.length - 1, 1)) * width;
            const y = height - (Number(point.wpm) / maxWpm) * height;

            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="5"
                fill="#39d353"
              >
                <title>
                  {point.wpm} WPM at {point.time}s
                </title>
              </circle>
            );
          })}
        </svg>

        <div className="x-axis">Time (seconds)</div>
      </div>

      {Object.keys(missedKeys).length > 0 && (
        <KeyboardHeatmap missedKeys={missedKeys} />
      )}

      {slowestWords.length > 0 && (
        <div className="slowest-words-container">
          <h3>Slowest Words 🐢</h3>
          <div className="slow-words-list">
            {slowestWords.map((item, index) => (
              <div key={index} className="slow-word-card">
                <span className="slow-word-text">{item.word}</span>
                <span className="slow-word-time">{item.time.toFixed(2)}s</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="result-buttons" style={{ marginTop: '30px' }}>
        <button
          onClick={() => setShowReplay(true)}
          className="restart-btn"
          style={{ background: '#7c3aed' }}
        >
          🎥 Watch Replay
        </button>
      </div>

      {showReplay && (
        <TestReplay 
          words={words} 
          keystrokeLog={keystrokeLog} 
          onClose={() => setShowReplay(false)} 
        />
      )}

      <div className="result-buttons">
        <button
          onClick={repeatTest}
          className="restart-btn"
        >
          🔁 Restart Test
        </button>

        <button
          onClick={newTest}
          className="restart-btn"
        >
          🆕 New Test
        </button>
      </div>
    </div>
  );
}

export default Result;