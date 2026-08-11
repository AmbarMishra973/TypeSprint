import React, { useEffect, useState } from "react";
import { CalendarDays, Trophy, Clock, CheckCircle2, Send, Activity } from "lucide-react";

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

      if (!isRunning) {
        setIsRunning(true);
      }

      const currentWord = words[currentIndex];

      if (e.key === " ") {
        e.preventDefault();
        if (typed.length > 0) {
          const nextIndex = currentIndex + 1;
          setCurrentIndex(nextIndex);
          setTyped("");

          if (nextIndex >= words.length) {
            setFinished(true);
            setIsRunning(false);
          }
        }
      } else if (e.key === "Backspace") {
        setTyped((prev) => prev.slice(0, -1));
      } else if (e.key.length === 1) {
        const newTyped = typed + e.key;
        setTyped(newTyped);

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
      wpm: currentWpm > 0 ? currentWpm : 20, 
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
    <div style={{ maxWidth: "1100px", margin: "40px auto", animation: "fadeIn 0.3s ease", color: "var(--text-primary)" }}>
      
      <style>{`
        .daily-btn {
          background: var(--accent-color);
          color: var(--bg-primary);
          border: none;
          padding: 14px 28px;
          border-radius: 10px;
          font-weight: bold;
          font-size: 1.1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0 auto;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .daily-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        }
        .lb-row {
          display: flex;
          justify-content: space-between;
          padding: 14px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: background 0.2s;
          border-radius: 8px;
        }
        .lb-row:hover {
          background: rgba(255,255,255,0.03);
        }
      `}</style>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "30px" }}>
        
        {/* LEFT: Interactive Challenge Area */}
        <div style={{ background: "var(--bg-secondary)", padding: "30px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", gridColumn: "span 2" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", flexWrap: "wrap", gap: "15px" }}>
            <h1 style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "1.8rem", color: "var(--text-primary)", margin: 0 }}>
              <CalendarDays size={32} color="var(--accent-color)" /> Daily Challenge
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--bg-primary)", padding: "10px 16px", borderRadius: "10px", color: "var(--text-muted)", fontWeight: "600", fontSize: "0.95rem", border: "1px solid rgba(255,255,255,0.05)" }}>
              <Clock size={16} color="var(--accent-color)" /> Resets in: <span style={{color: 'var(--text-primary)'}}>{timeLeft}</span>
            </div>
          </div>

          {/* Live Stats Header Bar */}
          <div style={{ display: "flex", gap: "20px", marginBottom: "30px", background: "var(--bg-primary)", padding: "16px 20px", borderRadius: "12px", justifyContent: "space-around", border: "1px solid rgba(255,255,255,0.02)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)" }}>
              <Activity size={18}/> WPM: <strong style={{ color: "var(--text-primary)", fontSize: "1.2rem", fontFamily: "var(--font-typing, monospace)" }}>{currentWpm}</strong>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)" }}>
              <CheckCircle2 size={18}/> Acc: <strong style={{ color: "var(--text-primary)", fontSize: "1.2rem", fontFamily: "var(--font-typing, monospace)" }}>100%</strong>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)" }}>
              <Clock size={18}/> Time: <strong style={{ color: "var(--accent-color)", fontSize: "1.2rem", fontFamily: "var(--font-typing, monospace)" }}>{time}s</strong>
            </div>
          </div>

          {/* Typable Text Box Rendering */}
          <div style={{ 
            fontSize: "1.5rem", 
            fontFamily: "var(--font-typing, monospace)", 
            lineHeight: "1.7", 
            color: "var(--text-muted)", 
            minHeight: "150px", 
            wordBreak: "break-word",
            textAlign: "left" 
          }}>
            {words.length > 0 ? (
              words.map((word, wIdx) => {
                const isCurrentWord = wIdx === currentIndex;
                return (
                  <span key={wIdx} style={{ marginRight: "12px", position: "relative" }}>
                    {/* Subtle underline for current word */}
                    {isCurrentWord && <div style={{ position: 'absolute', bottom: '-4px', left: 0, width: '100%', height: '2px', background: 'var(--accent-color)', opacity: 0.5, borderRadius: '2px' }}></div>}
                    
                    {word.split("").map((char, cIdx) => {
                      let color = "var(--text-muted)"; 
                      if (isCurrentWord && cIdx < typed.length) {
                        color = typed[cIdx] === char ? "var(--text-primary)" : "var(--error-color)"; 
                      } else if (wIdx < currentIndex) {
                        color = "var(--text-primary)"; 
                      }
                      
                      // Blinking caret effect on the exact character being typed
                      const isCaret = isCurrentWord && cIdx === typed.length;

                      return (
                        <span 
                          key={cIdx} 
                          style={{ 
                            color, 
                            borderLeft: isCaret ? "2px solid var(--accent-color)" : "2px solid transparent",
                            marginLeft: "-2px", // offsets the border width
                            paddingLeft: "2px"
                          }}
                        >
                          {char}
                        </span>
                      );
                    })}
                  </span>
                );
              })
            ) : (
              <span style={{ animation: "pulse 1.5s infinite", color: "var(--text-muted)" }}>Loading today's text...</span>
            )}
          </div>

          {/* Post-Match States */}
          {finished && !submitted && (
            <div style={{ marginTop: "40px", textAlign: "center", background: "var(--bg-primary)", padding: "30px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <h2 style={{ color: "var(--text-primary)", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", margin: "0 0 15px 0" }}>
                <Trophy color="var(--accent-color)"/> Challenge Finished!
              </h2>
              <p style={{ margin: "0 0 25px 0", color: "var(--text-muted)", fontSize: "1.1rem" }}>
                Final Speed: <strong style={{ color: "var(--text-primary)" }}>{currentWpm} WPM</strong> in <strong style={{ color: "var(--text-primary)" }}>{time}s</strong>
              </p>
              <button onClick={handleScoreSubmit} className="daily-btn">
                <Send size={18} /> Submit to Leaderboard
              </button>
            </div>
          )}

          {submitted && (
            <div style={{ marginTop: "30px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", color: "var(--bg-primary)", fontWeight: "bold", padding: "15px", background: "var(--accent-color)", borderRadius: "10px" }}>
              <CheckCircle2 size={20} /> Score successfully recorded for today!
            </div>
          )}
        </div>

        {/* RIGHT: Live Rankings Leaderboard */}
        <div style={{ background: "var(--bg-secondary)", padding: "25px", borderRadius: "16px", height: "fit-content", border: "1px solid rgba(255,255,255,0.05)", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", gridColumn: "span 1" }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "15px", margin: "0 0 15px 0", color: "var(--text-primary)" }}>
            <Trophy size={20} color="var(--accent-color)" /> Today's Rankings
          </h3>
          
          {leaderboard.length === 0 ? (
            <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "30px 0", fontStyle: "italic" }}>
              <CalendarDays size={32} style={{ opacity: 0.5, marginBottom: "10px" }} />
              <br/> No scores submitted yet today. <br/> Set the benchmark!
            </div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {leaderboard.map((entry, index) => {
                const isMe = user?.name === entry.username;
                return (
                  <li key={index} className="lb-row">
                    <span style={{ 
                      fontWeight: isMe ? "bold" : "500", 
                      color: isMe ? "var(--accent-color)" : "var(--text-primary)",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px"
                    }}>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.9rem", width: "20px" }}>{index + 1}.</span> 
                      {entry.username} {isMe && "(You)"}
                    </span>
                    <span style={{ color: "var(--text-primary)", fontWeight: "bold", fontFamily: "var(--font-typing, monospace)" }}>
                      {entry.wpm} <span style={{fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "normal"}}>WPM</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
};

export default DailyChallenge;