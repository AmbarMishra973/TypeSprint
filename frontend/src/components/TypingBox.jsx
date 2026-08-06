import { useEffect, useRef } from "react";
import useTypingEngine from "../hooks/useTypingEngine";
import TypingViewport from "./TypingViewport";
import Stats from "./Stats";
import Result from "./Result";
import ModeSelector from "./ModeSelector";
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
    missedKeys={missedKeys}
  } = useTypingEngine();

  const inputRef = useRef(null);
  const ghostStartTime = useRef(null);

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
      <ModeSelector
        testMode={testMode}
        setTestMode={changeTestMode}
        selectedTime={selectedTime}
        setSelectedTime={(value) => {
          setSelectedTime(value);
          setTime(value);
        }}
        wordLimit={wordLimit}
        setWordLimit={changeWordLimit}
      />

      <div className="timer">
        {testMode === "time" ? (
          <>Time Left : {time}s</>
        ) : (
          <>Time Taken : {elapsedTime}s</>
        )}
      </div>

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
          />

          <Dashboard stats={stats} onReset={clearStatistics} />
        </>
      )}
    </div>
  );
}

export default TypingBox;
