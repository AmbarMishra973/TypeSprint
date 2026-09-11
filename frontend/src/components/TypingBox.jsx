import { useEffect, useRef, useState } from "react";
import {
  AtSign,
  Hash,
  Clock,
  Type,
  MessageSquareQuote,
  CodeXml,
  Target,
  Volume2,
  VolumeX,
} from "lucide-react";
import TypingViewport from "./TypingViewport";
import Stats from "./Stats";
import Result from "./Result";
import ThemeSelector from "./ThemeSelector";
import "../styles/typingBox.css";
import MatchResultModal from "./MatchResultModal";

function TypingBox({
  engine,
  user,
  activeChallenge,
  setActiveChallenge,
}) {
  const {
    words,
    typed,
    currentIndex,
    currentChar,
    handleKey,
    time,
    setTime,
    selectedTime,
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
    ghostPosition,
    setGhostPosition,
    ghostWpm,
    setGhostWpm,
    getElapsedSeconds,
    stats,
    isRepeat,
    wordTimes,
    keystrokeLog,
    missedKeys = {},
    soundEnabled,
    setSoundEnabled,
    changeTimeLimit,
    punctuationFreq,
    numberFreq,
    updateModifiers,
    isQuoteMode,
    quoteAuthor,
    fetchQuoteTest,
    startWeakKeyPractice,
    startCodeTest,
    repeatBestWpm,
    bestRunHistory,
  } = engine;

  const inputRef = useRef(null);
  const ghostStartTime = useRef(null);

  const [matchCountdown, setMatchCountdown] = useState(null);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [completedMatch, setCompletedMatch] = useState(null);

  // Sound generator using the Web Audio API.
  const playSound = (type) => {
    if (!soundEnabled) return;

    try {
      const ctx = new (
        window.AudioContext || window.webkitAudioContext
      )();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "tick") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(
          80,
          ctx.currentTime + 0.04
        );

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.01,
          ctx.currentTime + 0.04
        );

        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      } else if (type === "go") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(
          600,
          ctx.currentTime + 0.15
        );

        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.01,
          ctx.currentTime + 0.15
        );

        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === "win") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);

        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.01,
          ctx.currentTime + 0.4
        );

        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === "lose") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(
          150,
          ctx.currentTime + 0.3
        );

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.01,
          ctx.currentTime + 0.3
        );

        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      console.error("Audio playback error:", e);
    }
  };

  const latestEngine = useRef({
    addWpmPoint,
    finishTest,
    words,
    currentIndex,
    currentChar,
    correctCharacters,
    incorrectCharacters,
  });

  useEffect(() => {
    latestEngine.current = {
      addWpmPoint,
      finishTest,
      words,
      currentIndex,
      currentChar,
      correctCharacters,
      incorrectCharacters,
    };
  });

  // Lock the challenge to the shared word list.
  useEffect(() => {
    if (activeChallenge && activeChallenge.wordsText) {
      // If the engine supports custom words, apply them here.
      // engine.setCustomWords(activeChallenge.wordsText.split(" "));
    }
  }, [activeChallenge]);

  // Broadcast my position and poll the opponent's position.
  useEffect(() => {
    if (!activeChallenge || !user || finished) return;

    const progressInterval = setInterval(() => {
      fetch(
        `https://ambarmishradb.onrender.com/api/challenges/${activeChallenge.id}/progress?username=${user.name}&position=${currentIndex}`,
        {
          method: "POST",
        }
      ).catch(() => {});
    }, 1000);

    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(
          `https://ambarmishradb.onrender.com/api/challenges/${activeChallenge.id}/progress`
        );

        if (res.ok) {
          const positions = await res.json();

          const opponentName =
            activeChallenge.senderName === user.name
              ? activeChallenge.receiverName
              : activeChallenge.senderName;

          const opponentIndex = positions[opponentName];

          if (opponentIndex !== undefined) {
            setGhostPosition(opponentIndex);
          }
        }
      } catch {
        // Ignored
      }
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(pollInterval);
    };
  }, [
    activeChallenge,
    user,
    currentIndex,
    finished,
    setGhostPosition,
  ]);

  // Poll challenge status to check whether the opponent has finished.
  useEffect(() => {
    if (!activeChallenge) return;

    const checkWinnerInterval = setInterval(async () => {
      try {
        await fetch(
          `https://ambarmishradb.onrender.com/api/challenges/${activeChallenge.id}/active`
        );
      } catch {
        // Ignored
      }
    }, 2000);

    return () => clearInterval(checkWinnerInterval);
  }, [activeChallenge]);

  // Master timer and graph tracker.
  useEffect(() => {
    let timer;

    if (isRunning) {
      timer = setInterval(() => {
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
  }, [isRunning, testMode]);

  // Start the challenge countdown and lock the test settings.
  useEffect(() => {
    if (activeChallenge && !finished && !isRunning) {
      setMatchCountdown(3);
      changeTestMode("time");
      changeTimeLimit(activeChallenge.duration);
      setTime(activeChallenge.duration);
    }
  }, [activeChallenge, finished]);

  // Handle the countdown and automatically start the test.
  useEffect(() => {
    if (matchCountdown !== null && matchCountdown > 0) {
      playSound("tick");

      const timer = setTimeout(
        () => setMatchCountdown(matchCountdown - 1),
        1000
      );

      return () => clearTimeout(timer);
    }

    if (matchCountdown === 0) {
      playSound("go");
      setMatchCountdown(null);
      setIsRunning(true);

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [matchCountdown, setIsRunning]);

  // Submit the score and wait for the opponent.
  useEffect(() => {
    if (
      finished &&
      activeChallenge &&
      user &&
      !waitingForOpponent &&
      !completedMatch
    ) {
      const finalWpm = calculateWPM();

      setWaitingForOpponent(true);

      fetch(
        `https://ambarmishradb.onrender.com/api/challenges/${activeChallenge.id}/submit?username=${user.name}&wpm=${finalWpm}`,
        {
          method: "POST",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "COMPLETED") {
            setCompletedMatch(data);
            setWaitingForOpponent(false);
          }
        })
        .catch((err) =>
          console.error("Error submitting challenge:", err)
        );
    }
  }, [
    finished,
    activeChallenge,
    user,
    calculateWPM,
    waitingForOpponent,
    completedMatch,
  ]);

  // Reset match state whenever a new challenge arrives.
  useEffect(() => {
    if (activeChallenge) {
      setCompletedMatch(null);
      setWaitingForOpponent(false);

      if (typeof engine.resetTest === "function") {
        engine.resetTest();
      } else if (typeof engine.restart === "function") {
        engine.restart();
      }

      if (
        activeChallenge.wordsText &&
        typeof engine.setWords === "function"
      ) {
        engine.setWords(activeChallenge.wordsText);
      }
    }
  }, [activeChallenge?.id]);

  // Poll for the final match result.
  useEffect(() => {
    let pollTimer;

    if (waitingForOpponent && activeChallenge) {
      pollTimer = setInterval(async () => {
        try {
          const res = await fetch(
            `https://ambarmishradb.onrender.com/api/challenges/${activeChallenge.id}`
          );

          if (res.ok) {
            const data = await res.json();

            if (data.status === "COMPLETED") {
              setCompletedMatch(data);
              setWaitingForOpponent(false);

              if (data.winnerName === user.name) {
                playSound("win");
              } else if (data.winnerName !== "TIE") {
                playSound("lose");
              }
            }
          }
        } catch (e) {}
      }, 2000);
    }

    return () => clearInterval(pollTimer);
  }, [waitingForOpponent, activeChallenge]);

  // Submit a simulated score when playing against a bot.
  useEffect(() => {
    if (
      activeChallenge &&
      (
        activeChallenge.receiverName === "Bot_Typist" ||
        activeChallenge.senderName === "Bot_Typist"
      ) &&
      user
    ) {
      const botName =
        activeChallenge.senderName === user.name
          ? activeChallenge.receiverName
          : activeChallenge.senderName;

      const botTimer = setTimeout(() => {
        fetch(
          `${API_BASE_URL}/api/challenges/${activeChallenge.id}/submit?username=${botName}&wpm=55`,
          {
            method: "POST",
          }
        ).catch((err) =>
          console.error("Bot submission error:", err)
        );
      }, 20000);

      return () => clearTimeout(botTimer);
    }
  }, [activeChallenge, user]);

  const closeMatchModal = () => {
    setCompletedMatch(null);
    setActiveChallenge(null);

    if (engine.restart) {
      engine.restart();
    } else if (engine.reset) {
      engine.reset();
    }
  };

  const handleRematch = async (opponentName, duration) => {
    await fetch(
      `https://ambarmishradb.onrender.com/api/challenges/send?sender=${user.name}&receiver=${opponentName}&duration=${duration}`,
      {
        method: "POST",
      }
    );

    alert(`Rematch sent to ${opponentName}! Waiting for them to accept.`);
    closeMatchModal();
  };

  // Override local words with the shared multiplayer words.
  useEffect(() => {
    if (
      activeChallenge &&
      activeChallenge.wordsText &&
      engine.setWords
    ) {
      engine.setWords(activeChallenge.wordsText);
    }
  }, [activeChallenge, engine]);

  // Animate the local best-WPM ghost during repeat tests.
  useEffect(() => {
    let frame;

    function animate() {
      if (
        !isRunning ||
        ghostWpm <= 0 ||
        !isRepeat ||
        activeChallenge
      ) {
        return;
      }

      if (!ghostStartTime.current) {
        ghostStartTime.current = performance.now();
      }

      const {
        words,
        currentIndex,
        currentChar,
        correctCharacters,
        incorrectCharacters,
      } = latestEngine.current;

      let expectedTrackLength = 0;

      for (let i = 0; i < currentIndex; i++) {
        expectedTrackLength += words[i]?.length || 0;
      }

      const userTrackPosition =
        expectedTrackLength + currentIndex + currentChar;

      const userTypedEffort =
        correctCharacters + incorrectCharacters;

      const skippedCharacters =
        userTrackPosition - userTypedEffort;

      const elapsed =
        (performance.now() - ghostStartTime.current) / 1000;

      const speed = (ghostWpm * 5) / 60;
      const finalPosition = Math.max(
        0,
        Math.floor(elapsed * speed + skippedCharacters)
      );

      setGhostPosition(finalPosition);
      frame = requestAnimationFrame(animate);
    }

    if (isRunning && isRepeat && !activeChallenge) {
      frame = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(frame);
  }, [
    isRunning,
    ghostWpm,
    isRepeat,
    setGhostPosition,
    activeChallenge,
  ]);

  function keyHandler(e) {
    e.preventDefault();

    if (!isRunning) {
      ghostStartTime.current = null;
      setGhostWpm(
        isRepeat ? repeatBestWpm : stats.bestWpm || 0
      );
    }

    handleKey(e.key);
  }

  const elapsedTime = Math.floor(getElapsedSeconds());

  return (
    <div
      className="typing-box"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Challenge countdown overlay */}
      {matchCountdown !== null && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10000,
          }}
        >
          <h2
            style={{
              color: "#fff",
              fontSize: "2rem",
              marginBottom: "20px",
            }}
          >
            Match Starting...
          </h2>

          <div
            style={{
              color: "#fbbf24",
              fontSize: "10rem",
              fontWeight: "bold",
              animation: "pulse 1s infinite",
            }}
          >
            {matchCountdown > 0 ? matchCountdown : "GO!"}
          </div>
        </div>
      )}

      {/* Challenge mode hides the regular test settings. */}
      {activeChallenge ? (
        <div
          style={{
            textAlign: "center",
            color: "#fbbf24",
            marginBottom: "40px",
            fontWeight: "bold",
            fontSize: "1.2rem",
            padding: "10px",
            border: "2px dashed #fbbf24",
            borderRadius: "8px",
          }}
        >
          CHALLENGE MODE ACTIVE: {activeChallenge.duration}s
        </div>
      ) : (
        <div className="typing-control-bar">
          {/* Modifiers */}
          <div className="control-group">
            <button
              className={`control-btn ${
                punctuationFreq > 0 ? "active" : ""
              }`}
              onClick={() =>
                updateModifiers(
                  punctuationFreq > 0 ? 0 : 50,
                  numberFreq
                )
              }
              title="Toggle Punctuation"
            >
              <AtSign size={14} />
              punctuation
            </button>

            <button
              className={`control-btn ${
                numberFreq > 0 ? "active" : ""
              }`}
              onClick={() =>
                updateModifiers(
                  punctuationFreq,
                  numberFreq > 0 ? 0 : 50
                )
              }
              title="Toggle Numbers"
            >
              <Hash size={14} />
              numbers
            </button>
            <button
              className={`control-btn ${soundEnabled ? "active" : ""}`}
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Mute Sound" : "Enable Sound"}
            >
              {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              {soundEnabled ? "sound on" : "sound off"}
            </button>
          </div>

          <div className="control-divider" />

          {/* Primary modes */}
          <div className="control-group">
            <button
              className={`control-btn ${
                testMode === "time" && !isQuoteMode
                  ? "active"
                  : ""
              }`}
              onClick={() => changeTestMode("time")}
            >
              <Clock size={14} />
              time
            </button>

            <button
              className={`control-btn ${
                testMode === "words" && !isQuoteMode
                  ? "active"
                  : ""
              }`}
              onClick={() => changeTestMode("words")}
            >
              <Type size={14} />
              words
            </button>

            <button
              className={`control-btn ${
                isQuoteMode ? "active" : ""
              }`}
              onClick={fetchQuoteTest}
            >
              <MessageSquareQuote size={14} />
              quote
            </button>

            <button
              className={`control-btn ${
                testMode === "code" ? "active" : ""
              }`}
              onClick={startCodeTest}
            >
              <CodeXml size={14} />
              code
            </button>

            <button
              className={`control-btn ${
                testMode === "weak" ? "active" : ""
              }`}
              onClick={startWeakKeyPractice}
              title="Practice your most frequently missed keys"
            >
              <Target size={14} />
              weak keys
            </button>
          </div>

          {/* Test subtypes */}
          {!isQuoteMode && (
            <>
              <div className="control-divider" />

              <div className="control-group">
                {testMode === "time" &&
                  [15, 30, 60, 120].map((t) => (
                    <button
                      key={t}
                      className={`control-btn ${
                        selectedTime === t ? "active" : ""
                      }`}
                      onClick={() => changeTimeLimit(t)}
                    >
                      {t}
                    </button>
                  ))}

                {testMode === "words" &&
                  [10, 25, 50, 100].map((w) => (
                    <button
                      key={w}
                      className={`control-btn ${
                        wordLimit === w ? "active" : ""
                      }`}
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
          {isQuoteMode && quoteAuthor && (
            <div className="quote-author">
              ~ {quoteAuthor}
            </div>
          )}

          <div className="live-countdown">
            {testMode === "time" ? time : elapsedTime}
          </div>

          {isRepeat && repeatBestWpm > 0 && (
            <div className="ghost-racer-stats">
              Racing Ghost: <span>{repeatBestWpm} WPM</span>
            </div>
          )}
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
          />
        </>
      )}

      {finished && (
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
          bestRunHistory={bestRunHistory}
        />
      )}

      {/* Waiting overlay shown after finishing before the opponent. */}
      {waitingForOpponent && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10000,
          }}
        >
          <h2
            style={{
              color: "#38bdf8",
              animation: "pulse 1.5s infinite",
            }}
          >
            Waiting for opponent to finish...
          </h2>
        </div>
      )}

      {/* Scoreboard modal shown when both players have finished. */}
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