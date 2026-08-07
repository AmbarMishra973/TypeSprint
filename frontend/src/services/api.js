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
// 🔐 LOGIN FUNCTION
export const loginUser = async (userData) => {
  try {
    const response = await fetch("https://ambarmishradb.onrender.com/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // 🚀 THIS IS CRITICAL for Spring Boot
      },
      body: JSON.stringify(userData), // userData already contains { name, password }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: errorText || "Login failed" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Login API Error:", error);
    return { success: false, error: "Network error" };
  }
};

// 📝 SIGNUP FUNCTION
export const signupUser = async (userData) => {
  try {
    const response = await fetch("https://ambarmishradb.onrender.com/api/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // 🚀 THIS IS CRITICAL
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: errorText || "Signup failed" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Signup API Error:", error);
    return { success: false, error: "Network error" };
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