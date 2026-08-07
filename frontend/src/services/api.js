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

// 🏆 Fetch the top 5 scores based on active filters
export async function getLeaderboard(filters) {
  try {
    // Dynamically build the query string (e.g., ?mode=time&timeLimit=30&punctuation=true...)
    const queryParams = new URLSearchParams();
    queryParams.append("mode", filters.mode);
    queryParams.append("punctuation", filters.punctuation);
    queryParams.append("numbers", filters.numbers);
    
    if (filters.mode === "time" && filters.timeLimit) {
      queryParams.append("timeLimit", filters.timeLimit);
    }
    if (filters.mode === "words" && filters.wordLimit) {
      queryParams.append("wordLimit", filters.wordLimit);
    }

    const response = await fetch(`${API_BASE_URL}/tests/leaderboard?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch leaderboard");
    }
    return await response.json();
  } catch (error) {
    console.error("Leaderboard Fetch Error:", error);
    return [];
  }
}