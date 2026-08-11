// utils/xpCalculator.js
export const calculateXpReward = (wpm, accuracy) => {
  if (wpm < 10) return 10; // Participation XP
  
  // Base XP formula: WPM multiplied by accuracy percentage factor
  const baseReward = Math.round(wpm * 5 * (accuracy / 100));
  return Math.max(baseReward, 15); // Minimum 15 XP per successful test
};