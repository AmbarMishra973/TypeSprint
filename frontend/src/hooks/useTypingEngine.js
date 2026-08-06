import { useState, useRef } from "react";
import { loadStats, saveStats, resetStats } from "../utils/statsStorage";

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

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

      const punc =
        punctuations[Math.floor(Math.random() * punctuations.length)];
      if (punc === '"') word = `"${word}"`;
      else if (punc === "()") word = `(${word})`;
      else word += punc;
    }
    result.push(word);
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

  // Local curated list of quotes (100% reliable, no internet required)
  const sampleQuotes = [
    { content: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { content: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { content: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
    { content: "Success is not final; failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
    { content: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
    { content: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
    { content: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
    { content: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" }
  ];

  function fetchQuoteTest() {
    setIsQuoteMode(true);
    
    // Pick a random quote from our local array
    const randomQuote = sampleQuotes[Math.floor(Math.random() * sampleQuotes.length)];
    
    // Split the sentence into words just like your normal word bank
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
    setWords(
      generateWords(testMode === "words" ? wordLimit : 300, pFreq, nFreq)
    );
    resetTest();
  }

  function getElapsedSeconds() {
    if (finalElapsed > 0) return finalElapsed;
    if (!startTimeRef.current) return 0; // <--- CHANGE THIS LINE
    return (Date.now() - startTimeRef.current) / 1000;
  }

  function playKeySound(isError = false) {
    if (!soundEnabled) return;

    // Browsers sometimes suspend audio until the user interacts; this wakes it up
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    try {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      if (isError) {
        // 🔴 ERROR SOUND: A quick, deeper warning "buzz"
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(
          50,
          audioCtx.currentTime + 0.1
        );
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioCtx.currentTime + 0.1
        );
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
      } else {
        // 🟢 NORMAL SOUND: A very short, crisp, pleasant "click"
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(
          100,
          audioCtx.currentTime + 0.02
        );
        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioCtx.currentTime + 0.02
        );
        osc.start();
        osc.stop(audioCtx.currentTime + 0.02);
      }
    } catch (e) {
      console.log("Audio error", e);
    }
  }

  function handleKey(key) {
    if (finished) return;

    let currentStartTime = startTime;

    if (!isRunning) {
      setIsRunning(true);
      setStartTime(Date.now());
      setStartTime(currentStartTime);
    }

    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
      setStartTime(startTimeRef.current);
    }
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

      if (typed === expected) {
        setCorrectWords((prev) => prev + 1);
      } else {
        setWrongWords((prev) => prev + 1);
      }
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

      if (testMode === "words" && next >= wordLimit) {
        finishTest();
      }
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
          setMissedKeys((prev) => ({
            ...prev,
            [expected]: (prev[expected] || 0) + 1
          }));
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
  function togglePunctuation() {
    setUsePunctuation((prev) => {
      const next = !prev;
      setWords(
        generateWords(testMode === "words" ? wordLimit : 300, next, useNumbers)
      );
      resetTest();
      return next;
    });
  }

  function toggleNumbers() {
    setUseNumbers((prev) => {
      const next = !prev;
      setWords(
        generateWords(
          testMode === "words" ? wordLimit : 300,
          usePunctuation,
          next
        )
      );
      resetTest();
      return next;
    });
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
    startTimeRef.current = null;
    setFinalElapsed(0);
    setIsRunning(false);
    setFinished(false);
    setResultSaved(false);
    setWpmHistory([]);
    setGhostPosition(0);
    setMissedKeys({});
    setWordTimes([]);
    setCurrentWordStartTime(null);
    setKeystrokeLog([]);
  }

  function changeTestMode(mode) {
    setIsQuoteMode(false); 
    setQuoteAuthor("");    
    setTestMode(mode);
    setWords(
      generateWords(
        mode === "words" ? wordLimit : 300,
        punctuationFreq,  
        numberFreq        
      )
    );
    resetTest();
  }

  function changeWordLimit(value) {
    setWordLimit(value);
    setIsQuoteMode(false); 
    setQuoteAuthor("");
    if (testMode === "words") {
      setWords(
        generateWords(
          value, 
          punctuationFreq,
          numberFreq        
        )
      );
      resetTest();
    }
  }

  function repeatTest() {
    resetTest();
    setIsRepeat(true);
  }

  function newTest() {
    setWords(
      generateWords(
        testMode === "words" ? wordLimit : 300,
        
        punctuationFreq, 
          numberFreq
      )
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
    isRepeat,
    missedKeys,
    wordTimes,
    keystrokeLog,
    soundEnabled,
    setSoundEnabled,

    punctuationFreq,
    numberFreq,
    updateModifiers,
    isQuoteMode,
    quoteAuthor,
    fetchQuoteTest
  };
}

export default useTypingEngine;
