import React, { useState, useEffect } from "react";
import { getLeaderboard } from "../services/api";

export default function Leaderboard() {
  const [mode, setMode] = useState("time");
  const [timeLimit, setTimeLimit] = useState(30);
  const [wordLimit, setWordLimit] = useState(25);
  const [punctuation, setPunctuation] = useState(false);
  const [numbers, setNumbers] = useState(false);
  
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchScores() {
      setLoading(true);
      const data = await getLeaderboard({
        mode,
        timeLimit: mode === "time" ? timeLimit : null,
        wordLimit: mode === "words" ? wordLimit : null,
        punctuation,
        numbers,
      });
      setLeaders(data || []);
      setLoading(false);
    }
    fetchScores();
  }, [mode, timeLimit, wordLimit, punctuation, numbers]);

  return (
    <div style={styles.container}>
      {/* 🚀 Built-in CSS for smooth hover animations */}
      <style>{`
        .lb-btn {
          padding: 8px 20px;
          border-radius: 8px;
          border: 2px solid transparent;
          background: rgba(0, 0, 0, 0.05);
          color: var(--text-main, #333);
          cursor: pointer;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.2s ease;
        }
        .lb-btn:hover {
          transform: translateY(-2px);
          background: rgba(0, 0, 0, 0.1);
        }
        .lb-btn.active {
          background: #fbbf24;
          color: #1a1a1a;
          box-shadow: 0 4px 10px rgba(251, 191, 36, 0.4);
        }
        .lb-sub-btn {
          padding: 6px 14px;
          border-radius: 6px;
          border: 2px solid rgba(0, 0, 0, 0.1);
          background: transparent;
          color: var(--text-muted, #666);
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .lb-sub-btn:hover {
          border-color: rgba(0, 0, 0, 0.3);
          color: var(--text-main, #333);
        }
        .lb-sub-btn.active {
          border-color: #fbbf24;
          color: #d97706;
          background: rgba(251, 191, 36, 0.1);
        }
        .lb-card {
          transition: transform 0.2s ease;
        }
        .lb-card:hover {
          transform: scale(1.02);
          background: rgba(0, 0, 0, 0.03);
        }
      `}</style>

      <h2 style={styles.header}>🏆 Global Leaderboard</h2>

      {/* Main Mode Filters */}
      <div style={styles.filterRow}>
        {["time", "words", "quote"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`lb-btn ${mode === m ? "active" : ""}`}
            style={{ textTransform: 'capitalize' }}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Sub-Filters (Time Limits / Word Limits) & Modifiers */}
      <div style={{ ...styles.filterRow, marginBottom: '40px' }}>
        {mode === "time" && [15, 30, 60, 120].map((t) => (
          <button
            key={t}
            onClick={() => setTimeLimit(t)}
            className={`lb-sub-btn ${timeLimit === t ? "active" : ""}`}
          >
            {t}s
          </button>
        ))}

        {mode === "words" && [10, 25, 50, 100].map((w) => (
          <button
            key={w}
            onClick={() => setWordLimit(w)}
            className={`lb-sub-btn ${wordLimit === w ? "active" : ""}`}
          >
            {w} words
          </button>
        ))}

        <div style={{ borderLeft: '2px solid rgba(0,0,0,0.1)', height: '24px', margin: '0 10px' }}></div>

        <button
          onClick={() => setPunctuation(!punctuation)}
          className={`lb-sub-btn ${punctuation ? "active" : ""}`}
        >
          @ punctuation
        </button>
        <button
          onClick={() => setNumbers(!numbers)}
          className={`lb-sub-btn ${numbers ? "active" : ""}`}
        >
          # numbers
        </button>
      </div>

      {/* Rankings List */}
      <div style={styles.listContainer}>
        {loading ? (
          <div style={styles.emptyState}>Loading rankings... ⏳</div>
        ) : leaders.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}>👻</span>
            No scores recorded for this exact mode yet.<br/>
            <strong>Be the first to claim the #1 spot!</strong>
          </div>
        ) : (
          leaders.map((score, index) => (
            <div key={score.id} className="lb-card" style={styles.leaderCard}>
              
              {/* Left Side: Rank & User Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span style={{ 
                  ...styles.rankBadge, 
                  color: index === 0 ? '#fbbf24' : index === 1 ? '#94a3b8' : index === 2 ? '#b45309' : '#666'
                }}>
                  #{index + 1}
                </span>

                <div style={styles.avatar}>
                  {score.user?.name?.charAt(0).toUpperCase() || "?"}
                </div>

                <span style={styles.username}>{score.user?.name || "Anonymous"}</span>
              </div>

              {/* Right Side: Stats */}
              <div style={styles.statsContainer}>
                <div style={{ textAlign: 'right' }}>
                  <div style={styles.wpmText}>
                    {score.wpm} <span style={{ fontSize: '0.9rem', color: '#888', fontWeight: 'normal' }}>WPM</span>
                  </div>
                  <div style={styles.accuracyText}>{score.accuracy}% accuracy</div>
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Inline Styles Object for the Layout
const styles = {
  container: {
    maxWidth: '750px',
    margin: '0 auto',
    padding: '40px 20px',
    color: 'var(--text-main, #333)',
  },
  header: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '30px',
  },
  filterRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '20px',
  },
  listContainer: {
    background: 'rgba(0,0,0,0.02)',
    border: '1px solid rgba(0,0,0,0.08)',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
  },
  emptyState: {
    padding: '60px 20px',
    textAlign: 'center',
    color: '#666',
    fontSize: '1.1rem',
  },
  leaderCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid rgba(0,0,0,0.05)',
    cursor: 'default',
  },
  rankBadge: {
    fontSize: '1.5rem',
    fontWeight: '900',
    width: '40px',
  },
  avatar: {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    background: '#e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    color: '#475569',
    border: '2px solid rgba(0,0,0,0.1)',
  },
  username: {
    fontSize: '1.2rem',
    fontWeight: '600',
  },
  statsContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  wpmText: {
    fontSize: '1.8rem',
    fontWeight: '900',
    color: '#fbbf24', // Amber/Yellow color for speed
    lineHeight: '1',
  },
  accuracyText: {
    fontSize: '0.85rem',
    color: '#888',
    marginTop: '4px',
  },
};