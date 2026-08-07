const API_URL = "https://ambarmishradb.onrender.com/api";

// 🏆 Leaderboard Functions
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

// 🔐 Authentication Functions (Fixes the missing export error)
export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: username, password }),
    });
    if (!response.ok) throw new Error("Login failed");
    return await response.json();
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

export const signupUser = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/users/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: username, password }),
    });
    if (!response.ok) throw new Error("Signup failed");
    return await response.json();
  } catch (error) {
    console.error("Signup Error:", error);
    throw error;
  }
};

// 🔄 Sync Stats Function (Fixes the missing export error)
export const syncUserStats = async (username, password, stats) => {
  try {
    const response = await fetch(`${API_URL}/users/sync`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: username, password, typingStats: stats }),
    });
    if (!response.ok) throw new Error("Failed to sync stats");
    return await response.json();
  } catch (error) {
    console.error("Sync Stats Error:", error);
  }
};