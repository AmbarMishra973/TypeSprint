const API_BASE_URL = "https://ambarmishradb.onrender.com/api";

// Helper function for POST requests
// Replace your postData function in src/services/api.js with this:
async function postData(endpoint, data) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const textResponse = await response.text();
    let result;
    try {
      result = JSON.parse(textResponse);
    } catch {
      result = { message: textResponse };
    }

    if (!response.ok) {
      throw new Error(result.message || "Something went wrong.");
    }
    return { success: true, data: result };
  } catch (error) {
    console.error("API Error:", error);
    return { success: false, error: error.message };
  }
}

// 🔐 Authentication API Calls
export async function loginUser(credentials) {
  // Adjust endpoint suffix to match your AuthController.java routes (e.g., "/auth/login")
  return await postData("/auth/login", credentials);
}

export async function signupUser(userData) {
  // Adjust endpoint suffix to match your AuthController.java routes (e.g., "/auth/signup")
  return await postData("/auth/signup", userData);
}

// 📊 Test Score API Calls (for your TestController.java later)


// ☁️ Cloud Sync API Call
export async function syncUserStats(name, password, statsJson) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/sync-stats`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        name: name, 
        password: password, 
        typingStats: statsJson 
      }),
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to sync stats to cloud:", error);
  }
}


// 🏆 Save a completed test score to the database
export async function saveTestScore(scoreData) {
  try {
    const response = await fetch(`${API_BASE_URL}/tests/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(scoreData),
    });
    
    if (!response.ok) {
      throw new Error("Failed to save score to leaderboard");
    }
    return await response.json();
  } catch (error) {
    console.error("Leaderboard Save Error:", error);
  }
}
export const getLeaderboard = async (filters) => {
  try {
    const query = new URLSearchParams();
    
    // Original filters
    if (filters.mode) query.append("mode", filters.mode);
    if (filters.timeLimit) query.append("timeLimit", filters.timeLimit);
    if (filters.wordLimit) query.append("wordLimit", filters.wordLimit);
    if (filters.punctuation !== undefined) query.append("punctuation", filters.punctuation);
    if (filters.numbers !== undefined) query.append("numbers", filters.numbers);
    
    // 🚀 NEW: Added Scope and Time Range
    if (filters.scope) query.append("scope", filters.scope); 
    if (filters.timeRange) query.append("timeRange", filters.timeRange); 

    const response = await fetch(`${API_URL}/tests/leaderboard?${query.toString()}`);
    if (!response.ok) {
      throw new Error("Failed to fetch leaderboard");
    }
    return await response.json();
  } catch (error) {
    console.error("Leaderboard Fetch Error:", error);
    return [];
  }
};