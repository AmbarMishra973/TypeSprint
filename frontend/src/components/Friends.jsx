import React, { useState, useEffect } from "react";
import FriendProfileModal from './FriendProfileModal';
import { 
  Globe, Swords, Mail, User, Check, X, 
  Search, UserPlus, Trash2, Clock, Users 
} from "lucide-react";

export default function Friends({ user, setUser, setActiveView, setActiveChallenge }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);

  // Challenge Inbox State
  const [pendingChallenges, setPendingChallenges] = useState([]);
const [selectedFriendProfile, setSelectedFriendProfile] = useState(null);
  // Modal States
  const [friendToRemove, setFriendToRemove] = useState(null);
  const [challengeTarget, setChallengeTarget] = useState(null);
  const [challengeTime, setChallengeTime] = useState(30);
  const [isSearching, setIsSearching] = useState(false);

  const updateUserState = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("typingUser", JSON.stringify(updatedUser));
  };

  // 🎲 Join Random Matchmaking
  const findQuickMatch = async () => {
    setIsSearching(true);
    try {
      await fetch(`https://ambarmishradb.onrender.com/api/challenges/matchmake/join?username=${user.name}`, { method: "POST" });
    } catch (err) {
      console.error("Matchmaking failed:", err);
      setIsSearching(false);
    }
  };

  // 🛑 Cancel Matchmaking
  const cancelSearch = async () => {
    try {
      await fetch(`https://ambarmishradb.onrender.com/api/challenges/matchmake/leave?username=${user.name}`, { method: "POST" });
      setIsSearching(false);
    } catch (err) { console.error("Failed to leave queue:", err); }
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
    fetchChallenges();
    const interval = setInterval(fetchChallenges, 5000);
    return () => clearInterval(interval);
  }, [user]);

  // 🎮 Accept/Decline Challenge API Call
  const handleChallengeResponse = async (challengeId, status) => {
    try {
      const res = await fetch(`https://ambarmishradb.onrender.com/api/challenges/${challengeId}/status?status=${status}`, { method: "PUT" });
      if (res.ok) {
        setPendingChallenges(prev => prev.filter(c => c.id !== challengeId));
        if (status === "ACCEPTED") {
          console.log("Match accepted! Waiting for global sync...");
        }
      }
    } catch (err) { console.error("Failed to update challenge status:", err); }
  };

  // ⚔️ Send a Challenge to a Friend
  const sendChallenge = async (receiverName, duration = 30) => {
    try {
      const res = await fetch(`https://ambarmishradb.onrender.com/api/challenges/send?sender=${user.name}&receiver=${receiverName}&duration=${duration}`, { method: "POST" });
      if (res.ok) {
        alert(`Challenge sent to ${receiverName}! Waiting for them to accept.`);
        setChallengeTarget(null);
      }
    } catch (err) { 
      console.error("Failed to send challenge:", err); 
    }
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

  if (!user) return <div className="friends-container"><h2 style={{textAlign: 'center', marginTop: '50px', color: 'var(--text-muted)'}}>Please log in to manage friends!</h2></div>;

  const myFriends = user.friends || [];
  const friendRequests = user.friendRequests || [];
  const sentRequests = user.sentRequests || [];

  return (
    <div className="friends-container" style={styles.container}>
      <style>{`
        .action-icon-btn {
          background: var(--bg-secondary);
          border: 1px solid rgba(255,255,255,0.05);
          color: var(--text-muted);
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .action-icon-btn:hover {
          background: rgba(255,255,255,0.1);
          color: var(--text-primary);
        }
        .action-icon-btn.accept:hover { color: #10b981; border-color: #10b981; }
        .action-icon-btn.reject:hover { color: var(--error-color); border-color: var(--error-color); }
        .action-icon-btn.challenge:hover { color: var(--accent-color); border-color: var(--accent-color); }
        
        .global-match-card {
          position: relative;
          overflow: hidden;
        }
        .global-match-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          border-radius: 12px;
          padding: 2px;
          background: linear-gradient(45deg, transparent, var(--accent-color), transparent);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0.5;
        }
      `}</style>

      <h2 style={styles.title}>
        <Users size={32} color="var(--accent-color)" />
        Friends & Compete
      </h2>

      {/* --- MODALS --- */}
      {friendToRemove && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
              <Trash2 color="var(--error-color)" /> Remove Friend
            </h3>
            <p style={{color: 'var(--text-muted)', marginTop: '10px'}}>Remove <strong style={{color: 'var(--text-primary)'}}>{friendToRemove}</strong> from your friends list?</p>
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
            <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--accent-color)' }}>
              <Swords /> Challenge {challengeTarget}
            </h3>
            <p style={{color: 'var(--text-muted)', margin: '15px 0'}}>Select match duration:</p>
            <div style={styles.challengeOptions}>
              {[15, 30, 60].map(time => (
                <button 
                  key={time} 
                  onClick={() => setChallengeTime(time)}
                  style={{
                    ...styles.timeBtn, 
                    background: challengeTime === time ? 'var(--accent-color)' : 'var(--bg-primary)', 
                    color: challengeTime === time ? 'var(--bg-primary)' : 'var(--text-primary)',
                    border: challengeTime === time ? 'none' : '1px solid var(--text-muted)'
                  }}
                >
                  {time}s
                </button>
              ))}
            </div>
            <div style={styles.modalActions}>
              <button onClick={() => setChallengeTarget(null)} style={styles.cancelBtn}>Cancel</button>
              <button onClick={() => sendChallenge(challengeTarget, challengeTime)} style={styles.sendChallengeBtn}>Send Challenge</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT --- */}
      <div style={styles.grid}>
        
        {/* LEFT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          
          {/* 🌍 GLOBAL QUICK MATCH */}
          <div className="global-match-card" style={{...styles.card, textAlign: 'center', background: 'var(--bg-secondary)', padding: '30px 20px'}}>
            <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: "var(--accent-color)", marginTop: 0 }}>
              <Globe size={28} /> Global Matchmaking
            </h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "25px" }}>Play a random 30-second duel against anyone online!</p>
            
            {isSearching ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                <div style={{ color: 'var(--accent-color)', fontSize: '1.2rem', animation: 'pulse 1.5s infinite', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Clock size={20} /> Searching for opponent...
                </div>
                <button onClick={cancelSearch} style={{...styles.cancelBtn, width: '100%'}}>Cancel Search</button>
              </div>
            ) : (
              <button onClick={findQuickMatch} style={styles.quickMatchBtn}>
                <Swords size={20} /> Find Quick Match
              </button>
            )}
          </div>

          {/* CHALLENGE INBOX */}
          {pendingChallenges.length > 0 && (
            <div style={{...styles.card, border: "1px solid var(--accent-color)"}}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: "var(--accent-color)" }}>
                <Swords size={20}/> Match Challenges ({pendingChallenges.length})
              </h2>
              <div style={styles.list}>
                {pendingChallenges.map((challenge) => (
                  <div key={challenge.id} style={styles.friendRow}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={styles.avatarMini}><User size={16}/></div>
                      {/* Replace your old <span style={styles.friendName}> with this clickable version */}
<span 
  style={{...styles.friendName, cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'transparent', transition: 'all 0.2s'}} 
  onMouseEnter={(e) => e.target.style.textDecorationColor = 'var(--accent-color)'}
  onMouseLeave={(e) => e.target.style.textDecorationColor = 'transparent'}
  onClick={() => setSelectedFriendProfile(friendName)}
>
  {friendName}
</span>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => handleChallengeResponse(challenge.id, "ACCEPTED")} className="action-icon-btn accept" title="Accept"><Check size={18}/></button>
                      <button onClick={() => handleChallengeResponse(challenge.id, "DECLINED")} className="action-icon-btn reject" title="Decline"><X size={18}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FRIEND REQUEST INBOX */}
          {friendRequests.length > 0 && (
            <div style={{...styles.card, border: "1px solid var(--accent-color)"}}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: "var(--accent-color)" }}>
                <Mail size={20}/> Friend Requests ({friendRequests.length})
              </h2>
              <div style={styles.list}>
                {friendRequests.map((req, idx) => (
                  <div key={idx} style={styles.friendRow}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={styles.avatarMini}><User size={16}/></div>
                      {/* Replace your old <span style={styles.friendName}> with this clickable version */}
<span 
  style={{...styles.friendName, cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'transparent', transition: 'all 0.2s'}} 
  onMouseEnter={(e) => e.target.style.textDecorationColor = 'var(--accent-color)'}
  onMouseLeave={(e) => e.target.style.textDecorationColor = 'transparent'}
  onClick={() => setSelectedFriendProfile(friendName)}
>
  {friendName}
</span>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => acceptRequest(req)} className="action-icon-btn accept" title="Accept"><Check size={18}/></button>
                      <button onClick={() => rejectRequest(req)} className="action-icon-btn reject" title="Decline"><X size={18}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MY FRIENDS LIST */}
          <div style={styles.card}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}>
              <Users size={20} /> My Friends ({myFriends.length})
            </h2>
            {myFriends.length === 0 ? (
              <p style={styles.emptyStateText}>You haven't added anyone yet.</p>
            ) : (
              <div style={styles.list}>
                {myFriends.map((friendName, idx) => (
                  <div key={idx} style={styles.friendRow}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={styles.avatarMini}><User size={16} /></div>
                      <span 
                        style={{...styles.friendName, cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'transparent', transition: 'all 0.2s'}} 
                        onMouseEnter={(e) => e.target.style.textDecorationColor = 'var(--accent-color)'}
                        onMouseLeave={(e) => e.target.style.textDecorationColor = 'transparent'}
                        onClick={() => setSelectedFriendProfile(friendName)}
                      >
                        {friendName}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => setChallengeTarget(friendName)} className="action-icon-btn challenge" title="Challenge">
                        <Swords size={18} />
                      </button>
                      <button onClick={() => setFriendToRemove(friendName)} className="action-icon-btn reject" title="Remove Friend">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Find Friends */}
        <div style={styles.card}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}>
            <Search size={20} /> Find Friends
          </h2>
          <form onSubmit={handleSearch} style={styles.searchForm}>
            <div style={styles.searchInputWrapper}>
              <Search size={18} color="var(--text-muted)" style={{marginLeft: '12px'}} />
              <input 
                type="text" 
                placeholder="Search username..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                style={styles.searchInput} 
              />
            </div>
            <button type="submit" style={styles.searchBtn}>Search</button>
          </form>

          {loading && <p style={styles.emptyStateText}>Searching...</p>}
          {!loading && searchAttempted && searchResults.length === 0 && <p style={{ color: "var(--error-color)", textAlign: 'center', fontStyle: 'italic' }}>No users found.</p>}

          <div style={styles.list}>
            {searchResults.map((result, idx) => {
              const isFriend = myFriends.includes(result.name);
              const requestSent = sentRequests.includes(result.name);
              return (
                <div key={idx} style={styles.friendRow}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={styles.avatarMini}><User size={16} /></div>
                    <span 
                      style={{...styles.friendName, cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'transparent', transition: 'all 0.2s'}} 
                      onMouseEnter={(e) => e.target.style.textDecorationColor = 'var(--accent-color)'}
                      onMouseLeave={(e) => e.target.style.textDecorationColor = 'transparent'}
                      onClick={() => setSelectedFriendProfile(result.name)}
                    >
                      {result.name}
                    </span>
                  </div>
                  
                  {isFriend ? (
                    <span style={styles.mutedText}><Check size={14} style={{display: 'inline', verticalAlign: 'middle'}}/> Added</span> 
                  ) : requestSent ? (
                    <span style={{ color: "var(--accent-color)", fontSize: "0.9rem" }}>Sent ⏳</span> 
                  ) : (
                    <button onClick={() => sendRequest(result.name)} style={styles.addBtn}>
                      <UserPlus size={16} /> Add
                    </button>
                  )}
                </div>
              );
            })}{/* Show Friend Profile Modal */}
      {selectedFriendProfile && (
        <FriendProfileModal 
          friendName={selectedFriendProfile} 
          onClose={() => setSelectedFriendProfile(null)} 
        />
      )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: "1000px", margin: "0 auto", animation: "fadeIn 0.3s ease", paddingBottom: "40px" },
  title: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', textAlign: "center", marginBottom: "40px", fontSize: "2.2rem", color: 'var(--text-primary)' },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "25px" },
  card: { background: "var(--bg-secondary)", padding: "25px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)", boxShadow: "0 10px 30px rgba(0,0,0,0.15)" },
  
  searchForm: { display: "flex", gap: "10px", marginBottom: "25px", marginTop: "15px" },
  searchInputWrapper: { flex: 1, display: 'flex', alignItems: 'center', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' },
  searchInput: { flex: 1, padding: "12px 10px", background: "transparent", border: "none", color: "var(--text-primary)", outline: "none", fontSize: "1rem" },
  searchBtn: { padding: "0 20px", borderRadius: "8px", background: "var(--accent-color)", color: "var(--bg-primary)", border: "none", fontWeight: "bold", cursor: "pointer", transition: "all 0.2s" },
  
  list: { display: "flex", flexDirection: "column", gap: "12px", marginTop: "15px" },
  friendRow: { display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", padding: "12px 16px", borderRadius: "10px", transition: "all 0.2s ease" },
  friendName: { fontWeight: "bold", fontSize: "1.1rem", color: "var(--text-primary)" },
  avatarMini: { width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' },
  
  addBtn: { display: 'flex', alignItems: 'center', gap: '6px', background: "transparent", color: "var(--text-primary)", border: "1px solid rgba(255,255,255,0.2)", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontWeight: "500", transition: "all 0.2s" },
  quickMatchBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: "16px", fontSize: "1.2rem", fontWeight: "bold", background: "var(--accent-color)", color: "var(--bg-primary)", border: "none", borderRadius: "12px", cursor: "pointer", width: "100%", transition: "transform 0.2s" },
  mutedText: { color: "var(--text-muted)", fontSize: "0.9rem", fontStyle: "italic" },
  emptyStateText: { color: "var(--text-muted)", fontStyle: "italic", textAlign: "center", padding: "20px 0" },

  /* Modals */
  modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.75)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, backdropFilter: "blur(5px)" },
  modalContent: { background: "var(--bg-secondary)", padding: "35px", borderRadius: "16px", width: "90%", maxWidth: "420px", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" },
  modalActions: { display: "flex", justifyContent: "center", gap: "15px", marginTop: "30px" },
  cancelBtn: { padding: "12px 24px", borderRadius: "10px", border: "none", background: "rgba(255,255,255,0.1)", color: "var(--text-primary)", cursor: "pointer", fontWeight: "600", transition: "background 0.2s" },
  confirmRemoveBtn: { padding: "12px 24px", borderRadius: "10px", border: "none", background: "var(--error-color)", color: "#fff", cursor: "pointer", fontWeight: "600" },
  sendChallengeBtn: { padding: "12px 24px", borderRadius: "10px", border: "none", background: "var(--accent-color)", color: "var(--bg-primary)", cursor: "pointer", fontWeight: "600" },
  challengeOptions: { display: "flex", justifyContent: "center", gap: "12px", margin: "20px 0" },
  timeBtn: { padding: "10px 20px", borderRadius: "10px", cursor: "pointer", fontWeight: "bold", transition: "all 0.2s" }
};