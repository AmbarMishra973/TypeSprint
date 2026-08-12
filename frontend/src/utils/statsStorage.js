const STORAGE_KEY = "typingMasterStats";

const defaultStats = {
  totalTests: 0,
  bestWpm: 0,
  averageWpm: 0,
  highestAccuracy: 0,
  totalWords: 0,
  totalCharacters: 0,
  totalPracticeSeconds: 0,
  recentTests: [],
};

export function loadStats() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return defaultStats;
  }

  try {
    return JSON.parse(saved);
  } catch {
    return defaultStats;
  }
}

export function saveStats(stats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function resetStats() {
  localStorage.removeItem(STORAGE_KEY);
}