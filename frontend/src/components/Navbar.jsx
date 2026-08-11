import React from 'react';
import RankBadge from './RankBadge';
import ThemeSelector from './ThemeSelector';
import { 
  Keyboard, 
  Home, 
  LayoutDashboard, 
  Trophy, 
  Users, 
  CalendarDays, 
  User, 
  Settings, 
  LogIn,
  Palette // Added for the theme selector
} from 'lucide-react';

const Navbar = ({ activeView, setActiveView, user, openModal }) => {
  return (
    <nav className="navbar" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '15px 30px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)' // Subtle separation line
    }}>
      
      {/* LEFT: Logo */}
      <div className="navbar-left">
        <h2 
          onClick={() => setActiveView("typing")} 
          style={{ 
            cursor: 'pointer', 
            margin: 0, 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            fontSize: '1.5rem'
          }}
        >
          <Keyboard size={28} /> {/* Replaced emoji with icon */}
          TypeSprint
        </h2>
      </div>
      
      {/* CENTER: Icon Navigation */}
      <div className="navbar-center" style={{ display: 'flex', gap: '15px' }}>
        <button 
          className={`icon-btn ${activeView === "typing" ? "active" : ""}`} 
          onClick={() => setActiveView("typing")}
          title="Home"
        >
          <Home size={20} />
        </button>
        
        <button 
          className={`icon-btn ${activeView === "dashboard" ? "active" : ""}`} 
          onClick={() => setActiveView("dashboard")}
          title="Dashboard"
        >
          <LayoutDashboard size={20} />
        </button>
        
        <button 
          className={`icon-btn ${activeView === "leaderboard" ? "active" : ""}`} 
          onClick={() => setActiveView("leaderboard")}
          title="Leaderboard"
        >
          <Trophy size={20} />
        </button>
        
        <button 
          className={`icon-btn ${activeView === "friends" ? "active" : ""}`} 
          onClick={() => setActiveView("friends")}
          title="Friends"
        >
          <Users size={20} />
        </button>
        
        <button 
          className={`icon-btn ${activeView === "daily" ? "active" : ""}`} 
          onClick={() => setActiveView("daily")}
          title="Daily Challenge"
        >
          <CalendarDays size={20} />
        </button>
      </div>

      {/* RIGHT: Theme, User Profile & Settings */}
      <div className="navbar-right">
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            
            <RankBadge xp={user.xp || 0} />
            
            {/* Action Icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* NOTE: You can replace this button with your actual <ThemeSelector /> component */}
              <ThemeSelector />

              <button 
                className={`icon-btn ${activeView === "profile" ? "active" : ""}`} 
                onClick={() => setActiveView("profile")}
                title="Profile"
              >
                <User size={20} />
              </button>
              
              <button 
                className="icon-btn" 
                onClick={() => openModal("settings")}
                title="Settings"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>
        ) : (
          <button 
            className="login-btn" 
            onClick={() => openModal("auth")}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <LogIn size={18} /> Login
          </button>
        )}
      </div>

    </nav>
  );
};

export default Navbar;