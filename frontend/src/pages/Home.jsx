import { useState, useEffect } from "react";
import "../styles/home.css";
import Navbar from "../components/Navbar";
import TypingBox from "../components/TypingBox";
import Dashboard from "../components/Dashboard";
import useTypingEngine from "../hooks/useTypingEngine"; 
import AuthModal from "../components/AuthModal";
import ProfileModal from "../components/ProfileModal";
import SettingsModal from "../components/SettingsModal";
import Leaderboard from "../components/Leaderboard";
import AchievementsGrid from "../components/AchievementsGrid";
import Friends from "../components/Friends";

function Home() {
  const [activeView, setActiveView] = useState("typing"); 
  const [activeChallenge, setActiveChallenge] = useState(null);
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("typingUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLoginSuccess = (userData) => {
    if (userData.typingStats) {
      localStorage.setItem(`typingStats_${userData.name}`, userData.typingStats);
    }
    
    setUser(userData);
    localStorage.setItem("typingUser", JSON.stringify(userData)); 
    console.log("Logged in user data received:", userData);
  };

  const [activeModal, setActiveModal] = useState(null);
  const openModal = (modalName) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);

  // 🚀 The engine is named typingEngine here!
  const typingEngine = useTypingEngine(user);

  useEffect(() => {
    fetch("https://ambarmishradb.onrender.com/")
      .then(() => console.log("Backend server is awake!"))
      .catch((err) => console.log("Waking up server...", err));
  }, []);

  // 🔄 GLOBAL MATCHMAKER: Poll for an ACCEPTED match every 2.5 seconds
  useEffect(() => {
    if (!user) return;
    
    const checkActiveMatch = async () => {
      try {
        const res = await fetch(`https://ambarmishradb.onrender.com/api/challenges/${user.name}/active`);
        if (res.status === 200) {
          const match = await res.json();
          // If we found an active match and we aren't already playing it...
          if (!activeChallenge || activeChallenge.id !== match.id) {
            setActiveChallenge(match);
            setActiveView("typing"); // Snap both players to the typing screen!
          }
        }
      } catch (err) { console.error("Matchmaker error:", err); }
    };

    const interval = setInterval(checkActiveMatch, 2500); // Check every 2.5s
    return () => clearInterval(interval);
  }, [user, activeChallenge]);
  return (
    <div className="home">
     
      <Navbar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        user={user} 
        openModal={openModal} 
      />

      <main style={{ padding: "0 40px", maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Strictly render ONLY the TypingBox when activeView is "typing" */}
        {activeView === "typing" && (
          <>
            <h1>Improve your typing speed every day</h1>
            <TypingBox 
              engine={typingEngine} // 🚀 FIXED: Passed typingEngine instead of engine
              user={user} 
              activeChallenge={activeChallenge} 
              setActiveChallenge={setActiveChallenge} 
            />
          </>
        )}

        {/* Strictly render ONLY the Dashboard when activeView is "dashboard" */}
        {activeView === "dashboard" && (
          <Dashboard 
            user={user} 
            liveStats={typingEngine.stats} 
            clearStats={typingEngine.clearStatistics} 
          />
        )}

        {/* Strictly render ONLY the Leaderboard when activeView is "leaderboard" */}
        {activeView === "leaderboard" && (
          <Leaderboard user={user} />
        )}

        {/* 🚀 FIXED: Kept only ONE Friends block and passed all the correct props */}
        {activeView === "friends" && (
          <Friends 
            user={user} 
            setUser={setUser} 
            setActiveView={setActiveView} 
            setActiveChallenge={setActiveChallenge} 
          />
        )}

        {/* Achievements View */}
        {activeView === "achievements" && (
          <div style={{ animation: "fadeIn 0.3s ease", paddingBottom: "40px" }}>
            <h1 style={{ textAlign: "center", marginBottom: "10px", fontSize: "2.5rem" }}>Your Trophy Room</h1>
            <p style={{ textAlign: "center", color: "var(--text-muted, #666)", marginBottom: "40px" }}>
              Complete challenges to unlock badges and level up your typing status.
            </p>
            <AchievementsGrid unlockedIds={typingEngine?.stats?.unlockedAchievements || []} />
          </div>
        )}

      </main>

      {/* Modals */}
      {activeModal === "auth" && (
        <AuthModal onClose={closeModal} onLoginSuccess={handleLoginSuccess} />
      )}

      {activeModal === "profile" && (
        <ProfileModal 
          user={user} 
          stats={typingEngine.stats} 
          onClose={closeModal} 
        />
      )}
      
      {activeModal === "settings" && (
        <SettingsModal 
          soundEnabled={typingEngine.soundEnabled} 
          setSoundEnabled={typingEngine.setSoundEnabled} 
          onClose={closeModal} 
        />
      )}

    </div>
  );
}

export default Home;