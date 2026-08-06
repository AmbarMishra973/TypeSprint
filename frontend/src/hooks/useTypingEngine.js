import { useState } from "react";
import { loadStats, saveStats, resetStats } from "../utils/statsStorage";

const wordBank = [
  "the",
  "quick",
  "brown",
  "fox",
  "jumps",
  "over",
  "lazy",
  "dog",
  "typing",
  "speed",
  "accuracy",
  "practice",
  "keyboard",
  "developer",
  "coding",
  "javascript",
  "react",
  "spring",
  "boot",
  "database",
  "project",
  "learning",
  "future",
  "technology",
  "computer",
  "science",
  "design",
  "build",
  "experience",
  "improve",
  "daily",
  "challenge"
];

function generateWords(amount = 300) {
  const result = [];
  for (let i = 0; i < amount; i++) {
    result.push(wordBank[Math.floor(Math.random() * wordBank.length)]);
  }
  return result;
}

function useTypingEngine() {
  const defaultStats = {
    totalTests: 0,
    bestWpm: 0,
    averageWpm: 0,
    highestAccuracy: 0,
    totalWords: 0,
    totalCharacters: 0,
    totalPracticeSeconds: 0,
    recentTests: []
  };

  const [stats, setStats] = useState({
    ...defaultStats,
    ...(loadStats() || {})
  });

  const [testMode, setTestMode] = useState("time");
  const [wordLimit, setWordLimit] = useState(25);
  const [words, setWords] = useState(generateWords(300));
  const [typed, setTyped] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [time, setTime] = useState(30);
  const [selectedTime, setSelectedTime] = useState(30);
  const [startTime, setStartTime] = useState(null);
  const [finalElapsed, setFinalElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [correctWords, setCorrectWords] = useState(0);
  const [wrongWords, setWrongWords] = useState(0);
  const [correctCharacters, setCorrectCharacters] = useState(0);
  const [incorrectCharacters, setIncorrectCharacters] = useState(0);
  const [isRepeat, setIsRepeat] = useState(false);
  const [wpmHistory, setWpmHistory] = useState([]);
  const [resultSaved, setResultSaved] = useState(false);
  const [ghostPosition, setGhostPosition] = useState(0);
  const [ghostWpm, setGhostWpm] = useState(0);
  const [bestRepeatedWpm, setBestRepeatedWpm] = useState(0);

  function getElapsedSeconds() {
    if (finalElapsed > 0) return finalElapsed;
    if (!startTime) return 0;
    return (Date.now() - startTime) / 1000;
  }

  function handleKey(key) {
    if (finished) return;

    if (!isRunning) {
      setIsRunning(true);
      setStartTime(Date.now());
    }

    if (key === "Backspace") {
      if (typed.length === 0) return;

      const charBeingDeleted = typed[typed.length - 1];
      const expectedChar = words[currentIndex]?.[currentChar - 1];

      if (charBeingDeleted === expectedChar) {
        setCorrectCharacters((prev) => Math.max(prev - 1, 0));
      } else {
        setIncorrectCharacters((prev) => Math.max(prev - 1, 0));
      }

      setTyped((prev) => prev.slice(0, -1));
      setCurrentChar((prev) => Math.max(prev - 1, 0));
      return;
    }

    if (key === " ") {
      const expected = words[currentIndex];

      if (typed === expected) {
        setCorrectWords((prev) => prev + 1);
      } else {
        setWrongWords((prev) => prev + 1);
      }

      setTyped("");
      setCurrentChar(0);

      const next = currentIndex + 1;
      setCurrentIndex(next);

      if (testMode === "words" && next >= wordLimit) {
        finishTest();
      }
      return;
    }

    if (key.length === 1) {
      const expected = words[currentIndex]?.[currentChar];

      if (key === expected) {
        setCorrectCharacters((prev) => prev + 1);
      } else {
        setIncorrectCharacters((prev) => prev + 1);
      }

      setTyped((prev) => prev + key);
      setCurrentChar((prev) => prev + 1);
    }
  }

  function calculateAccuracy() {
    const total = correctCharacters + incorrectCharacters;
    if (total === 0) return 0;
    return Number(((correctCharacters / total) * 100).toFixed(1));
  }

  function calculateWPM() {
    const elapsed = Math.max(getElapsedSeconds(), 1);
    return Math.round(correctCharacters / 5 / (elapsed / 60));
  }

  function calculateRawWPM() {
    const elapsed = Math.max(getElapsedSeconds(), 1);
    return Math.round(
      (correctCharacters + incorrectCharacters) / 5 / (elapsed / 60)
    );
  }

  function addWpmPoint() {
    const elapsed = getElapsedSeconds();
    if (elapsed <= 0) return;

    const currentWpm = Math.round(correctCharacters / 5 / (elapsed / 60));
    setWpmHistory((prev) => [
      ...prev,
      { time: Math.floor(elapsed), wpm: currentWpm }
    ]);
  }

  function saveCurrentTest(elapsed) {
    const currentWpm = calculateWPM();
    const accuracy = calculateAccuracy();

    const updatedStats = {
      totalTests: stats.totalTests + 1,
      bestWpm: Math.max(stats.bestWpm, currentWpm),
      averageWpm: Math.round(
        (stats.averageWpm * stats.totalTests + currentWpm) /
          (stats.totalTests + 1)
      ),
      highestAccuracy: Math.max(stats.highestAccuracy, accuracy),
      totalWords: stats.totalWords + correctWords + wrongWords,
      totalCharacters:
        stats.totalCharacters + correctCharacters + incorrectCharacters,
      totalPracticeSeconds: stats.totalPracticeSeconds + elapsed,
      recentTests: [
        {
          date: Date.now(),
          mode: testMode,
          wpm: currentWpm,
          rawWpm: calculateRawWPM(),
          accuracy,
          time: elapsed
        },
        ...stats.recentTests
      ].slice(0, 10)
    };

    setStats(updatedStats);
    saveStats(updatedStats);
  }

  function finishTest() {
    if (finished) return;

    const elapsed = getElapsedSeconds();
    setFinalElapsed(elapsed);

    const finalWpm = Math.round(correctCharacters / 5 / (elapsed / 60));

    setWpmHistory((prev) => [
      ...prev,
      { time: Math.floor(elapsed), wpm: finalWpm }
    ]);

    setFinished(true);
    setIsRunning(false);

    if (!resultSaved) {
      saveCurrentTest(elapsed);
      setResultSaved(true);
    }
  }

  function resetTest() {
    setTyped("");
    setCurrentIndex(0);
    setCurrentChar(0);
    setCorrectWords(0);
    setWrongWords(0);
    setCorrectCharacters(0);
    setIncorrectCharacters(0);
    setTime(selectedTime);
    setStartTime(null);
    setFinalElapsed(0);
    setIsRunning(false);
    setFinished(false);
    setResultSaved(false);
    setWpmHistory([]);
    setGhostPosition(0);
  }

  function changeTestMode(mode) {
    setTestMode(mode);
    setWords(mode === "words" ? generateWords(wordLimit) : generateWords(300));
    resetTest();
  }

  function changeWordLimit(value) {
    setWordLimit(value);
    if (testMode === "words") {
      setWords(generateWords(value));
      resetTest();
    }
  }

  function repeatTest() {
    resetTest();
    setIsRepeat(true);
  }

  function newTest() {
    setWords(
      testMode === "words" ? generateWords(wordLimit) : generateWords(300)
    );
    resetTest();
    setIsRepeat(false);
  }

  function updateBest() {
    const current = calculateWPM();
    if (current > bestRepeatedWpm) {
      setBestRepeatedWpm(current);
    }
  }

  function clearStatistics() {
    resetStats();
    setStats(defaultStats);
  }

  // THIS IS THE ONE AND ONLY RETURN STATEMENT
  return {
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
    resetTest,
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
    stats,
    bestWpm: stats.bestWpm,
    testHistory: stats.recentTests,
    clearStatistics,
    getElapsedSeconds,
    finishTest,
    saveCurrentTest,
    updateBest,
    bestRepeatedWpm,
    isRepeat
  };
}

export default useTypingEngine;
