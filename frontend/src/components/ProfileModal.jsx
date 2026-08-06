function ProfileModal({ user, stats, onClose }) {
  if (!user) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2>User Profile 👤</h2>
        
        {/* Avatar & Info */}
        <div style={{ margin: "20px 0", textAlign: "center" }}>
          <div style={{ width: "70px", height: "70px", borderRadius: "50%", background: "var(--primary-accent)", color: "#000", fontSize: "28px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px auto", fontWeight: "bold" }}>
            {user.username.charAt(0).toUpperCase()}
          </div>
          <h3 style={{ margin: "5px 0" }}>{user.username}</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>{user.email}</p>
          <p style={{ color: "var(--text-muted)", fontSize: "11px", marginTop: "5px" }}>
            Joined: {new Date(user.joined).toLocaleDateString()}
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ background: "rgba(255,255,255,0.03)", padding: "15px", borderRadius: "8px", marginBottom: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "14px" }}>
          <div><p style={{color: "var(--text-muted)", margin:0}}>Best WPM</p><b>{stats.bestWpm || 0}</b></div>
          <div><p style={{color: "var(--text-muted)", margin:0}}>Avg WPM</p><b>{stats.averageWpm || 0}</b></div>
          <div><p style={{color: "var(--text-muted)", margin:0}}>Accuracy</p><b>{stats.highestAccuracy || 0}%</b></div>
          <div><p style={{color: "var(--text-muted)", margin:0}}>Tests</p><b>{stats.totalTests || 0}</b></div>
        </div>

        <button onClick={onClose} className="restart-btn" style={{ width: "100%", padding: "10px" }}>Close</button>
      </div>
    </div>
  );
}

const overlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalStyle = { background: 'var(--card-bg)', padding: '30px', borderRadius: '12px', width: '350px', position: 'relative', border: '1px solid var(--text-muted)', textAlign: 'center' };

export default ProfileModal;