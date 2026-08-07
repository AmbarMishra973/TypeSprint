import React, { useState, useEffect } from "react";
import { getLeaderboard } from "../services/api";

export default function Leaderboard() {
  const [mode, setMode] = useState("time");
  const [timeLimit, setTimeLimit] = useState(30);
  const [wordLimit, setWordLimit] = useState(25);
  const [punctuation, setPunctuation] = useState(false);
  const [numbers, setNumbers] = useState(false);
  
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch leaderboard whenever filters change
  useEffect(() => {
    async function fetchScores() {
      setLoading(true);
      const data = await getLeaderboard({
        mode,
        timeLimit: mode === "time" ? timeLimit : null,
        wordLimit: mode === "words" ? wordLimit : null,
        punctuation,
        numbers,
      });
      setLeaders(data || []);
      setLoading(false);
    }
    fetchScores();
  }, [mode, timeLimit, wordLimit, punctuation, numbers]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 text-neutral-200">
      <h2 className="text-3xl font-bold mb-6 text-center">🏆 Global Leaderboard</h2>

      {/* Mode Filters */}
      <div className="flex justify-center gap-2 mb-4 bg-neutral-900 p-2 rounded-xl border border-neutral-800">
        {["time", "words", "quote"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
              mode === m ? "bg-amber-500 text-neutral-950 shadow-md" : "hover:text-amber-400"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Sub-Filters (Time Limits / Word Limits) */}
      <div className="flex flex-wrap justify-center gap-3 mb-6 text-sm">
        {mode === "time" && [15, 30, 60, 120].map((t) => (
          <button
            key={t}
            onClick={() => setTimeLimit(t)}
            className={`px-3 py-1 rounded-md border ${
              timeLimit === t ? "border-amber-500 text-amber-500 bg-amber-500/10" : "border-neutral-800 text-neutral-400"
            }`}
          >
            {t}s
          </button>
        ))}

        {mode === "words" && [10, 25, 50, 100].map((w) => (
          <button
            key={w}
            onClick={() => setWordLimit(w)}
            className={`px-3 py-1 rounded-md border ${
              wordLimit === w ? "border-amber-500 text-amber-500 bg-amber-500/10" : "border-neutral-800 text-neutral-400"
            }`}
          >
            {w} words
          </button>
        ))}

        {/* Modifiers */}
        <button
          onClick={() => setPunctuation(!punctuation)}
          className={`px-3 py-1 rounded-md border ${
            punctuation ? "border-amber-500 text-amber-500 bg-amber-500/10" : "border-neutral-800 text-neutral-400"
          }`}
        >
          punctuation
        </button>
        <button
          onClick={() => setNumbers(!numbers)}
          className={`px-3 py-1 rounded-md border ${
            numbers ? "border-amber-500 text-amber-500 bg-amber-500/10" : "border-neutral-800 text-neutral-400"
          }`}
        >
          numbers
        </button>
      </div>

      {/* Rankings List */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="text-center py-12 text-neutral-500">Loading rankings...</div>
        ​) : leaders.length === 0 ? (
          <div className="text-center py-12 text-neutral-500">No scores recorded for this category yet. Be the first!</div>
        ) : (
          leaders.map((score, index) => (
            <div
              key={score.id}
              className="flex items-center justify-between px-6 py-4 border-b border-neutral-800/60 last:border-none hover:bg-neutral-800/40 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className={`font-bold text-lg w-6 text-center ${
                  index === 0 ? "text-yellow-400" : index === 1 ? "text-zinc-300" : index === 2 ? "text-amber-600" : "text-neutral-500"
                }`}>
                  #{index + 1}
                </span>

                {/* User Profile Picture or Default Avatar */}
                <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-800 flex items-center justify-center border border-neutral-700">
                  {score.user?.profilePicture ? (
                    <img src={score.user.profilePicture} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold text-neutral-400">{score.user?.name?.charAt(0).toUpperCase()}</span>
                  )}
                </div>

                <span className="font-semibold text-neutral-200">{score.user?.name}</span>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-xl font-extrabold text-amber-400">{score.wpm} <span className="text-xs font-normal text-neutral-400">WPM</span></div>
                  <div className="text-xs text-neutral-500">{score.accuracy}% accuracy</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}