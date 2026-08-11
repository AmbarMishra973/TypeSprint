import React, { useState, useEffect, useRef, useMemo } from "react";
import { User, Activity, CalendarDays, Zap, Trophy, Target, Swords, BarChart2, Camera } from "lucide-react";
import "../styles/profile.css";
import { AlertTriangle, Trash2 } from "lucide-react";
import KeyboardHeatmap from "./KeyboardHeatmap"; // Make sure the path is correct
export default function Profile({ user, stats }) {
  const [activeTab, setActiveTab] = useState("speed");
const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a local preview URL for instant feedback
      const imageUrl = URL.createObjectURL(file);
      setAvatarPreview(imageUrl);}};
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

  const getHeatmapColor = (count) => {
    if (count === 0) return "var(--bg-secondary)";
    if (count < 3) return "#065f46"; 
    if (count < 10) return "#059669";
    if (count < 20) return "#10b981";
    return "#34d399"; 
  };

  // --- DASHBOARD MIGRATION STATES & HELPERS ---
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const missedKeysArray = Object.entries(stats?.globalMissedKeys || {})
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);

  const maxMisses = missedKeysArray.length > 0 ? missedKeysArray[0].count : 1;

  const formatDate = (timestamp) => {
    if (!timestamp) return "—";
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  const handleResetClick = () => {
    if (showConfirmReset) {
      if (clearStats) clearStats();
      setShowConfirmReset(false);
    } else {
      setShowConfirmReset(true);
    }
  };
  return (
    <div className="profile-container">
      
      {/* --- HEADER --- */}
      {/* --- HEADER --- */}
      <header className="profile-header">
        <div className="profile-user-info">
          
          {/* INTERACTIVE AVATAR UPLOAD */}
          <div 
            className="profile-avatar-container" 
            onClick={() => fileInputRef.current.click()}
            title="Change Profile Picture"
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="profile-avatar-img" />
            ) : (
              <div className="profile-avatar">
                <User size={40} color="var(--accent-color)" />
              </div>
            )}
            <div className="avatar-overlay">
              <Camera size={24} color="#fff" />
            </div>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              style={{ display: "none" }} 
              onChange={handleImageChange} 
            />
          </div>

          <h1>{user?.name || "Guest"}'s Profile</h1>
        </div>
        <div className="profile-level-badge">
          <Trophy size={18} /> Level {Math.floor((user?.xp || 0) / 100) + 1}
        </div>
      </header>

      {/* --- ALL TIME STATS --- */}
      <section className="profile-section">
        <h2 className="section-title"><Activity size={20}/> All-Time Statistics</h2>
        <div className="profile-stats-grid">
          <StatCard label="Time" value={allTime.time} />
          <StatCard label="Lessons" value={allTime.lessons} />
          <StatCard label="Top Speed" value={`${allTime.topSpeed} wpm`} />
          <StatCard label="Average Speed" value={`${allTime.avgSpeed} wpm`} />
          <StatCard label="Top Accuracy" value={`${allTime.topAccuracy}%`} />
          <StatCard label="Avg Accuracy" value={`${allTime.avgAccuracy}%`} />
        </div>
      </section>

      {/* --- TODAY'S STATS --- */}
      <section className="profile-section">
        <h2 className="section-title"><CalendarDays size={20}/> Statistics for Today</h2>
        <div className="profile-stats-grid">
          <StatCard label="Time" value={todaysStats?.lessons > 0 ? todaysStats.time : "00:00:00"} />
          <StatCard label="Lessons" value={todaysStats?.lessons || 0} />
          <StatCard label="Top Speed" value={todaysStats?.lessons > 0 ? `${todaysStats.topSpeed} wpm` : "—"} />
          <StatCard label="Average Speed" value={todaysStats?.lessons > 0 ? `${todaysStats.avgSpeed} wpm` : "—"} />
          <StatCard label="Top Accuracy" value={todaysStats?.lessons > 0 ? `${todaysStats.topAccuracy}%` : "—"} />
          <StatCard label="Avg Accuracy" value={todaysStats?.lessons > 0 ? `${todaysStats.avgAccuracy}%` : "—"} />
        </div>
      </section>

      {/* --- STREAKS & CALENDAR --- */}
      <div className="profile-split-row">
        
        <section className="profile-section flex-half">
          <h2 className="section-title"><Zap size={20}/> Accuracy Streaks</h2>
          <div className="streak-card">
            <div className="streak-info">
              <span className="streak-label">Accuracy threshold:</span>
              <span className="streak-value">100%</span>
            </div>
            <p className="streak-desc">Maintain 100% accuracy across consecutive tests to build your streak.</p>
            <div className="streak-info" style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
              <span className="streak-label">Current longest streak:</span>
              <span className="streak-value accent">3 Lessons</span>
            </div>
          </div>
        </section>

        <section className="profile-section flex-half">
          <h2 className="section-title"><Target size={20}/> Practice Calendar (30 Days)</h2>
          <div className="calendar-card">
            <div className="heatmap-grid">
              {calendarDays.map((day, idx) => (
                <div 
                  key={idx} 
                  className="heatmap-cell" 
                  style={{ backgroundColor: getHeatmapColor(day.count) }}
                  title={`${day.date.toDateString()}: ${day.count} tests`}
                ></div>
              ))}
            </div>
            <div className="heatmap-legend">
              <span>Less</span>
              <div className="legend-dot" style={{ background: "var(--bg-secondary)" }}></div>
              <div className="legend-dot" style={{ background: "#065f46" }}></div>
              <div className="legend-dot" style={{ background: "#059669" }}></div>
              <div className="legend-dot" style={{ background: "#10b981" }}></div>
              <div className="legend-dot" style={{ background: "#34d399" }}></div>
              <span>More</span>
            </div>
          </div>
        </section>
        
      </div>

      {/* --- RELATIVE STATS & MULTIPLAYER --- */}
      <section className="profile-section">
        <div className="profile-tabs">
          <button className={`tab-btn ${activeTab === "speed" ? "active" : ""}`} onClick={() => setActiveTab("speed")}>
            <BarChart2 size={16}/> Relative Speed
          </button>
          <button className={`tab-btn ${activeTab === "accuracy" ? "active" : ""}`} onClick={() => setActiveTab("accuracy")}>
            <Target size={16}/> Relative Accuracy
          </button>
          <button className={`tab-btn ${activeTab === "multiplayer" ? "active" : ""}`} onClick={() => setActiveTab("multiplayer")}>
            <Swords size={16}/> Multiplayer
          </button>
        </div>

        <div className="tab-content-card">
          {activeTab === "speed" && (
            <div className="tab-pane">
              <h3 className="pane-headline">
                Your all-time average speed beats <strong className="accent-text">{Math.min(99, Math.round(allTime.avgSpeed * 1.2))}%</strong> of users.
              </h3>
              <p className="pane-desc">This is a histogram of the typing speeds of all users, and your position in relation to them.</p>
              <div className="placeholder-chart">Chart Area</div>
            </div>
          )}
          {activeTab === "accuracy" && (
            <div className="tab-pane">
              <h3 className="pane-headline">
                Your accuracy beats <strong className="accent-text">{Math.min(99, Math.round(allTime.avgAccuracy * 1.05))}%</strong> of users.
              </h3>
              <p className="pane-desc">Compare your precision against the global player base.</p>
              <div className="placeholder-chart">Chart Area</div>
            </div>
          )}
          {activeTab === "multiplayer" && (
            <div className="tab-pane">
              <h3 className="pane-headline">Competitive History</h3>
              <div className="multiplayer-stats">
                <div className="mp-stat">
                  <span className="mp-label">Wins</span>
                  <span className="mp-value win">{user?.wins || 0}</span>
                </div>
                <div className="mp-stat">
                  <span className="mp-label">Losses</span>
                  <span className="mp-value loss">{user?.losses || 0}</span>
                </div>
              </div>
            </div>
          )}
          {/* =========================================
          MIGRATED DASHBOARD FEATURES
          ========================================= */}
      
      {/* Sleek Divider to separate Profile from Analytics */}
      <hr style={{ 
        border: 'none', 
        borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
        margin: '80px 0 60px 0' 
      }} />

      {/* 1. MOST MISSED LETTERS */}
      <section className="profile-section" style={{ marginBottom: '60px' }}>
        <h2 className="section-title">Most Missed Letters (All-Time)</h2>
        <div className="tab-content-card" style={{ padding: '40px' }}>
          {missedKeysArray.length === 0 ? (
            <p className="pane-desc" style={{ fontStyle: 'italic', marginBottom: 0 }}>No mistakes tracked yet. You are typing perfectly!</p>
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
                  <KeyboardHeatmap missedKeys={stats?.globalMissedKeys || {}} />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. RECENT ACTIVITY LOG */}
      <section className="profile-section" style={{ marginBottom: '80px' }}>
        <h2 className="section-title">Recent Activity Log</h2>
        <div className="tab-content-card" style={{ padding: '0', overflow: 'hidden' }}>
          {(!stats?.recentTests || stats.recentTests.length === 0) ? (
            <p className="pane-desc" style={{ fontStyle: 'italic', padding: '40px', marginBottom: 0 }}>No tests completed yet. Complete a test to see your log!</p>
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
                  {stats.recentTests.map((test, index) => (
                    <tr key={index}>
                      <td style={{ color: 'var(--text-muted)' }}>{formatDate(test.date)}</td>
                      <td style={{ textTransform: "capitalize" }}>{test.mode}</td>
                      <td style={{ color: 'var(--accent-color)', fontWeight: 'bold', fontFamily: 'var(--font-typing, monospace)' }}>{test.wpm}</td>
                      <td style={{ fontFamily: 'var(--font-typing, monospace)' }}>{test.rawWpm || "—"}</td>
                      <td style={{ fontFamily: 'var(--font-typing, monospace)' }}>{test.accuracy}%</td>
                      <td style={{ fontFamily: 'var(--font-typing, monospace)' }}>{Math.round(test.time)}s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* 3. RESET STATISTICS BUTTON */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '60px', gap: '15px' }}>
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
      </section>
    </div>
  );
}

// Mini component for the stat boxes
function StatCard({ label, value }) {
  return (
    <div className="profile-stat-box">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  );
}