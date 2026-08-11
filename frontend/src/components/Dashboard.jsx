import { useState } from "react";
import KeyboardHeatmap from "./KeyboardHeatmap";
import { BarChart2, Trash2, AlertTriangle } from "lucide-react";

function Dashboard({ user, liveStats, clearStats }) {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const stats = liveStats || {};
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

  const handleResetClick = () => {
    if (showConfirmReset) {
      clearStats();
      setShowConfirmReset(false);
    } else {
      setShowConfirmReset(true);
    }
  };

  const missedKeysArray = Object.entries(safeStats.globalMissedKeys)
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);

  const maxMisses = missedKeysArray.length > 0 ? missedKeysArray[0].count : 1;

  return (
    <div className="dashboard-container">
      
      {/* HEADER */}
      <div className="dashboard-header">
        <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <BarChart2 size={32} color="var(--accent-color)" />
          {user ? `${user.name}'s Analytics` : "Guest Analytics"}
        </h2>
        <p className="dashboard-subtitle">
          Your long-term performance overview across all typing sessions.
        </p>
      </div>

      {/* CAREER HIGHLIGHTS */}
<h3 className="dashboard-section-title">Career Highlights</h3>
<div className="dashboard-stats-row">
  <div className="stat-box">
    <span className="sub-label">Best Speed</span>
    <span className="sub-number accent">{safeStats.bestWpm}</span>
  </div>
  <div className="stat-box">
    <span className="sub-label">Average Speed</span>
    <span className="sub-number">{safeStats.averageWpm}</span>
  </div>
  <div className="stat-box">
    <span className="sub-label">Highest Accuracy</span>
    <span className="sub-number">{safeStats.highestAccuracy}%</span>
  </div>
  <div className="stat-box">
    <span className="sub-label">Time Typed</span>
    <span className="sub-number">{formatPracticeTime()}</span>
  </div>
</div>

{/* LIFETIME TOTALS */}
<h3 className="dashboard-section-title">Lifetime Volume</h3>
<div className="dashboard-stats-row">
  <div className="stat-box">
    <span className="sub-label">Total Tests</span>
    <span className="sub-number">{safeStats.totalTests}</span>
  </div>
  <div className="stat-box">
    <span className="sub-label">Total Words</span>
    <span className="sub-number">{safeStats.totalWords?.toLocaleString() || 0}</span>
  </div>
  <div className="stat-box">
    <span className="sub-label">Total Keystrokes</span>
    <span className="sub-number">{safeStats.totalCharacters?.toLocaleString() || 0}</span>
  </div>
</div>

      {/* MOST MISSED LETTERS */}
      <h3 className="dashboard-section-title">Most Missed Letters (All-Time)</h3>
      {missedKeysArray.length === 0 ? (
        <p className="empty-state">No mistakes tracked yet. You are typing perfectly!</p>
      ) : (
        <div className="missed-letters-layout">
          <div className="missed-letters-bars">
            {missedKeysArray.slice(0, 8).map((item) => {
              const fillPercentage = (item.count / maxMisses) * 100;
              return (
                <div key={item.key} className="error-bar-row">
                  <span className="error-key">{item.key === " " ? "SPC" : item.key}</span>
                  <div className="error-bar-bg">
                    <div className="error-bar-fill" style={{ width: `${fillPercentage}%` }}></div>
                  </div>
                  <span className="error-count">{item.count}</span>
                </div>
              );
            })}
          </div>
          <div className="missed-letters-heatmap">
            <div style={{ transform: "scale(0.85)", transformOrigin: "center" }}>
              <KeyboardHeatmap missedKeys={safeStats.globalMissedKeys} />
            </div>
          </div>
        </div>
      )}

      {/* ACTIVITY LOG TABLE */}
      <h3 className="dashboard-section-title">Recent Activity Log</h3>
      {safeStats.recentTests.length === 0 ? (
        <p className="empty-state">No tests completed yet. Complete a test to see your log!</p>
      ) : (
        <div className="table-container">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Mode</th>
                <th>WPM</th>
                <th>Raw</th>
                <th>Accuracy</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {safeStats.recentTests.map((test, index) => (
                <tr key={index}>
                  <td className="text-muted">{formatDate(test.date)}</td>
                  <td style={{ textTransform: "capitalize" }}>{test.mode}</td>
                  <td className="accent font-mono">{test.wpm}</td>
                  <td className="font-mono">{test.rawWpm || "—"}</td>
                  <td className="font-mono">{test.accuracy}%</td>
                  <td className="font-mono">{Math.round(test.time)}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* RESET BUTTON */}
      <div className="dashboard-footer">
        <button
          className={`reset-btn ${showConfirmReset ? "confirm" : ""}`}
          onClick={handleResetClick}
        >
          {showConfirmReset ? <AlertTriangle size={18} /> : <Trash2 size={18} />}
          {showConfirmReset ? "Click Again to Confirm Reset" : "Reset Statistics"}
        </button>
        {showConfirmReset && (
          <button className="cancel-btn" onClick={() => setShowConfirmReset(false)}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

export default Dashboard;