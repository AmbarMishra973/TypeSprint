import React from "react";
import RankBadge from "./RankBadge";
import ThemeSelector from "./ThemeSelector";

import {
  House,
  Trophy,
  Users,
  Calendar,
  User,
  Settings,
  Award,
  Keyboard,
  LogIn,
} from "lucide-react";

const Navbar = ({ activeView, setActiveView, user, openModal }) => {
  return (
    <nav
      className="navbar"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
      }}
    >
      {/* Brand / home navigation */}
      <div className="navbar-left">
        <h2
          onClick={() => setActiveView("typing")}
          style={{
            cursor: "pointer",
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "1.5rem",
          }}
        >
          <Keyboard size={28} />
          TypeSprint
        </h2>
      </div>

      {/* Primary application navigation */}
      <div
        className="navbar-center"
        style={{
          display: "flex",
          gap: "15px",
        }}
      >
        <button
          className={`icon-btn ${
            activeView === "typing" ? "active" : ""
          }`}
          onClick={() => setActiveView("typing")}
          title="Home"
          aria-label="Home"
        >
          <House size={20} />
        </button>

        <button
          className={`icon-btn ${
            activeView === "achievements" ? "active" : ""
          }`}
          onClick={() => setActiveView("achievements")}
          title="Achievements"
          aria-label="Achievements"
        >
          <Award size={20} />
        </button>

        <button
          className={`icon-btn ${
            activeView === "leaderboard" ? "active" : ""
          }`}
          onClick={() => setActiveView("leaderboard")}
          title="Leaderboard"
          aria-label="Leaderboard"
        >
          <Trophy size={20} />
        </button>

        <button
          className={`icon-btn ${
            activeView === "friends" ? "active" : ""
          }`}
          onClick={() => setActiveView("friends")}
          title="Friends"
          aria-label="Friends"
        >
          <Users size={20} />
        </button>

        <button
          className={`icon-btn ${
            activeView === "daily" ? "active" : ""
          }`}
          onClick={() => setActiveView("daily")}
          title="Daily Challenge"
          aria-label="Daily Challenge"
        >
          <Calendar size={20} />
        </button>
      </div>

      {/* Account controls and theme settings */}
      <div className="navbar-right">
        {user ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <RankBadge xp={user.xp || 0} />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <ThemeSelector />

              <button
                className={`icon-btn ${
                  activeView === "profile" ? "active" : ""
                }`}
                onClick={() => setActiveView("profile")}
                title="Profile"
                aria-label="Profile"
              >
                <User size={20} />
              </button>

              <button
                className="icon-btn"
                onClick={() => openModal("settings")}
                title="Settings"
                aria-label="Settings"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>
        ) : (
          <button
            className="login-btn"
            onClick={() => openModal("auth")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <LogIn size={18} />
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;