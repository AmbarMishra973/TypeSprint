import { useState } from "react";

function AuthModal({ onClose, onLoginSuccess }) {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    // Create session user object
    const userData = {
      username: username.trim(),
      email: email.trim() || `${username.toLowerCase()}@typingmaster.com`,
      joined: Date.now()
    };

    // Save to localStorage
    localStorage.setItem("typingUser", JSON.stringify(userData));
    
    // Pass user back to Home.jsx and close modal
    onLoginSuccess(userData);
    onClose();
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2>{isSignup ? "Create Account 🚀" : "Welcome Back 👋"}</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "5px" }}>
          {isSignup ? "Sign up to track your typing evolution" : "Log in to access your profile and stats"}
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
          {isSignup && (
            <input 
              type="email" 
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              style={inputStyle} 
            />
          )}
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            style={inputStyle} 
          />
          <button 
            type="submit" 
            className="restart-btn" 
            style={{ background: 'var(--primary-accent)', color: '#000', fontWeight: 'bold', border: 'none', padding: '12px', cursor: 'pointer' }}
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>
        <p 
          style={{ marginTop: "15px", fontSize: "13px", cursor: "pointer", color: "var(--primary-accent)", textAlign: "center" }} 
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? "Already have an account? Login" : "Don't have an account? Sign up"}
        </p>

        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer' }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

const overlayStyle = { 
  position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
  background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', 
  alignItems: 'center', zIndex: 1000 
};

const modalStyle = { 
  background: '#181a1b', padding: '30px', borderRadius: '12px', 
  width: '350px', position: 'relative', border: '1px solid var(--text-muted)' 
};

const inputStyle = { 
  padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--text-muted)', 
  background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '14px' 
};

export default AuthModal;