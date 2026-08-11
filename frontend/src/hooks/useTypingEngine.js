import { useState, useEffect, useRef, useCallback } from "react";
import { loadStats, saveStats, resetStats } from "../utils/statsStorage";
import { syncUserStats, saveTestScore } from "../services/api";
import { checkAchievements } from "../utils/achievements";
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const wordBank = [
  "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog",
  "typing", "speed", "accuracy", "practice", "keyboard", "developer",
  "coding", "javascript", "react", "spring", "boot", "database",
  "project", "learning", "future", "technology", "computer",
  "science", "design", "build", "experience", "improve", "daily", "challenge"
];

function generateWords(amount = 300, punctFreq = 0, numFreq = 0) {
  const result = [];
  const punctuations = [",", ".", "?", "!", ";", ":", '"', "()"];

  for (let i = 0; i < amount; i++) {
    let word = wordBank[Math.floor(Math.random() * wordBank.length)];

    if (numFreq > 0 && Math.random() * 100 < numFreq) {
      word = Math.floor(Math.random() * 1000).toString();
    } else if (punctFreq > 0 && Math.random() * 100 < punctFreq) {
      if (Math.random() < 0.5)
        word = word.charAt(0).toUpperCase() + word.slice(1);

      const punc = punctuations[Math.floor(Math.random() * punctuations.length)];
      if (punc === '"') word = `"${word}"`;
      else if (punc === "()") word = `(${word})`;
      else word += punc;
    }
    result.push(word);
  }
  return result;
}

function useTypingEngine(user) {
  const defaultStats = {
    totalTests: 0, bestWpm: 0, averageWpm: 0, highestAccuracy: 0,
    totalWords: 0, totalCharacters: 0, totalPracticeSeconds: 0,
    recentTests: [], globalMissedKeys: {}, unlockedAchievements: []
  };
  const latestEngine = useRef(null);

  const storageKey = user && user.name ? `typingStats_${user.name}` : "typingStats_guest";

  const loadStats = (key) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
  };

  const [stats, setStats] = useState({ ...defaultStats, ...(loadStats(storageKey) || {}) });

  

  const [testMode, setTestMode] = useState("time");
  const [wordLimit, setWordLimit] = useState(25);
  const [words, setWords] = useState(generateWords(300));
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [typed, setTyped] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [time, setTime] = useState(30);
  const [selectedTime, setSelectedTime] = useState(30);
  const [startTime, setStartTime] = useState(null);
  const startTimeRef = useRef(null);
  const [finalElapsed, setFinalElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [correctWords, setCorrectWords] = useState(0);
  const [wrongWords, setWrongWords] = useState(0);
  const [correctCharacters, setCorrectCharacters] = useState(0);
  const [incorrectCharacters, setIncorrectCharacters] = useState(0);
  const [extraCharacters, setExtraCharacters] = useState(0);
  const [isRepeat, setIsRepeat] = useState(false);
  const [missedKeys, setMissedKeys] = useState({});
  const [wordTimes, setWordTimes] = useState([]);
  const [currentWordStartTime, setCurrentWordStartTime] = useState(null);
  const [keystrokeLog, setKeystrokeLog] = useState([]);
  const [wpmHistory, setWpmHistory] = useState([]);
  const [resultSaved, setResultSaved] = useState(false);
  const [ghostPosition, setGhostPosition] = useState(0);
  const [ghostWpm, setGhostWpm] = useState(0);
  const [bestRepeatedWpm, setBestRepeatedWpm] = useState(0);
  const [punctuationFreq, setPunctuationFreq] = useState(0);
  const [numberFreq, setNumberFreq] = useState(0);
  const [isQuoteMode, setIsQuoteMode] = useState(false);
  const [quoteAuthor, setQuoteAuthor] = useState("");
  const [repeatBestWpm, setRepeatBestWpm] = useState(0);
  
  const timerRef = useRef(null);
  const wordStartTimeRef = useRef(performance.now());
  const ghostStartTime = useRef(null);

  const sampleQuotes = [
    { content: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { content: "Talk is cheap. Show me the code.", author: "Linus Torvalds" }
  ];

  useEffect(() => {
    setStats({ ...defaultStats, ...(loadStats(storageKey) || {}) });
  }, [storageKey]);

  // Fix: Handle both regular incrementing and time-mode countdowns cleanly
  // 🚀 FIXED: Guaranteed single-interval timer loop
  
  function fetchQuoteTest() {
    setIsQuoteMode(true);
    const randomQuote = sampleQuotes[Math.floor(Math.random() * sampleQuotes.length)];
    const quoteWords = randomQuote.content.split(" ");
    if (quoteWords.length > 0) {
      quoteWords[0] = `"${quoteWords[0]}`;
      quoteWords[quoteWords.length - 1] = `${quoteWords[quoteWords.length - 1]}"`;
    }
    setQuoteAuthor(randomQuote.author);
    setWords(quoteWords);
    resetTest();
  }

  function updateModifiers(pFreq, nFreq) {
    setPunctuationFreq(pFreq);
    setNumberFreq(nFreq);
    setWords(generateWords(testMode === "words" ? wordLimit : 300, pFreq, nFreq));
    resetTest();
  }

  function getElapsedSeconds() {
    if (finalElapsed > 0) return finalElapsed;
    if (!startTimeRef.current) return 0;
    return (Date.now() - startTimeRef.current) / 1000;
  }

  function playKeySound(isError = false) {
    if (!soundEnabled) return;
    if (audioCtx.state === "suspended") audioCtx.resume();
    try {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      if (isError) {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
      } else {
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.02);
        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.02);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.02);
      }
    } catch (e) {}
  }

