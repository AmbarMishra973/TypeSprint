import React, { useEffect, useState } from "react";
import XpProgressBar from './XpProgressBar'; // Adjust the path depending on where your files are located
export default function ProfileModal({ user, stats, onClose }) {
  const [duelStats, setDuelStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchDuelStats = async () => {
      try {
        const res = await fetch(`https://ambarmishradb.onrender.com/api/challenges/${user.name}/stats`);
        if (res.ok) {
          const data = await res.json();
          setDuelStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch duel stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDuelStats();
  }, [user]);

  if (!user) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={{ margin: 0, fontSize: "2rem", color: "#38bdf8" }}>👤 {user.name}'s Profile</h2>
          <button onClick={onClose} style={styles.closeBtn}>✖</button>
        </div>

        <div style={styles.content}>
          {/* Solo Typing Stats */}
          <div style={styles.card}>
            <h3 style={{ borderBottom: "1px solid #475569", paddingBottom: "10px", marginTop: 0 }}>Solo Practice Stats</h3>
            <div style={styles.statGrid}>
              <div style={styles.statBox}>
                <span style={styles.statLabel}>Best WPM</span>
                <span style={styles.statValue}>{stats?.bestWpm || 0}</span>
              </div>
              <div style={styles.statBox}>
                <span style={styles.statLabel}>Avg WPM</span>
                <span style={styles.statValue}>{stats?.avgWpm || 0}</span>
              </div>
              <div style={styles.statBox}>
                <span style={styles.statLabel}>Tests Completed</span>
                <span style={styles.statValue}>{stats?.testsCompleted || 0}</span>
              </div>
            </div>
          </div>

          {/* Multiplayer Duel Stats */}
          <div style={{ ...styles.card, border: "1px solid #fbbf24" }}>
            <h3 style={{ borderBottom: "1px solid #475569", paddingBottom: "10px", marginTop: 0, color: "#fbbf24" }}>⚔️ Multiplayer Record</h3>
            
            {loading ? (
              <p style={{ textAlign: "center", color: "#94a3b8" }}>Loading record...</p>
            ) : (
              <div style={styles.statGrid}>
                <div style={styles.statBox}>
                  <span style={styles.statLabel}>Win Rate</span>
                  <span style={{ ...styles.statValue, color: "#10b981" }}>{duelStats?.winRate || 0}%</span>
                </div>
                <div style={styles.statBox}>
                  <span style={styles.statLabel}>Wins</span>
                  <span style={styles.statValue}>{duelStats?.wins || 0}</span>
                </div>
                <div style={styles.statBox}>
                  <span style={styles.statLabel}>Losses</span>
                  <span style={{ ...styles.statValue, color: "#ef4444" }}>{duelStats?.losses || 0}</span>
                </div>
                <div style={styles.statBox}>
                  <span style={styles.statLabel}>Total Duels</span>
                  <span style={styles.statValue}>{duelStats?.totalMatches || 0}</span>
                </div>
              </div>
            )}
            <XpProgressBar xp={user?.xp || 0} />
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, backdropFilter: "blur(4px)" },
  modal: { background: "#1e293b", padding: "30px", borderRadius: "16px", width: "90%", maxWidth: "500px", border: "1px solid #475569", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", animation: "fadeIn 0.2s ease" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" },
  closeBtn: { background: "transparent", border: "none", color: "#94a3b8", fontSize: "1.5rem", cursor: "pointer", transition: "color 0.2s" },
  content: { display: "flex", flexDirection: "column", gap: "20px" },
  card: { background: "#0f172a", padding: "20px", borderRadius: "12px", border: "1px solid #334155" },
  statGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "15px" },
  statBox: { display: "flex", flexDirection: "column", background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "8px", textAlign: "center" },
  statLabel: { color: "#94a3b8", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "5px" },
  statValue: { color: "#fff", fontSize: "1.8rem", fontWeight: "bold" }
};