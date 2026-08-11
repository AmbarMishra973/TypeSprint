import { useEffect, useRef, useState } from "react";
import { AtSign, Hash, Clock, Type, MessageSquareQuote } from 'lucide-react';
import TypingViewport from "./TypingViewport";
import Stats from "./Stats";
import Result from "./Result";
import ModeSelector from "./ModeSelector";
import ThemeSelector from "./ThemeSelector";
import "../styles/typingBox.css";
import MatchResultModal from "./MatchResultModal";
// 🚀 ADDED NEW PROPS: user, activeChallenge, setActiveChallenge
function TypingBox({ engine, user, activeChallenge, setActiveChallenge }) {
  const {
    words,
    typed,
    currentIndex,
    currentChar,
    handleKey,
    time,
    setTime,
    selectedTime,
    setSelectedTime,
    testMode,
    changeTestMode,
    wordLimit,
    changeWordLimit,
    isRunning,
    setIsRunning,
    finished,
    repeatTest,
    newTest,
    calculateAccuracy,
    calculateWPM,
    calculateRawWPM,
    correctCharacters,
    incorrectCharacters,
    wpmHistory,
    addWpmPoint,
    ghostPosition,
    setGhostPosition,
    ghostWpm,
    setGhostWpm,
    getElapsedSeconds,
    stats,
    clearStatistics,
    isRepeat,
    finishTest,
    wordTimes,
    keystrokeLog,
    missedKeys = { missedKeys },
    soundEnabled,
    setSoundEnabled,
    changeTimeLimit,
    punctuationFreq,
    numberFreq,
    updateModifiers,
    isQuoteMode,
    quoteAuthor,
    fetchQuoteTest,
    repeatBestWpm,
  } = engine;

  const inputRef = useRef(null);
  const ghostStartTime = useRef(null);
  const [showModifiers, setShowModifiers] = useState(false);
  const [matchCountdown, setMatchCountdown] = useState(null);
    const [matchResult, setMatchResult] = useState(null);
    const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [completedMatch, setCompletedMatch] = useState(null);
  // 🔊 AUDIO SETUP (Only initialize once)
  const audioRefs = useRef({
    tick: new Audio('/sounds/tick.mp3'),
    go: new Audio('/sounds/go.mp3'),
    win: new Audio('/sounds/win.mp3'),
    lose: new Audio('/sounds/lose.mp3')
  });

  // Helper function to play sound if not muted
  const playSound = (soundName) => {
    if (soundEnabled && audioRefs.current[soundName]) {
      audioRefs.current[soundName].currentTime = 0; // Reset to start
      audioRefs.current[soundName].play().catch(e => console.log("Audio play blocked by browser:", e));
    }
  };
  const latestEngine = useRef({ 
    addWpmPoint, finishTest, words, currentIndex, currentChar, correctCharacters, incorrectCharacters 
  });

  useEffect(() => {
    latestEngine.current = { 
      addWpmPoint, finishTest, words, currentIndex, currentChar, correctCharacters, incorrectCharacters 
    };
  });

  // 🚀 1. LOCK IDENTICAL WORDS IF IN A CHALLENGE
  useEffect(() => {
    if (activeChallenge && activeChallenge.wordsText) {
      // If your engine supports setting custom words, apply them here:
      // engine.setCustomWords(activeChallenge.wordsText.split(" "));
    }
  }, [activeChallenge]);

  // 🚀 2. BROADCAST MY POSITION & POLL OPPONENT POSITION
  useEffect(() => {
    if (!activeChallenge || !user || finished) return;

    // Send my current position every 1 second
    const progressInterval = setInterval(() => {
      fetch(`https://ambarmishradb.onrender.com/api/challenges/${activeChallenge.id}/progress?username=${user.name}&position=${currentIndex}`, {
        method: "POST"
      }).catch(() => {});
    }, 1000);

    // Poll opponent's position every 1 second
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`https://ambarmishradb.onrender.com/api/challenges/${activeChallenge.id}/progress`);
        if (res.ok) {
          const positions = await res.json();
          // Find the opponent's name (whoever isn't me)
          const opponentName = activeChallenge.senderName === user.name ? activeChallenge.receiverName : activeChallenge.senderName;
          const opponentIndex = positions[opponentName];
          if (opponentIndex !== undefined) {
            setGhostPosition(opponentIndex); // 👻 Moves your friend's live cursor on your screen!
          }
        }
      } catch (err) {}
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(pollInterval);
    };
  }, [activeChallenge, user, currentIndex, finished, setGhostPosition]);



  // Poll challenge status to see if opponent finished and winner is declared
  useEffect(() => {
    if (!activeChallenge) return;
    const checkWinnerInterval = setInterval(async () => {
      try {
        const res = await fetch(`https://ambarmishradb.onrender.com/api/challenges/${activeChallenge.id}/active`);
        // If active returns empty, check full challenge details or status
      } catch (err) {}
    }, 2000);
    return () => clearInterval(checkWinnerInterval);
  }, [activeChallenge]);
  // 3. MASTER TIMER & GRAPH TRACKER
  useEffect(() => {
    let timer;

    if (isRunning) {
      timer = setInterval(() => {
        // Only call graph points if the function exists
        if (latestEngine.current?.addWpmPoint) {
          latestEngine.current.addWpmPoint();
        }

        if (testMode === "time") {
          setTime((prev) => {
            if (prev <= 1) {
              clearInterval(timer); 
              if (latestEngine.current?.finishTest) {
                latestEngine.current.finishTest();
              }
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    
    return () => clearInterval(timer);
  }, [isRunning, testMode]); // Removed setTime from dependencies to prevent interval re-triggering loops

  // 🚀 CHALLENGE MODE PART 1: LOCK THE TIMER
  // 🚀 CHALLENGE MODE: Start 3-2-1 Countdown Sync
  useEffect(() => {
    if (activeChallenge && !finished && !isRunning) {
      setMatchCountdown(3); // Trigger the 3 second countdown
      changeTestMode("time"); 
      changeTimeLimit(activeChallenge.duration); 
      setTime(activeChallenge.duration); 
    }
  }, [activeChallenge, finished]);

  // 🚀 CHALLENGE MODE: Handle the Countdown & Auto-Start
  // 🚀 CHALLENGE MODE: Handle the Countdown & Auto-Start
  useEffect(() => {
    if (matchCountdown !== null && matchCountdown > 0) {
      playSound("tick"); // 🔊 Play tick on 3, 2, 1
      const timer = setTimeout(() => setMatchCountdown(matchCountdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (matchCountdown === 0) {
      playSound("go"); // 🔊 Play loud chime on GO!
      setMatchCountdown(null); // Clear countdown overlay
      setIsRunning(true); // 🚀 FORCE START THE ENGINE
      if (inputRef.current) inputRef.current.focus(); // Focus the invisible input box
    }
  }, [matchCountdown, setIsRunning]); // (Make sure to include playSound in dependencies if linter complains, or leave as is)

  // 🚀 CHALLENGE MODE PART 2: SUBMIT SCORE & WAIT FOR OPPONENT
 // 🚀 CHALLENGE MODE PART 2: SUBMIT SCORE & WAIT FOR OPPONENT
  useEffect(() => {
    if (finished && activeChallenge && user && !waitingForOpponent && !completedMatch) {
      const finalWpm = calculateWPM();
      setWaitingForOpponent(true); // Stop player from leaving screen

      fetch(`https://ambarmishradb.onrender.com/api/challenges/${activeChallenge.id}/submit?username=${user.name}&wpm=${finalWpm}`, {
        method: "POST"
      })
      .then(res => res.json())
      .then(data => {
        // 🐛 BUG 1 FIX: If the backend says the match is ALREADY COMPLETED (opponent finished first), show modal instantly!
        if (data.status === "COMPLETED") {
          setCompletedMatch(data);
          setWaitingForOpponent(false);
        }
      })
      .catch(err => console.error("Error submitting challenge:", err));
    }
  }, [finished, activeChallenge, user, calculateWPM, waitingForOpponent, completedMatch]);

  // 🧹 BUG 2 FIX: Clear old match results when a NEW challenge ID arrives
  // 🧹 FORCE RESET ON EVERY NEW CHALLENGE ID
  // 🧹 FORCE RESET ON EVERY NEW CHALLENGE ID
  // 🧹 FORCE RESET ON EVERY NEW CHALLENGE ID
  useEffect(() => {
    if (activeChallenge) {
      setCompletedMatch(null);
      setWaitingForOpponent(false);
      
      // Safely reset the typing engine using built-in methods
      if (typeof engine.resetTest === "function") {
        engine.resetTest();
      } else if (typeof engine.restart === "function") {
        engine.restart();
      }

      if (activeChallenge.wordsText && typeof engine.setWords === "function") {
        engine.setWords(activeChallenge.wordsText);
      }
    }
  }, [activeChallenge?.id]);
  // 🚀 CHALLENGE MODE PART 3: POLL FOR MATCH RESULT
  useEffect(() => {
    let pollTimer;
    if (waitingForOpponent && activeChallenge) {
      pollTimer = setInterval(async () => {
        try {
          const res = await fetch(`https://ambarmishradb.onrender.com/api/challenges/${activeChallenge.id}`);
          if (res.ok) {
            const data = await res.json();
            if (data.status === "COMPLETED") {
              setCompletedMatch(data); // Triggers the scoreboard modal
              setWaitingForOpponent(false); // Removes the waiting overlay
              
              // 🔊 Play Win or Loss sound!
              if (data.winnerName === user.name) {
                playSound("win");
              } else if (data.winnerName !== "TIE") {
                playSound("lose");
              }
            }
          }
        } catch (e) {}
      }, 2000); // Check every 2 seconds if opponent finished
    }
    return () => clearInterval(pollTimer);
  }, [waitingForOpponent, activeChallenge]);

  // 🤖 BOT LOGIC: If playing against a bot, automatically submit the bot's score after test starts
  useEffect(() => {
    if (activeChallenge && (activeChallenge.receiverName === "Bot_Typist" || activeChallenge.senderName === "Bot_Typist") && user) {
      const botName = activeChallenge.senderName === user.name ? activeChallenge.receiverName : activeChallenge.senderName;
      
      // If the bot hasn't submitted a score yet, simulate it finishing after 20 seconds
      const botTimer = setTimeout(() => {
        fetch(`${API_BASE_URL}/api/challenges/${activeChallenge.id}/submit?username=${botName}&wpm=55`, {
          method: "POST"
        }).catch(err => console.error("Bot submission error:", err));
      }, 20000); // Bot finishes typing in 20 seconds (around 55 WPM)

      return () => clearTimeout(botTimer);
    }
  }, [activeChallenge, user]);
  // Handle closing modal & rematching
  // Handle closing modal & rematching
  const closeMatchModal = () => {
    setCompletedMatch(null);
    setActiveChallenge(null);
    
    // 🧹 FORCE RESET THE ENGINE FOR THE NEXT MATCH
    if (engine.restart) {
      engine.restart(); 
    } else if (engine.reset) {
      engine.reset(); // Just in case you named it reset instead of restart!
    }
  };

  const handleRematch = async (opponentName, duration) => {
    await fetch(`https://ambarmishradb.onrender.com/api/challenges/send?sender=${user.name}&receiver=${opponentName}&duration=${duration}`, { method: "POST" });
    alert(`Rematch sent to ${opponentName}! Waiting for them to accept.`);
    closeMatchModal(); // This will now clear the modal AND reset the engine!
  };

  // 📝 BUG 3 FIX: Override local words with the shared multiplayer words!
  useEffect(() => {
    if (activeChallenge && activeChallenge.wordsText && engine.setWords) {
      engine.setWords(activeChallenge.wordsText);
    }
  }, [activeChallenge, engine]);
  // GHOST ANIMATION
  useEffect(() => {
    let frame;

    function animate() {
      if (!isRunning || ghostWpm <= 0 || !isRepeat) return;

      if (!ghostStartTime.current) {
        ghostStartTime.current = performance.now();
      }

      const { words, currentIndex, currentChar, correctCharacters, incorrectCharacters } = latestEngine.current;

      let expectedTrackLength = 0;
      for (let i = 0; i < currentIndex; i++) {
        expectedTrackLength += words[i]?.length || 0;
      }
      const userTrackPosition = expectedTrackLength + currentIndex + currentChar;
      const userTypedEffort = correctCharacters + incorrectCharacters;
      const skippedCharacters = userTrackPosition - userTypedEffort;

      const elapsed = (performance.now() - ghostStartTime.current) / 1000;
      const speed = (ghostWpm * 5) / 60; 

      const finalPosition = Math.max(0, Math.floor((elapsed * speed) + skippedCharacters));
      
      setGhostPosition(finalPosition);
      frame = requestAnimationFrame(animate);
    }

    if (isRunning && isRepeat) {
      frame = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(frame);
  }, [isRunning, ghostWpm, isRepeat, setGhostPosition]);

  function keyHandler(e) {
    e.preventDefault();
    if (!isRunning) {
      ghostStartTime.current = null;
      setGhostWpm(isRepeat ? repeatBestWpm : (stats.bestWpm || 0));
    }
    handleKey(e.key);
  }
  
  const elapsedTime = Math.floor(getElapsedSeconds());

  return (
    <div className="typing-box" onClick={() => inputRef.current?.focus()}>

      {/* Keep the Countdown Overlay right at the top */}
      {matchCountdown !== null && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.85)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", zIndex: 10000 }}>
          <h2 style={{ color: "#fff", fontSize: "2rem", marginBottom: "20px" }}>Match Starting...</h2>
          <div style={{ color: "#fbbf24", fontSize: "10rem", fontWeight: "bold", animation: "pulse 1s infinite" }}>
            {matchCountdown > 0 ? matchCountdown : "GO!"}
          </div>
        </div>
      )}

      {/* 🚀 CHALLENGE MODE: Hide regular settings so user can't cheat */}
      {activeChallenge ? (
        <div style={{ textAlign: "center", color: "#fbbf24", marginBottom: "40px", fontWeight: "bold", fontSize: "1.2rem", padding: "10px", border: "2px dashed #fbbf24", borderRadius: "8px" }}>
          ⚔️ CHALLENGE MODE ACTIVE: {activeChallenge.duration}s
        </div>
      ) : (
        /* 🚀 NEW UNIFIED CONTROL BAR */
        <div className="typing-control-bar">
          
          {/* SECTION 1: Modifiers (Left) */}
          <div className="control-group">
            <button 
              className={`control-btn ${punctuationFreq > 0 ? 'active' : ''}`}
              onClick={() => updateModifiers(punctuationFreq > 0 ? 0 : 50, numberFreq)}
              title="Toggle Punctuation"
            >
              <AtSign size={14} /> punctuation
            </button>
            <button 
              className={`control-btn ${numberFreq > 0 ? 'active' : ''}`}
              onClick={() => updateModifiers(punctuationFreq, numberFreq > 0 ? 0 : 50)}
              title="Toggle Numbers"
            >
              <Hash size={14} /> numbers
            </button>
          </div>

          <div className="control-divider"></div>

          {/* SECTION 2: Primary Modes (Center) */}
          <div className="control-group">
            <button 
              className={`control-btn ${testMode === "time" && !isQuoteMode ? "active" : ""}`} 
              onClick={() => changeTestMode("time")}
            >
              <Clock size={14} /> time
            </button>
            <button 
              className={`control-btn ${testMode === "words" && !isQuoteMode ? "active" : ""}`} 
              onClick={() => changeTestMode("words")}
            >
              <Type size={14} /> words
            </button>
            <button 
              className={`control-btn ${isQuoteMode ? "active" : ""}`} 
              onClick={fetchQuoteTest}
            >
              <MessageSquareQuote size={14} /> quote
            </button>
          </div>

          {/* SECTION 3: Subtypes (Right) - Dynamically rendered! */}
          {!isQuoteMode && (
            <>
              <div className="control-divider"></div>
              <div className="control-group">
                {testMode === "time" && [15, 30, 60, 120].map((t) => (
                  <button 
                    key={t} 
                    className={`control-btn ${selectedTime === t ? "active" : ""}`}
                    onClick={() => changeTimeLimit(t)}
                  >
                    {t}
                  </button>
                ))}
                
                {testMode === "words" && [10, 25, 50, 100].map((w) => (
                  <button 
                    key={w} 
                    className={`control-btn ${wordLimit === w ? "active" : ""}`}
                    onClick={() => changeWordLimit(w)}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </>
          )}

        </div>
      )}
      {!finished && (
        <div className="live-timer-container">
          
          {/* Quote Author */}
          {isQuoteMode && quoteAuthor && (
            <div className="quote-author">~ {quoteAuthor}</div>
          )}
          
          {/* Centralized Sleek Timer */}
          <div className="live-countdown">
            {testMode === "time" ? time : elapsedTime}
          </div>
          
          {/* Ghost Racer Info */}
          {isRepeat && repeatBestWpm > 0 && (
            <div className="ghost-racer-stats">
              👻 Racing Ghost: <span>{repeatBestWpm} WPM</span>
            </div>
          )}
          
        </div>
      )}

      {!finished && (
        <>
          <TypingViewport words={words} typed={typed} currentIndex={currentIndex} currentChar={currentChar} ghostPosition={ghostPosition} isRepeat={isRepeat} />
          <Stats wpm={calculateWPM()} rawWpm={calculateRawWPM()} accuracy={calculateAccuracy()} characters={correctCharacters} errors={incorrectCharacters} />
          <input ref={inputRef} autoFocus className="hidden-input" onKeyDown={keyHandler} />
        </>
      )}

      {finished && (
        <>
          <Result wpm={calculateWPM()} rawWpm={calculateRawWPM()} accuracy={calculateAccuracy()} characters={correctCharacters} errors={incorrectCharacters} history={wpmHistory} bestWpm={stats.bestWpm} testHistory={stats.recentTests} elapsedTime={elapsedTime} repeatTest={repeatTest} newTest={newTest} missedKeys={missedKeys} wordTimes={wordTimes} keystrokeLog={keystrokeLog} words={words} />
        </>
      )}
      {/* 🚀 WAITING OVERLAY (Shows when you finish before opponent) */}
      {waitingForOpponent && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.85)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10000 }}>
          <h2 style={{ color: "#38bdf8", animation: "pulse 1.5s infinite" }}>Waiting for opponent to finish... ⏳</h2>
        </div>
      )}

      {/* 🚀 SCOREBOARD MODAL (Shows when both are finished) */}
      {completedMatch && (
        <MatchResultModal 
          challenge={completedMatch} 
          currentUser={user} 
          onClose={closeMatchModal} 
          onRematch={handleRematch} 
        />
      )}
    </div>
  );
}

export default TypingBox;