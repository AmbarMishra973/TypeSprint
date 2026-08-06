import { useState, useEffect, useRef } from "react";
import TypingViewport from "./TypingViewport";
import "../styles/typingBox.css"; // Reuse your box styles

function TestReplay({ words, keystrokeLog, onClose }) {
  const [typed, setTyped] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timeoutsRef = useRef([]);

  useEffect(() => {
    if (!isPlaying) return;

    // Clear any existing timeouts just in case
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    // Reset visual state for replay
    setTyped("");
    setCurrentIndex(0);
    setCurrentChar(0);

    // Schedule every keystroke to fire at its exact recorded timestamp
    keystrokeLog.forEach((log) => {
      const timer = setTimeout(() => {
        if (log.key === "Backspace") {
          setTyped((prev) => prev.slice(0, -1));
          setCurrentChar((prev) => Math.max(prev - 1, 0));
        } else if (log.key === " ") {
          setTyped("");
          setCurrentChar(0);
          setCurrentIndex((prev) => prev + 1);
        } else if (log.key.length === 1) {
          setTyped((prev) => prev + log.key);
          setCurrentChar((prev) => prev + 1);
        }
      }, log.timeOffset);

      timeoutsRef.current.push(timer);
    });

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, [isPlaying, keystrokeLog]);

  return (
    <div className="replay-overlay">
      <div className="replay-modal">
        <h2>Replay Mode 🎥</h2>
        
        <TypingViewport
          words={words}
          typed={typed}
          currentIndex={currentIndex}
          currentChar={currentChar}
          ghostPosition={0}
          isRepeat={false}
        />

        <div className="replay-controls">
          <button 
            className="restart-btn" 
            onClick={() => setIsPlaying(true)}
            disabled={isPlaying && currentIndex < words.length -1}
          >
            ▶️ Play
          </button>
          <button className="restart-btn" onClick={onClose}>
            ❌ Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default TestReplay;