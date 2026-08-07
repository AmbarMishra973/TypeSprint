import React, { useState } from "react";

export default function Friends({ user, setUser }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);

  const updateUserState = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("typingUser", JSON.stringify(updatedUser));
  };

  // 🔍 Handle Search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearchAttempted(true);
    try {
      const res = await fetch(`https://ambarmishradb.onrender.com/api/users/search?query=${searchQuery}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.filter(u => u.name !== user.name)); // Don't show yourself
      }
    } catch (err) {
      console.error("Search failed:", err);
    }
    setLoading(false);
  };

  // 📨 Send Friend Request
  // 📨 Send Friend Request
  const sendRequest = async (friendName) => {
    try {
      const res = await fetch(`https://ambarmishradb.onrender.com/api/users/${user.name}/request-friend/${friendName}`, { method: "POST" });
      if (res.ok) updateUserState(await res.json());
    } catch (err) { 
      console.error("Failed to send request:", err); 
    }
  };

  // ✅ Accept Friend Request
  const acceptRequest = async (requesterName) => {
    try {
      const res = await fetch(`https://ambarmishradb.onrender.com/api/users/${user.name}/accept-friend/${requesterName}`, { method: "POST" });
      if (res.ok) updateUserState(await res.json());
    } catch (err) { 
      console.error("Failed to accept request:", err); 
    }
  };

  // ❌ Reject Friend Request
  const rejectRequest = async (requesterName) => {
    try {
      const res = await fetch(`https://ambarmishradb.onrender.com/api/users/${user.name}/reject-friend/${requesterName}`, { method: "POST" });
      if (res.ok) updateUserState(await res.json());
    } catch (err) { 
      console.error("Failed to reject request:", err); 
    }
  };

  // 🗑️ Remove Friend
  const removeFriend = async (friendName) => {
    if (!window.confirm(`Are you sure you want to remove ${friendName} from your friends list?`)) return;
    try {
      const res = await fetch(`https://ambarmishradb.onrender.com/api/users/${user.name}/remove-friend/${friendName}`, { method: "POST" });
      if (res.ok) updateUserState(await res.json());
    } catch (err) { 
      console.error("Failed to remove friend:", err); 
    }
  };

  // ⚔️ Challenge & Profile Placeholders (Stage B)
  const openProfile = (name) => alert(`Opening profile for ${name}... (Coming in next step!)`);
  const startChallenge = (name) => alert(`Setting up Challenge against ${name}... (Coming in next step!)`);

  if (!user) {
    return <div style={styles.container}><h2>Please log in to manage friends!</h2></div>;
  }

  const myFriends = user.friends || [];
  const friendRequests = user.friendRequests || [];
  const sentRequests = user.sentRequests || [];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>👥 Friends & Compete</h1>

      <div style={styles.grid}>
        {/* LEFT COLUMN: Inbox & Friends List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* INBOX: Pending Friend Requests */}
          {friendRequests.length > 0 && (
            <div style={{...styles.card, border: "2px solid #38bdf8"}}>
              <h2 style={{ color: "#38bdf8" }}>📬 Friend Requests ({friendRequests.length})</h2>
              <div style={styles.list}>
                {friendRequests.map((reqName, idx) => (
                  <div key={idx} style={styles.friendRow}>
                    <div style={styles.avatar}>👤</div>
                    <span style={styles.friendName}>{reqName}</span>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button onClick={() => acceptRequest(reqName)} style={styles.acceptBtn}>✅ Accept</button>
                      <button onClick={() => rejectRequest(reqName)} style={styles.rejectBtn}>❌</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MY FRIENDS */}
          <div style={styles.card}>
            <h2>My Friends ({myFriends.length})</h2>
            {myFriends.length === 0 ? (
              <p style={styles.mutedText}>You haven't added anyone yet.</p>
            ) : (
              <div style={styles.list}>
                {myFriends.map((friendName, idx) => (
                  <div key={idx} style={styles.friendRow}>
                    <div style={styles.avatar} onClick={() => openProfile(friendName)} style={{cursor: "pointer", fontSize: "1.5rem", marginRight: "12px"}}>👤</div>
                    <span style={styles.friendName} onClick={() => openProfile(friendName)}>{friendName}</span>
                    
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button onClick={() => startChallenge(friendName)} style={styles.challengeBtn}>⚔️ Challenge</button>
                      <button onClick={() => removeFriend(friendName)} style={styles.removeBtn} title="Remove Friend">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Find Friends */}
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
          
          {!loading && searchAttempted && searchResults.length === 0 && (
            <p style={{ color: "#ef4444", textAlign: "center" }}>No users found matching "{searchQuery}"</p>
          )}

          <div style={styles.list}>
            {searchResults.map((result, idx) => {
              const isFriend = myFriends.includes(result.name);
              const requestSent = sentRequests.includes(result.name);
              
              return (
                <div key={idx} style={styles.friendRow}>
                  <div style={styles.avatar}>👤</div>
                  <span style={styles.friendName}>{result.name}</span>
                  
                  {isFriend ? (
                    <span style={styles.mutedText}>Added ✔️</span>
                  ) : requestSent ? (
                    <span style={{ color: "#fbbf24", fontSize: "0.9rem", fontWeight: "bold" }}>Request Sent ⏳</span>
                  ) : (
                    <button onClick={() => sendRequest(result.name)} style={styles.addBtn}>
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
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "20px" },
  card: { background: "var(--card-bg, #1e293b)", padding: "20px", borderRadius: "12px", border: "1px solid var(--text-muted, #475569)" },
  searchForm: { display: "flex", gap: "10px", marginBottom: "20px" },
  searchInput: { flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #475569", background: "#0f172a", color: "#fff" },
  searchBtn: { padding: "10px 15px", borderRadius: "6px", background: "#38bdf8", color: "#000", border: "none", fontWeight: "bold", cursor: "pointer" },
  list: { display: "flex", flexDirection: "column", gap: "10px", marginTop: "15px" },
  friendRow: { display: "flex", alignItems: "center", background: "rgba(255,255,255,0.05)", padding: "12px", borderRadius: "8px" },
  avatar: { fontSize: "1.5rem", marginRight: "12px" },
  friendName: { flex: 1, fontWeight: "bold", fontSize: "1.1rem", cursor: "pointer" },
  addBtn: { background: "#10b981", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
  acceptBtn: { background: "#10b981", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
  rejectBtn: { background: "#ef4444", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
  challengeBtn: { background: "#fbbf24", color: "#000", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
  removeBtn: { background: "transparent", color: "#ef4444", border: "1px solid #ef4444", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "1rem" },
  mutedText: { color: "#94a3b8", fontSize: "0.9rem" }
};