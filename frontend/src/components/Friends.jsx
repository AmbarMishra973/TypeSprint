import React, { useState, useEffect } from "react";
export default function Friends({ user, setUser, setActiveView, setActiveChallenge }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);

  // Challenge Inbox State
  const [pendingChallenges, setPendingChallenges] = useState([]);

  // Modal States
  const [friendToRemove, setFriendToRemove] = useState(null);
  const [challengeTarget, setChallengeTarget] = useState(null);
  const [challengeTime, setChallengeTime] = useState(30);

  const updateUserState = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("typingUser", JSON.stringify(updatedUser));
  };

  // 🔄 Fetch Pending Challenges (Polls every 5 seconds)
  useEffect(() => {
    if (!user) return;

    const fetchChallenges = async () => {
      try {
        const res = await fetch(`https://ambarmishradb.onrender.com/api/challenges/${user.name}/pending`);
        if (res.ok) {
          const data = await res.json();
          setPendingChallenges(data);
        }
      } catch (err) { console.error("Failed to fetch challenges:", err); }
    };

    fetchChallenges(); // Fetch immediately on load
    const interval = setInterval(fetchChallenges, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [user]);

  // 🔍 Handle Search
  // 🎮 Accept/Decline Challenge API Call
  const handleChallengeResponse = async (challengeId, status) => {
    try {
      const res = await fetch(`https://ambarmishradb.onrender.com/api/challenges/${challengeId}/status?status=${status}`, { method: "PUT" });
      if (res.ok) {
        // Find the challenge data before removing it from the inbox
        const acceptedChallenge = pendingChallenges.find(c => c.id === challengeId);
        
        setPendingChallenges(prev => prev.filter(c => c.id !== challengeId));
        
        if (status === "ACCEPTED" && acceptedChallenge) {
          setActiveChallenge(acceptedChallenge); // 🚀 Lock in the challenge data
          setActiveView("typing"); // 🚀 Switch to the typing screen
        }
      }
    } catch (err) { console.error("Failed to update challenge status:", err); }
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    setSearchAttempted(true);
    try {
      const res = await fetch(`https://ambarmishradb.onrender.com/api/users/search?query=${searchQuery}`);
      if (res.ok) setSearchResults((await res.json()).filter(u => u.name !== user.name));
    } catch (err) { console.error("Search failed:", err); }
    setLoading(false);
  };

  // 📨 Send Request
  const sendRequest = async (friendName) => {
    try {
      const res = await fetch(`https://ambarmishradb.onrender.com/api/users/${user.name}/request-friend/${friendName}`, { method: "POST" });
      if (res.ok) updateUserState(await res.json());
    } catch (err) { console.error("Failed to send request:", err); }
  };

  // ✅ Accept / ❌ Reject Friend Requests
  const acceptRequest = async (reqName) => {
    try {
      const res = await fetch(`https://ambarmishradb.onrender.com/api/users/${user.name}/accept-friend/${reqName}`, { method: "POST" });
      if (res.ok) updateUserState(await res.json());
    } catch (err) { console.error("Failed to accept:", err); }
  };

  const rejectRequest = async (reqName) => {
    try {
      const res = await fetch(`https://ambarmishradb.onrender.com/api/users/${user.name}/reject-friend/${reqName}`, { method: "POST" });
      if (res.ok) updateUserState(await res.json());
    } catch (err) { console.error("Failed to reject:", err); }
  };

  // 🗑️ Remove Friend
  const confirmRemoveFriend = async () => {
    if (!friendToRemove) return;
    try {
      const res = await fetch(`https://ambarmishradb.onrender.com/api/users/${user.name}/remove-friend/${friendToRemove}`, { method: "POST" });
      if (res.ok) {
        updateUserState(await res.json());
        setFriendToRemove(null);
      }
    } catch (err) { console.error("Failed to remove friend:", err); }
  };

  // ⚔️ Send Challenge API Call
  const sendChallenge = async () => {
    if (!challengeTarget) return;
    try {
      const res = await fetch(`https://ambarmishradb.onrender.com/api/challenges/send?sender=${user.name}&receiver=${challengeTarget}&duration=${challengeTime}`, { method: "POST" });
      if (res.ok) {
        alert(`Challenge sent to ${challengeTarget}! Waiting for them to accept.`);
        setChallengeTarget(null);
      }
    } catch (err) { console.error("Failed to send challenge:", err); }
  };



  if (!user) return <div style={styles.container}><h2>Please log in to manage friends!</h2></div>;

  const myFriends = user.friends || [];
  const friendRequests = user.friendRequests || [];
  const sentRequests = user.sentRequests || [];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>👥 Friends & Compete</h1>

      {/* --- MODALS --- */}
      {friendToRemove && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>Remove Friend</h3>
            <p>Remove <strong style={{color: '#ef4444'}}>{friendToRemove}</strong> from friends?</p>
            <div style={styles.modalActions}>
              <button onClick={() => setFriendToRemove(null)} style={styles.cancelBtn}>Cancel</button>
              <button onClick={confirmRemoveFriend} style={styles.confirmRemoveBtn}>Yes, Remove</button>
            </div>
          </div>
        </div>
      )}

      {challengeTarget && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={{ color: '#fbbf24' }}>⚔️ Challenge {challengeTarget}</h3>
            <p>Select match duration:</p>
            <div style={styles.challengeOptions}>
              {[15, 30, 60].map(time => (
                <button 
                  key={time} 
                  onClick={() => setChallengeTime(time)}
                  style={{...styles.timeBtn, background: challengeTime === time ? '#38bdf8' : '#334155', color: challengeTime === time ? '#000' : '#fff'}}
                >
                  {time}s
                </button>
              ))}
            </div>
            <div style={styles.modalActions}>
              <button onClick={() => setChallengeTarget(null)} style={styles.cancelBtn}>Cancel</button>
              <button onClick={sendChallenge} style={styles.sendChallengeBtn}>Send Challenge</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT --- */}
      <div style={styles.grid}>
        
        {/* LEFT COLUMN: Inboxes & Friends */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* CHALLENGE INBOX */}
          {pendingChallenges.length > 0 && (
            <div style={{...styles.card, border: "2px solid #fbbf24"}}>
              <h2 style={{ color: "#fbbf24" }}>⚔️ Match Challenges ({pendingChallenges.length})</h2>
              <div style={styles.list}>
                {pendingChallenges.map((challenge) => (
                  <div key={challenge.id} style={styles.friendRow}>
                    <span style={styles.friendName}>
                      {challenge.senderName} <span style={styles.mutedText}>({challenge.duration}s match)</span>
                    </span>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => handleChallengeResponse(challenge.id, "ACCEPTED")} style={styles.acceptBtn}>✅ Play</button>
                      <button onClick={() => handleChallengeResponse(challenge.id, "DECLINED")} style={styles.rejectBtn}>❌</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FRIEND REQUEST INBOX */}
          {friendRequests.length > 0 && (
            <div style={{...styles.card, border: "2px solid #38bdf8"}}>
              <h2 style={{ color: "#38bdf8" }}>📬 Friend Requests ({friendRequests.length})</h2>
              <div style={styles.list}>
                {friendRequests.map((req, idx) => (
                  <div key={idx} style={styles.friendRow}>
                    <span style={styles.friendName}>👤 {req}</span>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => acceptRequest(req)} style={styles.acceptBtn}>✅</button>
                      <button onClick={() => rejectRequest(req)} style={styles.rejectBtn}>❌</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MY FRIENDS LIST */}
          <div style={styles.card}>
            <h2>My Friends ({myFriends.length})</h2>
            {myFriends.length === 0 ? (
              <p style={styles.mutedText}>You haven't added anyone yet.</p>
            ) : (
              <div style={styles.list}>
                {myFriends.map((friendName, idx) => (
                  <div key={idx} style={styles.friendRow}>
                    <span style={styles.friendName}>👤 {friendName}</span>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => setChallengeTarget(friendName)} style={styles.challengeBtn}>⚔️</button>
                      <button onClick={() => setFriendToRemove(friendName)} style={styles.removeBtn}>🗑️</button>
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
            <input type="text" placeholder="Search username..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={styles.searchInput} />
            <button type="submit" style={styles.searchBtn}>Search</button>
          </form>

          {loading && <p>Searching...</p>}
          {!loading && searchAttempted && searchResults.length === 0 && <p style={{ color: "#ef4444" }}>No users found.</p>}

          <div style={styles.list}>
            {searchResults.map((result, idx) => {
              const isFriend = myFriends.includes(result.name);
              const requestSent = sentRequests.includes(result.name);
              return (
                <div key={idx} style={styles.friendRow}>
                  <span style={styles.friendName}>👤 {result.name}</span>
                  {isFriend ? <span style={styles.mutedText}>Added ✔️</span> 
                  : requestSent ? <span style={{ color: "#fbbf24", fontSize: "0.9rem" }}>Sent ⏳</span> 
                  : <button onClick={() => sendRequest(result.name)} style={styles.addBtn}>+ Add</button>}
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
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" },
  card: { background: "var(--card-bg, #1e293b)", padding: "20px", borderRadius: "12px", border: "1px solid var(--text-muted, #475569)" },
  searchForm: { display: "flex", gap: "10px", marginBottom: "20px" },
  searchInput: { flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #475569", background: "#0f172a", color: "#fff" },
  searchBtn: { padding: "10px 15px", borderRadius: "6px", background: "#38bdf8", color: "#000", border: "none", fontWeight: "bold", cursor: "pointer" },
  list: { display: "flex", flexDirection: "column", gap: "10px", marginTop: "15px" },
  friendRow: { display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.05)", padding: "12px", borderRadius: "8px" },
  friendName: { fontWeight: "bold", fontSize: "1.1rem" },
  addBtn: { background: "#10b981", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
  acceptBtn: { background: "#10b981", color: "#fff", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "1rem", fontWeight: "bold" },
  rejectBtn: { background: "#ef4444", color: "#fff", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "1rem", fontWeight: "bold" },
  challengeBtn: { background: "#fbbf24", color: "#000", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "1rem", fontWeight: "bold" },
  removeBtn: { background: "transparent", color: "#ef4444", border: "1px solid #ef4444", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "1rem" },
  mutedText: { color: "#94a3b8", fontSize: "0.9rem" },
  modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, backdropFilter: "blur(4px)" },
  modalContent: { background: "#1e293b", padding: "30px", borderRadius: "12px", width: "90%", maxWidth: "400px", textAlign: "center", border: "1px solid #475569", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" },
  modalActions: { display: "flex", justifyContent: "center", gap: "15px", marginTop: "25px" },
  cancelBtn: { padding: "10px 20px", borderRadius: "8px", border: "none", background: "#475569", color: "#fff", cursor: "pointer", fontWeight: "bold" },
  confirmRemoveBtn: { padding: "10px 20px", borderRadius: "8px", border: "none", background: "#ef4444", color: "#fff", cursor: "pointer", fontWeight: "bold" },
  sendChallengeBtn: { padding: "10px 20px", borderRadius: "8px", border: "none", background: "#fbbf24", color: "#000", cursor: "pointer", fontWeight: "bold" },
  challengeOptions: { display: "flex", justifyContent: "center", gap: "10px", margin: "20px 0" },
  timeBtn: { padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold", transition: "all 0.2s" }
};