import React, { useEffect, useState } from "react";
import useTypingEngine from "../hooks/useTypingEngine";

const DailyChallenge = ({ user }) => {
  const [dailyText, setDailyText] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  // Initialize a fresh engine just for the daily challenge
  const engine = useTypingEngine();

  // 1. Fetch Text & Leaderboard on load
  useEffect(() => {
    fetch("https://ambarmishradb.onrender.com/api/challenges/daily-text")
      .then((res) => res.text())
      .then((text) => {
        setDailyText(text);
        if (engine.setWords) engine.setWords(text);
      })
      .catch((err) => console.error("Failed to load text", err));

    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = () => {
    fetch("https://ambarmishradb.onrender.com/api/challenges/daily-leaderboard")
      .then((res) => res.json())
      .then((data) => setLeaderboard(data))
      .catch((err) => console.error("Error fetching leaderboard", err));
  };

  // 2. Countdown Timer logic (Counts down to exactly midnight)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0); // Next midnight
      const diff = midnight - now;

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 3. Submit Score Handler
  const handleScoreSubmit = () => {
    if (!user) return alert("Please log in to submit your daily score!");
    
    // Ensure we have a valid WPM score to submit
    const finalWpm = engine.stats?.bestWpm || engine.calculateWPM() || 0;

    const scoreData = {
      username: user.name,
      wpm: finalWpm,
      accuracy: engine.stats?.accuracy || 100
    };

    fetch("https://ambarmishradb.onrender.com/api/challenges/submit-daily", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(scoreData)
    })
      .then((res) => {
        if (res.ok) {
          setSubmitted(true);
          fetchLeaderboard(); // Refresh the list instantly
        }
      })
      .catch((err) => console.error("Error submitting score", err));
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "40px auto", display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px", color: "#fff" }}>
      
      {/* LEFT: Challenge Area */}
      <div style={{ background: "#1e293b", padding: "30px", borderRadius: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h1 style={{ fontSize: "1.8rem", color: "#38bdf8", margin: 0 }}>🌍 Daily Challenge</h1>
          <div style={{ background: "#0f172a", padding: "8px 14px", borderRadius: "8px", color: "#facc15", fontWeight: "bold" }}>
            Resets in: {timeLeft}
          </div>
        </div>

        <p style={{ color: "#94a3b8", marginBottom: "20px" }}>Type the text below. You can practice as many times as you want, but only submit your best score!</p>

        {/* Typing Area UI */}
        <div style={{ fontSize: "1.4rem", fontFamily: "monospace", background: "#0f172a", padding: "20px", borderRadius: "8px", lineHeight: "1.6", color: "#cbd5e1" }}>
          {dailyText ? dailyText : "Loading today's challenge..."}
        </div>

        {/* Actions (Only show when test is finished) */}
        {engine.finished && !submitted && (
          <div style={{ marginTop: "25px", textAlign: "center" }}>
            <h2 style={{ color: "#4ade80" }}>Speed: {engine.stats?.bestWpm || engine.calculateWPM()} WPM</h2>
            <button 
              onClick={handleScoreSubmit}
              style={{ background: "#3b82f6", color: "white", border: "none", padding: "12px 24px", borderRadius: "8px", fontWeight: "bold", fontSize: "1rem", cursor: "pointer", marginTop: "10px" }}
            >
              Submit Score to Daily Leaderboard 🚀
            </button>
          </div>
        )}

        {submitted && (
          <div style={{ marginTop: "25px", textAlign: "center", color: "#4ade80", fontWeight: "bold", padding: "15px", background: "#064e3b", borderRadius: "8px" }}>
            ✅ Score recorded! Check your rank on the right.
          </div>
        )}
      </div>

      {/* RIGHT: Live Leaderboard */}
      <div style={{ background: "#1e293b", padding: "20px", borderRadius: "12px", height: "fit-content" }}>
        <h3 style={{ borderBottom: "2px solid #334155", paddingBottom: "10px", marginTop: 0, color: "#f8fafc" }}>🏆 Today's Rankings</h3>
        
        {leaderboard.length === 0 ? (
          <p style={{ color: "#64748b", textAlign: "center", marginTop: "20px" }}>No scores yet today. Be the first!</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: "15px 0 0 0" }}>
            {leaderboard.map((entry, index) => (
              <li key={index} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #334155" }}>
                <span style={{ fontWeight: user?.name === entry.username ? "bold" : "normal", color: user?.name === entry.username ? "#facc15" : "#fff" }}>
                  {index + 1}. {entry.username}
                </span>
                <span style={{ color: "#38bdf8", fontWeight: "bold" }}>{entry.wpm} WPM</span>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
};

export default DailyChallenge;