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

function Home() {
  const [activeView, setActiveView] = useState("typing"); 
  
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

  // 🚀 FIX 1: Pass the user into the typing engine so stats save to the right account
  const typingEngine = useTypingEngine(user);

  // 🚀 FIX 2: Wake up the Render backend as soon as the website loads
  useEffect(() => {
    fetch("https://ambarmishradb.onrender.com/")
      .then(() => console.log("Backend server is awake!"))
      .catch((err) => console.log("Waking up server...", err));
  }, []);

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
            <TypingBox engine={typingEngine} />
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
          <Leaderboard />
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