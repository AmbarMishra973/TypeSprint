import React, { useState } from "react";

export default function Friends({ user, setUser }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔍 Handle Search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`https://ambarmishradb.onrender.com/api/users/search?query=${searchQuery}`);
      if (res.ok) {
        const data = await res.json();
        // Filter out the current user so they don't add themselves
        setSearchResults(data.filter(u => u.name !== user.name));
      }
    } catch (err) {
      console.error("Search failed:", err);
    }
    setLoading(false);
  };

  // ➕ Handle Add Friend
  const handleAddFriend = async (friendName) => {
    try {
      const res = await fetch(`https://ambarmishradb.onrender.com/api/users/${user.name}/add-friend/${friendName}`, {
        method: "POST"
      });
      
      if (res.ok) {
        const updatedUser = await res.json();
        // Update local state and localStorage with the new friends list
        setUser(updatedUser);
        localStorage.setItem("typingUser", JSON.stringify(updatedUser));
        setSearchResults(searchResults.filter(u => u.name !== friendName)); // Remove from search results
      }
    } catch (err) {
      console.error("Failed to add friend:", err);
    }
  };

  if (!user) {
    return <div style={styles.container}><h2>Please log in to add friends!</h2></div>;
  }

  const myFriends = user.friends || [];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>👥 Friends & Compete</h1>

      <div style={styles.grid}>
        {/* Left Column: My Friends */}
        <div style={styles.card}>
          <h2>My Friends ({myFriends.length})</h2>
          {myFriends.length === 0 ? (
            <p style={styles.mutedText}>You haven't added anyone yet. Search for users to build your list!</p>
          ) : (
            <div style={styles.list}>
              {myFriends.map((friendName, idx) => (
                <div key={idx} style={styles.friendRow}>
                  <div style={styles.avatar}>👤</div>
                  <span style={styles.friendName}>{friendName}</span>
                  <button style={styles.challengeBtn}>⚔️ Challenge</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Find Friends */}
        <div style={styles.card}>
          <h2>Find Friends</h2>
          <form onSubmit={handleSearch} style={styles.searchForm}>
            <input 
              type="text" 
              placeholder="Search by username..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
            <button type="submit" style={styles.searchBtn}>Search</button>
          </form>

          {loading && <p>Searching...</p>}

          <div style={styles.list}>
            {searchResults.map((result, idx) => {
              const isAlreadyFriend = myFriends.includes(result.name);
              return (
                <div key={idx} style={styles.friendRow}>
                  <div style={styles.avatar}>👤</div>
                  <span style={styles.friendName}>{result.name}</span>
                  {isAlreadyFriend ? (
                    <span style={styles.mutedText}>Added ✔️</span>
                  ) : (
                    <button onClick={() => handleAddFriend(result.name)} style={styles.addBtn}>
                      + Add
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { animation: "fadeIn 0.3s ease", paddingBottom: "40px" },
  title: { textAlign: "center", marginBottom: "30px", fontSize: "2.5rem" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" },
  card: { background: "var(--card-bg, #1e293b)", padding: "20px", borderRadius: "12px", border: "1px solid var(--text-muted, #475569)" },
  searchForm: { display: "flex", gap: "10px", marginBottom: "20px" },
  searchInput: { flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #475569", background: "#0f172a", color: "#fff" },
  searchBtn: { padding: "10px 15px", borderRadius: "6px", background: "#38bdf8", color: "#000", border: "none", fontWeight: "bold", cursor: "pointer" },
  list: { display: "flex", flexDirection: "column", gap: "10px", marginTop: "15px" },
  friendRow: { display: "flex", alignItems: "center", background: "rgba(255,255,255,0.05)", padding: "12px", borderRadius: "8px" },
  avatar: { fontSize: "1.5rem", marginRight: "12px" },
  friendName: { flex: 1, fontWeight: "bold", fontSize: "1.1rem" },
  addBtn: { background: "#10b981", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
  challengeBtn: { background: "#fbbf24", color: "#000", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
  mutedText: { color: "#94a3b8", fontSize: "0.9rem" }
};