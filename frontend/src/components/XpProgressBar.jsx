import React from 'react';

const XpProgressBar = ({ xp = 0 }) => {
  const thresholds = [
    { title: "Novice", min: 0, max: 1000, next: "Amateur" },
    { title: "Amateur", min: 1000, max: 5000, next: "Expert" },
    { title: "Expert", min: 5000, max: 15000, next: "Master" },
    { title: "Master", min: 15000, max: 35000, next: "Grandmaster" },
    { title: "Grandmaster", min: 35000, max: 100000, next: "Max Rank" }
  ];

  const currentTier = thresholds.find(t => xp >= t.min && xp < t.max) || thresholds[thresholds.length - 1];
  const range = currentTier.max - currentTier.min;
  const gained = xp - currentTier.min;
  const percentage = Math.min(Math.max((gained / range) * 100, 0), 100);
  const xpNeeded = currentTier.max - xp;

  return (
    <div style={{ marginTop: '15px', background: '#1e293b', padding: '15px', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: '#cbd5e1' }}>
        <span>Current: <strong>{currentTier.title}</strong> ({xp} XP)</span>
        {xpNeeded > 0 && <span>Next: <strong>{currentTier.next}</strong> in {xpNeeded} XP</span>}
      </div>
      
      {/* The Progress Bar Container */}
      <div style={{ width: '100%', height: '12px', background: '#334155', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ 
          width: `${percentage}%`, 
          height: '100%', 
          background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', 
          transition: 'width 0.5s ease-in-out' 
        }}></div>
      </div>
    </div>
  );
};

export default XpProgressBar;