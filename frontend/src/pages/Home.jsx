import { useEffect, useState } from "react";
import AchievementsGrid from "../components/AchievementsGrid";
import AuthModal from "../components/AuthModal";
import Dashboard from "../components/Dashboard";
import Friends from "../components/Friends";
import Leaderboard from "../components/Leaderboard";
import Navbar from "../components/Navbar";
import Profile from "../components/Profile";
import ProfileModal from "../components/ProfileModal";
import SettingsModal from "../components/SettingsModal";
import TypingBox from "../components/TypingBox";
import DailyChallenge from "../pages/DailyChallenge";
import useTypingEngine from "../hooks/useTypingEngine";
import { calculateXpReward } from "../utils/xpCalculator";
import "../styles/home.css";

function Home() {
  const [activeView, setActiveView] = useState("typing");
  const [activeChallenge, setActiveChallenge] = useState(null);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("typingUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLoginSuccess = (userData) => {
    if (userData.typingStats) {
      localStorage.setItem(
        `typingStats_${userData.name}`,
        userData.typingStats
      );
    }

    setUser(userData);
    localStorage.setItem("typingUser", JSON.stringify(userData));
    console.log("Logged in user data received:", userData);
  };

  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modalName) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);

  const typingEngine = useTypingEngine(user, (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("typingUser", JSON.stringify(updatedUser));
  });

  useEffect(() => {
    const handleXpUpdate = (e) => {
      const updatedUser = e.detail;
      setUser(updatedUser);
    };

    window.addEventListener("xpUpdated", handleXpUpdate);

    return () => window.removeEventListener("xpUpdated", handleXpUpdate);
  }, []);

  useEffect(() => {
    fetch("https://ambarmishradb.onrender.com/")
      .then(() => console.log("Backend server is awake!"))
      .catch((err) => console.log("Waking up server...", err));
  }, []);

  useEffect(() => {
    if (!user) return;

    const checkActiveMatch = async () => {
      try {
        const res = await fetch(
          `https://ambarmishradb.onrender.com/api/challenges/${user.name}/active`
        );

        if (res.status === 200) {
          const match = await res.json();

          if (!activeChallenge || activeChallenge.id !== match.id) {
            setActiveChallenge(match);
            setActiveView("typing");
          }
        } else if (res.status === 204 && activeChallenge) {
          setActiveChallenge(null);
        }
      } catch (err) {
        console.error("Matchmaker error:", err);
      }
    };

    const interval = setInterval(checkActiveMatch, 2500);

    return () => clearInterval(interval);
  }, [user, activeChallenge]);

  const handleTestComplete = (wpm, accuracy) => {
    if (!user || !user.email) return;

    const xpGained = Math.max(
      Math.round(wpm * 2 * (accuracy / 100)),
      10
    );

    fetch(
      "https://ambarmishradb.onrender.com/api/users/update-xp",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          xpGained,
        }),
      }
    )
      .then((res) => res.json())
      .then((updatedUser) => {
        setUser(updatedUser);
        console.log(`Successfully added ${xpGained} XP!`);
      })
      .catch((err) => console.error("Failed to update XP:", err));
  };

  return (
    <div className="home">
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        user={user}
        openModal={openModal}
      />

      <main
        style={{
          padding: "0 40px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {activeView === "typing" && (
          <>
            <h1>Improve your typing speed every day</h1>

            <TypingBox
              engine={typingEngine}
              user={user}
              activeChallenge={activeChallenge}
              setActiveChallenge={setActiveChallenge}
            />
          </>
        )}

        {activeView === "dashboard" && (
          <Dashboard
            user={user}
            liveStats={typingEngine.stats}
            clearStats={typingEngine.clearStatistics}
          />
        )}

        {activeView === "leaderboard" && (
          <Leaderboard user={user} />
        )}

        {activeView === "friends" && (
          <Friends
            user={user}
            setUser={setUser}
            setActiveView={setActiveView}
            setActiveChallenge={setActiveChallenge}
          />
        )}

        {activeView === "achievements" && (
          <div
            style={{
              animation: "fadeIn 0.3s ease",
              paddingBottom: "40px",
            }}
          >
            <h1
              style={{
                textAlign: "center",
                marginBottom: "10px",
                fontSize: "2.5rem",
              }}
            >
              Your Trophy Room
            </h1>

            <p
              style={{
                textAlign: "center",
                color: "var(--text-muted, #666)",
                marginBottom: "40px",
              }}
            >
              Complete challenges to unlock badges and level up your typing
              status.
            </p>

            <AchievementsGrid
              unlockedIds={
                typingEngine?.stats?.unlockedAchievements || []
              }
            />
          </div>
        )}

        {activeView === "profile" && (
          <Profile
            user={user}
            stats={typingEngine.stats}
          />
        )}
      </main>

      {activeModal === "auth" && (
        <AuthModal
          onClose={closeModal}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {activeModal === "settings" && (
        <SettingsModal
          soundEnabled={typingEngine.soundEnabled}
          setSoundEnabled={typingEngine.setSoundEnabled}
          onClose={closeModal}
          user={user}
          onLogout={() => {
            setUser(null);
            localStorage.removeItem("typingUser");
          }}
        />
      )}

      {activeView === "daily" && (
        <DailyChallenge
          user={user}
          engine={typingEngine}
        />
      )}
    </div>
  );
}

export default Home;