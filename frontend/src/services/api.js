// 1. Define the base URL at the top level
const API_URL = "https://ambarmishradb.onrender.com/api";

// 2. Use it in your functions
export const getLeaderboard = async (filters) => {
  try {
    const query = new URLSearchParams();
    if (filters.mode) query.append("mode", filters.mode);
    if (filters.timeLimit) query.append("timeLimit", filters.timeLimit);
    if (filters.wordLimit) query.append("wordLimit", filters.wordLimit);
    if (filters.punctuation !== undefined) query.append("punctuation", filters.punctuation);
    if (filters.numbers !== undefined) query.append("numbers", filters.numbers);
    if (filters.scope) query.append("scope", filters.scope);
    if (filters.timeRange) query.append("timeRange", filters.timeRange);

    // Now API_URL is defined and accessible!
    const response = await fetch(`${API_URL}/tests/leaderboard?${query.toString()}`);
    if (!response.ok) throw new Error("Failed to fetch leaderboard");
    return await response.json();
  } catch (error) {
    console.error("Leaderboard Fetch Error:", error);
    return [];
  }
};

export const saveTestScore = async (payload) => {
  try {
    const response = await fetch(`${API_URL}/tests/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Failed to save score");
    return await response.json();
  } catch (error) {
    console.error("Leaderboard Save Error:", error);
    throw error;
  }
};