function handleKey(key) {
    if (finished) return;

    if (!isRunning) {
      setIsRunning(true);
      const now = Date.now();
      setStartTime(now);
      if (latestEngine?.current) {
        latestEngine.current.startTime = now;
      }
    }

    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
      setStartTime(startTimeRef.current);
    }
    
    const currentStartTime = startTime || startTimeRef.current || Date.now();
    const timeOffset = Date.now() - currentStartTime;
    setKeystrokeLog((prev) => [...prev, { key, timeOffset }]);

    if (key === "Backspace") {
      playKeySound(false);
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
      playKeySound(false);
      const expected = words[currentIndex];
      if (typed === expected) setCorrectWords((prev) => prev + 1);
      else setWrongWords((prev) => prev + 1);
      
      const now = Date.now();
      if (currentWordStartTime) {
        const timeTaken = (now - currentWordStartTime) / 1000;
        setWordTimes((prev) => [...prev, { word: expected, time: timeTaken }]);
      }
      setCurrentWordStartTime(now);
      setTyped("");
      setCurrentChar(0);
      const next = currentIndex + 1;
      setCurrentIndex(next);
      if (testMode === "words" && next >= wordLimit) finishTest();
      return;
    }

    if (key.length === 1) {
      const expected = words[currentIndex]?.[currentChar];
      const isError = key !== expected;
      playKeySound(isError);
      if (key === expected) {
        setCorrectCharacters((prev) => prev + 1);
      } else {
        setIncorrectCharacters((prev) => prev + 1);
        if (expected) {
          setMissedKeys((prev) => ({ ...prev, [expected]: (prev[expected] || 0) + 1 }));
        }
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
    return Math.round((correctCharacters + incorrectCharacters) / 5 / (elapsed / 60));
  }

  function addWpmPoint() {
    const elapsed = getElapsedSeconds();
    if (elapsed <= 0) return;
    const currentWpm = Math.round(correctCharacters / 5 / (elapsed / 60));
    setWpmHistory((prev) => [...prev, { time: Math.floor(elapsed), wpm: currentWpm }]);
  }

  const totalTyped = correctCharacters + incorrectCharacters + extraCharacters;
  const totalAttempts = correctCharacters + incorrectCharacters;

  function finishTest() {
    setIsRunning(false);
    setFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);
    const finalElapsedVal = getElapsedSeconds() || 1;
    setFinalElapsed(finalElapsedVal);

    const finalWpm = Math.round((correctCharacters / 5) / (finalElapsedVal / 60)) || 0;
    const finalRawWpm = Math.round((totalTyped / 5) / (finalElapsedVal / 60)) || 0;
    const finalAccuracy = totalAttempts > 0 ? Math.round((correctCharacters / totalAttempts) * 100) : 100;
    const wordsCompleted = currentIndex;
    const charsTyped = correctCharacters + incorrectCharacters;

    if (isRepeat && finalWpm > repeatBestWpm) setRepeatBestWpm(finalWpm);

    // 🚀 1. Declare updatedStatsObj right here inside the state setter block
    let updatedStatsObj = null;

    setStats((prev) => {
      const newGlobalMissed = { ...(prev.globalMissedKeys || {}) };
      for (const [key, count] of Object.entries(missedKeys)) {
        newGlobalMissed[key] = (newGlobalMissed[key] || 0) + count;
      }
      const newTestEntry = { wpm: finalWpm, rawWpm: finalRawWpm, accuracy: finalAccuracy, time: Math.round(finalElapsedVal), mode: isQuoteMode ? "quote" : testMode, date: Date.now() };
      const updatedTests = [newTestEntry, ...(prev.recentTests || [])].slice(0, 20);
      const newTotalTests = (prev.totalTests || 0) + 1;
      const newTotalWords = (prev.totalWords || 0) + wordsCompleted;
      const newTotalChars = (prev.totalCharacters || 0) + charsTyped;
      const newTotalTime = (prev.totalPracticeSeconds || 0) + finalElapsedVal;
      const newBestWpm = Math.max(prev.bestWpm || 0, finalWpm);
      const newAvgWpm = Math.round(updatedTests.reduce((sum, t) => sum + Number(t.wpm), 0) / updatedTests.length);
      const newHighestAcc = Math.max(prev.highestAccuracy || 0, finalAccuracy);
      const statsForCheck = { totalTests: newTotalTests, unlockedAchievements: prev.unlockedAchievements || [] };
      const newBadges = checkAchievements(statsForCheck, finalWpm, finalAccuracy);
      const finalAchievementsList = [...(prev.unlockedAchievements || []), ...newBadges];

      updatedStatsObj = {
        totalTests: newTotalTests, bestWpm: newBestWpm, averageWpm: newAvgWpm, highestAccuracy: newHighestAcc,
        totalWords: newTotalWords, totalCharacters: newTotalChars, totalPracticeSeconds: newTotalTime,
        recentTests: updatedTests, globalMissedKeys: newGlobalMissed, unlockedAchievements: finalAchievementsList
      };

      saveStats(updatedStatsObj);
      return updatedStatsObj;
    });
    
    // 🚀 2. Now safe to use updatedStatsObj down here!
    if (user && user.name && user.password) {
      syncUserStats(user.name, user.password, JSON.stringify(updatedStatsObj));
      
      const leaderboardPayload = {
        username: user.name, wpm: finalWpm, accuracy: finalAccuracy,
        mode: isQuoteMode ? "quote" : testMode, timeLimit: testMode === "time" ? selectedTime : null,
        wordLimit: testMode === "words" ? wordLimit : null, punctuation: punctuationFreq > 0,
        numbers: numberFreq > 0, timestamp: Date.now()
      };
      saveTestScore(leaderboardPayload);

      // 🚀 3. XP Update API Call
      const xpGained = Math.max(Math.round(finalWpm * 2 * (finalAccuracy / 100)), 10);
      
      fetch("https://ambarmishradb.onrender.com/api/users/update-xp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, xpGained })
      })
        .then((res) => res.json())
        .then((updatedUser) => {
          if (onUserUpdate) {
            onUserUpdate(updatedUser);
          }
        })
        .catch((err) => console.error("Error updating XP:", err));
    }
  }
    if (user && user.name && user.password) {
        // 1. Existing save stats logic
        syncUserStats(user.name, user.password, JSON.stringify(updatedStatsObj));
        
        const leaderboardPayload = { /* ... your leaderboard code ... */ };
        saveTestScore(leaderboardPayload);

        // 🚀 2. NEW: Calculate and send XP!
        const xpGained = Math.max(Math.round(finalWpm * 2 * (finalAccuracy / 100)), 15);
        
        fetch("https://ambarmishradb.onrender.com/api/users/update-xp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email, xpGained: xpGained })
        })
          .then((res) => {
            if (res.ok) return res.json();
            throw new Error("Failed to update XP");
          })
          .then((updatedUser) => {
            console.log(`Earned ${xpGained} XP! New total: ${updatedUser.xp}`);
            
            // 🚀 Force the browser to trigger a custom event so App.jsx knows to update the UI
            window.dispatchEvent(new CustomEvent("xpUpdated", { detail: updatedUser }));
          })
          .catch((err) => console.error("Error updating XP:", err));
      }
  }

  function resetTest() {
    setTyped(""); setCurrentIndex(0); setCurrentChar(0);
    setCorrectWords(0); setWrongWords(0); setCorrectCharacters(0); setIncorrectCharacters(0);
    setTime(selectedTime); setStartTime(null); startTimeRef.current = null;
    setFinalElapsed(0); setIsRunning(false); setFinished(false);
    setResultSaved(false); setWpmHistory([]); setGhostPosition(0);
    setMissedKeys({}); setWordTimes([]); setCurrentWordStartTime(null); setKeystrokeLog([]);
  }

  function changeTestMode(mode) {
    setIsQuoteMode(false); setQuoteAuthor(""); setTestMode(mode);
    setWords(generateWords(mode === "words" ? wordLimit : 300, punctuationFreq, numberFreq));
    resetTest();
  }

  function changeTimeLimit(value) {
    setSelectedTime(value); setTime(value); setIsQuoteMode(false); setQuoteAuthor("");
    if (testMode === "time") {
      setWords(generateWords(300, punctuationFreq, numberFreq));
      resetTest(); setTime(value); 
    }
  }

  function changeWordLimit(value) {
    setWordLimit(value); setIsQuoteMode(false); setQuoteAuthor("");
    if (testMode === "words") {
      setWords(generateWords(value, punctuationFreq, numberFreq));
      resetTest();
    }
  }

  function repeatTest() { resetTest(); setIsRepeat(true); setGhostWpm(repeatBestWpm); }
  function newTest() { setWords(generateWords(testMode === "words" ? wordLimit : 300, punctuationFreq, numberFreq)); resetTest(); setIsRepeat(false); setRepeatBestWpm(0); }
  function updateBest() { const current = calculateWPM(); if (current > bestRepeatedWpm) setBestRepeatedWpm(current); }
  function clearStatistics() {
    resetStats(); setStats(defaultStats);
    if (user && user.name && user.password) syncUserStats(user.name, user.password, JSON.stringify(defaultStats));
  }

  // 🚀 NEW: Point 'restart' exactly to 'resetTest'
  const restart = resetTest;

  // 🚀 NEW: Intelligently convert multiplayer database string to an array!
  const handleSetWords = (newWords) => {
    if (typeof newWords === "string") {
      setWords(newWords.split(" ")); // Convert backend string into an array
    } else {
      setWords(newWords); // Normal array for solo mode
    }
  };

  return {
    words, typed, currentIndex, currentChar, handleKey, time, setTime, selectedTime,
    setSelectedTime, testMode, changeTestMode, wordLimit, changeWordLimit, isRunning,
    setIsRunning, finished, resetTest, repeatTest, newTest, calculateAccuracy,
    calculateWPM, calculateRawWPM, correctCharacters, incorrectCharacters, wpmHistory,
    addWpmPoint, ghostPosition, setGhostPosition, ghostWpm, setGhostWpm, stats,
    bestWpm: stats.bestWpm, testHistory: stats.recentTests, clearStatistics,
    getElapsedSeconds, finishTest, saveCurrentTest: () => {}, updateBest,
    bestRepeatedWpm, isRepeat, missedKeys, wordTimes, keystrokeLog, soundEnabled,
    setSoundEnabled, punctuationFreq, numberFreq, updateModifiers, isQuoteMode,
    quoteAuthor, fetchQuoteTest, changeTimeLimit, repeatBestWpm,
    
    restart, // Exported!
    setWords: handleSetWords, // Safe backend string parser exported!
    globalMissedKeys: stats.globalMissedKeys || {}
  };
}

export default useTypingEngine;