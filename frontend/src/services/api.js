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
export async function saveTestScore(scoreData) {
  return await postData("/tests/save", scoreData);
}