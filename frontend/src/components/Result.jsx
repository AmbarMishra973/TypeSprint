import { useState } from "react";
import KeyboardHeatmap from "./KeyboardHeatmap";
import TestReplay from "./TestReplay";
import { RotateCcw, ChevronRight, MonitorPlay } from "lucide-react";

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

  // --- NEW GRAPH DIMENSIONS & PADDING ---
  const chartWidth = 800;
  const chartHeight = 250;
  const padLeft = 40;  // Space for Y-axis labels
  const padBottom = 30; // Space for X-axis labels
  const padTop = 20;
  const padRight = 20;

  const innerWidth = chartWidth - padLeft - padRight;
  const innerHeight = chartHeight - padTop - padBottom;

  // Max WPM rounded up to a nice clean number for the axis
  const maxWpm = Math.max(...safeHistory.map((item) => Number(item.wpm)), 50);
  const roundedMaxWpm = Math.ceil(maxWpm / 10) * 10; 

  // Helper functions to map data to pixel coordinates
  const getX = (index) => padLeft + (index / Math.max(safeHistory.length - 1, 1)) * innerWidth;
  const getY = (val) => padTop + innerHeight - (val / roundedMaxWpm) * innerHeight;

  // Generate the polyline path
  const points = safeHistory
    .map((point, index) => `${getX(index)},${getY(Number(point.wpm))}`)
    .join(" ");

  const slowestWords = [...wordTimes]
    .sort((a, b) => b.time - a.time)
    .slice(0, 3);

  return (
    <div className="result-screen">
      
      {/* 1. HERO STATS (Massive WPM & Accuracy) */}
      <div className="hero-stats">
        <div className="hero-stat-group">
          <span className="hero-label">wpm</span>
          <span className="hero-number">{wpm}</span>
        </div>
        <div className="hero-stat-group">
          <span className="hero-label">acc</span>
          <span className="hero-number">{accuracy}%</span>
        </div>
      </div>

      {/* 2. SECONDARY STATS */}
      <div className="sub-stats">
        <div className="sub-stat-group">
          <span className="sub-label">raw</span>
          <span className="sub-number">{rawWpm}</span>
        </div>
        <div className="sub-stat-group">
          <span className="sub-label">characters</span>
          <span className="sub-number">{characters}</span>
        </div>
        <div className="sub-stat-group">
          <span className="sub-label">errors</span>
          <span className="sub-number">{errors}</span>
        </div>
        <div className="sub-stat-group">
          <span className="sub-label">time</span>
          <span className="sub-number">{elapsedTime}s</span>
        </div>
      </div>

      {/* 3. DETAILED GRAPH WITH AXES */}
      <div className="chart-container">
        <svg 
          width="100%" 
          height={chartHeight} 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
          className="wpm-graph"
          style={{ overflow: "visible" }}
        >
          {/* Horizontal Grid Lines & Y-Axis Labels (WPM) */}
          {[0, Math.round(roundedMaxWpm / 2), roundedMaxWpm].map((val, i) => (
            <g key={`y-axis-${i}`}>
              <text 
                x={padLeft - 10} 
                y={getY(val) + 4} 
                fill="var(--text-muted, #646669)" 
                fontSize="12" 
                fontFamily="var(--font-ui, sans-serif)"
                textAnchor="end"
              >
                {val}
              </text>
              <line 
                x1={padLeft} 
                y1={getY(val)} 
                x2={chartWidth - padRight} 
                y2={getY(val)} 
                stroke="var(--text-muted, #646669)" 
                strokeOpacity="0.2" 
                strokeDasharray="4 4" 
              />
            </g>
          ))}

          {/* Solid Bottom X-Axis Line */}
          <line 
            x1={padLeft} 
            y1={chartHeight - padBottom} 
            x2={chartWidth - padRight} 
            y2={chartHeight - padBottom} 
            stroke="var(--text-muted, #646669)" 
            strokeOpacity="0.5"
            strokeWidth="2" 
          />

          {/* X-Axis Labels (Time) */}
          <text 
            x={padLeft} 
            y={chartHeight - 10} 
            fill="var(--text-muted, #646669)" 
            fontSize="12" 
            textAnchor="middle"
          >
            0s
          </text>
          <text 
            x={chartWidth - padRight} 
            y={chartHeight - 10} 
            fill="var(--text-muted, #646669)" 
            fontSize="12" 
            textAnchor="middle"
          >
            {elapsedTime}s
          </text>

          {/* The Data Line */}
          {safeHistory.length > 1 && (
            <polyline 
              points={points} 
              fill="none" 
              stroke="var(--accent-color, #e2b714)" 
              strokeWidth="3" 
              strokeLinejoin="round" 
            />
          )}

          {/* The Data Points (Hoverable Circles) */}
          {safeHistory.map((point, index) => (
            <circle 
              key={`point-${index}`} 
              cx={getX(index)} 
              cy={getY(Number(point.wpm))} 
              r="4" 
              fill="var(--bg-primary, #323437)" 
              stroke="var(--accent-color, #e2b714)" 
              strokeWidth="2"
              style={{ transition: "all 0.2s ease", cursor: "pointer" }}
            >
              <title>{point.wpm} WPM at {point.time}s</title>
            </circle>
          ))}
        </svg>
      </div>

      {/* 4. HEATMAP (Box removed via CSS) */}
      {Object.keys(missedKeys).length > 0 && (
        <KeyboardHeatmap missedKeys={missedKeys} />
      )}

      {/* 5. SLOWEST WORDS */}
      {slowestWords.length > 0 && (
        <div className="slowest-words-container">
          <h3 className="sub-label" style={{marginBottom: '15px'}}>Slowest Words</h3>
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

      {/* 6. CLEAN ICON ACTIONS */}
      <div className="result-actions">
        <button onClick={repeatTest} className="icon-btn-large" title="Repeat Test">
          <RotateCcw size={28} />
        </button>
        <button onClick={newTest} className="icon-btn-large" title="Next Test">
          <ChevronRight size={28} />
        </button>
        <button onClick={() => setShowReplay(true)} className="icon-btn-large" title="Watch Replay">
          <MonitorPlay size={28} />
        </button>
      </div>

      {showReplay && (
        <TestReplay 
          words={words} 
          keystrokeLog={keystrokeLog} 
          onClose={() => setShowReplay(false)} 
        />
      )}
    </div>
  );
}

export default Result;