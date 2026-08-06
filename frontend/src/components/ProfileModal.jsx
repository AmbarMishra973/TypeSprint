import React from "react";

function ProfileModal({ user, stats, onClose }) {
  // 1. Guard clause: Only fail if there is absolutely no user object
  if (!user) return null;

  // 2. Safe fallbacks: Check for name, then username, then fallback to "User"
  const displayName = user.name || user.username || "User";
  const email = user.email || "No email provided";
  const initial = displayName.charAt(0).toUpperCase();

  // 3. Safe stats fallbacks in case stats hasn't loaded yet
  const safeStats = stats || {};

 return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2>User Profile 👤</h2>
        
       
        {/* Avatar & Info */}
        <div style={{ margin: "20px 0", textAlign: "center" }}>
          <div style={{ 
            width: "70px", height: "70px", borderRadius: "50%", 
            background: "var(--primary-accent)", color: "#000", fontSize: "28px", 
            display: "flex", alignItems: "center", justifyContent: "center", 
            margin: "0 auto 10px auto", fontWeight: "bold" 
          }}>
            {initial}
          </div>
          <h3 style={{ margin: "5px 0" }}>{displayName}</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>{email}</p>
        </div>
        {/* Stats Grid */}
        <div style={{ background: "rgba(255,255,255,0.03)", padding: "15px", borderRadius: "8px", marginBottom: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "14px" }}>
          <div><p style={{color: "var(--text-muted)", margin:0}}>Best WPM</p><b>{safeStats.bestWpm || 0}</b></div>
          <div><p style={{color: "var(--text-muted)", margin:0}}>Avg WPM</p><b>{safeStats.averageWpm || 0}</b></div>
          <div><p style={{color: "var(--text-muted)", margin:0}}>Accuracy</p><b>{safeStats.highestAccuracy || 0}%</b></div>
          <div><p style={{color: "var(--text-muted)", margin:0}}>Tests</p><b>{safeStats.totalTests || 0}</b></div>
        </div>

        <button onClick={onClose} className="restart-btn" style={{ width: "100%", padding: "10px", background: 'var(--primary-accent)', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Close</button>
      </div>
    </div>
  );
}

const overlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalStyle = { background: '#181a1b', padding: '30px', borderRadius: '12px', width: '350px', position: 'relative', border: '1px solid var(--text-muted)', textAlign: 'center' };

export default ProfileModal;