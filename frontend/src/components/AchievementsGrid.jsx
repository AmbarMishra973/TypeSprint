import React from "react";
import { ACHIEVEMENTS } from "../utils/achievements";

export default function AchievementsGrid({ unlockedIds = [] }) {
  return (
    <div style={styles.container}>
      <h3 style={styles.header}>🏆 Achievements</h3>
      <div style={styles.grid}>
        {ACHIEVEMENTS.map((badge) => {
          const isUnlocked = unlockedIds.includes(badge.id);

          return (
            <div 
              key={badge.id} 
              style={{
                ...styles.card,
                ...(isUnlocked ? styles.unlockedCard : styles.lockedCard)
              }}
            >
              <div style={{
                ...styles.iconWrapper,
                ...(isUnlocked ? styles.unlockedIcon : styles.lockedIcon)
              }}>
                {isUnlocked ? badge.icon : "🔒"}
              </div>
              <div style={styles.textContainer}>
                <div style={{
                  ...styles.title,
                  color: isUnlocked ? "var(--text-main, #333)" : "#888"
                }}>
                  {badge.title}
                </div>
                <div style={styles.description}>
                  {badge.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginTop: "30px",
    paddingTop: "20px",
    borderTop: "1px solid rgba(0,0,0,0.1)",
  },
  header: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "var(--text-main, #333)"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "15px"
  },
  card: {
    display: "flex",
    alignItems: "center",
    padding: "12px",
    borderRadius: "12px",
    border: "2px solid transparent",
    transition: "all 0.2s ease",
    background: "rgba(0,0,0,0.03)",
  },
  unlockedCard: {
    background: "rgba(251, 191, 36, 0.1)", // Light amber
    borderColor: "rgba(251, 191, 36, 0.5)",
    boxShadow: "0 4px 10px rgba(251, 191, 36, 0.1)",
  },
  lockedCard: {
    opacity: 0.7,
    filter: "grayscale(100%)",
  },
  iconWrapper: {
    fontSize: "2rem",
    width: "50px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    marginRight: "15px",
  },
  unlockedIcon: {
    background: "#fef3c7", // Bright amber circle
  },
  lockedIcon: {
    background: "#e2e8f0", // Gray circle
    fontSize: "1.5rem",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: "1.1rem",
    marginBottom: "4px",
  },
  description: {
    fontSize: "0.85rem",
    color: "#666",
    lineHeight: "1.2",
  }
};