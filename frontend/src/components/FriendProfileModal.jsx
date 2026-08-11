import React, { useEffect, useState } from "react";
import XpProgressBar from './XpProgressBar'; 
import { Trophy, Swords, X } from "lucide-react";

export default function FriendProfileModal({ friendName, onClose }) {
  const [duelStats, setDuelStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!friendName) return;
    
    const fetchDuelStats = async () => {
      try {
        const res = await fetch(`https://ambarmishradb.onrender.com/api/challenges/${friendName}/stats`);
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
  }, [friendName]);

  if (!friendName) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={{ margin: 0, fontSize: "1.8rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "10px" }}>
            <Trophy color="var(--accent-color)"/> {friendName}'s Profile
          </h2>
          <button onClick={onClose} style={styles.closeBtn}><X size={24}/></button>
        </div>

        <div style={styles.content}>
          {/* Multiplayer Duel Stats */}
          <div style={{ ...styles.card, border: "1px solid var(--accent-color)" }}>
            <h3 style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "10px", marginTop: 0, color: "var(--accent-color)", display: "flex", alignItems: "center", gap: "8px" }}>
              <Swords size={18}/> Multiplayer Record
            </h3>
            
            {loading ? (
              <p style={{ textAlign: "center", color: "var(--text-muted)" }}>Loading record...</p>
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
                  <span style={{ ...styles.statValue, color: "var(--error-color, #ef4444)" }}>{duelStats?.losses || 0}</span>
                </div>
                <div style={styles.statBox}>
                  <span style={styles.statLabel}>Total Duels</span>
                  <span style={styles.statValue}>{duelStats?.totalMatches || 0}</span>
                </div>
              </div>
            )}
            
            {/* Fallback to 0 if you don't fetch XP in the duelStats endpoint yet */}
            <div style={{ marginTop: '20px' }}>
              <XpProgressBar xp={duelStats?.xp || 0} /> 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.75)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, backdropFilter: "blur(5px)" },
  modal: { background: "var(--bg-secondary)", padding: "30px", borderRadius: "16px", width: "90%", maxWidth: "500px", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", animation: "fadeIn 0.2s ease" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" },
  closeBtn: { background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", transition: "color 0.2s" },
  content: { display: "flex", flexDirection: "column", gap: "20px" },
  card: { background: "var(--bg-primary)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" },
  statGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "15px" },
  statBox: { display: "flex", flexDirection: "column", background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", textAlign: "center" },
  statLabel: { color: "var(--text-muted)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "5px" },
  statValue: { color: "var(--text-primary)", fontSize: "1.8rem", fontWeight: "bold", fontFamily: "var(--font-typing, monospace)" }
};