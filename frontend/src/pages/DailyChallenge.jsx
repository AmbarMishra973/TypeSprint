import React, { useEffect, useState } from "react";
import useTypingEngine from "../hooks/useTypingEngine";

const DailyChallenge = () => {
  const [dailyText, setDailyText] = useState("");
  
  // Initialize your engine
  const engine = useTypingEngine();

  // Fetch the daily text when the page loads
  useEffect(() => {
    fetch("http://localhost:8080/api/challenges/daily-text")
      .then((res) => res.text())
      .then((text) => {
        setDailyText(text);
        if (engine.setWords) {
          engine.setWords(text); // Inject the daily text into your engine
        }
      })
      .catch((err) => console.error("Failed to load daily challenge", err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-gray-900 rounded-xl shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-yellow-400">🌍 Global Daily Challenge</h1>
        <p className="text-gray-400 mt-2">Everyone types the exact same text today. Post your best score!</p>
      </div>

      {!dailyText ? (
        <div className="text-center text-gray-500">Loading today's challenge...</div>
      ) : (
        <div className="text-2xl text-gray-300 leading-relaxed font-mono">
          {/* This is a placeholder for your actual typing box UI */}
          {/* You can just drop your existing <TypingBox /> here and pass dailyText as a prop if you prefer! */}
          <p>{dailyText}</p>
        </div>
      )}

      {engine.finished && (
        <div className="mt-8 p-4 bg-gray-800 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-green-400">Challenge Completed!</h2>
          <p className="text-xl mt-2">Your Speed: {engine.stats?.bestWpm || 0} WPM</p>
          <button 
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded font-bold transition-all"
            onClick={() => alert("Submitting to daily leaderboard...")}
          >
            Submit Score to Daily Leaderboard
          </button>
        </div>
      )}
    </div>
  );
};

export default DailyChallenge;