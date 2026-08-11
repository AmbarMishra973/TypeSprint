import React, { useMemo, useState } from "react";
import "../styles/profile.css";

export default function Profile({ user, stats }) {
  const [activeTab, setActiveTab] = useState("speed");

  // --- 1. CALCULATE ALL-TIME STATS ---
  const allTime = {
    time: formatTime(stats?.totalPracticeSeconds || 0),
    lessons: stats?.totalTests || 0,
    topSpeed: stats?.bestWpm || 0,
    avgSpeed: stats?.averageWpm || 0,
    topAccuracy: stats?.highestAccuracy || 0,
    avgAccuracy: calculateAverageAccuracy(stats?.recentTests),
  };

  // --- 2. CALCULATE TODAY'S STATS ---
  const todaysStats = useMemo(() => {
    if (!stats?.recentTests) return null;
    const todayStr = new Date().toDateString();
    const todaysTests = stats.recentTests.filter(
      (t) => new Date(t.date).toDateString() === todayStr
    );

    const totalSeconds = todaysTests.reduce((sum, t) => sum + (t.time || 0), 0);
    const topWpm = Math.max(0, ...todaysTests.map((t) => t.wpm));
    const avgWpm = todaysTests.length 
      ? Math.round(todaysTests.reduce((sum, t) => sum + t.wpm, 0) / todaysTests.length) 
      : 0;
    const topAcc = Math.max(0, ...todaysTests.map((t) => t.accuracy));
    const avgAcc = todaysTests.length 
      ? Math.round(todaysTests.reduce((sum, t) => sum + t.accuracy, 0) / todaysTests.length) 
      : 0;

    return {
      time: formatTime(totalSeconds),
      lessons: todaysTests.length,
      topSpeed: topWpm,
      avgSpeed: avgWpm,
      topAccuracy: topAcc,
      avgAccuracy: avgAcc,
    };
  }, [stats]);

  // --- 3. GENERATE PRACTICE CALENDAR (Last 30 Days) ---
  const calendarDays = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toDateString();
      
      // Count tests done on this specific day
      const testsThisDay = (stats?.recentTests || []).filter(
        (t) => new Date(t.date).toDateString() === dateStr
      ).length;

      days.push({ date: d, count: testsThisDay });
    }
    return days;
  }, [stats]);

  // --- HELPER FUNCTIONS ---
  function formatTime(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
    const s = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  function calculateAverageAccuracy(tests) {
    if (!tests || tests.length === 0) return 0;
    const sum = tests.reduce((acc, t) => acc + (t.accuracy || 0), 0);
    return Math.round(sum / tests.length);
  }

  // Determine heatmap color intensity
  const getHeatmapColor = (count) => {
    if (count === 0) return "var(--bg-secondary, #eee)";
    if (count < 3) return "#9be9a8";
    if (count < 10) return "#40c463";
    if (count < 20) return "#30a14e";
    return "#216e39"; // Heavy practice
  };

  return (
    <div className="full-profile-container">
      <header className="profile-header">
        <h1>{user?.name || "Guest"}'s Profile</h1>
        <div className="xp-badge">Level {Math.floor((user?.xp || 0) / 100) + 1}</div>
      </header>

      {/* --- ALL TIME STATS --- */}
      <section className="stats-section">
        <h2>All-Time Statistics</h2>
        <div className="stats-grid">
          <StatCard label="Time" value={allTime.time} />
          <StatCard label="Lessons" value={allTime.lessons} />
          <StatCard label="Top speed" value={`${allTime.topSpeed} wpm`} />
          <StatCard label="Average speed" value={`${allTime.avgSpeed} wpm`} />
          <StatCard label="Top accuracy" value={`${allTime.topAccuracy}%`} />
          <StatCard label="Average accuracy" value={`${allTime.avgAccuracy}%`} />
        </div>
      </section>

      {/* --- TODAY'S STATS --- */}
      <section className="stats-section">
        <h2>Statistics for Today</h2>
        <div className="stats-grid">
          <StatCard label="Time" value={todaysStats?.lessons > 0 ? todaysStats.time : "00:00:00"} />
          <StatCard label="Lessons" value={todaysStats?.lessons || 0} />
          <StatCard label="Top speed" value={todaysStats?.lessons > 0 ? `${todaysStats.topSpeed} wpm` : "N/A"} />
          <StatCard label="Average speed" value={todaysStats?.lessons > 0 ? `${todaysStats.avgSpeed} wpm` : "N/A"} />
          <StatCard label="Top accuracy" value={todaysStats?.lessons > 0 ? `${todaysStats.topAccuracy}%` : "N/A"} />
          <StatCard label="Average accuracy" value={todaysStats?.lessons > 0 ? `${todaysStats.avgAccuracy}%` : "N/A"} />
        </div>
      </section>

      {/* --- ACCURACY STREAKS & CALENDAR ROW --- */}
      <div className="profile-row">
        <section className="stats-section flex-1">
          <h2>Accuracy Streaks</h2>
          <div className="streak-box">
            <p><strong>Accuracy threshold: 100%</strong></p>
            <p className="text-muted">Maintain 100% accuracy across consecutive tests to build your streak.</p>
            {/* Placeholder for streak logic */}
            <p style={{ marginTop: "15px" }}>Current longest streak: <strong>3 Lessons</strong></p>
          </div>
        </section>

        <section className="stats-section flex-1">
          <h2>Practice Calendar (Last 30 Days)</h2>
          <div className="heatmap-container">
            {calendarDays.map((day, idx) => (
              <div 
                key={idx} 
                className="heatmap-box" 
                style={{ backgroundColor: getHeatmapColor(day.count) }}
                title={`${day.date.toDateString()}: ${day.count} tests`}
              ></div>
            ))}
          </div>
          <p className="text-muted text-sm" style={{ marginTop: "10px", textAlign: "right" }}>
            Less <span className="legend-box" style={{ background: "#eee" }}></span>
            <span className="legend-box" style={{ background: "#9be9a8" }}></span>
            <span className="legend-box" style={{ background: "#40c463" }}></span>
            <span className="legend-box" style={{ background: "#30a14e" }}></span>
            <span className="legend-box" style={{ background: "#216e39" }}></span> More
          </p>
        </section>
      </div>

      {/* --- RELATIVE STATS & MULTIPLAYER --- */}
      <section className="stats-section">
        <div className="tabs">
          <button className={activeTab === "speed" ? "active" : ""} onClick={() => setActiveTab("speed")}>Relative Typing Speed</button>
          <button className={activeTab === "accuracy" ? "active" : ""} onClick={() => setActiveTab("accuracy")}>Relative Accuracy</button>
          <button className={activeTab === "multiplayer" ? "active" : ""} onClick={() => setActiveTab("multiplayer")}>Multiplayer Stats</button>
        </div>

        <div className="tab-content">
          {activeTab === "speed" && (
            <div className="relative-stats">
              <p>This is a histogram of the typing speeds of all users, and your position in relation to them.</p>
              <h3>Your all-time average speed beats <strong>{Math.min(99, Math.round(allTime.avgSpeed * 1.2))}%</strong> of all other people.</h3>
              {/* Replace this div with a Recharts Histogram later if desired */}
              <div className="placeholder-chart">Chart Placeholder</div>
            </div>
          )}
          {activeTab === "accuracy" && (
            <div className="relative-stats">
              <p>Compare your precision against the global player base.</p>
              <h3>Your accuracy beats <strong>{Math.min(99, Math.round(allTime.avgAccuracy * 1.05))}%</strong> of all other people.</h3>
              <div className="placeholder-chart">Chart Placeholder</div>
            </div>
          )}
          {activeTab === "multiplayer" && (
            <div className="relative-stats">
              <p>Your competitive history and win rates.</p>
              {/* Drop your Multiplayer stats UI here */}
              <div className="multiplayer-placeholder">
                <p>Wins: {user?.wins || 0}</p>
                <p>Losses: {user?.losses || 0}</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// Mini component for the stat boxes
function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}:</span>
      <span className="stat-value">{value}</span>
    </div>
  );
}