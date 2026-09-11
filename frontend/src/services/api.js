const API_URL = "https://ambarmishradb.onrender.com/api";

// Server Wake-Up / Health Check
export const wakeUpServer = async () => {
  try {
    const res = await fetch("https://ambarmishradb.onrender.com/");
    return res.ok;
  } catch (err) {
    console.warn("Backend server waking up...", err);
    return false;
  }
};

// Leaderboard Functions
export const getLeaderboard = async (filters = {}) => {
  try {
    const query = new URLSearchParams();

    if (filters.mode) query.append("mode", filters.mode);
    if (filters.timeLimit) query.append("timeLimit", filters.timeLimit);
    if (filters.wordLimit) query.append("wordLimit", filters.wordLimit);
    if (filters.punctuation !== undefined)
      query.append("punctuation", filters.punctuation);
    if (filters.numbers !== undefined)
      query.append("numbers", filters.numbers);
    if (filters.scope) query.append("scope", filters.scope);
    if (filters.timeRange) query.append("timeRange", filters.timeRange);

    const response = await fetch(
      `${API_URL}/tests/leaderboard?${query.toString()}`
    );

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
    return null;
  }
};

// User XP Update
export const updateUserXp = async (username, xpGained) => {
  try {
    const response = await fetch(`${API_URL}/users/update-xp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: username,
        xpGained,
      }),
    });

    if (!response.ok) throw new Error("Failed to update XP");

    return await response.json();
  } catch (error) {
    console.error("XP Update Error:", error);
    return null;
  }
};

// Authentication Functions
export const loginUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
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

export const signupUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

// Sync Stats Function
export const syncUserStats = async (username, password, stats) => {
  try {
    const response = await fetch(`${API_URL}/users/sync`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: username,
        password,
        typingStats: stats,
      }),
    });

    if (!response.ok) throw new Error("Failed to sync stats");

    return await response.json();
  } catch (error) {
    console.error("Sync Stats Error:", error);
    return null;
  }
};

// Check active match
export const fetchActiveMatch = async (username) => {
  try {
    const res = await fetch(`${API_URL}/challenges/${username}/active`);
    if (res.status === 200) {
      return await res.json();
    }
    return null;
  } catch (err) {
    console.error("Matchmaker fetch error:", err);
    return null;
  }
};