import React, { useState, useEffect, useRef, useMemo } from "react";
import { User, Activity, CalendarDays, Zap, Trophy, Target, Swords, BarChart2, Camera, AlertTriangle, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import "../styles/profile.css";
import PracticeCalendar from './PracticeCalendar';
import RelativeHistogram from './RelativeHistogram';
import KeyboardHeatmap from "./KeyboardHeatmap";

export default function Profile({ user, stats }) {
  const [activeTab, setActiveTab] = useState("speed");

  // --- AVATAR STATE ---
  const [avatarPreview, setAvatarPreview] = useState(
    () => localStorage.getItem(`avatar_${user?.name}`) || user?.avatar || null
  );
  const [isAvatarFullscreen, setIsAvatarFullscreen] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        setAvatarPreview(base64String);
        
        localStorage.setItem(`avatar_${user.name}`, base64String);

        try {
          await fetch(`https://ambarmishradb.onrender.com/api/users/update-avatar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: user.name, avatar: base64String })
          });
        } catch (err) {
          console.error("Failed to sync avatar to backend:", err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

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

  // --- 3. PROFESSIONAL MONTH CALENDAR STATE & NAVIGATION ---
  const [calendarDate, setCalendarDate] = useState(new Date());

  const handlePrevMonth = () => {
    setCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const currentMonthData = useMemo(() => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth(); // 0-indexed
    
    const firstDayIndex = new Date(year, month, 1).getDay(); 
    const adjustedFirstDay = (firstDayIndex === 0 ? 6 : firstDayIndex - 1); 
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push({ empty: true });
    }

    for (let dayNum = 1; dayNum <= totalDaysInMonth; dayNum++) {
      const d = new Date(year, month, dayNum);
      const dateStr = d.toDateString();
      
      const testsThisDay = (stats?.recentTests || []).filter(
        (t) => new Date(t.date).toDateString() === dateStr
      ).length;

      days.push({ 
        empty: false, 
        dayNum, 
        date: d, 
        count: testsThisDay,
        hasPracticed: testsThisDay > 0 
      });
    }

    // Format Month name (e.g., "August 2026")
    const monthName = calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    return {
      monthTitle: monthName,
      days
    };
  }, [calendarDate, stats]);

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
      <header className="profile-header">
        <div className="profile-user-info">
          <div className="profile-avatar-wrapper" style={{ position: 'relative' }}>
            <div 
              className="profile-avatar-container" 
              onClick={() => avatarPreview && setIsAvatarFullscreen(true)}
              title={avatarPreview ? "View Profile Picture" : "No Picture"}
              style={{ cursor: avatarPreview ? "pointer" : "default", display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="profile-avatar-img" />
              ) : (
                <User size={40} color="var(--accent-color)" />
              )}
            </div>

            <button onClick={() => fileInputRef.current.click()} className="avatar-upload-btn" title="Upload New Picture">
              <Camera size={16} color="#fff" />
            </button>

            <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleImageChange} />
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

      {/* --- PROFESSIONAL PRACTICE CALENDAR WITH ARROWS --- */}
      <section className="profile-section">
        <h2 className="section-title"><Target size={20}/> Practice Calendar</h2>
        <div className="calendar-card" style={{ background: 'var(--bg-secondary)', padding: '25px', borderRadius: '16px', maxWidth: '380px', margin: '0 auto', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
          
          {/* Header with Nav Arrows */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
            <button 
              onClick={handlePrevMonth} 
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
              title="Previous Month"
            >
              <ChevronLeft size={20} />
            </button>
            <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
              {currentMonthData.monthTitle}
            </span>
            <button 
              onClick={handleNextMonth} 
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
              title="Next Month"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>This calendar shows the dates of active learning.</p>
          
          {/* Weekday headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', fontWeight: 'bold', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '10px' }}>
            <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
          </div>

          {/* Month Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
            {currentMonthData.days.map((item, idx) => (
              item.empty ? (
                <div key={idx} />
              ) : (
                <div 
                  key={idx} 
                  title={`${item.date.toLocaleDateString()}: ${item.count} tests completed`}
                  style={{
                    aspectRatio: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    fontWeight: item.hasPracticed ? 'bold' : 'normal',
                    backgroundColor: item.hasPracticed ? 'var(--accent-color)' : 'rgba(255,255,255,0.03)',
                    color: item.hasPracticed ? '#000' : 'var(--text-primary)',
                    boxShadow: item.hasPracticed ? '0 0 10px var(--accent-color)' : 'none',
                    cursor: 'default',
                    transition: 'transform 0.1s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {item.dayNum}
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      {/* --- RELATIVE STATS & MULTIPLAYER --- */}
      <section className="profile-section" style={{ marginTop: '40px' }}>
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

        <div className="profile-tab-content-card" style={{ marginTop: '20px', background: 'var(--bg-secondary)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
          {activeTab === "speed" && (
            <div>
              <h3 style={{ marginBottom: '5px', fontSize: '1.2rem' }}>Your all-time average speed distribution</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>This is a histogram of typing speeds, with your active performance tier highlighted.</p>
              <RelativeHistogram 
                data={stats?.recentTests?.map(t => t.wpm) || []} 
                userScore={stats?.bestWpm || 0} 
                type="speed" 
              />
            </div>
          )}

          {activeTab === "accuracy" && (
            <div>
              <h3 style={{ marginBottom: '5px', fontSize: '1.2rem' }}>Your all-time average accuracy distribution</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>This is a histogram of typing accuracies, with your active performance tier highlighted.</p>
              <RelativeHistogram 
                data={stats?.recentTests?.map(t => t.accuracy) || []} 
                userScore={stats?.highestAccuracy || 100} 
                type="accuracy" 
              />
            </div>
          )}

          {activeTab === "multiplayer" && (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
              Multiplayer analytics summary and duels history records load here.
            </div>
          )}
        </div>
      </section>

      {/* Sleek Divider */}
      <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.1)', margin: '60px 0' }} />

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
      <section className="profile-section" style={{ marginBottom: '60px' }}>
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

      {/* FULLSCREEN AVATAR OVERLAY */}
      {isAvatarFullscreen && (
        <div 
          onClick={() => setIsAvatarFullscreen(false)}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, cursor: 'zoom-out', backdropFilter: 'blur(5px)'
          }}
        >
          <img 
            src={avatarPreview} 
            alt="Fullscreen Avatar" 
            style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }} 
          />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="profile-stat-box">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  );
}