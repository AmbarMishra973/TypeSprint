import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Star, Target, Shield } from 'lucide-react';

// Define the XP thresholds and titles
const RANKS = [
  { max: 100, title: "Novice" },
  { max: 250, title: "Rookie" },
  { max: 500, title: "Beginner" },
  { max: 1000, title: "Intermediate" },
  { max: 2000, title: "Advanced" },
  { max: 5000, title: "Expert" },
  { max: 10000, title: "Master" },
  { max: Infinity, title: "Grandmaster" }
];

export default function RankBadge({ xp = 0 }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate current rank and progress
  let currentRankIndex = 0;
  for (let i = 0; i < RANKS.length; i++) {
    if (xp < RANKS[i].max) {
      currentRankIndex = i;
      break;
    }
  }

  const currentRank = RANKS[currentRankIndex];
  const nextRank = currentRankIndex < RANKS.length - 1 ? RANKS[currentRankIndex + 1] : null;
  
  const baseXP = currentRankIndex === 0 ? 0 : RANKS[currentRankIndex - 1].max;
  const requiredXP = currentRank.max;
  
  // Calculate percentage for the progress bar
  const progressPercentage = nextRank 
    ? Math.min(100, Math.max(0, ((xp - baseXP) / (requiredXP - baseXP)) * 100))
    : 100;

  const xpRemaining = requiredXP - xp;

  return (
    <div className="rank-badge-container" ref={dropdownRef} style={{ position: 'relative' }}>
      
      {/* The Clickable Badge in Navbar */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--bg-secondary)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '6px 14px',
          borderRadius: '20px',
          color: 'var(--text-primary)',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: isOpen ? '0 0 0 2px var(--accent-color)' : 'none'
        }}
      >
        <Shield size={16} color="var(--accent-color)" />
        {currentRank.title}
        <ChevronDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', color: 'var(--text-muted)' }} />
      </button>

      {/* The Dropdown Popover */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 10px)',
          right: 0,
          width: '260px',
          background: 'var(--bg-secondary)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
          zIndex: 100,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>Current Rank</span>
            <span style={{ color: 'var(--accent-color)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Star size={14} /> {currentRank.title}
            </span>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '15px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)', fontFamily: 'var(--font-typing, monospace)' }}>
              {xp.toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>XP</span>
            </div>
          </div>

          {nextRank ? (
            <>
              {/* Progress Bar */}
              <div style={{ width: '100%', height: '8px', background: 'var(--bg-primary)', borderRadius: '4px', overflow: 'hidden', marginBottom: '10px' }}>
                <div style={{ width: `${progressPercentage}%`, height: '100%', background: 'var(--accent-color)', transition: 'width 0.5s ease-out' }}></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{xpRemaining} XP to next rank</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Target size={12} color="var(--accent-color)"/> {nextRank.title}
                </span>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--accent-color)', fontSize: '0.9rem', fontWeight: 'bold', marginTop: '10px' }}>
              🎉 Max Rank Achieved!
            </div>
          )}
          
        </div>
      )}
    </div>
  );
}