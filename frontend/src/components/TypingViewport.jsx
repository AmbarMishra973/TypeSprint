import "../styles/typingViewport.css";
import { useEffect, useRef, useState } from "react";

function TypingViewport({
  words,
  typed,
  currentIndex,
  currentChar,
  ghostPosition,
  isRepeat,
}) {
  const containerRef = useRef(null);
  const measureRef = useRef(null);
  const wordRefs = useRef([]);
  const [lines, setLines] = useState([]);
  const [ghostStyle, setGhostStyle] = useState({
    left: 0,
    top: 0,
  });

  const VISIBLE_LINES = 3;

  // Clean up old references when the word array shrinks.
  wordRefs.current = wordRefs.current.slice(0, words.length);

  // Create responsive lines based on the available container width.
  useEffect(() => {
    function calculateLines() {
      if (!containerRef.current || !measureRef.current) return;

      const containerRect =
        containerRef.current.getBoundingClientRect();
      const maxWidth = containerRect.width;

      const newLines = [];
      let currentLine = [];
      let currentWidth = 0;

      const GAP = 12;

      wordRefs.current.forEach((element, index) => {
        if (!element) return;

        const wordWidth = element.getBoundingClientRect().width;
        const widthToAdd =
          currentLine.length === 0 ? wordWidth : wordWidth + GAP;

        if (currentWidth + widthToAdd > maxWidth + 1) {
          newLines.push(currentLine);
          currentLine = [index];
          currentWidth = wordWidth;
        } else {
          currentLine.push(index);
          currentWidth += widthToAdd;
        }
      });

      if (currentLine.length) {
        newLines.push(currentLine);
      }

      setLines(newLines);
    }

    document.fonts.ready.then(calculateLines);

    const observer = new ResizeObserver(calculateLines);

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [words]);

  // Find the line containing the current word.
  const currentLineIndex = lines.findIndex((line) =>
    line.includes(currentIndex)
  );

  const startLine =
    currentLineIndex === -1 ? 0 : currentLineIndex;

  const visibleLines = lines.slice(
    startLine,
    startLine + VISIBLE_LINES
  );

  // Calculate the ghost word and character position.
  let total = 0;
  let ghostWord = 0;
  let ghostChar = 0;

  for (let i = 0; i < words.length; i++) {
    if (!words[i]) continue;

    const length = words[i].length + 1;

    if (ghostPosition < total + length) {
      ghostWord = i;
      ghostChar = ghostPosition - total;
      break;
    }

    total += length;
  }

  // Find the ghost's position in the visible typing area.
  useEffect(() => {
    if (!isRepeat) return;

    const element = document.querySelector(
      `.typing-char[data-word="${ghostWord}"][data-char="${ghostChar}"]`
    );

    if (element && containerRef.current) {
      const rect = element.getBoundingClientRect();
      const parent = containerRef.current.getBoundingClientRect();

      setGhostStyle({
        left: rect.left - parent.left,
        top: rect.top - parent.top,
      });
    }
  }, [ghostPosition, lines, ghostWord, ghostChar, isRepeat]);

  return (
    <div className="typing-viewport" ref={containerRef}>
      {/* Hidden measuring layer */}
      <div className="measure-box" ref={measureRef}>
        {words.map((word, index) =>
          word ? (
            <span
              key={index}
              ref={(el) => (wordRefs.current[index] = el)}
              className="typing-word"
            >
              {word}
            </span>
          ) : null
        )}
      </div>

      {/* Visible typing area */}
      {visibleLines.map((line, lineIndex) => (
        <div className="typing-line" key={lineIndex}>
          {line.map((wordIndex) => {
            const word = words[wordIndex];

            if (!word) return null;

            const active = wordIndex === currentIndex;

            return (
              <span
                key={wordIndex}
                className={
                  active
                    ? "typing-word active-word"
                    : "typing-word"
                }
              >
                {word.split("").map((char, index) => {
                  let className = "";

                  if (active) {
                    if (index < typed.length) {
                      className =
                        typed[index] === char
                          ? "correct-char"
                          : "wrong-char";
                    }

                    if (index === currentChar) {
                      className += " cursor";
                    }
                  }

                  return (
                    <span
                      key={index}
                      data-word={wordIndex}
                      data-char={index}
                      className={`typing-char ${className}`}
                    >
                      {char}
                    </span>
                  );
                })}
                {active && typed.length > word.length && (
                  typed.slice(word.length).split("").map((extraChar, extraIdx) => (
                    <span
                      key={`extra-${extraIdx}`}
                      className="typing-char wrong-char extra-char"
                    >
                      {extraChar}
                    </span>
                  ))
                )}
              </span>
            );
          })}
        </div>
      ))}

      {/* Floating ghost element for repeat tests */}
      {isRepeat && (
        <div
          className="floating-ghost"
          style={{
            transform: `translate(${ghostStyle.left}px, ${ghostStyle.top}px)`,
          }}
        />
      )}
    </div>
  );
}

export default TypingViewport;