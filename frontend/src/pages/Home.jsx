import { useState } from "react";
import "../styles/home.css";
import Navbar from "../components/Navbar";
import TypingBox from "../components/TypingBox";
import Dashboard from "../components/Dashboard";
import useTypingEngine from "../hooks/useTypingEngine";

function Home() {
  const [activeView, setActiveView] = useState("typing"); // "typing" or "dashboard"

  // 🚀 Call the engine ONCE here at the top level so stats persist across views
  const typingEngine = useTypingEngine();

  const { stats, resetStats } = typingEngine;

  return (
    <div className="home">
      {/* Pass view controls to Navbar */}
      <Navbar activeView={activeView} setActiveView={setActiveView} />

      <main style={{ padding: "0 40px", maxWidth: "1200px", margin: "0 auto" }}>
        {activeView === "typing" ? (
          <>
            <h1>Improve your typing speed every day</h1>
            {/* Pass the entire typing engine down to TypingBox */}
            <TypingBox engine={typingEngine} />
          </>
        ) : (
          // Dashboard opens instantly anytime, even before taking a test!
          <Dashboard stats={stats} onReset={typingEngine.clearStatistics} />
        )}
      </main>
    </div>
  );
}

export default Home;