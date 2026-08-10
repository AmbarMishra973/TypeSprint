import React from 'react';

const RankBadge = ({ xp }) => {
  const getRankDetails = (currentXp) => {
    if (currentXp < 1000) return { title: "Novice", color: "bg-gray-500", icon: "🌱" };
    if (currentXp < 5000) return { title: "Amateur", color: "bg-green-500", icon: "⭐" };
    if (currentXp < 15000) return { title: "Expert", color: "bg-blue-500", icon: "🔥" };
    if (currentXp < 35000) return { title: "Master", color: "bg-purple-500", icon: "⚡" };
    return { title: "Grandmaster", color: "bg-yellow-500", icon: "👑" };
  };

  const { title, color, icon } = getRankDetails(xp || 0);

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-white font-bold text-sm ${color} shadow-lg`}>
      <span>{icon}</span>
      <span>{title}</span>
    </div>
  );
};

export default RankBadge;