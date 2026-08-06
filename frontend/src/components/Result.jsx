function Result({
  wpm,

  rawWpm,

  accuracy,

  characters,

  errors,

  history,

  bestWpm,

  testHistory,

  repeatTest,

  newTest,

  elapsedTime
}) {
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

  const totalTests = testHistory?.length || 0;

  const averageWpm = totalTests
    ? Math.round(
        testHistory.reduce(
          (sum, test) => sum + Number(test.wpm),

          0
        ) / totalTests
      )
    : 0;

  return (
    <div className="result-card">
      <h2>Test Complete 🎉</h2>

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

        <div>
          <h3>Personal Best 🏆</h3>
          <p>{bestWpm}</p>
        </div>

        <div>
          <h3>Average WPM</h3>
          <p>{averageWpm}</p>
        </div>

        <div>
          <h3>Total Tests</h3>
          <p>{totalTests}</p>
        </div>
      </div>

      <div className="graph-container">
        <h3>WPM Progress</h3>

        <svg
          width={width}

          height={height}

          className="wpm-graph"
        >
          <line
            x1="0"

            y1={height}

            x2={width}

            y2={height}

            stroke="white"
          />

          <line
            x1="0"

            y1="0"

            x2="0"

            y2={height}

            stroke="white"
          />

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
