import { useState } from "react";
import KeyboardHeatmap from "./KeyboardHeatmap";

function Dashboard({ user, liveStats, clearStats }) {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  // 1. Use the live stats directly from the typing engine
  const stats = liveStats || {};

  // 2. Safe fallback defaults so it never crashes
  const safeStats = {
    totalTests: stats.totalTests || 0,
    bestWpm: stats.bestWpm || 0,
    averageWpm: stats.averageWpm || 0,
    highestAccuracy: stats.highestAccuracy || 0,
    totalWords: stats.totalWords || 0,
    totalCharacters: stats.totalCharacters || 0,
    totalPracticeSeconds: stats.totalPracticeSeconds || 0,
    recentTests: stats.recentTests || [],
    globalMissedKeys: stats.globalMissedKeys || {}
  };

  const practiceHours = Math.floor(safeStats.totalPracticeSeconds / 3600);
  const practiceMinutes = Math.floor((safeStats.totalPracticeSeconds % 3600) / 60);
  const practiceSeconds = Math.floor(safeStats.totalPracticeSeconds % 60);

  const formatPracticeTime = () => {
    if (practiceHours > 0) return `${practiceHours}h ${practiceMinutes}m`;
    return `${practiceMinutes}m ${practiceSeconds}s`;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "—";
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  // 3. Reset stats using the clearStats function passed from Home.jsx
  const handleResetClick = () => {
    if (showConfirmReset) {
      clearStats(); // 👈 Safely clears stats through the engine
      setShowConfirmReset(false);
    } else {
      setShowConfirmReset(true);
    }
  };

  // Error Heatmap Calculations
  const missedKeysArray = Object.entries(safeStats.globalMissedKeys)
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);

  const maxMisses = missedKeysArray.length > 0 ? missedKeysArray[0].count : 1;

  return (
    <div className="dashboard">
      <div className="dashboard-header" style={{ marginBottom: "20px" }}>
        <h2>📊 {user ? `${user.name}'s Analytics` : "Guest Analytics"}</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          Your long-term performance overview across all typing sessions.
        </p>
      </div>

      {/* CAREER HIGHLIGHTS */}
      <h3 style={{ marginBottom: "12px" }}>Career Highlights</h3>
      <div className="dashboard-grid" style={{ marginBottom: "30px" }}>
        <div>
          <h3>Best Speed 🏆</h3>
          <p style={{ fontSize: "28px", fontWeight: "bold", color: "var(--primary-accent)" }}>
            {safeStats.bestWpm} <span style={{ fontSize: "14px", fontWeight: "normal" }}>WPM</span>
          </p>
        </div>
        <div>
          <h3>Average Speed</h3>
          <p style={{ fontSize: "28px", fontWeight: "bold" }}>
            {safeStats.averageWpm} <span style={{ fontSize: "14px", fontWeight: "normal" }}>WPM</span>
          </p>
        </div>
        <div>
          <h3>Highest Accuracy</h3>
          <p style={{ fontSize: "28px", fontWeight: "bold" }}>
            {safeStats.highestAccuracy}%
          </p>
        </div>
        <div>
          <h3>Total Practice Time</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>
            {formatPracticeTime()}
          </p>
        </div>
      </div>

      {/* LIFETIME TOTALS */}
      <h3 style={{ marginBottom: "12px" }}>Lifetime Volume</h3>
      <div className="dashboard-grid" style={{ marginBottom: "30px" }}>
        <div>
          <h3>Total Tests</h3>
          <p>{safeStats.totalTests}</p>
        </div>
        <div>
          <h3>Total Words</h3>
          <p>{safeStats.totalWords?.toLocaleString() || 0}</p>
        </div>
        <div>
          <h3>Total Characters</h3>
          <p>{safeStats.totalCharacters?.toLocaleString() || 0}</p>
        </div>
      </div>

      {/* 🔴 GLOBAL ERROR HEATMAP */}
      <h3 style={{ marginBottom: "12px" }}>Most Missed Letters (All-Time)</h3>
      {missedKeysArray.length === 0 ? (
        <p style={{ color: "var(--text-muted)", fontStyle: "italic", marginBottom: "30px" }}>
          No mistakes tracked yet. You are typing perfectly!
        </p>
      ) : (
        <div style={{ marginBottom: "40px", display: "flex", gap: "40px", flexWrap: "wrap" }}>
          <div style={{ flex: "1", minWidth: "300px" }}>
            {missedKeysArray.slice(0, 8).map((item) => {
              const fillPercentage = (item.count / maxMisses) * 100;
              return (
                <div key={item.key} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                  <span style={{ width: "20px", fontWeight: "bold", textTransform: "uppercase", fontSize: "16px" }}>
                    {item.key === " " ? "SPC" : item.key}
                  </span>
                  <div style={{ flex: 1, background: "rgba(255, 255, 255, 0.05)", height: "14px", borderRadius: "7px", overflow: "hidden" }}>
                    <div style={{ width: `${fillPercentage}%`, background: "#ef4444", height: "100%", borderRadius: "7px" }}></div>
                  </div>
                  <span style={{ width: "90px", fontSize: "13px", color: "var(--text-muted)", textAlign: "right" }}>
                    {item.count} mistakes
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ flex: "1", minWidth: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ transform: "scale(0.8)", transformOrigin: "top center" }}>
              <KeyboardHeatmap missedKeys={safeStats.globalMissedKeys} />
            </div>
          </div>
        </div>
      )}

      {/* RECENT TEST HISTORY TABLE */}
      <h3 style={{ marginBottom: "12px" }}>Recent Activity Log</h3>
      {safeStats.recentTests.length === 0 ? (
        <p style={{ color: "var(--text-muted)", fontStyle: "italic", marginBottom: "30px" }}>
          No tests completed yet. Complete a test to see your log!
        </p>
      ) : (
        <div style={{ overflowX: "auto", marginBottom: "30px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--text-muted)", color: "var(--text-muted)" }}>
                <th style={{ padding: "8px 12px" }}>Date</th>
                <th style={{ padding: "8px 12px" }}>Mode</th>
                <th style={{ padding: "8px 12px" }}>WPM</th>
                <th style={{ padding: "8px 12px" }}>Raw WPM</th>
                <th style={{ padding: "8px 12px" }}>Accuracy</th>
                <th style={{ padding: "8px 12px" }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {safeStats.recentTests.map((test, index) => (
                <tr key={index} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                  <td style={{ padding: "10px 12px", color: "var(--text-muted)" }}>{formatDate(test.date)}</td>
                  <td style={{ padding: "10px 12px", textTransform: "capitalize", fontWeight: "bold" }}>{test.mode}</td>
                  <td style={{ padding: "10px 12px", fontWeight: "bold", color: "var(--primary-accent)" }}>{test.wpm}</td>
                  <td style={{ padding: "10px 12px" }}>{test.rawWpm || "—"}</td>
                  <td style={{ padding: "10px 12px" }}>{test.accuracy}%</td>
                  <td style={{ padding: "10px 12px" }}>{Math.round(test.time)}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* RESET BUTTON */}
      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button
          className="restart-btn"
          onClick={handleResetClick}
          style={{ background: showConfirmReset ? "#ef4444" : "var(--card-bg)", border: "1px solid var(--text-muted)", color: showConfirmReset ? "#fff" : "var(--text-main)" }}
        >
          {showConfirmReset ? "⚠️ Click Again to Confirm Reset" : "🗑️ Reset Statistics"}
        </button>
        {showConfirmReset && (
          <button className="restart-btn" onClick={() => setShowConfirmReset(false)} style={{ background: "transparent", border: "none", color: "var(--text-muted)" }}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

export default Dashboard;