import { useEffect, useRef, useState } from "react";

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
        latestEngine.current.addWpmPoint();

        if (testMode === "time") {
          setTime((prev) => {
            if (prev <= 1) {
              clearInterval(timer); 
              latestEngine.current.finishTest();
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, testMode, setTime]);

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
  useEffect(() => {
    if (matchCountdown !== null && matchCountdown > 0) {
      const timer = setTimeout(() => setMatchCountdown(matchCountdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (matchCountdown === 0) {
      setMatchCountdown(null); // Clear countdown overlay
      setIsRunning(true); // 🚀 FORCE START THE ENGINE
      if (inputRef.current) inputRef.current.focus(); // Focus the invisible input box
    }
  }, [matchCountdown, setIsRunning]);


  // 🚀 CHALLENGE MODE PART 2: SUBMIT SCORE & WAIT FOR OPPONENT
  useEffect(() => {
    if (finished && activeChallenge && user && !waitingForOpponent && !completedMatch) {
      const finalWpm = calculateWPM();
      setWaitingForOpponent(true); // Stop player from leaving screen

      fetch(`https://ambarmishradb.onrender.com/api/challenges/${activeChallenge.id}/submit?username=${user.name}&wpm=${finalWpm}`, {
        method: "POST"
      }).catch(err => console.error("Error submitting challenge:", err));
    }
  }, [finished, activeChallenge, user, calculateWPM, waitingForOpponent, completedMatch]);

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
            }
          }
        } catch (e) {}
      }, 2000); // Check every 2 seconds if opponent finished
    }
    return () => clearInterval(pollTimer);
  }, [waitingForOpponent, activeChallenge]);

  // Handle closing modal & rematching
  const closeMatchModal = () => {
    setCompletedMatch(null);
    setActiveChallenge(null);
  };

  const handleRematch = async (opponentName, duration) => {
    await fetch(`https://ambarmishradb.onrender.com/api/challenges/send?sender=${user.name}&receiver=${opponentName}&duration=${duration}`, { method: "POST" });
    alert(`Rematch sent to ${opponentName}! Waiting for them to accept.`);
    closeMatchModal();
  };

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
      <ThemeSelector />
      {matchCountdown !== null && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.85)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", zIndex: 10000 }}>
          <h2 style={{ color: "#fff", fontSize: "2rem", marginBottom: "20px" }}>Match Starting...</h2>
          <div style={{ color: "#fbbf24", fontSize: "10rem", fontWeight: "bold", animation: "pulse 1s infinite" }}>
            {matchCountdown > 0 ? matchCountdown : "GO!"}
          </div>
        </div>
      )}
      {/* Sound Settings Button */}
      <div style={{ position: "fixed", top: "70px", right: "20px", zIndex: 9999 }}>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          style={{ padding: "8px 12px", borderRadius: "8px", background: soundEnabled ? "var(--primary-accent)" : "var(--card-bg)", color: soundEnabled ? "#fff" : "var(--text-main)", border: "1px solid var(--text-muted)", cursor: "pointer", fontWeight: "bold", transition: "0.2s", width: "140px" }}
        >
          {soundEnabled ? "🔊 Sound ON" : "🔇 Sound OFF"}
        </button>
      </div>

      {/* Modifiers Button */}
      <div style={{ position: "fixed", top: "120px", right: "20px", zIndex: 9999 }} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setShowModifiers(!showModifiers)}
          style={{ padding: "8px 12px", borderRadius: "8px", background: punctuationFreq > 0 || numberFreq > 0 ? "var(--primary-accent)" : "var(--card-bg)", color: punctuationFreq > 0 || numberFreq > 0 ? "#fff" : "var(--text-main)", border: "1px solid var(--text-muted)", cursor: "pointer", fontWeight: "bold", transition: "0.2s", width: "140px" }}
        >
          ⚙️ Modifiers
        </button>

        {showModifiers && (
          <div style={{ position: "absolute", top: "100%", right: "0", paddingTop: "8px", background: "var(--card-bg)", border: "1px solid var(--text-muted)", padding: "15px", borderRadius: "12px", marginTop: "8px", width: "220px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", color: "var(--text-main)" }}>
            <div style={{ marginBottom: "15px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <span style={{ fontWeight: "bold" }}>@ Punctuation</span>
                <span>{punctuationFreq}%</span>
              </div>
              <input type="range" min="0" max="100" step="5" value={punctuationFreq} onChange={(e) => updateModifiers(Number(e.target.value), numberFreq)} style={{ width: "100%", cursor: "pointer" }} />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <span style={{ fontWeight: "bold" }}># Numbers</span>
                <span>{numberFreq}%</span>
              </div>
              <input type="range" min="0" max="100" step="5" value={numberFreq} onChange={(e) => updateModifiers(punctuationFreq, Number(e.target.value))} style={{ width: "100%", cursor: "pointer" }} />
            </div>
          </div>
        )}
      </div>

      {/* 🚀 CHALLENGE MODE: Hide regular settings so user can't cheat */}
      {activeChallenge ? (
        <div style={{ textAlign: "center", color: "#fbbf24", marginBottom: "20px", fontWeight: "bold", fontSize: "1.2rem", padding: "10px", border: "2px dashed #fbbf24", borderRadius: "8px" }}>
          ⚔️ CHALLENGE MODE ACTIVE: {activeChallenge.duration}s
        </div>
      ) : (
        <div className="time-selector">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            
            <div className="time-selector" style={{ display: 'flex', gap: '10px' }}>
              <button className={testMode === "time" && !isQuoteMode ? "active-time" : ""} onClick={() => changeTestMode("time")}>Time</button>
              <button className={testMode === "words" && !isQuoteMode ? "active-time" : ""} onClick={() => changeTestMode("words")}>Words</button>
              <button className={isQuoteMode ? "active-time" : ""} onClick={fetchQuoteTest}>💬 Quotes</button>
            </div>

            {testMode === "time" && !isQuoteMode && (
              <div style={{ display: 'flex', gap: '8px', fontSize: '14px' }}>
                {[15, 30, 60, 120].map((t) => (
                  <button key={t} onClick={() => changeTimeLimit(t)} style={{ background: selectedTime === t ? 'var(--primary-accent)' : 'transparent', color: selectedTime === t ? '#fff' : 'var(--text-muted)', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{t}s</button>
                ))}
              </div>
            )}

            {testMode === "words" && !isQuoteMode && (
              <div style={{ display: 'flex', gap: '8px', fontSize: '14px' }}>
                {[10, 25, 50, 100].map((w) => (
                  <button key={w} onClick={() => changeWordLimit(w)} style={{ background: wordLimit === w ? 'var(--primary-accent)' : 'transparent', color: wordLimit === w ? '#fff' : 'var(--text-muted)', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{w}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {!finished && (
        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
          {isQuoteMode && quoteAuthor && (
            <div style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '8px', fontStyle: 'italic' }}>~ {quoteAuthor}</div>
          )}
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary-accent)' }}>
            {testMode === "time" ? time : elapsedTime}s
          </div>
          {isRepeat && repeatBestWpm > 0 && (
            <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px', fontWeight: '500' }}>
              👻 Racing Ghost: <span style={{ color: 'var(--primary-accent)', fontWeight: 'bold' }}>{repeatBestWpm} WPM</span>
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