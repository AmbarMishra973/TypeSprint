import React from "react";

function ProfileModal({ user, stats, onClose }) {
  if (!user) return null;

  const displayName = user.name || user.username || "User";
  const email = user.email || "No email provided";
  const initial = displayName.charAt(0).toUpperCase();
  const safeStats = stats || {};

  // Handle the image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        
        // Send to Spring Boot
        fetch("http://localhost:8080/api/auth/update-picture", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            name: user.name, 
            password: user.password, 
            profilePicture: base64Image 
          })
        })
        .then(res => res.json())
        .then(updatedUser => {
          localStorage.setItem("typingUser", JSON.stringify(updatedUser));
          window.location.reload(); // Refresh to see the new image
        })
        .catch(err => console.error("Error uploading image:", err));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2>User Profile 👤</h2>
        
        {/* Avatar & Info */}
        <div style={{ margin: "20px 0", textAlign: "center" }}>
          
          {/* Clickable Avatar wrapped in a label */}
          <label style={{ cursor: "pointer", display: "inline-block" }}>
            <div style={{ 
              width: "80px", height: "80px", borderRadius: "50%", 
              background: "var(--primary-accent)", color: "#000", fontSize: "32px", 
              display: "flex", alignItems: "center", justifyContent: "center", 
              margin: "0 auto 10px auto", fontWeight: "bold", overflow: "hidden",
              border: "2px solid var(--text-muted)",
              transition: "transform 0.2s"
            }}>
              {user.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                initial
              )}
            </div>
            
            {/* Highly visible upload text */}
            <div style={{ color: "var(--primary-accent)", fontSize: "12px", fontWeight: "bold", padding: "5px", background: "rgba(255,255,255,0.05)", borderRadius: "4px" }}>
               📷 Click to Upload Photo
            </div>

            {/* The hidden HTML file input */}
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
          </label>
          
          <h3 style={{ margin: "10px 0 5px 0" }}>{displayName}</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "15px" }}>{email}</p>
        </div>

        {/* Stats Grid */}
        <div style={{ background: "rgba(255,255,255,0.03)", padding: "15px", borderRadius: "8px", marginBottom: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "14px" }}>
          <div><p style={{color: "var(--text-muted)", margin:0}}>Best WPM</p><b>{safeStats.bestWpm || 0}</b></div>
          <div><p style={{color: "var(--text-muted)", margin:0}}>Avg WPM</p><b>{safeStats.averageWpm || 0}</b></div>
          <div><p style={{color: "var(--text-muted)", margin:0}}>Accuracy</p><b>{safeStats.highestAccuracy || 0}%</b></div>
          <div><p style={{color: "var(--text-muted)", margin:0}}>Tests</p><b>{safeStats.totalTests || 0}</b></div>
        </div>

        <button onClick={onClose} className="restart-btn" style={{ width: "100%", padding: "10px", background: 'var(--primary-accent)', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer', borderRadius: "6px" }}>Close</button>
      </div>
    </div>
  );
}

const overlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalStyle = { background: '#181a1b', padding: '30px', borderRadius: '12px', width: '350px', position: 'relative', border: '1px solid var(--text-muted)', textAlign: 'center' };

export default ProfileModal;