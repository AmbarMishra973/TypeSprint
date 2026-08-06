import { useState } from "react";
import "../styles/home.css";
import Navbar from "../components/Navbar";
import TypingBox from "../components/TypingBox";
import Dashboard from "../components/Dashboard";
import useTypingEngine from "../hooks/useTypingEngine"; // 👈 Ensure path matches your project
import AuthModal from "../components/AuthModal";
import ProfileModal from "../components/ProfileModal";
import SettingsModal from "../components/SettingsModal";
function Home() {
  const [activeView, setActiveView] = useState("typing"); 
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("typingUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem("typingUser", JSON.stringify(userData)); // 👈 Persist session
  
  };
  const [activeModal, setActiveModal] = useState(null);
  const openModal = (modalName) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);

  // 🚀 Initialize the engine here at the top level
  const typingEngine = useTypingEngine();

  return (
    <div className="home">
      <Navbar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        user={user} 
        openModal={openModal} 
      />

      <main style={{ padding: "0 40px", maxWidth: "1200px", margin: "0 auto" }}>
        {activeView === "typing" ? (
          <>
            <h1>Improve your typing speed every day</h1>
            <TypingBox engine={typingEngine} />
          </>
        ) : (
          <Dashboard user={user} />
        )}
      </main>

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

const overlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalStyle = { background: 'var(--card-bg)', padding: '30px', borderRadius: '12px', width: '350px', textAlign: 'center', border: '1px solid var(--text-muted)' };

export default Home;