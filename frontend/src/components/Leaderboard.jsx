
import React, { useEffect, useState } from "react";
import { Globe, Ghost, Trophy, Users } from "lucide-react";
import { getLeaderboard } from "../services/api";
import ZoomableAvatar from "./ZoomableAvatar";

export default function Leaderboard({ user }) {
  const [scope, setScope] = useState("global");
  const [timeRange, setTimeRange] = useState("all");

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

      // Fetch and normalize leaderboard data.
      const data = await getLeaderboard({
        mode,
        timeLimit: mode === "time" ? timeLimit : null,
        wordLimit: mode === "words" ? wordLimit : null,
        punctuation,
        numbers,
        scope,
        timeRange,
      });

      const rawScores = data || [];
      const userBestScores = new Map();

      rawScores.forEach((score) => {
        const username = score.user?.name || "Anonymous";

        if (
          !userBestScores.has(username) ||
          score.wpm > userBestScores.get(username).wpm
        ) {
          userBestScores.set(username, score);
        }
      });

      const deduplicatedLeaders = Array.from(userBestScores.values()).sort(
        (a, b) => b.wpm - a.wpm
      );

      setLeaders(deduplicatedLeaders);
      setLoading(false);
    }

    fetchScores();
  }, [mode, timeLimit, wordLimit, punctuation, numbers, scope, timeRange]);

  return (
    <div className="leaderboard-container" style={styles.container}>
      <style>{`
        .scope-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 30px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          background: var(--bg-secondary);
          color: var(--text-muted);
          cursor: pointer;
          font-weight: 600;
          font-size: 1.2rem;
          transition: all 0.2s ease;
        }

        .scope-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
        }

        .scope-btn.active {
          background: rgba(255, 255, 255, 0.08);
          color: var(--accent-color);
          border-color: var(--accent-color);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .lb-filter-btn {
          padding: 6px 16px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 0.95rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .lb-filter-btn:hover {
          color: var(--text-primary);
        }

        .lb-filter-btn.active {
          color: var(--accent-color);
        }
      `}</style>

      <h2 style={styles.header}>
        <Trophy size={32} color="var(--accent-color)" />
        Leaderboard
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          marginBottom: "40px",
        }}
      >
        <button
          onClick={() => setScope("global")}
          className={`scope-btn ${scope === "global" ? "active" : ""}`}
        >
          <Globe size={20} /> Global
        </button>

        <button
          onClick={() => setScope("friends")}
          className={`scope-btn ${scope === "friends" ? "active" : ""}`}
        >
          <Users size={20} /> Friends
        </button>
      </div>

      <div style={styles.filterRow}>
        {["time", "words", "quote"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`lb-filter-btn ${mode === m ? "active" : ""}`}
            style={{ textTransform: "capitalize" }}
          >
            {m}
          </button>
        ))}
      </div>

      <div style={{ ...styles.filterRow, marginBottom: "40px" }}>
        {mode === "time" &&
          [15, 30, 60, 120].map((t) => (
            <button
              key={t}
              onClick={() => setTimeLimit(t)}
              className={`lb-filter-btn ${
                timeLimit === t ? "active" : ""
              }`}
            >
              {t}
            </button>
          ))}

        {mode === "words" &&
          [10, 25, 50, 100].map((w) => (
            <button
              key={w}
              onClick={() => setWordLimit(w)}
              className={`lb-filter-btn ${
                wordLimit === w ? "active" : ""
              }`}
            >
              {w}
            </button>
          ))}

        <div
          style={{
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            background: "var(--text-muted)",
            margin: "0 8px",
          }}
        />

        <button
          onClick={() => setPunctuation(!punctuation)}
          className={`lb-filter-btn ${punctuation ? "active" : ""}`}
        >
          @ punctuation
        </button>

        <button
          onClick={() => setNumbers(!numbers)}
          className={`lb-filter-btn ${numbers ? "active" : ""}`}
        >
          # numbers
        </button>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          style={{
            background: "var(--bg-secondary)",
            color: "var(--text-primary)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "8px",
            padding: "6px 12px",
            fontFamily: "var(--font-ui, sans-serif)",
            fontSize: "0.9rem",
            cursor: "pointer",
            outline: "none",
            transition: "all 0.2s ease",
          }}
        >
          <option value="all">All-Time</option>
          <option value="month">Past 30 Days</option>
          <option value="week">Past 7 Days</option>
        </select>
      </div>

      <div style={styles.listContainer}>
        {loading ? (
          <div style={styles.emptyState}>Loading rankings... ⏳</div>
        ) : leaders.length === 0 ? (
          <div style={styles.emptyState}>
            <Ghost
              size={48}
              color="var(--text-muted)"
              style={{ marginBottom: "15px", opacity: 0.5 }}
            />
            <div
              style={{
                fontSize: "1.2rem",
                color: "var(--text-primary)",
                marginBottom: "5px",
              }}
            >
              No scores found
            </div>
            <div
              style={{
                color: "var(--text-muted)",
                fontSize: "0.9rem",
              }}
            >
              Be the first to secure a spot on this board!
            </div>
          </div>
        ) : (
          leaders.map((score, index) => {
            const isMe = user && score.user?.name === user.name;

            return (
              <div
                key={score.id}
                className="lb-card"
                style={{
                  ...styles.leaderCard,
                  ...(isMe ? styles.highlightedCard : {}),
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                  }}
                >
                  <span
                    style={{
                      ...styles.rankBadge,
                      color:
                        index === 0
                          ? "var(--accent-color)"
                          : index === 1
                            ? "#94a3b8"
                            : index === 2
                              ? "#b45309"
                              : "var(--text-muted)",
                    }}
                  >
                    #{index + 1}
                  </span>

                  <ZoomableAvatar
                    avatarUrl={
                      score.user?.avatar ||
                      score.avatar ||
                      (isMe
                        ? localStorage.getItem(`avatar_${user.name}`)
                        : null) ||
                      localStorage.getItem(
                        `avatar_${score.user?.name || score.username}`
                      )
                    }
                    name={score.user?.name || score.username}
                    borderColor={
                      isMe
                        ? "var(--accent-color)"
                        : "rgba(255, 255, 255, 0.1)"
                    }
                  />

                  <span
                    style={{
                      ...styles.username,
                      ...(isMe ? { color: "var(--accent-color)" } : {}),
                    }}
                  >
                    {score.user?.name || "Anonymous"} {isMe && "(You)"}
                  </span>
                </div>

                <div style={styles.statsContainer}>
                  <div style={{ textAlign: "right" }}>
                    <div style={styles.wpmText}>
                      {score.wpm}{" "}
                      <span
                        style={{
                          fontSize: "0.9rem",
                          color: "var(--text-muted)",
                          fontWeight: "normal",
                        }}
                      >
                        WPM
                      </span>
                    </div>
                    <div style={styles.accuracyText}>
                      {score.accuracy}% accuracy
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "40px 20px",
    color: "var(--text-primary)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "15px",
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  filterRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
  },
  listContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "60px 20px",
    textAlign: "center",
    background: "var(--bg-secondary)",
    borderRadius: "12px",
  },
  leaderCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    background: "transparent",
    borderRadius: "12px",
    border: "1px solid transparent",
  },
  highlightedCard: {
    background: "var(--bg-secondary)",
    borderLeft: "4px solid var(--accent-color)",
    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
    borderRight: "1px solid rgba(255, 255, 255, 0.05)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  },
  rankBadge: {
    fontSize: "1.4rem",
    fontWeight: "bold",
    width: "40px",
    fontFamily: "var(--font-typing, monospace)",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "var(--bg-secondary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "1.2rem",
    color: "var(--text-primary)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  username: {
    fontSize: "1.1rem",
    fontWeight: "500",
  },
  statsContainer: {
    display: "flex",
    alignItems: "center",
  },
  wpmText: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "var(--accent-color)",
    lineHeight: "1",
    fontFamily: "var(--font-typing, monospace)",
  },
  accuracyText: {
    fontSize: "0.85rem",
    color: "var(--text-muted)",
    marginTop: "6px",
  },
};

