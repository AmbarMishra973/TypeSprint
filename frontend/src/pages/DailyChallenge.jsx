import React, { useEffect, useState } from "react";

const DailyChallenge = ({ user }) => {
  const [dailyText, setDailyText] = useState("");
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typed, setTyped] = useState("");
  
  const [isRunning, setIsRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [time, setTime] = useState(0);
  
  const [timeLeft, setTimeLeft] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  // 1. Fetch text on load
  useEffect(() => {
    fetch("https://ambarmishradb.onrender.com/api/challenges/daily-text")
      .then((res) => res.text())
      .then((text) => {
        setDailyText(text);
        setWords(text.split(" "));
      })
      .catch((err) => console.error("Failed to load daily text", err));

    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = () => {
    fetch("https://ambarmishradb.onrender.com/api/challenges/daily-leaderboard")
      .then((res) => res.json())
      .then((data) => setLeaderboard(data))
      .catch((err) => console.error("Error fetching leaderboard", err));
  };

  // 2. Local Stopwatch Timer (Counts UP)
  useEffect(() => {
    let interval = null;
    if (isRunning && !finished) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, finished]);

  // 3. Midnight countdown
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight - now;

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 4. Isolated Keyboard Handler for Daily Challenge
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (finished || words.length === 0) return;

      // Start timer on first keystroke
      if (!isRunning) {
        setIsRunning(true);
      }

      const currentWord = words[currentIndex];

      if (e.key === " ") {
        e.preventDefault();
        // If space is pressed, move to next word if user typed something
        if (typed.length > 0) {
          const nextIndex = currentIndex + 1;
          setCurrentIndex(nextIndex);
          setTyped("");

          // Check if finished
          if (nextIndex >= words.length) {
            setFinished(true);
            setIsRunning(false);
          }
        }
      } else if (e.key === "Backspace") {
        setTyped((prev) => prev.slice(0, -1));
      } else if (e.key.length === 1) {
        // Append typed character
        const newTyped = typed + e.key;
        setTyped(newTyped);

        // Auto-advance if word is completed via typing the exact length
        if (newTyped === currentWord) {
          const nextIndex = currentIndex + 1;
          setCurrentIndex(nextIndex);
          setTyped("");

          if (nextIndex >= words.length) {
            setFinished(true);
            setIsRunning(false);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRunning, finished, words, currentIndex, typed]);

  // Calculations
  const calculateWPM = () => {
    if (time === 0) return 0;
    const wordsTyped = currentIndex;
    return Math.round((wordsTyped / time) * 60);
  };

  const currentWpm = calculateWPM();

  // 5. Submit Score Handler
  const handleScoreSubmit = () => {
    if (!user) return alert("Please log in to submit your daily score!");

    const scoreData = {
      username: user.name,
      wpm: currentWpm > 0 ? currentWpm : 20, // fallback min
      accuracy: 100
    };

    fetch("https://ambarmishradb.onrender.com/api/challenges/submit-daily", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(scoreData)
    })
      .then((res) => {
        if (res.ok) {
          setSubmitted(true);
          fetchLeaderboard();
        }
      })
      .catch((err) => console.error("Error submitting score", err));
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "40px auto", display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px", color: "#fff" }}>
      
      {/* LEFT: Interactive Challenge Area */}
      <div style={{ background: "#1e293b", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h1 style={{ fontSize: "1.8rem", color: "#38bdf8", margin: 0 }}>🌍 Daily Challenge</h1>
          <div style={{ background: "#0f172a", padding: "8px 14px", borderRadius: "8px", color: "#facc15", fontWeight: "bold", fontSize: "0.9rem" }}>
            Resets in: {timeLeft}
          </div>
        </div>

        {/* Live Stats Header Bar */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "20px", background: "#0f172a", padding: "12px 20px", borderRadius: "8px", justifyContent: "space-around" }}>
          <div><span style={{ color: "#64748b" }}>WPM:</span> <strong style={{ color: "#38bdf8" }}>{currentWpm}</strong></div>
          <div><span style={{ color: "#64748b" }}>Accuracy:</span> <strong style={{ color: "#4ade80" }}>100%</strong></div>
          <div><span style={{ color: "#64748b" }}>Time Taken:</span> <strong style={{ color: "#facc15" }}>{time}s</strong></div>
        </div>

        {/* Typable Text Box Rendering */}
        <div style={{ fontSize: "1.4rem", fontFamily: "monospace", background: "#0f172a", padding: "25px", borderRadius: "8px", lineHeight: "1.8", color: "#94a3b8", minHeight: "120px", wordBreak: "break-word" }}>
          {words.length > 0 ? (
            words.map((word, wIdx) => {
              const isCurrentWord = wIdx === currentIndex;
              return (
                <span key={wIdx} style={{ marginRight: "8px", borderBottom: isCurrentWord ? "2px solid #38bdf8" : "none" }}>
                  {word.split("").map((char, cIdx) => {
                    let color = "#94a3b8"; 
                    if (isCurrentWord && cIdx < typed.length) {
                      color = typed[cIdx] === char ? "#4ade80" : "#f87171"; 
                    } else if (wIdx < currentIndex) {
                      color = "#cbd5e1"; 
                    }
                    return <span key={cIdx} style={{ color, backgroundColor: isCurrentWord && cIdx === typed.length ? "rgba(56, 189, 248, 0.3)" : "transparent" }}>{char}</span>;
                  })}
                </span>
              );
            })
          ) : (
            <span>Loading challenge text...</span>
          )}
        </div>

        {finished && !submitted && (
          <div style={{ marginTop: "25px", textAlign: "center", background: "#0f172a", padding: "20px", borderRadius: "8px" }}>
            <h2 style={{ color: "#4ade80", margin: "0 0 10px 0" }}>🎉 Challenge Finished!</h2>
            <p style={{ margin: "0 0 15px 0", color: "#cbd5e1" }}>Final Speed: <strong>{currentWpm} WPM</strong> in <strong>{time}s</strong></p>
            <button 
              onClick={handleScoreSubmit}
              style={{ background: "#22c55e", color: "white", border: "none", padding: "12px 24px", borderRadius: "8px", fontWeight: "bold", fontSize: "1rem", cursor: "pointer" }}
            >
              Submit Score to Daily Leaderboard 🚀
            </button>
          </div>
        )}

        {submitted && (
          <div style={{ marginTop: "20px", textAlign: "center", color: "#4ade80", fontWeight: "bold", padding: "15px", background: "#064e3b", borderRadius: "8px" }}>
            ✅ Score successfully recorded on today's leaderboard!
          </div>
        )}
      </div>

      {/* RIGHT: Live Rankings Leaderboard */}
      <div style={{ background: "#1e293b", padding: "20px", borderRadius: "12px", height: "fit-content" }}>
        <h3 style={{ borderBottom: "2px solid #334155", paddingBottom: "10px", marginTop: 0, color: "#f8fafc" }}>
          🏆 Today's Rankings
        </h3>
        {leaderboard.length === 0 ? (
          <p style={{ color: "#64748b", textAlign: "center", marginTop: "20px" }}>No scores submitted yet today. Set the benchmark!</p>
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