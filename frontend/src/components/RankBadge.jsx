import React from 'react';

const RankBadge = ({ xp }) => {
  const getRankDetails = (currentXp) => {
    if (currentXp < 1000) return { title: "Novice", color: "#6b7280", icon: "🌱" }; // Gray
    if (currentXp < 5000) return { title: "Amateur", color: "#22c55e", icon: "⭐" }; // Green
    if (currentXp < 15000) return { title: "Expert", color: "#3b82f6", icon: "🔥" }; // Blue
    if (currentXp < 35000) return { title: "Master", color: "#a855f7", icon: "⚡" }; // Purple
    return { title: "Grandmaster", color: "#eab308", icon: "👑" }; // Yellow
  };

  const { title, color, icon } = getRankDetails(xp || 0);

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 12px',
      borderRadius: '20px',
      backgroundColor: color,
      color: 'white',
      fontWeight: 'bold',
      fontSize: '0.85rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      cursor: 'default'
    }}>
      <span>{icon}</span>
      <span>{title}</span>
    </div>
  );
};

export default RankBadge;