import React from 'react';
import RankBadge from './RankBadge';

const Navbar = ({ activeView, setActiveView, user, openModal }) => {
  return (
    <nav className="navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px' }}>
      
      {/* LEFT: Logo */}
      <div className="navbar-left">
        <h2 onClick={() => setActiveView("typing")} style={{ cursor: 'pointer', margin: 0 }}>
          ⌨️ TypeSprint
        </h2>
      </div>
      
      {/* CENTER: All Nav Buttons including Daily Challenge */}
      <div className="navbar-center" style={{ display: 'flex', gap: '10px' }}>
        <button className={activeView === "typing" ? "active" : ""} onClick={() => setActiveView("typing")}>Home</button>
        <button className={activeView === "dashboard" ? "active" : ""} onClick={() => setActiveView("dashboard")}>Dashboard</button>
        <button className={activeView === "leaderboard" ? "active" : ""} onClick={() => setActiveView("leaderboard")}>Leaderboard</button>
        <button className={activeView === "friends" ? "active" : ""} onClick={() => setActiveView("friends")}>Friends</button>
        <button className={activeView === "daily" ? "active" : ""} onClick={() => setActiveView("daily")}>
          📅 Daily Challenge
        </button>
      </div>

      {/* RIGHT: User Profile & XP Rank Badge (or Login) */}
      <div className="navbar-right">
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* 🌟 This is where your XP Rank Badge will pop up once logged in! */}
            <RankBadge xp={user.xp || 0} />
            
            <span style={{ fontWeight: 'bold' }}>{user.name}</span>
            <button onClick={() => setActiveView("profile")}>Profile</button>
            <button onClick={() => openModal("settings")}>⚙️</button>
          </div>
        ) : (
          <button onClick={() => openModal("auth")}>Login / Sign Up</button>
        )}
      </div>

    </nav>
  );
};

export default Navbar;