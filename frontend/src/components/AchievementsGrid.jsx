import React from "react";
import { Award, Lock, Medal } from "lucide-react";
import { ACHIEVEMENTS } from "../utils/achievements";

export default function AchievementsGrid({ unlockedIds = [] }) {
  // Calculate completion percentage
  const totalAchievements = ACHIEVEMENTS.length;
  const unlockedCount = unlockedIds.length;
  const progressPercentage = totalAchievements > 0 ? Math.round((unlockedCount / totalAchievements) * 100) : 0;

  return (
    <div className="achievements-container">
      
      <style>{`
        .achievements-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
          animation: fadeIn 0.4s ease-out;
          color: var(--text-primary);
        }
        
        .achievements-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 40px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .achievements-title {
          display: flex;
          align-items: center;
          gap: 15px;
          font-size: 2.2rem;
          margin: 0;
        }

        .progress-wrapper {
          background: var(--bg-secondary);
          padding: 15px 25px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 250px;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .progress-bar-bg {
          width: 100%;
          height: 8px;
          background: var(--bg-primary);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: var(--accent-color);
          border-radius: 4px;
          transition: width 1s ease-out;
        }

        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .badge-card {
          display: flex;
          align-items: center;
          padding: 20px;
          border-radius: 16px;
          background: var(--bg-secondary);
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .badge-card.unlocked {
          border-color: var(--accent-color);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }
        
        .badge-card.unlocked:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.25);
        }

        .badge-card.locked {
          opacity: 0.6;
          filter: grayscale(100%);
        }

        /* Subtle glow behind unlocked icons */
        .badge-card.unlocked::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 45px;
          width: 50px;
          height: 50px;
          background: var(--accent-color);
          border-radius: 50%;
          filter: blur(40px);
          transform: translateY(-50%);
          opacity: 0.15;
          z-index: 0;
        }

        .icon-wrapper {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          font-size: 1.8rem;
          margin-right: 20px;
          z-index: 1;
        }

        .icon-wrapper.unlocked {
          background: rgba(255, 255, 255, 0.05);
          color: var(--accent-color);
          border: 1px solid var(--accent-color);
        }

        .icon-wrapper.locked {
          background: rgba(255, 255, 255, 0.02);
          color: var(--text-muted);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .badge-info {
          flex: 1;
          z-index: 1;
        }

        .badge-title {
          font-weight: 700;
          font-size: 1.15rem;
          margin-bottom: 6px;
        }

        .badge-title.unlocked { color: var(--text-primary); }
        .badge-title.locked { color: var(--text-muted); }

        .badge-desc {
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.4;
        }
      `}</style>

      <header className="achievements-header">
        
        <div className="progress-wrapper">
          <div className="progress-header">
            <span>Overall Completion</span>
            <span style={{ color: "var(--accent-color)" }}>{progressPercentage}%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "right", marginTop: "4px" }}>
            {unlockedCount} / {totalAchievements} Unlocked
          </div>
        </div>
      </header>

      <div className="achievements-grid">
        {ACHIEVEMENTS.map((badge) => {
          const isUnlocked = unlockedIds.includes(badge.id);

          return (
            <div key={badge.id} className={`badge-card ${isUnlocked ? "unlocked" : "locked"}`}>
              <div className={`icon-wrapper ${isUnlocked ? "unlocked" : "locked"}`}>
                {isUnlocked ? (badge.icon || <Medal size={28} />) : <Lock size={24} />}
              </div>
              
              <div className="badge-info">
                <div className={`badge-title ${isUnlocked ? "unlocked" : "locked"}`}>
                  {badge.title}
                </div>
                <div className="badge-desc">
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