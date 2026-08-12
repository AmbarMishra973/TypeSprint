// src/utils/achievements.js

// The Master List of Badges
export const ACHIEVEMENTS = [
  {
    id: "speed_50",
    title: "Speed Demon",
    description: "Reach 50 WPM in any test",
    icon: "🚀",
  },
  {
    id: "speed_100",
    title: "Lightning Fast",
    description: "Reach 100 WPM in any test",
    icon: "⚡",
  },
  {
    id: "speed_150",
    title: "Keyboard God",
    description: "Reach 150 WPM in any test",
    icon: "🔥",
  },
  {
    id: "accuracy_100",
    title: "Sharpshooter",
    description: "Finish a test with 100% accuracy",
    icon: "🎯",
  },
  {
    id: "tests_10",
    title: "Dedicated Typist",
    description: "Complete 10 typing tests",
    icon: "🏃",
  },
  {
    id: "tests_50",
    title: "Marathoner",
    description: "Complete 50 typing tests",
    icon: "🏋️",
  },
];

// The Logic: Checks if any new badges were earned
export const checkAchievements = (
  currentStats,
  finalWpm,
  finalAccuracy
) => {
  const newlyUnlocked = [];
  const alreadyUnlocked = currentStats.unlockedAchievements || [];

  // Helper to add a badge if it isn't already unlocked
  const unlock = (id) => {
    if (!alreadyUnlocked.includes(id)) {
      newlyUnlocked.push(id);
    }
  };

  // 1. Speed Checks
  if (finalWpm >= 50) unlock("speed_50");
  if (finalWpm >= 100) unlock("speed_100");
  if (finalWpm >= 150) unlock("speed_150");

  // 2. Accuracy Checks (Needs to be > 0 WPM to prevent cheating by typing one letter)
  if (finalAccuracy === 100 && finalWpm > 10) unlock("accuracy_100");

  // 3. Milestone Checks
  if (currentStats.totalTests >= 10) unlock("tests_10");
  if (currentStats.totalTests >= 50) unlock("tests_50");

  return newlyUnlocked; // Returns an array of newly earned badge IDs
};