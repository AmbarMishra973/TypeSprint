import { useEffect, useRef, useState } from "react";
import useTypingEngine from "../hooks/useTypingEngine";
import TypingViewport from "./TypingViewport";
import Stats from "./Stats";
import Result from "./Result";
import ModeSelector from "./ModeSelector";
import ThemeSelector from "./ThemeSelector";
import Dashboard from "./Dashboard";
import "../styles/typingBox.css";

function TypingBox() {
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

    punctuationFreq,
    numberFreq,
    updateModifiers,
    isQuoteMode,
    quoteAuthor,
    fetchQuoteTest
  } = useTypingEngine();

  const inputRef = useRef(null);
  const ghostStartTime = useRef(null);
  const [showModifiers, setShowModifiers] = useState(false);
  // 1. Store the freshest functions in a ref to avoid stale closures
  const latestEngine = useRef({ addWpmPoint, finishTest });

  // 2. Keep the ref constantly updated on every render/keystroke
  useEffect(() => {
    latestEngine.current = { addWpmPoint, finishTest };
  });

  // 3. MASTER TIMER & GRAPH TRACKER
  useEffect(() => {
    let timer;

    if (isRunning) {
      timer = setInterval(() => {
        // Add a graph point every second (works for BOTH modes perfectly)
        latestEngine.current.addWpmPoint();

        // Handle the countdown clock ONLY if in time mode
        if (testMode === "time") {
          setTime((prev) => {
            if (prev <= 1) {
              clearInterval(timer); // Stop immediately
              latestEngine.current.finishTest();
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isRunning, testMode, setTime]);

  // GHOST ANIMATION
  useEffect(() => {
    let frame;

    function animate() {
      if (!isRunning || ghostWpm <= 0 || !isRepeat) return;

      if (!ghostStartTime.current) {
        ghostStartTime.current = performance.now();
      }

      const elapsed = (performance.now() - ghostStartTime.current) / 1000;
      const speed = (ghostWpm * 5) / 60;

      setGhostPosition(Math.floor(elapsed * speed));
      frame = requestAnimationFrame(animate);
    }

    if (isRunning && isRepeat) {
      frame = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [isRunning, ghostWpm, isRepeat, setGhostPosition]);

  function keyHandler(e) {
    e.preventDefault();

    if (!isRunning) {
      ghostStartTime.current = null;
      setGhostWpm(stats.bestWpm || 0);
    }

    handleKey(e.key);
  }

  const elapsedTime = Math.floor(getElapsedSeconds());

  return (
    <div className="typing-box">
      <ThemeSelector />
      <div
        style={{ position: "fixed", top: "70px", right: "20px", zIndex: 9999 }}
      >
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          style={{
            padding: "8px 12px",
            borderRadius: "8px",
            background: soundEnabled
              ? "var(--primary-accent)"
              : "var(--card-bg)",
            color: soundEnabled ? "#fff" : "var(--text-main)",
            border: "1px solid var(--text-muted)",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "0.2s",
            width: "140px"
          }}
        >
          {soundEnabled ? "🔊 Sound ON" : "🔇 Sound OFF"}
        </button>
      </div>

      <div
        style={{ position: "fixed", top: "120px", right: "20px", zIndex: 9999 }}
        onMouseEnter={() => setShowModifiers(true)}
        onMouseLeave={() => setShowModifiers(false)}
      >
        <button
          style={{
            padding: "8px 12px",
            borderRadius: "8px",
            background:
              punctuationFreq > 0 || numberFreq > 0
                ? "var(--primary-accent)"
                : "var(--card-bg)",
            color:
              punctuationFreq > 0 || numberFreq > 0
                ? "#fff"
                : "var(--text-main)",
            border: "1px solid var(--text-muted)",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "0.2s",
            width: "140px"
          }}
        >
          ⚙️ Modifiers
        </button>

        {showModifiers && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              right: "0",
              paddingTop: "8px",
              background: "var(--card-bg)",
              border: "1px solid var(--text-muted)",
              padding: "15px",
              borderRadius: "12px",
              marginTop: "8px",
              width: "220px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              color: "var(--text-main)"
            }}
          >
            <div style={{ marginBottom: "15px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "5px"
                }}
              >
                <span style={{ fontWeight: "bold" }}>@ Punctuation</span>
                <span>{punctuationFreq}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={punctuationFreq}
                onChange={(e) =>
                  updateModifiers(Number(e.target.value), numberFreq)
                }
                style={{ width: "100%", cursor: "pointer" }}
              />
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "5px"
                }}
              >
                <span style={{ fontWeight: "bold" }}># Numbers</span>
                <span>{numberFreq}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={numberFreq}
                onChange={(e) =>
                  updateModifiers(punctuationFreq, Number(e.target.value))
                }
                style={{ width: "100%", cursor: "pointer" }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="time-selector">
        {/* 4. CLEAN MODE SELECTOR & SUB-MENUS (Centered) */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        
        {/* Main Mode Buttons */}
        <div className="time-selector" style={{ display: 'flex', gap: '10px' }}>
          <button 
            className={testMode === "time" && !isQuoteMode ? "active-time" : ""} 
            onClick={() => changeTestMode("time")}
          >
            Time
          </button>
          <button 
            className={testMode === "words" && !isQuoteMode ? "active-time" : ""} 
            onClick={() => changeTestMode("words")}
          >
            Words
          </button>
          <button 
            className={isQuoteMode ? "active-time" : ""} 
            onClick={fetchQuoteTest}
          >
            💬 Quotes
          </button>
        </div>

        {/* Sub-menu: Appears ONLY when Time mode is active and not in quotes */}
        {testMode === "time" && !isQuoteMode && (
          <div style={{ display: 'flex', gap: '8px', fontSize: '14px' }}>
            {[15, 30, 60, 120].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTime(t)}
                style={{
                  background: selectedTime === t ? 'var(--primary-accent)' : 'transparent',
                  color: selectedTime === t ? '#fff' : 'var(--text-muted)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}
              >
                {t}s
              </button>
            ))}
          </div>
        )}

        {/* Sub-menu: Appears ONLY when Words mode is active and not in quotes */}
        {testMode === "words" && !isQuoteMode && (
          <div style={{ display: 'flex', gap: '8px', fontSize: '14px' }}>
            {[10, 25, 50, 100].map((w) => (
              <button
                key={w}
                onClick={() => changeWordLimit(w)}
                style={{
                  background: wordLimit === w ? 'var(--primary-accent)' : 'transparent',
                  color: wordLimit === w ? '#fff' : 'var(--text-muted)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}
              >
                {w}
              </button>
            ))}
          </div>
        )}
      </div>
      </div>
      {!finished && (
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary-accent)', marginBottom: '15px', textAlign: 'center' }}>
          {testMode === "time" ? time : elapsedTime}s
        </div>
      )}

      {!finished && (
        <>
          <TypingViewport
            words={words}
            typed={typed}
            currentIndex={currentIndex}
            currentChar={currentChar}
            ghostPosition={ghostPosition}
            isRepeat={isRepeat}
          />

          <Stats
            wpm={calculateWPM()}
            rawWpm={calculateRawWPM()}
            accuracy={calculateAccuracy()}
            characters={correctCharacters}
            errors={incorrectCharacters}
          />

          <input
            ref={inputRef}
            autoFocus
            className="hidden-input"
            onKeyDown={keyHandler}
            onBlur={() => {
              inputRef.current?.focus();
            }}
          />
        </>
      )}

      {finished && (
        <>
          <Result
            wpm={calculateWPM()}
            rawWpm={calculateRawWPM()}
            accuracy={calculateAccuracy()}
            characters={correctCharacters}
            errors={incorrectCharacters}
            history={wpmHistory}
            bestWpm={stats.bestWpm}
            testHistory={stats.recentTests}
            elapsedTime={elapsedTime}
            repeatTest={repeatTest}
            newTest={newTest}
            missedKeys={missedKeys}
            wordTimes={wordTimes}
            keystrokeLog={keystrokeLog}
            words={words}
          />

          <Dashboard stats={stats} onReset={clearStatistics} />
        </>
      )}
    </div>
  );
}

export default TypingBox;
